@extends('layouts.app')
@section('title', 'থিম সেটিংস')
@section('page-title', 'থিম সেটিংস')

@section('topbar-actions')
<a href="{{ route('settings.index') }}" class="btn btn-outline btn-sm">
    <i class="fas fa-arrow-left"></i> সেটিংস হোম
</a>
@endsection

@section('content')
<style>
    .theme-hero {
        background: var(--dash-hero-bg);
        color: var(--dash-hero-text);
        border-radius: 16px;
        padding: 28px;
        margin-bottom: 22px;
        position: relative;
        overflow: hidden;
    }

    .theme-hero::before {
        content: '';
        position: absolute;
        width: 260px;
        height: 260px;
        border-radius: 999px;
        top: -90px;
        right: -70px;
        background: var(--dash-hero-pill-bg);
    }

    .theme-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
    }

    @media (max-width: 1024px) {
        .theme-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 640px) {
        .theme-grid {
            grid-template-columns: 1fr;
        }
    }

    .theme-option {
        border: 2px solid var(--border);
        border-radius: 16px;
        padding: 18px;
        background: var(--bg-card);
        cursor: pointer;
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        position: relative;
    }

    .theme-option:hover {
        transform: scale(1.03);
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.18);
        border-color: color-mix(in oklab, var(--accent) 50%, var(--border));
    }

    .theme-option.active {
        border-color: var(--accent);
        box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 20%, transparent), 0 16px 32px rgba(0, 0, 0, 0.18);
    }

    .theme-option input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    .theme-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
    }

    .theme-name {
        font-weight: 800;
        font-size: 14px;
        color: var(--text-primary);
    }

    .theme-check {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        color: transparent;
        font-size: 11px;
    }

    .theme-option.active .theme-check {
        background: var(--accent);
        border-color: var(--accent);
        color: #fff;
    }

    .theme-swatches {
        display: flex;
        gap: 8px;
        margin-bottom: 14px;
    }

    .swatch {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.15);
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }

    .theme-preview {
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border);
        height: 90px;
        display: grid;
        grid-template-columns: 1fr 1.2fr;
    }

    .theme-preview .left {
        padding: 10px;
        font-size: 11px;
        font-weight: 700;
    }

    .theme-preview .right {
        padding: 10px;
        font-size: 11px;
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        gap: 6px;
    }

    .theme-preview .pill {
        border-radius: 999px;
        padding: 2px 8px;
        font-size: 10px;
        width: fit-content;
    }

    .theme-note {
        font-size: 12px;
        line-height: 1.65;
        color: var(--gray);
        margin-top: 10px;
    }

    .save-row {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-top: 22px;
    }
</style>

<div class="theme-hero">
    <div style="position:relative;z-index:1;max-width:72ch;">
        <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.75;margin-bottom:8px;">Theme Presets</div>
        <h2 style="font-size:30px;font-weight:800;margin-bottom:8px;">আপনার UI color combination নির্বাচন করুন</h2>
        <p style="line-height:1.75;opacity:0.9;">নিচের ছয়টি predefined theme থেকে একটি বেছে নিলে dashboard, card, button, chart accent color সব update হবে।</p>
    </div>
</div>

