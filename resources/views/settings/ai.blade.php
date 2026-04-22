@extends('layouts.app')
@section('title', 'AI সেটিংস')
@section('page-title', 'AI সেটিংস')

@section('topbar-actions')
<a href="{{ route('settings.index') }}" class="btn btn-outline btn-sm">
    <i class="fas fa-sliders-h"></i> সেটিংস হোম
</a>
<a href="{{ route('ai.index') }}" class="btn btn-outline btn-sm">
    <i class="fas fa-arrow-left"></i> এআই পেজ
</a>
@endsection

@section('content')
<style>
    .settings-hero {
        background: var(--dash-hero-bg);
        color: var(--dash-hero-text);
        border-radius: 18px;
        padding: 28px;
        margin-bottom: 24px;
        position: relative;
        overflow: hidden;
    }

    .settings-hero::after {
        content: '';
        position: absolute;
        top: -50px;
        right: -30px;
        width: 220px;
        height: 220px;
        border-radius: 999px;
        background: var(--dash-hero-pill-bg);
    }

    .settings-grid {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 20px;
    }

    .settings-card {
        background: var(--surface);
        border-radius: 16px;
        padding: 22px;
        box-shadow: var(--card-shadow);
        border: 1px solid var(--border);
    }

    .option-list {
        display: grid;
        gap: 12px;
        margin-top: 16px;
    }

    .option-item {
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 14px 16px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .option-item:hover {
        border-color: var(--primary);
        box-shadow: 0 6px 18px rgba(99, 102, 241, 0.08);
        transform: translateY(-1px);
    }

    .option-item input {
        margin-top: 3px;
    }

    .option-meta {
        font-size: 12px;
        color: var(--gray);
        margin-top: 4px;
        line-height: 1.5;
    }

    .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border-radius: 999px;
        padding: 6px 10px;
        font-size: 12px;
        font-weight: 700;
    }

    .status-ok {
        background: #d1fae5;
        color: #065f46;
    }

    .status-warn {
        background: #fef3c7;
        color: #92400e;
    }
</style>

<div class="settings-hero">
    <div style="position:relative;z-index:1;">
        <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;opacity:0.7;margin-bottom:10px;">AI Preferences</div>
        <h2 style="font-size:28px;font-weight:800;margin-bottom:10px;">আপনার AI ইঞ্জিন নিয়ন্ত্রণ করুন</h2>
        <p style="max-width:68ch;line-height:1.7;opacity:0.82;">
            Gemini ব্যবহার করুন যখন API key available থাকে, অথবা Local fallback বেছে নিন যখন আপনি external API ছাড়া চলতে চান।
        </p>
    </div>
</div>

<div class="settings-grid">
    <div class="settings-card">
        <div class="card-title">AI Provider নির্বাচন</div>
        <form method="POST" action="{{ route('settings.ai.update') }}">
            @csrf
            @method('PUT')

            <div class="option-list">
                <label class="option-item">
                    <input type="radio" name="ai_provider" value="gemini" {{ $provider === 'gemini' ? 'checked' : '' }}>
                    <div>
                        <div style="font-weight:700;display:flex;align-items:center;gap:8px;">
                            <i class="fas fa-sparkles" style="color:var(--primary);"></i> Gemini
                            @if($geminiConfigured)
                                <span class="status-pill status-ok">Configured</span>
                            @else
                                <span class="status-pill status-warn">No key detected</span>
                            @endif
                        </div>
                        <div class="option-meta">
                            Free tier compatible. Current model: {{ $geminiModel }}. If the key is missing, the app will automatically fall back to local AI.
                        </div>
                    </div>
                </label>

                <label class="option-item">
                    <input type="radio" name="ai_provider" value="local" {{ $provider === 'local' ? 'checked' : '' }}>
                    <div>
                        <div style="font-weight:700;display:flex;align-items:center;gap:8px;">
                            <i class="fas fa-server" style="color:var(--warning);"></i> Local fallback
                            <span class="status-pill status-ok">No API needed</span>
                        </div>
                        <div class="option-meta">
                            Uses your built-in rule-based AI engine only. Best for zero-cost operation and offline-safe behavior.
                        </div>
                    </div>
                </label>
            </div>

            <div style="display:flex;gap:10px;align-items:center;margin-top:18px;">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Save preference
                </button>
                <a href="{{ route('ai.index') }}" class="btn btn-outline">Cancel</a>
            </div>
        </form>
    </div>

    <div class="settings-card">
        <div class="card-title">Setup Notes</div>
        <div style="display:grid;gap:12px;line-height:1.6;color:var(--dark);font-size:13px;">
            <div style="padding:12px;background:#eff6ff;border-radius:12px;">
                <strong>Gemini key</strong><br>
                Add <code>GEMINI_API_KEY</code> to your <code>.env</code> file and keep <code>GEMINI_MODEL=gemini-1.5-flash</code> for the free tier.
            </div>
            <div style="padding:12px;background:#f0fdf4;border-radius:12px;">
                <strong>Fallback safety</strong><br>
                If Gemini fails or quota is exhausted, the app automatically uses the local analysis engine.
            </div>
            <div style="padding:12px;background:#fff7ed;border-radius:12px;">
                <strong>Professional workflow</strong><br>
                Keep provider logs on, review API failures, and only move to paid models after measuring usage.
            </div>
        </div>
    </div>
</div>
@endsection
