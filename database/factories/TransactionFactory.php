<?php

namespace Database\Factories;

use App\Models\DataMaster;
use App\Models\PaymentMethod;
use App\Models\Building;
use App\Models\Room;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        $room = Room::query()->inRandomOrder()->first();
        if (! $room) {
            $building = Building::factory()->create();
            $room = Room::factory()->create(['building_id' => $building->id]);
        }

        $roomId = $room->id;
        $dataMasterId = DataMaster::query()->inRandomOrder()->value('id');

        $paymentMethodId = null;
        if ($dataMasterId) {
            $paymentMethodId = PaymentMethod::query()
                ->where('data_master_id', $dataMasterId)
                ->where('is_active', true)
                ->inRandomOrder()
                ->value('id');
        }

        $status = $this->faker->randomElement([
            'pending_payment',
            'pending_payment',
            'pending_payment',
            'booked',
            'booked',
            'cancelled',
            'expired',
        ]);

        $checkIn = $this->faker->dateTimeBetween('-10 days', '+10 days');
        $checkOut = (clone $checkIn);
        $checkOut->modify('+'.$this->faker->numberBetween(0, 3).' days');

        $expiresAt = null;
        if ($status === 'pending_payment') {
            $expiresAt = now()->addMinutes($this->faker->numberBetween(1, 15));
        } elseif ($status === 'expired') {
            $expiresAt = now()->subMinutes($this->faker->numberBetween(1, 120));
        }

        return [
            'check_in_date' => $checkIn->format('Y-m-d'),
            'check_out_date' => $checkOut->format('Y-m-d'),
            'customer_name' => $this->faker->name(),
            'customer_phone' => $this->faker->phoneNumber(),
            'customer_address' => $this->faker->address(),
            'status' => $status,
            'expires_at' => $expiresAt,
            'total_harga' => $this->faker->numberBetween(100000, 3000000),
            'is_booked' => $status === 'booked' ? 'Yes' : 'No',
            'room_id' => $roomId,
            'data_master_id' => $dataMasterId,
            'payment_method_id' => $paymentMethodId,
        ];
    }
}
