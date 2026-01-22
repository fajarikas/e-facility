<?php

namespace Database\Seeders;

use App\Models\DataMaster;
use App\Models\PaymentMethod;
use App\Models\Room;
use App\Models\Transaction;
use App\Models\Transaction_Detail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class Transaction2025Seeder extends Seeder
{
    /**
     * Seed transactions for year 2025 (dashboard/demo).
     *
     * Assumptions:
     * - Rooms already exist (will use first 15 by ID).
     * - Users already exist; if none, will create some role=user.
     * - DataMaster + PaymentMethods should exist; if not, seeder will skip.
     */
    public function run(): void
    {
        $rooms = Room::query()->orderBy('id')->limit(15)->get();
        if ($rooms->isEmpty()) {
            $this->command?->warn('Transaction2025Seeder skipped: no rooms found.');
            return;
        }

        $users = User::query()->where('role', 'user')->get();
        if ($users->isEmpty()) {
            $users = User::factory()
                ->withoutTwoFactor()
                ->count(20)
                ->create([
                    'role' => 'user',
                    'email_verified_at' => now(),
                ]);
        }

        $dataMasterId = DataMaster::query()->value('id');
        if (! $dataMasterId) {
            $this->command?->warn('Transaction2025Seeder skipped: no data_masters found.');
            return;
        }

        $activePaymentMethods = PaymentMethod::query()
            ->where('is_active', true)
            ->get();

        $statusPool = [
            'booked',
            'booked',
            'booked',
            'booked',
            'pending_payment',
            'pending_payment',
            'cancelled',
            'expired',
        ];

        foreach (range(1, 12) as $month) {
            $count = 80;

            foreach (range(1, $count) as $i) {
                $room = $rooms->random();
                $user = $users->random();

                $checkIn = Carbon::create(2025, $month, rand(1, 25))->startOfDay();
                $checkOut = (clone $checkIn)->addDays(rand(0, 3));
                if ($checkOut->month !== $month) {
                    $checkOut = (clone $checkIn)->endOfMonth()->startOfDay();
                }

                $days = $checkIn->diffInDays($checkOut) + 1;
                $totalHarga = (int) $room->price * $days;

                $createdAt = Carbon::create(
                    2025,
                    $month,
                    rand(1, 28),
                    rand(0, 23),
                    rand(0, 59),
                    rand(0, 59),
                );

                $status = $statusPool[array_rand($statusPool)];
                $expiresAt = null;
                if (in_array($status, ['pending_payment', 'expired'], true)) {
                    $expiresAt = (clone $createdAt)->addMinutes(15);
                }

                $paymentMethod = $activePaymentMethods->isNotEmpty()
                    ? $activePaymentMethods->random()
                    : null;

                $transaction = Transaction::create([
                    'check_in_date' => $checkIn->toDateString(),
                    'check_out_date' => $checkOut->toDateString(),
                    'customer_name' => fake()->name(),
                    'customer_phone' => fake()->phoneNumber(),
                    'customer_address' => fake()->address(),
                    'status' => $status,
                    'expires_at' => $expiresAt,
                    'total_harga' => $totalHarga,
                    'is_booked' => $status === 'booked' ? 'Yes' : 'No',
                    'room_id' => $room->id,
                    'data_master_id' => $paymentMethod?->data_master_id ?? $dataMasterId,
                    'payment_method_id' => $paymentMethod?->id,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);

                Transaction_Detail::create([
                    'transaction_date' => $createdAt->toDateString(),
                    'transaction_id' => $transaction->id,
                    'user_id' => $user->id,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);
            }
        }
    }
}

