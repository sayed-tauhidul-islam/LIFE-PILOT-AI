<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    protected $table = 'meetings';

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'date',
        'time',
        'location',
        'attendees',
        'reminder',
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime:H:i',
        'attendees' => 'array',
        'reminder' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

