<?php

namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'age',
        'gender',
        'monthly_income',
        'currency',
        'ai_provider',
        'timezone',
        'avatar',
        'profile_complete',
        'theme_preference',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
        'age'               => 'integer',
        'monthly_income'    => 'float',
        'profile_complete'  => 'boolean',
    ];

    // Relationships
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function budgets()
    {
        return $this->hasMany(Budget::class);
    }

    public function healthProfile()
    {
        return $this->hasOne(HealthProfile::class);
    }

    public function aiSuggestions()
    {
        return $this->hasMany(AISuggestion::class);
    }

    // Helper: get daily spending limit based on monthly income
    public function getDailyLimit(): float
    {
        return round($this->monthly_income / 30, 2);
    }
}
