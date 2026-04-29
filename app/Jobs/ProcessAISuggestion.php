<?php

namespace App\Jobs;

use App\Models\HealthProfile;
use App\Models\User;
use App\Services\AIService;
use App\Services\FinanceService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcessAISuggestion implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $userId)
    {
    }

    public function handle(AIService $aiService, FinanceService $financeService): void
    {
        $user = User::find($this->userId);

        if (!$user) {
            Log::warning('AI suggestion job skipped: user not found', ['user_id' => $this->userId]);
            return;
        }

        $stats = $financeService->getSummary((string) $user->id, 'monthly');
        $healthProfile = HealthProfile::where('user_id', $user->id)->first();

        $aiService->generateSuggestion($user, $stats, $healthProfile);
    }
}
