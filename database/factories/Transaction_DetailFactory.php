<?php

namespace Database\Factories;

use App\Models\Transaction_Detail;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction_Detail>
 */
class Transaction_DetailFactory extends Factory
{
    protected $model = Transaction_Detail::class;

    public function definition(): array
    {
        return [
            'transaction_date' => now()->toDateString(),
            'transaction_id' => null,
            'user_id' => null,
        ];
    }
}

