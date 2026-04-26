<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserTransactionController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        Transaction::expirePending();

        $transactions = Transaction::query()
            ->with(['room.building', 'dataMaster', 'paymentMethod', 'details.user'])
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

    public function show(Request $request, Transaction $transaction): \Inertia\Response
    {
        Transaction::expirePending();

        $ownsTransaction = $transaction->details()
            ->where('user_id', $request->user()->id)
            ->exists();

        if (! $ownsTransaction) {
            abort(403);
        }

        $transaction->load(['room.building', 'dataMaster', 'details.user']);

        $contact = $transaction->dataMaster?->contact ?? '';
        $digits = preg_replace('/\\D+/', '', $contact ?? '');

        $roomName = $transaction->room?->name ?: '-';
        $buildingName = $transaction->room?->building?->name ?: '-';
        $dateRange = \Carbon\Carbon::parse($transaction->check_in_date)->format('d-m-Y')
            .' s/d '.
            \Carbon\Carbon::parse($transaction->check_out_date)->format('d-m-Y');
        $totalFormatted = 'Rp '.number_format((int) $transaction->total_harga, 0, ',', '.');

        $message = implode("\n", array_filter([
            '*Konfirmasi Booking Fasilitas*',
            '',
            'Halo admin, saya *'.($transaction->customer_name ?: '-').'* ingin mengonfirmasi rincian booking berikut:',
            '',
            '*ID Transaksi:* #'.$transaction->id,
            '*Fasilitas:* '.$roomName,
            '*Lokasi:* '.$buildingName,
            '*Tanggal Booking:* '.$dateRange,
            '*Total Bayar:* '.$totalFormatted,
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

    public function cancel(Request $request, Transaction $transaction): \Illuminate\Http\RedirectResponse
    {
        Transaction::expirePending();

        $ownsTransaction = $transaction->details()
            ->where('user_id', $request->user()->id)
            ->exists();

        if (! $ownsTransaction) {
            abort(403);
        }

        if ($transaction->status !== 'pending_payment') {
            return redirect()
                ->route('user.transactions.show', $transaction)
                ->withErrors(['status' => 'Transaksi tidak bisa dibatalkan.']);
        }

        if ($transaction->expires_at && $transaction->expires_at->isPast()) {
            $transaction->update([
                'status' => 'expired',
                'is_booked' => 'No',
            ]);

            return redirect()
                ->route('user.transactions.show', $transaction)
                ->withErrors(['status' => 'Transaksi sudah kadaluarsa.']);
        }

        $transaction->update([
            'status' => 'cancelled',
            'is_booked' => 'No',
        ]);

        return redirect()
            ->route('user.transactions.index')
            ->with('success', 'Transaksi berhasil dibatalkan.');
    }
}
