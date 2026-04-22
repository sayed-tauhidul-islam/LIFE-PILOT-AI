<?php

namespace App\Services;

use App\Models\User;
use App\Models\AISuggestion;
use App\Models\HealthProfile;
use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIService
{
    /**
     * Check if a Gemini API key is configured.
     */
    private function hasValidApiKey(): bool
    {
        $key = config('services.gemini.api_key', env('GEMINI_API_KEY', ''));

        return !empty($key) && $key !== 'your-gemini-api-key-here';
    }

    /**
     * Resolve which AI provider should be used for this user.
     */
    private function resolveProvider(User $user): string
    {
        $provider = strtolower((string) ($user->ai_provider ?? 'gemini'));

        return in_array($provider, ['gemini', 'local'], true) ? $provider : 'gemini';
    }

    /**
    * Generate comprehensive AI suggestion for a user.
    * Uses Gemini if key is valid, otherwise uses smart local analysis.
     */
    public function generateSuggestion(User $user, array $financialStats, ?HealthProfile $health): ?AISuggestion
    {
        try {
            $finScore = $this->calculateFinScore($user, $financialStats);
            $provider = $this->resolveProvider($user);

            if ($provider === 'gemini' && $this->hasValidApiKey()) {
                $prompt = $this->buildPrompt($user, $financialStats, $health);

                try {
                    $response = $this->callGemini($prompt, $user);
                    $parsed   = $this->parseResponse($response['content']);
                    $model    = $response['model'] ?? config('services.gemini.model', 'gemini-1.5-flash');
                    $tokens   = $response['tokens'] ?? 0;
                } catch (\Throwable $e) {
                    Log::warning('Gemini failed, falling back to local AI', [
                        'user_id' => $user->id,
                        'error' => $e->getMessage(),
                    ]);
                    $parsed = $this->generateLocalSuggestion($user, $financialStats, $health);
                    $model  = 'local-ai-engine';
                    $tokens = 0;
                }
            } else {
                // Use smart local AI engine
                Log::info('Using local AI engine', [
                    'user_id' => $user->id,
                    'provider' => $provider,
                    'gemini_configured' => $this->hasValidApiKey(),
                ]);
                $prompt = 'Local AI analysis';
                $parsed = $this->generateLocalSuggestion($user, $financialStats, $health);
                $model  = 'local-ai-engine';
                $tokens = 0;
            }

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
                'model_used'       => $model,
                'tokens_used'      => $tokens,
                'generated_at'     => now(),
            ]);

            return $suggestion;

        } catch (\Exception $e) {
            Log::error('AI Suggestion Error', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Generate smart suggestion locally using rule-based analysis.
     * No external API needed — analyzes real user data intelligently.
     */
    /**
     * Get Bangla label for a category key.
     */
    private function catLabel(string $key): string
    {
        $labels = array_merge(
            Transaction::expenseCategories(),
            Transaction::incomeCategories()
        );
        return $labels[$key] ?? $key;
    }

    private function generateLocalSuggestion(User $user, array $stats, ?HealthProfile $health): array
    {
        $currency       = $user->currency ?? 'USD';
        $monthlyIncome  = max(1, $stats['monthly_income'] ?? $user->monthly_income ?? 1);
        $monthlyExpense = $stats['monthly_expense'] ?? 0;
        $monthlySaving  = $stats['monthly_saving'] ?? 0;
        $savingsRate    = $stats['savings_rate'] ?? 0;
        $todayExpense   = $stats['today_expense'] ?? 0;
        $weeklyExpense  = $stats['weekly_expense'] ?? 0;
        $categories     = $stats['category_breakdown'] ?? [];
        $netBalance     = $monthlyIncome - $monthlyExpense;

        // --- Calculate daily spending limit ---
        $daysInMonth       = now()->daysInMonth;
        $daysRemaining     = max(1, $daysInMonth - now()->day + 1);
        $idealSavingsRate  = 0.20; // Target 20% savings
        $spendableBudget   = $monthlyIncome * (1 - $idealSavingsRate);
        $dailyLimit        = round($spendableBudget / $daysInMonth, 0);

        // --- Monthly savings target ---
        $monthlySavingsTarget   = round($monthlyIncome * $idealSavingsRate, 0);
        $annualSavingsProjection = round($monthlySavingsTarget * 12, 0);

        // --- Financial health summary ---
        $summary = $this->buildFinancialSummary($user, $monthlyIncome, $monthlyExpense, $savingsRate, $netBalance, $currency);

        // --- Financial tips (context-aware) ---
        $tips = $this->generateSmartTips($stats, $categories, $monthlyIncome, $monthlyExpense, $savingsRate, $todayExpense, $dailyLimit, $currency);

        // --- Spending warning ---
        $warning = null;
        if ($monthlyExpense > $monthlyIncome) {
            $overBy  = round($monthlyExpense - $monthlyIncome, 0);
            $warning = "আপনি এই মাসে {$currency} {$overBy} অতিরিক্ত খরচ করেছেন! আপনার খরচ আয়ের চেয়ে বেশি। অবিলম্বে পদক্ষেপ নিন।";
        } elseif ($monthlyExpense > ($monthlyIncome * 0.85)) {
            $pct     = round(($monthlyExpense / $monthlyIncome) * 100, 0);
            $warning = "সতর্কতা: আপনি এই মাসে আপনার আয়ের {$pct}% ব্যয় করেছেন। সঞ্চয়ের জন্য খুব কম জায়গা আছে।";
        } elseif ($todayExpense > $dailyLimit * 1.5) {
            $warning = "আজকের খরচ ({$currency} {$todayExpense}) আপনার দৈনিক সীমার ({$currency} {$dailyLimit}) চেয়ে অনেক বেশি।";
        }

        // --- Anomalies ---
        $anomalies = [];
        if (!empty($categories)) {
            $avgPerCategory = $monthlyExpense / max(1, count($categories));
            foreach ($categories as $cat => $amount) {
                if ($amount > $avgPerCategory * 2.5 && $amount > 50) {
                    $anomalies[] = [
                        'category' => $cat,
                        'message'  => $this->catLabel($cat) . " খাতে খরচ ({$currency} {$amount}) অস্বাভাবিকভাবে বেশি — মোট খরচের " . round(($amount / $monthlyExpense) * 100, 0) . "%। এই খাতে সাশ্রয়ের সুযোগ খুঁজুন।",
                    ];
                }
            }
        }

        // --- Category-wise Budget Plan ---
        $budgetPlan = $this->generateBudgetPlan($monthlyIncome, $monthlyExpense, $categories, $currency);

        // --- Meal Plan ---
        $mealPlan = $this->generateLocalMealPlan($health, $dailyLimit, $currency);

        // --- Investment suggestion ---
        $investmentSuggestion = $this->getInvestmentAdvice($savingsRate, $netBalance, $monthlyExpense, $currency);

        // --- Emergency fund ---
        $monthsOfExpenses   = $monthlyExpense > 0 ? round($monthlySaving * 6 / max(1, $monthlyExpense), 0) : 0;
        $emergencyFundStatus = $monthlySaving > ($monthlyExpense * 3)
            ? "ভালো — আপনার একটি স্বাস্থ্যকর সঞ্চয় বাফার আছে বলে মনে হচ্ছে।"
            : "আপনার জরুরি তহবিল {$currency} " . round($monthlyExpense * 3, 0) . " থেকে " . round($monthlyExpense * 6, 0) . " (৩-৬ মাসের খরচ) গড়ে তোলা উচিত।";

        return [
            'daily_spending_limit'      => $dailyLimit,
            'monthly_savings_target'    => $monthlySavingsTarget,
            'annual_savings_projection' => $annualSavingsProjection,
            'financial_health_summary'  => $summary,
            'financial_tips'            => array_slice($tips, 0, 5),
            'spending_warning'          => $warning,
            'anomalies'                 => $anomalies,
            'budget_plan'               => $budgetPlan,
            'meal_plan'                 => $mealPlan,
            'investment_suggestion'     => $investmentSuggestion,
            'emergency_fund_status'     => $emergencyFundStatus,
        ];
    }

    /**
     * Build a human-readable financial summary.
     */
    private function buildFinancialSummary(User $user, float $income, float $expense, float $savingsRate, float $netBalance, string $currency): string
    {
        $name = $user->name ?? 'User';

        if ($income == 0 && $expense == 0) {
            return "{$name}, আপনি এই মাসে এখনো কোনো লেনদেন রেকর্ড করেননি। ব্যক্তিগত আর্থিক অন্তর্দৃষ্টি ও সুপারিশ পেতে আপনার আয় ও খরচ যোগ করা শুরু করুন।";
        }

        $parts = [];

        if ($savingsRate >= 30) {
            $parts[] = "{$name}, চমৎকার আর্থিক শৃঙ্খলা! আপনি এই মাসে আপনার আয়ের {$savingsRate}% সঞ্চয় করছেন।";
        } elseif ($savingsRate >= 20) {
            $parts[] = "{$name}, ভালো কাজ! আপনি আপনার আয়ের {$savingsRate}% সঞ্চয় করছেন, সুপারিশকৃত ২০% লক্ষ্য পূরণ করছেন।";
        } elseif ($savingsRate >= 10) {
            $parts[] = "{$name}, আপনি আপনার আয়ের {$savingsRate}% সঞ্চয় করছেন। আরও ভালো আর্থিক নিরাপত্তার জন্য ২০% সঞ্চয় লক্ষ্যের দিকে এগিয়ে যান।";
        } elseif ($savingsRate > 0) {
            $parts[] = "{$name}, আপনার সঞ্চয় হার মাত্র {$savingsRate}%। অন্তত ২০% লক্ষ্যে পৌঁছাতে অপ্রয়োজনীয় খরচ কমানোর কথা ভাবুন।";
        } else {
            $parts[] = "{$name}, আপনি বর্তমানে আয়ের চেয়ে বেশি ব্যয় করছেন। এটি টেকসই নয় — অবিলম্বে আপনার খরচ পর্যালোচনা করুন।";
        }

        if ($netBalance > 0) {
            $parts[] = "এই মাসের নিট ব্যালেন্স: +{$currency} " . round($netBalance, 0) . "।";
        } else {
            $parts[] = "আপনি এই মাসে {$currency} " . abs(round($netBalance, 0)) . " ঘাটতিতে আছেন।";
        }

        return implode(' ', $parts);
    }

    /**
     * Generate context-aware financial tips.
     */
    private function generateSmartTips(array $stats, array $categories, float $income, float $expense, float $savingsRate, float $todayExpense, float $dailyLimit, string $currency): array
    {
        $tips = [];

        // Top spending category tip
        if (!empty($categories)) {
            $topCategory = array_key_first($categories);
            $topAmount   = reset($categories);
            $pct         = $income > 0 ? round(($topAmount / $income) * 100, 0) : 0;
            $catName     = $this->catLabel($topCategory);
            if ($pct > 30) {
                $tips[] = "⚠️ '{$catName}' খাতে আপনার আয়ের {$pct}% ({$currency} {$topAmount}) খরচ হচ্ছে — এটি অনেক বেশি। এই খরচ ২০%-এর মধ্যে আনার পরিকল্পনা করুন।";
            } else {
                $tips[] = "আপনার সর্বোচ্চ খরচের খাত '{$catName}' ({$currency} {$topAmount}, আয়ের {$pct}%)। নিয়মিত এই খাতের খরচ পর্যবেক্ষণ করুন।";
            }
        }

        // Savings rate tips
        if ($savingsRate < 0) {
            $deficit = round(abs($income - $expense), 0);
            $tips[] = "🔴 সতর্কতা: আপনি আয়ের চেয়ে {$currency} {$deficit} বেশি খরচ করছেন! প্রথম পদক্ষেপ হিসেবে অপ্রয়োজনীয় সাবস্ক্রিপশন ও বাইরে খাওয়া কমান।";
        } elseif ($savingsRate < 10) {
            $neededMore = round($income * 0.10 - ($income - $expense), 0);
            $tips[] = "💡 আপনার সঞ্চয় হার ({$savingsRate}%) কম। মাসে অতিরিক্ত {$currency} {$neededMore} বাঁচালেই ১০% সঞ্চয়ে পৌঁছাবেন। ৫০/৩০/২০ নিয়ম অনুসরণ করুন — ৫০% প্রয়োজন, ৩০% ইচ্ছা, ২০% সঞ্চয়।";
        } elseif ($savingsRate < 20) {
            $target = round($income * 0.20 - ($income - $expense), 0);
            $tips[] = "📈 আদর্শ ২০% সঞ্চয় হারে পৌঁছাতে মাসিক আরো {$currency} {$target} কমান। ছোট পরিবর্তনও বড় ফলাফল আনে!";
        } elseif ($savingsRate >= 20) {
            $tips[] = "🎯 অভিনন্দন! আপনার সঞ্চয় হার {$savingsRate}% — এটি চমৎকার। এই গতি ধরে রাখুন এবং বিনিয়োগের কথা ভাবুন।";
        }

        // Daily spending tip
        if ($todayExpense > $dailyLimit * 2) {
            $tips[] = "🚨 আজ আপনি দৈনিক সীমার দ্বিগুণেরও বেশি ({$currency} {$todayExpense}) খরচ করেছেন! আগামী ২-৩ দিন শুধু অত্যাবশ্যকীয় খরচ করুন।";
        } elseif ($todayExpense > $dailyLimit) {
            $over = round($todayExpense - $dailyLimit, 0);
            $tips[] = "⚡ আজকের খরচ ({$currency} {$todayExpense}) সীমার ({$currency} {$dailyLimit}) চেয়ে {$currency} {$over} বেশি। আগামীকাল এটুকু কম খরচ করুন।";
        } else {
            $remaining = round($dailyLimit - $todayExpense, 0);
            $tips[] = "✅ আজকের বাজেটে {$currency} {$remaining} বাকি আছে। দারুণ আর্থিক শৃঙ্খলা! এভাবে চালিয়ে যান।";
        }

        // Category-specific tips with Bangla names
        if (isset($categories['entertainment']) && $categories['entertainment'] > ($income * 0.10)) {
            $amt = $categories['entertainment'];
            $tips[] = "🎭 বিনোদন খাতে {$currency} {$amt} খরচ (আয়ের ১০%+)। বিনামূল্যে বিকল্প খুঁজুন — পার্কে ঘোরা, বাড়িতে সিনেমা দেখা, বই পড়া ইত্যাদি।";
        }
        if (isset($categories['food']) && $categories['food'] > ($income * 0.15)) {
            $amt = $categories['food'];
            $tips[] = "🍚 খাবারে {$currency} {$amt} খরচ বেশি। বাড়িতে রান্না করুন, রেস্তোরাঁয় কম যান। সপ্তাহের শুরুতে মিল প্ল্যান করলে ৩০-৪০% সাশ্রয় সম্ভব।";
        }
        if (isset($categories['transport']) && $categories['transport'] > ($income * 0.10)) {
            $amt = $categories['transport'];
            $tips[] = "🚌 যাতায়াতে {$currency} {$amt} ব্যয় হচ্ছে। গণপরিবহন, কারপুলিং বা অফিসের কাছে থাকার কথা ভাবুন।";
        }
        if (isset($categories['shopping']) && $categories['shopping'] > ($income * 0.10)) {
            $amt = $categories['shopping'];
            $tips[] = "🛒 কেনাকাটায় {$currency} {$amt} ব্যয়। ২৪-ঘণ্টার নিয়ম — কোনো কিছু কেনার আগে একদিন অপেক্ষা করুন, প্রকৃত প্রয়োজন যাচাই করুন।";
        }
        if (isset($categories['bills']) && $categories['bills'] > ($income * 0.20)) {
            $amt = $categories['bills'];
            $tips[] = "💳 বিল খাতে {$currency} {$amt} যাচ্ছে — প্রতিটি সাবস্ক্রিপশন পরীক্ষা করুন এবং অপ্রয়োজনীয়গুলো বাদ দিন।";
        }
        if (isset($categories['rent']) && $categories['rent'] > ($income * 0.30)) {
            $pct = round(($categories['rent'] / $income) * 100, 0);
            $tips[] = "🏠 বাড়ি ভাড়া আয়ের {$pct}% — বিশেষজ্ঞরা সর্বোচ্চ ৩০% সুপারিশ করেন। সম্ভব হলে কম ভাড়ার বিকল্প খুঁজুন বা রুমমেট নিন।";
        }

        // Weekly trend analysis
        $weeklyExpense = $stats['weekly_expense'] ?? 0;
        if ($weeklyExpense > 0 && $income > 0) {
            $weeklyBudget = round($income / 4.33, 0);
            if ($weeklyExpense > $weeklyBudget) {
                $overPct = round((($weeklyExpense - $weeklyBudget) / $weeklyBudget) * 100, 0);
                $tips[] = "📅 এই সপ্তাহে সাপ্তাহিক বাজেটের চেয়ে {$overPct}% বেশি খরচ হয়েছে। আগামী সপ্তাহে ক্ষতিপূরণ করুন।";
            }
        }

        // General tips if we don't have enough — more actionable & specific
        $generalTips = [
            "💰 বেতন পেলেই প্রথমে সঞ্চয় অ্যাকাউন্টে {$currency} " . round($income * 0.10, 0) . " ট্রান্সফার করুন — 'নিজেকে প্রথমে পরিশোধ' নীতি।",
            "📱 সব সাবস্ক্রিপশন তালিকা করুন — গড়ে মানুষ মাসে অব্যবহৃত সাবস্ক্রিপশনে ১৫-২০% অপচয় করে।",
            "✏️ প্রতিদিন প্রতিটি খরচ রেকর্ড করুন — সচেতনতাই আর্থিক নিয়ন্ত্রণের প্রথম ধাপ।",
            "🏦 বিনিয়োগের আগে ৩-৬ মাসের খরচ সমান ({$currency} " . round($expense * 3, 0) . " - " . round($expense * 6, 0) . ") জরুরি তহবিল রাখুন।",
            "🎯 প্রতি মাসের শুরুতে বাজেট সেট করুন — ফিক্সড খরচ, ভ্যারিয়েবল খরচ ও সঞ্চয়ের আলাদা বরাদ্দ রাখুন।",
            "📊 মাসের শেষে বিভাগ অনুযায়ী খরচ রিভিউ করুন — কোথায় কমানো যায় তা খুঁজে বের করুন।",
        ];

        while (count($tips) < 3 && !empty($generalTips)) {
            $tips[] = array_shift($generalTips);
        }

        return $tips;
    }

    /**
     * Generate a detailed category-wise monthly budget plan.
     * Uses 50/30/20 rule as baseline, adjusted by actual spending patterns.
     */
    private function generateBudgetPlan(float $income, float $expense, array $categories, string $currency): array
    {
        // Ideal allocation percentages (50/30/20 rule adapted for Bangladesh/general context)
        $idealAllocation = [
            'rent'          => ['pct' => 25, 'label' => '🏠 বাসা ভাড়া', 'type' => 'need'],
            'food'          => ['pct' => 15, 'label' => '🍽️ খাবার', 'type' => 'need'],
            'transport'     => ['pct' => 8,  'label' => '🚗 যাতায়াত', 'type' => 'need'],
            'utilities'     => ['pct' => 5,  'label' => '💡 ইউটিলিটি (বিদ্যুৎ/গ্যাস/পানি)', 'type' => 'need'],
            'healthcare'    => ['pct' => 5,  'label' => '🏥 চিকিৎসা ও স্বাস্থ্য', 'type' => 'need'],
            'education'     => ['pct' => 5,  'label' => '📚 শিক্ষা', 'type' => 'need'],
            'insurance'     => ['pct' => 3,  'label' => '🛡️ বীমা', 'type' => 'need'],
            'entertainment' => ['pct' => 5,  'label' => '🎬 বিনোদন', 'type' => 'want'],
            'shopping'      => ['pct' => 5,  'label' => '🛍️ কেনাকাটা', 'type' => 'want'],
            'personal'      => ['pct' => 4,  'label' => '👤 ব্যক্তিগত যত্ন', 'type' => 'want'],
        ];

        $savingsPct = 20;
        $items = [];
        $totalAllocated = 0;

        foreach ($idealAllocation as $catKey => $info) {
            $recommended = round($income * $info['pct'] / 100, 0);
            $actual      = round($categories[$catKey] ?? 0, 0);
            $diff        = $actual - $recommended;

            // Status: over / under / ok
            if ($actual > $recommended * 1.2 && $actual > 0) {
                $status = 'over';
                $advice = "⚠️ {$currency} " . abs(round($diff)) . " বেশি খরচ হচ্ছে। কমানো দরকার।";
            } elseif ($actual > 0 && $actual < $recommended * 0.5) {
                $status = 'under';
                $advice = "✅ বাজেটের মধ্যে আছে। চমৎকার!";
            } elseif ($actual == 0) {
                $status = 'none';
                $advice = "এই খাতে এখনো কোনো খরচ রেকর্ড হয়নি।";
            } else {
                $status = 'ok';
                $advice = "👍 যথাযথ খরচ হচ্ছে।";
            }

            $items[] = [
                'category'    => $catKey,
                'label'       => $info['label'],
                'type'        => $info['type'],
                'recommended' => $recommended,
                'actual'      => $actual,
                'percentage'  => $info['pct'],
                'diff'        => round($diff),
                'status'      => $status,
                'advice'      => $advice,
            ];

            $totalAllocated += $info['pct'];
        }

        // Savings target
        $savingsRecommended = round($income * $savingsPct / 100, 0);
        $actualSavings      = round(max(0, $income - $expense), 0);

        // Summary text
        $needsTotal = 0;
        $wantsTotal = 0;
        foreach ($items as $item) {
            if ($item['type'] === 'need') $needsTotal += $item['recommended'];
            else $wantsTotal += $item['recommended'];
        }

        return [
            'items'            => $items,
            'savings'          => [
                'recommended' => $savingsRecommended,
                'actual'      => $actualSavings,
                'percentage'  => $savingsPct,
                'status'      => $actualSavings >= $savingsRecommended ? 'ok' : 'under',
            ],
            'summary'          => [
                'needs_total'   => $needsTotal,
                'wants_total'   => $wantsTotal,
                'savings_total' => $savingsRecommended,
                'total_income'  => round($income, 0),
                'total_expense' => round($expense, 0),
            ],
            'rule_explanation' => "৫০/৩০/২০ নিয়ম: আয়ের ৫০% প্রয়োজন (ভাড়া, খাবার, যাতায়াত), ৩০% ইচ্ছা (বিনোদন, কেনাকাটা), ২০% সঞ্চয় ও বিনিয়োগ।",
        ];
    }

    /**
     * Generate a local meal plan based on health profile.
     */
    private function generateLocalMealPlan(?HealthProfile $health, float $dailyLimit, string $currency): ?array
    {
        $dailyFoodBudget = $health->daily_food_budget ?? round($dailyLimit * 0.35, 2);
        $calorieTarget   = 2000;
        $dietPrefs       = [];
        $healthGoals     = [];

        if ($health) {
            $calorieTarget = $health->calculateDailyCalories() ?? 2000;
            $dietPrefs     = $health->dietary_preferences ?? [];
            $healthGoals   = $health->health_goals ?? [];
        }

        $isVeg      = in_array('vegetarian', $dietPrefs) || in_array('vegan', $dietPrefs);
        $isHalal    = in_array('halal', $dietPrefs);
        $wantsLose  = in_array('lose_weight', $healthGoals);
        $wantsGain  = in_array('gain_muscle', $healthGoals);

        // Calorie distribution: Breakfast 25%, Lunch 35%, Dinner 30%, Snacks 10%
        $breakfastCal = round($calorieTarget * 0.25);
        $lunchCal     = round($calorieTarget * 0.35);
        $dinnerCal    = round($calorieTarget * 0.30);
        $snackCal     = round($calorieTarget * 0.10);

        // Budget distribution: Breakfast 20%, Lunch 35%, Dinner 35%, Snacks 10%
        $breakfastCost = round($dailyFoodBudget * 0.20, 0);
        $lunchCost     = round($dailyFoodBudget * 0.35, 0);
        $dinnerCost    = round($dailyFoodBudget * 0.35, 0);
        $snackCost     = round($dailyFoodBudget * 0.10, 2);

        // Select meals based on preferences — all in Bangla
        if ($isVeg) {
            $breakfast = ['meal' => 'ওটমিল — কলা, চিয়া সিড ও বাদাম দুধ দিয়ে', 'nutrients' => 'ফাইবার, পটাশিয়াম, ওমেগা-৩, প্রোটিন'];
            $lunch     = ['meal' => 'কিনোয়া বোল — ভাজা সবজি, ছোলা ও তাহিনি সহ', 'nutrients' => 'সম্পূর্ণ প্রোটিন, আয়রন, ফাইবার, স্বাস্থ্যকর ফ্যাট'];
            $dinner    = ['meal' => 'মসুর ডাল কারি — বাদামি চাল ও সেদ্ধ ব্রকলি সহ', 'nutrients' => 'প্রোটিন, আয়রন, ফাইবার, ভিটামিন সি'];
            $snacks    = ['meal' => 'মিক্সড বাদাম, আপেলের টুকরো ও পিনাট বাটার', 'nutrients' => 'স্বাস্থ্যকর ফ্যাট, ফাইবার, প্রোটিন'];
        } elseif ($wantsGain) {
            $breakfast = ['meal' => 'ডিমের স্ক্র্যাম্বল (৩টি) — লাল আটার রুটি, অ্যাভোকাডো ও দই সহ', 'nutrients' => 'প্রোটিন (৩০গ্রা), স্বাস্থ্যকর ফ্যাট, জটিল কার্ব'];
            $lunch     = ['meal' => 'গ্রিলড মুরগি — মিষ্টি আলু, বাদামি চাল ও মিক্সড সালাদ সহ', 'nutrients' => 'প্রোটিন (৪০গ্রা), জটিল কার্ব, ভিটামিন এ/সি'];
            $dinner    = ['meal' => 'স্যামন মাছ — কিনোয়া, সেদ্ধ সবজি ও জলপাই তেল সহ', 'nutrients' => 'প্রোটিন (৩৫গ্রা), ওমেগা-৩, সম্পূর্ণ কার্ব'];
            $snacks    = ['meal' => 'প্রোটিন শেক — কলা ও পনির সহ', 'nutrients' => 'প্রোটিন (২৫গ্রা), পটাশিয়াম, ক্যালসিয়াম'];
        } elseif ($wantsLose) {
            $breakfast = ['meal' => 'দই পারফেইট — বেরি ও সামান্য গ্রানোলা সহ', 'nutrients' => 'প্রোটিন, অ্যান্টিঅক্সিড্যান্ট, প্রোবায়োটিক'];
            $lunch     = ['meal' => 'গ্রিলড মুরগির সালাদ — শসা, টমেটো ও লেবুর ড্রেসিং সহ', 'nutrients' => 'লীন প্রোটিন, ফাইবার, ভিটামিন'];
            $dinner    = ['meal' => 'বেকড মাছ — সেদ্ধ সবজি ও ফুলকপির ভাত সহ', 'nutrients' => 'লীন প্রোটিন, ওমেগা-৩, কম কার্ব'];
            $snacks    = ['meal' => 'গাজরের স্টিক ও হামাস, গ্রিন টি', 'nutrients' => 'ফাইবার, প্রোটিন, অ্যান্টিঅক্সিড্যান্ট'];
        } elseif ($isHalal) {
            $breakfast = ['meal' => 'পরোটা ও ডিম ভুজি — সালাদ ও চা সহ', 'nutrients' => 'প্রোটিন, কার্ব, ভিটামিন, শক্তি'];
            $lunch     = ['meal' => 'ভাত, মুরগির ঝোল, মিক্সড সবজি ও ডাল', 'nutrients' => 'প্রোটিন, ফাইবার, ভিটামিন, মিনারেল'];
            $dinner    = ['meal' => 'রুটি, গরুর মাংস ভুনা, সবজি ও সালাদ', 'nutrients' => 'প্রোটিন, আয়রন, ফাইবার, ভিটামিন'];
            $snacks    = ['meal' => 'ফলের সালাদ, বাদাম ও লাচ্ছি', 'nutrients' => 'ভিটামিন, স্বাস্থ্যকর ফ্যাট, প্রোবায়োটিক'];
        } else {
            $breakfast = ['meal' => 'লাল আটার রুটি ও ডিম — অ্যাভোকাডো ও কমলার জুস সহ', 'nutrients' => 'প্রোটিন, স্বাস্থ্যকর ফ্যাট, ভিটামিন সি, ফাইবার'];
            $lunch     = ['meal' => 'মুরগির র‍্যাপ — সবজি, হামাস ও সালাদ সহ', 'nutrients' => 'প্রোটিন, ফাইবার, ভিটামিন, স্বাস্থ্যকর ফ্যাট'];
            $dinner    = ['meal' => 'ভাত, গ্রিলড মাছ, মিক্সড সবজি কারি ও রায়তা', 'nutrients' => 'প্রোটিন, ওমেগা-৩, ফাইবার, প্রোবায়োটিক'];
            $snacks    = ['meal' => 'তাজা ফল, এক মুঠো কাঠবাদাম ও ভেষজ চা', 'nutrients' => 'ভিটামিন, স্বাস্থ্যকর ফ্যাট, অ্যান্টিঅক্সিড্যান্ট'];
        }

        $hydrationTip = 'প্রতিদিন কমপক্ষে ৮ গ্লাস (২ লিটার) পানি পান করুন। সকালে এক গ্লাস গরম পানি ও লেবু দিয়ে শুরু করুন।';
        if ($health && ($health->activity_level ?? '') === 'very_active') {
            $hydrationTip = 'আপনার সক্রিয় জীবনধারায়, প্রতিদিন ৩-৩.৫ লিটার পানি পানের লক্ষ্য রাখুন। তীব্র কার্যকলাপে ইলেক্ট্রোলাইট যোগ করুন।';
        }

        return [
            'breakfast' => array_merge($breakfast, ['calories' => $breakfastCal, 'cost' => $breakfastCost]),
            'lunch'     => array_merge($lunch, ['calories' => $lunchCal, 'cost' => $lunchCost]),
            'dinner'    => array_merge($dinner, ['calories' => $dinnerCal, 'cost' => $dinnerCost]),
            'snacks'    => array_merge($snacks, ['calories' => $snackCal, 'cost' => $snackCost]),
            'total_daily_calories' => $calorieTarget,
            'total_daily_cost'     => $dailyFoodBudget,
            'hydration_tip'        => $hydrationTip,
        ];
    }

    /**
     * Get investment advice based on financial status.
     */
    private function getInvestmentAdvice(float $savingsRate, float $netBalance, float $monthlyExpense, string $currency): string
    {
        if ($netBalance < 0) {
            return "বিনিয়োগের আগে খরচ কমানোর দিকে মনোযোগ দিন। আপনি বর্তমানে আয়ের চেয়ে বেশি ব্যয় করছেন।";
        }

        $emergencyFund = $monthlyExpense * 3;

        if ($savingsRate < 10) {
            return "অগ্রাধিকার: বিনিয়োগ বিবেচনার আগে {$currency} " . round($emergencyFund) . " (৩ মাসের খরচ) জরুরি তহবিল গড়ে তুলুন।";
        } elseif ($savingsRate < 20) {
            return "আপনি সঠিক পথে আছেন। সঞ্চয়ের ৫০% কম-ঝুঁকির ইনডেক্স ফান্ডে এবং ৫০% জরুরি রিজার্ভ হিসেবে রাখার কথা ভাবুন।";
        } elseif ($savingsRate < 35) {
            return "শক্তিশালী সঞ্চয় হার! বৈচিত্র্যকরণ বিবেচনা করুন: ৪০% ইনডেক্স ফান্ড, ৩০% ফিক্সড ডিপোজিট, ২০% জরুরি তহবিল, ১০% শিক্ষা/উন্নয়ন।";
        } else {
            return "চমৎকার সঞ্চয়! বৈচিত্র্যময় পোর্টফোলিও বিবেচনা করুন: ৫০% ইক্যুইটি/ইনডেক্স ফান্ড, ২৫% বন্ড/এফডি, ১৫% অবসর তহবিল, ১০% বিকল্প বিনিয়োগ।";
        }
    }

    /**
    * Build a structured prompt with real user data (for Gemini).
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
     * Call Gemini API.
     */
    private function callGemini(string $prompt, User $user): array
    {
        $apiKey = config('services.gemini.api_key', env('GEMINI_API_KEY', ''));
        $model = config('services.gemini.model', 'gemini-1.5-flash');
        $baseUrl = rtrim(config('services.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta'), '/');

        $response = null;
        $lastException = null;

        for ($attempt = 1; $attempt <= 3; $attempt++) {
            try {
                $response = Http::timeout((int) config('services.gemini.request_timeout', 30))
                    ->acceptJson()
                    ->asJson()
                    ->withQueryParameters(['key' => $apiKey])
                    ->post("{$baseUrl}/models/{$model}:generateContent", [
                        'contents' => [
                            [
                                'role' => 'user',
                                'parts' => [
                                    [
                                        'text' => "You are a professional financial advisor and nutritionist. Always respond with valid JSON only. No markdown formatting.\n\n{$prompt}",
                                    ],
                                ],
                            ],
                        ],
                        'generationConfig' => [
                            'temperature' => 0.7,
                            'maxOutputTokens' => 1500,
                        ],
                    ]);

                if ($response->successful()) {
                    $json = $response->json();
                    $content = data_get($json, 'candidates.0.content.parts.0.text', '');
                    $tokens = data_get($json, 'usageMetadata.totalTokenCount', 0);

                    if (empty($content)) {
                        throw new \RuntimeException('Gemini response was empty');
                    }

                    return [
                        'content' => $content,
                        'tokens' => $tokens,
                        'model' => $model,
                    ];
                }

                $lastException = new \RuntimeException('Gemini API request failed: ' . $response->body());
                Log::warning('Gemini request returned a non-success response', [
                    'user_id' => $user->id,
                    'attempt' => $attempt,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            } catch (\Throwable $e) {
                $lastException = $e;
                Log::warning('Gemini request attempt failed', [
                    'user_id' => $user->id,
                    'attempt' => $attempt,
                    'error' => $e->getMessage(),
                ]);
            }

            if ($attempt < 3) {
                usleep(500000);
            }
        }

        throw $lastException ?? new \RuntimeException('Gemini API request failed');
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
     * Calculate FinScore (0-100) based on financial metrics.
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
            'financial_health_summary'  => 'এই মুহূর্তে এআই বিশ্লেষণ তৈরি করা সম্ভব হয়নি। আবার চেষ্টা করুন।',
            'financial_tips'            => [
                'আপনার দৈনিক খরচ ধারাবাহিকভাবে ট্র্যাক করুন।',
                'আপনার মাসিক আয়ের কমপক্ষে ২০% সঞ্চয় করার লক্ষ্য রাখুন।',
                'সাপ্তাহিক আপনার শীর্ষ ব্যয় বিভাগ পর্যালোচনা করুন।',
            ],
            'spending_warning'          => null,
            'anomalies'                 => [],
            'meal_plan'                 => null,
            'investment_suggestion'     => 'প্রথমে ৩-৬ মাসের খরচের জরুরি তহবিল গড়ে তুলুন।',
            'emergency_fund_status'     => 'মূল্যায়নের জন্য অপর্যাপ্ত তথ্য।',
        ];
    }
}
