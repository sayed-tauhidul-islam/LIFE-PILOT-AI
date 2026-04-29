@extends('layouts.app')
@section('title', 'লেনদেন সম্পাদনা')
@section('page-title', 'লেনদেন সম্পাদনা')

@section('content')
<div class="card" style="max-width:900px;">
    <div class="card-title">লেনদেন আপডেট করুন</div>

    <form method="POST" action="{{ route('transactions.update', $transaction->id) }}" class="grid" style="gap:14px;">
        @csrf
        @method('PUT')

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
                <label class="label">ধরন</label>
                <select name="type" id="txnType" class="form-control" required>
                    <option value="income" {{ $transaction->type === 'income' ? 'selected' : '' }}>আয়</option>
                    <option value="expense" {{ $transaction->type === 'expense' ? 'selected' : '' }}>খরচ</option>
                    <option value="saving" {{ $transaction->type === 'saving' ? 'selected' : '' }}>সঞ্চয়</option>
                </select>
            </div>
            <div>
                <label class="label">বিভাগ</label>
                <select name="category" id="txnCategory" class="form-control" required>
                    {{-- options populated by JS --}}
                </select>
            </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
                <label class="label">পরিমাণ</label>
                <input type="number" step="0.01" min="0.01" name="amount" class="form-control" value="{{ $transaction->amount }}" required>
            </div>
            <div>
                <label class="label">তারিখ</label>
                <input type="date" name="date" class="form-control" value="{{ \Carbon\Carbon::parse($transaction->date)->toDateString() }}" required>
            </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px;align-items:end">
            <div>
                <label class="label" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                    <input type="checkbox" name="is_recurring" value="1" id="isRecurring" {{ $transaction->is_recurring ? 'checked' : '' }} style="width:16px;height:16px;">
                    পুনরাবৃত্তি লেনদেন
                </label>
                <select name="recurring_interval" id="recurringInterval" class="form-control" style="margin-top:6px;" {{ $transaction->is_recurring ? '' : 'disabled' }}>
                    <option value="daily" {{ ($transaction->recurring_interval ?? '') === 'daily' ? 'selected' : '' }}>প্রতিদিন</option>
                    <option value="weekly" {{ ($transaction->recurring_interval ?? '') === 'weekly' ? 'selected' : '' }}>প্রতি সপ্তাহে</option>
                    <option value="monthly" {{ ($transaction->recurring_interval ?? '') !== 'daily' && ($transaction->recurring_interval ?? '') !== 'weekly' ? 'selected' : '' }}>প্রতি মাসে</option>
                </select>
            </div>
            <div>
                <label class="label">মুদ্রা</label>
                <div class="currency-select" style="position:relative;">
                    <button type="button" id="currencyToggle" class="form-control" style="display:flex;align-items:center;justify-content:space-between">
                        <span id="currencyDisplay">{{ $transaction->currency ?? $currency ?? 'BDT' }}</span>
                        <span style="opacity:0.7">▾</span>
                    </button>
                    <input type="hidden" name="currency" id="currencyInput" value="{{ $transaction->currency ?? $currency ?? 'BDT' }}">
                    <div id="currencyDropdown" style="display:none;position:absolute;z-index:60;left:0;right:0;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:8px;max-height:220px;overflow:auto;box-shadow:0 10px 30px rgba(2,6,23,0.08)">
                        @php
                            $countries = [
                                ['code'=>'BDT','label'=>'Bangladesh','flag'=>'🇧🇩'],
                                ['code'=>'USD','label'=>'United States','flag'=>'🇺🇸'],
                                ['code'=>'EUR','label'=>'Eurozone','flag'=>'🇪🇺'],
                                ['code'=>'INR','label'=>'India','flag'=>'🇮🇳'],
                                ['code'=>'GBP','label'=>'United Kingdom','flag'=>'🇬🇧'],
                            ];
                        @endphp
                        @foreach($countries as $c)
                            <div class="currency-option" data-code="{{ $c['code'] }}" style="padding:8px;border-radius:6px;cursor:pointer;display:flex;gap:8px;align-items:center">
                                <div style="font-size:18px">{{ $c['flag'] }}</div>
                                <div style="flex:1">{{ $c['label'] }} <small style="color:#6b7280">({{ $c['code'] }})</small></div>
                        @endforeach
                    </div>
            </div>

        <div>
            <label class="label">বিবরণ</label>
            <input type="text" name="description" class="form-control" value="{{ $transaction->description }}" required>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
                <label class="label">সময়কাল</label>
                <select name="period" class="form-control" required>
                    <option value="daily" {{ $transaction->period === 'daily' ? 'selected' : '' }}>দৈনিক</option>
                    <option value="weekly" {{ $transaction->period === 'weekly' ? 'selected' : '' }}>সাপ্তাহিক</option>
                    <option value="monthly" {{ $transaction->period === 'monthly' ? 'selected' : '' }}>মাসিক</option>
                    <option value="annual" {{ $transaction->period === 'annual' ? 'selected' : '' }}>বার্ষিক</option>
                </select>
            </div>
            <div>
                <label class="label">পেমেন্ট</label>
                <select name="payment_method" class="form-control">
                    <option value="cash" {{ ($transaction->payment_method ?? 'cash') === 'cash' ? 'selected' : '' }}>নগদ</option>
                    <option value="card" {{ ($transaction->payment_method ?? '') === 'card' ? 'selected' : '' }}>কার্ড</option>
                    <option value="bank" {{ ($transaction->payment_method ?? '') === 'bank' ? 'selected' : '' }}>ব্যাংক</option>
                    <option value="mobile" {{ ($transaction->payment_method ?? '') === 'mobile' ? 'selected' : '' }}>মোবাইল</option>
                </select>
            </div>

        <div>
            <label class="label">নোটস</label>
            <textarea name="notes" class="form-control" rows="3" maxlength="500">{{ $transaction->notes }}</textarea>
        </div>

        <div style="display:flex;gap:10px;justify-content:flex-end;">
            <a href="{{ route('transactions.index') }}" class="btn btn-outline">বাতিল</a>
            <button type="submit" class="btn btn-primary">আপডেট করুন</button>
        </div>
    </form>
