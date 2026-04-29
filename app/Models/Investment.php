<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
    protected $table = 'investments';

    protected $fillable = [
        'user_id',
        'investment_type',
        'asset_name',
        'amount_invested',
        'current_value',
        'purchase_date',
        'quantity',
        'platform',
        'returns',
        'notes',
    ];

    protected $casts = [
        'amount_invested' => 'float',
        'current_value' => 'float',
        'quantity' => 'float',
        'returns' => 'float',
        'purchase_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getCurrentReturnsAmountAttribute(): float
    {
        if (!$this->current_value || !$this->amount_invested) return 0;
        return round($this->current_value - $this->amount_invested, 2);
    }

    public static function investmentTypes(): array
    {
        return [
            'stocks' => 'Stocks',
            'bonds' => 'Bonds',
            'mutual_funds' => 'Mutual Funds',
            'fixed_deposits' => 'Fixed Deposits',
            'gold' => 'Gold',
            'real_estate' => 'Real Estate',
        ];
    }
}

