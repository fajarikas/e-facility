<?php

namespace Database\Seeders;

use App\Models\DataMaster;
use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class DataMasterSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $dataMaster = DataMaster::firstOrCreate(
            ['va_number' => '8808123456789'],
            [
                'name' => 'BPMP BABEL',
                'contact' => '0812-3456-7890',
            ],
        );

        PaymentMethod::firstOrCreate(
            [
                'data_master_id' => $dataMaster->id,
                'type' => 'va',
                'bank_name' => 'BRI',
                'account_number' => $dataMaster->va_number,
            ],
            [
                'account_holder' => $dataMaster->name,
                'is_active' => true,
            ],
        );

        PaymentMethod::firstOrCreate(
            [
                'data_master_id' => $dataMaster->id,
                'type' => 'va',
                'bank_name' => 'Mandiri',
                'account_number' => '8888123456789',
            ],
            [
                'account_holder' => $dataMaster->name,
                'is_active' => true,
            ],
        );

        PaymentMethod::firstOrCreate(
            [
                'data_master_id' => $dataMaster->id,
                'type' => 'va',
                'bank_name' => 'BNI',
                'account_number' => '8811123456789',
            ],
            [
                'account_holder' => $dataMaster->name,
                'is_active' => true,
            ],
        );

        PaymentMethod::firstOrCreate(
            [
                'data_master_id' => $dataMaster->id,
                'type' => 'bank_transfer',
                'bank_name' => 'BCA',
                'account_number' => '1234567890',
            ],
            [
                'account_holder' => $dataMaster->name,
                'is_active' => true,
            ],
        );
    }
}
