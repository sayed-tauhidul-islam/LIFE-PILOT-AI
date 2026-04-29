<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserFinanceProfile extends Model
{
    protected $table = 'user_finance_profiles';

    protected $fillable = [
        'user_id',
        'total_income',
        'total_expenses',
        'net_savings',
        'total_debt',
        'emergency_fund',
        'risk_profile',
        'investment_horizon',
        'income_stable',
        'dependents',
        'financial_health_score',
        'last_analysis_date',
    ];

    protected $casts = [
        'total_income' => 'float',
        'total_expenses' => 'float',
        'net_savings' => 'float',
        'total_debt' => 'float',
        'emergency_fund' => 'float',
        'income_stable' => 'boolean',
        'investment_horizon' => 'integer',
        'dependents' => 'integer',
        'financial_health_score' => 'integer',
        'last_analysis_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function riskProfiles(): array
    {
        return [
            'conservative' => 'Conservative',
            'moderate' => 'Moderate',
            'aggressive' => 'Aggressive',
        ];
    }
}

