<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IncomeSource extends Model
{
    protected $table = 'income_sources';

    protected $fillable = [
        'user_id',
        'source_type',
        'amount',
        'frequency',
        'category',
        'description',
        'date',
    ];

    protected $casts = [
        'amount' => 'float',
        'date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function sourceTypes(): array
    {
        return [
            'salary' => 'Salary',
            'freelance' => 'Freelance',
            'business' => 'Business',
            'investment' => 'Investment',
            'other' => 'Other',
        ];
    }

    public static function frequencies(): array
    {
        return [
            'monthly' => 'Monthly',
            'weekly' => 'Weekly',
            'one-time' => 'One Time',
            'yearly' => 'Yearly',
        ];
    }
}

