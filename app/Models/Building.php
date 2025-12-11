<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Building extends Model
{
    protected $fillable = [
        'name',
        'bmn_type',
        'address'
    ];

    public function room(): HasMany
    {
        return $this->hasMany(Room::class);
    }
}
