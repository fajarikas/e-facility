<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\UserRoomLike;
use App\Models\DataMaster;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacilityController extends Controller
{
    public function index(Request $request)
    {
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

        if ($date) {
            $query->whereDoesntHave('transactions', function ($transactionQuery) use ($date) {
                $transactionQuery
                    ->where('is_booked', 'Yes')
                    ->whereDate('check_in_date', '<=', $date)
                    ->whereDate('check_out_date', '>=', $date);
            });
        }

        $rooms = $query->latest()->paginate(12)->withQueryString();

        $likedRoomIds = UserRoomLike::query()
            ->where('user_id', $request->user()->id)
            ->pluck('room_id')
            ->values();

        return Inertia::render('facilities/index', [
            'data' => $rooms,
            'filters' => [
                'q' => $search ?? '',
                'date' => $date ?? '',
            ],
            'likedRoomIds' => $likedRoomIds,
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
