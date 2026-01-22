<?php

namespace Database\Seeders;

use App\Models\Building;
use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call(BuildingSeeder::class);

        $buildingAddresses = [
            'Gedung Depati Barin' => 'Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
            'Ruang Kelas Gedung Depati Barin' => 'Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
            'Mess Singgah' => 'Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
            'Mess' => 'Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
            'Gedung Mayor Syafrie Rahman' => 'Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
            'Gedung Lempah Kuning' => 'Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
            'Asrama' => 'Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
        ];

        $rooms = [
            [
                'id' => 3,
                'name' => 'Aula Lama',
                'price' => 2200000,
                'building_name' => 'Gedung Depati Barin',
                'description' => 'Jenis BMN : Bangunan Gedung Pertemuan Permanen Luas yang di sewa (m2): 338 Harga perhari (8 Jam) Alamat : Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729718985.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729718996.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719006.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719013.jpg',
            ],
            [
                'id' => 4,
                'name' => 'Aula Baru',
                'price' => 3950000,
                'building_name' => 'Gedung Depati Barin',
                'description' => 'Jenis BMN : Bangunan Gedung Pertemuan Permanen Luas yang di sewa (m2): 527 Harga perhari (8 Jam) Alamat : Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719027.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719032.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719043.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719051.jpg',
            ],
            [
                'id' => 5,
                'name' => 'Ruang Kelas 1',
                'price' => 220000,
                'building_name' => 'Ruang Kelas Gedung Depati Barin',
                'description' => 'Jenis BMN : Bangunan Gedung Pertemuan Permanen Luas yang di sewa (m2): 36 Harga perhari (8 Jam) Alamat : Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719161.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719170.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719178.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719185.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719196.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719202.jpg',
            ],
            [
                'id' => 6,
                'name' => 'Ruang Kelas 2',
                'price' => 220000,
                'building_name' => 'Ruang Kelas Gedung Depati Barin',
                'description' => 'Jenis BMN : Bangunan Gedung Pertemuan Permanen Luas yang di sewa (m2): 36 Harga perhari (8 Jam) Alamat : Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719297.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719304.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719309.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719316.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719329.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719335.jpg',
            ],
            [
                'id' => 7,
                'name' => 'Ruang Kelas 3',
                'price' => 220000,
                'building_name' => 'Ruang Kelas Gedung Depati Barin',
                'description' => 'Jenis BMN : Bangunan Gedung Pertemuan Permanen Luas yang di sewa (m2): 36 Harga perhari (8 Jam) Alamat : Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719416.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719421.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719426.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719432.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719443.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719450.jpg',
            ],
            [
                'id' => 8,
                'name' => 'Mess Singgah',
                'price' => 605000,
                'building_name' => 'Mess Singgah',
                'description' => 'Informasi Asrama/Gedung/Mess Jenis BMN : Mess / Wiswa / Bungalow / Tempat Peristirahatan Permanen Luas yang di sewa (m2): 283 Harga perhari (8 Jam) Alamat : Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung Untuk pembatalan pemesanan fasilitas dapat menghubungi WA Layanan: 08117176160',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719583.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719594.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719600.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719608.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719613.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719620.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719625.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729721931.jpg',
            ],
            [
                'id' => 9,
                'name' => 'Mess 1 Rukam',
                'price' => 310000,
                'building_name' => 'Mess',
                'description' => 'Jenis BMN : Mess / Wiswa / Bungalow / Tempat Peristirahatan Permanen Luas yang di sewa (m2): 110 Harga per kamar / malam',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1732671160.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1732671225.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1732671235.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1732671245.jpg',
            ],
            [
                'id' => 10,
                'name' => 'Mess 5 Riden',
                'price' => 310000,
                'building_name' => 'Mess',
                'description' => 'Jenis BMN : Mess / Wiswa / Bungalow / Tempat Peristirahatan Permanen Luas yang di sewa (m2): 108 Harga per kamar / malam',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1732671305.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1732671393.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1732671402.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1732671415.jpg',
            ],
            [
                'id' => 11,
                'name' => 'Kelas 1',
                'price' => 365000,
                'building_name' => 'Gedung Mayor Syafrie Rahman',
                'description' => 'Jenis BMN : Bangunan Gedung Pendidikan Permanen Luas yang di sewa (m2): 70 Harga perhari (8 Jam)',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719974.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719980.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719994.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729719999.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720118.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720129.jpg',
            ],
            [
                'id' => 12,
                'name' => 'Kelas 2',
                'price' => 365000,
                'building_name' => 'Gedung Mayor Syafrie Rahman',
                'description' => 'Jenis BMN : Bangunan Gedung Pendidikan Permanen Luas yang di sewa (m2): 70 Harga perhari (8 Jam)',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720081.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720087.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720100.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720110.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720139.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720144.jpg',
            ],
            [
                'id' => 13,
                'name' => 'Kelas 3',
                'price' => 365000,
                'building_name' => 'Gedung Mayor Syafrie Rahman',
                'description' => 'Jenis BMN : Bangunan Gedung Pendidikan Permanen Luas yang di sewa (m2): 70 Harga perhari (8 Jam)',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720211.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720218.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720230.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720238.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720245.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720251.jpg',
            ],
            [
                'id' => 14,
                'name' => 'Kelas 4',
                'price' => 365000,
                'building_name' => 'Gedung Mayor Syafrie Rahman',
                'description' => 'Jenis BMN : Bangunan Gedung Pendidikan Permanen Luas yang di sewa (m2): 70 Harga perhari (8 Jam)',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720355.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720362.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720376.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720384.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720394.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720400.jpg',
            ],
            [
                'id' => 15,
                'name' => 'Ruang Makan',
                'price' => 1685000,
                'building_name' => 'Gedung Lempah Kuning',
                'description' => 'Jenis BMN : Bangunan Gedung Tempat Kerja Lainnya Permanen Luas yang di sewa (m2): 300 Harga perhari (8 Jam)',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720509.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1729720514.jpg',
            ],
            [
                'id' => 16,
                'name' => 'Asrama Pulau Ketawai',
                'price' => 245000,
                'building_name' => 'Asrama',
                'description' => 'Jenis BMN : Asrama Permanen Luas yang di sewa (m2): 21 Harga per kamar / malam Alamat : Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1735806263.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1735806272.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1735806281.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1735806290.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1735806297.jpg',
            ],
            [
                'id' => 17,
                'name' => 'Asrama Pulau Lepar',
                'price' => 245000,
                'building_name' => 'Asrama',
                'description' => 'Jenis BMN : Asrama Permanen Luas yang di sewa (m2): 21 Harga per kamar / malam Alamat : Jl. Pulau Bangka, Kel. Kebintik, Kec. Pangkalan Baru, Kab Bangka Tengah. Prov. Kep. Bangka Belitung',
                'images' => 'https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1735806349.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1735806361.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1735806373.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1735806382.jpg; https://bpmpbabel.kemendikdasmen.go.id/fasilitas/assets/images/nama_kamar_gambar1735806393.jpg',
            ],
        ];

        $buildingIdsByName = Building::query()
            ->whereIn('name', array_keys($buildingAddresses))
            ->pluck('id', 'name');

        foreach ($rooms as $room) {
            $buildingName = $room['building_name'];
            $buildingId = $buildingIdsByName[$buildingName] ?? null;

            if (! $buildingId) {
                $buildingId = Building::updateOrCreate(
                    ['name' => $buildingName],
                    ['address' => $buildingAddresses[$buildingName] ?? ''],
                )->id;

                $buildingIdsByName[$buildingName] = $buildingId;
            }

            $images = preg_split('/\s*;\s*/', (string) $room['images']);
            $images = array_values(array_filter(array_map('trim', $images)));

            $desiredId = (int) $room['id'];

            $payload = [
                'name' => $room['name'],
                'price' => (int) $room['price'],
                'description' => $room['description'],
                'building_id' => $buildingId,
                'images' => $images,
            ];

            $byId = Room::query()->find($desiredId);
            if ($byId) {
                $byId->fill($payload);
                $byId->save();
                continue;
            }

            $existing = Room::query()
                ->where('name', $room['name'])
                ->where('building_id', $buildingId)
                ->first();
            if ($existing) {
                $existing->fill($payload);
                $existing->save();
                continue;
            }

            $new = new Room();
            $new->id = $desiredId;
            $new->fill($payload);

            try {
                $new->save();
            } catch (\Throwable $e) {
                $this->command?->warn("Room '{$room['name']}' could not use id={$desiredId} (already taken). Creating without forcing id.");
                Room::create($payload);
            }
        }
    }
}
