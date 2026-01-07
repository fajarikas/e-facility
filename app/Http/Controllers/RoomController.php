<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $room = Room::with('building')->latest()->paginate(10);
        $buildings = Building::orderBy('name')->get();

        return Inertia::render('rooms/index', [
            'data' => $room,
            'buildings' => $buildings
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
        $validatedData =  $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer',
            'capacity_count' => 'required|integer',
            'toilet_count' => 'required|integer',
            'area' => 'required|integer',
            'description' => 'required|string',
            'building_id' => 'required|integer|exists:buildings,id',
            'images' => 'required|array|max:4',
            'images.*' => 'required|file|image|max:2048'
        ]);

        $imagePaths = [];

        foreach ($request->file('images') as $imageFile) {
            $imagePaths[] = $this->uploadImage($imageFile);
        }

        $validatedData['images'] = $imagePaths;
        $room = Room::create($validatedData);

        return redirect()->route('rooms')->with([
            'success' => 'Rooms created',
            'data' => $room
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Room $room)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Room $room)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'building_id' => 'required|integer|exists:buildings,id',
            'price' => 'required|integer',
            'capacity_count' => 'required|integer',
            'toilet_count' => 'required|integer',
            'area' => 'required|integer',
            'description' => 'required|string',
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'nullable|string',
            'new_images' => 'nullable|array',
            'new_images.*' => 'required|file|image|max:2048',
        ];

        $validatedData = $request->validate($rules);

        $existingImages = $request->input('existing_images', []);
        $newImageFiles = $request->file('new_images', []);

        $totalImages = count($existingImages) + count($newImageFiles);

        if ($totalImages > 4) {
            return back()->withErrors(['images' => 'Total gambar tidak boleh melebihi 4.']);
        }

        $imagesToDelete = array_diff($room->images ?? [], $existingImages);

        $newImagePaths = [];
        foreach ($newImageFiles as $imageFile) {
            $newImagePaths[] = $this->uploadImage($imageFile);
        }

        $finalImages = array_merge($existingImages, $newImagePaths);

        $room->update(array_merge($validatedData, [
            'images' => $finalImages,
        ]));

        foreach ($imagesToDelete as $path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
        }

        return redirect()->route('rooms')->with('success', 'Kamar berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        $images = $room->images;

        $room->delete();

        if (is_array($images)) {
            foreach ($images as $path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
            }
        }

        return redirect()->route('rooms')->with('success', 'Kamar berhasil dihapus.');
    }

    protected function uploadImage($file): string
    {
        return $file->store('room_images', 'public');
    }
}
