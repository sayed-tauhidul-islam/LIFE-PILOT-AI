<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Saving extends Model
{
    protected $table = 'savings';

    protected $fillable = [
        'user_id',
        'account_type',
        'account_name',
        'balance',
        'interest_rate',
        'maturity_date',
        'liquidity',
        'institution',
    ];

    protected $casts = [
        'balance' => 'float',
        'interest_rate' => 'float',
        'maturity_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function accountTypes(): array
    {
        return [
            'bank' => 'Bank',
            'stocks' => 'Stocks',
            'mutual_funds' => 'Mutual Funds',
            'fixed_deposit' => 'Fixed Deposit',
            'cash' => 'Cash',
        ];
    }

    public static function liquidityLevels(): array
    {
        return [
            'high' => 'High',
            'medium' => 'Medium',
            'low' => 'Low',
        ];
    }
}

