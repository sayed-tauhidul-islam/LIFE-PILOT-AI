<?php

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

        try {
            // Dispatch AI job (runs sync if QUEUE_CONNECTION=sync)
            ProcessAISuggestion::dispatch($userId);

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'এআই আপনার তথ্য বিশ্লেষণ করছে। পরামর্শ শীঘ্রই দেখা যাবে!',
                ]);
            }

            return back()->with('info', 'এআই বিশ্লেষণ শুরু হয়েছে। কয়েক সেকেন্ডে রিফ্রেশ করুন!');
        } catch (\Exception $e) {
            \Log::error('AI Generate Error: ' . $e->getMessage());

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'এআই তৈরি ব্যর্থ হয়েছে: ' . $e->getMessage(),
                ], 500);
            }

            return back()->with('error', 'এআই তৈরি ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
        }
    }

    public function getSuggestions(Request $request)
    {
        $userId = Auth::id();

        $suggestion = AISuggestion::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$suggestion) {
            return response()->json(['success' => false, 'message' => 'এখনো কোনো পরামর্শ নেই।']);
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
