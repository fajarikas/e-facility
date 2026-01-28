<?php

use App\Models\Building;
use App\Models\Room;
use App\Models\Transaction;
use App\Models\Transaction_Detail;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('role user can not visit the dashboard calendar', function () {
    $this->actingAs(User::factory()->create(['role' => 'user']));

    $this->get(route('dashboard'))->assertForbidden();
});

test('admin can see bookings on the dashboard calendar for a month', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $booker = User::factory()->create(['role' => 'user']);

    $building = Building::factory()->create();
    $room = Room::factory()->create(['building_id' => $building->id]);

    $booked = Transaction::factory()->create([
        'room_id' => $room->id,
        'status' => 'booked',
        'is_booked' => 'Yes',
        'check_in_date' => '2026-01-05',
        'check_out_date' => '2026-01-07',
        'customer_name' => null,
    ]);

    Transaction_Detail::query()->create([
        'transaction_date' => now()->toDateString(),
        'transaction_id' => $booked->id,
        'user_id' => $booker->id,
    ]);

    $expired = Transaction::factory()->create([
        'room_id' => $room->id,
        'status' => 'pending_payment',
        'expires_at' => now()->subMinute(),
        'check_in_date' => '2026-01-10',
        'check_out_date' => '2026-01-10',
    ]);

    Transaction_Detail::query()->create([
        'transaction_date' => now()->toDateString(),
        'transaction_id' => $expired->id,
        'user_id' => $booker->id,
    ]);

    $this->get(route('dashboard', ['calendar_month' => '2026-01']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('calendar.month', '2026-01')
            ->where('calendar.counts_by_date', function ($value) {
                return (int) ($value['2026-01-05']['total'] ?? 0) === 1
                    && (int) ($value['2026-01-06']['total'] ?? 0) === 1
                    && (int) ($value['2026-01-07']['total'] ?? 0) === 1
                    && (($value['2026-01-10'] ?? null) === null)
                    && (int) (($value['2026-01-05']['booked'] ?? 0)) === 1
                    && (int) (($value['2026-01-05']['pending'] ?? 0)) === 0;
            })
            ->where('calendar.bookings_by_date', function ($value) use ($booked) {
                $jan5 = $value['2026-01-05'][0] ?? [];

                return (int) ($jan5['id'] ?? 0) === $booked->id
                    && ($jan5['status'] ?? null) === 'booked'
                    && ($jan5['check_in_date'] ?? null) === '2026-01-05'
                    && ($jan5['check_out_date'] ?? null) === '2026-01-07'
                    && ($jan5['booked_by'] ?? null) !== null;
            })
        );
});

test('admin can see bookings on the transactions calendar section for a month', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $booker = User::factory()->create(['role' => 'user']);

    $building = Building::factory()->create();
    $room = Room::factory()->create(['building_id' => $building->id]);

    $booked = Transaction::factory()->create([
        'room_id' => $room->id,
        'status' => 'booked',
        'is_booked' => 'Yes',
        'check_in_date' => '2026-01-05',
        'check_out_date' => '2026-01-07',
        'customer_name' => null,
    ]);

    Transaction_Detail::query()->create([
        'transaction_date' => now()->toDateString(),
        'transaction_id' => $booked->id,
        'user_id' => $booker->id,
    ]);

    $this->get(route('transactions', ['calendar_month' => '2026-01']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('transactions/index')
            ->where('calendar.month', '2026-01')
            ->where('calendar.counts_by_date', function ($value) {
                return (int) ($value['2026-01-05']['total'] ?? 0) === 1
                    && (int) ($value['2026-01-06']['total'] ?? 0) === 1
                    && (int) ($value['2026-01-07']['total'] ?? 0) === 1;
            })
        );
});
