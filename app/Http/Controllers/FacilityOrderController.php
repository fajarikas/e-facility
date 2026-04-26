<?php

namespace App\Http\Controllers;

use App\Models\DataMaster;
use App\Models\Room;
use App\Models\Transaction;
use App\Models\Transaction_Detail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;

class FacilityOrderController extends Controller
{
    public function store(Request $request, Room $room): \Illuminate\Http\RedirectResponse
    {
        Transaction::expirePending();

        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:50'],
            'customer_address' => ['required', 'string', 'max:1000'],
            'check_in_date' => ['required', 'date_format:Y-m-d'],
            'check_out_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:check_in_date'],
        ]);

        $checkIn = \Carbon\Carbon::createFromFormat('Y-m-d', $validated['check_in_date'])->startOfDay();
        $checkOut = \Carbon\Carbon::createFromFormat('Y-m-d', $validated['check_out_date'])->startOfDay();

        $days = $checkIn->diffInDays($checkOut) + 1;
        $totalHarga = (int) $room->price * $days;

        $overlapsBooked = $room->transactions()
            ->whereIn('status', ['pending_payment', 'booked'])
            ->where(function ($q) {
                $q->where('status', 'booked')
                    ->orWhere(function ($q2) {
                        $q2->where('status', 'pending_payment')->where('expires_at', '>', now());
                    });
            })
            ->whereDate('check_in_date', '<=', $checkOut->toDateString())
            ->whereDate('check_out_date', '>=', $checkIn->toDateString())
            ->exists();

        if ($overlapsBooked) {
            throw ValidationException::withMessages([
                'check_in_date' => 'Tanggal tersebut sudah dibooking. Silakan pilih tanggal lain.',
            ]);
        }

        $dataMaster = DataMaster::query()->latest()->first();
        if (! $dataMaster) {
            return Redirect::back()->withErrors([
                'data_master' => 'Kontak admin belum diatur. Hubungi admin.',
            ]);
        }

        $transactionId = DB::transaction(function () use ($validated, $request, $room, $totalHarga, $dataMaster) {
            $transaction = Transaction::create([
                'check_in_date' => $validated['check_in_date'],
                'check_out_date' => $validated['check_out_date'],
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'customer_address' => $validated['customer_address'],
                'status' => 'pending_payment',
                'expires_at' => now()->addMinutes(15),
                'total_harga' => $totalHarga,
                'room_id' => $room->id,
                'is_booked' => 'No',
                'data_master_id' => $dataMaster->id,
                'payment_method_id' => null,
            ]);

            Transaction_Detail::create([
                'transaction_date' => now()->toDateString(),
                'transaction_id' => $transaction->id,
                'user_id' => $request->user()->id,
            ]);

            return $transaction->id;
        });

        return Redirect::route('user.transactions.show', $transactionId)
            ->with('success', 'Pesanan berhasil dibuat. Silakan konfirmasi ke admin via WhatsApp.');
    }
}
