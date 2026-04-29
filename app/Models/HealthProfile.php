<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HealthProfile extends Model
{
    protected $table = 'health_profiles';

    protected $fillable = [
        'user_id',
        'dietary_preferences',
        'health_conditions',
        'health_goals',
        'activity_level',
        'bmi',
        'daily_food_budget',
        'target_calories',
        'notes',
    ];

    protected $casts = [
        'dietary_preferences' => 'array',
        'health_conditions' => 'array',
        'health_goals' => 'array',
        'bmi' => 'float',
        'daily_food_budget' => 'float',
        'target_calories' => 'integer',
    ];

    /**
     * Calculate daily calorie target based on user profile.
     */
    public function calculateDailyCalories(): int
    {
        $base = 2000;

        if ($this->activity_level === 'sedentary') {
            $base = 1800;
        } elseif ($this->activity_level === 'light') {
            $base = 2000;
        } elseif ($this->activity_level === 'moderate') {
            $base = 2300;
        } elseif ($this->activity_level === 'very_active') {
            $base = 2800;
        }

        if (in_array('lose_weight', $this->health_goals ?? [])) {
            $base -= 400;
        } elseif (in_array('gain_muscle', $this->health_goals ?? [])) {
            $base += 400;
        }

        return max(1200, $base);
    }

    /**
     * Get BMI category.
     */
    public function getBMICategory(): string
    {
        $bmi = $this->bmi ?? 22;

        if ($bmi < 18.5) return 'underweight';
        if ($bmi < 25) return 'normal';
        if ($bmi < 30) return 'overweight';
        return 'obese';
    }
}

