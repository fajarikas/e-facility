<?php

use App\Models\Room;
use App\Models\Transaction;
use App\Models\Transaction_Detail;
use App\Models\User;
use Database\Factories\BuildingFactory;
use Inertia\Testing\AssertableInertia as Assert;

test('user can view their transaction list', function () {
    $user = User::factory()->withoutTwoFactor()->create();
    $otherUser = User::factory()->withoutTwoFactor()->create();

    $building = BuildingFactory::new()->create();
    $room = Room::query()->create([
        'name' => 'Ruang 1',
        'price' => 10000,
        'capacity_count' => 10,
        'toilet_count' => 1,
        'area' => 20,
        'description' => 'Test',
        'building_id' => $building->id,
        'images' => [],
    ]);

    $mine = Transaction::query()->create([
        'check_in_date' => now()->toDateString(),
        'check_out_date' => now()->toDateString(),
        'total_harga' => 10000,
        'is_booked' => 'No',
        'room_id' => $room->id,
        'customer_name' => 'Saya',
        'customer_phone' => '08123',
        'customer_address' => 'Alamat',
    ]);
    Transaction_Detail::query()->create([
        'transaction_date' => now()->toDateString(),
        'transaction_id' => $mine->id,
        'user_id' => $user->id,
    ]);

    $others = Transaction::query()->create([
        'check_in_date' => now()->toDateString(),
        'check_out_date' => now()->toDateString(),
        'total_harga' => 10000,
        'is_booked' => 'No',
        'room_id' => $room->id,
        'customer_name' => 'Orang lain',
        'customer_phone' => '08999',
        'customer_address' => 'Alamat',
    ]);
    Transaction_Detail::query()->create([
        'transaction_date' => now()->toDateString(),
        'transaction_id' => $others->id,
        'user_id' => $otherUser->id,
    ]);

    $this->actingAs($user)
        ->get(route('user.transactions.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('transactions/user-index')
            ->where('data.data.0.id', $mine->id)
        );
});

test('user can not view another users transaction', function () {
    $user = User::factory()->withoutTwoFactor()->create();
    $otherUser = User::factory()->withoutTwoFactor()->create();

    $building = BuildingFactory::new()->create();
    $room = Room::query()->create([
        'name' => 'Ruang 2',
        'price' => 10000,
        'capacity_count' => 10,
        'toilet_count' => 1,
        'area' => 20,
        'description' => 'Test',
        'building_id' => $building->id,
        'images' => [],
    ]);

    $transaction = Transaction::query()->create([
        'check_in_date' => now()->toDateString(),
        'check_out_date' => now()->toDateString(),
        'total_harga' => 10000,
        'is_booked' => 'No',
        'room_id' => $room->id,
        'customer_name' => 'Orang lain',
        'customer_phone' => '08999',
        'customer_address' => 'Alamat',
    ]);
    Transaction_Detail::query()->create([
        'transaction_date' => now()->toDateString(),
        'transaction_id' => $transaction->id,
        'user_id' => $otherUser->id,
    ]);

    $this->actingAs($user)
        ->get(route('user.transactions.show', $transaction))
        ->assertForbidden();
});
