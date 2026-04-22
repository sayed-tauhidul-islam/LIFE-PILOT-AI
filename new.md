# LP_AI — Full Setup Commands (VS Code Terminal)

## STEP 1 — Install Laravel Project

```bash
composer create-project laravel/laravel LP_AI
cd LP_AI
```

## STEP 2 — Install All Required Packages

```bash
# MongoDB driver for Laravel
composer require mongodb/laravel-mongodb

# OpenAI PHP Client for AI suggestions
composer require openai-php/laravel

# Pusher for real-time broadcasting
composer require pusher/pusher-php-server

# Laravel Echo server dependencies
composer require laravel/scout

# PDF Export
composer require barryvdh/laravel-dompdf

# Excel Export
composer require maatwebsite/excel

# Install frontend dependencies
npm install

# Install Pusher JS + Laravel Echo for real-time
npm install pusher-js laravel-echo

# Install Chart.js for dashboard charts
npm install chart.js

# Install axios for AJAX requests
npm install axios
```

## STEP 3 — Configure Environment (.env)

Open `.env` file and replace with the following:

```env
APP_NAME=LP_AI
APP_ENV=local
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack

# MongoDB Configuration
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=LP_AI
DB_USERNAME=
DB_PASSWORD=

# OpenAI API Key — get from https://platform.openai.com
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_ORGANIZATION=

# Pusher Configuration — get from https://pusher.com (free account)
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_KEY=your_pusher_app_key
PUSHER_APP_SECRET=your_pusher_app_secret
PUSHER_APP_CLUSTER=mt1

# Queue for async AI processing
QUEUE_CONNECTION=database

# Session & Cache
SESSION_DRIVER=file
CACHE_DRIVER=file

# Mail (optional for notifications)
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
```

## STEP 4 — Configure config/database.php

Add MongoDB connection inside the `connections` array:

```php
'mongodb' => [
    'driver'   => 'mongodb',
    'host'     => env('DB_HOST', '127.0.0.1'),
    'port'     => env('DB_PORT', 27017),
    'database' => env('DB_DATABASE', 'LP_AI'),
    'username' => env('DB_USERNAME', ''),
    'password' => env('DB_PASSWORD', ''),
    'options'  => [
        'database' => env('DB_DATABASE', 'LP_AI'),
    ],
],
```

Also change the default:

```php
'default' => env('DB_CONNECTION', 'mongodb'),
```

## STEP 5 — Create Project Folder Structure (Run in terminal)

```bash
# Create all necessary directories
mkdir -p app/Http/Controllers
mkdir -p app/Models
mkdir -p app/Services
mkdir -p app/Jobs
mkdir -p resources/views/layouts
mkdir -p resources/views/auth
mkdir -p resources/views/dashboard
mkdir -p resources/views/transactions
mkdir -p resources/views/budget
mkdir -p resources/views/health
mkdir -p resources/views/reports
mkdir -p resources/views/ai
mkdir -p public/js
mkdir -p public/css
```

## STEP 6 — Create Queue Table & Run Setup

```bash
# Generate application key
php artisan key:generate

# Create queue jobs table (for async AI processing)
php artisan queue:table
php artisan migrate

# Publish OpenAI config
php artisan vendor:publish --provider="OpenAI\Laravel\ServiceProvider"

# Publish DomPDF config
php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"

# Clear and cache config
php artisan config:clear
php artisan cache:clear
```

## STEP 7 — Run the Project (Open 3 terminals in VS Code)

**Terminal 1 — Main Laravel Server:**

```bash
php artisan serve
```

**Terminal 2 — Queue Worker (processes AI jobs in background):**

```bash
php artisan queue:work
```

**Terminal 3 — Vite (compiles JS/CSS assets):**

```bash
npm run dev
```

Visit: http://localhost:8000

## STEP 8 — MongoDB Setup (if not installed)

Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
After installation, MongoDB runs automatically on port 27017.
No manual database creation needed — Laravel will auto-create LP_AI database.

## Important Notes

- Replace `sk-your-openai-api-key-here` with your real OpenAI API key
- Replace Pusher credentials with your real Pusher app credentials
- MongoDB must be running before starting Laravel
- The queue worker MUST be running for AI suggestions to work

# LP_AI — Complete File Placement Guide

# Every file from this project and exactly where to put it

## STEP 1: Navigate to your project

cd LP_AI

## ────────────────────────────────────────────────────────────

## ROUTES

## ────────────────────────────────────────────────────────────

# Replace contents of routes/web.php with: routes_web.php

## ────────────────────────────────────────────────────────────

## MODELS — place in app/Models/

## ────────────────────────────────────────────────────────────

# models_User.php → app/Models/User.php

# models_Transaction.php → app/Models/Transaction.php

# models_others.php → Split into:

# - app/Models/Budget.php

# - app/Models/AISuggestion.php

# - app/Models/HealthProfile.php

# - app/Models/Report.php

## ────────────────────────────────────────────────────────────

## CONTROLLERS — place in app/Http/Controllers/

## ────────────────────────────────────────────────────────────

# controllers_AuthController.php → app/Http/Controllers/AuthController.php

# controllers_DashboardController.php → app/Http/Controllers/DashboardController.php

# controllers_TransactionController.php → app/Http/Controllers/TransactionController.php

# controllers_AI_Health.php → Split into:

# - app/Http/Controllers/AIController.php

# - app/Http/Controllers/HealthController.php

# controllers_Budget_Report.php → Split into:

# - app/Http/Controllers/BudgetController.php

# - app/Http/Controllers/ReportController.php

## ────────────────────────────────────────────────────────────

## SERVICES — place in app/Services/

## ────────────────────────────────────────────────────────────

# services_AIService.php → app/Services/AIService.php

# services_FinanceService.php → app/Services/FinanceService.php

## ────────────────────────────────────────────────────────────

## JOBS — place in app/Jobs/

## ────────────────────────────────────────────────────────────

# jobs_ProcessAISuggestion.php → app/Jobs/ProcessAISuggestion.php

## ────────────────────────────────────────────────────────────

## EVENTS — place in app/Events/

## ────────────────────────────────────────────────────────────

# events_AISuggestionReady.php → app/Events/AISuggestionReady.php

## ────────────────────────────────────────────────────────────

## VIEWS — place in resources/views/

## ────────────────────────────────────────────────────────────

# views_layouts_app.blade.php → resources/views/layouts/app.blade.php

# views_auth_login.blade.php → resources/views/auth/login.blade.php

# views_auth_register.blade.php → resources/views/auth/register.blade.php

# views_dashboard_index.blade.php → resources/views/dashboard/index.blade.php

# views_transactions_create.blade.php → resources/views/transactions/create.blade.php

# views_transactions_index.blade.php → resources/views/transactions/index.blade.php

# views_health_index.blade.php → resources/views/health/index.blade.php

# views_ai_index.blade.php → resources/views/ai/index.blade.php

# views_budget_reports.blade.php → resources/views/budget/index.blade.php (top section)

# views_reports_index.blade.php → resources/views/reports/index.blade.php

## ────────────────────────────────────────────────────────────

## CONFIG — modify existing files

## ────────────────────────────────────────────────────────────

# In config/database.php:

# - Change default connection to 'mongodb'

# - Add mongodb connection block (see SETUP_COMMANDS.md)

## ────────────────────────────────────────────────────────────

## config/app.php — Register Service Providers

## ────────────────────────────────────────────────────────────

# Add in 'providers' array:

# MongoDB\Laravel\MongoDBServiceProvider::class,

# OpenAI\Laravel\ServiceProvider::class,

# Barryvdh\DomPDF\ServiceProvider::class,

## ────────────────────────────────────────────────────────────

## config/auth.php — Set MongoDB User Provider

## ────────────────────────────────────────────────────────────

# Change 'providers' → 'users' → 'driver' from 'eloquent' to 'eloquent'

# (Keep as eloquent - mongodb/laravel-mongodb handles this automatically)

## ────────────────────────────────────────────────────────────

## BROADCASTING — config/broadcasting.php

## ────────────────────────────────────────────────────────────

# Set default to 'pusher' (already in .env as BROADCAST_DRIVER=pusher)

## ────────────────────────────────────────────────────────────

## IMPORTANT: Add to routes/channels.php

## ────────────────────────────────────────────────────────────

# Broadcast::channel('user.{id}', function ($user, $id) {

# return (int) $user->id === (int) $id;

# });

## ────────────────────────────────────────────────────────────

## CREATE MISSING VIEWS (transactions/edit.blade.php)

## ────────────────────────────────────────────────────────────

# Copy transactions/create.blade.php to transactions/edit.blade.php

# Change form action to: route('transactions.update', $transaction->\_id)

# Add @method('PUT') after @csrf

# Pre-fill all input values with $transaction->field

## ────────────────────────────────────────────────────────────

## CREATE PDF EXPORT VIEW

## ────────────────────────────────────────────────────────────

# Create resources/views/reports/pdf.blade.php with basic HTML report layout

## ────────────────────────────────────────────────────────────

## FINAL COMMANDS AFTER ALL FILES ARE PLACED

## ────────────────────────────────────────────────────────────

# php artisan config:clear

# php artisan cache:clear

# php artisan route:clear

# php artisan view:clear

# php artisan optimize

# php artisan serve

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\ReportController;

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

});


<?php

namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'age',
        'gender',
        'monthly_income',
        'currency',
        'timezone',
        'avatar',
        'profile_complete',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
        'age'               => 'integer',
        'monthly_income'    => 'float',
        'profile_complete'  => 'boolean',
    ];

    // Relationships
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function budgets()
    {
        return $this->hasMany(Budget::class);
    }

    public function healthProfile()
    {
        return $this->hasOne(HealthProfile::class);
    }

    public function aiSuggestions()
    {
        return $this->hasMany(AISuggestion::class);
    }

    // Helper: get daily spending limit based on monthly income
    public function getDailyLimit(): float
    {
        return round($this->monthly_income / 30, 2);
    }
}

<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Transaction extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'transactions';

    protected $fillable = [
        'user_id',
        'type',        // income | expense | saving
        'category',    // food, transport, rent, salary, freelance, etc.
        'amount',
        'description',
        'date',
        'period',      // daily | weekly | monthly | annual
        'tags',        // array of custom tags
        'is_recurring',
        'recurring_interval', // daily | weekly | monthly
        'payment_method',     // cash | card | bank | mobile
        'location',
        'receipt_url',
        'notes',
    ];

    protected $casts = [
        'amount'       => 'float',
        'date'         => 'datetime',
        'tags'         => 'array',
        'is_recurring' => 'boolean',
    ];

    // Expense categories
    public static function expenseCategories(): array
    {
        return [
            'food'          => '🍽️ Food & Dining',
            'transport'     => '🚗 Transport',
            'rent'          => '🏠 Rent & Housing',
            'utilities'     => '💡 Utilities',
            'healthcare'    => '🏥 Healthcare',
            'education'     => '📚 Education',
            'entertainment' => '🎬 Entertainment',
            'shopping'      => '🛍️ Shopping',
            'savings'       => '💰 Savings',
            'investment'    => '📈 Investment',
            'insurance'     => '🛡️ Insurance',
            'personal'      => '👤 Personal Care',
            'family'        => '👨‍👩‍👧 Family',
            'charity'       => '❤️ Charity',
            'other'         => '📦 Other',
        ];
    }

    // Income categories
    public static function incomeCategories(): array
    {
        return [
            'salary'     => '💼 Salary',
            'freelance'  => '💻 Freelance',
            'business'   => '🏢 Business',
            'investment' => '📈 Investment Return',
            'rental'     => '🏠 Rental Income',
            'bonus'      => '🎁 Bonus',
            'gift'       => '🎀 Gift',
            'other'      => '📦 Other',
        ];
    }

    // Scopes
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeIncome($query)
    {
        return $query->where('type', 'income');
    }

    public function scopeExpense($query)
    {
        return $query->where('type', 'expense');
    }

    public function scopeSaving($query)
    {
        return $query->where('type', 'saving');
    }

    public function scopeForPeriod($query, string $period)
    {
        $now = now();
        return match($period) {
            'daily'   => $query->whereDate('date', $now->toDateString()),
            'weekly'  => $query->whereBetween('date', [$now->startOfWeek(), $now->endOfWeek()]),
            'monthly' => $query->whereYear('date', $now->year)->whereMonth('date', $now->month),
            'annual'  => $query->whereYear('date', $now->year),
            default   => $query,
        };
    }
}


<?php
// ============================================================
// app/Models/Budget.php
// ============================================================
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Budget extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'budgets';

    protected $fillable = [
        'user_id',
        'category',
        'limit_amount',
        'period',       // daily | weekly | monthly | annual
        'alert_at',     // percentage (e.g. 80 = alert when 80% used)
        'color',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'limit_amount' => 'float',
        'alert_at'     => 'integer',
        'is_active'    => 'boolean',
    ];
}

// ============================================================
// app/Models/AISuggestion.php
// ============================================================
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class AISuggestion extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'ai_suggestions';

    protected $fillable = [
        'user_id',
        'type',               // financial | health | combined
        'prompt_snapshot',    // the prompt sent to AI (for research)
        'suggestion_data',    // JSON decoded AI response
        'fin_score',          // 0-100 FinScore
        'daily_limit',
        'monthly_savings_target',
        'meal_plan',          // AI generated meal plan
        'tips',               // array of tips
        'anomalies',          // detected anomalies
        'model_used',         // gpt-4o etc.
        'tokens_used',
        'generated_at',
    ];

    protected $casts = [
        'suggestion_data' => 'array',
        'meal_plan'       => 'array',
        'tips'            => 'array',
        'anomalies'       => 'array',
        'fin_score'       => 'integer',
        'daily_limit'     => 'float',
        'tokens_used'     => 'integer',
        'generated_at'    => 'datetime',
    ];
}

