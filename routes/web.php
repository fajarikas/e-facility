<?php

use App\Http\Controllers\BuildingController;
use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::get('buildings', [BuildingController::class, 'index'])->name('buildings');
    Route::get('buildings/create', [BuildingController::class, 'create'])->name('buildings.create');
    Route::post('buildings', [BuildingController::class, 'store'])->name('buildings.store');
    Route::delete('buildings/{building}', [BuildingController::class, 'destroy'])->name('buildings.destroy');
    Route::get('buildings/{building}', [BuildingController::class, 'show'])->name('buildings.show');
    Route::put('buildings/{building}', [BuildingController::class, 'update'])->name('buildings.update');

    Route::get('rooms', [RoomController::class, 'index'])->name('rooms');
});


require __DIR__ . '/settings.php';
