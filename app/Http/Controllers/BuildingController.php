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
    public function index()
    {
        $buildings = Building::paginate(10);
        return Inertia::render('buildings/index', [
            'data' => $buildings,
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Building $room)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Building $room)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Building $room)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Building $room)
    {
        //
    }
}
