@php
    $pageTitle = trim($__env->yieldContent('page-title', 'Dashboard'));
    $isDashboard = request()->routeIs('dashboard');
    $isAiPage = request()->routeIs('ai.*');
@endphp

<div class="topbar">
    <div class="topbar-left">
        <button type="button" class="menu-toggle" id="menu-toggle" title="মেনু (M)" data-tip="Press M to open menu" aria-label="মেনু টগল">
            <i class="fas fa-bars"></i>
        </button>

        <div class="topbar-shortcuts">
            <a href="{{ route('dashboard') }}" class="topbar-shortcut {{ $isDashboard ? 'is-current' : '' }}">
                <i class="fas fa-house"></i>
                <span>Home</span>
            </a>
            <a href="{{ route('ai.index') }}" class="topbar-shortcut {{ $isAiPage ? 'is-current' : '' }}">
                <i class="fas fa-robot"></i>
                <span>AI Use</span>
            </a>
            
        </div>
    </div>

    <div class="topbar-center">
        <div class="topbar-heading">
            <div class="topbar-title">{{ $pageTitle }}</div>
            <div class="topbar-subtitle">{{ now()->translatedFormat('l, F j Y') }}</div>
        </div>
    </div>

    <div class="topbar-right">
        <div class="topbar-actions">
        @yield('topbar-actions')
        </div>
        <div style="display:flex;align-items:center;gap:12px;margin-left:12px;">
            <a href="{{ route('finscore.show') }}" id="finscore-btn" title="FinScore" style="display:flex;align-items:center;gap:8px;padding:6px 8px;text-decoration:none;color:inherit;border-radius:10px;transition:transform 120ms ease, box-shadow 120ms ease;">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle cx="22" cy="22" r="20" stroke="var(--border)" stroke-width="4" />
                    <circle cx="22" cy="22" r="20" stroke="var(--income)" stroke-width="4" stroke-dasharray="126" stroke-dashoffset="40" stroke-linecap="round" transform="rotate(-90 22 22)" />
                </svg>
                <div style="display:flex;flex-direction:column;align-items:flex-start;">
                    <div style="font-weight:800;font-size:13px;color:var(--text-primary);">FinScore</div>
                    <div id="topbar-finscore" style="font-size:11px;color:var(--text-muted);">—</div>
                </div>
            </a>
        </div>
        <style>
            #finscore-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
            #finscore-btn:focus-visible { outline: 2px solid color-mix(in oklab, var(--accent) 70%, #fff); }
            #finscore-tooltip { position: absolute; top: calc(100% + 8px); right: 10px; background: var(--bg-card); color: var(--text-primary); padding:6px 10px; border-radius:8px; font-size:12px; display:none; box-shadow:0 8px 24px rgba(0,0,0,0.32); }
            #finscore-btn:hover + #finscore-tooltip, #finscore-btn:focus + #finscore-tooltip { display:block; }
        </style>
        <div id="finscore-tooltip">Click to open detailed FinScore report</div>
        <button id="ai-history-toggle" title="AI History" style="margin-left:12px;background:none;border:none;cursor:pointer;font-size:18px;color:var(--gray)">
            <i class="fas fa-history"></i>
            <span id="ai-history-count" style="font-size:12px;margin-left:6px;color:var(--primary)"></span>
        </button>
    </div>
    @push('scripts')
    <script>
        (function(){
            // fetch the finscore summary and update topbar label
            fetch("{{ route('finscore.summary') }}", {credentials: 'same-origin'})
                .then(r => r.json())
                .then(data => {
                    const el = document.getElementById('topbar-finscore');
                    if (el && data && data.score !== undefined) el.textContent = data.score;
                }).catch(()=>{});
        })();
    </script>
    @endpush
</div>
