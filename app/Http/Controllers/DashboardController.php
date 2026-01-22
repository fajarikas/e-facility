<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\Room;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'buildings' => Building::count(),
                'rooms' => Room::count(),
                'transactions' => Transaction::count(),
                // 'january_transactions_money' => Transaction::whereMonth('created_at', 1)->sum('total_harga'),
                // 'january_transactions_count' => Transaction::whereMonth('created_at', 1)->count(),
                // month as Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
                'monthly_transaction' => Transaction::selectRaw("
        DATE_FORMAT(created_at, '%b') as month,
        COUNT(*) as rent,
        SUM(total_harga) as income
    ")
                    ->groupBy('month')
                    ->orderByRaw('MIN(created_at)')
                    ->get(),
                'pending_transactions' => Transaction::where('is_booked', 'No')->count(),
            ],
            'recent_transactions' => Transaction::with(['room.building', 'details.user'])
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
}
