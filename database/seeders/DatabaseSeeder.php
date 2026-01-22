<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            DataMasterSeeder::class,
            BuildingSeeder::class,
            RoomSeeder::class,
            Transaction2025Seeder::class,
        ]);
    }
}
