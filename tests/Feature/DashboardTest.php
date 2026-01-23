<?php

use App\Models\Room;
use App\Models\Transaction;
use App\Models\User;
use Database\Factories\BuildingFactory;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create(['role' => 'admin']));

    $this->get(route('dashboard'))->assertOk();
});

test('role user can not visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create(['role' => 'user']));

    $this->get(route('dashboard'))->assertForbidden();
});

test('dashboard year filter returns yearly income for selected year', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $building = BuildingFactory::new()->create();
    $room = Room::query()->create([
        'name' => 'Ruang Dashboard',
        'price' => 10000,
        'description' => 'Test',
        'building_id' => $building->id,
        'images' => [],
    ]);

    Transaction::factory()->create([
        'room_id' => $room->id,
        'total_harga' => 100_000,
        'created_at' => now()->setYear(2025)->startOfYear(),
        'updated_at' => now()->setYear(2025)->startOfYear(),
    ]);

    Transaction::factory()->create([
        'room_id' => $room->id,
        'total_harga' => 200_000,
        'created_at' => now()->setYear(2026)->startOfYear(),
        'updated_at' => now()->setYear(2026)->startOfYear(),
    ]);

    $this->get(route('dashboard', ['year' => 2025]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('stats.selected_year', 2025)
            ->where('stats.yearly_income', 100_000)
        );
});
