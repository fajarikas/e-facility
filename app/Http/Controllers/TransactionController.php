<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Transaction;
use App\Models\Transaction_Detail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Transaction::expirePending();

        $transactions = Transaction::with(['room.building', 'details.user', 'dataMaster', 'paymentMethod'])
            ->latest()
            ->paginate(10);
        $rooms = Room::with('building')->orderBy('name')->get();
        $users = User::orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('transactions/index', [
            'data' => $transactions,
            'rooms' => $rooms,
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after_or_equal:check_in_date',
            'total_harga' => 'required|integer|min:0',
            'room_id' => 'required|integer|exists:rooms,id',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        DB::transaction(function () use ($validatedData) {
            $transaction = Transaction::create([
                'check_in_date' => $validatedData['check_in_date'],
                'check_out_date' => $validatedData['check_out_date'],
                'total_harga' => $validatedData['total_harga'],
                'room_id' => $validatedData['room_id'],
                'is_booked' => 'No',
            ]);

            Transaction_Detail::create([
                'transaction_date' => now()->toDateString(),
                'transaction_id' => $transaction->id,
                'user_id' => $validatedData['user_id'],
            ]);
        });

        return redirect()->route('transactions')->with('success', 'Transaksi berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        Transaction::expirePending();

        $validatedData = $request->validate([
            'is_booked' => 'required|in:Yes,No',
        ]);

        $transaction->update($validatedData);

        return redirect()->route('transactions')->with('success', 'Status transaksi diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        $transaction->delete();

        return redirect()->route('transactions')->with('success', 'Transaksi berhasil dihapus.');
    }

    public function approve(Transaction $transaction)
    {
        Transaction::expirePending();

        if (in_array($transaction->status, ['cancelled', 'expired'], true)) {
            return redirect()->route('transactions')->with('success', 'Transaksi tidak bisa di-approve karena sudah dibatalkan/kadaluarsa.');
        }

        $transaction->update([
            'is_booked' => 'Yes',
            'status' => 'booked',
        ]);

        return redirect()->route('transactions')->with('success', 'Transaksi disetujui.');
    }
}
