@extends('layouts.app')
@section('title','এআই উপদেষ্টা')
@section('page-title','এআই আর্থিক উপদেষ্টা')

@section('topbar-actions')
<button onclick="generateAI()" class="btn btn-primary btn-sm" id="gen-btn">
    <i class="fas fa-magic"></i> নতুন বিশ্লেষণ তৈরি করুন
</button>
@endsection

@section('content')

@if($latestSuggestion)
    {{-- FIN SCORE BANNER --}}
    <div class="ai-card" style="margin-bottom:24px;">
        <div style="display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center;">
            <div style="text-align:center;">
                <div style="position:relative;width:100px;height:100px;">
                    <canvas id="fin-score-canvas" width="100" height="100"></canvas>
                    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
                        <div style="font-size:26px;font-weight:800;" id="fin-score-value">
                            {{ $latestSuggestion->fin_score }}</div>
                        <div style="font-size:9px;opacity:0.7;">/100</div>
                    </div>
                </div>
                <div style="font-size:11px;color:#a5b4fc;margin-top:6px;">FinScore™</div>
            </div>
            <div>
                <div style="font-size:12px;color:#a5b4fc;margin-bottom:6px;">এআই আর্থিক সারসংক্ষেপ</div>
                <p style="font-size:15px;font-weight:500;line-height:1.6;margin-bottom:16px;">
                    {{ $latestSuggestion->suggestion_data['financial_health_summary'] ?? 'এআই বিশ্লেষণ সম্পন্ন।' }}
                </p>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
                    <div style="background:rgba(255,255,255,0.1);border-radius:10px;padding:12px;text-align:center;">
                        <div style="font-size:20px;font-weight:800;">
                            {{ $currency }}{{ number_format($latestSuggestion->daily_limit, 0) }}</div>
                        <div style="font-size:11px;color:#a5b4fc;margin-top:4px;">দৈনিক ব্যয় সীমা</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.1);border-radius:10px;padding:12px;text-align:center;">
                        <div style="font-size:20px;font-weight:800;">
                            {{ $currency }}{{ number_format($latestSuggestion->suggestion_data['monthly_savings_target'] ?? 0, 0) }}
                        </div>
                        <div style="font-size:11px;color:#a5b4fc;margin-top:4px;">মাসিক সঞ্চয় লক্ষ্য</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.1);border-radius:10px;padding:12px;text-align:center;">
                        <div style="font-size:20px;font-weight:800;">
                            {{ $currency }}{{ number_format($latestSuggestion->suggestion_data['annual_savings_projection'] ?? 0, 0) }}
                        </div>
                        <div style="font-size:11px;color:#a5b4fc;margin-top:4px;">বার্ষিক পূর্বাভাস</div>
                    </div>
                </div>
            </div>
        </div>
        <div style="font-size:11px;color:#6366f1;margin-top:16px;">
            তৈরি {{ $latestSuggestion->generated_at?->diffForHumans() }} · মডেল:
            {{ $latestSuggestion->model_used }}
            · ব্যবহৃত টোকেন: {{ number_format($latestSuggestion->tokens_used) }}
        </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">

        {{-- BUDGET PLAN (Category-wise) --}}
        <div class="card">
            <div class="card-title">📋 বিভাগ অনুযায়ী মাসিক বাজেট পরিকল্পনা</div>
            @if(!empty($latestSuggestion->suggestion_data['budget_plan']['items']))
                <div style="margin-bottom:12px;padding:12px;background:#f0f9ff;border-radius:10px;font-size:13px;color:#1e40af;line-height:1.5;">
                    {{ $latestSuggestion->suggestion_data['budget_plan']['rule_explanation'] ?? '' }}
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>বিভাগ</th>
                                <th style="text-align:right;">সুপারিশ</th>
                                <th style="text-align:right;">প্রকৃত খরচ</th>
                                <th>অবস্থা</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($latestSuggestion->suggestion_data['budget_plan']['items'] as $bItem)
                                <tr>
                                    <td style="font-weight:600;">{{ $bItem['label'] }}</td>
                                    <td style="text-align:right;font-weight:700;color:var(--primary);">
                                        {{ $currency }}{{ number_format($bItem['recommended'], 0) }}
                                    </td>
                                    <td style="text-align:right;font-weight:700;color:{{ $bItem['status'] === 'over' ? 'var(--danger)' : 'var(--success)' }};">
                                        {{ $currency }}{{ number_format($bItem['actual'], 0) }}
                                    </td>
                                    <td style="font-size:12px;">{{ $bItem['advice'] }}</td>
                                </tr>
                            @endforeach
                            @if(!empty($latestSuggestion->suggestion_data['budget_plan']['savings']))
                                @php $sv = $latestSuggestion->suggestion_data['budget_plan']['savings']; @endphp
                                <tr style="background:#f0fdf4;font-weight:700;">
                                    <td>💰 সঞ্চয় ({{ $sv['percentage'] }}%)</td>
                                    <td style="text-align:right;color:var(--success);">{{ $currency }}{{ number_format($sv['recommended'], 0) }}</td>
                                    <td style="text-align:right;color:{{ $sv['actual'] >= $sv['recommended'] ? 'var(--success)' : 'var(--danger)' }};">
                                        {{ $currency }}{{ number_format($sv['actual'], 0) }}
                                    </td>
                                    <td style="font-size:12px;">{{ $sv['actual'] >= $sv['recommended'] ? '✅ লক্ষ্য পূরণ!' : '⚠️ আরো সঞ্চয় করুন' }}</td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                </div>
            @else
                <div style="text-align:center;padding:20px;color:var(--gray);">
                    <p>লেনদেন যোগ করুন এবং নতুন বিশ্লেষণ তৈরি করুন।</p>
                </div>
            @endif
        </div>

        {{-- FINANCIAL TIPS --}}
        <div class="card">
            <div class="card-title">💡 আর্থিক পরামর্শ</div>
            @foreach(($latestSuggestion->tips ?? []) as $i => $tip)
                <div
                    style="display:flex;gap:12px;align-items:flex-start;padding:14px;background:{{ $i % 2 === 0 ? '#f8fafc' : 'white' }};border-radius:10px;margin-bottom:8px;">
                    <div
                        style="width:28px;height:28px;background:var(--primary-light);color:var(--primary);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;">
                        {{ $i+1 }}</div>
                    <div style="font-size:14px;line-height:1.5;">{{ $tip }}</div>
                </div>
            @endforeach

            @if($latestSuggestion->suggestion_data['spending_warning'] ?? false)
                <div class="alert alert-warning" style="margin-top:12px;">
                    <i class="fas fa-exclamation-triangle"></i>
                    {{ $latestSuggestion->suggestion_data['spending_warning'] }}
                </div>
            @endif
        </div>

        {{-- ANOMALIES + INVESTMENT --}}
        <div>
            <div class="card" style="margin-bottom:16px;">
                <div class="card-title">⚠️ ব্যয় অসামঞ্জস্য</div>
                @if(count($latestSuggestion->anomalies ?? []) > 0)
                    @foreach($latestSuggestion->anomalies as $a)
                        <div class="anomaly-item">
                            <div class="anomaly-icon">📊</div>
                            <div class="anomaly-msg">
                                {{ $a['message'] ?? ($a['category'] . ' খরচ অস্বাভাবিকভাবে বেশি।') }}
                            </div>
                        </div>
                    @endforeach
                @else
                    <div style="text-align:center;padding:20px;color:var(--gray);">
                        <i class="fas fa-check-circle"
                            style="color:var(--success);font-size:28px;display:block;margin-bottom:8px;"></i>
                        এই মাসে কোনো অসামঞ্জস্য সনাক্ত হয়নি।
                    </div>
                @endif
            </div>

            <div class="card">
                <div class="card-title">📈 বিনিয়োগ পরামর্শ</div>
                <div style="font-size:14px;line-height:1.6;color:var(--dark);padding:4px 0;">
                    {{ $latestSuggestion->suggestion_data['investment_suggestion'] ?? 'প্রথমে আপনার জরুরি তহবিল গড়ে তুলুন।' }}
                </div>
                <div
                    style="margin-top:14px;padding:12px;background:#fef3c7;border-radius:10px;font-size:13px;color:#92400e;">
                    <strong>জরুরি তহবিল:</strong>
                    {{ $latestSuggestion->suggestion_data['emergency_fund_status'] ?? 'আপনার ৩-৬ মাসের খরচ মূল্যায়ন করুন।' }}
                </div>
            </div>
        </div>

    </div>

    {{-- SUGGESTION HISTORY --}}
    <div class="card" style="margin-top:24px;">
        <div class="card-title">📋 বিশ্লেষণ ইতিহাস</div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>তৈরি</th>
                        <th>ফিনস্কোর</th>
                        <th>দৈনিক সীমা</th>
                        <th>ব্যবহৃত টোকেন</th>
                        <th>মডেল</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($suggestions as $s)
                        <tr>
                            <td>{{ $s->generated_at?->translatedFormat('M d, Y H:i') }}</td>
                            <td>
                                <span
                                    style="font-weight:700;color:{{ $s->fin_score >= 70 ? 'var(--success)' : ($s->fin_score >= 40 ? 'var(--warning)' : 'var(--danger)') }}">
                                    {{ $s->fin_score }}/100
                                </span>
                            </td>
                            <td>{{ $currency }}{{ number_format($s->daily_limit, 0) }}</td>
                            <td>{{ number_format($s->tokens_used) }}</td>
                            <td><span class="badge badge-saving">{{ $s->model_used }}</span></td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

