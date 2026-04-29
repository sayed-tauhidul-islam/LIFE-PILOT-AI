<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AISuggestion extends Model
{
    protected $table = 'ai_suggestions';

    protected $fillable = [
        'user_id',
        'type',
        'prompt_snapshot',
        'suggestion_data',
        'fin_score',
        'daily_limit',
        'meal_plan',
        'tips',
        'anomalies',
        'model_used',
        'tokens_used',
        'generated_at',
    ];

    protected $casts = [
        'suggestion_data' => 'array',
        'meal_plan' => 'array',
        'tips' => 'array',
        'anomalies' => 'array',
        'fin_score' => 'integer',
        'daily_limit' => 'float',
        'tokens_used' => 'integer',
        'generated_at' => 'datetime',
    ];
}
