<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserTransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = Transaction::query()
            ->with(['room.building', 'dataMaster', 'details.user'])
            ->whereHas('details', function ($detailQuery) use ($request) {
                $detailQuery->where('user_id', $request->user()->id);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('transactions/user-index', [
            'data' => $transactions,
        ]);
    }

    public function show(Request $request, Transaction $transaction)
    {
        $ownsTransaction = $transaction->details()
            ->where('user_id', $request->user()->id)
            ->exists();

        if (! $ownsTransaction) {
            abort(403);
        }

        $transaction->load(['room.building', 'dataMaster', 'paymentMethod', 'details.user']);

        $contact = $transaction->dataMaster?->contact ?? '';
        $digits = preg_replace('/\\D+/', '', $contact ?? '');

        $paymentMethod = $transaction->paymentMethod;
        $paymentLabel = $paymentMethod
            ? (($paymentMethod->type === 'va' ? 'VA' : 'Transfer').' - '.$paymentMethod->bank_name)
            : 'VA';
        $paymentNumber = $paymentMethod?->account_number ?: ($transaction->dataMaster?->va_number ?? '-');

        $roomName = $transaction->room?->name ?: '-';
        $buildingName = $transaction->room?->building?->name ?: '-';
        $dateRange = \Carbon\Carbon::parse($transaction->check_in_date)->format('d-m-Y')
            .' s/d '.
            \Carbon\Carbon::parse($transaction->check_out_date)->format('d-m-Y');
        $totalFormatted = 'Rp '.number_format((int) $transaction->total_harga, 0, ',', '.');

        $message = implode("\n", array_filter([
            '*Konfirmasi Pembayaran Pesanan*',
            '',
            'Halo admin, saya *'.($transaction->customer_name ?: '-').'* ingin mengonfirmasi rincian pesanan berikut:',
            '',
            '*ID Transaksi:* #'.$transaction->id,
            '*Fasilitas:* '.$roomName,
            '*Lokasi:* '.$buildingName,
            '*Tanggal Booking:* '.$dateRange,
            '*Total Bayar:* '.$totalFormatted,
            '',
            '*Metode Pembayaran:* '.$paymentLabel,
            '*Nomor VA/Rekening:* '.$paymentNumber,
            $paymentMethod?->account_holder ? '*a.n.:* '.$paymentMethod->account_holder : null,
            '',
            '*Kontak Pemesan*',
            '*No. HP:* '.($transaction->customer_phone ?: '-'),
            '*Alamat:* '.($transaction->customer_address ?: '-'),
            '',
            'Mohon dibantu untuk pengecekan dan konfirmasi. Terima kasih.',
        ]));

        $contactUrl = $digits
            ? 'https://wa.me/'.$digits.'?text='.rawurlencode($message)
            : ($contact ? 'tel:'.$contact : null);

        return Inertia::render('transactions/show', [
            'transaction' => $transaction,
            'contactUrl' => $contactUrl,
        ]);
    }
}
