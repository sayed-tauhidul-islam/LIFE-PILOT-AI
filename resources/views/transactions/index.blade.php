@extends('layouts.app')
@section('title','লেনদেন')
@section('page-title','লেনদেন')

@section('topbar-actions')
<a href="{{ route('transactions.create') }}" class="btn btn-primary btn-sm">
    <i class="fas fa-plus"></i> লেনদেন যোগ করুন
</a>
@endsection

@section('content')

{{-- TOTALS --}}
<div class="stat-grid" style="margin-bottom:20px;">
    <div class="stat-card income">
        <div class="stat-icon"><i class="fas fa-arrow-down"></i></div>
        <div class="stat-label">আয়</div>
        <div class="stat-value">{{ $currency }}{{ number_format($totals['income'], 0) }}</div>
    </div>
    <div class="stat-card expense">
        <div class="stat-icon"><i class="fas fa-arrow-up"></i></div>
        <div class="stat-label">খরচ</div>
        <div class="stat-value">{{ $currency }}{{ number_format($totals['expense'], 0) }}</div>
    </div>
    <div class="stat-card saving">
        <div class="stat-icon"><i class="fas fa-piggy-bank"></i></div>
        <div class="stat-label">সঞ্চয়</div>
        <div class="stat-value">{{ $currency }}{{ number_format($totals['saving'], 0) }}</div>
    </div>
    <div class="stat-card balance">
        <div class="stat-icon"><i class="fas fa-balance-scale"></i></div>
        <div class="stat-label">ব্যালেন্স</div>
        <div class="stat-value">
            {{ $currency }}{{ number_format($totals['income'] - $totals['expense'], 0) }}
        </div>
    </div>
</div>

{{-- FILTERS --}}
<div class="card" style="margin-bottom:16px;">
    <form method="GET" style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <div>
            <label style="font-size:12px;font-weight:600;color:var(--gray);">সময়কাল</label>
            <select name="period" onchange="this.form.submit()" class="form-control" style="margin-top:4px;">
                @php $periodLabels = ['daily'=>'দৈনিক','weekly'=>'সাপ্তাহিক','monthly'=>'মাসিক','annual'=>'বার্ষিক']; @endphp
                @foreach(['daily', 'weekly', 'monthly', 'annual'] as $p)
                    <option value="{{ $p }}"
                        {{ $period === $p ? 'selected' : '' }}>
                        {{ $periodLabels[$p] }}</option>
                @endforeach
            </select>
        </div>
        <div>
            <label style="font-size:12px;font-weight:600;color:var(--gray);">ধরন</label>
            <select name="type" onchange="this.form.submit()" class="form-control" style="margin-top:4px;">
                <option value="all"
                    {{ $type === 'all' ? 'selected' : '' }}>
                    সব</option>
                <option value="income"
                    {{ $type === 'income' ? 'selected' : '' }}>
                    আয়</option>
                <option value="expense"
                    {{ $type === 'expense' ? 'selected' : '' }}>
                    খরচ</option>
                <option value="saving"
                    {{ $type === 'saving' ? 'selected' : '' }}>
                    সঞ্চয়</option>
            </select>
        </div>
    </form>
</div>

