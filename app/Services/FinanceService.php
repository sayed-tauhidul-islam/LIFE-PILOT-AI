<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;

class FinanceService
{
    /**
     * Get comprehensive financial summary for a given period.
     */
    public function getSummary(string $userId, string $period): array
    {
        // Use collection-based sum (->get()->sum()) because MongoDB's $sum aggregation
        // returns 0 for string-typed amount fields. The Eloquent cast 'amount' => 'float'
        // ensures correct values after hydration.
        $income  = Transaction::forUser($userId)->forPeriod($period)->income()->get()->sum('amount');
        $expense = Transaction::forUser($userId)->forPeriod($period)->expense()->get()->sum('amount');
        $saving  = Transaction::forUser($userId)->forPeriod($period)->saving()->get()->sum('amount');

        $todayExpense = Transaction::forUser($userId)->forPeriod('daily')->expense()->get()->sum('amount');

        $categoryBreakdown = Transaction::forUser($userId)
            ->forPeriod($period)
            ->expense()
            ->get()
            ->groupBy('category')
            ->map(fn($items) => round($items->sum('amount'), 2))
            ->sortDesc()
            ->toArray();

        $transactionCount = Transaction::forUser($userId)->forPeriod($period)->count();

        return [
            'period'               => $period,
            'monthly_income'       => round($income, 2),
            'monthly_expense'      => round($expense, 2),
            'monthly_saving'       => round($saving, 2),
            'today_expense'        => round($todayExpense, 2),
            'weekly_expense'       => round(Transaction::forUser($userId)->forPeriod('weekly')->expense()->get()->sum('amount'), 2),
            'annual_expense'       => round(Transaction::forUser($userId)->forPeriod('annual')->expense()->get()->sum('amount'), 2),
            'net_balance'          => round($income - $expense, 2),
            'savings_rate'         => $income > 0 ? round((($income - $expense) / $income) * 100, 1) : 0,
            'category_breakdown'   => $categoryBreakdown,
            'transaction_count'    => $transactionCount,
        ];
    }

    /**
     * Get last 6 months income vs expense data for charting.
     */
    public function getLast6MonthsData(string $userId): array
    {
        return $this->getMonthsData($userId, 6);
    }

    public function getLast12MonthsData(string $userId): array
    {
        return $this->getMonthsData($userId, 12);
    }

    private function getMonthsData(string $userId, int $months): array
    {
        $data   = [];
        $labels = [];
        $income = [];
        $expense = [];
        $saving = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $date  = Carbon::now()->subMonths($i);
            $start = $date->copy()->startOfMonth();
            $end   = $date->copy()->endOfMonth();

            $labels[]  = $date->format('M Y');
            $income[]  = round(Transaction::forUser($userId)->whereBetween('date', [$start, $end])->income()->get()->sum('amount'), 2);
            $expense[] = round(Transaction::forUser($userId)->whereBetween('date', [$start, $end])->expense()->get()->sum('amount'), 2);
            $saving[]  = round(Transaction::forUser($userId)->whereBetween('date', [$start, $end])->saving()->get()->sum('amount'), 2);
        }

        return [
            'labels'  => $labels,
            'income'  => $income,
            'expense' => $expense,
            'saving'  => $saving,
        ];
    }

    /**
     * Get expense breakdown by category for the current period.
     */
    public function getCategoryBreakdown(string $userId, string $period): array
    {
        return Transaction::forUser($userId)
            ->forPeriod($period)
            ->expense()
            ->get()
            ->groupBy('category')
            ->map(fn($items) => round($items->sum('amount'), 2))
            ->sortDesc()
            ->toArray();
    }

    /**
     * Detect spending anomalies by comparing current vs average.
     */
    public function detectAnomalies(string $userId): array
    {
        $anomalies = [];
        $categories = Transaction::expenseCategories();

        foreach (array_keys($categories) as $category) {
            // Average of last 3 months for this category
            $threeMonthAvg = 0;
            for ($i = 1; $i <= 3; $i++) {
                $date  = Carbon::now()->subMonths($i);
                $start = $date->copy()->startOfMonth();
                $end   = $date->copy()->endOfMonth();
                $threeMonthAvg += Transaction::forUser($userId)
                    ->expense()
                    ->where('category', $category)
                    ->whereBetween('date', [$start, $end])
                    ->get()->sum('amount');
            }
            $threeMonthAvg /= 3;

            // This month
            $thisMonth = Transaction::forUser($userId)
                ->forPeriod('monthly')
                ->expense()
                ->where('category', $category)
                ->get()->sum('amount');

            // Flag if this month is 200%+ more than average (minimum $10 threshold)
            if ($threeMonthAvg > 10 && $thisMonth > ($threeMonthAvg * 2)) {
                $increase = round((($thisMonth - $threeMonthAvg) / $threeMonthAvg) * 100, 0);
                $anomalies[] = [
                    'category'    => $category,
                    'this_month'  => round($thisMonth, 2),
                    'avg_3months' => round($threeMonthAvg, 2),
                    'increase_pct' => $increase,
                    'message'     => ucfirst($category) . " খাতে খরচ আপনার ৩ মাসের গড়ের চেয়ে {$increase}% বেশি।",
                ];
            }
        }

        return $anomalies;
    }

    /**
     * Generate 3-month expense forecast using simple linear regression.
     */
    public function getForecast(string $userId): array
    {
        $months  = [];
        $amounts = [];

        for ($i = 5; $i >= 0; $i--) {
            $date  = Carbon::now()->subMonths($i);
            $start = $date->copy()->startOfMonth();
            $end   = $date->copy()->endOfMonth();
            $months[]  = $i;
            $amounts[] = Transaction::forUser($userId)
                ->whereBetween('date', [$start, $end])
                ->expense()
                ->get()->sum('amount');
        }

        // Simple linear regression
        $n       = count($months);
        $sumX    = array_sum($months);
        $sumY    = array_sum($amounts);
        $sumXY   = 0;
        $sumX2   = 0;

        for ($i = 0; $i < $n; $i++) {
            $sumXY += $months[$i] * $amounts[$i];
            $sumX2 += $months[$i] * $months[$i];
        }

        $slope     = ($n * $sumXY - $sumX * $sumY) / max(1, ($n * $sumX2 - $sumX * $sumX));
        $intercept = ($sumY - $slope * $sumX) / $n;

        $forecast = [];
        for ($i = 1; $i <= 3; $i++) {
            $xVal      = -$i; // project forward (negative because we went backwards)
            $predicted = max(0, round($intercept + $slope * $xVal, 2));
            $date      = Carbon::now()->addMonths($i);

            $forecast[] = [
                'month'            => $date->format('M Y'),
                'predicted_expense' => $predicted,
            ];
        }

        return $forecast;
    }
}