<form method="POST" action="{{ route('settings.theme.update') }}" id="theme-form">
    @csrf
    @method('PUT')

    <div class="theme-grid">
        {{-- Default --}}
        <label class="theme-option {{ $activeMood === 'default' ? 'active' : '' }}" data-mood="default">
            <div class="theme-header">
                <span class="theme-name">Default</span>
                <span class="theme-check"><i class="fas fa-check"></i></span>
            </div>
            <div class="theme-swatches">
                <div class="swatch" style="background:#F8FAFC;"></div>
                <div class="swatch" style="background:#4F46E5;"></div>
                <div class="swatch" style="background:#0F172A;"></div>
            </div>
            <div class="theme-preview" style="background:#F8FAFC;">
                <div class="left" style="background:#FFFFFF;color:#0F172A;">Sidebar</div>
                <div class="right" style="background:#F1F5F9;color:#0F172A;">
                    <div style="background:linear-gradient(90deg,#4F46E5,#6366F1);border-radius:8px;"></div>
                    <span class="pill" style="background:#EEF2FF;color:#4F46E5;">Accent Indigo</span>
                    <span class="pill" style="background:#F8FAFC;color:#0F172A;">System Auto</span>
                </div>
            </div>
            <div class="theme-note">আপনার OS এর light/dark মোড অনুযায়ী অ্যাডাপ্ট হয়।</div>
            <input type="radio" name="theme_preference" value="default" {{ $activeMood === 'default' ? 'checked' : '' }}>
        </label>

        {{-- Cosmic Night --}}
        <label class="theme-option {{ $activeMood === 'cosmic-night' ? 'active' : '' }}" data-mood="cosmic-night">
            <div class="theme-header">
                <span class="theme-name">Dark Mode (Cosmic Night)</span>
                <span class="theme-check"><i class="fas fa-check"></i></span>
            </div>
            <div class="theme-swatches">
                <div class="swatch" style="background:#060818;"></div>
                <div class="swatch" style="background:#818CF8;"></div>
                <div class="swatch" style="background:#E2E8F0;"></div>
            </div>
            <div class="theme-preview" style="background:#060818;">
                <div class="left" style="background:#0B0F23;color:#E2E8F0;">Sidebar</div>
                <div class="right" style="background:#0F1629;color:#E2E8F0;">
                    <div style="background:linear-gradient(90deg,#818CF8,#A5B4FC);border-radius:8px;"></div>
                    <span class="pill" style="background:#1E1B4B;color:#818CF8;">Accent Indigo</span>
                    <span class="pill" style="background:#0F1629;color:#E2E8F0;">Deep dark</span>
                </div>
            </div>
            <div class="theme-note">Cinematic deep dark workspace with indigo accents.</div>
            <input type="radio" name="theme_preference" value="cosmic-night" {{ $activeMood === 'cosmic-night' ? 'checked' : '' }}>
        </label>

        {{-- Clean White --}}
        <label class="theme-option {{ $activeMood === 'clean-white' ? 'active' : '' }}" data-mood="clean-white">
            <div class="theme-header">
                <span class="theme-name">Light Mode (Clean White)</span>
                <span class="theme-check"><i class="fas fa-check"></i></span>
            </div>
            <div class="theme-swatches">
                <div class="swatch" style="background:#F8FAFC;"></div>
                <div class="swatch" style="background:#4F46E5;"></div>
                <div class="swatch" style="background:#0F172A;"></div>
            </div>
            <div class="theme-preview" style="background:#F8FAFC;">
                <div class="left" style="background:#FFFFFF;color:#0F172A;">Sidebar</div>
                <div class="right" style="background:#F1F5F9;color:#0F172A;">
                    <div style="background:linear-gradient(90deg,#4F46E5,#6366F1);border-radius:8px;"></div>
                    <span class="pill" style="background:#EEF2FF;color:#4F46E5;">Accent Blue</span>
                    <span class="pill" style="background:#F1F5F9;color:#0F172A;">Clean bright</span>
                </div>
            </div>
            <div class="theme-note">Fresh, clean, and productivity-focused light experience.</div>
            <input type="radio" name="theme_preference" value="clean-white" {{ $activeMood === 'clean-white' ? 'checked' : '' }}>
        </label>

        {{-- Ocean Deep --}}
        <label class="theme-option {{ $activeMood === 'ocean-deep' ? 'active' : '' }}" data-mood="ocean-deep">
            <div class="theme-header">
                <span class="theme-name">Midnight Blue (Ocean Deep)</span>
                <span class="theme-check"><i class="fas fa-check"></i></span>
            </div>
            <div class="theme-swatches">
                <div class="swatch" style="background:#020B18;"></div>
                <div class="swatch" style="background:#0EA5E9;"></div>
                <div class="swatch" style="background:#BAE6FD;"></div>
            </div>
            <div class="theme-preview" style="background:#020B18;">
                <div class="left" style="background:#041628;color:#BAE6FD;">Sidebar</div>
                <div class="right" style="background:#072035;color:#BAE6FD;">
                    <div style="background:linear-gradient(90deg,#0EA5E9,#38BDF8);border-radius:8px;"></div>
                    <span class="pill" style="background:#082F49;color:#0EA5E9;">Accent Cyan</span>
                    <span class="pill" style="background:#072035;color:#BAE6FD;">Ocean deep</span>
                </div>
            </div>
            <div class="theme-note">Deep ocean tones with calming cyan accents.</div>
            <input type="radio" name="theme_preference" value="ocean-deep" {{ $activeMood === 'ocean-deep' ? 'checked' : '' }}>
        </label>

        {{-- Emerald Forest --}}
        <label class="theme-option {{ $activeMood === 'emerald-forest' ? 'active' : '' }}" data-mood="emerald-forest">
            <div class="theme-header">
                <span class="theme-name">Emerald Forest (Nature)</span>
                <span class="theme-check"><i class="fas fa-check"></i></span>
            </div>
            <div class="theme-swatches">
                <div class="swatch" style="background:#021208;"></div>
                <div class="swatch" style="background:#10B981;"></div>
                <div class="swatch" style="background:#D1FAE5;"></div>
            </div>
            <div class="theme-preview" style="background:#021208;">
                <div class="left" style="background:#041F0E;color:#D1FAE5;">Sidebar</div>
                <div class="right" style="background:#062B14;color:#D1FAE5;">
                    <div style="background:linear-gradient(90deg,#10B981,#34D399);border-radius:8px;"></div>
                    <span class="pill" style="background:#064E3B;color:#10B981;">Accent Green</span>
                    <span class="pill" style="background:#062B14;color:#D1FAE5;">Nature vibe</span>
                </div>
            </div>
            <div class="theme-note">Organic dark green tones for a nature-inspired workspace.</div>
            <input type="radio" name="theme_preference" value="emerald-forest" {{ $activeMood === 'emerald-forest' ? 'checked' : '' }}>
        </label>

        {{-- Amber Dusk --}}
        <label class="theme-option {{ $activeMood === 'amber-dusk' ? 'active' : '' }}" data-mood="amber-dusk">
            <div class="theme-header">
                <span class="theme-name">Sunset Warm (Amber Dusk)</span>
                <span class="theme-check"><i class="fas fa-check"></i></span>
            </div>
            <div class="theme-swatches">
                <div class="swatch" style="background:#160A00;"></div>
                <div class="swatch" style="background:#F59E0B;"></div>
                <div class="swatch" style="background:#FEF3C7;"></div>
            </div>
            <div class="theme-preview" style="background:#160A00;">
                <div class="left" style="background:#1F1000;color:#FEF3C7;">Sidebar</div>
                <div class="right" style="background:#2D1800;color:#FEF3C7;">
                    <div style="background:linear-gradient(90deg,#F59E0B,#FBBF24);border-radius:8px;"></div>
                    <span class="pill" style="background:#451A03;color:#F59E0B;">Accent Amber</span>
                    <span class="pill" style="background:#2D1800;color:#FEF3C7;">Warm dusk</span>
                </div>
            </div>
            <div class="theme-note">Warm amber sunset tones for a cozy, focused evening feel.</div>
            <input type="radio" name="theme_preference" value="amber-dusk" {{ $activeMood === 'amber-dusk' ? 'checked' : '' }}>
        </label>
    </div>

    <div class="save-row">
        <button type="submit" class="btn btn-primary">
            <i class="fas fa-save"></i> থিম সংরক্ষণ করুন
        </button>
        <a href="{{ route('settings.index') }}" class="btn btn-outline">বাতিল</a>
    </div>
</form>
@endsection

@push('scripts')
<script>
(function() {
    const options = document.querySelectorAll('.theme-option');
    options.forEach(opt => {
        opt.addEventListener('click', function() {
            options.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            const input = this.querySelector('input[type="radio"]');
            if (input) input.checked = true;
        });
    });
})();
</script>
@endpush

