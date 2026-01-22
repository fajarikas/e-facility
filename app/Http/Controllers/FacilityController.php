<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\UserRoomLike;
use App\Models\DataMaster;
use App\Models\PaymentMethod;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacilityController extends Controller
{
    public function index(Request $request)
    {
        Transaction::expirePending();

        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $search = isset($validated['q']) ? trim($validated['q']) : null;
        $date = $validated['date'] ?? null;

        $query = Room::query()->with('building');

        if ($search) {
            $searchLower = mb_strtolower($search, 'UTF-8');
            $isPostgres = $request->user()->getConnection()->getDriverName() === 'pgsql';

            $query->where(function ($subQuery) use ($isPostgres, $search, $searchLower) {
                if ($isPostgres) {
                    $subQuery
                        ->where('name', 'ilike', "%{$search}%")
                        ->orWhereHas('building', function ($buildingQuery) use ($search) {
                            $buildingQuery->where('name', 'ilike', "%{$search}%");
                        });

                    return;
                }

                $subQuery
                    ->whereRaw('LOWER(name) LIKE ?', ["%{$searchLower}%"])
                    ->orWhereHas('building', function ($buildingQuery) use ($searchLower) {
                        $buildingQuery->whereRaw('LOWER(name) LIKE ?', ["%{$searchLower}%"]);
                    });
            });
        }

        $dateToCheck = $date ?: now()->toDateString();

        $rooms = $query
            ->with([
                'transactions' => function ($transactionQuery) use ($dateToCheck) {
                    $transactionQuery
                        ->whereDate('check_in_date', '<=', $dateToCheck)
                        ->whereDate('check_out_date', '>=', $dateToCheck)
                        ->where(function ($q) {
                            $q->where('status', 'booked')
                                ->orWhere(function ($q2) {
                                    $q2->where('status', 'pending_payment')->where('expires_at', '>', now());
                                });
                        })
                        ->latest();
                },
            ])
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $likedRoomIds = UserRoomLike::query()
            ->where('user_id', $request->user()->id)
            ->pluck('room_id')
            ->values();

        $availabilityByRoomId = [];
        foreach ($rooms->items() as $room) {
            $status = 'available';
            $tx = $room->transactions->first();
            if ($tx) {
                $status = $tx->status === 'booked' ? 'booked' : 'pending_payment';
            }
            $availabilityByRoomId[$room->id] = $status;
        }

        return Inertia::render('facilities/index', [
            'data' => $rooms,
            'filters' => [
                'q' => $search ?? '',
                'date' => $date ?? '',
            ],
            'likedRoomIds' => $likedRoomIds,
            'availabilityDate' => $date,
            'availabilityByRoomId' => $availabilityByRoomId,
        ]);
    }

    public function bookmarks(Request $request)
    {
        $likedRoomIds = UserRoomLike::query()
            ->where('user_id', $request->user()->id)
            ->pluck('room_id')
            ->values();

        $rooms = Room::query()
            ->with('building')
            ->whereIn('id', $likedRoomIds)
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('facilities/bookmarks', [
            'data' => $rooms,
            'likedRoomIds' => $likedRoomIds,
        ]);
    }

    public function show(Request $request, Room $room)
    {
        $room->load('building');

        $isLiked = UserRoomLike::query()
            ->where('user_id', $request->user()->id)
            ->where('room_id', $room->id)
            ->exists();

        $dataMaster = DataMaster::query()->latest()->first();
        $paymentMethods = $dataMaster
            ? PaymentMethod::query()
                ->where('data_master_id', $dataMaster->id)
                ->where('is_active', true)
                ->orderBy('type')
                ->orderBy('bank_name')
                ->get()
            : collect();

        return Inertia::render('facilities/show', [
            'room' => $room,
            'isLiked' => $isLiked,
            'dataMaster' => $dataMaster,
            'paymentMethods' => $paymentMethods,
        ]);
    }
}
