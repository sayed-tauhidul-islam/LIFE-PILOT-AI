<?php

namespace App\Exports;

use App\Models\Transaction;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;

class FinancialReportExport implements FromView, ShouldAutoSize, WithTitle
{
    public function __construct(
        protected $user,
        protected array $data,
        protected $transactions,
        protected string $period,
        protected string $currency,
    ) {
    }

    public function view(): View
    {
        return view('reports.excel', [
            'user' => $this->user,
            'data' => $this->data,
            'transactions' => $this->transactions,
            'period' => $this->period,
            'currency' => $this->currency,
            'catLabels' => array_merge(Transaction::expenseCategories(), Transaction::incomeCategories()),
        ]);
    }

    public function title(): string
    {
        return ucfirst($this->period) . ' Report';
    }
}
