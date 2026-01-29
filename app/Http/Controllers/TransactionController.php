<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Transaction;
use App\Models\Transaction_Detail;
use App\Models\User;
use App\Support\TransactionCalendar;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Transaction::expirePending();

        $requestedCalendarMonth = request()->query('calendar_month');
        $search = trim((string) $request->query('search', ''));
        $status = trim((string) $request->query('status', ''));
        $customerName = trim((string) $request->query('customer_name', ''));
        $customerPhone = trim((string) $request->query('customer_phone', ''));
        $customerAddress = trim((string) $request->query('customer_address', ''));
        $roomName = trim((string) $request->query('room', ''));
        $buildingName = trim((string) $request->query('building', ''));

        $calendarMonthDate = now()->startOfMonth();
        if (is_string($requestedCalendarMonth) && preg_match('/^\d{4}-\d{2}$/', $requestedCalendarMonth) === 1) {
            $calendarMonthDate = Carbon::createFromFormat('Y-m', $requestedCalendarMonth)->startOfMonth();
        }

        $transactions = Transaction::query()
            ->with(['room.building', 'details.user', 'dataMaster', 'paymentMethod'])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('customer_name', 'like', "%{$search}%")
                        ->orWhere('customer_phone', 'like', "%{$search}%")
                        ->orWhere('customer_address', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhereHas('room', function ($query) use ($search): void {
                            $query->where('name', 'like', "%{$search}%")
                                ->orWhereHas('building', function ($query) use ($search): void {
                                    $query->where('name', 'like', "%{$search}%");
                                });
                        })
                        ->orWhereHas('details.user', function ($query) use ($search): void {
                            $query->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($customerName !== '', function ($query) use ($customerName): void {
                $query->where(function ($query) use ($customerName): void {
                    $query->where('customer_name', 'like', "%{$customerName}%")
                        ->orWhereHas('details.user', function ($query) use ($customerName): void {
                            $query->where('name', 'like', "%{$customerName}%")
                                ->orWhere('email', 'like', "%{$customerName}%");
                        });
                });
            })
            ->when($customerPhone !== '', function ($query) use ($customerPhone): void {
                $query->where('customer_phone', 'like', "%{$customerPhone}%");
            })
            ->when($customerAddress !== '', function ($query) use ($customerAddress): void {
                $query->where('customer_address', 'like', "%{$customerAddress}%");
            })
            ->when($roomName !== '', function ($query) use ($roomName): void {
                $query->whereHas('room', function ($query) use ($roomName): void {
                    $query->where('name', 'like', "%{$roomName}%");
                });
            })
            ->when($buildingName !== '', function ($query) use ($buildingName): void {
                $query->whereHas('room.building', function ($query) use ($buildingName): void {
                    $query->where('name', 'like', "%{$buildingName}%");
                });
            })
            ->when($status !== '', function ($query) use ($status): void {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();
        $rooms = Room::with('building')->orderBy('name')->get();
        $users = User::orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('transactions/index', [
            'data' => $transactions,
            'rooms' => $rooms,
            'users' => $users,
            'calendar' => TransactionCalendar::forMonth($calendarMonthDate),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'customer_name' => $customerName,
                'customer_phone' => $customerPhone,
                'customer_address' => $customerAddress,
                'room' => $roomName,
                'building' => $buildingName,
            ],
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
