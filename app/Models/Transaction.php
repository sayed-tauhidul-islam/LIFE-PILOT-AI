<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Transaction extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'transactions';

    protected $fillable = [
        'user_id',
        'type',        // income | expense | saving
        'category',    // food, transport, rent, salary, freelance, etc.
        'amount',
        'description',
        'date',
        'period',      // daily | weekly | monthly | annual
        'tags',        // array of custom tags
        'is_recurring',
        'recurring_interval', // daily | weekly | monthly
        'payment_method',     // cash | card | bank | mobile
        'location',
        'receipt_url',
        'notes',
    ];

    protected $casts = [
        'amount'       => 'float',
        'date'         => 'datetime',
        'tags'         => 'array',
        'is_recurring' => 'boolean',
    ];

    /**
     * Ensure amount is always stored as a numeric (float) in MongoDB.
     * MongoDB doesn't auto-cast strings to numbers, so $sum aggregation
     * would return 0 if the value is stored as a string.
     */
    public function setAmountAttribute($value)
    {
        $this->attributes['amount'] = (float) $value;
    }

    // Expense categories
    public static function expenseCategories(): array
    {
        return [
            'food'          => '🍽️ খাবার ও রেস্তোরাঁ',
            'transport'     => '🚗 পরিবহন',
            'rent'          => '🏠 ভাড়া ও বাসস্থান',
            'utilities'     => '💡 ইউটিলিটি',
            'healthcare'    => '🏥 স্বাস্থ্যসেবা',
            'education'     => '📚 শিক্ষা',
            'entertainment' => '🎬 বিনোদন',
            'shopping'      => '🛍️ কেনাকাটা',
            'savings'       => '💰 সঞ্চয়',
            'investment'    => '📈 বিনিয়োগ',
            'insurance'     => '🛡️ বীমা',
            'personal'      => '👤 ব্যক্তিগত যত্ন',
            'family'        => '👨‍👩‍👧 পরিবার',
            'charity'       => '❤️ দান',
            'other'         => '📦 অন্যান্য',
        ];
    }

    // Income categories
    public static function incomeCategories(): array
    {
        return [
            'salary'     => '💼 বেতন',
            'freelance'  => '💻 ফ্রিল্যান্স',
            'business'   => '🏢 ব্যবসা',
            'investment' => '📈 বিনিয়োগ আয়',
            'rental'     => '🏠 ভাড়া আয়',
            'bonus'      => '🎁 বোনাস',
            'gift'       => '🎀 উপহার',
            'other'      => '📦 অন্যান্য',
        ];
    }

    // Scopes
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeIncome($query)
    {
        return $query->where('type', 'income');
    }

    public function scopeExpense($query)
    {
        return $query->where('type', 'expense');
    }

    public function scopeSaving($query)
    {
        return $query->where('type', 'saving');
    }

    public function scopeForPeriod($query, string $period)
    {
        $now = now();
        return match($period) {
            'daily'   => $query->whereDate('date', $now->toDateString()),
            'weekly'  => $query->whereBetween('date', [now()->startOfWeek()->toDateTimeString(), now()->endOfWeek()->toDateTimeString()]),
            'monthly' => $query->whereYear('date', $now->year)->whereMonth('date', $now->month),
            'annual'  => $query->whereYear('date', $now->year),
            default   => $query,
        };
    }
}
