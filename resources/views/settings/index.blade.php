@extends('layouts.app')
@section('title', 'সেটিংস')
@section('page-title', 'সেটিংস')

@section('content')
<style>
    :root { --accent: var(--accent); }
    .settings-shell { display:grid; grid-template-columns: 320px 1fr; gap:20px; align-items:start; }
    .settings-panel { background: var(--bg-surface); border:1px solid var(--border); border-radius:14px; padding:18px; box-shadow:0 6px 20px rgba(2,6,23,0.6); }
    .settings-hero { background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border-radius:14px; padding:26px; color:var(--text-primary); position:relative; overflow:hidden; }
    .settings-hero h2 { font-size:28px; margin:0 0 8px; font-weight:800; }
    .settings-hero p { margin:0; color:var(--text-muted); }

    /* Left sidebar links */
    .settings-left { display:flex; flex-direction:column; gap:12px; }
    .settings-nav { display:flex; flex-direction:column; gap:8px; }
    .settings-nav a { display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:10px; color:var(--text-muted); text-decoration:none; border:1px solid transparent; }
    .settings-nav a.active, .settings-nav a:hover { background:var(--bg-card); color:var(--text-primary); border-color:rgba(255,255,255,0.03); transform:translateX(3px); }

    /* Right content grid */
    .settings-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap:16px; margin-top:12px; }
    .card { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:16px; }
    .card .title { font-weight:800; margin-bottom:8px; color:var(--text-primary); }
    .card .desc { color:var(--text-muted); font-size:13px; }

    /* Theme cards */
    .mood-grid { display:grid; grid-template-columns: repeat(3,1fr); gap:12px; }
    .mood-card { background:var(--bg-card); border:1px solid var(--border); padding:12px; border-radius:12px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; transition:transform .18s ease, border-color .18s ease; }
    .mood-card:hover { transform:scale(1.03); }
    .mood-card.active { border:2px solid var(--accent); }
    .swatches { display:flex; gap:8px; }
    .swatches .dot { width:12px; height:12px; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.3) inset; }

    /* Contrast */
    .contrast-row { display:flex; gap:12px; align-items:center; }
    .contrast-row input[type=range] { flex:1; }
    .presets { display:flex; gap:8px; }
    .presets button { padding:8px 12px; border-radius:8px; background:transparent; border:1px solid var(--border); color:var(--text-primary); cursor:pointer; }

    @media (max-width:1100px){ .settings-shell{grid-template-columns:1fr;} .mood-grid{grid-template-columns:repeat(2,1fr);} }
</style>

