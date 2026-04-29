@extends('layouts.app')
@section('title','FinScore')
@section('page-title','FinScore')

@section('content')
<div class="db-section">
    <div class="db-section-header">
        <div class="db-section-title"><i class="fas fa-chart-line db-section-icon"></i> আপনার FinScore — বিশদ</div>
    </div>

    <div class="db-stat-grid">
        <div class="db-stat-card">
            <div class="db-stat-header">
                <div>
                    <div class="db-stat-label">মোট আয়</div>
                    <div class="db-stat-value">{{ number_format($income ?? 0,2) }}</div>
                </div>
                <div class="db-stat-icon-wrap income"><i class="fas fa-dollar-sign"></i></div>
            </div>
            <div class="db-stat-sub">সর্বমোট আয়</div>
        </div>

        <div class="db-stat-card">
            <div class="db-stat-header">
                <div>
                    <div class="db-stat-label">মোট ব্যয়</div>
                    <div class="db-stat-value">{{ number_format($expense ?? 0,2) }}</div>
                </div>
                <div class="db-stat-icon-wrap expense"><i class="fas fa-receipt"></i></div>
            </div>
            <div class="db-stat-sub">সর্বমোট ব্যয়</div>
        </div>

        <div class="db-stat-card">
            <div class="db-stat-header">
                <div>
                    <div class="db-stat-label">মোট বিনিয়োগ</div>
                    <div class="db-stat-value">{{ number_format($invest ?? 0,2) }}</div>
                </div>
                <div class="db-stat-icon-wrap balance"><i class="fas fa-seedling"></i></div>
            </div>
            <div class="db-stat-sub">সর্বমোট বিনিয়োগ</div>
        </div>
    </div>

    <div class="db-section" style="margin-top:12px">
        <div class="db-section-header">
            <div class="db-section-title"><i class="fas fa-calendar-week db-section-icon"></i> সাম্প্রতিক মাসিক প্রবাহ (১২ মাস)</div>
        </div>
        <div class="db-table-card">
            <canvas id="monthlyChart" width="800" height="240" style="max-width:100%"></canvas>
        </div>
    </div>

    <div class="db-section" style="margin-top:12px">
        <div class="db-section-header">
            <div class="db-section-title"><i class="fas fa-calendar-alt db-section-icon"></i> সাম্প্রতিক সাপ্তাহিক সারসংক্ষেপ</div>
        </div>
        <div class="db-table-card">
            <canvas id="weeklyChart" width="800" height="240" style="max-width:100%"></canvas>
        </div>
    </div>
    <div style="margin-top:20px;display:flex;align-items:center;gap:18px;flex-wrap:wrap">
        <div style="width:200px;height:200px;position:relative">
            <svg viewBox="0 0 100 100" style="width:100%;height:100%">
                <circle cx="50" cy="50" r="45" stroke="#eef6f2" stroke-width="10" fill="none" />
                <circle cx="50" cy="50" r="45" stroke="#10b981" stroke-width="10" fill="none" stroke-dasharray="282" stroke-dashoffset="{{ 282 - (282 * ($score/100)) }}" transform="rotate(-90 50 50)" stroke-linecap="round" />
            </svg>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;font-weight:800;font-size:24px">{{ $score }}</div>
        </div>
        <div style="flex:1;min-width:260px">
            <div class="db-finscore-card">
                <div class="db-finscore-title">FinScore</div>
                <div class="db-finscore-ring-wrap" style="margin:0 auto 12px;">
                    <svg viewBox="0 0 100 100" style="width:120px;height:120px;display:block;margin:0 auto">
                        <circle cx="50" cy="50" r="45" stroke="#eef6f2" stroke-width="8" fill="none" />
                        <circle cx="50" cy="50" r="45" stroke="#10b981" stroke-width="8" fill="none" stroke-dasharray="282" stroke-dashoffset="{{ 282 - (282 * ($score/100)) }}" transform="rotate(-90 50 50)" stroke-linecap="round" />
                    </svg>
                    <div class="db-finscore-value"><div class="db-finscore-number">{{ $score }}</div><div class="db-finscore-max">/100</div></div>
                </div>
                <div class="db-finscore-desc">এই স্কোরটি আপনার সাম্প্রতিক সঞ্চয় ও বিনিয়োগের উপর ভিত্তি করে হিসাব করা হয়েছে। উচ্চ স্কোর মানে ভাল সঞ্চয় হার ও বিনিয়োগ মনোভাব।</div>
            </div>
        </div>
    </div>

</div>
@endsection

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    (function(){
        const monthly = @json($monthly->reverse()->values());
        const weekly = @json($weekly->reverse()->values());

        const mLabels = monthly.map(m => m.m || m.m);
        const mIncome = monthly.map(m => Number(m.income || 0));
        const mExpense = monthly.map(m => Number(m.expense || 0));

        const ctxM = document.getElementById('monthlyChart').getContext('2d');
        new Chart(ctxM, {
            type: 'line',
            data: { labels: mLabels, datasets: [
                { label: 'Income', data: mIncome, borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.08)', tension: 0.3 },
                { label: 'Expense', data: mExpense, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.06)', tension: 0.3 }
            ]},
            options: { responsive:true, maintainAspectRatio:false }
        });

        const wLabels = weekly.map(w => w.yw || w.yw);
        const wIncome = weekly.map(w => Number(w.income || 0));
        const wExpense = weekly.map(w => Number(w.expense || 0));
        const ctxW = document.getElementById('weeklyChart').getContext('2d');
        new Chart(ctxW, {
            type: 'bar',
            data: { labels: wLabels, datasets: [
                { label: 'Income', data: wIncome, backgroundColor: '#10b981' },
                { label: 'Expense', data: wExpense, backgroundColor: '#ef4444' }
            ]},
            options: { responsive:true, maintainAspectRatio:false }
        });
    })();
</script>
@endpush
