<?php

namespace Database\Seeders;

use Database\Factories\BuildingFactory;
use Database\Factories\RoomFactory;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        BuildingFactory::new()->count(30)->create();
        RoomFactory::new()->count(100)->create();
        $this->call(AdminUserSeeder::class);
        // User::firstOrCreate(
        //     ['email' => 'test@example.com'],
        //     [
        //         'name' => 'Test User',
        //         'password' => 'password',
        //         'email_verified_at' => now(),
        //     ]
        // );
    }
}
