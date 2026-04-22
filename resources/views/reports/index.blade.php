@extends('layouts.app')
@section('title','রিপোর্ট')
@section('page-title','আর্থিক রিপোর্ট')

@section('topbar-actions')
<a href="{{ route('reports.export.pdf', 'monthly') }}"
    class="btn btn-danger btn-sm">
    <i class="fas fa-file-pdf"></i> পিডিএফ রপ্তানি
</a>
<a href="{{ route('reports.export.excel', 'monthly') }}"
    class="btn btn-success btn-sm">
    <i class="fas fa-file-excel"></i> এক্সেল রপ্তানি
</a>
@endsection

@section('content')

<style>
    .report-hero {
        background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #0ea5e9 100%);
        color: #fff;
        border-radius: 18px;
        padding: 28px 30px;
        margin-bottom: 24px;
        position: relative;
        overflow: hidden;
    }

    .report-hero::after {
        content: '';
        position: absolute;
        inset: auto -40px -60px auto;
        width: 220px;
        height: 220px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.09);
        filter: blur(2px);
    }

    .report-hero-grid {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 20px;
        align-items: center;
    }

    .report-hero-title {
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -0.03em;
        margin-bottom: 8px;
    }

    .report-hero-subtitle {
        color: rgba(255, 255, 255, 0.78);
        line-height: 1.6;
        max-width: 58ch;
    }

    .report-metric-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
    }

    .report-metric {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 14px;
        padding: 14px;
        text-align: center;
        backdrop-filter: blur(8px);
    }

    .report-metric-value {
        font-size: 20px;
        font-weight: 800;
        line-height: 1.1;
    }

    .report-metric-label {
        font-size: 11px;
        margin-top: 5px;
        color: rgba(255, 255, 255, 0.72);
    }

    .report-section {
        margin-bottom: 24px;
    }
</style>

<div class="report-hero">
    <div class="report-hero-grid">
        <div>
            <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.65);margin-bottom:12px;">Financial overview</div>
            <div class="report-hero-title">রিপোর্টিং ড্যাশবোর্ড</div>
            <p class="report-hero-subtitle">
                মাসিক ও বার্ষিক পারফরম্যান্স, ব্যয় বিশ্লেষণ, এবং ভবিষ্যৎ খরচের পূর্বাভাস এক জায়গায় দেখুন।
            </p>
        </div>
        <div class="report-metric-grid">
            <div class="report-metric">
                <div class="report-metric-value">{{ $currency }}{{ number_format($monthlyReport['total_income'], 0) }}</div>
                <div class="report-metric-label">এই মাসের আয়</div>
            </div>
            <div class="report-metric">
                <div class="report-metric-value">{{ $currency }}{{ number_format($monthlyReport['total_expense'], 0) }}</div>
                <div class="report-metric-label">এই মাসের খরচ</div>
            </div>
            <div class="report-metric">
                <div class="report-metric-value">{{ $monthlyReport['savings_rate'] }}%</div>
                <div class="report-metric-label">সঞ্চয় হার</div>
            </div>
        </div>
    </div>
</div>

