<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\Room;
use App\Models\Transaction;
use App\Support\TransactionCalendar;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        Transaction::expirePending();

        $requestedYear = $request->query('year');
        $requestedCalendarMonth = $request->query('calendar_month');

        $calendarMonthDate = now()->startOfMonth();
        if (is_string($requestedCalendarMonth) && preg_match('/^\d{4}-\d{2}$/', $requestedCalendarMonth) === 1) {
            $calendarMonthDate = Carbon::createFromFormat('Y-m', $requestedCalendarMonth)->startOfMonth();
        }

        $latestCreatedAt = Transaction::query()->max('created_at');
        $latestYear = $latestCreatedAt ? Carbon::parse($latestCreatedAt)->year : null;

        $selectedYear = match (true) {
            $requestedYear === 'all' => 'all',
            is_numeric($requestedYear) => (int) $requestedYear,
            $latestYear !== null => (int) $latestYear,
            default => (int) now()->year,
        };

        $yearlyIncomeQuery = Transaction::query();
        if ($selectedYear !== 'all') {
            $yearlyIncomeQuery->whereYear('created_at', $selectedYear);
        }

        $yearScopedTransactions = Transaction::query();
        if ($selectedYear !== 'all') {
            $yearScopedTransactions->whereYear('created_at', $selectedYear);
        }

        $countTransactions = $yearScopedTransactions
            ->clone()
            ->selectRaw("COALESCE(status, 'unknown') as status, COUNT(*) as count")
            ->groupBy('status')
            ->orderBy('status')
            ->get()
            ->map(fn ($row) => [
                'status' => (string) $row->status,
                'count' => (int) $row->count,
            ]);

        $today = today();
        $monthStart = now()->startOfMonth();

        $revenueToday = Transaction::query()
            ->whereDate('created_at', $today)
            ->sum('total_harga');

        $revenueMonthToDate = Transaction::query()
            ->whereBetween('created_at', [$monthStart, now()])
            ->sum('total_harga');

        $transactionsYearCount = (int) $yearScopedTransactions->clone()->count();

        $pendingPaymentCount = (int) Transaction::query()
            ->when($selectedYear !== 'all', fn ($query) => $query->whereYear('created_at', $selectedYear))
            ->where('status', 'pending_payment')
            ->count();

        $expiredCount = (int) Transaction::query()
            ->when($selectedYear !== 'all', fn ($query) => $query->whereYear('created_at', $selectedYear))
            ->where('status', 'expired')
            ->count();

        $cancelledCount = (int) Transaction::query()
            ->when($selectedYear !== 'all', fn ($query) => $query->whereYear('created_at', $selectedYear))
            ->where('status', 'cancelled')
            ->count();

        $bookedCount = (int) Transaction::query()
            ->when($selectedYear !== 'all', fn ($query) => $query->whereYear('created_at', $selectedYear))
            ->where('status', 'booked')
            ->count();

        $checkInsToday = (int) Transaction::query()
            ->whereDate('check_in_date', $today)
            ->where('status', 'booked')
            ->count();

        $checkOutsToday = (int) Transaction::query()
            ->whereDate('check_out_date', $today)
            ->where('status', 'booked')
            ->count();

        $activeBookingsToday = (int) Transaction::query()
            ->where('status', 'booked')
            ->whereDate('check_in_date', '<=', $today)
            ->whereDate('check_out_date', '>=', $today)
            ->count();

        $upcomingCheckIns7Days = (int) Transaction::query()
            ->where('status', 'booked')
            ->whereBetween('check_in_date', [$today, $today->clone()->addDays(7)])
            ->count();

        $averageTransactionValueYear = (int) round((float) $yearScopedTransactions->clone()->avg('total_harga'));

        $topRoomRows = Transaction::query()
            ->when($selectedYear !== 'all', fn ($query) => $query->whereYear('created_at', $selectedYear))
            ->where('status', 'booked')
            ->selectRaw('room_id, COUNT(*) as transactions, SUM(total_harga) as income')
            ->groupBy('room_id')
            ->orderByDesc('income')
            ->limit(5)
            ->get();

        $topRoomsByIncomeRooms = Room::query()
            ->with('building')
            ->whereIn('id', $topRoomRows->pluck('room_id'))
            ->get()
            ->keyBy('id');

        $topRoomsByIncome = $topRoomRows
            ->map(fn ($row) => [
                'room_id' => (int) $row->room_id,
                'room_name' => (string) ($topRoomsByIncomeRooms[(int) $row->room_id]?->name ?? '—'),
                'building_name' => (string) ($topRoomsByIncomeRooms[(int) $row->room_id]?->building?->name ?? '—'),
                'transactions' => (int) $row->transactions,
                'income' => (int) $row->income,
            ]);

        $topBuildingsByIncome = Transaction::query()
            ->when($selectedYear !== 'all', fn ($query) => $query->whereYear('transactions.created_at', $selectedYear))
            ->where('transactions.status', 'booked')
            ->join('rooms', 'transactions.room_id', '=', 'rooms.id')
            ->join('buildings', 'rooms.building_id', '=', 'buildings.id')
            ->selectRaw('buildings.id as building_id, buildings.name as building_name, COUNT(transactions.id) as transactions, SUM(transactions.total_harga) as income')
            ->groupBy('buildings.id', 'buildings.name')
            ->orderByDesc('income')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'building_id' => (int) $row->building_id,
                'building_name' => (string) $row->building_name,
                'transactions' => (int) $row->transactions,
                'income' => (int) $row->income,
            ]);

        $driver = Transaction::query()->getConnection()->getDriverName();
        $yearExpression = $driver === 'sqlite'
            ? "CAST(strftime('%Y', created_at) as integer)"
            : 'YEAR(created_at)';

        $monthExpression = $driver === 'sqlite'
            ? "CAST(strftime('%m', created_at) as integer)"
            : 'MONTH(created_at)';

        $monthlyTransaction = Transaction::query()
            ->selectRaw("
                {$yearExpression} as year,
                {$monthExpression} as month_number,
                COUNT(*) as rent,
                SUM(total_harga) as income
            ")
            ->groupBy('year', 'month_number')
            ->orderBy('year')
            ->orderBy('month_number')
            ->get()
            ->map(fn ($row) => [
                'year' => (int) $row->year,
                'month' => Carbon::create()->month((int) $row->month_number)->format('M'),
                'rent' => (int) $row->rent,
                'income' => (int) $row->income,
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'generated_at' => now()->toIso8601String(),
                'buildings' => Building::count(),
                'rooms' => Room::count(),
                'total_income' => (int) Transaction::sum('total_harga'),
                'count_transactions' => Transaction::groupBy('status')->selectRaw('status, COUNT(*) as count')->get(),
                'transactions' => Transaction::count(),
                'selected_year' => $selectedYear,
                'yearly_income' => (int) $yearlyIncomeQuery->sum('total_harga'),
                'revenue_today' => (int) $revenueToday,
                'revenue_month_to_date' => (int) $revenueMonthToDate,
                'transactions_year_count' => $transactionsYearCount,
                'average_transaction_value_year' => $averageTransactionValueYear,
                'booked_count' => $bookedCount,
                'pending_payment_count' => $pendingPaymentCount,
                'expired_count' => $expiredCount,
                'cancelled_count' => $cancelledCount,
                'check_ins_today' => $checkInsToday,
                'check_outs_today' => $checkOutsToday,
                'active_bookings_today' => $activeBookingsToday,
                'upcoming_check_ins_7_days' => $upcomingCheckIns7Days,
                'top_rooms_by_income' => $topRoomsByIncome,
                'top_buildings_by_income' => $topBuildingsByIncome,
                // 'january_transactions_money' => Transaction::whereMonth('created_at', 1)->sum('total_harga'),
                // 'january_transactions_count' => Transaction::whereMonth('created_at', 1)->count(),
                'monthly_transaction' => $monthlyTransaction,
                'pending_transactions' => Transaction::where('is_booked', 'No')->count(),
                'count_transactions' => $countTransactions,
            ],
            'calendar' => TransactionCalendar::forMonth($calendarMonthDate),
            'recent_transactions' => Transaction::with(['room.building', 'details.user'])
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
}
