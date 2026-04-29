<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrayerTime extends Model
{
    protected $table = 'prayer_times';

    protected $fillable = [
        'user_id',
        'date',
        'fajr',
        'dhuhr',
        'asr',
        'maghrib',
        'isha',
        'city',
        'country',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'date' => 'date',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