{{-- MONTHLY REPORT --}}
<div class="report-section" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
    <div class="card">
        <div class="card-title">📅 এই মাস — {{ $monthlyReport['label'] }}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
            <div style="padding:14px;background:#d1fae5;border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:#065f46;">
                    {{ $currency }}{{ number_format($monthlyReport['total_income'],0) }}</div>
                <div style="font-size:11px;color:#065f46;font-weight:600;">মোট আয়</div>
            </div>
            <div style="padding:14px;background:#fee2e2;border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:#991b1b;">
                    {{ $currency }}{{ number_format($monthlyReport['total_expense'],0) }}</div>
                <div style="font-size:11px;color:#991b1b;font-weight:600;">মোট খরচ</div>
            </div>
            <div style="padding:14px;background:#dbeafe;border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:#1e40af;">
                    {{ $currency }}{{ number_format($monthlyReport['total_saving'],0) }}</div>
                <div style="font-size:11px;color:#1e40af;font-weight:600;">মোট সঞ্চয়</div>
            </div>
            <div
                style="padding:14px;background:{{ $monthlyReport['net_balance'] >= 0 ? '#d1fae5' : '#fee2e2' }};border-radius:10px;text-align:center;">
                <div
                    style="font-size:22px;font-weight:800;color:{{ $monthlyReport['net_balance'] >= 0 ? '#065f46' : '#991b1b' }};">
                    {{ $currency }}{{ number_format(abs($monthlyReport['net_balance']),0) }}
                </div>
                <div
                    style="font-size:11px;font-weight:600;color:{{ $monthlyReport['net_balance'] >= 0 ? '#065f46' : '#991b1b' }};">
                    নিট
                    {{ $monthlyReport['net_balance'] >= 0 ? 'উদ্বৃত্ত' : 'ঘাটতি' }}
                </div>
            </div>
        </div>
        <div
            style="padding:12px;background:var(--light);border-radius:10px;display:flex;justify-content:space-between;">
            <span style="font-size:13px;">সঞ্চয় হার:</span>
            <span
                style="font-weight:700;color:{{ $monthlyReport['savings_rate'] >= 20 ? 'var(--success)' : 'var(--warning)' }}">{{ $monthlyReport['savings_rate'] }}%</span>
        </div>
        <div
            style="padding:12px;background:var(--light);border-radius:10px;display:flex;justify-content:space-between;margin-top:8px;">
            <span style="font-size:13px;">দৈনিক গড় ব্যয়:</span>
            <span
                style="font-weight:700;">{{ $currency }}{{ number_format($monthlyReport['daily_avg_spend'],0) }}</span>
        </div>
    </div>

    {{-- ANNUAL REPORT --}}
    <div class="card">
        <div class="card-title">📆 {{ $annualReport['label'] }} সারসংক্ষেপ</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
            <div style="padding:14px;background:#d1fae5;border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:#065f46;">
                    {{ $currency }}{{ number_format($annualReport['total_income'],0) }}</div>
                <div style="font-size:11px;color:#065f46;font-weight:600;">বার্ষিক আয়</div>
            </div>
            <div style="padding:14px;background:#fee2e2;border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:#991b1b;">
                    {{ $currency }}{{ number_format($annualReport['total_expense'],0) }}</div>
                <div style="font-size:11px;color:#991b1b;font-weight:600;">বার্ষিক খরচ</div>
            </div>
            <div style="padding:14px;background:#dbeafe;border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:#1e40af;">
                    {{ $currency }}{{ number_format($annualReport['total_saving'],0) }}</div>
                <div style="font-size:11px;color:#1e40af;font-weight:600;">বার্ষিক সঞ্চয়</div>
            </div>
            <div style="padding:14px;background:var(--light);border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:var(--dark);">
                    {{ $currency }}{{ number_format($annualReport['monthly_avg'],0) }}</div>
                <div style="font-size:11px;font-weight:600;color:var(--gray);">মাসিক গড় ব্যয়</div>
            </div>
        </div>
        <div
            style="padding:12px;background:var(--light);border-radius:10px;display:flex;justify-content:space-between;">
            <span style="font-size:13px;">বার্ষিক সঞ্চয় হার:</span>
            <span
                style="font-weight:700;color:{{ $annualReport['savings_rate'] >= 20 ? 'var(--success)' : 'var(--warning)' }}">{{ $annualReport['savings_rate'] }}%</span>
        </div>
    </div>
</div>

{{-- EXPENSE BREAKDOWN --}}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;">
    <div class="card">
        <div class="card-title">🏷️ খরচের বিভাগ বিশ্লেষণ</div>
        @forelse($monthlyReport['category_breakdown'] as $cat => $amount)
            <div
                style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9;">
                @php $catLabels = $catLabels ?? array_merge(\App\Models\Transaction::expenseCategories(), \App\Models\Transaction::incomeCategories()); @endphp
                <span style="font-size:13px;font-weight:500;">{{ $catLabels[$cat] ?? ucfirst($cat) }}</span>
                <div style="text-align:right;">
                    <span style="font-weight:700;color:var(--danger)">{{ $currency }}{{ number_format($amount,0) }}</span>
                    @if($monthlyReport['total_expense'] > 0)
                        <span
                            style="font-size:11px;color:var(--gray);display:block;">{{ round(($amount/$monthlyReport['total_expense'])*100,1) }}%</span>
                    @endif
                </div>
            </div>
        @empty
            <div style="text-align:center;color:var(--gray);padding:20px;">এই মাসে কোনো খরচের তথ্য নেই।</div>
        @endforelse
    </div>

    {{-- FORECAST --}}
    <div class="card">
        <div class="card-title">🔮 ৩ মাসের খরচ পূর্বাভাস</div>
        @foreach($forecast as $f)
            <div
                style="padding:16px;border:1px solid var(--border);border-radius:12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <div style="font-size:14px;font-weight:700;">{{ $f['month'] }}</div>
                    <div style="font-size:12px;color:var(--gray);">পূর্বাভাসিত খরচ</div>
                </div>
                <div style="font-size:20px;font-weight:800;color:var(--primary);">
                    {{ $currency }}{{ number_format($f['predicted_expense'],0) }}</div>
            </div>
        @endforeach
        <div style="padding:12px;background:#fef3c7;border-radius:10px;font-size:12px;color:#92400e;margin-top:8px;">
            ⚠️ পূর্বাভাস আপনার গত ৬ মাসের ব্যয়ের প্রবণতার উপর ভিত্তি করে লিনিয়ার রিগ্রেশন ব্যবহার করে করা হয়েছে।
        </div>
    </div>
</div>

@endsection
