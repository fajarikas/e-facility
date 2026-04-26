<?php

use App\Models\Building;
use App\Models\DataMaster;
use App\Models\Room;
use App\Models\Transaction;
use App\Models\User;

test('user can create facility order without choosing payment method', function () {
    $user = User::factory()->withoutTwoFactor()->create(['role' => 'user']);
    $building = Building::factory()->create();
    $room = Room::query()->create([
        'name' => 'Ruang Meeting',
        'price' => 100000,
        'description' => 'Test',
        'building_id' => $building->id,
        'images' => [],
    ]);
    DataMaster::query()->create([
        'name' => 'Admin BPMP',
        'contact' => '081234567890',
        'va_number' => '1234567890',
    ]);

    $response = $this->actingAs($user)->post(route('facilities.order', $room), [
        'customer_name' => 'Farid Ammar',
        'customer_phone' => '081234567890',
        'customer_address' => 'Pangkalpinang',
        'check_in_date' => now()->addDay()->toDateString(),
        'check_out_date' => now()->addDays(2)->toDateString(),
    ]);

    $transaction = Transaction::query()->first();

    $response
        ->assertRedirect(route('user.transactions.show', $transaction))
        ->assertSessionHas('success', 'Pesanan berhasil dibuat. Silakan konfirmasi ke admin via WhatsApp.');

    expect($transaction)->not->toBeNull();
    expect($transaction?->payment_method_id)->toBeNull();
});
