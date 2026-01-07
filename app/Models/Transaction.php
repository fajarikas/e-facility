<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    protected $fillable = [
        'check_in_date',
        'check_out_date',
        'total_harga',
        'is_booked',
        'room_id',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(Transaction_Detail::class, 'transaction_id');
    }
}
