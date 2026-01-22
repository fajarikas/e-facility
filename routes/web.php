<?php

use App\Http\Controllers\BuildingController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\FacilityLikeController;
use App\Http\Controllers\FacilityOrderController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserTransactionController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\DataMasterController as AdminDataMasterController;
use App\Http\Controllers\Admin\PaymentMethodController as AdminPaymentMethodController;
use App\Http\Controllers\Admin\BuildingImportController as AdminBuildingImportController;
use App\Http\Controllers\Admin\RoomImportController as AdminRoomImportController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\WelcomeController;
use App\Models\Building;
use App\Models\Room;
use App\Models\Transaction;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Route::get('/', function () {
//     return Inertia::render('welcome', [
//         'canRegister' => Features::enabled(Features::registration()),
//     ]);
// })->name('home');
Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::middleware('guest')->group(function () {
    Route::get('auth/{provider}/redirect', [SocialAuthController::class, 'redirect'])->name('social.redirect');
    Route::get('auth/{provider}/callback', [SocialAuthController::class, 'callback'])->name('social.callback');
});

Route::middleware(['auth', 'role:user'])->group(function () {
    Route::get('facilities', [FacilityController::class, 'index'])->name('facilities.index');
    Route::get('facilities/bookmarks', [FacilityController::class, 'bookmarks'])->name('facilities.bookmarks');
    Route::get('facilities/{room}', [FacilityController::class, 'show'])->name('facilities.show');
    Route::post('facilities/{room}/like', [FacilityLikeController::class, 'toggle'])->name('facilities.like');
    Route::post('facilities/{room}/order', [FacilityOrderController::class, 'store'])->name('facilities.order');

    Route::get('my-transactions', [UserTransactionController::class, 'index'])->name('user.transactions.index');
    Route::get('my-transactions/{transaction}', [UserTransactionController::class, 'show'])->name('user.transactions.show');
    Route::post('my-transactions/{transaction}/cancel', [UserTransactionController::class, 'cancel'])->name('user.transactions.cancel');
});

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
        Route::post('buildings/import', [AdminBuildingImportController::class, 'store'])->name('buildings.import');
        Route::get('buildings/create', [BuildingController::class, 'create'])->name('buildings.create');
        Route::post('buildings', [BuildingController::class, 'store'])->name('buildings.store');
        Route::delete('buildings/{building}', [BuildingController::class, 'destroy'])->name('buildings.destroy');
        Route::get('buildings/{building}', [BuildingController::class, 'show'])->name('buildings.show');
        Route::put('buildings/{building}', [BuildingController::class, 'update'])->name('buildings.update');

        Route::get('rooms', [RoomController::class, 'index'])->name('rooms');
        Route::post('rooms/import', [AdminRoomImportController::class, 'store'])->name('rooms.import');
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

        Route::get('admin/data-masters', [AdminDataMasterController::class, 'index'])->name('admin.data-masters');
        Route::post('admin/data-masters', [AdminDataMasterController::class, 'store'])->name('admin.data-masters.store');
        Route::put('admin/data-masters/{dataMaster}', [AdminDataMasterController::class, 'update'])->name('admin.data-masters.update');
        Route::delete('admin/data-masters/{dataMaster}', [AdminDataMasterController::class, 'destroy'])->name('admin.data-masters.destroy');

        Route::get('admin/payment-methods', [AdminPaymentMethodController::class, 'index'])->name('admin.payment-methods');
        Route::post('admin/payment-methods', [AdminPaymentMethodController::class, 'store'])->name('admin.payment-methods.store');
        Route::put('admin/payment-methods/{paymentMethod}', [AdminPaymentMethodController::class, 'update'])->name('admin.payment-methods.update');
        Route::delete('admin/payment-methods/{paymentMethod}', [AdminPaymentMethodController::class, 'destroy'])->name('admin.payment-methods.destroy');
    });
});


require __DIR__ . '/settings.php';