<div class="settings-shell">
    <div class="settings-left">
        <div class="settings-panel">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <div>
                    <div style="font-size:12px;color:var(--text-muted);letter-spacing:0.12em;text-transform:uppercase;">Settings</div>
                    <div style="font-weight:800;font-size:18px;color:var(--text-primary);">কনফিগারেশন</div>
                </div>
            </div>
            <nav class="settings-nav">
                <a href="{{ route('dashboard') }}"><i class="fas fa-tachometer-alt"></i> ড্যাশবোর্ড</a>
                <a href="{{ route('settings.theme') }}" class="active"><i class="fas fa-palette"></i> Theme</a>
                <a href="{{ route('settings.preferences') }}"><i class="fas fa-language"></i> Language</a>
                <a href="{{ route('settings.contrast') }}"><i class="fas fa-adjust"></i> Contrast</a>
                <a href="{{ route('settings.ai') }}"><i class="fas fa-robot"></i> AI Engine</a>
            </nav>
        </div>

        <div class="settings-panel" style="margin-top:12px;">
            <div style="font-weight:800;color:var(--text-primary);margin-bottom:8px;">Quick Actions</div>
            <div style="display:flex;flex-direction:column;gap:8px;"><a class="card" href="{{ route('transactions.index') }}">বলেনদেন দেখুন</a><a class="card" href="{{ route('logout') }}">Logout</a></div>
        </div>
    </div>

    <div>
        <div class="settings-hero">
            <h2>Complete Settings and Personalization</h2>
            <p>Top-left menu থেকে দ্রুত access করার জন্য AI, theme, language, contrast, logout সহ সব option এখানে সাজানো আছে।</p>
        </div>

        <div class="settings-grid">
            <div class="card">
                <div class="title">Theme</div>
                <div class="desc">৬টি mood থেকে আপনার dashboard look নির্বাচন করুন।</div>
                <div style="margin-top:12px;" class="mood-grid">
                    @php
                        $moods = [
                            ['key'=>'system','label'=>'Default','sw'=>['var(--accent)','var(--bg-surface)','var(--bg-card)']],
                            ['key'=>'dark','label'=>'Dark','sw'=>['#818CF8','#0B0F23','#0F1629']],
                            ['key'=>'light','label'=>'Light','sw'=>['#4F46E5','#FFFFFF','#F1F5F9']],
                            ['key'=>'midnight','label'=>'Midnight Blue','sw'=>['#0EA5E9','#041628','#072035']],
                            ['key'=>'emerald','label'=>'Emerald','sw'=>['#10B981','#041F0E','#062B14']],
                            ['key'=>'sunset','label'=>'Sunset','sw'=>['#F59E0B','#1F1000','#2D1800']],
                        ];
                    @endphp
                    @foreach($moods as $m)
                        <form method="POST" action="{{ route('settings.theme.apply') }}">
                            @csrf
                            <input type="hidden" name="mood" value="{{ $m['key'] }}" />
                            <button type="submit" class="mood-card {{ $activeMood === $m['key'] ? 'active' : '' }}">
                                <div style="text-align:left">
                                    <div style="font-weight:800;color:var(--text-primary);">{{ $m['label'] }}</div>
                                </div>
                                <div class="swatches">
                                    @foreach($m['sw'] as $s)
                                        <span class="dot" style="background:{{ $s }}"></span>
                                    @endforeach
                                </div>
                            </button>
                        </form>
                    @endforeach
                </div>
            </div>

            <div class="card">
                <div class="title">উজ্জ্বলতা নিয়ন্ত্রণ</div>
                <div class="desc">স্ক্রিন উজ্জ্বলতা 70% - 130% পর্যন্ত নিয়ন্ত্রণ করুন। সরাসরি প্রিভিউ দেখতে slider টেনে দেখুন।</div>
                <div style="margin-top:12px;">
                    <form method="POST" action="{{ route('settings.contrast.apply') }}">
                        @csrf
                        <div class="contrast-row">
                            <input id="contrastRange" name="contrast" type="range" min="70" max="130" value="{{ $contrast ?? 100 }}" />
                            <div style="width:48px;text-align:center;color:var(--text-primary);font-weight:800;">{{ $contrast ?? 100 }}%</div>
                        </div>
                        <div style="margin-top:12px;" class="presets">
                            <button type="button" onclick="setContrast(70)">🌑 কম</button>
                            <button type="button" onclick="setContrast(100)">☀️ স্বাভাবিক</button>
                            <button type="button" onclick="setContrast(130)">🔆 বেশি</button>
                        </div>
                        <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;">
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </div>
</div>

<script>
    (function(){
        const range = document.getElementById('contrastRange');
        if(!range) return;
        const wrapper = document.getElementById('app') || document.body;
        function apply(v){
            try{ wrapper.style.filter = `brightness(${v}%)`; localStorage.setItem('contrast_level', v); }catch(e){}
            const label = range.nextElementSibling || null;
            // update visible percent if needed
        }
        range.addEventListener('input', e=> apply(e.target.value));
        window.setContrast = function(v){ range.value = v; apply(v); }
        // load saved
        try{ const s = localStorage.getItem('contrast_level'); if(s) apply(s);}catch{}
    })();
</script>
