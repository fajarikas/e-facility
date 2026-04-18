<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AIChatController extends Controller
{
    /**
     * Handle the chat request using Smart FAQ logic with Availability Check.
     */
    public function __invoke(Request $request)
    {
        $message = strtolower($request->input('message', ''));

        // 1. Ambil data dari database untuk pencocokan dinamis
        $rooms = Room::with('building')->get();

        // 2. Deteksi Tanggal dan Nama Gedung (Pengecekan Ketersediaan)
        $targetDate = $this->parseIndonesianDate($message);
        $foundRoom = null;

        foreach ($rooms as $room) {
            if (str_contains($message, strtolower($room->name))) {
                $foundRoom = $room;
                break;
            }
        }

        if ($targetDate && $foundRoom) {
            $isBooked = Transaction::whereHas('room', function ($q) use ($foundRoom) {
                $q->where('id', $foundRoom->id);
            })
                ->where(function ($q) use ($targetDate) {
                    $q->where('check_in_date', '<=', $targetDate)
                        ->where('check_out_date', '>=', $targetDate)
                        ->whereIn('status', ['booked', 'pending_payment']);
                })
                ->exists();

            $dateFormatted = Carbon::parse($targetDate)->translatedFormat('d F Y');

            if ($isBooked) {
                return response()->json([
                    'response' => "Maaf, {$foundRoom->name} sudah terisi atau sudah dibooking untuk tanggal {$dateFormatted}. Silakan coba cari tanggal lain ya."
                ]);
            } else {
                return response()->json([
                    'response' => "Kabar baik! {$foundRoom->name} saat ini tersedia untuk tanggal {$dateFormatted}. Anda bisa langsung melakukan pemesanan di menu Fasilitas."
                ]);
            }
        }

        // 3. Pengecekan info gedung umum (tanpa tanggal)
        if ($foundRoom) {
            return response()->json([
                'response' => "Fasilitas {$foundRoom->name} berada di {$foundRoom->building->name}. Harga sewanya adalah Rp " . number_format($foundRoom->price, 0, ',', '.') . "/hari. " . strip_tags($foundRoom->description)
            ]);
        }

        // 4. Logic FAQ Terprogram (Rule-based)
        $faqs = [
            'harga' => 'Tarif sewa gedung di BPMP Babel bervariasi. Mulai dari Rp 220.000 untuk ruang kelas hingga Rp 3.950.000 untuk Aula Baru. Anda bisa melihat daftar lengkapnya di menu "Fasilitas".',
            'tarif' => 'Tarif sewa gedung di BPMP Babel bervariasi. Mulai dari Rp 220.000 untuk ruang kelas hingga Rp 3.950.000 untuk Aula Baru. Anda bisa melihat daftar lengkapnya di menu "Fasilitas".',
            'bayar' => 'Pembayaran dapat dilakukan melalui Transfer Bank atau Virtual Account. Instruksi lengkap akan muncul otomatis setelah Anda membuat pesanan di website ini.',
            'pembayaran' => 'Pembayaran dapat dilakukan melalui Transfer Bank atau Virtual Account. Instruksi lengkap akan muncul otomatis setelah Anda membuat pesanan di website ini.',
            'pesan' => 'Cara pesan: 1. Login ke akun Anda, 2. Pilih fasilitas, 3. Tentukan tanggal, 4. Klik "Booking Sekarang". Mudah sekali!',
            'booking' => 'Cara pesan: 1. Login ke akun Anda, 2. Pilih fasilitas, 3. Tentukan tanggal, 4. Klik "Booking Sekarang". Mudah sekali!',
            'lokasi' => 'BPMP Provinsi Kepulauan Bangka Belitung berlokasi di Kompleks Perkantoran Pemerintah Provinsi Kep. Bangka Belitung, Pangkalpinang.',
            'alamat' => 'BPMP Provinsi Kepulauan Bangka Belitung berlokasi di Kompleks Perkantoran Pemerintah Provinsi Kep. Bangka Belitung, Pangkalpinang.',
            'kontak' => 'Anda bisa menghubungi tim admin kami melalui WhatsApp Layanan di nomor yang tertera di bagian bawah website jika membutuhkan bantuan lebih lanjut.',
            'wa' => 'Anda bisa menghubungi tim admin kami melalui WhatsApp Layanan di nomor yang tertera di bagian bawah website jika membutuhkan bantuan lebih lanjut.',
            'halo' => 'Halo! Saya Asisten Virtual BPMP Babel. Ada yang bisa saya bantu terkait informasi penyewaan gedung atau fasilitas?',
            'hi' => 'Halo! Saya Asisten Virtual BPMP Babel. Ada yang bisa saya bantu terkait informasi penyewaan gedung atau fasilitas?',
        ];

        foreach ($faqs as $key => $ans) {
            if (str_contains($message, $key)) {
                return response()->json(['response' => $ans]);
            }
        }

        return response()->json([
            'response' => 'Maaf, saya belum memahami pertanyaan Anda. Cobalah gunakan kata kunci seperti "harga aula", "apakah aula baru tersedia besok?", atau "lokasi gedung". Saya siap membantu!'
        ]);
    }

    /**
     * Helper untuk mendeteksi tanggal dalam bahasa Indonesia
     */
    private function parseIndonesianDate($text)
    {
        $months = [
            'januari' => '01',
            'februari' => '02',
            'maret' => '03',
            'april' => '04',
            'mei' => '05',
            'juni' => '06',
            'juli' => '07',
            'agustus' => '08',
            'september' => '09',
            'oktober' => '10',
            'november' => '11',
            'desember' => '12'
        ];

        // Contoh: "20 april" atau "20 april 2026"
        preg_match('/(\d{1,2})\s+([a-zA-Z]+)(\s+\d{4})?/', $text, $matches);

        if (count($matches) >= 3) {
            $day = str_pad($matches[1], 2, '0', STR_PAD_LEFT);
            $monthName = strtolower($matches[2]);
            $year = isset($matches[3]) ? trim($matches[3]) : date('Y');

            if (isset($months[$monthName])) {
                $month = $months[$monthName];
                return "{$year}-{$month}-{$day}";
            }
        }

        // Cek kata kunci seperti "besok" atau "hari ini"
        if (str_contains($text, 'besok')) return date('Y-m-d', strtotime('+1 day'));
        if (str_contains($text, 'hari ini')) return date('Y-m-d');

        return null;
    }
}
