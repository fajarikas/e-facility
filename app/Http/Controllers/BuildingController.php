<?php

namespace App\Http\Controllers;

use App\Models\Building;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuildingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $buildings = Building::latest()->paginate(10);
        $buildingId = $request->get('buildingId');
        $selectedBuilding = null;

        if ($buildingId) {
            $selectedBuilding = Building::find($buildingId);
        }
        return Inertia::render('buildings/index', [
            'data' => $buildings,
            'selectedBuilding' => $selectedBuilding,
            'buildingDetail' => $buildingId
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('buildings/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|max:255'
        ]);

        $building = Building::create($validated);

        return redirect()->route('buildings')->with([
            'success' => 'Building created.',
            'data' => $building,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Building $building)
    {
        if (request()->wantsJson()) {
            return response()->json($building);
        }

        return Inertia::render('building/show', [
            'buildingDetail' => $building
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Building $building)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Building $building)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255'
        ]);

        $building->update($validated);
        return redirect()->route('buildings')->with('success', 'Data berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Building $building)
    {
        // authorize deletion if needed
        // $this->authorize('delete', $building);

        $building->delete();

        // return redirect()->route('buildings')->with([
        //     'success' => 'Building deleted.',
        // ]);
        return redirect()->route('buildings')->with('success', 'Bangunan berhasil dihapus.');
    }
}
