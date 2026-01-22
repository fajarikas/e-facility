<?php

use App\Models\Building;
use App\Models\DataMaster;
use App\Models\Room;
use App\Models\Transaction;
use Carbon\Carbon;
use Database\Seeders\Transaction2025Seeder;

test('transaction 2025 seeder creates varied monthly counts', function () {
    $building = Building::factory()->create();
    Room::factory()->create([
        'building_id' => $building->id,
        'price' => 100_000,
    ]);

    DataMaster::query()->create([
        'name' => 'Demo',
        'contact' => '081234567890',
        'va_number' => '8808123456789',
    ]);

    $this->seed(Transaction2025Seeder::class);

    $expectedCounts = [
        1 => 10,
        2 => 15,
        3 => 48,
        4 => 22,
        5 => 31,
        6 => 27,
        7 => 55,
        8 => 40,
        9 => 18,
        10 => 64,
        11 => 12,
        12 => 25,
    ];

    $countsByMonth = [];

    foreach (range(1, 12) as $month) {
        $start = Carbon::create(2025, $month, 1)->startOfDay();
        $end = Carbon::create(2025, $month, 1)->endOfMonth()->endOfDay();

        $countsByMonth[$month] = Transaction::query()
            ->whereBetween('created_at', [$start, $end])
            ->count();
    }

    expect($countsByMonth)->toEqual($expectedCounts);
});
