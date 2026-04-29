<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Routine extends Model
{
    protected $table = 'routines';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'schedule',
        'tips',
        'active',
    ];

    protected $casts = [
        'schedule' => 'array',
        'tips' => 'array',
        'active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

