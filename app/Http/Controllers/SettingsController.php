<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return view('settings.index', [
            'user' => $user,
            'activeTheme' => $user->theme_preference ?? 'black-red',
            'provider' => $user->ai_provider ?? 'gemini',
        ]);
    }

    public function ai()
    {
        $user = Auth::user();

        return view('settings.ai', [
            'user' => $user,
            'provider' => $user->ai_provider ?? 'gemini',
            'geminiConfigured' => (bool) config('services.gemini.api_key'),
            'geminiModel' => config('services.gemini.model', 'gemini-1.5-flash'),
        ]);
    }

    public function theme()
    {
        $user = Auth::user();

        return view('settings.theme', [
            'user' => $user,
            'activeTheme' => $user->theme_preference ?? 'black-red',
        ]);
    }

    public function updateAi(Request $request)
    {
        $validated = $request->validate([
            'ai_provider' => 'required|in:gemini,local',
        ]);

        Auth::user()->update([
            'ai_provider' => $validated['ai_provider'],
        ]);

        return redirect()->route('settings.ai')->with('success', 'AI পছন্দ আপডেট হয়েছে।');
    }

    public function updateTheme(Request $request)
    {
        $validated = $request->validate([
            'theme_preference' => 'required|in:black-red,white-green,white-black,blue-red',
        ]);

        Auth::user()->update([
            'theme_preference' => $validated['theme_preference'],
        ]);

        return redirect()->route('settings.theme')->with('success', 'থিম সফলভাবে আপডেট হয়েছে।');
    }
}
