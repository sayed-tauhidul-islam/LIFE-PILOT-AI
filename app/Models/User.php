<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users';

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
        'language',
        'contrast_mode',
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

    public function routines()
    {
        return $this->hasMany(Routine::class);
    }

    public function meetings()
    {
        return $this->hasMany(Meeting::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function prayerTimes()
    {
        return $this->hasMany(PrayerTime::class);
    }

    public function incomeSources()
    {
        return $this->hasMany(IncomeSource::class);
    }

    public function financialGoals()
    {
        return $this->hasMany(FinancialGoal::class);
    }

    public function investments()
    {
        return $this->hasMany(Investment::class);
    }

    public function savings()
    {
        return $this->hasMany(Saving::class);
    }

    public function financeProfile()
    {
        return $this->hasOne(UserFinanceProfile::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    // Helper: get daily spending limit based on monthly income
    public function getDailyLimit(): float
    {
        return round($this->monthly_income / 30, 2);
    }

    // Helper: get 2-letter language code for AI/chat
    public function getLanguageCode(): string
    {
        return match ($this->language) {
            'english' => 'en',
            'hindi' => 'hi',
            default => 'bn',
        };
    }
}
