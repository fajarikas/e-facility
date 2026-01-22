<?php

namespace Database\Seeders;

use App\Models\Building;
use Illuminate\Database\Seeder;

class BuildingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $buildings = [
            [
                'id' => 1,
                'name' => 'Gedung Depati Barin',
                'address' => 'Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
            ],
            [
                'id' => 2,
                'name' => 'Ruang Kelas Gedung Depati Barin',
                'address' => 'Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
            ],
            [
                'id' => 3,
                'name' => 'Mess Singgah',
                'address' => 'Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
            ],
            [
                'id' => 4,
                'name' => 'Mess',
                'address' => 'Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
            ],
            [
                'id' => 5,
                'name' => 'Gedung Mayor Syafrie Rahman',
                'address' => 'Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
            ],
            [
                'id' => 6,
                'name' => 'Gedung Lempah Kuning',
                'address' => 'Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
            ],
            [
                'id' => 7,
                'name' => 'Asrama',
                'address' => 'Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
            ],
        ];

        foreach ($buildings as $building) {
            $desiredId = (int) $building['id'];
            $name = $building['name'];
            $address = $building['address'];

            $byId = Building::query()->find($desiredId);
            if ($byId) {
                $byId->name = $name;
                $byId->address = $address;
                $byId->save();
                continue;
            }

            $byName = Building::query()->where('name', $name)->first();
            if ($byName) {
                $byName->address = $address;
                $byName->save();

                if ($this->command && $byName->id !== $desiredId) {
                    $this->command->warn("Building '{$name}' exists with id={$byName->id}, expected id={$desiredId}. Using existing id.");
                }
                continue;
            }

            $new = new Building();
            $new->id = $desiredId;
            $new->name = $name;
            $new->address = $address;
            $new->save();
        }
    }
}
