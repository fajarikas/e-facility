<?php

use App\Models\Building;
use App\Models\DataMaster;
use App\Models\Room;
use App\Models\Transaction;
use App\Models\Transaction_Detail;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('user can view their transaction list', function () {
    $user = User::factory()->withoutTwoFactor()->create(['role' => 'user']);
    $otherUser = User::factory()->withoutTwoFactor()->create(['role' => 'user']);

    $building = \App\Models\Building::factory()->create();
    $room = Room::query()->create([
        'name' => 'Ruang 1',
        'price' => 10000,
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
    $user = User::factory()->withoutTwoFactor()->create(['role' => 'user']);
    $otherUser = User::factory()->withoutTwoFactor()->create(['role' => 'user']);

    $building = \App\Models\Building::factory()->create();
    $room = Room::query()->create([
        'name' => 'Ruang 2',
        'price' => 10000,
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

test('user transaction whatsapp message does not include payment method details', function () {
    $user = User::factory()->withoutTwoFactor()->create(['role' => 'user']);
    $building = Building::factory()->create(['name' => 'Gedung Utama']);
    $dataMaster = DataMaster::query()->create([
        'name' => 'Admin BPMP',
        'contact' => '0812-3456-7890',
        'va_number' => '1234567890',
    ]);
    $room = Room::query()->create([
        'name' => 'Aula Serbaguna',
        'price' => 150000,
        'description' => 'Test',
        'building_id' => $building->id,
        'images' => [],
    ]);

    $transaction = Transaction::query()->create([
        'check_in_date' => '2026-05-01',
        'check_out_date' => '2026-05-02',
        'total_harga' => 300000,
        'is_booked' => 'No',
        'status' => 'pending_payment',
        'room_id' => $room->id,
        'data_master_id' => $dataMaster->id,
        'customer_name' => 'Farid',
        'customer_phone' => '08123',
        'customer_address' => 'Pangkalpinang',
    ]);
    Transaction_Detail::query()->create([
        'transaction_date' => now()->toDateString(),
        'transaction_id' => $transaction->id,
        'user_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->get(route('user.transactions.show', $transaction))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('transactions/show')
            ->where('contactUrl', function (?string $value) {
                if (! is_string($value)) {
                    return false;
                }

                $decoded = rawurldecode($value);

                return str_contains($decoded, 'Konfirmasi Booking Fasilitas')
                    && str_contains($decoded, 'Aula Serbaguna')
                    && ! str_contains($decoded, 'Metode Pembayaran')
                    && ! str_contains($decoded, 'Nomor VA/Rekening');
            })
        );
});