// ============================================================
// app/Models/HealthProfile.php
// ============================================================
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class HealthProfile extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'health_profiles';

    protected $fillable = [
        'user_id',
        'age',
        'gender',
        'height_cm',
        'weight_kg',
        'bmi',
        'activity_level',       // sedentary | light | moderate | active | very_active
        'dietary_preferences',  // array: vegetarian, vegan, halal, gluten-free, etc.
        'allergies',            // array
        'health_conditions',    // array: diabetes, hypertension, etc.
        'health_goals',         // array: lose_weight, gain_muscle, maintain, etc.
        'daily_food_budget',
        'daily_calorie_target',
        'water_intake_target',  // liters
    ];

    protected $casts = [
        'height_cm'             => 'float',
        'weight_kg'             => 'float',
        'bmi'                   => 'float',
        'dietary_preferences'   => 'array',
        'allergies'             => 'array',
        'health_conditions'     => 'array',
        'health_goals'          => 'array',
        'daily_food_budget'     => 'float',
        'daily_calorie_target'  => 'integer',
        'water_intake_target'   => 'float',
    ];

    // Calculate BMI
    public function calculateBMI(): float
    {
        if ($this->height_cm && $this->weight_kg) {
            $heightM = $this->height_cm / 100;
            return round($this->weight_kg / ($heightM * $heightM), 1);
        }
        return 0;
    }

    public function getBMICategory(): string
    {
        $bmi = $this->bmi ?? $this->calculateBMI();
        if ($bmi < 18.5) return 'Underweight';
        if ($bmi < 25)   return 'Normal';
        if ($bmi < 30)   return 'Overweight';
        return 'Obese';
    }

    // Daily calorie needs using Mifflin-St Jeor equation
    public function calculateDailyCalories(): int
    {
        if (!$this->weight_kg || !$this->height_cm || !$this->age) return 2000;

        if ($this->gender === 'male') {
            $bmr = (10 * $this->weight_kg) + (6.25 * $this->height_cm) - (5 * $this->age) + 5;
        } else {
            $bmr = (10 * $this->weight_kg) + (6.25 * $this->height_cm) - (5 * $this->age) - 161;
        }

        $multiplier = match($this->activity_level) {
            'sedentary'   => 1.2,
            'light'       => 1.375,
            'moderate'    => 1.55,
            'active'      => 1.725,
            'very_active' => 1.9,
            default       => 1.55,
        };

        return (int) round($bmr * $multiplier);
    }
}

// ============================================================
// app/Models/Report.php
// ============================================================
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Report extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'reports';

    protected $fillable = [
        'user_id',
        'period_type',      // monthly | annual
        'period_label',     // "2025-01" or "2025"
        'total_income',
        'total_expenses',
        'total_savings',
        'net_balance',
        'savings_rate',
        'top_expense_categories',
        'daily_average_spend',
        'budget_adherence',
        'fin_score_avg',
        'forecast_next_month',
        'generated_at',
    ];

    protected $casts = [
        'total_income'             => 'float',
        'total_expenses'           => 'float',
        'total_savings'            => 'float',
        'net_balance'              => 'float',
        'savings_rate'             => 'float',
        'top_expense_categories'   => 'array',
        'daily_average_spend'      => 'float',
        'budget_adherence'         => 'float',
        'fin_score_avg'            => 'integer',
        'forecast_next_month'      => 'array',
        'generated_at'             => 'datetime',
    ];
}


<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|min:6',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('dashboard'))
                ->with('success', 'Welcome back, ' . Auth::user()->name . '!');
        }

        return back()->withErrors([
            'email' => 'Invalid credentials. Please try again.',
        ])->withInput($request->except('password'));
    }

    public function showRegister()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'             => 'required|string|max:100',
            'email'            => 'required|email|unique:users,email',
            'password'         => 'required|min:6|confirmed',
            'age'              => 'required|integer|min:13|max:120',
            'monthly_income'   => 'required|numeric|min:0',
            'gender'           => 'required|in:male,female,other',
            'currency'         => 'nullable|string|max:5',
        ]);

        $user = User::create([
            'name'             => $request->name,
            'email'            => $request->email,
            'password'         => Hash::make($request->password),
            'age'              => $request->age,
            'monthly_income'   => $request->monthly_income,
            'gender'           => $request->gender,
            'currency'         => $request->currency ?? 'USD',
            'profile_complete' => false,
        ]);

        Auth::login($user);

        return redirect()->route('health.index')
            ->with('success', 'Account created! Please complete your health profile to unlock AI suggestions.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login')->with('success', 'You have been logged out.');
    }
}


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

        // Budget status
        $budgets = Budget::where('user_id', $userId)->where('is_active', true)->get();

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

        $totals = [
            'income'  => Transaction::forUser($userId)->forPeriod($period)->income()->sum('amount'),
            'expense' => Transaction::forUser($userId)->forPeriod($period)->expense()->sum('amount'),
            'saving'  => Transaction::forUser($userId)->forPeriod($period)->saving()->sum('amount'),
        ];

        return view('transactions.index', compact('transactions', 'totals', 'period', 'type'));
    }

    public function create()
    {
        $expenseCategories = Transaction::expenseCategories();
        $incomeCategories  = Transaction::incomeCategories();
        return view('transactions.create', compact('expenseCategories', 'incomeCategories'));
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
            'notes'              => 'nullable|string|max:500',
            'tags'               => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['tags']    = $request->tags ? array_map('trim', explode(',', $request->tags)) : [];
        $validated['date']    = \Carbon\Carbon::parse($request->date);

        $transaction = Transaction::create($validated);

        // Trigger AI suggestion processing asynchronously
        ProcessAISuggestion::dispatch(Auth::id())->delay(now()->addSeconds(3));

        if ($request->ajax()) {
            return response()->json([
                'success'     => true,
                'message'     => 'Transaction added successfully!',
                'transaction' => $transaction,
            ]);
        }

        return redirect()->route('transactions.index')
            ->with('success', 'Transaction added! AI is updating your suggestions...');
    }

    public function edit($id)
    {
        $transaction       = Transaction::where('_id', $id)->where('user_id', Auth::id())->firstOrFail();
        $expenseCategories = Transaction::expenseCategories();
        $incomeCategories  = Transaction::incomeCategories();
        return view('transactions.edit', compact('transaction', 'expenseCategories', 'incomeCategories'));
    }

    public function update(Request $request, $id)
    {
        $transaction = Transaction::where('_id', $id)->where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'type'           => 'required|in:income,expense,saving',
            'category'       => 'required|string|max:50',
            'amount'         => 'required|numeric|min:0.01',
            'description'    => 'required|string|max:200',
            'date'           => 'required|date',
            'period'         => 'required|in:daily,weekly,monthly,annual',
            'payment_method' => 'nullable|in:cash,card,bank,mobile',
            'notes'          => 'nullable|string|max:500',
        ]);

        $validated['date'] = \Carbon\Carbon::parse($request->date);
        $transaction->update($validated);

        ProcessAISuggestion::dispatch(Auth::id())->delay(now()->addSeconds(3));

        return redirect()->route('transactions.index')
            ->with('success', 'Transaction updated successfully!');
    }

    public function destroy($id)
    {
        $transaction = Transaction::where('_id', $id)->where('user_id', Auth::id())->firstOrFail();
        $transaction->delete();

        return response()->json(['success' => true, 'message' => 'Transaction deleted.']);
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
            return response()->json(['error' => 'Invalid period'], 422);
        }

        $income  = Transaction::forUser($userId)->forPeriod($period)->income()->sum('amount');
        $expense = Transaction::forUser($userId)->forPeriod($period)->expense()->sum('amount');
        $saving  = Transaction::forUser($userId)->forPeriod($period)->saving()->sum('amount');

        return response()->json([
            'period'  => $period,
            'income'  => round($income, 2),
            'expense' => round($expense, 2),
            'saving'  => round($saving, 2),
            'balance' => round($income - $expense, 2),
        ]);
    }
}

<?php

// ============================================================
// app/Http/Controllers/AIController.php
// ============================================================

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AISuggestion;
use App\Models\HealthProfile;
use App\Services\AIService;
use App\Services\FinanceService;
use App\Jobs\ProcessAISuggestion;

class AIController extends Controller
{
    protected AIService     $aiService;
    protected FinanceService $financeService;

    public function __construct(AIService $aiService, FinanceService $financeService)
    {
        $this->aiService      = $aiService;
        $this->financeService = $financeService;
    }

    public function index()
    {
        $userId      = Auth::id();
        $suggestions = AISuggestion::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $latestSuggestion = $suggestions->first();
        $health           = HealthProfile::where('user_id', $userId)->first();

        return view('ai.index', compact('suggestions', 'latestSuggestion', 'health'));
    }

    public function generate(Request $request)
    {
        $userId = Auth::id();

        // Dispatch AI job
        ProcessAISuggestion::dispatch($userId);

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'AI is analyzing your data. Suggestions will appear shortly!',
            ]);
        }

        return back()->with('info', 'AI analysis started. Refresh in a few seconds!');
    }

    public function getSuggestions(Request $request)
    {
        $userId = Auth::id();

        $suggestion = AISuggestion::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$suggestion) {
            return response()->json(['success' => false, 'message' => 'No suggestions yet.']);
        }

        return response()->json(['success' => true, 'data' => $suggestion]);
    }

    public function getFinScore()
    {
        $userId = Auth::id();

        $stats    = $this->financeService->getSummary($userId, 'monthly');
        $finScore = $this->aiService->calculateFinScore(Auth::user(), $stats);

        return response()->json(['success' => true, 'fin_score' => $finScore]);
    }

    public function detectAnomalies()
    {
        $userId    = Auth::id();
        $anomalies = $this->financeService->detectAnomalies($userId);

        return response()->json(['success' => true, 'anomalies' => $anomalies]);
    }
}

// ============================================================
// app/Http/Controllers/HealthController.php
// ============================================================

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\HealthProfile;
use App\Jobs\ProcessAISuggestion;

class HealthController extends Controller
{
    public function index()
    {
        $health = HealthProfile::where('user_id', Auth::id())->first();
        return view('health.index', compact('health'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'age'                  => 'required|integer|min:13|max:120',
            'gender'               => 'required|in:male,female,other',
            'height_cm'            => 'required|numeric|min:50|max:300',
            'weight_kg'            => 'required|numeric|min:10|max:500',
            'activity_level'       => 'required|in:sedentary,light,moderate,active,very_active',
            'dietary_preferences'  => 'nullable|array',
            'allergies'            => 'nullable|array',
            'health_conditions'    => 'nullable|array',
            'health_goals'         => 'nullable|array',
            'daily_food_budget'    => 'required|numeric|min:0',
        ]);

        $validated['user_id']   = Auth::id();
        $validated['bmi']       = $this->calculateBMI($validated['weight_kg'], $validated['height_cm']);

        // Create temporary object to get calorie calculation
        $tempHealth = new HealthProfile($validated);
        $validated['daily_calorie_target'] = $tempHealth->calculateDailyCalories();

        HealthProfile::updateOrCreate(['user_id' => Auth::id()], $validated);

        // Update user profile_complete
        Auth::user()->update(['profile_complete' => true, 'age' => $validated['age'], 'gender' => $validated['gender']]);

        // Trigger AI update
        ProcessAISuggestion::dispatch(Auth::id())->delay(now()->addSeconds(2));

        return redirect()->route('dashboard')
            ->with('success', 'Health profile saved! AI is generating personalized suggestions...');
    }

    public function update(Request $request)
    {
        return $this->store($request); // Same logic
    }

    public function getMealPlan()
    {
        $userId     = Auth::id();
        $suggestion = \App\Models\AISuggestion::where('user_id', $userId)
            ->whereNotNull('meal_plan')
            ->orderBy('created_at', 'desc')
            ->first();

        return response()->json([
            'success'   => (bool) $suggestion,
            'meal_plan' => $suggestion?->meal_plan ?? null,
        ]);
    }

    private function calculateBMI(float $weight, float $height): float
    {
        $heightM = $height / 100;
        return round($weight / ($heightM * $heightM), 1);
    }
}


<?php

// ============================================================
// app/Http/Controllers/BudgetController.php
// ============================================================

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
                ->sum('amount');

            $budget->spent      = round($spent, 2);
            $budget->percentage = $budget->limit_amount > 0
                ? min(100, round(($spent / $budget->limit_amount) * 100, 1))
                : 0;
            $budget->remaining  = max(0, round($budget->limit_amount - $spent, 2));
            $budget->over_limit = $spent > $budget->limit_amount;

            return $budget;
        });

        $categories = Transaction::expenseCategories();

        return view('budget.index', compact('budgetsWithSpent', 'categories'));
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

        return response()->json(['success' => true, 'message' => 'Budget set successfully!']);
    }

    public function update(Request $request, $id)
    {
        $budget = Budget::where('_id', $id)->where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'limit_amount' => 'required|numeric|min:0.01',
            'alert_at'     => 'nullable|integer|min:1|max:100',
        ]);

        $budget->update($validated);

        return response()->json(['success' => true, 'message' => 'Budget updated!']);
    }

    public function destroy($id)
    {
        $budget = Budget::where('_id', $id)->where('user_id', Auth::id())->firstOrFail();
        $budget->update(['is_active' => false]);

        return response()->json(['success' => true, 'message' => 'Budget removed.']);
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
                ->sum('amount');

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

// ============================================================
// app/Http/Controllers/ReportController.php
// ============================================================

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Report;
use App\Models\Transaction;
use App\Services\FinanceService;
use Barryvdh\DomPDF\Facade\Pdf;

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

        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);

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


<?php

namespace App\Services;

use App\Models\User;
use App\Models\AISuggestion;
use App\Models\HealthProfile;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;

