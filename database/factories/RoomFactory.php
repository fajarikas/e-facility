<?php

namespace Database\Factories;

use App\Models\Building;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        $baseImage = public_path('images/login/preview.webp');
        if (!file_exists($baseImage)) {
            $baseImage = public_path('images/logo/bpmp.webp');
        }

        $images = [];
        $imageCount = $this->faker->numberBetween(1, 4);
        $imageContents = file_exists($baseImage) ? file_get_contents($baseImage) : null;

        for ($i = 0; $i < $imageCount; $i++) {
            $filename = 'room_images/' . Str::uuid() . '.webp';
            if ($imageContents) {
                Storage::disk('public')->put($filename, $imageContents);
                $images[] = $filename;
            }
        }

        return [
            'name' => $this->faker->country(),
            'price' => $this->faker->numberBetween(100000, 2000000),
            'description' => $this->faker->sentence(30, true),
            'building_id' => Building::inRandomOrder()->value('id'),
            'images' => $images,
        ];
    }
}
