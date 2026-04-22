<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Report;
use App\Models\Transaction;
use App\Services\FinanceService;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use App\Exports\FinancialReportExport;

class ReportController extends Controller
{
    protected FinanceService $financeService;

    public function __construct(FinanceService $financeService)
    {
        $this->financeService = $financeService;
    }

    public function index()
    {
        $userId     = Auth::id();
        $thisYear   = now()->year;
        $thisMonth  = now()->month;

        $monthlyReport = $this->generateMonthlyReport($userId, $thisYear, $thisMonth);
        $annualReport  = $this->generateAnnualReport($userId, $thisYear);
        $forecast      = $this->financeService->getForecast($userId);

        return view('reports.index', compact('monthlyReport', 'annualReport', 'forecast'));
    }

    public function monthly($year, $month)
    {
        $report = $this->generateMonthlyReport(Auth::id(), $year, $month);
        return response()->json(['success' => true, 'data' => $report]);
    }

    public function annual($year)
    {
        $report = $this->generateAnnualReport(Auth::id(), $year);
        return response()->json(['success' => true, 'data' => $report]);
    }

    public function exportPDF($period)
    {
        $userId = Auth::id();
        $user   = Auth::user();

        if ($period === 'monthly') {
            $data = $this->generateMonthlyReport($userId, now()->year, now()->month);
        } else {
            $data = $this->generateAnnualReport($userId, now()->year);
        }

        $pdf = Pdf::loadView('reports.pdf', compact('user', 'data', 'period'));
        return $pdf->download("LP_AI_Report_{$period}_" . now()->format('Y-m-d') . '.pdf');
    }

    public function exportExcel($period)
    {
        $userId = Auth::id();
        $user   = Auth::user();
        $currency = $user->currency ?? 'BDT';

        if ($period === 'monthly') {
            $data = $this->generateMonthlyReport($userId, now()->year, now()->month);
            $transactions = Transaction::forUser($userId)
                ->whereYear('date', now()->year)
                ->whereMonth('date', now()->month)
                ->orderBy('date', 'desc')
                ->get();
        } else {
            $data = $this->generateAnnualReport($userId, now()->year);
            $transactions = Transaction::forUser($userId)
                ->whereYear('date', now()->year)
                ->orderBy('date', 'desc')
                ->get();
        }

        $filename = "LP_AI_Report_{$period}_" . now()->format('Y-m-d') . '.xlsx';

        return Excel::download(
            new FinancialReportExport($user, $data, $transactions, $period, $currency),
            $filename
        );
    }

    public function forecast()
    {
        $forecast = $this->financeService->getForecast(Auth::id());
        return response()->json(['success' => true, 'data' => $forecast]);
    }

    private function generateMonthlyReport($userId, $year, $month)
    {
        $transactions = Transaction::forUser($userId)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get();

        $income  = $transactions->where('type', 'income')->sum('amount');
        $expense = $transactions->where('type', 'expense')->sum('amount');
        $saving  = $transactions->where('type', 'saving')->sum('amount');

        $categoryBreakdown = $transactions->where('type', 'expense')
            ->groupBy('category')
            ->map(fn($items) => round($items->sum('amount'), 2))
            ->sortDesc()
            ->toArray();

        $daysInMonth = Carbon::create($year, $month, 1)->daysInMonth;

        return [
            'period'              => 'monthly',
            'label'               => date('F Y', mktime(0, 0, 0, $month, 1, $year)),
            'total_income'        => round($income, 2),
            'total_expense'       => round($expense, 2),
            'total_saving'        => round($saving, 2),
            'net_balance'         => round($income - $expense, 2),
            'savings_rate'        => $income > 0 ? round((($income - $expense) / $income) * 100, 1) : 0,
            'daily_avg_spend'     => round($expense / $daysInMonth, 2),
            'category_breakdown'  => $categoryBreakdown,
            'transaction_count'   => $transactions->count(),
        ];
    }

    private function generateAnnualReport($userId, $year)
    {
        $transactions = Transaction::forUser($userId)->whereYear('date', $year)->get();

        $income  = $transactions->where('type', 'income')->sum('amount');
        $expense = $transactions->where('type', 'expense')->sum('amount');
        $saving  = $transactions->where('type', 'saving')->sum('amount');

        return [
            'period'         => 'annual',
            'label'          => "Year $year",
            'total_income'   => round($income, 2),
            'total_expense'  => round($expense, 2),
            'total_saving'   => round($saving, 2),
            'net_balance'    => round($income - $expense, 2),
            'savings_rate'   => $income > 0 ? round((($income - $expense) / $income) * 100, 1) : 0,
            'monthly_avg'    => round($expense / 12, 2),
        ];
    }
}
