<?php

use App\Models\Building;
use App\Models\Room;
use App\Models\Transaction;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('facility show includes blocked dates for active bookings only', function () {
    $this->actingAs(User::factory()->create(['role' => 'user']));

    $building = Building::factory()->create();
    $room = Room::factory()->create(['building_id' => $building->id]);

    $bookedStart = now()->startOfDay()->addDays(1);
    $bookedEnd = $bookedStart->copy()->addDay();

    Transaction::factory()->create([
        'room_id' => $room->id,
        'status' => 'booked',
        'is_booked' => 'Yes',
        'check_in_date' => $bookedStart->toDateString(),
        'check_out_date' => $bookedEnd->toDateString(),
    ]);

    $pendingStart = now()->startOfDay()->addDays(4);
    $pendingEnd = $pendingStart->copy()->addDay();

    Transaction::factory()->create([
        'room_id' => $room->id,
        'status' => 'pending_payment',
        'is_booked' => 'No',
        'expires_at' => now()->addMinutes(10),
        'check_in_date' => $pendingStart->toDateString(),
        'check_out_date' => $pendingEnd->toDateString(),
    ]);

    $expiredDate = now()->startOfDay()->addDays(6);

    Transaction::factory()->create([
        'room_id' => $room->id,
        'status' => 'pending_payment',
        'is_booked' => 'No',
        'expires_at' => now()->subMinute(),
        'check_in_date' => $expiredDate->toDateString(),
        'check_out_date' => $expiredDate->toDateString(),
    ]);

    $pastStart = now()->startOfDay()->subDays(3);
    $pastEnd = $pastStart->copy()->addDay();

    Transaction::factory()->create([
        'room_id' => $room->id,
        'status' => 'booked',
        'is_booked' => 'Yes',
        'check_in_date' => $pastStart->toDateString(),
        'check_out_date' => $pastEnd->toDateString(),
    ]);

    $this->get(route('facilities.show', $room))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('facilities/show')
            ->where('blockedDates', function ($value) use ($bookedStart, $bookedEnd, $pendingStart, $pendingEnd, $expiredDate, $pastStart) {
                $dates = collect($value);

                return $dates->contains($bookedStart->toDateString())
                    && $dates->contains($bookedEnd->toDateString())
                    && $dates->contains($pendingStart->toDateString())
                    && $dates->contains($pendingEnd->toDateString())
                    && ! $dates->contains($expiredDate->toDateString())
                    && ! $dates->contains($pastStart->toDateString());
            })
        );
});
