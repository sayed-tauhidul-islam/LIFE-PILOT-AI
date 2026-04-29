<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialGoal extends Model
{
    protected $table = 'financial_goals';

    protected $fillable = [
        'user_id',
        'goal_name',
        'target_amount',
        'current_amount',
        'deadline',
        'priority',
        'monthly_contribution',
        'category',
        'status',
    ];

    protected $casts = [
        'target_amount' => 'float',
        'current_amount' => 'float',
        'monthly_contribution' => 'float',
        'deadline' => 'date',
        'priority' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getProgressPercentageAttribute(): float
    {
        if ($this->target_amount <= 0) return 0;
        return min(100, round(($this->current_amount / $this->target_amount) * 100, 2));
    }

    public static function categories(): array
    {
        return [
            'savings' => 'Savings',
            'investment' => 'Investment',
            'debt_payoff' => 'Debt Payoff',
            'purchase' => 'Purchase',
        ];
    }

    public static function statuses(): array
    {
        return [
            'active' => 'Active',
            'completed' => 'Completed',
            'abandoned' => 'Abandoned',
        ];
    }
}

