<?php

use App\Http\Controllers\BuildingController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Models\Building;
use App\Models\Room;
use App\Models\Transaction;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware(['role:admin,superadmin'])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard', [
                'stats' => [
                    'buildings' => Building::count(),
                    'rooms' => Room::count(),
                    'transactions' => Transaction::count(),
                    'pending_transactions' => Transaction::where('is_booked', 'No')->count(),
                ],
                'recent_transactions' => Transaction::with(['room.building', 'details.user'])
                    ->latest()
                    ->take(5)
                    ->get(),
            ]);
        })->name('dashboard');

        Route::get('buildings', [BuildingController::class, 'index'])->name('buildings');
        Route::get('buildings/create', [BuildingController::class, 'create'])->name('buildings.create');
        Route::post('buildings', [BuildingController::class, 'store'])->name('buildings.store');
        Route::delete('buildings/{building}', [BuildingController::class, 'destroy'])->name('buildings.destroy');
        Route::get('buildings/{building}', [BuildingController::class, 'show'])->name('buildings.show');
        Route::put('buildings/{building}', [BuildingController::class, 'update'])->name('buildings.update');

        Route::get('rooms', [RoomController::class, 'index'])->name('rooms');
        Route::post('rooms', [RoomController::class, 'store'])->name('rooms.store');
        Route::put('rooms/{room}', [RoomController::class, 'update'])->name('rooms.update');
        Route::delete('rooms/{room}', [RoomController::class, 'destroy'])->name('rooms.destroy');

        Route::get('transactions', [TransactionController::class, 'index'])->name('transactions');
        Route::post('transactions', [TransactionController::class, 'store'])->name('transactions.store');
        Route::put('transactions/{transaction}', [TransactionController::class, 'update'])->name('transactions.update');
        Route::put('transactions/{transaction}/approve', [TransactionController::class, 'approve'])->name('transactions.approve');
        Route::delete('transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');

        Route::get('admin/users', [AdminUserController::class, 'index'])->name('admin.users');
        Route::put('admin/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('admin.users.role');
    });
});


require __DIR__ . '/settings.php';
