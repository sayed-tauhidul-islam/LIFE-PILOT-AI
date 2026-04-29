<?php

namespace Tests\Feature;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AIConversationTest extends TestCase
{
    use RefreshDatabase;

    public function test_ai_chat_can_create_income_transaction_from_natural_language(): void
    {
        $user = $this->makeUser('chat-user@example.com');

        $response = $this->actingAs($user)->postJson('/ai/chat', [
            'message' => 'আজ 200 টাকা আয় করেছি',
            'language' => 'bn',
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'transaction_saved' => true,
            ]);

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'type' => 'income',
            'amount' => 200,
        ]);
    }

    public function test_ai_history_command_returns_saved_transactions(): void
    {
        $user = $this->makeUser('history-user@example.com');

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'expense',
            'category' => 'food',
            'amount' => 150,
            'description' => 'Lunch',
            'date' => now(),
            'period' => 'daily',
            'payment_method' => 'cash',
            'tags' => ['seed'],
        ]);

        $response = $this->actingAs($user)->postJson('/ai/chat', [
            'message' => 'আমার history দেখাও',
            'language' => 'bn',
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'show_history' => true,
            ]);

        $this->assertCount(1, $response->json('history'));
    }

    public function test_ai_chat_returns_category_suggestions_for_ambiguous_expense(): void
    {
        $user = $this->makeUser('suggestion-user@example.com');

        $response = $this->actingAs($user)->postJson('/ai/chat', [
            'message' => 'আজ 300 টাকা খরচ করেছি',
            'language' => 'bn',
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'needs_follow_up' => true,
            ]);

        $this->assertNotEmpty($response->json('category_suggestions'));
        $this->assertSame('food', $response->json('category_suggestions.0.value'));
    }

    public function test_ai_chat_can_save_multiple_transactions_from_one_message(): void
    {
        $user = $this->makeUser('multi-user@example.com');

        $response = $this->actingAs($user)->postJson('/ai/chat', [
            'message' => 'আজ 200 টাকা আয় করেছি আর 50 টাকা নাস্তায় খরচ করেছি',
            'language' => 'bn',
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'transaction_saved' => true,
                'transaction_count' => 2,
            ]);

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'type' => 'income',
            'amount' => 200,
            'category' => 'other',
        ]);

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'type' => 'expense',
            'amount' => 50,
            'category' => 'food',
        ]);
    }

    private function makeUser(string $email): User
    {
        return User::create([
            'name' => 'Chat User',
            'email' => $email,
            'password' => 'secret123',
            'age' => 29,
            'monthly_income' => 5000,
            'gender' => 'male',
            'currency' => 'TK',
            'ai_provider' => 'local',
        ]);
    }
}
