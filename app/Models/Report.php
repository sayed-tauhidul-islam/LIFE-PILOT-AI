<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $table = 'reports';

    protected $fillable = [
        'user_id',
        'type',
        'period_label',
        'summary',
        'generated_at',
    ];

    protected $casts = [
        'summary' => 'array',
        'generated_at' => 'datetime',
    ];
}
