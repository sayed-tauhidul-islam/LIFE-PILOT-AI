<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Budget;
use App\Models\Transaction;

class BudgetController extends Controller
{
    public function index()
    {
        $userId  = Auth::id();
        $budgets = Budget::where('user_id', $userId)->where('is_active', true)->get();

        // Calculate spent amount for each budget
        $budgetsWithSpent = $budgets->map(function ($budget) use ($userId) {
            $spent = Transaction::forUser($userId)
                ->expense()
                ->forPeriod($budget->period)
                ->where('category', $budget->category)
                ->get()->sum('amount');

            $budget->spent      = round($spent, 2);
            $budget->percentage = $budget->limit_amount > 0
                ? min(100, round(($spent / $budget->limit_amount) * 100, 1))
                : 0;
            $budget->remaining  = max(0, round($budget->limit_amount - $spent, 2));
            $budget->over_limit = $spent > $budget->limit_amount;

            return $budget;
        });

        $categories = Transaction::expenseCategories();
        $currency = Auth::user()->currency ?? 'BDT';

        return view('budget.index', compact('budgetsWithSpent', 'categories', 'currency'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category'     => 'required|string|max:50',
            'limit_amount' => 'required|numeric|min:0.01',
            'period'       => 'required|in:daily,weekly,monthly,annual',
            'alert_at'     => 'nullable|integer|min:1|max:100',
            'color'        => 'nullable|string|max:10',
        ]);

        $validated['user_id']  = Auth::id();
        $validated['is_active'] = true;
        $validated['alert_at'] = $validated['alert_at'] ?? 80;

        // Check if budget for this category+period already exists
        Budget::where('user_id', Auth::id())
            ->where('category', $validated['category'])
            ->where('period', $validated['period'])
            ->update(['is_active' => false]);

        Budget::create($validated);

        return response()->json(['success' => true, 'message' => 'বাজেট সফলভাবে সেট করা হয়েছে!']);
    }

    public function update(Request $request, $id)
    {
        $budget = Budget::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'limit_amount' => 'required|numeric|min:0.01',
            'alert_at'     => 'nullable|integer|min:1|max:100',
        ]);

        $budget->update($validated);

        return response()->json(['success' => true, 'message' => 'বাজেট আপডেট হয়েছে!']);
    }

    public function destroy($id)
    {
        $budget = Budget::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $budget->update(['is_active' => false]);

        return response()->json(['success' => true, 'message' => 'বাজেট সরানো হয়েছে।']);
    }

    public function status()
    {
        $userId  = Auth::id();
        $budgets = Budget::where('user_id', $userId)->where('is_active', true)->get();

        $status = $budgets->map(function ($budget) use ($userId) {
            $spent = Transaction::forUser($userId)
                ->expense()
                ->forPeriod($budget->period)
                ->where('category', $budget->category)
                ->get()->sum('amount');

            return [
                'category'   => $budget->category,
                'limit'      => $budget->limit_amount,
                'spent'      => round($spent, 2),
                'percentage' => $budget->limit_amount > 0
                    ? min(100, round(($spent / $budget->limit_amount) * 100, 1)) : 0,
                'alert'      => $spent >= ($budget->limit_amount * $budget->alert_at / 100),
                'over_limit' => $spent > $budget->limit_amount,
            ];
        });

        return response()->json(['success' => true, 'data' => $status]);
    }
}
