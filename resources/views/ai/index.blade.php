@extends('layouts.app')

@section('title', 'এআই আর্থিক উপদেষ্টা')
@section('page-title', 'এআই আর্থিক উপদেষ্টা')

@section('topbar-actions')
<button type="button" class="btn btn-outline btn-sm" id="history-toggle-btn">
    <i class="fas fa-clock-rotate-left"></i> History
</button>
@endsection

@section('content')
<style>
    .ai-shell {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 320px;
        gap: 20px;
        height: calc(100vh - 140px);
        min-height: 600px;
    }

    .ai-chat-card {
        border: 1px solid var(--border);
        border-radius: 20px;
        background: color-mix(in oklab, var(--surface) 94%, transparent);
        box-shadow: var(--card-shadow);
        backdrop-filter: blur(8px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .ai-chat-header {
        padding: 18px 22px;
        border-bottom: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        flex-wrap: wrap;
        flex-shrink: 0;
    }

    .ai-chat-title-wrap {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .ai-chat-avatar {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: linear-gradient(135deg, var(--primary), #8b5cf6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 18px;
        flex-shrink: 0;
    }

    .ai-chat-title {
        font-size: 16px;
        font-weight: 800;
        line-height: 1.2;
    }

    .ai-chat-status {
        font-size: 12px;
        color: var(--success);
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
    }

    .ai-chat-status::before {
        content: '';
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--success);
        animation: pulse-dot 2s infinite;
    }

    @keyframes pulse-dot {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
    }

    .ai-chat-tools {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .ai-select {
        border: 1px solid var(--border);
        border-radius: 10px;
        background: var(--surface);
        color: var(--dark);
        font: inherit;
        outline: none;
        min-width: 130px;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 600;
    }

    .ai-messages {
        flex: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        overflow-y: auto;
        background:
            radial-gradient(circle at top right, rgba(16, 185, 129, 0.04), transparent 22%),
            radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.04), transparent 24%);
    }

    .ai-bubble {
        max-width: min(82%, 640px);
        padding: 14px 16px;
        border-radius: 18px;
        line-height: 1.7;
        font-size: 14px;
        white-space: pre-wrap;
        word-break: break-word;
        position: relative;
        animation: bubble-in 0.25s ease;
    }

    @keyframes bubble-in {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .ai-bubble.assistant {
        background: linear-gradient(135deg, color-mix(in oklab, var(--primary) 10%, white), color-mix(in oklab, var(--info) 8%, white));
        border: 1px solid color-mix(in oklab, var(--primary) 15%, var(--border));
        color: var(--dark);
        border-top-left-radius: 4px;
        align-self: flex-start;
    }

    .ai-bubble.user {
        background: linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 72%, #ffffff));
        color: #fff;
        border-top-right-radius: 4px;
        align-self: flex-end;
        box-shadow: 0 10px 24px color-mix(in oklab, var(--primary) 22%, transparent);
    }

    .ai-bubble-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 11px;
        font-weight: 700;
        margin-bottom: 6px;
        opacity: 0.75;
    }

    .ai-bubble.user .ai-bubble-meta {
        color: rgba(255,255,255,0.9);
    }

    .ai-composer {
        padding: 14px 18px 18px;
        border-top: 1px solid var(--border);
        background: color-mix(in oklab, var(--surface) 96%, transparent);
        flex-shrink: 0;
    }

    .ai-chip-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 12px;
    }

    .ai-chip-row.suggestion-row {
        margin-top: 8px;
        min-height: 20px;
    }

    .ai-chip {
        border: 1px solid var(--border);
        border-radius: 999px;
        background: color-mix(in oklab, var(--surface) 90%, transparent);
        color: var(--dark);
        padding: 7px 12px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.18s ease;
        white-space: nowrap;
    }

    .ai-chip:hover {
        border-color: color-mix(in oklab, var(--primary) 40%, var(--border));
        color: var(--primary);
        transform: translateY(-1px);
    }

    .ai-suggestion-label {
        width: 100%;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--gray);
    }

    .ai-input-bar {
        display: flex;
        align-items: flex-end;
        gap: 10px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 6px 6px 6px 16px;
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    .ai-input-bar:focus-within {
        border-color: color-mix(in oklab, var(--primary) 50%, var(--border));
        box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 12%, transparent);
    }

    .ai-textinput {
        flex: 1;
        border: none;
        background: transparent;
        color: var(--dark);
        font: inherit;
        font-size: 14px;
        line-height: 1.5;
        padding: 10px 0;
        max-height: 120px;
        resize: none;
        outline: none;
    }

    .ai-textinput::placeholder {
        color: var(--gray);
    }

    .ai-input-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
        padding-bottom: 4px;
    }

    .ai-icon-btn {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        border: none;
        background: transparent;
        color: var(--gray);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 15px;
        transition: all 0.18s ease;
    }

    .ai-icon-btn:hover {
        background: color-mix(in oklab, var(--primary) 10%, transparent);
        color: var(--primary);
    }

    .ai-icon-btn.voice-btn {
        color: var(--primary);
    }

    .ai-icon-btn.voice-btn:hover {
        background: color-mix(in oklab, var(--primary) 18%, transparent);
    }

    .ai-icon-btn.voice-btn.listening {
        background: var(--danger);
        color: #fff;
        animation: voice-pulse 1.2s infinite;
    }

    @keyframes voice-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
        50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
    }

    .ai-send-btn {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        border: none;
        background: var(--primary);
        color: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.18s ease;
    }

    .ai-send-btn:hover:not(:disabled) {
        background: var(--primary-dark);
        transform: translateY(-1px);
    }

    .ai-send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .ai-composer-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        padding: 0 4px;
    }

    .ai-mode-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px;
        border-radius: 999px;
        background: color-mix(in oklab, var(--surface) 90%, transparent);
        border: 1px solid var(--border);
        font-size: 11px;
        font-weight: 700;
        color: var(--gray);
        cursor: pointer;
        user-select: none;
    }

    .ai-mode-pill input {
        accent-color: var(--primary);
        width: 14px;
        height: 14px;
        margin: 0;
        cursor: pointer;
    }

    .ai-loader-bar {
        display: none;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        font-weight: 700;
        color: var(--gray);
    }

    .ai-loader-bar.show {
        display: inline-flex;
    }

    .ai-dot-flux {
        display: flex;
        gap: 4px;
    }

    .ai-dot-flux span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--primary);
        animation: flux 1.4s infinite ease-in-out both;
    }

    .ai-dot-flux span:nth-child(1) { animation-delay: -0.32s; }
    .ai-dot-flux span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes flux {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }

    .ai-side-card {
        padding: 20px;
        display: grid;
        gap: 18px;
        align-self: start;
        position: sticky;
        top: 94px;
        border: 1px solid var(--border);
        border-radius: 20px;
        background: color-mix(in oklab, var(--surface) 92%, transparent);
        box-shadow: var(--card-shadow);
        backdrop-filter: blur(8px);
    }

    .ai-panel-title {
        font-size: 11px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--gray);
        font-weight: 800;
        margin-bottom: 8px;
    }

    .ai-stat-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }

    .ai-stat-box {
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 14px;
        background: color-mix(in oklab, var(--surface) 88%, transparent);
        transition: transform 0.18s ease;
    }

    .ai-stat-box:hover {
        transform: translateY(-2px);
    }

    .ai-stat-value {
        font-size: 20px;
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 5px;
    }

    .ai-stat-label {
        font-size: 11px;
        color: var(--gray);
        font-weight: 700;
    }

    .ai-summary-box {
        border-radius: 14px;
        padding: 14px;
        background: linear-gradient(135deg, color-mix(in oklab, var(--primary) 10%, white), color-mix(in oklab, var(--success) 10%, white));
        border: 1px solid color-mix(in oklab, var(--primary) 18%, var(--border));
        line-height: 1.7;
        font-size: 13px;
    }

    .ai-history-panel {
        display: none;
        border-top: 1px solid var(--border);
        padding: 18px 20px 20px;
        background: color-mix(in oklab, var(--surface) 96%, transparent);
        flex-shrink: 0;
        max-height: 280px;
        overflow-y: auto;
    }

    .ai-history-panel.open {
        display: block;
    }

    .ai-history-summary {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 14px;
    }

    .ai-history-item {
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 12px 14px;
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
        background: color-mix(in oklab, var(--surface) 92%, transparent);
    }

    .ai-history-empty {
        border: 1px dashed var(--border);
        border-radius: 14px;
        padding: 28px 16px;
        text-align: center;
        color: var(--gray);
        font-size: 13px;
    }

    .ai-empty-state {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        color: var(--gray);
        padding: 40px 20px;
    }

    .ai-empty-state i {
        font-size: 48px;
        opacity: 0.3;
    }

    .ai-empty-state p {
        font-size: 14px;
        text-align: center;
        max-width: 300px;
        line-height: 1.6;
    }

    @media (max-width: 1080px) {
        .ai-shell {
            grid-template-columns: 1fr;
            height: auto;
            min-height: auto;
        }

        .ai-chat-card {
            min-height: 70vh;
        }

        .ai-side-card {
            position: static;
        }
    }

    @media (max-width: 720px) {
        .ai-chat-header {
            padding: 14px 16px;
        }

        .ai-messages {
            padding: 14px;
        }

        .ai-bubble {
            max-width: 92%;
        }

        .ai-composer {
            padding: 12px 14px 14px;
        }

        .ai-history-summary,
        .ai-stat-grid {
            grid-template-columns: 1fr;
        }
    }
