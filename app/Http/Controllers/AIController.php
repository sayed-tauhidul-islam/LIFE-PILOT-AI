<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessAISuggestion;
use App\Models\AISuggestion;
use App\Models\HealthProfile;
use App\Models\Transaction;
use App\Services\AIService;
use App\Services\FinanceService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    protected AIService $aiService;
    protected FinanceService $financeService;

    public function __construct(AIService $aiService, FinanceService $financeService)
    {
        $this->aiService = $aiService;
        $this->financeService = $financeService;
    }

    public function index()
    {
        $userId = Auth::id();
        $suggestions = AISuggestion::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $latestSuggestion = $suggestions->first();
        $health = HealthProfile::where('user_id', $userId)->first();
        $recentTransactions = Transaction::forUser($userId)
            ->orderBy('date', 'desc')
            ->limit(12)
            ->get();

        return view('ai.index', compact('suggestions', 'latestSuggestion', 'health', 'recentTransactions'));
    }

    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'language' => 'nullable|in:bn,en,hi',
        ]);

        $user = Auth::user();
        $language = $validated['language'] ?? 'bn';
        $message = trim($validated['message']);
        $normalized = mb_strtolower($message);
        $stats = $this->financeService->getSummary((string) $user->id, 'monthly');

        $messages = session('ai_chat.messages', []);
        $messages[] = ['role' => 'user', 'content' => $message];

        if ($this->isHistoryIntent($normalized)) {
            $history = $this->buildHistoryPayload($user->id, $language);
            $messages[] = ['role' => 'assistant', 'content' => $history['reply']];
            session([
                'ai_chat.messages' => array_slice($messages, -20),
                'ai_chat.pending_transaction' => null,
            ]);

            return response()->json([
                'success' => true,
                'reply' => $history['reply'],
                'show_history' => true,
                'history' => $history['items'],
                'summary' => $history['summary'],
            ]);
        }

        $draft = session('ai_chat.pending_transaction');
        $parsedEntries = $this->extractTransactionEntries($message);
        $parsed = $parsedEntries[0] ?? $this->emptyTransactionDraft();

        if (! $draft && count($parsedEntries) > 1 && $this->allPayloadsComplete($parsedEntries)) {
            $transactions = collect($parsedEntries)
                ->map(fn (array $payload) => $this->createTransactionFromChat($user->id, $payload));

            $this->dispatchSuggestionRefresh($user->id);

            $reply = $this->buildMultiTransactionReply($transactions, $language);
            $messages[] = ['role' => 'assistant', 'content' => $reply];
            session([
                'ai_chat.messages' => array_slice($messages, -20),
                'ai_chat.pending_transaction' => null,
            ]);

            $sidebar = $this->getSidebarData($user);

            return response()->json([
                'success' => true,
                'reply' => $reply,
                'transaction_saved' => true,
                'transaction_count' => $transactions->count(),
                'transactions' => $transactions->map(fn (Transaction $transaction) => $this->transactionResource($transaction))->values()->all(),
                'fin_score' => $sidebar['fin_score'],
                'daily_limit' => $sidebar['daily_limit'],
                'insight' => $sidebar['insight'],
            ]);
        }

        if ($draft) {
            $draft = array_merge($draft, array_filter($parsed, fn ($value) => $value !== null && $value !== ''));
        } elseif ($parsed['type']) {
            $draft = $parsed;
        }

        if ($draft && $this->isTransactionPayloadComplete($draft)) {
            // honor auto-save flag from request; default to true
            $autoSave = $request->get('auto_save', true);

            if ($autoSave) {
                $transaction = $this->createTransactionFromChat($user->id, $draft);
                $this->dispatchSuggestionRefresh($user->id);

                $reply = $this->buildSavedTransactionReply($transaction, $language);
                $messages[] = ['role' => 'assistant', 'content' => $reply];
                session([
                    'ai_chat.messages' => array_slice($messages, -20),
                    'ai_chat.pending_transaction' => null,
                ]);

                $sidebar = $this->getSidebarData($user);

                return response()->json([
                    'success' => true,
                    'reply' => $reply,
                    'transaction_saved' => true,
                    'transaction' => $this->transactionResource($transaction),
                    'fin_score' => $sidebar['fin_score'],
                    'daily_limit' => $sidebar['daily_limit'],
                    'insight' => $sidebar['insight'],
                ]);
            }

            // If not auto-saving, keep draft in session and ask for confirmation
            session([
                'ai_chat.pending_transaction' => $draft,
                'ai_chat.messages' => array_slice($messages, -20),
            ]);

            $reply = $this->buildMissingDetailsReply($draft, $language, []);

            return response()->json([
                'success' => true,
                'reply' => $reply,
                'needs_follow_up' => true,
                'pending_draft' => $draft,
            ]);
        }

        if ($draft) {
            $categorySuggestions = empty($draft['category'])
                ? $this->categorySuggestions($draft['type'], $message, $language)
                : [];

            $reply = $this->buildMissingDetailsReply($draft, $language, $categorySuggestions);
            $messages[] = ['role' => 'assistant', 'content' => $reply];
            session([
                'ai_chat.pending_transaction' => $draft,
                'ai_chat.messages' => array_slice($messages, -20),
            ]);

            return response()->json([
                'success' => true,
                'reply' => $reply,
                'needs_follow_up' => true,
                'category_suggestions' => $categorySuggestions,
            ]);
        }

        $reply = $this->buildGeneralAssistantReply($language);
        $messages[] = ['role' => 'assistant', 'content' => $reply];
        session(['ai_chat.messages' => array_slice($messages, -20)]);

        return response()->json([
            'success' => true,
            'reply' => $reply,
            'category_suggestions' => [],
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $language = $request->get('language', 'bn');
        $history = $this->buildHistoryPayload(Auth::id(), $language);

        return response()->json([
            'success' => true,
            'reply' => $history['reply'],
            'history' => $history['items'],
            'summary' => $history['summary'],
        ]);
    }

    public function generate(Request $request)
    {
        $userId = Auth::id();

        try {
            ProcessAISuggestion::dispatch($userId);

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'AI is analyzing your data now. Fresh suggestions will appear shortly.',
                ]);
            }

            return back()->with('info', 'AI analysis started. Refresh in a few seconds to see the latest suggestions.');
        } catch (\Exception $e) {
            Log::error('AI Generate Error: '.$e->getMessage());

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI generation failed: '.$e->getMessage(),
                ], 500);
            }

            return back()->with('error', 'AI generation failed. Please try again.');
        }
    }

    public function getSuggestions(Request $request): JsonResponse
    {
        $userId = Auth::id();

        $suggestion = AISuggestion::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->first();

        if (! $suggestion) {
            return response()->json(['success' => false, 'message' => 'No suggestion is available yet.']);
        }

        return response()->json(['success' => true, 'data' => $suggestion]);
    }

    public function recommendations()
    {
        $userId = Auth::id();
        $suggestions = AISuggestion::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return view('ai.recommendations', compact('suggestions'));
    }

    public function getFinScore(): JsonResponse
    {
        $userId = Auth::id();
        $stats = $this->financeService->getSummary((string) $userId, 'monthly');
        $finScore = $this->aiService->calculateFinScore(Auth::user(), $stats);

        return response()->json(['success' => true, 'fin_score' => $finScore]);
    }

    public function detectAnomalies(): JsonResponse
    {
        $userId = Auth::id();
        $anomalies = $this->financeService->detectAnomalies((string) $userId);

        return response()->json(['success' => true, 'anomalies' => $anomalies]);
    }

    private function dispatchSuggestionRefresh(int $userId): void
    {
        if (app()->runningUnitTests()) {
            return;
        }

        try {
            ProcessAISuggestion::dispatch($userId);
        } catch (\Throwable $e) {
            try {
                Log::warning('AI chat could not refresh suggestion immediately', [
                    'user_id' => $userId,
                    'error' => $e->getMessage(),
                ]);
            } catch (\Throwable $ignored) {
                // Ignore logging failures so chat saving still succeeds.
            }
        }
    }

    private function isHistoryIntent(string $message): bool
    {
        $needles = [
            'history',
            'show history',
            'transaction history',
            'হিস্ট্রি',
            'history দেখাও',
            'history dakhao',
            'amar history',
            'আমার হিস্ট্রি',
            'আমার history',
            'দেখাও history',
        ];

        foreach ($needles as $needle) {
            if (str_contains($message, $needle)) {
                return true;
            }
        }

        return false;
    }

    private function extractTransactionEntries(string $message): array
    {
        $segments = $this->splitMessageIntoSegments($message);
        $entries = [];
        $fallbackType = null;
        $fallbackDate = null;

        foreach ($segments as $segment) {
            $entry = $this->extractTransactionDetails($segment, $fallbackType, $fallbackDate);

            if (! $entry['type'] && ! $entry['amount'] && ! $entry['category']) {
                continue;
            }

            $fallbackType = $entry['type'] ?? $fallbackType;
            $fallbackDate = $entry['date'] ?? $fallbackDate;
            $entries[] = $entry;
        }

        if ($entries !== []) {
            return $entries;
        }

        return [$this->extractTransactionDetails($message)];
    }

    private function splitMessageIntoSegments(string $message): array
    {
        $segments = preg_split('/\s*(?:,|\.|\n|\band\b|\bthen\b|আর|ও|তারপর)\s*/iu', $message) ?: [];
        $segments = array_values(array_filter(array_map('trim', $segments)));

        return $segments === [] ? [trim($message)] : $segments;
    }

    private function extractTransactionDetails(string $message, ?string $fallbackType = null, ?string $fallbackDate = null): array
    {
        $normalized = mb_strtolower($message);
        $type = $this->detectTransactionType($normalized) ?? $fallbackType;
        $amount = $this->extractAmount($normalized);
        $category = $this->inferCategory($normalized, $type);
        $date = $this->extractDate($normalized) ?? ($fallbackDate ? Carbon::parse($fallbackDate) : null) ?? now();

        if ($type === 'saving' && $category === null) {
            $category = 'investment';
        }

        return [
            'type' => $type,
            'amount' => $amount,
            'category' => $category ?? ($type === 'income' ? 'other' : null),
            'date' => $date->format('Y-m-d'),
            'period' => $this->determinePeriod($normalized, $date),
            'description' => $this->buildDescription($message, $type, $category),
        ];
    }

    private function detectTransactionType(string $message): ?string
    {
        $incomeKeywords = ['income', 'earned', 'earn', 'salary', 'bonus', 'payment received', 'আয়', 'উপার্জন', 'বেতন'];
        $expenseKeywords = ['expense', 'spent', 'spend', 'buy', 'bought', 'paid', 'খরচ', 'ব্যয়', 'কিনেছি', 'দিয়েছি', 'পরিশোধ'];
        $savingKeywords = ['invest', 'investment', 'invested', 'save', 'saved', 'saving', 'সঞ্চয়', 'বিনিয়োগ', 'ইনভেস্ট'];

        foreach ($savingKeywords as $keyword) {
            if (str_contains($message, $keyword)) {
                return 'saving';
            }
        }

        foreach ($incomeKeywords as $keyword) {
            if (str_contains($message, $keyword)) {
                return 'income';
            }
        }

        foreach ($expenseKeywords as $keyword) {
            if (str_contains($message, $keyword)) {
                return 'expense';
            }
        }

        return null;
    }

    private function extractAmount(string $message): ?float
    {
        $normalized = strtr($message, [
            '০' => '0',
            '১' => '1',
            '২' => '2',
            '৩' => '3',
            '৪' => '4',
            '৫' => '5',
            '৬' => '6',
            '৭' => '7',
            '৮' => '8',
            '৯' => '9',
        ]);

        // allow numbers with commas like 1,200 or Bengali ১,২০০ and optionally followed by currency words (টাকা/taka/tk)
        $normalized = preg_replace('/,\s*/', '', $normalized);

        if (preg_match('/(\d+(?:\.\d+)?)\s*(টাকা|tk|taka|৳|bdt|usd|\$)?/iu', $normalized, $matches)) {
            return (float) $matches[1];
        }

        return null;
    }

    private function extractDate(string $message): ?Carbon
    {
        if (str_contains($message, 'গতকাল') || str_contains($message, 'yesterday')) {
            return now()->subDay();
        }

        if (str_contains($message, 'আজ') || str_contains($message, 'today')) {
            return now();
        }

        if (preg_match('/(\d{4}-\d{2}-\d{2})/', $message, $matches)) {
            return Carbon::parse($matches[1]);
        }

        return null;
    }

    private function determinePeriod(string $message, ?Carbon $date = null): string
    {
        if (str_contains($message, 'today') || str_contains($message, 'আজ')) {
            return 'daily';
        }

        if (str_contains($message, 'week') || str_contains($message, 'সপ্তাহ')) {
            return 'weekly';
        }

        if (str_contains($message, 'year') || str_contains($message, 'বছর')) {
            return 'annual';
        }

        if ($date && $date->isToday()) {
            return 'daily';
        }

        return 'monthly';
    }

    private function inferCategory(string $message, ?string $type): ?string
    {
        foreach ($this->categoryCatalog($type) as $item) {
            foreach ($item['keywords'] as $keyword) {
                if (str_contains($message, mb_strtolower($keyword))) {
                    return $item['value'];
                }
            }
        }

        if ($type === 'saving') {
            return 'investment';
        }

        return null;
    }

    private function buildDescription(string $message, ?string $type, ?string $category): string
    {
        $clean = trim(preg_replace('/\s+/', ' ', $message));

        if ($clean !== '') {
            return mb_substr($clean, 0, 180);
        }

        $label = $category ?? 'entry';

        return match ($type) {
            'income' => "AI logged income: {$label}",
            'saving' => "AI logged investment: {$label}",
            default => "AI logged expense: {$label}",
        };
    }

    private function isTransactionPayloadComplete(array $payload): bool
    {
        return ! empty($payload['type'])
            && ! empty($payload['amount'])
            && ! empty($payload['category'])
            && ! empty($payload['date'])
            && ! empty($payload['period']);
    }

    private function allPayloadsComplete(array $payloads): bool
    {
        if ($payloads === []) {
            return false;
        }

        foreach ($payloads as $payload) {
            if (! $this->isTransactionPayloadComplete($payload)) {
                return false;
            }
        }

        return true;
    }

    private function createTransactionFromChat(int $userId, array $payload): Transaction
    {
        return Transaction::create([
            'user_id' => $userId,
            'type' => $payload['type'],
            'category' => $payload['category'],
            'amount' => (float) $payload['amount'],
            'description' => $payload['description'] ?? 'AI conversation entry',
            'date' => Carbon::parse($payload['date']),
            'period' => $payload['period'],
            'payment_method' => 'cash',
            'tags' => ['ai-entry'],
            'notes' => 'Added from AI conversation',
            'created_by_ai' => true,
        ]);
    }

    private function transactionResource(Transaction $transaction): array
    {
        return [
            'id' => $transaction->id,
            'type' => $transaction->type,
            'category' => $transaction->category,
            'amount' => $transaction->amount,
            'description' => $transaction->description,
            'date' => optional($transaction->date)->format('Y-m-d'),
        ];
    }

    private function buildSavedTransactionReply(Transaction $transaction, string $language): string
    {
        $typeLabel = match ($transaction->type) {
            'income' => $this->lang($language, 'income', 'income', 'income'),
            'saving' => $this->lang($language, 'investment', 'investment', 'investment'),
            default => $this->lang($language, 'expense', 'expense', 'expense'),
        };

        return match ($language) {
            'en' => "Done. I added your {$typeLabel} entry of {$transaction->amount} {$this->currencyLabel()} under {$transaction->category}. Say 'show history' whenever you want to review it.",
            'hi' => "Ho gaya. Maine {$transaction->amount} {$this->currencyLabel()} ka {$typeLabel} entry {$transaction->category} me add kar diya. History dekhni ho to boliye.",
            default => "হয়ে গেছে। আমি {$transaction->amount} {$this->currencyLabel()} এর {$typeLabel} entry {$transaction->category} category-তে যোগ করেছি। history দেখতে চাইলে বলুন।",
        };
    }

    private function buildMultiTransactionReply(Collection $transactions, string $language): string
    {
        $count = $transactions->count();
        $summary = $transactions
            ->map(fn (Transaction $transaction) => "{$transaction->category} {$transaction->amount}")
            ->implode(', ');

        return match ($language) {
            'en' => "Done. I added {$count} entries for you: {$summary}. Say 'show history' if you want to review them.",
            'hi' => "Ho gaya. Maine {$count} entries add kar di: {$summary}. History dekhni ho to boliye.",
            default => "হয়ে গেছে। আমি {$count}টি entry যোগ করেছি: {$summary}। history দেখতে চাইলে বলুন।",
        };
    }

    private function buildMissingDetailsReply(array $draft, string $language, array $categorySuggestions = []): string
    {
        if (empty($draft['type'])) {
            return match ($language) {
                'en' => 'Tell me first: is this income, expense, or investment?',
                'hi' => 'Pehle batayein: yeh income hai, expense hai, ya investment?',
                default => 'আগে বলুন, এটা আয়, খরচ, নাকি investment?',
            };
        }

        if (empty($draft['amount'])) {
            return match ($language) {
                'en' => 'Got it. What amount should I save for this entry?',
                'hi' => 'Theek hai. Is entry ka amount kitna hai?',
                default => 'ঠিক আছে। এই entry-র amount কত?',
            };
        }

        if (empty($draft['category'])) {
            $reply = match ($language) {
                'en' => 'I have the amount. Which category should I place it in?',
                'hi' => 'Amount mil gaya. Ise kis category me rakhu?',
                default => 'Amount পেয়েছি। এটা কোন category-তে রাখব?',
            };

            if ($categorySuggestions !== []) {
                $labels = collect($categorySuggestions)->pluck('label')->implode(', ');

                $reply .= ' '.$this->lang(
                    $language,
                    "চাইলে এগুলোর মধ্যে একটা বেছে নিতে পারেন: {$labels}.",
                    "You can also pick one of these: {$labels}.",
                    "Chahein to inmein se ek chun sakte hain: {$labels}."
                );
            }

            return $reply;
        }

        return match ($language) {
            'en' => 'One more thing: which date should I use for this transaction?',
            'hi' => 'Ek aur baat: is transaction ke liye kaunsi date use karun?',
            default => 'আরেকটা জিনিস বলুন: এই transaction-এর date কোনটা ধরব?',
        };
    }

    private function buildGeneralAssistantReply(string $language): string
    {
        return match ($language) {
            'en' => "I can add income, expense, or investment entries for you automatically. Try saying: 'Today I earned 200 taka', 'I spent 120 on food', 'I earned 200 and spent 50 on snacks', or 'show history'.",
            'hi' => "Main aapke liye income, expense, ya investment entry add kar sakta hoon. Aise boliye: 'Aaj 200 taka income hua', '120 taka food par kharch kiya', '200 kamaya aur 50 snacks par kharch kiya', ya 'history dikhao'.",
            default => "আমি আপনার জন্য income, expense, বা investment entry নিজে add করতে পারি। যেমন বলুন: 'আজ ২০০ টাকা আয় করেছি', 'আজ ১২০ টাকা খাবারে খরচ করেছি', 'আজ ২০০ টাকা আয় করেছি আর ৫০ টাকা নাস্তায় খরচ করেছি', বা 'history দেখাও'।",
        };
    }

    private function buildHistoryPayload(int $userId, string $language): array
    {
        $transactions = Transaction::forUser($userId)
            ->orderBy('date', 'desc')
            ->limit(10)
            ->get();

        $summary = [
            'count' => $transactions->count(),
            'income' => round($transactions->where('type', 'income')->sum('amount'), 2),
            'expense' => round($transactions->where('type', 'expense')->sum('amount'), 2),
            'saving' => round($transactions->where('type', 'saving')->sum('amount'), 2),
        ];

        $items = $transactions->map(fn (Transaction $transaction) => $this->transactionResource($transaction))
            ->values()
            ->all();

        $reply = match ($language) {
            'en' => $summary['count'] > 0
                ? "Here is your recent history. I found {$summary['count']} entries, with income {$summary['income']}, expense {$summary['expense']}, and investment {$summary['saving']}."
                : 'You do not have any saved history yet.',
            'hi' => $summary['count'] > 0
                ? "Yeh raha aapka recent history. Mujhe {$summary['count']} entries mili, income {$summary['income']}, expense {$summary['expense']}, aur investment {$summary['saving']}."
                : 'Abhi koi saved history nahi hai.',
            default => $summary['count'] > 0
                ? "এখানে আপনার recent history দেখাচ্ছি। মোট {$summary['count']}টি entry পেয়েছি। income {$summary['income']}, expense {$summary['expense']}, আর investment {$summary['saving']}।"
                : 'এখনও কোনো saved history নেই।',
        };

        return [
            'reply' => $reply,
            'items' => $items,
            'summary' => $summary,
        ];
    }

    private function currencyLabel(): string
    {
        return Auth::user()?->currency ?? 'TK';
    }

    private function getSidebarData($user): array
    {
        $stats = $this->financeService->getSummary((string) $user->id, 'monthly');
        $finScore = $this->aiService->calculateFinScore($user, $stats);
        $dailyLimit = $user->getDailyLimit();

        $monthlyIncome = max(1, $stats['monthly_income'] ?? $user->monthly_income ?? 1);
        $monthlyExpense = $stats['monthly_expense'] ?? 0;
        $savingsRate = $stats['savings_rate'] ?? 0;
        $netBalance = $monthlyIncome - $monthlyExpense;

        $name = $user->name ?? 'User';
        $currency = $user->currency ?? 'TK';

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
            $parts[] = "এই মাসের নিট ব্যালেন্স: +{$currency} " . round($netBalance, 0) . ".";
        } else {
            $parts[] = "আপনি এই মাসে {$currency} " . abs(round($netBalance, 0)) . " ঘাটতিতে আছেন।";
        }

        return [
            'fin_score' => $finScore,
            'daily_limit' => $dailyLimit,
            'insight' => implode(' ', $parts),
        ];
    }

    private function emptyTransactionDraft(): array
    {
        return [
            'type' => null,
            'amount' => null,
            'category' => null,
            'date' => null,
            'period' => null,
            'description' => null,
        ];
    }

    private function categorySuggestions(?string $type, string $message, string $language): array
    {
        $normalized = mb_strtolower($message);

        return collect($this->categoryCatalog($type))
            ->map(function (array $item) use ($normalized, $language) {
                $score = 0;

                foreach ($item['keywords'] as $keyword) {
                    if (str_contains($normalized, mb_strtolower($keyword))) {
                        $score += 3;
                    }
                }

                return [
                    'value' => $item['value'],
                    'label' => $item['labels'][$language] ?? $item['labels']['en'],
                    'score' => $score,
                ];
            })
            ->sortByDesc('score')
            ->take(6)
            ->map(fn (array $item) => [
                'value' => $item['value'],
                'label' => $item['label'],
            ])
            ->values()
            ->all();
    }

    private function categoryCatalog(?string $type): array
    {
        if ($type === 'income') {
            return [
                ['value' => 'salary', 'keywords' => ['salary', 'job', 'office', 'বেতন'], 'labels' => ['bn' => 'Salary', 'en' => 'Salary', 'hi' => 'Salary']],
                ['value' => 'freelance', 'keywords' => ['freelance', 'client', 'gig', 'ফ্রিল্যান্স'], 'labels' => ['bn' => 'Freelance', 'en' => 'Freelance', 'hi' => 'Freelance']],
                ['value' => 'business', 'keywords' => ['business', 'sale', 'customer', 'ব্যবসা'], 'labels' => ['bn' => 'Business', 'en' => 'Business', 'hi' => 'Business']],
                ['value' => 'investment', 'keywords' => ['profit', 'return', 'investment', 'লাভ'], 'labels' => ['bn' => 'Investment', 'en' => 'Investment', 'hi' => 'Investment']],
                ['value' => 'bonus', 'keywords' => ['bonus', 'reward'], 'labels' => ['bn' => 'Bonus', 'en' => 'Bonus', 'hi' => 'Bonus']],
                ['value' => 'gift', 'keywords' => ['gift', 'present', 'উপহার'], 'labels' => ['bn' => 'Gift', 'en' => 'Gift', 'hi' => 'Gift']],
            ];
        }

        return [
            ['value' => 'food', 'keywords' => ['food', 'meal', 'lunch', 'dinner', 'breakfast', 'restaurant', 'snacks', 'খাবার', 'নাস্তা'], 'labels' => ['bn' => 'Food', 'en' => 'Food', 'hi' => 'Food']],
            ['value' => 'transport', 'keywords' => ['transport', 'bus', 'uber', 'rickshaw', 'travel', 'যাতায়াত', 'ভাড়া'], 'labels' => ['bn' => 'Transport', 'en' => 'Transport', 'hi' => 'Transport']],
            ['value' => 'shopping', 'keywords' => ['shopping', 'dress', 'cloth', 'shirt', 'market', 'জামা'], 'labels' => ['bn' => 'Shopping', 'en' => 'Shopping', 'hi' => 'Shopping']],
            ['value' => 'utilities', 'keywords' => ['electricity', 'gas', 'bill', 'wifi', 'internet', 'বিল'], 'labels' => ['bn' => 'Utilities', 'en' => 'Utilities', 'hi' => 'Utilities']],
            ['value' => 'healthcare', 'keywords' => ['medicine', 'doctor', 'hospital', 'ওষধ', 'ডাক্তার'], 'labels' => ['bn' => 'Healthcare', 'en' => 'Healthcare', 'hi' => 'Healthcare']],
            ['value' => 'investment', 'keywords' => ['invest', 'investment', 'বিনিয়োগ'], 'labels' => ['bn' => 'Investment', 'en' => 'Investment', 'hi' => 'Investment']],
        ];
    }

    private function lang(string $language, string $bn, string $en, string $hi): string
    {
        return match ($language) {
            'en' => $en,
            'hi' => $hi,
            default => $bn,
        };
    }
}
