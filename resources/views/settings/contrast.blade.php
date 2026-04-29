@extends('layouts.app')
@section('title', 'Contrast & Brightness')
@section('page-title', 'Contrast & Brightness')

@section('topbar-actions')
<a href="{{ route('settings.index') }}" class="btn btn-outline btn-sm">
    <i class="fas fa-arrow-left"></i> সেটিংস হোম
</a>
@endsection

@section('content')
<style>
    .contrast-hero {
        background: var(--dash-hero-bg);
        color: var(--dash-hero-text);
        border-radius: 16px;
        padding: 28px;
        margin-bottom: 22px;
        position: relative;
        overflow: hidden;
    }

    .contrast-hero::before {
        content: '';
        position: absolute;
        width: 260px;
        height: 260px;
        border-radius: 999px;
        top: -90px;
        right: -70px;
        background: var(--dash-hero-pill-bg);
    }

    .contrast-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 28px;
        box-shadow: var(--card-shadow);
        max-width: 720px;
    }

    .contrast-label {
        font-size: 14px;
        font-weight: 700;
        color: var(--dark);
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .slider-wrap {
        margin-bottom: 24px;
    }

    .brightness-slider {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 8px;
        border-radius: 999px;
        background: var(--border);
        outline: none;
        cursor: pointer;
        transition: background 0.2s ease;
    }

    .brightness-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--accent);
        border: 3px solid var(--bg-surface);
        box-shadow: 0 4px 12px color-mix(in oklab, var(--accent) 40%, transparent);
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .brightness-slider::-webkit-slider-thumb:hover {
        transform: scale(1.15);
        box-shadow: 0 6px 18px color-mix(in oklab, var(--accent) 60%, transparent);
    }

    .brightness-slider::-moz-range-thumb {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--accent);
        border: 3px solid var(--bg-surface);
        box-shadow: 0 4px 12px color-mix(in oklab, var(--accent) 40%, transparent);
        cursor: pointer;
    }

    .slider-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
    }

    .slider-value {
        font-size: 28px;
        font-weight: 800;
        color: var(--accent);
        line-height: 1;
    }

    .slider-range-label {
        font-size: 12px;
        color: var(--gray);
        font-weight: 600;
    }

    .preset-row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    .preset-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 700;
        border: 1.5px solid var(--border);
        background: var(--bg-card);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .preset-btn:hover {
        border-color: var(--accent);
        background: var(--accent-bg);
        transform: translateY(-2px);
    }

    .preset-btn.active {
        border-color: var(--accent);
        background: var(--accent-bg);
        box-shadow: 0 0 0 2px color-mix(in oklab, var(--accent) 25%, transparent);
    }

    .preview-box {
        margin-top: 24px;
        padding: 20px;
        border-radius: 14px;
        border: 1.5px dashed var(--border);
        background: var(--bg-card);
    }

    .preview-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--gray);
        margin-bottom: 12px;
    }

    .preview-inner {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }

    .preview-chip {
        padding: 14px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 700;
        text-align: center;
        transition: all 0.3s ease;
    }

    .preview-chip.accent {
        background: var(--accent);
        color: #fff;
    }

    .preview-chip.surface {
        background: var(--bg-surface);
        color: var(--text-primary);
        border: 1px solid var(--border);
    }

    .preview-chip.card {
        background: var(--bg-card);
        color: var(--text-primary);
        border: 1px solid var(--border);
    }
</style>

<div class="contrast-hero">
    <div style="position:relative;z-index:1;max-width:70ch;">
        <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.75;margin-bottom:8px;">Display</div>
        <h2 style="font-size:30px;font-weight:800;margin-bottom:8px;">উজ্জ্বলতা নিয়ন্ত্রণ</h2>
        <p style="line-height:1.75;opacity:0.9;">স্লাইডার ব্যবহার করে আপনার পছন্দমত উজ্জ্বলতা স্তর নির্বাচন করুন। এই পরিবর্তন সঙ্গে সঙ্গে প্রয়োগ হবে এবং মনে রাখা হবে।</p>
    </div>
</div>

<div class="contrast-card">
    <div class="contrast-label">
        <i class="fas fa-sun" style="color:var(--accent);"></i>
        উজ্জ্বলতা নিয়ন্ত্রণ
    </div>

    <div class="slider-wrap">
        <input
            type="range"
            id="brightness-slider"
            class="brightness-slider"
            min="70"
            max="130"
            value="100"
            step="1"
        >
        <div class="slider-meta">
            <span class="slider-range-label">কম (70%)</span>
            <span class="slider-value" id="brightness-value">100%</span>
            <span class="slider-range-label">বেশি (130%)</span>
        </div>
    </div>

    <div class="preset-row">
        <button class="preset-btn" data-value="70">
            🌑 কম
            <span style="opacity:0.6;font-size:11px;">70%</span>
        </button>
        <button class="preset-btn active" data-value="100">
            ☀️ স্বাভাবিক
            <span style="opacity:0.6;font-size:11px;">100%</span>
        </button>
        <button class="preset-btn" data-value="130">
            🔆 বেশি
            <span style="opacity:0.6;font-size:11px;">130%</span>
        </button>
    </div>

    <div class="preview-box">
        <div class="preview-label">লাইভ প্রিভিউ</div>
        <div class="preview-inner" id="preview-wrapper">
            <div class="preview-chip accent">Accent</div>
            <div class="preview-chip surface">Surface</div>
            <div class="preview-chip card">Card</div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
(function() {
    const slider = document.getElementById('brightness-slider');
    const valueDisplay = document.getElementById('brightness-value');
    const previewWrapper = document.getElementById('preview-wrapper');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const appWrapper = document.querySelector('.main-content');
    const STORAGE_KEY = 'contrast_level';

    function applyBrightness(val) {
        const pct = val + '%';
        if (appWrapper) {
            appWrapper.style.filter = 'brightness(' + pct + ')';
        }
        if (previewWrapper) {
            previewWrapper.style.filter = 'brightness(' + pct + ')';
        }
        if (valueDisplay) {
            valueDisplay.textContent = pct;
        }
        if (slider) {
            slider.value = val;
        }
        localStorage.setItem(STORAGE_KEY, val);

        presetBtns.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.value) === parseInt(val));
        });
    }

    // Load saved value
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
        applyBrightness(parseInt(saved));
    }

    if (slider) {
        slider.addEventListener('input', function() {
            applyBrightness(parseInt(this.value));
        });
    }

    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            applyBrightness(parseInt(this.dataset.value));
        });
    });
})();
</script>
@endpush

