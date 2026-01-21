<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{

    protected $casts = [
        'images' => 'array',
    ];
    protected $fillable = [
        "name",
        "price",
        "capacity_count",
        "toilet_count",
        "area",
        "description",
        "building_id",
        "images"
    ];

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }

    public function review(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(UserRoomLike::class);
    }
}
