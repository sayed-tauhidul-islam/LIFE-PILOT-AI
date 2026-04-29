<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    /**
     * Apply theme mood preference and persist to user
    protected array $moods = [
        'default'        => 'Default (System Auto)',
        'cosmic-night'   => 'Dark Mode (Cosmic Night)',
        'clean-white'    => 'Light Mode (Clean White)',
        'ocean-deep'     => 'Midnight Blue (Ocean Deep)',
        'emerald-forest' => 'Emerald Forest (Nature)',
        'amber-dusk'     => 'Sunset Warm (Amber Dusk)',
    ];

    /**
     * Apply theme mood preference and persist to user
     */
    public function applyTheme(Request $request)
    {
        $request->validate(['mood' => 'required|string|max:32']);
        $mood = $request->input('mood');

        $user = Auth::user();
        if ($user) {
            try {
                $user->theme_preference = $mood;
                $user->save();
            } catch (\Throwable $e) {
                // ignore DB errors
            }
        }

        return redirect()->back()->with('success', 'Theme updated')->with('set_theme_mood', $mood);
    }

    /**
     * Apply contrast level and persist to user
     */
    public function applyContrast(Request $request)
    {
        $request->validate(['contrast' => 'required|numeric|min:70|max:130']);
        $contrast = (int) $request->input('contrast', 100);

        $user = Auth::user();
        if ($user) {
            try {
                $user->contrast_mode = $contrast;
                $user->save();
            } catch (\Throwable $e) {
                // ignore
            }
        }

        return redirect()->back()->with('success', 'Contrast updated')->with('set_contrast_level', $contrast);
    }

    public function index()
    {
        $user = Auth::user();
        $activeMood = $user->theme_preference ?? 'default';

        return view('settings.index', [
            'user'        => $user,
            'activeMood'  => $activeMood,
            'activeMoodLabel' => $this->moods[$activeMood] ?? $activeMood,
            'provider'    => $user->ai_provider ?? 'gemini',
            'language'    => $user->language ?? 'bangla',
            'contrastMode'=> $user->contrast_mode ?? 'default',
        ]);
    }

    public function preferences()
    {
        $user = Auth::user();

        return view('settings.preferences', [
            'user'     => $user,
            'language' => $user->language ?? 'bangla',
        ]);
    }

    public function ai()
    {
        $user = Auth::user();

        return view('settings.ai', [
            'user'           => $user,
            'provider'       => $user->ai_provider ?? 'gemini',
            'geminiConfigured'=> (bool) config('services.gemini.api_key'),
            'geminiModel'    => config('services.gemini.model', 'gemini-2.0-flash'),
        ]);
    }

    public function theme()
    {
        $user = Auth::user();
        $activeMood = $user->theme_preference ?? 'default';

        return view('settings.theme', [
            'user'       => $user,
            'activeMood' => $activeMood,
            'moods'      => $this->moods,
        ]);
    }

    public function contrast()
    {
        $user = Auth::user();

        return view('settings.contrast', [
            'user' => $user,
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
            'theme_preference' => 'required|in:default,cosmic-night,clean-white,ocean-deep,emerald-forest,amber-dusk',
        ]);

        Auth::user()->update([
            'theme_preference' => $validated['theme_preference'],
        ]);

        return redirect()->route('settings.theme')->with('success', 'থিম সফলভাবে আপডেট হয়েছে।');
    }

    public function updatePreferences(Request $request)
    {
        $validated = $request->validate([
            'language' => 'required|in:bangla,english',
        ]);

        Auth::user()->update([
            'language' => $validated['language'],
        ]);

        return redirect()->route('settings.preferences')->with('success', 'ভাষা আপডেট হয়েছে।');
    }
            'language' => 'required|in:bangla,english',
        ]);

        Auth::user()->update([
            'language' => $validated['language'],
        ]);

        return redirect()->route('settings.preferences')->with('success', 'ভাষা আপডেট হয়েছে।');
    }
}

