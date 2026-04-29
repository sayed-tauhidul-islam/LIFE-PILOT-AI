<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionAiRegressionTest extends TestCase
{
    use RefreshDatabase;

    public function test_transaction_store_does_not_crash_when_weekly_budget_rounds_toward_zero(): void
    {
        $user = User::create([
            'name' => 'Low Income User',
            'email' => 'low-income@example.com',
            'password' => 'secret123',
            'age' => 28,
            'monthly_income' => 1,
            'gender' => 'male',
            'currency' => 'USD',
            'ai_provider' => 'local',
        ]);

        $response = $this->actingAs($user)->post('/transactions', [
            'type' => 'expense',
            'category' => 'food',
            'amount' => '5.00',
            'description' => 'Lunch',
            'date' => now()->toDateString(),
            'period' => 'weekly',
        ]);

        $response->assertRedirect('/transactions');

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'category' => 'food',
            'description' => 'Lunch',
        ]);
    }
}
