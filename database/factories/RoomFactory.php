<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->country(),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'capacity_count' => $this->faker->numberBetween(1, 20),
            'toilet_count' => $this->faker->numberBetween(1, 3),
            'area' => $this->faker->numberBetween(50, 100),
            'description' => $this->faker->sentence(30, true),
            'building_id' => $this->faker->numberBetween(1, 30)
        ];
    }
}
