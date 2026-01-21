<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\UserRoomLike;
use Illuminate\Http\Request;

class FacilityLikeController extends Controller
{
    public function toggle(Request $request, Room $room)
    {
        $existingLike = UserRoomLike::query()
            ->where('user_id', $request->user()->id)
            ->where('room_id', $room->id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
        } else {
            UserRoomLike::firstOrCreate([
                'user_id' => $request->user()->id,
                'room_id' => $room->id,
            ]);
        }

        return back();
    }
}
