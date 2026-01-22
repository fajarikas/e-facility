<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Support\Spreadsheet\SpreadsheetReader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RoomImportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'max:10240', 'mimes:xlsx,csv'],
        ]);

        $rows = SpreadsheetReader::readHeaderedRows($validated['file']);

        $required = [
            'name',
            'price',
            'description',
            'building_id',
        ];

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
            foreach ($rows as $row) {
                $validator = Validator::make($row, [
                    'name' => ['required', 'string', 'max:255'],
                    'price' => ['required', 'integer', 'min:0'],
                    'description' => ['required', 'string'],
                    'building_id' => ['required', 'integer', 'exists:buildings,id'],
                ]);

                if ($validator->fails()) {
                    $skipped++;
                    continue;
                }

                $data = $validator->validated();

                // Keep images empty on import; can be edited later.
                $data['images'] = [];

                $room = Room::query()
                    ->where('name', $data['name'])
                    ->where('building_id', $data['building_id'])
                    ->first();

                if ($room) {
                    $room->update($data);
                    $updated++;
                } else {
                    Room::create($data);
                    $created++;
                }
            }
        });

        return redirect()
            ->route('rooms')
            ->with('success', "Import ruangan selesai. Created: {$created}, Updated: {$updated}, Skipped: {$skipped}");
    }
}
