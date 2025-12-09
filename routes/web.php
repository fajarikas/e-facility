<?php

use App\Http\Controllers\BuildingController;
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
});


require __DIR__ . '/settings.php';
