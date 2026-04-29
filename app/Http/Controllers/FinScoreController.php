<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;

class FinScoreController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        $baseQuery = Transaction::where('user_id', $user->id);

        // cache aggregates briefly to avoid repeated heavy queries
        $cacheKey = sprintf('finscore:aggs:user:%d', $user->id);
        $aggs = \Cache::remember($cacheKey, now()->addMinutes(3), function() use ($baseQuery) {
            return [
                'income' => (clone $baseQuery)->where('type', 'income')->sum('amount'),
                'expense' => (clone $baseQuery)->where('type', 'expense')->sum('amount'),
                'invest' => (clone $baseQuery)->where('category', 'investment')->sum('amount'),
            ];
        });

        $income = $aggs['income'];
        $expense = $aggs['expense'];
        $invest = $aggs['invest'];

        // SQLite uses strftime instead of DATE_FORMAT; use driver-agnostic SQL via raw conditional
        $connection = \DB::connection()->getDriverName();
        if ($connection === 'sqlite') {
            $monthly = (clone $baseQuery)
                ->selectRaw("strftime('%Y-%m', date) as m, SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income, SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense")
                ->groupBy('m')->orderBy('m','desc')->limit(12)->get();

            $weekly = (clone $baseQuery)
                ->selectRaw("strftime('%Y-%W', date) as yw, SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income, SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense")
                ->groupBy('yw')->orderBy('yw','desc')->limit(12)->get();
        } else {
            $monthly = (clone $baseQuery)
                ->selectRaw("DATE_FORMAT(date, '%Y-%m') as m, SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income, SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense")
                ->groupBy('m')->orderBy('m','desc')->limit(12)->get();

            $weekly = (clone $baseQuery)
                ->selectRaw("YEARWEEK(date,1) as yw, SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income, SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense")
                ->groupBy('yw')->orderBy('yw','desc')->limit(12)->get();
        }

        $score = $this->calculateScore($income, $expense, $invest);

        return view('finscore.show', compact('income','expense','invest','monthly','weekly','score'));
    }

    // JSON endpoint for small summary (used by topbar)
    public function summary(Request $request)
    {
        $user = $request->user();
        $baseQuery = Transaction::where('user_id', $user->id);
        $cacheKey = sprintf('finscore:aggs:user:%d', $user->id);
        $aggs = \Cache::remember($cacheKey, now()->addMinutes(3), function() use ($baseQuery) {
            return [
                'income' => (clone $baseQuery)->where('type', 'income')->sum('amount'),
                'expense' => (clone $baseQuery)->where('type', 'expense')->sum('amount'),
                'invest' => (clone $baseQuery)->where('category', 'investment')->sum('amount'),
            ];
        });
        $income = $aggs['income'];
        $expense = $aggs['expense'];
        $score = $this->calculateScore($income, $expense, $aggs['invest']);
        return response()->json(['score' => $score, 'income' => $income, 'expense' => $expense]);
    }

    protected function calculateScore($income, $expense, $invest)
    {
        if ($income <= 0) return 28;
        $savings = max(0, $income - $expense);
        $rate = $savings / max(1, $income);
        $base = intval(min(100, max(0, $rate * 100)));
        $investBonus = intval(min(20, ($invest / max(1, $income)) * 20));
        return max(10, min(100, $base + $investBonus));
    }
}