class AIService
{
    /**
     * Generate comprehensive AI suggestion for a user.
     * Combines financial analysis + health/meal recommendations.
     */
    public function generateSuggestion(User $user, array $financialStats, ?HealthProfile $health): ?AISuggestion
    {
        try {
            $prompt    = $this->buildPrompt($user, $financialStats, $health);
            $response  = $this->callOpenAI($prompt);
            $parsed    = $this->parseResponse($response['content']);
            $finScore  = $this->calculateFinScore($user, $financialStats);

            $suggestion = AISuggestion::create([
                'user_id'          => $user->id,
                'type'             => 'combined',
                'prompt_snapshot'  => $prompt,
                'suggestion_data'  => $parsed,
                'fin_score'        => $finScore,
                'daily_limit'      => $parsed['daily_spending_limit'] ?? $user->getDailyLimit(),
                'meal_plan'        => $parsed['meal_plan'] ?? null,
                'tips'             => $parsed['financial_tips'] ?? [],
                'anomalies'        => $parsed['anomalies'] ?? [],
                'model_used'       => 'gpt-4o',
                'tokens_used'      => $response['tokens'] ?? 0,
                'generated_at'     => now(),
            ]);

            return $suggestion;

        } catch (\Exception $e) {
            Log::error('AI Suggestion Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Build a structured prompt with real user data.
     */
    private function buildPrompt(User $user, array $stats, ?HealthProfile $health): string
    {
        $currency      = $user->currency ?? 'USD';
        $healthSection = '';

        if ($health) {
            $bmiCategory   = $health->getBMICategory();
            $calorieTarget = $health->calculateDailyCalories();
            $dietPref      = implode(', ', $health->dietary_preferences ?? ['no restrictions']);
            $conditions    = implode(', ', $health->health_conditions ?? ['none']);
            $goals         = implode(', ', $health->health_goals ?? ['maintain health']);

            $healthSection = "
HEALTH PROFILE:
- Age: {$user->age} years
- Gender: {$user->gender}
- BMI: {$health->bmi} ({$bmiCategory})
- Activity Level: {$health->activity_level}
- Daily Calorie Target: {$calorieTarget} calories
- Dietary Preferences: {$dietPref}
- Health Conditions: {$conditions}
- Health Goals: {$goals}
- Daily Food Budget: {$currency} {$health->daily_food_budget}
";
        }

        $topCategories  = collect($stats['category_breakdown'] ?? [])->take(5)
            ->map(fn($v, $k) => "{$k}: {$currency} {$v}")->implode(', ');

        return "
You are a financial advisor and nutritionist AI. Analyze the following user data and provide personalized recommendations.

USER FINANCIAL PROFILE:
- Name: {$user->name}
- Monthly Income: {$currency} {$user->monthly_income}
- This Month Income: {$currency} {$stats['monthly_income']}
- This Month Expenses: {$currency} {$stats['monthly_expense']}
- This Month Savings: {$currency} {$stats['monthly_saving']}
- Savings Rate: {$stats['savings_rate']}%
- Today's Spending: {$currency} {$stats['today_expense']}
- Top Expense Categories: {$topCategories}
- Weekly Expense: {$currency} {$stats['weekly_expense']}
- Annual Projected Expense: {$currency} {$stats['annual_expense']}

{$healthSection}

Please respond ONLY with a valid JSON object (no markdown, no extra text) with this exact structure:
{
  \"daily_spending_limit\": <number>,
  \"monthly_savings_target\": <number>,
  \"annual_savings_projection\": <number>,
  \"financial_health_summary\": \"<2-3 sentences about financial health>\",
  \"financial_tips\": [
    \"<tip 1>\",
    \"<tip 2>\",
    \"<tip 3>\"
  ],
  \"spending_warning\": \"<warning if overspending, else null>\",
  \"anomalies\": [
    {\"category\": \"<category>\", \"message\": \"<anomaly description>\"}
  ],
  \"meal_plan\": {
    \"breakfast\": {\"meal\": \"<meal name>\", \"calories\": <number>, \"cost\": <number>, \"nutrients\": \"<brief nutrients>\"},
    \"lunch\": {\"meal\": \"<meal name>\", \"calories\": <number>, \"cost\": <number>, \"nutrients\": \"<brief nutrients>\"},
    \"dinner\": {\"meal\": \"<meal name>\", \"calories\": <number>, \"cost\": <number>, \"nutrients\": \"<brief nutrients>\"},
    \"snacks\": {\"meal\": \"<snack options>\", \"calories\": <number>, \"cost\": <number>, \"nutrients\": \"<brief nutrients>\"},
    \"total_daily_calories\": <number>,
    \"total_daily_cost\": <number>,
    \"hydration_tip\": \"<water intake recommendation>\"
  },
  \"investment_suggestion\": \"<brief investment advice based on savings rate>\",
  \"emergency_fund_status\": \"<whether user has adequate emergency fund based on expenses>\"
}
";
    }

    /**
     * Call OpenAI API.
     */
    private function callOpenAI(string $prompt): array
    {
        $response = OpenAI::chat()->create([
            'model'       => 'gpt-4o',
            'messages'    => [
                [
                    'role'    => 'system',
                    'content' => 'You are a professional financial advisor and nutritionist. Always respond with valid JSON only. No markdown formatting.',
                ],
                [
                    'role'    => 'user',
                    'content' => $prompt,
                ],
            ],
            'temperature' => 0.7,
            'max_tokens'  => 1500,
        ]);

        return [
            'content' => $response->choices[0]->message->content,
            'tokens'  => $response->usage->totalTokens ?? 0,
        ];
    }

    /**
     * Parse JSON response from AI.
     */
    private function parseResponse(string $content): array
    {
        // Strip possible markdown code blocks
        $content = preg_replace('/```json\s*/', '', $content);
        $content = preg_replace('/```\s*/', '', $content);
        $content = trim($content);

        $decoded = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::warning('AI response JSON parse error: ' . json_last_error_msg());
            return $this->getFallbackResponse();
        }

        return $decoded;
    }

    /**
     * Calculate FinScore (0–100) based on financial metrics.
     * Proprietary scoring algorithm.
     */
    public function calculateFinScore(User $user, array $stats): int
    {
        $score = 0;

        // 1. Savings Rate (30 points max)
        $savingsRate = $stats['savings_rate'] ?? 0;
        $score += min(30, ($savingsRate / 100) * 30 * 3.33); // 10% rate = 10pts, 30% = 30pts

        // 2. Expense vs Income ratio (25 points max)
        $monthlyIncome  = max(1, $stats['monthly_income'] ?? $user->monthly_income ?? 1);
        $monthlyExpense = $stats['monthly_expense'] ?? 0;
        $expenseRatio   = $monthlyExpense / $monthlyIncome;
        $score += max(0, 25 - ($expenseRatio * 25));

        // 3. Regular transaction logging (20 points max)
        $transactionCount = $stats['transaction_count'] ?? 0;
        $score += min(20, $transactionCount * 2); // 10 transactions = 20pts

        // 4. Today spending vs daily limit (15 points max)
        $dailyLimit    = $user->getDailyLimit();
        $todayExpense  = $stats['today_expense'] ?? 0;
        if ($dailyLimit > 0) {
            $dayRatio = $todayExpense / $dailyLimit;
            $score += $dayRatio <= 1 ? 15 : max(0, 15 - (($dayRatio - 1) * 15));
        } else {
            $score += 10;
        }

        // 5. Savings existence bonus (10 points)
        $score += ($stats['monthly_saving'] ?? 0) > 0 ? 10 : 0;

        return min(100, max(0, (int) round($score)));
    }

