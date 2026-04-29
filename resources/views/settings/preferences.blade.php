@extends('layouts.app')
@section('title', 'Language Settings')
@section('page-title', 'Language Settings')

@section('topbar-actions')
<a href="{{ route('settings.index') }}" class="btn btn-outline btn-sm">
    <i class="fas fa-arrow-left"></i> সেটিংস হোম
</a>
@endsection

@section('content')
<style>
    .pref-hero {
        background: var(--dash-hero-bg);
        color: var(--dash-hero-text);
        border-radius: 16px;
        padding: 26px;
        margin-bottom: 18px;
        position: relative;
        overflow: hidden;
    }

    .pref-hero::before {
        content: '';
        position: absolute;
        width: 220px;
        height: 220px;
        border-radius: 999px;
        top: -70px;
        right: -50px;
        background: var(--dash-hero-pill-bg);
    }

    .pref-card {
        border: 1px solid var(--border);
        border-radius: 14px;
        background: var(--surface);
        box-shadow: var(--card-shadow);
        padding: 22px;
        max-width: 520px;
    }

    .pref-title {
        font-size: 16px;
        font-weight: 800;
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .option-stack {
        display: grid;
        gap: 10px;
    }

    .option-row {
        border: 1.5px solid var(--border);
        border-radius: 12px;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: var(--bg-card);
    }

    .option-row:hover {
        border-color: color-mix(in oklab, var(--accent) 50%, var(--border));
        background: var(--accent-bg);
    }

    .option-row input {
        width: 18px;
        height: 18px;
        accent-color: var(--accent);
        cursor: pointer;
    }

    .option-row label {
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        width: 100%;
        color: var(--text-primary);
    }

    .option-note {
        font-size: 12px;
        color: var(--gray);
        margin-top: 2px;
    }

    .save-row {
        display: flex;
        gap: 10px;
        margin-top: 18px;
    }
</style>

<div class="pref-hero">
    <div style="position:relative;z-index:1;max-width:68ch;">
        <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.75;margin-bottom:8px;">Localization</div>
        <h2 style="font-size:28px;font-weight:800;margin-bottom:8px;">ভাষা সেটিংস</h2>
        <p style="line-height:1.72;opacity:0.92;">আপনার পছন্দের ভাষা নির্বাচন করুন। বর্তমানে Bangla এবং English সমর্থিত।</p>
    </div>
</div>

<form method="POST" action="{{ route('settings.preferences.update') }}">
    @csrf
    @method('PUT')

    <div class="pref-card">
        <div class="pref-title">
            <i class="fas fa-language" style="color:var(--accent);"></i>
            Interface Language
        </div>
        <div class="option-stack">
            <label class="option-row">
                <input type="radio" name="language" value="bangla" {{ $language === 'bangla' ? 'checked' : '' }}>
                <div>
                    <div>বাংলা (Bangla)</div>
                    <div class="option-note">সমস্ত UI text বাংলায় দেখানো হবে</div>
                </div>
            </label>
            <label class="option-row">
                <input type="radio" name="language" value="english" {{ $language === 'english' ? 'checked' : '' }}>
                <div>
                    <div>English</div>
                    <div class="option-note">All UI text will be displayed in English</div>
                </div>
            </label>
        </div>
    </div>

    <div class="save-row">
        <button type="submit" class="btn btn-primary">
            <i class="fas fa-save"></i> Save Language
        </button>
        <a href="{{ route('settings.index') }}" class="btn btn-outline">Cancel</a>
    </div>
</form>
@endsection

