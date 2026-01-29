<?php

use App\Models\Building;
use App\Models\Room;
use App\Models\Transaction;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('allows admins to open management pages', function (string $routeName, string $component) {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    'buildings' => ['buildings', 'buildings/index'],
    'rooms' => ['rooms', 'rooms/index'],
    'transactions' => ['transactions', 'transactions/index'],
    'admin-users' => ['admin.users', 'admin/users/index'],
]);

it('filters buildings by search keyword', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    Building::factory()->create(['name' => 'Gedung Alpha']);
    Building::factory()->create(['name' => 'Gedung Beta']);

    $this->get(route('buildings', ['search' => 'Alpha']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('buildings/index')
            ->has('data.data', 1)
            ->where('data.data.0.name', 'Gedung Alpha')
        );
});

it('filters rooms by search keyword', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $building = Building::factory()->create(['name' => 'Menara Alpha']);
    $otherBuilding = Building::factory()->create(['name' => 'Menara Beta']);

    Room::query()->create([
        'name' => 'Ruang Mawar',
        'price' => 120000,
        'description' => 'Ruangan serbaguna',
        'building_id' => $building->id,
        'images' => [],
    ]);

    Room::query()->create([
        'name' => 'Ruang Melati',
        'price' => 150000,
        'description' => 'Ruangan rapat',
        'building_id' => $otherBuilding->id,
        'images' => [],
    ]);

    $this->get(route('rooms', ['search' => 'Alpha']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('rooms/index')
            ->has('data.data', 1)
            ->where('data.data.0.name', 'Ruang Mawar')
        );
});

it('filters transactions by search keyword', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $building = Building::factory()->create(['name' => 'Gedung Booking']);
    $room = Room::query()->create([
        'name' => 'Ruang Cendana',
        'price' => 175000,
        'description' => 'Ruangan untuk acara',
        'building_id' => $building->id,
        'images' => [],
    ]);

    Transaction::factory()->create([
        'customer_name' => 'Susi Wijaya',
        'room_id' => $room->id,
        'data_master_id' => null,
        'payment_method_id' => null,
    ]);

    Transaction::factory()->create([
        'customer_name' => 'Budi Santoso',
        'room_id' => $room->id,
        'data_master_id' => null,
        'payment_method_id' => null,
    ]);

    $this->get(route('transactions', ['search' => 'Susi']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('transactions/index')
            ->has('data.data', 1)
            ->where('data.data.0.customer_name', 'Susi Wijaya')
        );
});

it('filters transactions by status', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $building = Building::factory()->create(['name' => 'Gedung Status']);
    $room = Room::query()->create([
        'name' => 'Ruang Status',
        'price' => 200000,
        'description' => 'Ruangan status',
        'building_id' => $building->id,
        'images' => [],
    ]);

    Transaction::factory()->create([
        'status' => 'booked',
        'is_booked' => 'Yes',
        'room_id' => $room->id,
        'data_master_id' => null,
        'payment_method_id' => null,
    ]);

    Transaction::factory()->create([
        'status' => 'cancelled',
        'is_booked' => 'No',
        'room_id' => $room->id,
        'data_master_id' => null,
        'payment_method_id' => null,
    ]);

    $this->get(route('transactions', ['status' => 'booked']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('transactions/index')
            ->has('data.data', 1)
            ->where('data.data.0.status', 'booked')
        );
});

it('filters transactions by customer phone', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $building = Building::factory()->create(['name' => 'Gedung Filter']);
    $room = Room::query()->create([
        'name' => 'Ruang Filter',
        'price' => 150000,
        'description' => 'Ruangan filter',
        'building_id' => $building->id,
        'images' => [],
    ]);

    Transaction::factory()->create([
        'customer_phone' => '081234567890',
        'room_id' => $room->id,
        'data_master_id' => null,
        'payment_method_id' => null,
    ]);

    Transaction::factory()->create([
        'customer_phone' => '089999999999',
        'room_id' => $room->id,
        'data_master_id' => null,
        'payment_method_id' => null,
    ]);

    $this->get(route('transactions', ['customer_phone' => '081234']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('transactions/index')
            ->has('data.data', 1)
            ->where('data.data.0.customer_phone', '081234567890')
        );
});

it('filters transactions by booking user name', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $bookingUser = User::factory()->create([
        'name' => 'Pemesan Baru',
        'email' => 'pemesan@example.com',
    ]);

    $building = Building::factory()->create();
    $room = Room::query()->create([
        'name' => 'Ruang Pemesan',
        'price' => 120000,
        'description' => 'Ruangan pemesan',
        'building_id' => $building->id,
        'images' => [],
    ]);

    $transaction = Transaction::factory()->create([
        'customer_name' => null,
        'room_id' => $room->id,
        'data_master_id' => null,
        'payment_method_id' => null,
    ]);

    \App\Models\Transaction_Detail::factory()->create([
        'transaction_id' => $transaction->id,
        'user_id' => $bookingUser->id,
    ]);

    $this->get(route('transactions', ['customer_name' => 'Pemesan Baru']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('transactions/index')
            ->has('data.data', 1)
        );
});

it('filters admin users by search keyword', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    User::factory()->create([
        'name' => 'Siti Aisyah',
        'email' => 'siti@example.com',
        'role' => 'user',
    ]);

    User::factory()->create([
        'name' => 'Bambang',
        'email' => 'bambang@example.com',
        'role' => 'user',
    ]);

    $this->get(route('admin.users', ['search' => 'Siti']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/index')
            ->has('data.data', 1)
            ->where('data.data.0.email', 'siti@example.com')
        );
});
