@extends('layouts.app')
@section('title', 'সেটিংস')
@section('page-title', 'সেটিংস')

@section('content')
<style>
    .settings-hero {
        background: var(--dash-hero-bg);
        color: var(--dash-hero-text);
        border-radius: 16px;
        padding: 28px;
        margin-bottom: 22px;
        position: relative;
        overflow: hidden;
    }

    .settings-hero::before {
        content: '';
        position: absolute;
        width: 240px;
        height: 240px;
        border-radius: 999px;
        top: -80px;
        right: -50px;
        background: var(--dash-hero-pill-bg);
    }

    .settings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
    }

    .settings-link-card {
        background: var(--surface, #ffffff);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 20px;
        text-decoration: none;
        color: var(--dark);
        box-shadow: var(--card-shadow);
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        display: block;
    }

    .settings-link-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.15);
        border-color: var(--primary);
    }

    .settings-link-title {
        font-size: 18px;
        font-weight: 800;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .settings-link-body {
        font-size: 13px;
        line-height: 1.7;
        color: var(--gray);
    }

    .settings-link-chip {
        display: inline-flex;
        margin-top: 12px;
        font-size: 11px;
        font-weight: 700;
        border-radius: 999px;
        padding: 4px 10px;
        background: color-mix(in oklab, var(--primary) 14%, transparent);
        color: var(--primary);
    }
</style>

<div class="settings-hero">
    <div style="position:relative;z-index:1;max-width:72ch;">
        <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.75;margin-bottom:8px;">Page Setup Hub</div>
        <h2 style="font-size:32px;line-height:1.2;font-weight:800;margin-bottom:10px;">ড্যাশবোর্ড এবং পেজ সেটআপ এক জায়গায়</h2>
        <p style="line-height:1.75;opacity:0.9;">এখান থেকে থিম, AI engine preference, এবং UI behavior related সেটিংস কন্ট্রোল করতে পারবেন।</p>
    </div>
</div>

<div class="settings-grid">
    <a class="settings-link-card" href="{{ route('ai.index') }}">
        <div class="settings-link-title"><i class="fas fa-robot" style="color:var(--primary);"></i> AI Workspace</div>
        <div class="settings-link-body">
            AI advisor page, insights refresh, এবং generated suggestion history দ্রুত access করুন।
        </div>
        <span class="settings-link-chip">AI option moved here</span>
    </a>

    <a class="settings-link-card" href="{{ route('settings.theme') }}">
        <div class="settings-link-title"><i class="fas fa-palette" style="color:var(--primary);"></i> Theme Settings</div>
        <div class="settings-link-body">
            ৪টি color combination থেকে আপনার dashboard look নির্বাচন করুন।
            Current: <strong>{{ $activeTheme }}</strong>
        </div>
        <span class="settings-link-chip">4 theme presets</span>
    </a>

    <a class="settings-link-card" href="{{ route('settings.ai') }}">
        <div class="settings-link-title"><i class="fas fa-robot" style="color:var(--primary);"></i> AI Settings</div>
        <div class="settings-link-body">
            Gemini বা Local engine নির্বাচন করুন।
            Current provider: <strong>{{ $provider }}</strong>
        </div>
        <span class="settings-link-chip">AI control panel</span>
    </a>
</div>
@endsection
