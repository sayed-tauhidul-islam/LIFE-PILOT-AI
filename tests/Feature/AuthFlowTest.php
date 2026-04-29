<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_data_is_saved(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'age' => 25,
            'monthly_income' => 3500.50,
            'gender' => 'male',
            'currency' => 'USD',
        ]);

        $response->assertRedirect('/dashboard');

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'age' => 25,
            'gender' => 'male',
            'currency' => 'USD',
        ]);

        $user = User::where('email', 'test@example.com')->firstOrFail();

        $this->assertTrue(Hash::check('secret123', $user->password));
        $this->assertAuthenticatedAs($user);
    }

    public function test_existing_user_can_login(): void
    {
        $user = User::create([
            'name' => 'Existing User',
            'email' => 'existing@example.com',
            'password' => 'secret123',
            'age' => 30,
            'monthly_income' => 5000,
            'gender' => 'female',
            'currency' => 'USD',
        ]);

        $response = $this->post('/login', [
            'email' => 'existing@example.com',
            'password' => 'secret123',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticatedAs($user);
    }
}
