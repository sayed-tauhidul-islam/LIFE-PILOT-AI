<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    protected $table = 'budgets';

    protected $fillable = [
        'user_id',
        'category',
        'period',
        'limit_amount',
        'alert_at',
        'color',
        'is_active',
    ];

    protected $casts = [
        'limit_amount' => 'float',
        'alert_at' => 'integer',
        'is_active' => 'boolean',
    ];
}
