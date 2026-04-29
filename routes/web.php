<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\AdminController;

Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('login');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.post');
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats'])->name('dashboard.stats');
    Route::get('/dashboard/chart-data', [DashboardController::class, 'getChartData'])->name('dashboard.chart');

    Route::prefix('transactions')->name('transactions.')->group(function () {
        Route::get('/', [TransactionController::class, 'index'])->name('index');
        Route::get('/create', [TransactionController::class, 'create'])->name('create');
        Route::post('/', [TransactionController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [TransactionController::class, 'edit'])->name('edit');
        Route::put('/{id}', [TransactionController::class, 'update'])->name('update');
        Route::delete('/{id}', [TransactionController::class, 'destroy'])->name('destroy');
        Route::post('/{id}/undo-ai', [TransactionController::class, 'undoAi'])->name('undo-ai');
        Route::get('/api/list', [TransactionController::class, 'apiList'])->name('api.list');
        Route::get('/summary/{period}', [TransactionController::class, 'summary'])->name('summary');
    });

        // FinScore detail page
        Route::get('/finscore', [\App\Http\Controllers\FinScoreController::class, 'show'])->name('finscore.show');
        Route::get('/finscore/summary', [\App\Http\Controllers\FinScoreController::class, 'summary'])->name('finscore.summary');

    Route::prefix('budget')->name('budget.')->group(function () {
        Route::get('/', [BudgetController::class, 'index'])->name('index');
        Route::post('/', [BudgetController::class, 'store'])->name('store');
        Route::put('/{id}', [BudgetController::class, 'update'])->name('update');
        Route::delete('/{id}', [BudgetController::class, 'destroy'])->name('destroy');
        Route::get('/status', [BudgetController::class, 'status'])->name('status');
    });

    Route::prefix('ai')->name('ai.')->group(function () {
        Route::get('/', [AIController::class, 'index'])->name('index');
        Route::post('/chat', [AIController::class, 'chat'])->name('chat');
        Route::post('/generate', [AIController::class, 'generate'])->name('generate');
        Route::get('/history', [AIController::class, 'history'])->name('history');
        Route::get('/suggestions', [AIController::class, 'getSuggestions'])->name('suggestions');
        Route::get('/recommendations', [AIController::class, 'recommendations'])->name('recommendations');
        Route::get('/fin-score', [AIController::class, 'getFinScore'])->name('fin-score');
        Route::get('/anomalies', [AIController::class, 'detectAnomalies'])->name('anomalies');
    });

    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/monthly/{year}/{month}', [ReportController::class, 'monthly'])->name('monthly');
        Route::get('/annual/{year}', [ReportController::class, 'annual'])->name('annual');
        Route::get('/export/pdf/{period}', [ReportController::class, 'exportPDF'])->name('export.pdf');
        Route::get('/export/excel/{period}', [ReportController::class, 'exportExcel'])->name('export.excel');
        Route::get('/forecast', [ReportController::class, 'forecast'])->name('forecast');
    });

    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [SettingsController::class, 'index'])->name('index');
        Route::get('/preferences', [SettingsController::class, 'preferences'])->name('preferences');
        Route::put('/preferences', [SettingsController::class, 'updatePreferences'])->name('preferences.update');
        Route::get('/theme', [SettingsController::class, 'theme'])->name('theme');
        Route::put('/theme', [SettingsController::class, 'updateTheme'])->name('theme.update');
        // Theme apply (server-side persistence)
        Route::post('/theme/apply', [SettingsController::class, 'applyTheme'])->name('theme.apply');
        Route::get('/contrast', [SettingsController::class, 'contrast'])->name('contrast');
        // Contrast apply (server-side persistence)
        Route::post('/contrast/apply', [SettingsController::class, 'applyContrast'])->name('contrast.apply');
        Route::get('/ai', [SettingsController::class, 'ai'])->name('ai');
        Route::put('/ai', [SettingsController::class, 'updateAi'])->name('ai.update');
    });

    // ========== ADMIN PANEL ==========
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');
        Route::get('/export', [AdminController::class, 'export'])->name('export');
        Route::get('/schema/{table}', [AdminController::class, 'schema'])->name('schema');
        Route::get('/data/{table}', [AdminController::class, 'data'])->name('data');
        Route::get('/create/{table}', [AdminController::class, 'create'])->name('create');
        Route::post('/store/{table}', [AdminController::class, 'store'])->name('store');
        Route::get('/edit/{table}/{id}', [AdminController::class, 'edit'])->name('edit');
        Route::put('/update/{table}/{id}', [AdminController::class, 'update'])->name('update');
        Route::delete('/delete/{table}/{id}', [AdminController::class, 'destroy'])->name('destroy');
        Route::get('/column-info/{table}', [AdminController::class, 'getColumnInfo'])->name('column-info');
    });
});
