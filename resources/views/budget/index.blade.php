@extends('layouts.app')
@section('title','বাজেট')
@section('page-title','বাজেট ম্যানেজার')

@section('content')
<div style="display:grid;grid-template-columns:1fr 1.6fr;gap:24px;">

    {{-- ADD BUDGET FORM --}}
    <div class="card" style="align-self:start;">
        <div class="card-title">বাজেট সীমা নির্ধারণ</div>
        <form id="budget-form">
            @csrf
            <div class="form-group">
                <label class="form-label">বিভাগ</label>
                <select name="category" class="form-control" required>
                    <option value="">বিভাগ নির্বাচন করুন</option>
                    @foreach($categories as $key => $label)
                        <option value="{{ $key }}">{{ $label }}</option>
                    @endforeach
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">বাজেট সীমা ($)</label>
                <input type="number" name="limit_amount" class="form-control" placeholder="যেমন: ৫০০" step="0.01"
                    min="0.01" required>
            </div>
            <div class="form-group">
                <label class="form-label">সময়কাল</label>
                <select name="period" class="form-control" required>
                    <option value="daily">দৈনিক</option>
                    <option value="weekly">সাপ্তাহিক</option>
                    <option value="monthly" selected>মাসিক</option>
                    <option value="annual">বার্ষিক</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">সতর্কতা (%)</label>
                <input type="number" name="alert_at" class="form-control" placeholder="80" value="80" min="1" max="100">
                <div style="font-size:11px;color:var(--gray);margin-top:4px;">বাজেটের এই % ব্যবহার হলে বিজ্ঞপ্তি পাবেন
                </div>
            </div>
            <button type="button" onclick="saveBudget()" class="btn btn-primary" style="width:100%;">
                <i class="fas fa-save"></i> বাজেট সেট করুন
            </button>
        </form>
    </div>

    {{-- ACTIVE BUDGETS --}}
    <div class="card">
        <div class="card-title">সক্রিয় বাজেটসমূহ</div>
        @forelse($budgetsWithSpent as $budget)
            <div
                style="padding:16px;border:1px solid var(--border);border-radius:12px;margin-bottom:12px;{{ $budget->over_limit ? 'border-color:#fca5a5;background:#fff5f5;' : '' }}">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
                    <div>
                        @php $catLabels = array_merge(\App\Models\Transaction::expenseCategories(), \App\Models\Transaction::incomeCategories()); @endphp
                        <div style="font-size:15px;font-weight:700;">{{ $catLabels[$budget->category] ?? ucfirst($budget->category) }}</div>
                        <div style="font-size:12px;color:var(--gray);">@php $periodLabels = ['daily'=>'দৈনিক','weekly'=>'সাপ্তাহিক','monthly'=>'মাসিক','annual'=>'বার্ষিক']; @endphp{{ $periodLabels[$budget->period] ?? ucfirst($budget->period) }} বাজেট</div>
                    </div>
                    <div style="text-align:right;">
                        <div
                            style="font-size:16px;font-weight:800;color:{{ $budget->over_limit ? 'var(--danger)' : ($budget->percentage >= 80 ? 'var(--warning)' : 'var(--success)') }}">
                            {{ $budget->percentage }}%
                        </div>
                        @if($budget->over_limit)
                            <span class="badge badge-expense">সীমা ছাড়িয়ে গেছে!</span>
                        @endif
                    </div>
                </div>
                <div class="progress-bar" style="margin-bottom:8px;">
                    <div class="progress-fill"
                        style="width:{{ min(100, $budget->percentage) }}%;background:{{ $budget->over_limit ? 'var(--danger)' : ($budget->percentage >= 80 ? 'var(--warning)' : 'var(--success)') }};">
                    </div>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray);">
                    <span>ব্যয়: <strong>{{ $currency }}{{ $budget->spent }}</strong></span>
                    <span>অবশিষ্ট: <strong
                            style="color:{{ $budget->remaining > 0 ? 'var(--success)' : 'var(--danger)' }};">{{ $currency }}{{ $budget->remaining }}</strong></span>
                    <span>সীমা: <strong>{{ $currency }}{{ $budget->limit_amount }}</strong></span>
                </div>
                <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px;">
                    <button onclick="deleteBudget('{{ $budget->_id }}')" class="btn btn-danger btn-sm">
                        <i class="fas fa-trash"></i> সরান
                    </button>
                </div>
            </div>
        @empty
            <div style="text-align:center;padding:40px;color:var(--gray);">
                <i class="fas fa-wallet" style="font-size:36px;opacity:0.3;display:block;margin-bottom:12px;"></i>
                কোনো বাজেট সেট করা হয়নি। আপনার প্রথম বাজেট সীমা তৈরি করতে ফর্মটি ব্যবহার করুন।
            </div>
        @endforelse
    </div>

</div>
@endsection

@push('scripts')
    <script>
        async function saveBudget() {
            const form = document.getElementById('budget-form');
            const data = Object.fromEntries(new FormData(form));

            try {
                const res = await apiCall('/budget', 'POST', data);
                if (res.success) {
                    showToast(res.message, 'success');
                    setTimeout(() => location.reload(), 1000);
                }
            } catch (e) {
                showToast('বাজেট সংরক্ষণ ব্যর্থ হয়েছে।', 'danger');
            }
        }

        async function deleteBudget(id) {
            if (!confirm('এই বাজেট সরাবেন?')) return;
            try {
                const res = await apiCall(`/budget/${id}`, 'DELETE');
                if (res.success) {
                    showToast('বাজেট সরানো হয়েছে।', 'success');
                    setTimeout(() => location.reload(), 800);
                }
            } catch (e) {
                showToast('মুছে ফেলা ব্যর্থ হয়েছে।', 'danger');
            }
        }

    </script>
@endpush
