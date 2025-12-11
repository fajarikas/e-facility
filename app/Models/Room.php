<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    protected $fillable = [
        "name",
        "price",
        "capacity_count",
        "toilet_count",
        "area",
        "description",
        "building_id"
    ];

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }

    public function review(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
