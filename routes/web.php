<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;

/*
|--------------------------------------------------------------------------
| LP_AI — Web Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('login');
});

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.post');
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Authenticated Routes
Route::middleware('auth')->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats'])->name('dashboard.stats');
    Route::get('/dashboard/chart-data', [DashboardController::class, 'getChartData'])->name('dashboard.chart');

    // Transactions
    Route::prefix('transactions')->name('transactions.')->group(function () {
        Route::get('/', [TransactionController::class, 'index'])->name('index');
        Route::get('/create', [TransactionController::class, 'create'])->name('create');
        Route::post('/', [TransactionController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [TransactionController::class, 'edit'])->name('edit');
        Route::put('/{id}', [TransactionController::class, 'update'])->name('update');
        Route::delete('/{id}', [TransactionController::class, 'destroy'])->name('destroy');
        Route::get('/api/list', [TransactionController::class, 'apiList'])->name('api.list');
        Route::get('/summary/{period}', [TransactionController::class, 'summary'])->name('summary');
    });

    // Budget
    Route::prefix('budget')->name('budget.')->group(function () {
        Route::get('/', [BudgetController::class, 'index'])->name('index');
        Route::post('/', [BudgetController::class, 'store'])->name('store');
        Route::put('/{id}', [BudgetController::class, 'update'])->name('update');
        Route::delete('/{id}', [BudgetController::class, 'destroy'])->name('destroy');
        Route::get('/status', [BudgetController::class, 'status'])->name('status');
    });

    // Health Profile
    Route::prefix('health')->name('health.')->group(function () {
        Route::get('/', [HealthController::class, 'index'])->name('index');
        Route::post('/', [HealthController::class, 'store'])->name('store');
        Route::put('/', [HealthController::class, 'update'])->name('update');
        Route::get('/meal-plan', [HealthController::class, 'getMealPlan'])->name('meal-plan');
    });

    // AI Advisor
    Route::prefix('ai')->name('ai.')->group(function () {
        Route::get('/', [AIController::class, 'index'])->name('index');
        Route::post('/generate', [AIController::class, 'generate'])->name('generate');
        Route::get('/suggestions', [AIController::class, 'getSuggestions'])->name('suggestions');
        Route::get('/fin-score', [AIController::class, 'getFinScore'])->name('fin-score');
        Route::get('/anomalies', [AIController::class, 'detectAnomalies'])->name('anomalies');
    });

    // Reports
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/monthly/{year}/{month}', [ReportController::class, 'monthly'])->name('monthly');
        Route::get('/annual/{year}', [ReportController::class, 'annual'])->name('annual');
        Route::get('/export/pdf/{period}', [ReportController::class, 'exportPDF'])->name('export.pdf');
        Route::get('/export/excel/{period}', [ReportController::class, 'exportExcel'])->name('export.excel');
        Route::get('/forecast', [ReportController::class, 'forecast'])->name('forecast');
    });

    // Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [SettingsController::class, 'index'])->name('index');
        Route::get('/theme', [SettingsController::class, 'theme'])->name('theme');
        Route::put('/theme', [SettingsController::class, 'updateTheme'])->name('theme.update');
        Route::get('/ai', [SettingsController::class, 'ai'])->name('ai');
        Route::put('/ai', [SettingsController::class, 'updateAi'])->name('ai.update');
    });

});
