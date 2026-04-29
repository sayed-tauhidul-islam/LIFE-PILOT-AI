<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|min:6',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('dashboard'))
                ->with('success', 'স্বাগতম, ' . Auth::user()->name . '!');
        }

        return back()->withErrors([
            'email' => 'ভুল তথ্য। আবার চেষ্টা করুন।',
        ])->withInput($request->except('password'));
    }

    public function showRegister()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'             => 'required|string|max:100',
            'email'            => 'required|email|unique:users,email',
            'password'         => 'required|min:6|confirmed',
            'age'              => 'required|integer|min:13|max:120',
            'monthly_income'   => 'required|numeric|min:0',
            'gender'           => 'required|in:male,female,other',
            'currency'         => 'nullable|string|max:5',
        ]);

        $user = User::create([
            'name'             => $request->name,
            'email'            => $request->email,
            'password'         => Hash::make($request->password),
            'age'              => $request->age,
            'monthly_income'   => $request->monthly_income,
            'gender'           => $request->gender,
            'currency'         => $request->currency ?? 'USD',
            'ai_provider'      => 'gemini',
            'profile_complete' => false,
        ]);

        Auth::login($user);

        return redirect()->route('dashboard')
            ->with('success', 'অ্যাকাউন্ট তৈরি হয়েছে! এখন ড্যাশবোর্ড থেকে আপনার AI ও সেটিংস কনফিগার করুন।');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login')->with('success', 'আপনি লগআউট হয়েছেন।');
    }
}
