<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\Room;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $requestedYear = $request->query('year');

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
                'buildings' => Building::count(),
                'rooms' => Room::count(),
                'total_income' => (int) Transaction::sum('total_harga'),
                'count_transactions' => Transaction::groupBy('status')->selectRaw('status, COUNT(*) as count')->get(),
                'transactions' => Transaction::count(),
                'selected_year' => $selectedYear,
                'yearly_income' => (int) $yearlyIncomeQuery->sum('total_harga'),
                // 'january_transactions_money' => Transaction::whereMonth('created_at', 1)->sum('total_harga'),
                // 'january_transactions_count' => Transaction::whereMonth('created_at', 1)->count(),
                'monthly_transaction' => $monthlyTransaction,
                'pending_transactions' => Transaction::where('is_booked', 'No')->count(),
            ],
            'recent_transactions' => Transaction::with(['room.building', 'details.user'])
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
}
