<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;
use App\Jobs\ProcessAISuggestion;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();
        $period = $request->get('period', 'monthly');
        $type   = $request->get('type', 'all');

        $query = Transaction::forUser($userId)->forPeriod($period);

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        $transactions = $query->orderBy('date', 'desc')->paginate(15);
        $currency = Auth::user()->currency ?? 'BDT';

        $totals = [
            'income'  => Transaction::forUser($userId)->forPeriod($period)->income()->get()->sum('amount'),
            'expense' => Transaction::forUser($userId)->forPeriod($period)->expense()->get()->sum('amount'),
            'saving'  => Transaction::forUser($userId)->forPeriod($period)->saving()->get()->sum('amount'),
        ];

        return view('transactions.index', compact('transactions', 'totals', 'period', 'type', 'currency'));
    }

    public function create()
    {
        $expenseCategories = Transaction::expenseCategories();
        $incomeCategories  = Transaction::incomeCategories();
        $currency = Auth::user()->currency ?? 'BDT';
        return view('transactions.create', compact('expenseCategories', 'incomeCategories', 'currency'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type'               => 'required|in:income,expense,saving',
            'category'           => 'required|string|max:50',
            'amount'             => 'required|numeric|min:0.01',
            'description'        => 'required|string|max:200',
            'date'               => 'required|date',
            'period'             => 'required|in:daily,weekly,monthly,annual',
            'payment_method'     => 'nullable|in:cash,card,bank,mobile',
            'is_recurring'       => 'nullable|boolean',
            'recurring_interval' => 'nullable|in:daily,weekly,monthly',
            'currency'           => 'nullable|string|max:5',
            'notes'              => 'nullable|string|max:500',
            'tags'               => 'nullable|string',
        ]);

        if ($validated['category'] === 'salary' && $validated['type'] !== 'income') {
            return back()->withErrors(['category' => 'বেতন (salary) এর ধরন অবশ্যই আয় (income) হতে হবে।'])->withInput();
        }

        $validated['user_id'] = Auth::id();
        $validated['amount']  = (float) $validated['amount'];
        $validated['tags']    = $request->tags ? array_map('trim', explode(',', $request->tags)) : [];
        $validated['date']    = \Carbon\Carbon::parse($request->date);

        $transaction = Transaction::create($validated);

        // Clear cached aggregates used by FinScore so dashboard updates immediately
        $cacheKey = sprintf('finscore:aggs:user:%d', Auth::id());
        \Cache::forget($cacheKey);

        // Trigger AI suggestion processing asynchronously
        ProcessAISuggestion::dispatch(Auth::id())->delay(now()->addSeconds(3));

        if ($request->ajax()) {
            return response()->json([
                'success'     => true,
                'message'     => 'লেনদেন সফলভাবে যোগ করা হয়েছে!',
                'transaction' => $transaction,
            ]);
        }

        return redirect()->route('transactions.index')
            ->with('success', 'লেনদেন যোগ হয়েছে! এআই আপনার পরামর্শ আপডেট করছে...');
    }

    public function edit($id)
    {
        $transaction       = Transaction::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $expenseCategories = Transaction::expenseCategories();
        $incomeCategories  = Transaction::incomeCategories();
        $currency = Auth::user()->currency ?? 'BDT';
        return view('transactions.edit', compact('transaction', 'expenseCategories', 'incomeCategories', 'currency'));
    }

    public function update(Request $request, $id)
    {
        $transaction = Transaction::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'type'           => 'required|in:income,expense,saving',
            'category'       => 'required|string|max:50',
            'amount'         => 'required|numeric|min:0.01',
            'description'    => 'required|string|max:200',
            'date'           => 'required|date',
            'period'         => 'required|in:daily,weekly,monthly,annual',
            'payment_method' => 'nullable|in:cash,card,bank,mobile',
            'currency'       => 'nullable|string|max:5',
            'notes'          => 'nullable|string|max:500',
        ]);

        if ($validated['category'] === 'salary' && $validated['type'] !== 'income') {
            return back()->withErrors(['category' => 'বেতন (salary) এর ধরন অবশ্যই আয় (income) হতে হবে।'])->withInput();
        }

        $validated['amount'] = (float) $validated['amount'];
        $validated['date'] = \Carbon\Carbon::parse($request->date);
        $transaction->update($validated);

        ProcessAISuggestion::dispatch(Auth::id())->delay(now()->addSeconds(3));

        return redirect()->route('transactions.index')
            ->with('success', 'লেনদেন সফলভাবে আপডেট হয়েছে!');
    }

    public function destroy($id)
    {
        $transaction = Transaction::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $transaction->delete();

        return response()->json(['success' => true, 'message' => 'লেনদেন মুছে ফেলা হয়েছে।']);
    }

    public function undoAi($id)
    {
        $transaction = Transaction::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        if (!$transaction->created_by_ai) {
            return response()->json(['success' => false, 'message' => 'এই লেনদেনটি AI দ্বারা তৈরি হয়নি।'], 422);
        }

        // undo by deleting the transaction
        $transaction->delete();

        return response()->json(['success' => true, 'message' => 'AI দ্বারা যোগ করা লেনদেন পূর্বাবস্থায় ফিরে এসেছে (মুছে ফেলা হয়েছে)।']);
    }

    public function apiList(Request $request)
    {
        $userId = Auth::id();
        $period = $request->get('period', 'monthly');

        $transactions = Transaction::forUser($userId)
            ->forPeriod($period)
            ->orderBy('date', 'desc')
            ->get(['type', 'category', 'amount', 'description', 'date', 'payment_method']);

        return response()->json(['success' => true, 'data' => $transactions]);
    }

    public function summary($period)
    {
        $userId = Auth::id();
        $valid  = ['daily', 'weekly', 'monthly', 'annual'];

        if (!in_array($period, $valid)) {
            return response()->json(['error' => 'অবৈধ সময়কাল'], 422);
        }

        $income  = Transaction::forUser($userId)->forPeriod($period)->income()->get()->sum('amount');
        $expense = Transaction::forUser($userId)->forPeriod($period)->expense()->get()->sum('amount');
        $saving  = Transaction::forUser($userId)->forPeriod($period)->saving()->get()->sum('amount');

        return response()->json([
            'period'  => $period,
            'income'  => round($income, 2),
            'expense' => round($expense, 2),
            'saving'  => round($saving, 2),
            'balance' => round($income - $expense, 2),
        ]);
    }
}
