<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;
use App\Models\AISuggestion;
use App\Models\Budget;
use App\Services\FinanceService;

class DashboardController extends Controller
{
    protected FinanceService $financeService;

    public function __construct(FinanceService $financeService)
    {
        $this->financeService = $financeService;
    }

    public function index()
    {
        $user   = Auth::user();
        $userId = $user->id;

        // Get financial summary for different periods
        $todayStats   = $this->financeService->getSummary($userId, 'daily');
        $weekStats    = $this->financeService->getSummary($userId, 'weekly');
        $monthStats   = $this->financeService->getSummary($userId, 'monthly');
        $annualStats  = $this->financeService->getSummary($userId, 'annual');

        // Latest AI suggestion
        $latestAI = AISuggestion::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->first();

        // Recent transactions
        $recentTransactions = Transaction::forUser($userId)
            ->orderBy('date', 'desc')
            ->limit(8)
            ->get();

        // Budget status (with spent calculations)
        $budgets = Budget::where('user_id', $userId)->where('is_active', true)->get()
            ->map(function ($budget) use ($userId) {
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

        // FinScore
        $finScore = $latestAI?->fin_score ?? 0;

        // Monthly chart data (last 6 months)
        $chartData = $this->financeService->getLast6MonthsData($userId);

        // Category breakdown
        $categoryBreakdown = $this->financeService->getCategoryBreakdown($userId, 'monthly');

        // Anomalies detected
        $anomalies = $this->financeService->detectAnomalies($userId);

        return view('dashboard.index', compact(
            'user', 'todayStats', 'weekStats', 'monthStats', 'annualStats',
            'latestAI', 'recentTransactions', 'budgets', 'finScore',
            'chartData', 'categoryBreakdown', 'anomalies'
        ));
    }

    public function getStats(Request $request)
    {
        $userId = Auth::id();
        $period = $request->get('period', 'monthly');

        $stats = $this->financeService->getSummary($userId, $period);

        return response()->json(['success' => true, 'data' => $stats]);
    }

    public function getChartData(Request $request)
    {
        $userId = Auth::id();
        $type   = $request->get('type', '6months');

        $data = match($type) {
            '6months' => $this->financeService->getLast6MonthsData($userId),
            '12months' => $this->financeService->getLast12MonthsData($userId),
            default   => $this->financeService->getLast6MonthsData($userId),
        };

        return response()->json(['success' => true, 'data' => $data]);
    }
}
