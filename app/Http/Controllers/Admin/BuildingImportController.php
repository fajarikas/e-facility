<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Building;
use App\Support\Spreadsheet\SpreadsheetReader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BuildingImportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'max:10240', 'mimes:xlsx,csv'],
        ]);

        $rows = SpreadsheetReader::readHeaderedRows($validated['file']);

        $required = ['name', 'address'];
        $firstRow = $rows[0] ?? [];
        foreach ($required as $key) {
            if (! array_key_exists($key, $firstRow)) {
                return back()->withErrors([
                    'file' => "Kolom wajib tidak ditemukan: {$key}. Pastikan header sesuai.",
                ]);
            }
        }

        $created = 0;
        $updated = 0;
        $skipped = 0;

        DB::transaction(function () use ($rows, $required, &$created, &$updated, &$skipped) {
            foreach ($rows as $index => $row) {
                $validator = Validator::make($row, [
                    'name' => ['required', 'string', 'max:255'],
                    'address' => ['required', 'string', 'max:255'],
                ]);

                if ($validator->fails()) {
                    $skipped++;
                    continue;
                }

                $data = $validator->validated();

                $building = Building::query()->where('name', $data['name'])->first();
                if ($building) {
                    $building->update($data);
                    $updated++;
                } else {
                    Building::create($data);
                    $created++;
                }
            }
        });

        return redirect()
            ->route('buildings')
            ->with('success', "Import bangunan selesai. Created: {$created}, Updated: {$updated}, Skipped: {$skipped}");
    }
}