</style>

@php
    $currency = auth()->user()->currency ?? 'TK';
    $latestSummary = $latestSuggestion->suggestion_data['financial_health_summary'] ?? 'আপনার AI workspace এখন সক্রিয়। income, expense, investment, বা history নিয়ে কথা বলুন — আমি সাহায্য করব।';
    $latestFinScore = $latestSuggestion->fin_score ?? 0;
    $historySeed = $recentTransactions->map(function ($transaction) {
        return [
            'id' => $transaction->id,
            'type' => $transaction->type,
            'category' => $transaction->category,
            'description' => $transaction->description,
            'amount' => $transaction->amount,
            'date' => optional($transaction->date)->format('Y-m-d'),
        ];
    })->values();
@endphp

<div class="ai-shell">
    <div class="ai-chat-card">
        <div class="ai-chat-header">
            <div class="ai-chat-title-wrap">
                <!-- avatar removed as requested -->
                <div>
                    <div class="ai-chat-title">AI Financial Assistant</div>
                    <div class="ai-chat-status">Online</div>
                </div>
            </div>

            <div class="ai-chat-tools">
                <select id="chat-language" class="ai-select">
                    <option value="bn">Bangla</option>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                </select>
            </div>
        </div>

        <div class="ai-messages" id="ai-messages">
            <div class="ai-empty-state">
                <i class="fas fa-robot"></i>
                <p>AI Financial Assistant is ready. Type a message to start — e.g. "আজ ২০০ টাকা খরচ করেছি" or "show history".</p>
            </div>
        </div>

        <div class="ai-history-panel" id="ai-history-panel">
            <div class="ai-panel-title">History</div>
            <div class="ai-history-summary" id="ai-history-summary"></div>
            <div id="ai-history-list"></div>
        </div>

        <div class="ai-composer">
            <div class="ai-chip-row" id="quick-chips">
                <!-- suggestion chips removed per user request -->
            </div>

            <div class="ai-chip-row suggestion-row" id="category-suggestion-row"></div>

            <div class="ai-input-bar">
                <textarea id="chat-message" class="ai-textinput" rows="1" placeholder="Type a message..."></textarea>
                <div class="ai-input-actions">
                    <button type="button" class="ai-icon-btn voice-btn" id="voice-button" title="Voice input">
                        <i class="fas fa-microphone"></i>
                    </button>
                    <button type="button" class="ai-send-btn" id="send-chat-btn" title="Send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>

            <div class="ai-composer-footer">
                <label class="ai-mode-pill" title="AI voice reply">
                    <input type="checkbox" id="voice-mode">
                    <span>Voice reply</span>
                </label>
                <div class="ai-loader-bar" id="ai-loader">
                    <div class="ai-dot-flux">
                        <span></span><span></span><span></span>
                    </div>
                    <span>AI ভাবছে...</span>
                </div>
            </div>
        </div>
    </div>

    <div class="ai-side-card">
        <div>
            <div class="ai-panel-title">Latest Insight</div>
            <div class="ai-summary-box" id="latest-insight">{{ $latestSummary }}</div>
        </div>

        <div>
            <div class="ai-panel-title">Snapshot</div>
            <div class="ai-stat-grid">
                <div class="ai-stat-box">
                    <div class="ai-stat-value" id="fin-score-display">{{ $latestFinScore }}/100</div>
                    <div class="ai-stat-label">FinScore</div>
                </div>
                <div class="ai-stat-box">
                    <div class="ai-stat-value" id="daily-limit-display">{{ $currency }}{{ number_format($latestSuggestion->daily_limit ?? 0, 0) }}</div>
                    <div class="ai-stat-label">Daily Limit</div>
                </div>
                <div class="ai-stat-box">
                    <div class="ai-stat-value">{{ count($suggestions) }}</div>
                    <div class="ai-stat-label">AI Runs</div>
                </div>
                <div class="ai-stat-box">
                    <div class="ai-stat-value">{{ $recentTransactions->count() }}</div>
                    <div class="ai-stat-label">Recent Entries</div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    const aiMessages = document.getElementById('ai-messages');
    const chatMessage = document.getElementById('chat-message');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const voiceButton = document.getElementById('voice-button');
    const historyToggleBtn = document.getElementById('history-toggle-btn');
    const historyPanel = document.getElementById('ai-history-panel');
    const historySummary = document.getElementById('ai-history-summary');
    const historyList = document.getElementById('ai-history-list');
    const languageSelect = document.getElementById('chat-language');
    const voiceMode = document.getElementById('voice-mode');
    const aiLoader = document.getElementById('ai-loader');
    const categorySuggestionRow = document.getElementById('category-suggestion-row');
    const finScoreDisplay = document.getElementById('fin-score-display');
    const dailyLimitDisplay = document.getElementById('daily-limit-display');
    const latestInsight = document.getElementById('latest-insight');
    const initialHistory = @json($historySeed);

    function appendBubble(role, message) {
        const bubble = document.createElement('div');
        bubble.className = `ai-bubble ${role}`;
        bubble.innerHTML = `
            <div class="ai-bubble-meta">
                <i class="fas ${role === 'assistant' ? 'fa-robot' : 'fa-user'}"></i>
                <span>${role === 'assistant' ? 'AI Assistant' : 'You'}</span>
            </div>
            ${message.replace(/</g, '<').replace(/>/g, '>')}
        `;
        aiMessages.appendChild(bubble);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    function setLoading(state) {
        aiLoader.classList.toggle('show', state);
        sendChatBtn.disabled = state;
        voiceButton.disabled = state;
    }

    function renderCategorySuggestions(suggestions = []) {
        categorySuggestionRow.innerHTML = '';

        if (!suggestions.length) {
            return;
        }

        const label = document.createElement('div');
        label.className = 'ai-suggestion-label';
        label.textContent = 'Quick categories';
        categorySuggestionRow.appendChild(label);

        suggestions.forEach((suggestion) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'ai-chip';
            button.textContent = suggestion.label;
            button.dataset.value = suggestion.value;
            button.addEventListener('click', () => {
                chatMessage.value = suggestion.value;
                sendChatMessage(suggestion.value);
            });
            categorySuggestionRow.appendChild(button);
        });
    }

    function languageSpeechCode() {
        return {
            bn: 'bn-BD',
            en: 'en-US',
            hi: 'hi-IN',
        }[languageSelect.value] || 'bn-BD';
    }

    function speakReply(message) {
        if (!voiceMode.checked || !('speechSynthesis' in window)) return;

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = languageSpeechCode();
        utterance.rate = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }

    function updateSidebar(data) {
        if (data.fin_score !== undefined) {
            finScoreDisplay.textContent = `${data.fin_score}/100`;
        }
        if (data.daily_limit !== undefined) {
            dailyLimitDisplay.textContent = `{{ $currency }}${Math.round(data.daily_limit)}`;
        }
        if (data.insight !== undefined) {
            latestInsight.textContent = data.insight;
        }
    }

    function renderHistory(items, summary = null) {
        historyPanel.classList.add('open');
        historySummary.innerHTML = '';
        historyList.innerHTML = '';

        const stats = summary || {
            count: items.length,
            income: items.filter((item) => item.type === 'income').reduce((sum, item) => sum + Number(item.amount), 0),
            expense: items.filter((item) => item.type === 'expense').reduce((sum, item) => sum + Number(item.amount), 0),
            saving: items.filter((item) => item.type === 'saving').reduce((sum, item) => sum + Number(item.amount), 0),
        };

        [
            { label: 'Entries', value: stats.count ?? items.length },
            { label: 'Income', value: `{{ $currency }}${Math.round(stats.income ?? 0)}` },
            { label: 'Expense', value: `{{ $currency }}${Math.round(stats.expense ?? 0)}` },
        ].forEach((item) => {
            const box = document.createElement('div');
            box.className = 'ai-stat-box';
            box.innerHTML = `
                <div class="ai-stat-value">${item.value}</div>
                <div class="ai-stat-label">${item.label}</div>
            `;
            historySummary.appendChild(box);
        });

        if (!items.length) {
            historyList.innerHTML = '<div class="ai-history-empty">এখনও কোনো saved history নেই।</div>';
            return;
        }

        items.forEach((item) => {
            const row = document.createElement('div');
            row.className = 'ai-history-item';
            row.innerHTML = `
                <div>
                    <div style="font-size:13px;font-weight:800;margin-bottom:4px;">${item.description}</div>
                    <div style="font-size:11px;color:var(--gray);">${item.category} &bull; ${item.date}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:13px;font-weight:800;">{{ $currency }}${Math.round(Number(item.amount))}</div>
                    <div style="font-size:11px;color:var(--gray);text-transform:capitalize;">${item.type}</div>
                </div>
            `;
            historyList.appendChild(row);
        });
    }

    async function fetchHistory() {
        try {
            const data = await apiCall(`/ai/history?language=${languageSelect.value}`);
            if (data.success) {
                renderCategorySuggestions([]);
                renderHistory(data.history || [], data.summary || null);
                appendBubble('assistant', data.reply);
                speakReply(data.reply);
            }
        } catch (error) {
            showToast('History load করা যায়নি।', 'danger');
        }
    }

    async function sendChatMessage(forcedMessage = null) {
        const message = (forcedMessage ?? chatMessage.value).trim();
        if (!message) {
            showToast('আগে message লিখুন।', 'warning');
            return;
        }

        appendBubble('user', message);
        if (!forcedMessage) {
            chatMessage.value = '';
            chatMessage.style.height = 'auto';
        }

        renderCategorySuggestions([]);
        setLoading(true);

        try {
                // include auto_save flag if Auto AI Add toggle is enabled in dashboard (localStorage)
                const autoSave = localStorage.getItem('lp.autoAiAdd') === '1';
                const response = await apiCall('/ai/chat', 'POST', {
                    message,
                    language: languageSelect.value,
                    auto_save: autoSave,
                });

            if (response.reply) {
                appendBubble('assistant', response.reply);
                speakReply(response.reply);
            }

            renderCategorySuggestions(response.category_suggestions || []);

            if (response.show_history && response.history) {
                renderHistory(response.history, response.summary || null);
            }

            if (response.transaction_saved) {
                showToast(response.transaction_count > 1 ? 'AI multiple entries add করেছে।' : 'AI entry add করেছে।', 'success');
            }

            // Update sidebar stats if provided
            if (response.fin_score !== undefined || response.daily_limit !== undefined || response.insight !== undefined) {
                updateSidebar(response);
            }
        } catch (error) {
            showToast(error.message || 'AI response পাওয়া যায়নি।', 'danger');
        } finally {
            setLoading(false);
        }
    }

    sendChatBtn.addEventListener('click', () => sendChatMessage());

    chatMessage.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendChatMessage();
        }
    });

    // Auto-resize textarea
    chatMessage.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    document.querySelectorAll('.ai-chip[data-prompt]').forEach((chip) => {
        chip.addEventListener('click', () => {
            chatMessage.value = chip.dataset.prompt;
            chatMessage.style.height = 'auto';
            chatMessage.style.height = Math.min(chatMessage.scrollHeight, 120) + 'px';
            sendChatMessage(chip.dataset.prompt);
        });
    });

    if (initialHistory.length) {
        renderHistory(initialHistory);
        historyPanel.classList.remove('open');
    }

    // Voice recognition
    let recognitionInstance = null;

    voiceButton.addEventListener('click', () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            showToast('এই browser-এ voice input supported নয়।', 'danger');
            return;
        }

        // Stop if already listening
        if (voiceButton.classList.contains('listening') && recognitionInstance) {
            recognitionInstance.stop();
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = languageSpeechCode();
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;
        recognitionInstance = recognition;

        voiceButton.classList.add('listening');
        voiceButton.querySelector('i').className = 'fas fa-stop';
        voiceButton.title = 'Stop listening';

        let finalTranscript = '';

        recognition.onresult = (event) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interim += transcript;
                }
            }
            chatMessage.value = finalTranscript + interim;
            chatMessage.style.height = 'auto';
            chatMessage.style.height = Math.min(chatMessage.scrollHeight, 120) + 'px';
        };

        recognition.onerror = (event) => {
            console.error('Voice error:', event.error);
            if (event.error !== 'aborted') {
                showToast('Voice input ঠিকমতো কাজ করেনি। আবার চেষ্টা করুন।', 'warning');
            }
        };

        recognition.onend = () => {
            voiceButton.classList.remove('listening');
            voiceButton.querySelector('i').className = 'fas fa-microphone';
            voiceButton.title = 'Voice input';
            recognitionInstance = null;

            if (finalTranscript.trim()) {
                // include auto_save when sending from voice too
                const prevAuto = localStorage.getItem('lp.autoAiAdd') === '1';
                if (prevAuto) {
                    // send directly (sendChatMessage will read localStorage too)
                    sendChatMessage(finalTranscript.trim());
                } else {
                    sendChatMessage(finalTranscript.trim());
                }
            }
        };

        recognition.start();
    });

    historyToggleBtn.addEventListener('click', fetchHistory);
</script>
@endpush