@else
    {{-- NO SUGGESTIONS YET --}}
    <div class="card" style="text-align:center;padding:60px;">
        <div style="font-size:64px;margin-bottom:20px;">🤖</div>
        <h2 style="font-size:22px;font-weight:700;margin-bottom:12px;">এখনো কোনো এআই বিশ্লেষণ হয়নি</h2>
        <p style="color:var(--gray);font-size:15px;margin-bottom:24px;">কিছু লেনদেন যোগ করুন এবং ব্যক্তিগত আর্থিক পরামর্শ ও খাদ্য সুপারিশ পেতে আপনার প্রথম এআই বিশ্লেষণ তৈরি করুন।</p>
        <button onclick="generateAI()" class="btn btn-primary">
            <i class="fas fa-magic"></i> প্রথম বিশ্লেষণ তৈরি করুন
        </button>
    </div>
@endif

@endsection

@push('scripts')
    <script>
        async function generateAI() {
            const btn = document.getElementById('gen-btn');
            if (btn) {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> বিশ্লেষণ হচ্ছে...';
                btn.disabled = true;
            }
            try {
                const res = await apiCall('/ai/generate', 'POST');
                showToast(res.message || 'বিশ্লেষণ শুরু হয়েছে!', 'success');

                // Poll for result then reload
                setTimeout(async () => {
                    try {
                        const suggestion = await apiCall('/ai/suggestions');
                        if (suggestion && suggestion.success && suggestion.data) {
                            showToast('এআই বিশ্লেষণ সম্পন্ন! রিফ্রেশ হচ্ছে...', 'success');
                            setTimeout(() => location.reload(), 1000);
                        } else {
                            setTimeout(() => location.reload(), 3000);
                        }
                    } catch (pollErr) {
                        setTimeout(() => location.reload(), 3000);
                    }
                }, 2000);
            } catch (e) {
                showToast(e.message || 'এআই তৈরি ব্যর্থ হয়েছে। আবার চেষ্টা করুন।', 'danger');
                if (btn) {
                    btn.innerHTML = '<i class="fas fa-magic"></i> নতুন বিশ্লেষণ তৈরি করুন';
                    btn.disabled = false;
                }
            }
        }

    </script>
@endpush
