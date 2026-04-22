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
                    <tr>
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
                            <div style="display:flex;gap:6px;">
                                <a href="{{ route('transactions.edit', $t->_id) }}"
                                    class="btn btn-outline btn-sm">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <button onclick="deleteTransaction('{{ $t->_id }}')" class="btn btn-danger btn-sm">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" style="text-align:center;color:var(--gray);padding:40px;">
                            <i class="fas fa-receipt" style="font-size:32px;margin-bottom:12px;display:block;"></i>
                            কোনো লেনদেন পাওয়া যায়নি।
                            <a href="{{ route('transactions.create') }}"
                                style="color:var(--primary);font-weight:600;">আপনার প্রথম লেনদেন যোগ করুন</a>
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

    </script>
@endpush