{{-- TRANSACTION TABLE --}}
<div class="card">
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>তারিখ</th>
                    <th>বিবরণ</th>
                    <th>বিভাগ</th>
                    <th>পেমেন্ট</th>
                    <th>ধরন</th>
                    <th>পরিমাণ</th>
                    <th>কার্যক্রম</th>
                </tr>
            </thead>
            <tbody>
                @forelse($transactions as $t)
                    <tr style="background: {{ $t->type === 'income' ? 'rgba(16,185,129,0.03)' : ($t->type === 'expense' ? 'rgba(239,68,68,0.03)' : 'rgba(59,130,246,0.03)') }};">
                        <td style="color:var(--gray);font-size:12px;">
                            {{ \Carbon\Carbon::parse($t->date)->translatedFormat('M d, Y') }}
                        </td>
                        <td>
                            <div style="font-weight:600;font-size:13px;">{{ $t->description }}</div>
                            @if($t->notes)
                                <div style="font-size:11px;color:var(--gray);">{{ $t->notes }}</div>
                            @endif
                        </td>
                        @php $catLabels = array_merge(\App\Models\Transaction::expenseCategories(), \App\Models\Transaction::incomeCategories()); @endphp
                        <td>{{ $catLabels[$t->category] ?? ucfirst($t->category) }}</td>
                        <td style="font-size:12px;color:var(--gray);">
                            @php $payLabels = ['cash'=>'নগদ','card'=>'কার্ড','bank'=>'ব্যাংক','mobile'=>'মোবাইল']; @endphp
                            {{ $payLabels[$t->payment_method ?? 'cash'] ?? ucfirst($t->payment_method ?? 'cash') }}</td>
                        <td>@php $typeLabels = ['income'=>'আয়','expense'=>'খরচ','saving'=>'সঞ্চয়']; @endphp
                        <span class="badge badge-{{ $t->type }}">{{ $typeLabels[$t->type] ?? ucfirst($t->type) }}</span></td>
                        <td
                            style="font-weight:700;color:{{ $t->type === 'income' ? 'var(--success)' : ($t->type === 'expense' ? 'var(--danger)' : 'var(--info)') }}">
                            {{ $t->type === 'income' ? '+' : '-' }}{{ $currency }}{{ number_format($t->amount, 0) }}
                        </td>
                        <td>
                            <div style="display:flex;gap:6px;align-items:center;">
                                <a href="{{ route('transactions.edit', $t->id) }}"
                                    class="btn btn-outline btn-sm">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <button onclick="deleteTransaction('{{ $t->id }}')" class="btn btn-danger btn-sm">
                                    <i class="fas fa-trash"></i>
                                </button>
                                @if(!empty($t->created_by_ai))
                                    <span class="badge badge-info" style="margin-left:8px;font-size:11px;padding:6px;border-radius:6px;">Added by AI</span>
                                    <button class="btn btn-ghost btn-sm" onclick="undoAi('{{ $t->id }}')" style="margin-left:6px;font-size:12px;">Undo</button>
                                @endif
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" style="text-align:center;color:var(--gray);padding:40px;">
                            <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                                <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="4" y="10" width="112" height="60" rx="10" fill="#ecfdf5" stroke="#bbf7d0" />
                                    <path d="M18 50 L40 30 L60 44 L82 22 L102 40" stroke="#16a34a" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <div style="font-weight:700;font-size:16px;color:var(--dark);">কোনো লেনদেন পাওয়া যায়নি</div>
                                <div style="color:var(--gray);max-width:420px">এখনও কোনো লেনদেন মোতাবেক ডাটা পাওয়া যায়নি — প্রথম লেনদেন যোগ করতে নিচের বাটনে ক্লিক করুন অথবা AI ব্যবহার করে কণ্ঠ বা চ্যাট দিয়ে দ্রুত যোগ করুন।</div>
                                <a href="{{ route('transactions.create') }}" class="btn btn-primary" style="margin-top:8px;">আপনার প্রথম লেনদেন যোগ করুন</a>
                            </div>
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <div style="margin-top:16px;">
        {{ $transactions->appends(request()->query())->links() }}
    </div>
</div>
@endsection

@push('scripts')
    <script>
        async function deleteTransaction(id) {
            if (!confirm('এই লেনদেন মুছে ফেলবেন?')) return;
            try {
                const res = await apiCall(`/transactions/${id}`, 'DELETE');
                if (res.success) {
                    showToast('লেনদেন মুছে ফেলা হয়েছে!', 'success');
                    setTimeout(() => location.reload(), 800);
                }
            } catch (e) {
                showToast('মুছে ফেলা ব্যর্থ হয়েছে।', 'danger');
            }
        }

        async function undoAi(id) {
            if (!confirm('AI দ্বারা যোগ করা এই লেনদেনটি ফিরিয়ে আনতে (মুছে ফেলতে) চান?')) return;
            try {
                const res = await apiCall(`/transactions/${id}/undo-ai`, 'POST');
                if (res.success) {
                    showToast('AI দ্বারা যোগ করা লেনদেন মুছে ফেলা হয়েছে।', 'success');
                    setTimeout(() => location.reload(), 700);
                } else {
                    showToast(res.message || 'অপ্রত্যাশিত ত্রুটি', 'danger');
                }
            } catch (e) {
                showToast('অপারেশন ব্যর্থ হয়েছে।', 'danger');
            }
        }

    </script>
@endpush
