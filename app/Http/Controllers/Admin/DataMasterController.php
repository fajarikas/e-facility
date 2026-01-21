<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DataMaster;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DataMasterController extends Controller
{
    public function index()
    {
        $dataMasters = DataMaster::query()->latest()->get();

        return Inertia::render('admin/data-masters/index', [
            'data' => $dataMasters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'contact' => ['required', 'string', 'max:255'],
            'va_number' => ['required', 'string', 'max:255'],
        ]);

        DataMaster::create($validated);

        return redirect()->route('admin.data-masters')->with('success', 'Data master berhasil dibuat.');
    }

    public function update(Request $request, DataMaster $dataMaster)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'contact' => ['required', 'string', 'max:255'],
            'va_number' => ['required', 'string', 'max:255'],
        ]);

        $dataMaster->update($validated);

        return redirect()->route('admin.data-masters')->with('success', 'Data master berhasil diperbarui.');
    }

    public function destroy(DataMaster $dataMaster)
    {
        $dataMaster->delete();

        return redirect()->route('admin.data-masters')->with('success', 'Data master berhasil dihapus.');
    }
}