</div>
@endsection

@push('scripts')
<script>
(function(){
    const typeSelect = document.getElementById('txnType');
    const catSelect  = document.getElementById('txnCategory');
    const currentCat = '{{ $transaction->category }}';

    const cats = {
        income:  @json(\App\Models\Transaction::incomeCategories()),
        expense: @json(\App\Models\Transaction::expenseCategories()),
        saving: { savings: '💰 সঞ্চয়' }
    };

    function populate(type) {
        catSelect.innerHTML = '';
        const map = cats[type] || {};
        for (const [val, label] of Object.entries(map)) {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = label;
            if (val === currentCat) opt.selected = true;
            catSelect.appendChild(opt);
        }
    }

    typeSelect.addEventListener('change', function() {
        populate(this.value);
    });

    populate(typeSelect.value);

    // Recurring toggle
    const isRecurring = document.getElementById('isRecurring');
    const recurringInterval = document.getElementById('recurringInterval');
    if (isRecurring && recurringInterval) {
        isRecurring.addEventListener('change', function() {
            recurringInterval.disabled = !this.checked;
        });
    }

    // Currency dropdown
    document.addEventListener('click', function(e){
        const toggle = document.getElementById('currencyToggle');
        const dropdown = document.getElementById('currencyDropdown');
        if(!toggle) return;
        if(toggle.contains(e.target)){
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            return;
        }
        if(dropdown.contains(e.target)){
            const opt = e.target.closest('.currency-option');
            if(opt){
                const code = opt.getAttribute('data-code');
                const display = document.getElementById('currencyDisplay');
                const input = document.getElementById('currencyInput');
                display.textContent = code;
                input.value = code;
                dropdown.style.display = 'none';
            }
            return;
        }
        dropdown.style.display = 'none';
    });
})();
</script>
@endpush
