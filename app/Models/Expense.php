<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $table = 'expenses';

    protected $fillable = [
        'user_id',
        'amount',
        'category',
        'description',
        'date',
        'payment_method',
        'is_recurring',
        'tags',
    ];

    protected $casts = [
        'amount' => 'float',
        'date' => 'date',
        'is_recurring' => 'boolean',
        'tags' => 'array',
    ];

    public function setAmountAttribute($value)
    {
        $this->attributes['amount'] = (float) $value;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function categories(): array
    {
        return [
            'Food' => 'Food',
            'Transport' => 'Transport',
            'Shopping' => 'Shopping',
            'Rent' => 'Rent',
            'Utilities' => 'Utilities',
            'Bills' => 'Bills',
            'Entertainment' => 'Entertainment',
            'Health' => 'Health',
            'Education' => 'Education',
            'Other' => 'Other',
        ];
    }

    public static function paymentMethods(): array
    {
        return [
            'Cash' => 'Cash',
            'Card' => 'Card',
            'Bank Transfer' => 'Bank Transfer',
            'Mobile Payment' => 'Mobile Payment',
        ];
    }
}

