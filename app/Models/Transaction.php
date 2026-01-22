<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'check_in_date',
        'check_out_date',
        'customer_name',
        'customer_phone',
        'customer_address',
        'status',
        'expires_at',
        'total_harga',
        'is_booked',
        'room_id',
        'data_master_id',
        'payment_method_id',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function dataMaster(): BelongsTo
    {
        return $this->belongsTo(DataMaster::class);
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(Transaction_Detail::class, 'transaction_id');
    }

    public static function expirePending(): int
    {
        return static::query()
            ->where('status', 'pending_payment')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->update([
                'status' => 'expired',
                'is_booked' => 'No',
            ]);
    }
}