    /**
     * Fallback if AI call fails.
     */
    private function getFallbackResponse(): array
    {
        return [
            'daily_spending_limit'      => 0,
            'monthly_savings_target'    => 0,
            'financial_health_summary'  => 'Unable to generate AI analysis at this time. Please try again.',
            'financial_tips'            => [
                'Track your daily expenses consistently.',
                'Aim to save at least 20% of your monthly income.',
                'Review your top spending categories weekly.',
            ],
            'spending_warning'          => null,
            'anomalies'                 => [],
            'meal_plan'                 => null,
            'investment_suggestion'     => 'Build an emergency fund of 3–6 months of expenses first.',
            'emergency_fund_status'     => 'Data insufficient to assess.',
        ];
    }
}

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
        $income  = Transaction::forUser($userId)->forPeriod($period)->income()->sum('amount');
        $expense = Transaction::forUser($userId)->forPeriod($period)->expense()->sum('amount');
        $saving  = Transaction::forUser($userId)->forPeriod($period)->saving()->sum('amount');

        $todayExpense = Transaction::forUser($userId)->forPeriod('daily')->expense()->sum('amount');

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
            'weekly_expense'       => round(Transaction::forUser($userId)->forPeriod('weekly')->expense()->sum('amount'), 2),
            'annual_expense'       => round(Transaction::forUser($userId)->forPeriod('annual')->expense()->sum('amount'), 2),
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
            $year  = $date->year;
            $month = $date->month;

            $labels[]  = $date->format('M Y');
            $income[]  = round(Transaction::forUser($userId)->whereYear('date', $year)->whereMonth('date', $month)->income()->sum('amount'), 2);
            $expense[] = round(Transaction::forUser($userId)->whereYear('date', $year)->whereMonth('date', $month)->expense()->sum('amount'), 2);
            $saving[]  = round(Transaction::forUser($userId)->whereYear('date', $year)->whereMonth('date', $month)->saving()->sum('amount'), 2);
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
                $date = Carbon::now()->subMonths($i);
                $threeMonthAvg += Transaction::forUser($userId)
                    ->expense()
                    ->where('category', $category)
                    ->whereYear('date', $date->year)
                    ->whereMonth('date', $date->month)
                    ->sum('amount');
            }
            $threeMonthAvg /= 3;

            // This month
            $thisMonth = Transaction::forUser($userId)
                ->forPeriod('monthly')
                ->expense()
                ->where('category', $category)
                ->sum('amount');

            // Flag if this month is 200%+ more than average (minimum $10 threshold)
            if ($threeMonthAvg > 10 && $thisMonth > ($threeMonthAvg * 2)) {
                $increase = round((($thisMonth - $threeMonthAvg) / $threeMonthAvg) * 100, 0);
                $anomalies[] = [
                    'category'    => $category,
                    'this_month'  => round($thisMonth, 2),
                    'avg_3months' => round($threeMonthAvg, 2),
                    'increase_pct' => $increase,
                    'message'     => ucfirst($category) . " spending is {$increase}% higher than your 3-month average.",
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
            $date = Carbon::now()->subMonths($i);
            $months[]  = $i;
            $amounts[] = Transaction::forUser($userId)
                ->whereYear('date', $date->year)
                ->whereMonth('date', $date->month)
                ->expense()
                ->sum('amount');
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


<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\HealthProfile;
use App\Services\AIService;
use App\Services\FinanceService;
use App\Events\AISuggestionReady;

class ProcessAISuggestion implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $timeout = 60;

    public function __construct(protected string $userId) {}

    public function handle(AIService $aiService, FinanceService $financeService): void
    {
        try {
            $user   = User::findOrFail($this->userId);
            $health = HealthProfile::where('user_id', $this->userId)->first();
            $stats  = $financeService->getSummary($this->userId, 'monthly');

            $suggestion = $aiService->generateSuggestion($user, $stats, $health);

            if ($suggestion) {
                // Broadcast real-time update to user's browser via Pusher
                broadcast(new AISuggestionReady($this->userId, $suggestion))->toOthers();
                Log::info("AI suggestion generated for user {$this->userId}");
            }

        } catch (\Exception $e) {
            Log::error("ProcessAISuggestion failed for user {$this->userId}: " . $e->getMessage());
            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("ProcessAISuggestion job permanently failed for user {$this->userId}: " . $exception->getMessage());
    }
}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Dashboard') — LP_AI</title>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --primary-light: #e0e7ff;
            --success: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --info: #3b82f6;
            --dark: #1e293b;
            --gray: #64748b;
            --light: #f8fafc;
            --border: #e2e8f0;
            --card-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
            --sidebar-width: 260px;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #f1f5f9;
            color: var(--dark);
            display: flex;
            min-height: 100vh;
        }

        /* ===== SIDEBAR ===== */
        .sidebar {
            width: var(--sidebar-width);
            background: #0f172a;
            color: #cbd5e1;
            position: fixed;
            top: 0; left: 0; bottom: 0;
            display: flex;
            flex-direction: column;
            z-index: 100;
            transition: transform 0.3s ease;
        }

        .sidebar-logo {
            padding: 24px 20px;
            border-bottom: 1px solid #1e293b;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .sidebar-logo .logo-icon {
            width: 40px; height: 40px;
            background: linear-gradient(135deg, var(--primary), #8b5cf6);
            border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            font-size: 18px;
        }

        .sidebar-logo .logo-text {
            font-size: 20px;
            font-weight: 700;
            color: #f1f5f9;
            letter-spacing: -0.5px;
        }

        .sidebar-logo .logo-text span { color: var(--primary); }

        .sidebar-nav { flex: 1; padding: 16px 0; overflow-y: auto; }

        .nav-section-title {
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #475569;
            padding: 12px 20px 6px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 11px 20px;
            color: #94a3b8;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            border-radius: 0;
            transition: all 0.2s;
            position: relative;
            margin: 1px 0;
        }

        .nav-item:hover { background: #1e293b; color: #e2e8f0; }

        .nav-item.active {
            background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1));
            color: #818cf8;
            border-left: 3px solid var(--primary);
        }

        .nav-item i { width: 18px; text-align: center; font-size: 15px; }

        .nav-badge {
            margin-left: auto;
            background: var(--danger);
            color: white;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 20px;
        }

        .sidebar-footer {
            padding: 16px 20px;
            border-top: 1px solid #1e293b;
        }

        .user-card {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: #1e293b;
            border-radius: 10px;
        }

        .user-avatar {
            width: 36px; height: 36px;
            background: linear-gradient(135deg, var(--primary), #8b5cf6);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-weight: 700;
            color: white;
            font-size: 14px;
        }

        .user-info { flex: 1; min-width: 0; }
        .user-info .name { font-size: 13px; font-weight: 600; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-info .email { font-size: 11px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* ===== MAIN CONTENT ===== */
        .main-content {
            margin-left: var(--sidebar-width);
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        /* ===== TOP BAR ===== */
        .topbar {
            background: white;
            border-bottom: 1px solid var(--border);
            padding: 0 28px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 50;
        }

        .topbar-title { font-size: 18px; font-weight: 700; color: var(--dark); }
        .topbar-subtitle { font-size: 12px; color: var(--gray); margin-top: 1px; }

        .topbar-actions { display: flex; align-items: center; gap: 12px; }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 9px 18px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            text-decoration: none;
            transition: all 0.2s;
        }

        .btn-primary { background: var(--primary); color: white; }
        .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.4); }
        .btn-success { background: var(--success); color: white; }
        .btn-success:hover { background: #059669; }
        .btn-danger { background: var(--danger); color: white; }
        .btn-outline { background: white; color: var(--dark); border: 1px solid var(--border); }
        .btn-outline:hover { background: var(--light); }
        .btn-sm { padding: 6px 14px; font-size: 12px; }

        /* ===== PAGE CONTENT ===== */
        .page-content { padding: 28px; flex: 1; }

        /* ===== CARDS ===== */
        .card {
            background: white;
            border-radius: 14px;
            padding: 24px;
            box-shadow: var(--card-shadow);
            border: 1px solid var(--border);
        }

        .card-title {
            font-size: 15px;
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        /* ===== STAT CARDS ===== */
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }

        .stat-card {
            background: white;
            border-radius: 14px;
            padding: 20px;
            box-shadow: var(--card-shadow);
            border: 1px solid var(--border);
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0; right: 0;
            width: 80px; height: 80px;
            border-radius: 0 0 0 80px;
            opacity: 0.08;
        }

        .stat-card.income::before { background: var(--success); }
        .stat-card.expense::before { background: var(--danger); }
        .stat-card.saving::before { background: var(--info); }
        .stat-card.balance::before { background: var(--primary); }

        .stat-icon {
            width: 44px; height: 44px;
            border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            font-size: 18px;
            margin-bottom: 14px;
        }

        .stat-card.income .stat-icon { background: #d1fae5; color: var(--success); }
        .stat-card.expense .stat-icon { background: #fee2e2; color: var(--danger); }
        .stat-card.saving .stat-icon { background: #dbeafe; color: var(--info); }
        .stat-card.balance .stat-icon { background: var(--primary-light); color: var(--primary); }

        .stat-label { font-size: 12px; color: var(--gray); font-weight: 500; margin-bottom: 4px; }
        .stat-value { font-size: 24px; font-weight: 700; color: var(--dark); }
        .stat-sub { font-size: 12px; color: var(--gray); margin-top: 6px; }
        .stat-sub .up { color: var(--success); }
        .stat-sub .down { color: var(--danger); }

        /* ===== CHARTS ===== */
        .chart-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
        }

        /* ===== TABLES ===== */
        .table-container { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { font-size: 11px; font-weight: 700; color: var(--gray); text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 16px; border-bottom: 2px solid var(--border); text-align: left; }
        td { padding: 13px 16px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: var(--dark); vertical-align: middle; }
        tr:hover td { background: #f8fafc; }

        /* ===== BADGES ===== */
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
        }
        .badge-income  { background: #d1fae5; color: #065f46; }
        .badge-expense { background: #fee2e2; color: #991b1b; }
        .badge-saving  { background: #dbeafe; color: #1e40af; }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-success { background: #d1fae5; color: #065f46; }

        /* ===== ALERTS ===== */
        .alert {
            padding: 14px 16px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .alert-success { background: #d1fae5; color: #065f46; border-left: 4px solid var(--success); }
        .alert-danger   { background: #fee2e2; color: #991b1b; border-left: 4px solid var(--danger); }
        .alert-warning  { background: #fef3c7; color: #92400e; border-left: 4px solid var(--warning); }
        .alert-info     { background: #dbeafe; color: #1e40af; border-left: 4px solid var(--info); }

        /* ===== FORMS ===== */
        .form-group { margin-bottom: 18px; }
        .form-label { font-size: 13px; font-weight: 600; color: var(--dark); margin-bottom: 6px; display: block; }
        .form-control {
            width: 100%;
            padding: 10px 14px;
            border: 1.5px solid var(--border);
            border-radius: 8px;
            font-size: 13px;
            font-family: 'Inter', sans-serif;
            color: var(--dark);
            background: white;
            transition: border-color 0.2s;
            outline: none;
        }
        .form-control:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-error { color: var(--danger); font-size: 12px; margin-top: 4px; }

        /* ===== FIN SCORE RING ===== */
        .fin-score-container { text-align: center; padding: 20px; }
        .fin-score-ring {
            position: relative;
            width: 140px;
            height: 140px;
            margin: 0 auto 14px;
        }

        /* ===== PROGRESS BAR ===== */
        .progress-bar {
            background: #f1f5f9;
            border-radius: 10px;
            height: 8px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 1s ease;
        }

        /* ===== AI SUGGESTION CARD ===== */
        .ai-card {
            background: linear-gradient(135deg, #1e1b4b, #312e81);
            color: white;
            border-radius: 16px;
            padding: 24px;
            position: relative;
            overflow: hidden;
        }

        .ai-card::before {
            content: '🤖';
            position: absolute;
            top: -10px; right: -10px;
            font-size: 80px;
            opacity: 0.1;
        }

        .ai-card .ai-title { font-size: 14px; font-weight: 500; color: #a5b4fc; margin-bottom: 8px; }
        .ai-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 16px; }
        .ai-tip {
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 13px;
            margin-bottom: 8px;
            backdrop-filter: blur(4px);
        }
        .ai-tip::before { content: '💡 '; }

        /* ===== MEAL PLAN ===== */
        .meal-card {
            background: white;
            border-radius: 12px;
            padding: 16px;
            border: 1px solid var(--border);
        }
        .meal-card .meal-time { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--primary); margin-bottom: 6px; }
        .meal-card .meal-name { font-size: 15px; font-weight: 600; color: var(--dark); margin-bottom: 4px; }
        .meal-card .meal-meta { font-size: 12px; color: var(--gray); }
        .meal-card .meal-cost { font-weight: 700; color: var(--success); }

        /* ===== ANOMALY ===== */
        .anomaly-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            background: #fff7ed;
            border-radius: 10px;
            border-left: 4px solid var(--warning);
            margin-bottom: 8px;
        }
        .anomaly-item .anomaly-icon { font-size: 20px; }
        .anomaly-item .anomaly-msg { font-size: 13px; color: #92400e; font-weight: 500; }

        /* ===== TOAST NOTIFICATION ===== */
        #toast-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .toast {
            background: white;
            border-radius: 12px;
            padding: 14px 18px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.12);
            border-left: 4px solid var(--success);
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideUp 0.3s ease;
            max-width: 320px;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
            .sidebar { transform: translateX(-100%); }
            .sidebar.open { transform: translateX(0); }
            .main-content { margin-left: 0; }
            .chart-grid { grid-template-columns: 1fr; }
            .form-row { grid-template-columns: 1fr; }
            .stat-grid { grid-template-columns: 1fr 1fr; }
        }
    </style>

    @stack('styles')
</head>
<body>

<!-- SIDEBAR -->
<nav class="sidebar" id="sidebar">
    <div class="sidebar-logo">
        <div class="logo-icon">💰</div>
        <div class="logo-text">LP<span>_AI</span></div>
    </div>

    <div class="sidebar-nav">
        <div class="nav-section-title">Main</div>
        <a href="{{ route('dashboard') }}" class="nav-item {{ request()->routeIs('dashboard') ? 'active' : '' }}">
            <i class="fas fa-chart-pie"></i> Dashboard
        </a>

        <div class="nav-section-title">Finance</div>
        <a href="{{ route('transactions.index') }}" class="nav-item {{ request()->routeIs('transactions.*') ? 'active' : '' }}">
            <i class="fas fa-exchange-alt"></i> Transactions
        </a>
        <a href="{{ route('budget.index') }}" class="nav-item {{ request()->routeIs('budget.*') ? 'active' : '' }}">
            <i class="fas fa-wallet"></i> Budget
        </a>
        <a href="{{ route('reports.index') }}" class="nav-item {{ request()->routeIs('reports.*') ? 'active' : '' }}">
            <i class="fas fa-file-chart-line"></i> Reports
        </a>

        <div class="nav-section-title">Health & AI</div>
        <a href="{{ route('health.index') }}" class="nav-item {{ request()->routeIs('health.*') ? 'active' : '' }}">
            <i class="fas fa-heartbeat"></i> Health Profile
        </a>
        <a href="{{ route('ai.index') }}" class="nav-item {{ request()->routeIs('ai.*') ? 'active' : '' }}">
            <i class="fas fa-robot"></i> AI Advisor
            <span class="nav-badge">AI</span>
        </a>
    </div>

    <div class="sidebar-footer">
        <div class="user-card">
            <div class="user-avatar">{{ strtoupper(substr(auth()->user()->name, 0, 1)) }}</div>
            <div class="user-info">
                <div class="name">{{ auth()->user()->name }}</div>
                <div class="email">{{ auth()->user()->email }}</div>
            </div>
            <form method="POST" action="{{ route('logout') }}" style="margin:0">
                @csrf
                <button type="submit" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:14px;" title="Logout">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </form>
        </div>
    </div>
</nav>

<!-- MAIN CONTENT -->
<div class="main-content">
    <!-- TOP BAR -->
    <div class="topbar">
        <div>
            <div class="topbar-title">@yield('page-title', 'Dashboard')</div>
            <div class="topbar-subtitle">{{ now()->format('l, F j Y') }}</div>
        </div>
        <div class="topbar-actions">
            @yield('topbar-actions')
            <!-- Realtime AI Status -->
            <div id="ai-status" style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--gray);">
                <span id="ai-dot" style="width:8px;height:8px;border-radius:50%;background:var(--success);display:inline-block;"></span>
                AI Active
            </div>
        </div>
    </div>

    <!-- PAGE CONTENT -->
    <div class="page-content">
        @if(session('success'))
            <div class="alert alert-success"><i class="fas fa-check-circle"></i> {{ session('success') }}</div>
        @endif
        @if(session('info'))
            <div class="alert alert-info"><i class="fas fa-info-circle"></i> {{ session('info') }}</div>
        @endif
        @if(session('error'))
            <div class="alert alert-danger"><i class="fas fa-exclamation-triangle"></i> {{ session('error') }}</div>
        @endif

        @yield('content')
    </div>
</div>

<!-- TOAST CONTAINER -->
<div id="toast-container"></div>

<!-- PUSHER REAL-TIME -->
<script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/laravel-echo@1.16.0/dist/echo.iife.js"></script>

<script>
// ===== GLOBAL SETUP =====
const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').content;
const USER_ID    = '{{ auth()->id() }}';

// Axios-like fetch wrapper
async function apiCall(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': CSRF_TOKEN,
            'Accept': 'application/json',
        }
    };
    if (data) options.body = JSON.stringify(data);
    const res = await fetch(url, options);
    return res.json();
}

// Toast notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderLeftColor = type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : 'var(--danger)';
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'}"
           style="color: ${type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : 'var(--danger)'}"></i>
        ${message}
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

// ===== PUSHER REAL-TIME SETUP =====
window.Echo = new Echo({
    broadcaster: 'pusher',
    key:         '{{ env("PUSHER_APP_KEY") }}',
    cluster:     '{{ env("PUSHER_APP_CLUSTER") }}',
    forceTLS:    true,
    authEndpoint: '/broadcasting/auth',
    auth: { headers: { 'X-CSRF-TOKEN': CSRF_TOKEN } }
});

// Listen for AI suggestions on private channel
Echo.private(`user.${USER_ID}`)
    .listen('.ai.suggestion.ready', (data) => {
        showToast('🤖 AI has updated your financial suggestions!', 'success');

        // Update FinScore if element exists
        const finScoreEl = document.getElementById('fin-score-value');
        if (finScoreEl && data.fin_score !== undefined) {
            finScoreEl.textContent = data.fin_score;
            animateFinScore(data.fin_score);
        }

        // Update daily limit if element exists
        const dailyLimitEl = document.getElementById('ai-daily-limit');
        if (dailyLimitEl && data.daily_limit) {
            dailyLimitEl.textContent = parseFloat(data.daily_limit).toFixed(2);
        }

        // Update anomaly badge
        if (data.anomalies && data.anomalies.length > 0) {
            showToast(`⚠️ ${data.anomalies.length} spending anomaly detected!`, 'warning');
        }
    });

// Animate FinScore ring
function animateFinScore(score) {
    const canvas = document.getElementById('fin-score-canvas');
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W/2, cy = H/2, radius = W/2 - 12;

    let current = 0;
    const target = score;
    const interval = setInterval(() => {
        ctx.clearRect(0, 0, W, H);
        // Background ring
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 12;
        ctx.stroke();
        // Score arc
        const color = current >= 70 ? '#10b981' : current >= 40 ? '#f59e0b' : '#ef4444';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, -Math.PI/2, -Math.PI/2 + (2 * Math.PI * current / 100));
        ctx.strokeStyle = color;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.stroke();

        current = Math.min(current + 2, target);
        if (current >= target) clearInterval(interval);
    }, 20);
}

document.addEventListener('DOMContentLoaded', () => {
    // Animate FinScore on load
    const finScoreEl = document.getElementById('fin-score-value');
    if (finScoreEl) animateFinScore(parseInt(finScoreEl.textContent) || 0);

    // Auto-dismiss alerts
    setTimeout(() => {
        document.querySelectorAll('.alert').forEach(el => el.style.display = 'none');
    }, 5000);
});
</script>

@stack('scripts')
</body>
</html>

{{-- ============================================================ --}}
{{-- resources/views/auth/login.blade.php                       --}}
{{-- ============================================================ --}}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — LP_AI</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        * { margin:0;padding:0;box-sizing:border-box; }
        body { font-family:'Inter',sans-serif; background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e40af 100%); min-height:100vh; display:flex; align-items:center; justify-content:center; }
        .auth-wrapper { width:100%;max-width:440px;padding:24px; }
        .auth-card { background:white; border-radius:20px; padding:40px; box-shadow:0 25px 60px rgba(0,0,0,0.3); }
        .auth-logo { text-align:center;margin-bottom:32px; }
        .auth-logo .icon { width:64px;height:64px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:28px; }
        .auth-logo h1 { font-size:24px;font-weight:800;color:#1e293b; }
        .auth-logo h1 span { color:#6366f1; }
        .auth-logo p { font-size:14px;color:#64748b;margin-top:4px; }
        .form-group { margin-bottom:18px; }
        .form-label { font-size:13px;font-weight:600;color:#1e293b;margin-bottom:6px;display:block; }
        .input-wrap { position:relative; }
        .input-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:14px; }
        .form-control { width:100%;padding:11px 14px 11px 40px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;font-family:'Inter',sans-serif;color:#1e293b;outline:none;transition:border-color 0.2s; }
        .form-control:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
        .error-msg { color:#ef4444;font-size:12px;margin-top:4px; }
        .btn-auth { width:100%;padding:13px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;margin-top:8px; }
        .btn-auth:hover { transform:translateY(-1px);box-shadow:0 8px 20px rgba(99,102,241,0.4); }
        .auth-footer { text-align:center;margin-top:24px;font-size:13px;color:#64748b; }
        .auth-footer a { color:#6366f1;text-decoration:none;font-weight:600; }
        .remember-row { display:flex;align-items:center;justify-content:space-between;margin-bottom:18px; }
        .remember-row label { display:flex;align-items:center;gap:8px;font-size:13px;color:#64748b;cursor:pointer; }
        .remember-row a { font-size:13px;color:#6366f1;text-decoration:none;font-weight:500; }
        .alert-danger { background:#fee2e2;color:#991b1b;padding:12px;border-radius:10px;font-size:13px;margin-bottom:18px;border-left:4px solid #ef4444; }
    </style>
</head>
<body>
<div class="auth-wrapper">
    <div class="auth-card">
        <div class="auth-logo">
            <div class="icon">💰</div>
            <h1>LP<span>_AI</span></h1>
            <p>AI-Powered Financial Management</p>
        </div>

        @if($errors->any())
            <div class="alert-danger">
                <i class="fas fa-exclamation-circle"></i> {{ $errors->first() }}
            </div>
        @endif

        <form method="POST" action="{{ route('login.post') }}">
            @csrf
            <div class="form-group">
                <label class="form-label">Email Address</label>
                <div class="input-wrap">
                    <i class="fas fa-envelope input-icon"></i>
                    <input type="email" name="email" class="form-control" placeholder="you@example.com" value="{{ old('email') }}" required autofocus>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Password</label>
                <div class="input-wrap">
                    <i class="fas fa-lock input-icon"></i>
                    <input type="password" name="password" class="form-control" placeholder="Enter your password" required>
                </div>
            </div>
            <div class="remember-row">
                <label>
                    <input type="checkbox" name="remember">
                    Remember me
                </label>
                <a href="#">Forgot password?</a>
            </div>
            <button type="submit" class="btn-auth">
                <i class="fas fa-sign-in-alt"></i> Sign In
            </button>
        </form>

        <div class="auth-footer">
            Don't have an account? <a href="{{ route('register') }}">Create one free</a>
        </div>
    </div>
</div>
</body>
</html>

{{-- ============================================================ --}}
{{-- resources/views/auth/register.blade.php                     --}}
{{-- SAVE AS A SEPARATE FILE                                      --}}
{{-- ============================================================ --}}
{{-- NOTE: Copy everything below into resources/views/auth/register.blade.php --}}


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register — LP_AI</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        * { margin:0;padding:0;box-sizing:border-box; }
        body { font-family:'Inter',sans-serif;background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e40af 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px; }
        .auth-wrapper { width:100%;max-width:520px; }
        .auth-card { background:white;border-radius:20px;padding:40px;box-shadow:0 25px 60px rgba(0,0,0,0.3); }
        .auth-logo { text-align:center;margin-bottom:28px; }
        .auth-logo .icon { width:56px;height:56px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:24px; }
        .auth-logo h1 { font-size:22px;font-weight:800;color:#1e293b; }
        .auth-logo h1 span { color:#6366f1; }
        .auth-logo p { font-size:13px;color:#64748b;margin-top:3px; }
        .form-group { margin-bottom:16px; }
        .form-row { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
        .form-label { font-size:13px;font-weight:600;color:#1e293b;margin-bottom:5px;display:block; }
        .input-wrap { position:relative; }
        .input-icon { position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:13px; }
        .form-control { width:100%;padding:10px 13px 10px 38px;border:1.5px solid #e2e8f0;border-radius:9px;font-size:13px;font-family:'Inter',sans-serif;color:#1e293b;outline:none;transition:border-color 0.2s; }
        .form-control:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
        select.form-control { cursor:pointer; }
        .error-msg { color:#ef4444;font-size:11px;margin-top:3px; }
        .btn-auth { width:100%;padding:12px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;margin-top:6px; }
        .btn-auth:hover { transform:translateY(-1px);box-shadow:0 8px 20px rgba(99,102,241,0.4); }
        .auth-footer { text-align:center;margin-top:20px;font-size:13px;color:#64748b; }
        .auth-footer a { color:#6366f1;text-decoration:none;font-weight:600; }
        .section-title { font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin:20px 0 12px;padding-bottom:8px;border-bottom:1px solid #f1f5f9; }
        .alert-danger { background:#fee2e2;color:#991b1b;padding:12px;border-radius:10px;font-size:12px;margin-bottom:16px;border-left:4px solid #ef4444; }
        .currency-flag { display:flex;gap:8px; }
    </style>
</head>
<body>
<div class="auth-wrapper">
    <div class="auth-card">
        <div class="auth-logo">
            <div class="icon">💰</div>
            <h1>LP<span>_AI</span></h1>
            <p>Create your free account</p>
        </div>

        @if($errors->any())
            <div class="alert-danger">
                <i class="fas fa-exclamation-circle"></i>
                <ul style="margin:6px 0 0 16px;">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('register.post') }}">
            @csrf

            <div class="section-title">Personal Information</div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <div class="input-wrap">
                        <i class="fas fa-user input-icon"></i>
                        <input type="text" name="name" class="form-control" placeholder="John Doe" value="{{ old('name') }}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Age</label>
                    <div class="input-wrap">
                        <i class="fas fa-birthday-cake input-icon"></i>
                        <input type="number" name="age" class="form-control" placeholder="25" value="{{ old('age') }}" min="13" max="120" required>
                    </div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Gender</label>
                    <div class="input-wrap">
                        <i class="fas fa-venus-mars input-icon"></i>
                        <select name="gender" class="form-control" required>
                            <option value="">Select</option>
                            <option value="male" {{ old('gender') == 'male' ? 'selected' : '' }}>Male</option>
                            <option value="female" {{ old('gender') == 'female' ? 'selected' : '' }}>Female</option>
                            <option value="other" {{ old('gender') == 'other' ? 'selected' : '' }}>Other</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Currency</label>
                    <div class="input-wrap">
                        <i class="fas fa-dollar-sign input-icon"></i>
                        <select name="currency" class="form-control">
                            <option value="USD" {{ old('currency') == 'USD' ? 'selected' : '' }}>USD ($)</option>
                            <option value="EUR" {{ old('currency') == 'EUR' ? 'selected' : '' }}>EUR (€)</option>
                            <option value="GBP" {{ old('currency') == 'GBP' ? 'selected' : '' }}>GBP (£)</option>
                            <option value="BDT" {{ old('currency') == 'BDT' ? 'selected' : '' }}>BDT (৳)</option>
                            <option value="INR" {{ old('currency') == 'INR' ? 'selected' : '' }}>INR (₹)</option>
                            <option value="AUD" {{ old('currency') == 'AUD' ? 'selected' : '' }}>AUD (A$)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="section-title">Account Information</div>

            <div class="form-group">
                <label class="form-label">Email Address</label>
                <div class="input-wrap">
                    <i class="fas fa-envelope input-icon"></i>
                    <input type="email" name="email" class="form-control" placeholder="you@example.com" value="{{ old('email') }}" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <div class="input-wrap">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" name="password" class="form-control" placeholder="Min 6 characters" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Confirm Password</label>
                    <div class="input-wrap">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" name="password_confirmation" class="form-control" placeholder="Repeat password" required>
                    </div>
                </div>
            </div>

            <div class="section-title">Financial Information</div>

            <div class="form-group">
                <label class="form-label">Monthly Income</label>
                <div class="input-wrap">
                    <i class="fas fa-money-bill-wave input-icon"></i>
                    <input type="number" name="monthly_income" class="form-control" placeholder="e.g. 3000" value="{{ old('monthly_income') }}" step="0.01" min="0" required>
                </div>
            </div>

            <button type="submit" class="btn-auth">
                <i class="fas fa-user-plus"></i> Create Account
            </button>
        </form>

        <div class="auth-footer">
            Already have an account? <a href="{{ route('login') }}">Sign in</a>
        </div>
    </div>
</div>
</body>
</html>

@extends('layouts.app')

@section('title', 'Dashboard')
@section('page-title', 'Financial Dashboard')

@section('topbar-actions')
    <a href="{{ route('transactions.create') }}" class="btn btn-primary btn-sm">
        <i class="fas fa-plus"></i> Add Transaction
    </a>
    <button onclick="generateAI()" class="btn btn-outline btn-sm" id="ai-generate-btn">
        <i class="fas fa-robot"></i> Refresh AI
    </button>
@endsection

@section('content')

{{-- PERIOD SELECTOR --}}
<div style="display:flex;gap:8px;margin-bottom:20px;">
    @foreach(['daily','weekly','monthly','annual'] as $p)
        <button onclick="switchPeriod('{{ $p }}')"
            class="btn btn-sm {{ $p === 'monthly' ? 'btn-primary' : 'btn-outline' }}"
            id="period-btn-{{ $p }}">
            {{ ucfirst($p) }}
        </button>
    @endforeach
</div>

{{-- STAT CARDS --}}
<div class="stat-grid" id="stats-grid">
    <div class="stat-card income">
        <div class="stat-icon"><i class="fas fa-arrow-down"></i></div>
        <div class="stat-label">Total Income</div>
        <div class="stat-value" id="stat-income">${{ number_format($monthStats['monthly_income'], 2) }}</div>
        <div class="stat-sub"><span class="up">↑</span> This month</div>
    </div>
    <div class="stat-card expense">
        <div class="stat-icon"><i class="fas fa-arrow-up"></i></div>
        <div class="stat-label">Total Expenses</div>
        <div class="stat-value" id="stat-expense">${{ number_format($monthStats['monthly_expense'], 2) }}</div>
        <div class="stat-sub">Today: $<span id="today-expense">{{ number_format($todayStats['monthly_expense'] ?? 0, 2) }}</span></div>
    </div>
    <div class="stat-card saving">
        <div class="stat-icon"><i class="fas fa-piggy-bank"></i></div>
        <div class="stat-label">Total Savings</div>
        <div class="stat-value" id="stat-saving">${{ number_format($monthStats['monthly_saving'], 2) }}</div>
        <div class="stat-sub">Rate: <span id="savings-rate">{{ $monthStats['savings_rate'] }}%</span></div>
    </div>
    <div class="stat-card balance">
        <div class="stat-icon"><i class="fas fa-balance-scale"></i></div>
        <div class="stat-label">Net Balance</div>
        <div class="stat-value" id="stat-balance" style="color:{{ $monthStats['net_balance'] >= 0 ? 'var(--success)' : 'var(--danger)' }}">
            ${{ number_format($monthStats['net_balance'], 2) }}
        </div>
        <div class="stat-sub">Income - Expenses</div>
    </div>
</div>

{{-- CHARTS + FIN SCORE --}}
<div class="chart-grid" style="margin-bottom:24px;">
    <div class="card">
        <div class="card-title">
            Income vs Expenses (Last 6 Months)
            <select id="chart-period" onchange="updateChart(this.value)" style="font-size:12px;padding:4px 10px;border:1px solid var(--border);border-radius:6px;cursor:pointer;">
                <option value="6months">6 Months</option>
                <option value="12months">12 Months</option>
            </select>
        </div>
        <canvas id="mainChart" height="120"></canvas>
    </div>

    <div class="card">
        <div class="card-title">FinScore™</div>
        <div class="fin-score-container">
            <div class="fin-score-ring">
                <canvas id="fin-score-canvas" width="140" height="140"></canvas>
                <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
                    <div style="font-size:32px;font-weight:800;color:var(--dark);" id="fin-score-value">{{ $finScore }}</div>
                    <div style="font-size:11px;color:var(--gray);font-weight:600;">/100</div>
                </div>
            </div>
            <div style="font-size:13px;font-weight:600;color:{{ $finScore >= 70 ? 'var(--success)' : ($finScore >= 40 ? 'var(--warning)' : 'var(--danger)') }}">
                {{ $finScore >= 70 ? '✅ Excellent' : ($finScore >= 40 ? '⚠️ Needs Work' : '❌ Critical') }}
            </div>
            <div style="font-size:12px;color:var(--gray);margin-top:4px;">Financial Health Score</div>
        </div>

        {{-- Category Donut --}}
        <div style="margin-top:16px;">
            <div style="font-size:13px;font-weight:700;margin-bottom:12px;color:var(--dark);">Expense Breakdown</div>
            <canvas id="categoryChart" height="140"></canvas>
        </div>
    </div>
</div>

{{-- AI SUGGESTION + ANOMALIES --}}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">

    {{-- AI Card --}}
    <div class="ai-card">
        <div class="ai-title">🤖 AI Financial Advisor</div>
        @if($latestAI)
            <h3>Daily Limit: $<span id="ai-daily-limit">{{ number_format($latestAI->daily_limit, 2) }}</span></h3>
            <div style="font-size:13px;color:#c7d2fe;margin-bottom:16px;">
                {{ $latestAI->suggestion_data['financial_health_summary'] ?? 'Analyzing your finances...' }}
            </div>
            @foreach(($latestAI->tips ?? []) as $tip)
                <div class="ai-tip">{{ $tip }}</div>
            @endforeach
            <div style="font-size:11px;color:#6366f1;margin-top:12px;">
                Last updated: {{ $latestAI->generated_at?->diffForHumans() ?? 'Just now' }}
            </div>
        @else
            <h3>No suggestions yet</h3>
            <p style="font-size:13px;color:#c7d2fe;margin-bottom:16px;">Add transactions and click "Refresh AI" to get personalized suggestions.</p>
            <button onclick="generateAI()" class="btn btn-primary btn-sm">
                <i class="fas fa-robot"></i> Generate Now
            </button>
        @endif
    </div>

    {{-- Anomalies --}}
    <div class="card">
        <div class="card-title">
            ⚠️ Anomalies Detected
            <span class="badge badge-warning">{{ count($anomalies) }}</span>
        </div>
        @if(count($anomalies) > 0)
            @foreach($anomalies as $a)
                <div class="anomaly-item">
                    <div class="anomaly-icon">📊</div>
                    <div>
                        <div class="anomaly-msg">{{ $a['message'] }}</div>
                        <div style="font-size:11px;color:#92400e;margin-top:2px;">
                            This month: ${{ $a['this_month'] }} | Avg: ${{ $a['avg_3months'] }}
                        </div>
                    </div>
                </div>
            @endforeach
        @else
            <div style="text-align:center;padding:30px;color:var(--gray);">
                <i class="fas fa-check-circle" style="font-size:36px;color:var(--success);margin-bottom:12px;display:block;"></i>
                No spending anomalies detected. Keep it up!
            </div>
        @endif
    </div>
</div>

{{-- BUDGET STATUS --}}
@if($budgets->count() > 0)
<div class="card" style="margin-bottom:24px;">
    <div class="card-title">
        Budget Status
        <a href="{{ route('budget.index') }}" class="btn btn-outline btn-sm">Manage</a>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;">
        @foreach($budgets as $budget)
        <div style="padding:12px;background:var(--light);border-radius:10px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="font-size:13px;font-weight:600;">{{ ucfirst($budget->category) }}</span>
                <span style="font-size:12px;color:{{ $budget->percentage >= 100 ? 'var(--danger)' : ($budget->percentage >= 80 ? 'var(--warning)' : 'var(--success)') }};font-weight:700;">
                    {{ $budget->percentage }}%
                </span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width:{{ min(100, $budget->percentage) }}%;background:{{ $budget->percentage >= 100 ? 'var(--danger)' : ($budget->percentage >= 80 ? 'var(--warning)' : 'var(--success)') }};"></div>
            </div>
            <div style="font-size:11px;color:var(--gray);margin-top:6px;">
                ${{ $budget->spent }} / ${{ $budget->limit_amount }}
            </div>
        </div>
        @endforeach
    </div>
</div>
@endif

{{-- RECENT TRANSACTIONS --}}
<div class="card">
    <div class="card-title">
        Recent Transactions
        <a href="{{ route('transactions.index') }}" class="btn btn-outline btn-sm">View All</a>
    </div>
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                @forelse($recentTransactions as $t)
                <tr>
                    <td style="color:var(--gray);">{{ \Carbon\Carbon::parse($t->date)->format('M d, Y') }}</td>
                    <td style="font-weight:500;">{{ $t->description }}</td>
                    <td>{{ ucfirst($t->category) }}</td>
                    <td><span class="badge badge-{{ $t->type }}">{{ ucfirst($t->type) }}</span></td>
                    <td style="font-weight:700;color:{{ $t->type === 'income' ? 'var(--success)' : ($t->type === 'expense' ? 'var(--danger)' : 'var(--info)') }}">
                        {{ $t->type === 'income' ? '+' : '-' }}${{ number_format($t->amount, 2) }}
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" style="text-align:center;color:var(--gray);padding:30px;">
                        No transactions yet. <a href="{{ route('transactions.create') }}" style="color:var(--primary);">Add your first one!</a>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

@endsection

@push('scripts')
<script>
// ===== CHART DATA FROM BLADE =====
const chartData = @json($chartData);
const categoryData = @json($categoryBreakdown);

// ===== MAIN LINE CHART =====
let mainChart;

function initMainChart(data) {
    const ctx = document.getElementById('mainChart').getContext('2d');
    if (mainChart) mainChart.destroy();

    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Income',
                    data: data.income,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16,185,129,0.08)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2.5,
                },
                {
                    label: 'Expenses',
                    data: data.expense,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239,68,68,0.08)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2.5,
                },
                {
                    label: 'Savings',
                    data: data.saving,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.08)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2.5,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top', labels: { font: { size: 12, family: 'Inter' } } },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: {
                        callback: v => '$' + v.toLocaleString(),
                        font: { size: 11 }
                    }
                },
                x: { grid: { display: false }, ticks: { font: { size: 11 } } }
            }
        }
    });
}

// ===== CATEGORY DONUT CHART =====
function initCategoryChart(data) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    const labels = Object.keys(data);
    const values = Object.values(data);
    const colors = ['#6366f1','#10b981','#ef4444','#f59e0b','#3b82f6','#8b5cf6','#14b8a6','#f97316'];

    if (labels.length === 0) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 0,
                hoverOffset: 4,
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 10 } },
                tooltip: { callbacks: { label: ctx => `${ctx.label}: $${ctx.raw}` } }
            }
        }
    });
}

// ===== PERIOD SWITCHER =====
async function switchPeriod(period) {
    document.querySelectorAll('[id^="period-btn-"]').forEach(btn => {
        btn.className = 'btn btn-sm btn-outline';
    });
    document.getElementById(`period-btn-${period}`).className = 'btn btn-sm btn-primary';

    try {
        const res = await apiCall(`/transactions/summary/${period}`);
        if (res) {
            document.getElementById('stat-income').textContent  = '$' + res.income.toLocaleString('en-US', {minimumFractionDigits: 2});
            document.getElementById('stat-expense').textContent = '$' + res.expense.toLocaleString('en-US', {minimumFractionDigits: 2});
            document.getElementById('stat-saving').textContent  = '$' + res.saving.toLocaleString('en-US', {minimumFractionDigits: 2});
            document.getElementById('stat-balance').textContent = '$' + res.balance.toLocaleString('en-US', {minimumFractionDigits: 2});
        }
    } catch (e) { console.error(e); }
}

// ===== UPDATE CHART =====
async function updateChart(type) {
    try {
        const res = await apiCall(`/dashboard/chart-data?type=${type}`);
        if (res.data) initMainChart(res.data);
    } catch (e) { console.error(e); }
}

// ===== GENERATE AI =====
async function generateAI() {
    const btn = document.getElementById('ai-generate-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    btn.disabled = true;

    try {
        const res = await apiCall('/ai/generate', 'POST');
        showToast(res.message || 'AI analysis started!', 'success');
    } catch (e) {
        showToast('AI generation failed. Check your OpenAI key.', 'danger');
    }

    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-robot"></i> Refresh AI';
        btn.disabled = false;
    }, 3000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initMainChart(chartData);
    initCategoryChart(categoryData);
});
</script>
@endpush

{{-- ============================================================ --}}
{{-- resources/views/transactions/create.blade.php              --}}
{{-- ============================================================ --}}
@extends('layouts.app')
@section('title','Add Transaction')
@section('page-title','Add Transaction')

@section('topbar-actions')
    <a href="{{ route('transactions.index') }}" class="btn btn-outline btn-sm">
        <i class="fas fa-arrow-left"></i> Back
    </a>
@endsection

@section('content')
<div style="max-width:640px;">
<div class="card">
    <div class="card-title">New Transaction</div>

    {{-- TYPE SELECTOR --}}
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px;" id="type-selector">
        @foreach(['income'=>['💰','#10b981'],'expense'=>['💸','#ef4444'],'saving'=>['🏦','#3b82f6']] as $type=>[$icon,$color])
        <button type="button" onclick="selectType('{{ $type }}')"
            id="type-btn-{{ $type }}"
            style="padding:14px;border-radius:12px;border:2px solid {{ $type === 'income' ? $color : '#e2e8f0' }};background:{{ $type === 'income' ? $color.'15' : 'white' }};cursor:pointer;font-family:Inter,sans-serif;font-size:13px;font-weight:700;color:{{ $type === 'income' ? $color : 'var(--gray)' }};transition:all 0.2s;">
            <div style="font-size:22px;margin-bottom:4px;">{{ $icon }}</div>
            {{ ucfirst($type) }}
        </button>
        @endforeach
    </div>

    <form method="POST" action="{{ route('transactions.store') }}" id="transaction-form">
        @csrf
        <input type="hidden" name="type" id="type-input" value="income">

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Category</label>
                <select name="category" class="form-control" id="category-select" required>
                    <option value="">Select category</option>
                    <optgroup label="Income" id="income-categories">
                        @foreach($incomeCategories as $key=>$label)
                            <option value="{{ $key }}">{{ $label }}</option>
                        @endforeach
                    </optgroup>
                    <optgroup label="Expense" id="expense-categories" style="display:none">
                        @foreach($expenseCategories as $key=>$label)
                            <option value="{{ $key }}">{{ $label }}</option>
                        @endforeach
                    </optgroup>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Amount</label>
                <input type="number" name="amount" class="form-control" placeholder="0.00" step="0.01" min="0.01" required>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Description</label>
            <input type="text" name="description" class="form-control" placeholder="What was this for?" required>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Date</label>
                <input type="date" name="date" class="form-control" value="{{ date('Y-m-d') }}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Period</label>
                <select name="period" class="form-control" required>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly" selected>Monthly</option>
                    <option value="annual">Annual</option>
                </select>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Payment Method</label>
                <select name="payment_method" class="form-control">
                    <option value="cash">💵 Cash</option>
                    <option value="card">💳 Card</option>
                    <option value="bank">🏦 Bank Transfer</option>
                    <option value="mobile">📱 Mobile Banking</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Tags (comma separated)</label>
                <input type="text" name="tags" class="form-control" placeholder="food, groceries, weekly">
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Notes (optional)</label>
            <textarea name="notes" class="form-control" rows="2" placeholder="Additional notes..."></textarea>
        </div>

        <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
            <input type="checkbox" name="is_recurring" id="is_recurring" value="1">
            <label for="is_recurring" style="font-size:13px;cursor:pointer;font-weight:500;">This is a recurring transaction</label>
        </div>

        <div id="recurring-options" style="display:none;margin-bottom:18px;">
            <label class="form-label">Recurring Every</label>
            <select name="recurring_interval" class="form-control">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
        </div>

        <div style="display:flex;gap:12px;">
            <button type="submit" class="btn btn-primary" style="flex:1;">
                <i class="fas fa-plus"></i> Add Transaction
            </button>
            <a href="{{ route('transactions.index') }}" class="btn btn-outline">Cancel</a>
        </div>
    </form>
</div>
</div>
@endsection

@push('scripts')
<script>
const typeColors = { income:'#10b981', expense:'#ef4444', saving:'#3b82f6' };

function selectType(type) {
    document.getElementById('type-input').value = type;

    // Update button styles
    ['income','expense','saving'].forEach(t => {
        const btn = document.getElementById(`type-btn-${t}`);
        btn.style.borderColor = t === type ? typeColors[t] : '#e2e8f0';
        btn.style.background  = t === type ? typeColors[t] + '15' : 'white';
        btn.style.color       = t === type ? typeColors[t] : 'var(--gray)';
    });

    // Toggle category options
    const incomeGrp  = document.getElementById('income-categories');
    const expenseGrp = document.getElementById('expense-categories');
    if (type === 'income') {
        incomeGrp.style.display  = '';
        expenseGrp.style.display = 'none';
    } else {
        incomeGrp.style.display  = 'none';
        expenseGrp.style.display = '';
    }
    document.getElementById('category-select').value = '';
}

document.getElementById('is_recurring').addEventListener('change', function() {
    document.getElementById('recurring-options').style.display = this.checked ? 'block' : 'none';
});
</script>
@endpush


{{-- ============================================================ --}}
{{-- resources/views/transactions/index.blade.php               --}}
{{-- ============================================================ --}}
@extends('layouts.app')
@section('title','Transactions')
@section('page-title','Transactions')

@section('topbar-actions')
    <a href="{{ route('transactions.create') }}" class="btn btn-primary btn-sm">
        <i class="fas fa-plus"></i> Add Transaction
    </a>
@endsection

@section('content')

{{-- TOTALS --}}
<div class="stat-grid" style="margin-bottom:20px;">
    <div class="stat-card income">
        <div class="stat-icon"><i class="fas fa-arrow-down"></i></div>
        <div class="stat-label">Income</div>
        <div class="stat-value">${{ number_format($totals['income'], 2) }}</div>
    </div>
    <div class="stat-card expense">
        <div class="stat-icon"><i class="fas fa-arrow-up"></i></div>
        <div class="stat-label">Expenses</div>
        <div class="stat-value">${{ number_format($totals['expense'], 2) }}</div>
    </div>
    <div class="stat-card saving">
        <div class="stat-icon"><i class="fas fa-piggy-bank"></i></div>
        <div class="stat-label">Savings</div>
        <div class="stat-value">${{ number_format($totals['saving'], 2) }}</div>
    </div>
    <div class="stat-card balance">
        <div class="stat-icon"><i class="fas fa-balance-scale"></i></div>
        <div class="stat-label">Balance</div>
        <div class="stat-value">${{ number_format($totals['income'] - $totals['expense'], 2) }}</div>
    </div>
</div>

{{-- FILTERS --}}
<div class="card" style="margin-bottom:16px;">
    <form method="GET" style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <div>
            <label style="font-size:12px;font-weight:600;color:var(--gray);">Period</label>
            <select name="period" onchange="this.form.submit()" class="form-control" style="margin-top:4px;">
                @foreach(['daily','weekly','monthly','annual'] as $p)
                    <option value="{{ $p }}" {{ $period === $p ? 'selected' : '' }}>{{ ucfirst($p) }}</option>
                @endforeach
            </select>
        </div>
        <div>
            <label style="font-size:12px;font-weight:600;color:var(--gray);">Type</label>
            <select name="type" onchange="this.form.submit()" class="form-control" style="margin-top:4px;">
                <option value="all" {{ $type === 'all' ? 'selected' : '' }}>All</option>
                <option value="income" {{ $type === 'income' ? 'selected' : '' }}>Income</option>
                <option value="expense" {{ $type === 'expense' ? 'selected' : '' }}>Expense</option>
                <option value="saving" {{ $type === 'saving' ? 'selected' : '' }}>Saving</option>
            </select>
        </div>
    </form>
</div>

{{-- TRANSACTION TABLE --}}
<div class="card">
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Payment</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse($transactions as $t)
                <tr>
                    <td style="color:var(--gray);font-size:12px;">{{ \Carbon\Carbon::parse($t->date)->format('M d, Y') }}</td>
                    <td>
                        <div style="font-weight:600;font-size:13px;">{{ $t->description }}</div>
                        @if($t->notes)
                            <div style="font-size:11px;color:var(--gray);">{{ $t->notes }}</div>
                        @endif
                    </td>
                    <td>{{ ucfirst($t->category) }}</td>
                    <td style="font-size:12px;color:var(--gray);">{{ ucfirst($t->payment_method ?? 'cash') }}</td>
                    <td><span class="badge badge-{{ $t->type }}">{{ ucfirst($t->type) }}</span></td>
                    <td style="font-weight:700;color:{{ $t->type === 'income' ? 'var(--success)' : ($t->type === 'expense' ? 'var(--danger)' : 'var(--info)') }}">
                        {{ $t->type === 'income' ? '+' : '-' }}${{ number_format($t->amount, 2) }}
                    </td>
                    <td>
                        <div style="display:flex;gap:6px;">
                            <a href="{{ route('transactions.edit', $t->_id) }}" class="btn btn-outline btn-sm">
                                <i class="fas fa-edit"></i>
                            </a>
                            <button onclick="deleteTransaction('{{ $t->_id }}')" class="btn btn-danger btn-sm">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" style="text-align:center;color:var(--gray);padding:40px;">
                        <i class="fas fa-receipt" style="font-size:32px;margin-bottom:12px;display:block;"></i>
                        No transactions found.
                        <a href="{{ route('transactions.create') }}" style="color:var(--primary);font-weight:600;">Add your first transaction</a>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <div style="margin-top:16px;">
        {{ $transactions->appends(request()->query())->links() }}
    </div>
</div>
@endsection

@push('scripts')
<script>
async function deleteTransaction(id) {
    if (!confirm('Delete this transaction?')) return;
    try {
        const res = await apiCall(`/transactions/${id}`, 'DELETE');
        if (res.success) {
            showToast('Transaction deleted!', 'success');
            setTimeout(() => location.reload(), 800);
        }
    } catch (e) { showToast('Delete failed.', 'danger'); }
}
</script>
@endpush

{{-- ============================================================ --}}
{{-- resources/views/health/index.blade.php                      --}}
{{-- ============================================================ --}}
{{-- NOTE: Save the content below as resources/views/health/index.blade.php --}}


{{-- ============================================================ --}}
{{-- resources/views/health/index.blade.php                      --}}
{{-- ============================================================ --}}
@extends('layouts.app')
@section('title','Health Profile')
@section('page-title','Health Profile')

@section('content')
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">

{{-- FORM --}}
<div class="card">
    <div class="card-title">
        <span>💚 Your Health Data</span>
        @if($health)
            <span class="badge badge-success">Profile Active</span>
        @endif
    </div>

    <form method="POST" action="{{ $health ? route('health.update') : route('health.store') }}">
        @csrf
        @if($health) @method('PUT') @endif

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Age</label>
                <input type="number" name="age" class="form-control" value="{{ $health->age ?? auth()->user()->age }}" min="13" max="120" required>
            </div>
            <div class="form-group">
                <label class="form-label">Gender</label>
                <select name="gender" class="form-control" required>
                    <option value="male" {{ ($health->gender ?? auth()->user()->gender) === 'male' ? 'selected' : '' }}>Male</option>
                    <option value="female" {{ ($health->gender ?? auth()->user()->gender) === 'female' ? 'selected' : '' }}>Female</option>
                    <option value="other" {{ ($health->gender ?? auth()->user()->gender) === 'other' ? 'selected' : '' }}>Other</option>
                </select>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Height (cm)</label>
                <input type="number" name="height_cm" class="form-control" value="{{ $health->height_cm ?? '' }}" placeholder="170" step="0.1" min="50" max="300" required>
            </div>
            <div class="form-group">
                <label class="form-label">Weight (kg)</label>
                <input type="number" name="weight_kg" class="form-control" value="{{ $health->weight_kg ?? '' }}" placeholder="70" step="0.1" min="10" required>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Activity Level</label>
            <select name="activity_level" class="form-control" required>
                <option value="sedentary" {{ ($health->activity_level ?? '') === 'sedentary' ? 'selected' : '' }}>🪑 Sedentary (desk job, little exercise)</option>
                <option value="light" {{ ($health->activity_level ?? '') === 'light' ? 'selected' : '' }}>🚶 Light (1-3 days/week exercise)</option>
                <option value="moderate" {{ ($health->activity_level ?? 'moderate') === 'moderate' ? 'selected' : '' }}>🏃 Moderate (3-5 days/week)</option>
                <option value="active" {{ ($health->activity_level ?? '') === 'active' ? 'selected' : '' }}>💪 Active (6-7 days/week)</option>
                <option value="very_active" {{ ($health->activity_level ?? '') === 'very_active' ? 'selected' : '' }}>🏋️ Very Active (athlete/physical job)</option>
            </select>
        </div>

        <div class="form-group">
            <label class="form-label">Dietary Preferences</label>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:6px;">
                @foreach(['vegetarian','vegan','halal','kosher','gluten_free','dairy_free','low_carb','keto'] as $pref)
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;padding:8px;border:1px solid var(--border);border-radius:8px;">
                    <input type="checkbox" name="dietary_preferences[]" value="{{ $pref }}"
                        {{ in_array($pref, $health->dietary_preferences ?? []) ? 'checked' : '' }}>
                    {{ ucwords(str_replace('_',' ',$pref)) }}
                </label>
                @endforeach
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Health Conditions (if any)</label>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:6px;">
                @foreach(['diabetes','hypertension','heart_disease','obesity','anemia','none'] as $cond)
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;padding:8px;border:1px solid var(--border);border-radius:8px;">
                    <input type="checkbox" name="health_conditions[]" value="{{ $cond }}"
                        {{ in_array($cond, $health->health_conditions ?? ['none']) ? 'checked' : '' }}>
                    {{ ucwords(str_replace('_',' ',$cond)) }}
                </label>
                @endforeach
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Health Goals</label>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:6px;">
                @foreach(['lose_weight','gain_muscle','maintain_weight','improve_energy','better_sleep','reduce_stress'] as $goal)
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;padding:8px;border:1px solid var(--border);border-radius:8px;">
                    <input type="checkbox" name="health_goals[]" value="{{ $goal }}"
                        {{ in_array($goal, $health->health_goals ?? []) ? 'checked' : '' }}>
                    {{ ucwords(str_replace('_',' ',$goal)) }}
                </label>
                @endforeach
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Daily Food Budget ($)</label>
            <input type="number" name="daily_food_budget" class="form-control" value="{{ $health->daily_food_budget ?? '' }}" placeholder="e.g. 15" step="0.01" min="0" required>
        </div>

        <button type="submit" class="btn btn-primary" style="width:100%;">
            <i class="fas fa-save"></i> {{ $health ? 'Update Health Profile' : 'Save Health Profile' }}
        </button>
    </form>
</div>

{{-- HEALTH SUMMARY + MEAL PLAN --}}
<div>
    @if($health)
    {{-- BMI Card --}}
    <div class="card" style="margin-bottom:16px;">
        <div class="card-title">📊 Health Summary</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div style="text-align:center;padding:16px;background:var(--light);border-radius:10px;">
                <div style="font-size:32px;font-weight:800;color:var(--primary);">{{ $health->bmi }}</div>
                <div style="font-size:12px;color:var(--gray);font-weight:600;">BMI</div>
                <div style="font-size:13px;font-weight:700;color:{{ $health->getBMICategory() === 'Normal' ? 'var(--success)' : 'var(--warning)' }};margin-top:4px;">{{ $health->getBMICategory() }}</div>
            </div>
            <div style="text-align:center;padding:16px;background:var(--light);border-radius:10px;">
                <div style="font-size:32px;font-weight:800;color:var(--success);">{{ $health->calculateDailyCalories() }}</div>
                <div style="font-size:12px;color:var(--gray);font-weight:600;">Daily Calories</div>
                <div style="font-size:12px;color:var(--gray);margin-top:4px;">Recommended</div>
            </div>
        </div>
        <div style="margin-top:12px;padding:12px;background:#f0fdf4;border-radius:10px;font-size:13px;color:#166534;">
            💧 Recommended water intake: {{ round(($health->weight_kg ?? 70) * 0.033, 1) }}L per day
        </div>
    </div>
    @endif

    {{-- AI Meal Plan --}}
    <div class="card" id="meal-plan-card">
        <div class="card-title">🍽️ AI Meal Plan</div>
        <div id="meal-plan-content">
            <div style="text-align:center;padding:30px;color:var(--gray);">
                <i class="fas fa-utensils" style="font-size:36px;margin-bottom:12px;display:block;opacity:0.3;"></i>
                <div id="meal-loading-msg">
                    @if(!$health)
                        Save your health profile to get AI meal recommendations.
                    @else
                        Loading your personalized meal plan...
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>

</div>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', async () => {
    @if($health)
    try {
        const res = await apiCall('/health/meal-plan');
        const container = document.getElementById('meal-plan-content');

        if (res.success && res.meal_plan) {
            const mp = res.meal_plan;
            const meals = ['breakfast','lunch','dinner','snacks'];
            const icons = { breakfast:'☀️', lunch:'🌤️', dinner:'🌙', snacks:'🍎' };

            container.innerHTML = meals.map(meal => {
                if (!mp[meal]) return '';
                return `
                <div class="meal-card" style="margin-bottom:10px;">
                    <div class="meal-time">${icons[meal]} ${meal.charAt(0).toUpperCase() + meal.slice(1)}</div>
                    <div class="meal-name">${mp[meal].meal}</div>
                    <div class="meal-meta">
                        🔥 ${mp[meal].calories} cal &nbsp;|&nbsp;
                        <span class="meal-cost">$${mp[meal].cost}</span> &nbsp;|&nbsp;
                        ${mp[meal].nutrients}
                    </div>
                </div>`;
            }).join('') + `
            <div style="background:#f0fdf4;border-radius:10px;padding:12px;margin-top:10px;font-size:13px;color:#166534;">
                💧 ${mp.hydration_tip || 'Drink 8 glasses of water daily'}
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">
                <span style="font-size:13px;font-weight:700;">Total: ${mp.total_daily_calories} cal</span>
                <span style="font-size:13px;font-weight:700;color:var(--success);">Daily Cost: $${ parseFloat(mp.total_daily_cost).toFixed(2)}</span>
            </div>`;
        } else {
            container.innerHTML = `<div style="text-align:center;padding:30px;color:var(--gray);">
                <p>No meal plan yet. <button onclick="generateAI()" class="btn btn-primary btn-sm">Generate AI Plan</button></p></div>`;
        }
    } catch(e) {
        console.error(e);
    }
    @endif
});

async function generateAI() {
    await apiCall('/ai/generate', 'POST');
    showToast('AI is generating your meal plan. Refresh in 30 seconds!', 'success');
}
</script>
@endpush


{{-- ============================================================ --}}
{{-- resources/views/ai/index.blade.php                          --}}
{{-- ============================================================ --}}
@extends('layouts.app')
@section('title','AI Advisor')
@section('page-title','AI Financial Advisor')

@section('topbar-actions')
    <button onclick="generateAI()" class="btn btn-primary btn-sm" id="gen-btn">
        <i class="fas fa-magic"></i> Generate New Analysis
    </button>
@endsection

@section('content')

@if($latestSuggestion)
{{-- FIN SCORE BANNER --}}
<div class="ai-card" style="margin-bottom:24px;">
    <div style="display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center;">
        <div style="text-align:center;">
            <div style="position:relative;width:100px;height:100px;">
                <canvas id="fin-score-canvas" width="100" height="100"></canvas>
                <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
                    <div style="font-size:26px;font-weight:800;" id="fin-score-value">{{ $latestSuggestion->fin_score }}</div>
                    <div style="font-size:9px;opacity:0.7;">/100</div>
                </div>
            </div>
            <div style="font-size:11px;color:#a5b4fc;margin-top:6px;">FinScore™</div>
        </div>
        <div>
            <div style="font-size:12px;color:#a5b4fc;margin-bottom:6px;">AI Financial Summary</div>
            <p style="font-size:15px;font-weight:500;line-height:1.6;margin-bottom:16px;">
                {{ $latestSuggestion->suggestion_data['financial_health_summary'] ?? 'AI analysis complete.' }}
            </p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
                <div style="background:rgba(255,255,255,0.1);border-radius:10px;padding:12px;text-align:center;">
                    <div style="font-size:20px;font-weight:800;">${{ number_format($latestSuggestion->daily_limit, 2) }}</div>
                    <div style="font-size:11px;color:#a5b4fc;margin-top:4px;">Daily Spending Limit</div>
                </div>
                <div style="background:rgba(255,255,255,0.1);border-radius:10px;padding:12px;text-align:center;">
                    <div style="font-size:20px;font-weight:800;">${{ number_format($latestSuggestion->suggestion_data['monthly_savings_target'] ?? 0, 2) }}</div>
                    <div style="font-size:11px;color:#a5b4fc;margin-top:4px;">Monthly Savings Target</div>
                </div>
                <div style="background:rgba(255,255,255,0.1);border-radius:10px;padding:12px;text-align:center;">
                    <div style="font-size:20px;font-weight:800;">${{ number_format($latestSuggestion->suggestion_data['annual_savings_projection'] ?? 0, 0) }}</div>
                    <div style="font-size:11px;color:#a5b4fc;margin-top:4px;">Annual Projection</div>
                </div>
            </div>
        </div>
    </div>
    <div style="font-size:11px;color:#6366f1;margin-top:16px;">
        Generated {{ $latestSuggestion->generated_at?->diffForHumans() }} · Model: {{ $latestSuggestion->model_used }}
        · Tokens used: {{ number_format($latestSuggestion->tokens_used) }}
    </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">

    {{-- FINANCIAL TIPS --}}
    <div class="card">
        <div class="card-title">💡 Financial Tips</div>
        @foreach(($latestSuggestion->tips ?? []) as $i => $tip)
        <div style="display:flex;gap:12px;align-items:flex-start;padding:14px;background:{{ $i % 2 === 0 ? '#f8fafc' : 'white' }};border-radius:10px;margin-bottom:8px;">
            <div style="width:28px;height:28px;background:var(--primary-light);color:var(--primary);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;">{{ $i+1 }}</div>
            <div style="font-size:14px;line-height:1.5;">{{ $tip }}</div>
        </div>
        @endforeach

        @if($latestSuggestion->suggestion_data['spending_warning'] ?? false)
        <div class="alert alert-warning" style="margin-top:12px;">
            <i class="fas fa-exclamation-triangle"></i>
            {{ $latestSuggestion->suggestion_data['spending_warning'] }}
        </div>
        @endif
    </div>

    {{-- ANOMALIES + INVESTMENT --}}
    <div>
        <div class="card" style="margin-bottom:16px;">
            <div class="card-title">⚠️ Spending Anomalies</div>
            @if(count($latestSuggestion->anomalies ?? []) > 0)
                @foreach($latestSuggestion->anomalies as $a)
                <div class="anomaly-item">
                    <div class="anomaly-icon">📊</div>
                    <div class="anomaly-msg">{{ $a['message'] ?? ($a['category'] . ' spending is unusually high.') }}</div>
                </div>
                @endforeach
            @else
                <div style="text-align:center;padding:20px;color:var(--gray);">
                    <i class="fas fa-check-circle" style="color:var(--success);font-size:28px;display:block;margin-bottom:8px;"></i>
                    No anomalies detected this month.
                </div>
            @endif
        </div>

        <div class="card">
            <div class="card-title">📈 Investment Insight</div>
            <div style="font-size:14px;line-height:1.6;color:var(--dark);padding:4px 0;">
                {{ $latestSuggestion->suggestion_data['investment_suggestion'] ?? 'Build your emergency fund first.' }}
            </div>
            <div style="margin-top:14px;padding:12px;background:#fef3c7;border-radius:10px;font-size:13px;color:#92400e;">
                <strong>Emergency Fund:</strong> {{ $latestSuggestion->suggestion_data['emergency_fund_status'] ?? 'Assess your 3-6 month expenses.' }}
            </div>
        </div>
    </div>

</div>

{{-- SUGGESTION HISTORY --}}
<div class="card" style="margin-top:24px;">
    <div class="card-title">📋 Analysis History</div>
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Generated</th>
                    <th>FinScore</th>
                    <th>Daily Limit</th>
                    <th>Tokens Used</th>
                    <th>Model</th>
                </tr>
            </thead>
            <tbody>
                @foreach($suggestions as $s)
                <tr>
                    <td>{{ $s->generated_at?->format('M d, Y H:i') }}</td>
                    <td>
                        <span style="font-weight:700;color:{{ $s->fin_score >= 70 ? 'var(--success)' : ($s->fin_score >= 40 ? 'var(--warning)' : 'var(--danger)') }}">
                            {{ $s->fin_score }}/100
                        </span>
                    </td>
                    <td>${{ number_format($s->daily_limit, 2) }}</td>
                    <td>{{ number_format($s->tokens_used) }}</td>
                    <td><span class="badge badge-saving">{{ $s->model_used }}</span></td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

@else
{{-- NO SUGGESTIONS YET --}}
<div class="card" style="text-align:center;padding:60px;">
    <div style="font-size:64px;margin-bottom:20px;">🤖</div>
    <h2 style="font-size:22px;font-weight:700;margin-bottom:12px;">No AI Analysis Yet</h2>
    <p style="color:var(--gray);font-size:15px;margin-bottom:24px;">Add some transactions and then generate your first AI analysis to get personalized financial advice and meal recommendations.</p>
    <button onclick="generateAI()" class="btn btn-primary">
        <i class="fas fa-magic"></i> Generate First Analysis
    </button>
</div>
@endif

@endsection

@push('scripts')
<script>
async function generateAI() {
    const btn = document.getElementById('gen-btn');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        btn.disabled = true;
    }
    try {
        const res = await apiCall('/ai/generate', 'POST');
        showToast(res.message || 'Analysis started!', 'success');
        setTimeout(() => location.reload(), 15000);
    } catch(e) {
        showToast('AI generation failed. Check your OpenAI API key.', 'danger');
        if (btn) { btn.innerHTML = '<i class="fas fa-magic"></i> Generate New Analysis'; btn.disabled = false; }
    }
}
</script>
@endpush


{{-- ============================================================ --}}
{{-- resources/views/budget/index.blade.php                      --}}
{{-- ============================================================ --}}
@extends('layouts.app')
@section('title','Budget')
@section('page-title','Budget Manager')

@section('content')
<div style="display:grid;grid-template-columns:1fr 1.6fr;gap:24px;">

    {{-- ADD BUDGET FORM --}}
    <div class="card" style="align-self:start;">
        <div class="card-title">Set Budget Limit</div>
        <form id="budget-form">
            @csrf
            <div class="form-group">
                <label class="form-label">Category</label>
                <select name="category" class="form-control" required>
                    <option value="">Select category</option>
                    @foreach($categories as $key => $label)
                        <option value="{{ $key }}">{{ $label }}</option>
                    @endforeach
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Budget Limit ($)</label>
                <input type="number" name="limit_amount" class="form-control" placeholder="e.g. 500" step="0.01" min="0.01" required>
            </div>
            <div class="form-group">
                <label class="form-label">Period</label>
                <select name="period" class="form-control" required>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly" selected>Monthly</option>
                    <option value="annual">Annual</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Alert at (%)</label>
                <input type="number" name="alert_at" class="form-control" placeholder="80" value="80" min="1" max="100">
                <div style="font-size:11px;color:var(--gray);margin-top:4px;">Get notified when this % of budget is used</div>
            </div>
            <button type="button" onclick="saveBudget()" class="btn btn-primary" style="width:100%;">
                <i class="fas fa-save"></i> Set Budget
            </button>
        </form>
    </div>

    {{-- ACTIVE BUDGETS --}}
    <div class="card">
        <div class="card-title">Active Budgets</div>
        @forelse($budgetsWithSpent as $budget)
        <div style="padding:16px;border:1px solid var(--border);border-radius:12px;margin-bottom:12px;{{ $budget->over_limit ? 'border-color:#fca5a5;background:#fff5f5;' : '' }}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
                <div>
                    <div style="font-size:15px;font-weight:700;">{{ ucfirst($budget->category) }}</div>
                    <div style="font-size:12px;color:var(--gray);">{{ ucfirst($budget->period) }} budget</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:16px;font-weight:800;color:{{ $budget->over_limit ? 'var(--danger)' : ($budget->percentage >= 80 ? 'var(--warning)' : 'var(--success)') }}">
                        {{ $budget->percentage }}%
                    </div>
                    @if($budget->over_limit)
                        <span class="badge badge-expense">Over Limit!</span>
                    @endif
                </div>
            </div>
            <div class="progress-bar" style="margin-bottom:8px;">
                <div class="progress-fill" style="width:{{ min(100, $budget->percentage) }}%;background:{{ $budget->over_limit ? 'var(--danger)' : ($budget->percentage >= 80 ? 'var(--warning)' : 'var(--success)') }};"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray);">
                <span>Spent: <strong>${{ $budget->spent }}</strong></span>
                <span>Remaining: <strong style="color:{{ $budget->remaining > 0 ? 'var(--success)' : 'var(--danger)' }};">${{ $budget->remaining }}</strong></span>
                <span>Limit: <strong>${{ $budget->limit_amount }}</strong></span>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px;">
                <button onclick="deleteBudget('{{ $budget->_id }}')" class="btn btn-danger btn-sm">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
        @empty
        <div style="text-align:center;padding:40px;color:var(--gray);">
            <i class="fas fa-wallet" style="font-size:36px;opacity:0.3;display:block;margin-bottom:12px;"></i>
            No budgets set. Use the form to create your first budget limit.
        </div>
        @endforelse
    </div>

</div>
@endsection

@push('scripts')
<script>
async function saveBudget() {
    const form = document.getElementById('budget-form');
    const data = Object.fromEntries(new FormData(form));

    try {
        const res = await apiCall('/budget', 'POST', data);
        if (res.success) {
            showToast(res.message, 'success');
            setTimeout(() => location.reload(), 1000);
        }
    } catch (e) { showToast('Failed to save budget.', 'danger'); }
}

async function deleteBudget(id) {
    if (!confirm('Remove this budget?')) return;
    try {
        const res = await apiCall(`/budget/${id}`, 'DELETE');
        if (res.success) { showToast('Budget removed.', 'success'); setTimeout(() => location.reload(), 800); }
    } catch (e) { showToast('Delete failed.', 'danger'); }
}
</script>
@endpush

{{-- ============================================================ --}}
{{-- resources/views/reports/index.blade.php                      --}}
{{-- ============================================================ --}}
{{-- NOTE: Save the section below in resources/views/reports/index.blade.php --}}


{{-- resources/views/reports/index.blade.php --}}
@extends('layouts.app')
@section('title','Reports')
@section('page-title','Financial Reports')

@section('topbar-actions')
    <a href="{{ route('reports.export.pdf', 'monthly') }}" class="btn btn-danger btn-sm">
        <i class="fas fa-file-pdf"></i> Export PDF
    </a>
@endsection

@section('content')

{{-- MONTHLY REPORT --}}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;">
    <div class="card">
        <div class="card-title">📅 This Month — {{ $monthlyReport['label'] }}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
            <div style="padding:14px;background:#d1fae5;border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:#065f46;">${{ number_format($monthlyReport['total_income'],2) }}</div>
                <div style="font-size:11px;color:#065f46;font-weight:600;">Total Income</div>
            </div>
            <div style="padding:14px;background:#fee2e2;border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:#991b1b;">${{ number_format($monthlyReport['total_expense'],2) }}</div>
                <div style="font-size:11px;color:#991b1b;font-weight:600;">Total Expenses</div>
            </div>
            <div style="padding:14px;background:#dbeafe;border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:#1e40af;">${{ number_format($monthlyReport['total_saving'],2) }}</div>
                <div style="font-size:11px;color:#1e40af;font-weight:600;">Total Savings</div>
            </div>
            <div style="padding:14px;background:{{ $monthlyReport['net_balance'] >= 0 ? '#d1fae5' : '#fee2e2' }};border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:{{ $monthlyReport['net_balance'] >= 0 ? '#065f46' : '#991b1b' }};">
                    ${{ number_format(abs($monthlyReport['net_balance']),2) }}
                </div>
                <div style="font-size:11px;font-weight:600;color:{{ $monthlyReport['net_balance'] >= 0 ? '#065f46' : '#991b1b' }};">Net {{ $monthlyReport['net_balance'] >= 0 ? 'Surplus' : 'Deficit' }}</div>
            </div>
        </div>
        <div style="padding:12px;background:var(--light);border-radius:10px;display:flex;justify-content:space-between;">
            <span style="font-size:13px;">Savings Rate:</span>
            <span style="font-weight:700;color:{{ $monthlyReport['savings_rate'] >= 20 ? 'var(--success)' : 'var(--warning)' }}">{{ $monthlyReport['savings_rate'] }}%</span>
        </div>
        <div style="padding:12px;background:var(--light);border-radius:10px;display:flex;justify-content:space-between;margin-top:8px;">
            <span style="font-size:13px;">Daily Average Spend:</span>
            <span style="font-weight:700;">${{ number_format($monthlyReport['daily_avg_spend'],2) }}</span>
        </div>
    </div>

    {{-- ANNUAL REPORT --}}
    <div class="card">
        <div class="card-title">📆 {{ $annualReport['label'] }} Summary</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
            <div style="padding:14px;background:#d1fae5;border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:#065f46;">${{ number_format($annualReport['total_income'],2) }}</div>
                <div style="font-size:11px;color:#065f46;font-weight:600;">Annual Income</div>
            </div>
            <div style="padding:14px;background:#fee2e2;border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:#991b1b;">${{ number_format($annualReport['total_expense'],2) }}</div>
                <div style="font-size:11px;color:#991b1b;font-weight:600;">Annual Expenses</div>
            </div>
            <div style="padding:14px;background:#dbeafe;border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:#1e40af;">${{ number_format($annualReport['total_saving'],2) }}</div>
                <div style="font-size:11px;color:#1e40af;font-weight:600;">Annual Savings</div>
            </div>
            <div style="padding:14px;background:var(--light);border-radius:10px;text-align:center;">
                <div style="font-size:22px;font-weight:800;color:var(--dark);">${{ number_format($annualReport['monthly_avg'],2) }}</div>
                <div style="font-size:11px;font-weight:600;color:var(--gray);">Avg Monthly Spend</div>
            </div>
        </div>
        <div style="padding:12px;background:var(--light);border-radius:10px;display:flex;justify-content:space-between;">
            <span style="font-size:13px;">Annual Savings Rate:</span>
            <span style="font-weight:700;color:{{ $annualReport['savings_rate'] >= 20 ? 'var(--success)' : 'var(--warning)' }}">{{ $annualReport['savings_rate'] }}%</span>
        </div>
    </div>
</div>

{{-- EXPENSE BREAKDOWN --}}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;">
    <div class="card">
        <div class="card-title">🏷️ Expense Category Breakdown</div>
        @forelse($monthlyReport['category_breakdown'] as $cat => $amount)
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9;">
            <span style="font-size:13px;font-weight:500;">{{ ucfirst($cat) }}</span>
            <div style="text-align:right;">
                <span style="font-weight:700;color:var(--danger);">${{ number_format($amount,2) }}</span>
                @if($monthlyReport['total_expense'] > 0)
                <span style="font-size:11px;color:var(--gray);display:block;">{{ round(($amount/$monthlyReport['total_expense'])*100,1) }}%</span>
                @endif
            </div>
        </div>
        @empty
        <div style="text-align:center;color:var(--gray);padding:20px;">No expense data this month.</div>
        @endforelse
    </div>

    {{-- FORECAST --}}
    <div class="card">
        <div class="card-title">🔮 3-Month Expense Forecast</div>
        @foreach($forecast as $f)
        <div style="padding:16px;border:1px solid var(--border);border-radius:12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
            <div>
                <div style="font-size:14px;font-weight:700;">{{ $f['month'] }}</div>
                <div style="font-size:12px;color:var(--gray);">Predicted expenses</div>
            </div>
            <div style="font-size:20px;font-weight:800;color:var(--primary);">${{ number_format($f['predicted_expense'],2) }}</div>
        </div>
        @endforeach
        <div style="padding:12px;background:#fef3c7;border-radius:10px;font-size:12px;color:#92400e;margin-top:8px;">
            ⚠️ Forecast based on your last 6 months spending trend using linear regression.
        </div>
    </div>
</div>

@endsection

<?php

// ============================================================
// routes/channels.php
// ============================================================

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Private channel for real-time AI suggestion delivery
Broadcast::channel('user.{id}', function ($user, $id) {
    return $user->id == $id;
});


// ============================================================
// config/database.php — MongoDB section to ADD inside connections[]
// ============================================================
/*
'mongodb' => [
    'driver'   => 'mongodb',
    'host'     => env('DB_HOST', '127.0.0.1'),
    'port'     => env('DB_PORT', 27017),
    'database' => env('DB_DATABASE', 'LP_AI'),
    'username' => env('DB_USERNAME', ''),
    'password' => env('DB_PASSWORD', ''),
    'options'  => [
        'database' => env('DB_DATABASE', 'LP_AI'),
    ],
],
*/


// ============================================================
// resources/views/reports/pdf.blade.php
// ============================================================
/*
<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: Arial, sans-serif; color: #1e293b; font-size: 13px; }
    h1 { color: #6366f1; font-size: 24px; }
    .header { border-bottom: 3px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px; }
    .stats-row { display: flex; gap: 16px; margin: 20px 0; }
    .stat-box { flex: 1; padding: 16px; border-radius: 8px; text-align: center; }
    .income-box { background: #d1fae5; }
    .expense-box { background: #fee2e2; }
    .saving-box { background: #dbeafe; }
    .stat-value { font-size: 20px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #6366f1; color: white; padding: 10px; text-align: left; }
    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
    .footer { margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: center; }
</style>
</head>
<body>
<div class="header">
    <h1>💰 LP_AI Financial Report</h1>
    <p><strong>{{ $user->name }}</strong> | Generated: {{ now()->format('F j, Y') }}</p>
</div>

<h2>{{ $data['label'] }}</h2>

<div class="stats-row">
    <div class="stat-box income-box">
        <div class="stat-value">${{ number_format($data['total_income'],2) }}</div>
        <div>Total Income</div>
    </div>
    <div class="stat-box expense-box">
        <div class="stat-value">${{ number_format($data['total_expense'],2) }}</div>
        <div>Total Expenses</div>
    </div>
    <div class="stat-box saving-box">
        <div class="stat-value">${{ number_format($data['total_saving'],2) }}</div>
        <div>Total Savings</div>
    </div>
</div>

<p><strong>Savings Rate:</strong> {{ $data['savings_rate'] }}% &nbsp;|&nbsp;
   <strong>Net Balance:</strong> ${{ number_format($data['net_balance'],2) }}</p>

@if(!empty($data['category_breakdown']))
<h3>Expense Breakdown by Category</h3>
<table>
    <thead><tr><th>Category</th><th>Amount</th><th>% of Total</th></tr></thead>
    <tbody>
    @foreach($data['category_breakdown'] as $cat => $amount)
    <tr>
        <td>{{ ucfirst($cat) }}</td>
        <td>${{ number_format($amount,2) }}</td>
        <td>{{ $data['total_expense'] > 0 ? round(($amount/$data['total_expense'])*100,1) : 0 }}%</td>
    </tr>
    @endforeach
    </tbody>
</table>
@endif

<div class="footer">
    Generated by LP_AI — AI-Powered Financial Management System<br>
    {{ config('app.url') }}
</div>
</body>
</html>
*/




langchain use korte hobe 