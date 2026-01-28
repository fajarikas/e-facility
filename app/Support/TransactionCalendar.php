<?php

namespace App\Support;

use App\Models\Transaction;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

final class TransactionCalendar
{
    /**
     * @return array{
     *     month: string,
     *     range_start: string,
     *     range_end: string,
     *     counts_by_date: array<string, array{total:int, booked:int, pending:int}>,
     *     bookings_by_date: array<string, list<array{
     *         id:int,
     *         status:string,
     *         check_in_date:string,
     *         check_out_date:string,
     *         room_name:string,
     *         building_name:string,
     *         booked_by:string
     *     }>>
     * }
     */
    public static function forMonth(Carbon $monthDate): array
    {
        $rangeStart = $monthDate->copy()->startOfMonth();
        $rangeEnd = $monthDate->copy()->endOfMonth();

        /** @var Collection<int, Transaction> $transactions */
        $transactions = Transaction::query()
            ->with(['room.building', 'details.user'])
            ->whereDate('check_in_date', '<=', $rangeEnd->toDateString())
            ->whereDate('check_out_date', '>=', $rangeStart->toDateString())
            ->where(function ($query): void {
                $query->where('status', 'booked')
                    ->orWhere(function ($query): void {
                        $query->where('status', 'pending_payment')
                            ->where(function ($query): void {
                                $query->whereNull('expires_at')
                                    ->orWhere('expires_at', '>', now());
                            });
                    });
            })
            ->orderBy('check_in_date')
            ->get();

        /** @var array<string, array<int, array<string, mixed>>> $bookingsByDate */
        $bookingsByDate = [];

        foreach ($transactions as $transaction) {
            $transactionStart = Carbon::createFromFormat('Y-m-d', (string) $transaction->check_in_date)->startOfDay();
            $transactionEnd = Carbon::createFromFormat('Y-m-d', (string) $transaction->check_out_date)->startOfDay();

            $start = $transactionStart->copy()->max($rangeStart);
            $end = $transactionEnd->copy()->min($rangeEnd);

            if ($start->gt($end)) {
                continue;
            }

            $bookedBy = (string) ($transaction->customer_name
                ?? $transaction->details->first()?->user?->name
                ?? '—');

            $roomName = (string) ($transaction->room?->name ?? '—');
            $buildingName = (string) ($transaction->room?->building?->name ?? '—');

            $cursor = $start->copy();
            while ($cursor->lte($end)) {
                $date = $cursor->toDateString();
                $bookingsByDate[$date] ??= [];
                $bookingsByDate[$date][] = [
                    'id' => $transaction->id,
                    'status' => (string) $transaction->status,
                    'check_in_date' => (string) $transaction->check_in_date,
                    'check_out_date' => (string) $transaction->check_out_date,
                    'room_name' => $roomName,
                    'building_name' => $buildingName,
                    'booked_by' => $bookedBy,
                ];

                $cursor->addDay();
            }
        }

        ksort($bookingsByDate);

        /** @var array<string, array{total:int, booked:int, pending:int}> $countsByDate */
        $countsByDate = [];
        foreach ($bookingsByDate as $date => $bookings) {
            $total = count($bookings);
            $booked = 0;
            $pending = 0;

            foreach ($bookings as $booking) {
                if (($booking['status'] ?? null) === 'booked') {
                    $booked++;
                } else {
                    $pending++;
                }
            }

            $countsByDate[$date] = [
                'total' => $total,
                'booked' => $booked,
                'pending' => $pending,
            ];
        }

        return [
            'month' => $monthDate->format('Y-m'),
            'range_start' => $rangeStart->toDateString(),
            'range_end' => $rangeEnd->toDateString(),
            'counts_by_date' => $countsByDate,
            'bookings_by_date' => $bookingsByDate,
        ];
    }
}
