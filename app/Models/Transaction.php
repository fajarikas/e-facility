<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'check_in_date',
        'check_out_date',
        'total_harga',
        'is_booked',
        'room_id',
    ];
}
