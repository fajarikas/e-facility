<?php

namespace App\Support\Spreadsheet;

use Illuminate\Http\UploadedFile;

class SpreadsheetReader
{
    /**
     * @return array<int, array<string, string|null>> Rows keyed by header from the first row.
     */
    public static function readHeaderedRows(UploadedFile $file): array
    {
        $extension = strtolower($file->getClientOriginalExtension());

        if ($extension === 'csv') {
            return self::readCsv($file->getRealPath());
        }

        if ($extension === 'xlsx') {
            return self::readXlsx($file->getRealPath());
        }

        throw new \RuntimeException('Unsupported file type. Please upload .xlsx or .csv');
    }

    /**
     * @return array<int, array<string, string|null>>
     */
    private static function readCsv(string $path): array
    {
        $handle = fopen($path, 'rb');
        if (! $handle) {
            throw new \RuntimeException('Failed to open CSV file.');
        }

        $headers = null;
        $rows = [];

        while (($data = fgetcsv($handle)) !== false) {
            if ($headers === null) {
                $headers = array_map([self::class, 'normalizeHeader'], $data);
                continue;
            }

            if (! $headers) {
                continue;
            }

            $row = [];
            foreach ($headers as $index => $header) {
                if ($header === '') {
                    continue;
                }
                $row[$header] = isset($data[$index]) ? trim((string) $data[$index]) : null;
            }
            $rows[] = $row;
        }

        fclose($handle);

        return $rows;
    }

    /**
     * Minimal XLSX reader (first worksheet only). Supports strings (sharedStrings) and numbers.
     *
     * @return array<int, array<string, string|null>>
     */
    private static function readXlsx(string $path): array
    {
        if (! class_exists(\ZipArchive::class)) {
            throw new \RuntimeException('ZipArchive is required to read .xlsx files.');
        }

        $zip = new \ZipArchive();
        $opened = $zip->open($path);
        if ($opened !== true) {
            throw new \RuntimeException('Failed to open XLSX file.');
        }

        $sharedStrings = self::readSharedStrings($zip);

        $sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
        if ($sheetXml === false) {
            $zip->close();
            throw new \RuntimeException('XLSX sheet1.xml not found.');
        }

        $xml = @simplexml_load_string($sheetXml);
        if (! $xml || ! isset($xml->sheetData)) {
            $zip->close();
            throw new \RuntimeException('Invalid XLSX worksheet XML.');
        }

        $headers = null;
        $rows = [];

        foreach ($xml->sheetData->row as $rowNode) {
            $cells = [];
            foreach ($rowNode->c as $cell) {
                $ref = (string) $cell['r']; // e.g., A1
                $col = self::extractColumnLetters($ref);
                $colIndex = self::columnLettersToIndex($col);
                $type = (string) $cell['t']; // 's' for shared string
                $value = null;

                if (isset($cell->v)) {
                    $raw = (string) $cell->v;
                    if ($type === 's') {
                        $idx = (int) $raw;
                        $value = $sharedStrings[$idx] ?? '';
                    } else {
                        $value = $raw;
                    }
                }

                if ($colIndex !== null) {
                    $cells[$colIndex] = $value !== null ? trim((string) $value) : null;
                }
            }

            // Convert A,B,C columns into a dense array by column order.
            ksort($cells);
            $dense = [];
            $maxIndex = empty($cells) ? -1 : max(array_keys($cells));
            for ($i = 0; $i <= $maxIndex; $i++) {
                $dense[$i] = $cells[$i] ?? null;
            }

            if ($headers === null) {
                $headers = array_map([self::class, 'normalizeHeader'], $dense);
                continue;
            }

            if (! $headers) {
                continue;
            }

            $row = [];
            foreach ($headers as $index => $header) {
                if ($header === '') {
                    continue;
                }
                $row[$header] = $dense[$index] ?? null;
            }
            $rows[] = $row;
        }

        $zip->close();

        return $rows;
    }

    /**
     * @return array<int, string>
     */
    private static function readSharedStrings(\ZipArchive $zip): array
    {
        $sharedStringsXml = $zip->getFromName('xl/sharedStrings.xml');
        if ($sharedStringsXml === false) {
            return [];
        }

        $xml = @simplexml_load_string($sharedStringsXml);
        if (! $xml) {
            return [];
        }

        $strings = [];
        foreach ($xml->si as $si) {
            // Shared string can be <t> or rich text <r><t>...</t></r>
            if (isset($si->t)) {
                $strings[] = (string) $si->t;
                continue;
            }

            $text = '';
            foreach ($si->r as $run) {
                $text .= (string) $run->t;
            }
            $strings[] = $text;
        }

        return $strings;
    }

    private static function extractColumnLetters(string $ref): string
    {
        return preg_replace('/[^A-Z]/', '', strtoupper($ref)) ?: '';
    }

    private static function columnLettersToIndex(string $letters): ?int
    {
        if ($letters === '') {
            return null;
        }

        $letters = strtoupper($letters);
        $index = 0;
        $length = strlen($letters);
        for ($i = 0; $i < $length; $i++) {
            $char = ord($letters[$i]);
            if ($char < 65 || $char > 90) {
                return null;
            }
            $index = ($index * 26) + ($char - 64);
        }

        return $index - 1;
    }

    private static function normalizeHeader(string $header): string
    {
        $h = trim(mb_strtolower($header, 'UTF-8'));
        $h = preg_replace('/\s+/', '_', $h) ?? $h;
        $h = preg_replace('/[^a-z0-9_]/', '', $h) ?? $h;
        return $h;
    }
}
