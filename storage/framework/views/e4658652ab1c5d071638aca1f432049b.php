

<?php $__env->startSection('title', 'ড্যাশবোর্ড'); ?>
<?php $__env->startSection('page-title', 'আর্থিক ড্যাশবোর্ড'); ?>

<?php $__env->startSection('topbar-actions'); ?>
<a href="<?php echo e(route('transactions.create')); ?>" class="btn btn-primary btn-sm">
    <i class="fas fa-plus"></i> লেনদেন যোগ করুন
</a>
<button onclick="generateAI()" class="btn btn-outline btn-sm" id="ai-generate-btn">
    <i class="fas fa-robot"></i> এআই রিফ্রেশ
</button>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>


<style>
    .dash-hero {
        background: var(--dash-hero-bg);
        border-radius: 16px;
        padding: 34px;
        margin-bottom: 24px;
        position: relative;
        overflow: hidden;
        color: var(--dash-hero-text);
        border: 1px solid var(--dash-hero-pill-border);
        animation: hero-enter 0.65s ease;
    }
    .dash-hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: linear-gradient(var(--dash-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--dash-grid-line) 1px, transparent 1px);
        background-size: 36px 36px;
        opacity: 0.2;
        animation: grid-move 18s linear infinite;
    }
    .dash-hero::after {
        content: '';
        position: absolute;
        top: -22%;
        right: -8%;
        width: 280px;
        height: 280px;
        border-radius: 50%;
        background: radial-gradient(circle, color-mix(in oklab, var(--dash-hero-text) 24%, transparent) 0%, transparent 68%);
    }
    .dash-hero-inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        flex-wrap: wrap;
    }
    .dash-hero-greeting {
        font-size: clamp(26px, 3vw, 38px);
        font-weight: 800;
        letter-spacing: -0.02em;
        margin-bottom: 10px;
        line-height: 1.2;
    }
    .dash-hero-sub {
        font-size: 14px;
        color: var(--dash-hero-sub);
        line-height: 1.7;
        margin-bottom: 8px;
    }
    .dash-hero-date {
        font-size: 12px;
        color: var(--dash-hero-sub);
    }
    .dash-hero-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 14px;
    }
    .dash-quick-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 11px;
        font-weight: 700;
        border-radius: 999px;
        padding: 6px 12px;
        background: var(--dash-hero-pill-bg);
        border: 1px solid var(--dash-hero-pill-border);
        color: var(--dash-hero-pill-text);
        backdrop-filter: blur(6px);
    }
    .dash-hero-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        align-self: center;
    }
    .dash-btn-glass {
        background: var(--dash-glass-bg);
        color: var(--dash-hero-pill-text);
        padding: 11px 20px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        border: 1px solid var(--dash-glass-border);
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        text-decoration: none;
    }
    .dash-btn-glass:hover {
        transform: translateY(-2px) scale(1.01);
        background: var(--dash-glass-bg-hover);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    }

    .dash-period-bar {
        display: flex;
        gap: 6px;
        margin-bottom: 22px;
        padding: 6px;
        border-radius: 14px;
        width: fit-content;
        border: 1px solid var(--border);
        background: color-mix(in oklab, var(--surface) 88%, transparent);
        backdrop-filter: blur(6px);
    }
    .dash-period-pill {
        padding: 8px 18px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        border: none;
        background: transparent;
        color: var(--gray);
        transition: all 0.22s ease;
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .dash-period-pill:hover {
        background: var(--light);
        color: var(--dark);
    }
    .dash-period-pill.active {
        background: var(--primary);
        color: #fff;
        box-shadow: 0 8px 18px color-mix(in oklab, var(--primary) 36%, transparent);
    }

    .dash-title-icon {
        width: 28px;
        height: 28px;
        border-radius: 9px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        background: linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 72%, #ffffff));
        color: #fff;
        box-shadow: 0 6px 14px color-mix(in oklab, var(--primary) 35%, transparent);
    }

    .dash-stat-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
    }
    .dash-stat-icon.balance {
        background: color-mix(in oklab, var(--primary) 18%, transparent);
        color: var(--primary);
    }
    .dash-stat-icon.income {
        background: color-mix(in oklab, var(--success) 18%, transparent);
        color: var(--success);
    }
    .dash-stat-icon.expense {
        background: color-mix(in oklab, var(--danger) 18%, transparent);
        color: var(--danger);
    }
    .dash-stat-icon.saving {
        background: color-mix(in oklab, var(--info) 18%, transparent);
        color: var(--info);
    }

    .dash-stat-card {
        background: color-mix(in oklab, var(--surface) 92%, transparent);
        border-radius: 14px;
        padding: 20px;
        box-shadow: var(--card-shadow);
        border: 1px solid var(--border);
        backdrop-filter: blur(8px);
        position: relative;
        overflow: hidden;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
    }
    .dash-stat-card:hover {
        transform: translateY(-5px) scale(1.01);
        box-shadow: 0 18px 35px rgba(0, 0, 0, 0.24);
    }
    .dash-stat-card::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 4px;
    }
    .dash-stat-card.income::after { background: linear-gradient(90deg, var(--success), color-mix(in oklab, var(--success) 72%, #ffffff)); }
    .dash-stat-card.expense::after { background: linear-gradient(90deg, var(--danger), color-mix(in oklab, var(--danger) 72%, #ffffff)); }
    .dash-stat-card.saving::after { background: linear-gradient(90deg, var(--info), color-mix(in oklab, var(--info) 72%, #ffffff)); }
    .dash-stat-card.balance::after { background: linear-gradient(90deg, var(--primary), color-mix(in oklab, var(--primary) 72%, #ffffff)); }
    .dash-stat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
    }
    .dash-stat-trend {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 700;
    }
    .dash-stat-trend.up {
        background: rgba(34, 197, 94, 0.14);
        color: #22c55e;
    }
    .dash-stat-trend.down {
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
    }

    .dash-advisor-row {
        display: grid;
        grid-template-columns: 1.6fr 1fr;
        gap: 16px;
        margin-bottom: 24px;
    }
    .dash-ai-card {
        background: var(--dash-ai-bg);
        border-radius: 16px;
        padding: 26px;
        border: 1px solid var(--dash-ai-border);
        color: var(--dash-ai-text);
        position: relative;
        overflow: hidden;
        box-shadow: 0 18px 35px rgba(0, 0, 0, 0.32);
    }
    .dash-ai-card::before {
        content: '';
        position: absolute;
        top: -45%;
        right: -18%;
        width: 280px;
        height: 280px;
        border-radius: 50%;
        background: radial-gradient(circle, color-mix(in oklab, var(--dash-ai-text) 20%, transparent), transparent 72%);
    }
    .dash-ai-inner {
        position: relative;
        z-index: 1;
    }
    .dash-ai-badge {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 5px 11px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        color: var(--dash-ai-muted);
        border: 1px solid var(--dash-ai-border);
        background: var(--dash-ai-panel);
        margin-bottom: 14px;
    }
    .dash-ai-limit {
        font-size: clamp(28px, 4vw, 38px);
        line-height: 1.1;
        font-weight: 800;
        letter-spacing: -0.03em;
        margin-bottom: 6px;
    }
    .dash-ai-limit-label {
        font-size: 12px;
        font-weight: 700;
        color: var(--dash-ai-muted);
        margin-bottom: 14px;
    }
    .dash-ai-summary {
        font-size: 13px;
        line-height: 1.75;
        color: var(--dash-ai-text);
        background: var(--dash-ai-panel);
        border-radius: 12px;
        padding: 14px;
        margin-bottom: 14px;
        border-left: 3px solid var(--dash-ai-border);
    }
    .dash-ai-tip {
        padding: 11px 13px;
        border-radius: 10px;
        margin-bottom: 8px;
        background: var(--dash-ai-panel);
        font-size: 13px;
        line-height: 1.7;
        transition: transform 0.16s ease, background 0.16s ease;
    }
    .dash-ai-tip:hover {
        transform: translateX(4px);
        background: color-mix(in oklab, var(--dash-ai-panel) 70%, var(--dash-ai-text));
    }
    .dash-ai-time {
        margin-top: 14px;
        font-size: 11px;
        color: var(--dash-ai-muted);
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .dash-ai-plan-title {
        font-size: 14px;
        font-weight: 700;
        color: var(--dash-ai-muted);
        margin-bottom: 10px;
    }
    .dash-ai-plan-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
    }
    .dash-ai-plan-item {
        background: var(--dash-ai-panel);
        border-radius: 8px;
        padding: 10px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .dash-ai-plan-label {
        font-size: 12px;
        color: color-mix(in oklab, var(--dash-ai-text) 86%, transparent);
    }
    .dash-ai-plan-amount {
        font-size: 13px;
        font-weight: 700;
        color: color-mix(in oklab, var(--dash-ai-text) 90%, transparent);
    }
    .dash-ai-plan-amount.ok {
        color: var(--success);
    }
    .dash-ai-plan-amount.over {
        color: var(--danger);
    }
    .dash-ai-saving-row {
        background: color-mix(in oklab, var(--success) 18%, transparent);
        border-radius: 8px;
        padding: 10px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        grid-column: span 2;
    }
    .dash-ai-saving-label {
        font-size: 12px;
        color: var(--success);
        font-weight: 700;
    }
    .dash-ai-saving-value {
        font-size: 14px;
        font-weight: 800;
        color: var(--success);
    }
    .dash-ai-rule {
        font-size: 11px;
        color: var(--dash-ai-muted);
        margin-top: 8px;
        line-height: 1.5;
    }

    .dash-finscore-card {
        background: color-mix(in oklab, var(--surface) 90%, transparent);
        border-radius: 16px;
        border: 1px solid var(--border);
        padding: 26px;
        text-align: center;
        backdrop-filter: blur(8px);
        box-shadow: var(--card-shadow);
    }
    .dash-finscore-title {
        font-size: 16px;
        font-weight: 800;
        margin-bottom: 18px;
    }
    .dash-finscore-ring {
        position: relative;
        width: 160px;
        height: 160px;
        margin: 0 auto 16px;
    }
    .dash-finscore-value {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .dash-finscore-number {
        font-size: 38px;
        font-weight: 800;
        line-height: 1;
    }
    .dash-finscore-max,
    .dash-finscore-label {
        font-size: 12px;
        color: var(--gray);
        font-weight: 600;
    }
    .dash-finscore-status {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 6px;
    }

    .dash-charts-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 16px;
        margin-bottom: 24px;
    }
    .dash-chart-card,
    .dash-table-card {
        background: color-mix(in oklab, var(--surface) 92%, transparent);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 22px;
        box-shadow: var(--card-shadow);
        backdrop-filter: blur(8px);
    }
    .dash-chart-header,
    .dash-table-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
        flex-wrap: wrap;
    }
    .dash-chart-title,
    .dash-table-title {
        font-size: 16px;
        font-weight: 800;
        line-height: 1.4;
    }
    .dash-chart-controls {
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    .dash-chart-select {
        font-size: 12px;
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--dark);
        font-weight: 700;
        outline: none;
    }
    .dash-chart-toggle {
        border: 1px solid var(--border);
        border-radius: 8px;
        background: transparent;
        color: var(--gray);
        padding: 6px 10px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .dash-chart-toggle.active,
    .dash-chart-toggle:hover {
        color: #fff;
        background: var(--primary);
        border-color: var(--primary);
    }

    .dash-budget-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 14px;
    }
    .dash-budget-item {
        padding: 16px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: color-mix(in oklab, var(--surface) 88%, transparent);
        transition: transform 0.18s ease, box-shadow 0.18s ease;
    }
    .dash-budget-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.17);
    }
    .dash-budget-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    .dash-budget-cat {
        font-size: 13px;
        font-weight: 700;
    }
    .dash-budget-pct {
        font-size: 11px;
        font-weight: 700;
        border-radius: 999px;
        padding: 3px 9px;
    }
    .dash-budget-amounts {
        margin-top: 9px;
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: var(--gray);
    }

    .dash-anomaly-card {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        padding: 15px 16px;
        border-radius: 12px;
        border: 1px solid rgba(245, 158, 11, 0.45);
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.1));
        margin-bottom: 10px;
        transition: transform 0.16s ease;
    }
    .dash-anomaly-card:hover {
        transform: translateX(4px);
    }
    .dash-anomaly-msg {
        font-size: 13px;
        font-weight: 700;
        line-height: 1.6;
    }
    .dash-anomaly-meta {
        font-size: 11px;
        color: var(--gray);
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .dash-transactions-tools {
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    .dash-filter-input {
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--surface);
        color: var(--dark);
        padding: 7px 10px;
        font-size: 12px;
        min-width: 170px;
    }
    .dash-filter-input::placeholder {
        color: var(--gray);
    }

    .progress-fill {
        transition: width 1.1s cubic-bezier(0.22, 1, 0.36, 1);
    }

    @keyframes hero-enter {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes grid-move {
        from { transform: translateX(0); }
        to { transform: translateX(-36px); }
    }

    @media (max-width: 1024px) {
        .dash-advisor-row,
        .dash-charts-grid {
            grid-template-columns: 1fr;
        }
    }
    @media (max-width: 768px) {
        .dash-hero {
            padding: 24px 20px;
        }
        .dash-hero-inner {
            flex-direction: column;
            align-items: flex-start;
        }
        .dash-period-bar {
            width: 100%;
            overflow-x: auto;
        }
        .dash-chart-controls,
        .dash-transactions-tools {
            width: 100%;
            justify-content: flex-start;
        }
        .dash-filter-input {
            min-width: 0;
            width: 100%;
        }
    }
</style>

<?php
    $catLabels = array_merge(\App\Models\Transaction::expenseCategories(), \App\Models\Transaction::incomeCategories());
    $typeLabels = ['income'=>'আয়','expense'=>'খরচ','saving'=>'সঞ্চয়'];
    $periodLabels = ['daily'=>'দৈনিক','weekly'=>'সাপ্তাহিক','monthly'=>'মাসিক','annual'=>'বার্ষিক'];
?>




<div class="dash-hero">
    <div class="dash-hero-inner">
        <div>
            <div class="dash-hero-greeting">শুভেচ্ছা, <?php echo e($user->name); ?>! 👋</div>
            <div class="dash-hero-sub">আজকের আর্থিক অবস্থার মূল তথ্য এক নজরে দেখুন, তারপর নিচের action দিয়ে দ্রুত update করুন।</div>
            <div class="dash-hero-date"><i class="far fa-calendar-alt"></i> <?php echo e(now()->translatedFormat('l, d F Y')); ?></div>
            <div class="dash-hero-pills">
                <span class="dash-quick-pill"><i class="fas fa-wallet"></i> Today: <?php echo e($user->currency); ?><?php echo e(number_format($todayStats['net_balance'] ?? 0, 0)); ?></span>
                <span class="dash-quick-pill"><i class="fas fa-chart-line"></i> Month trend: <?php echo e($monthStats['net_balance'] >= 0 ? 'Positive' : 'Negative'); ?></span>
                <span class="dash-quick-pill"><i class="fas fa-shield-heart"></i> FinScore: <?php echo e($finScore); ?>/100</span>
            </div>
        </div>
        <div class="dash-hero-actions">
            <a href="<?php echo e(route('transactions.create')); ?>" class="dash-btn-glass">
                <i class="fas fa-plus-circle"></i> লেনদেন যোগ করুন
            </a>
            <button onclick="generateAI()" class="dash-btn-glass" id="ai-generate-btn-hero">
                <i class="fas fa-robot"></i> এআই রিফ্রেশ
            </button>
        </div>
    </div>
</div>




<div class="dash-period-bar">
    <?php $__currentLoopData = ['daily', 'weekly', 'monthly', 'annual']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $p): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <button onclick="switchPeriod('<?php echo e($p); ?>')"
            class="dash-period-pill <?php echo e($p === 'monthly' ? 'active' : ''); ?>"
            id="period-btn-<?php echo e($p); ?>">
            <?php echo e($periodLabels[$p]); ?>

        </button>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</div>




<div class="stat-grid" id="stats-grid">
    
    <div class="dash-stat-card balance">
        <div class="dash-stat-header">
            <div class="dash-stat-icon balance">
                <i class="fas fa-balance-scale"></i>
            </div>
            <?php if($monthStats['net_balance'] >= 0): ?>
                <div class="dash-stat-trend up"><i class="fas fa-arrow-up" style="font-size:9px;"></i> 3 month trend up</div>
            <?php else: ?>
                <div class="dash-stat-trend down"><i class="fas fa-arrow-down" style="font-size:9px;"></i> 3 month trend down</div>
            <?php endif; ?>
        </div>
        <div class="stat-label">নিট ব্যালেন্স</div>
        <div class="stat-value" id="stat-balance"
            style="color:<?php echo e($monthStats['net_balance'] >= 0 ? 'var(--success)' : 'var(--danger)'); ?>">
            <?php echo e($user->currency); ?><?php echo e(number_format($monthStats['net_balance'], 0)); ?>

        </div>
        <div class="stat-sub">গত ৩ মাসের net অবস্থার সারাংশ</div>
    </div>

    
    <div class="dash-stat-card income">
        <div class="dash-stat-header">
            <div class="dash-stat-icon income">
                <i class="fas fa-chart-column"></i>
            </div>
            <div class="dash-stat-trend <?php echo e($monthStats['monthly_income'] >= $monthStats['monthly_expense'] ? 'up' : 'down'); ?>">
                <i class="fas <?php echo e($monthStats['monthly_income'] >= $monthStats['monthly_expense'] ? 'fa-arrow-up' : 'fa-arrow-down'); ?>" style="font-size:9px;"></i>
                Income vs Expense
            </div>
        </div>
        <div class="stat-label">মাসিক আয় বনাম খরচ</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div>
                <div style="font-size:11px;color:var(--gray);margin-bottom:2px;">আয়</div>
                <div class="stat-value" id="stat-income" style="font-size:22px;color:var(--success);"><?php echo e($user->currency); ?><?php echo e(number_format($monthStats['monthly_income'], 0)); ?></div>
            </div>
            <div>
                <div style="font-size:11px;color:var(--gray);margin-bottom:2px;">খরচ</div>
                <div class="stat-value" id="stat-expense" style="font-size:22px;color:var(--danger);"><?php echo e($user->currency); ?><?php echo e(number_format($monthStats['monthly_expense'], 0)); ?></div>
            </div>
        </div>
        <div class="stat-sub">আজকের খরচ: <?php echo e($user->currency); ?><span id="today-expense"><?php echo e(number_format($todayStats['monthly_expense'] ?? 0, 0)); ?></span></div>
    </div>

    
    <div class="dash-stat-card saving">
        <div class="dash-stat-header">
            <div class="dash-stat-icon saving">
                <i class="fas fa-piggy-bank"></i>
            </div>
            <div class="dash-stat-trend up"><i class="fas fa-bullseye" style="font-size:9px;"></i> Savings target</div>
        </div>
        <div class="stat-label">Savings Rate</div>
        <div style="display:flex;align-items:center;gap:14px;">
            <div class="stat-value" id="stat-saving" style="font-size:22px;"><?php echo e($user->currency); ?><?php echo e(number_format($monthStats['monthly_saving'], 0)); ?></div>
            <div style="width:62px;height:62px;border-radius:50%;border:5px solid color-mix(in oklab, var(--info) 26%, transparent);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:var(--info);">
                <span id="savings-rate"><?php echo e($monthStats['savings_rate']); ?></span>%
            </div>
        </div>
        <div class="stat-sub">মাসিক সঞ্চয়ের হার</div>
    </div>

</div>




<div class="dash-advisor-row">

    
    <div class="dash-ai-card">
        <div class="dash-ai-inner">
            <div class="dash-ai-badge"><i class="fas fa-robot"></i> এআই আর্থিক উপদেষ্টা</div>

            <?php if($latestAI): ?>
                <div class="dash-ai-limit-label">আজকের দৈনিক সীমা</div>
                <div class="dash-ai-limit"><?php echo e($user->currency); ?><span id="ai-daily-limit"><?php echo e(number_format($latestAI->daily_limit, 0)); ?></span></div>

                <div class="dash-ai-summary">
                    <?php echo e($latestAI->suggestion_data['financial_health_summary'] ?? 'আপনার অর্থ বিশ্লেষণ করা হচ্ছে...'); ?>

                </div>

                
                <?php if(!empty($latestAI->suggestion_data['budget_plan']['items'])): ?>
                <div style="margin-bottom:16px;">
                    <div class="dash-ai-plan-title">
                        📋 বিভাগ অনুযায়ী মাসিক বাজেট পরিকল্পনা
                    </div>
                    <div class="dash-ai-plan-grid">
                        <?php $__currentLoopData = $latestAI->suggestion_data['budget_plan']['items']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $bItem): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="dash-ai-plan-item">
                                <span class="dash-ai-plan-label"><?php echo e($bItem['label']); ?></span>
                                <span class="dash-ai-plan-amount <?php echo e($bItem['status'] === 'over' ? 'over' : ($bItem['status'] === 'ok' ? 'ok' : '')); ?>">
                                    <?php echo e($user->currency); ?><?php echo e(number_format($bItem['recommended'], 0)); ?>

                                </span>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        
                        <?php if(!empty($latestAI->suggestion_data['budget_plan']['savings'])): ?>
                            <div class="dash-ai-saving-row">
                                <span class="dash-ai-saving-label">💰 সঞ্চয় (<?php echo e($latestAI->suggestion_data['budget_plan']['savings']['percentage']); ?>%)</span>
                                <span class="dash-ai-saving-value">
                                    <?php echo e($user->currency); ?><?php echo e(number_format($latestAI->suggestion_data['budget_plan']['savings']['recommended'], 0)); ?>

                                </span>
                            </div>
                        <?php endif; ?>
                    </div>
                    <div class="dash-ai-rule">
                        <?php echo e($latestAI->suggestion_data['budget_plan']['rule_explanation'] ?? ''); ?>

                    </div>
                </div>
                <?php endif; ?>

                <?php $__currentLoopData = ($latestAI->tips ?? []); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $tip): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <div class="dash-ai-tip">💡 <?php echo e($tip); ?></div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

                <div class="dash-ai-time">
                    <i class="far fa-clock"></i>
                    সর্বশেষ আপডেট: <?php echo e($latestAI->generated_at?->diffForHumans() ?? 'এইমাত্র'); ?>

                </div>
            <?php else: ?>
                <div class="dash-ai-limit-label">এখনো কোনো পরামর্শ তৈরি হয়নি</div>
                <div class="dash-ai-summary">
                    লেনদেন যোগ করুন এবং "এআই রিফ্রেশ" বাটনে ক্লিক করুন — ব্যক্তিগতকৃত আর্থিক পরামর্শ পেতে।
                </div>
                <button onclick="generateAI()" class="dash-btn-glass" style="margin-top:8px;">
                    <i class="fas fa-robot"></i> এখনই তৈরি করুন
                </button>
            <?php endif; ?>
        </div>
    </div>

    
    <div class="dash-finscore-card">
        <div class="dash-finscore-title">ফিনস্কোর™</div>

        <div class="dash-finscore-ring">
            <canvas id="fin-score-canvas" width="160" height="160"></canvas>
            <div class="dash-finscore-value">
                <div class="dash-finscore-number" id="fin-score-value"><?php echo e($finScore); ?></div>
                <div class="dash-finscore-max">/ ১০০</div>
            </div>
        </div>

        <div class="dash-finscore-status"
            style="color:<?php echo e($finScore >= 70 ? 'var(--success)' : ($finScore >= 40 ? 'var(--warning)' : 'var(--danger)')); ?>">
            <?php echo e($finScore >= 70 ? '✅ চমৎকার আর্থিক অবস্থা' : ($finScore >= 40 ? '⚠️ উন্নতি প্রয়োজন' : '❌ জটিল অবস্থা')); ?>

        </div>
        <div class="dash-finscore-label">আপনার আর্থিক স্বাস্থ্য স্কোর</div>
    </div>

</div>




<div class="dash-charts-grid">

    
    <div class="dash-chart-card">
        <div class="dash-chart-header">
            <div class="dash-chart-title"><span class="dash-title-icon"><i class="fas fa-chart-line"></i></span>আয় বনাম খরচ</div>
            <div class="dash-chart-controls">
                <button type="button" class="dash-chart-toggle active" data-chart-mode="line">Line</button>
                <button type="button" class="dash-chart-toggle" data-chart-mode="bar">Bar</button>
                <select id="chart-period" onchange="updateChart(this.value)" class="dash-chart-select">
                    <option value="6months">গত ৬ মাস</option>
                    <option value="12months">গত ১২ মাস</option>
                </select>
            </div>
        </div>
        <canvas id="mainChart" height="120"></canvas>
    </div>

    
    <div class="dash-chart-card">
        <div class="dash-chart-header">
            <div class="dash-chart-title"><span class="dash-title-icon"><i class="fas fa-chart-pie"></i></span>খরচের বিশ্লেষণ</div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;min-height:240px;">
            <canvas id="categoryChart" height="220"></canvas>
        </div>
    </div>

</div>




<?php if($budgets->count() > 0): ?>
<div class="card" style="margin-bottom:24px;">
    <div class="card-title">
        <span><i class="fas fa-wallet" style="color:var(--primary);margin-right:8px;"></i>বাজেট অবস্থা</span>
        <a href="<?php echo e(route('budget.index')); ?>" class="btn btn-outline btn-sm">পরিচালনা</a>
    </div>
    <div class="dash-budget-grid">
        <?php $__currentLoopData = $budgets; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $budget): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <?php
                $budgetColor = $budget->percentage >= 100 ? 'var(--danger)' : ($budget->percentage >= 80 ? 'var(--warning)' : 'var(--success)');
                $budgetBg = $budget->percentage >= 100 ? '#fee2e2' : ($budget->percentage >= 80 ? '#fef3c7' : '#d1fae5');
                $budgetText = $budget->percentage >= 100 ? '#991b1b' : ($budget->percentage >= 80 ? '#92400e' : '#065f46');
            ?>
            <div class="dash-budget-item">
                <div class="dash-budget-top">
                    <span class="dash-budget-cat"><?php echo e($catLabels[$budget->category] ?? ucfirst($budget->category)); ?></span>
                    <span class="dash-budget-pct" style="background:<?php echo e($budgetBg); ?>;color:<?php echo e($budgetText); ?>;">
                        <?php echo e($budget->percentage); ?>%
                    </span>
                </div>
                <div class="progress-bar" style="height:10px;border-radius:5px;">
                    <div class="progress-fill" style="width:<?php echo e(min(100, $budget->percentage)); ?>%;background:<?php echo e($budgetColor); ?>;border-radius:5px;"></div>
                </div>
                <div class="dash-budget-amounts">
                    <span><?php echo e($user->currency); ?><?php echo e(number_format($budget->spent, 0)); ?> খরচ</span>
                    <span><?php echo e($user->currency); ?><?php echo e(number_format($budget->limit_amount, 0)); ?> সীমা</span>
                </div>
                <?php if($budget->over_limit): ?>
                    <div style="font-size:11px;color:var(--danger);font-weight:600;margin-top:6px;">
                        <i class="fas fa-exclamation-triangle"></i> সীমা ছাড়িয়েছে!
                    </div>
                <?php endif; ?>
            </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div>
</div>
<?php endif; ?>




<?php if(count($anomalies) > 0): ?>
<div class="card" style="margin-bottom:24px;">
    <div class="card-title">
        <span><i class="fas fa-exclamation-triangle" style="color:var(--warning);margin-right:8px;"></i>অসামঞ্জস্য সনাক্ত</span>
        <span class="badge badge-warning"><?php echo e(count($anomalies)); ?> টি</span>
    </div>
    <?php $__currentLoopData = $anomalies; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $a): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="dash-anomaly-card">
            <div class="dash-anomaly-icon">📊</div>
            <div>
                <div class="dash-anomaly-msg"><?php echo e($a['message']); ?></div>
                <div class="dash-anomaly-meta">
                    <span><i class="fas fa-calendar-day"></i> এই মাস: <?php echo e($user->currency); ?><?php echo e(number_format($a['this_month'], 0)); ?></span>
                    <span><i class="fas fa-chart-bar"></i> ৩ মাসের গড়: <?php echo e($user->currency); ?><?php echo e(number_format($a['avg_3months'], 0)); ?></span>
                </div>
            </div>
        </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</div>
<?php endif; ?>




<div class="dash-table-card">
    <div class="dash-table-header">
        <div class="dash-table-title"><i class="fas fa-exchange-alt" style="color:var(--primary);margin-right:8px;"></i>সাম্প্রতিক লেনদেন</div>
        <div class="dash-transactions-tools">
            <input type="text" id="transaction-filter" class="dash-filter-input" placeholder="লেনদেন খুঁজুন...">
            <a href="<?php echo e(route('transactions.index')); ?>" class="btn btn-outline btn-sm">সব দেখুন <i class="fas fa-arrow-right" style="font-size:10px;margin-left:4px;"></i></a>
        </div>
    </div>
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>তারিখ</th>
                    <th>বিবরণ</th>
                    <th>বিভাগ</th>
                    <th>ধরন</th>
                    <th style="text-align:right;">পরিমাণ</th>
                </tr>
            </thead>
            <tbody>
                <?php $__empty_1 = true; $__currentLoopData = $recentTransactions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $t): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                    <tr>
                        <td style="color:var(--gray);white-space:nowrap;">
                            <?php echo e(\Carbon\Carbon::parse($t->date)->translatedFormat('d M, Y')); ?>

                        </td>
                        <td style="font-weight:500;"><?php echo e($t->description); ?></td>
                        <td>
                            <span style="font-size:12px;"><?php echo e($catLabels[$t->category] ?? ucfirst($t->category)); ?></span>
                        </td>
                        <td>
                            <span class="badge badge-<?php echo e($t->type); ?>"><?php echo e($typeLabels[$t->type] ?? ucfirst($t->type)); ?></span>
                        </td>
                        <td style="text-align:right;font-weight:700;color:<?php echo e($t->type === 'income' ? 'var(--success)' : ($t->type === 'expense' ? 'var(--danger)' : 'var(--info)')); ?>">
                            <?php echo e($t->type === 'income' ? '+' : '-'); ?><?php echo e($user->currency); ?><?php echo e(number_format($t->amount, 0)); ?>

                        </td>
                    </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                    <tr>
                        <td colspan="5" style="text-align:center;color:var(--gray);padding:40px 30px;">
                            <i class="fas fa-inbox" style="font-size:32px;display:block;margin-bottom:12px;color:var(--border);"></i>
                            এখনো কোনো লেনদেন নেই।
                            <a href="<?php echo e(route('transactions.create')); ?>" style="color:var(--primary);font-weight:600;">আপনার প্রথমটি যোগ করুন!</a>
                        </td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php $__env->stopSection(); ?>

<?php $__env->startPush('scripts'); ?>
<script>
    // ===== CHART DATA FROM BLADE =====
    let chartData = <?php echo json_encode($chartData, 15, 512) ?>;
    const categoryData = <?php echo json_encode($categoryBreakdown, 15, 512) ?>;

    // ===== CATEGORY LABELS (BANGLA) =====
    const catLabelsMap = <?php echo json_encode($catLabels, 15, 512) ?>;

    // ===== MAIN LINE CHART =====
    let mainChart;
    let chartMode = 'line';

    function getThemePalette() {
        const body = document.body;
        if (body.classList.contains('theme-white-green')) {
            return {
                income: '#16a34a',
                expense: '#166534',
                saving: '#059669',
                donut: ['#16a34a', '#22c55e', '#15803d', '#10b981', '#34d399', '#047857', '#84cc16', '#65a30d'],
                grid: '#d1fae5',
                ticks: '#4d7c61',
                tooltipBg: '#14532d',
            };
        }
        if (body.classList.contains('theme-white-black')) {
            return {
                income: '#111827',
                expense: '#27272a',
                saving: '#475569',
                donut: ['#111827', '#27272a', '#3f3f46', '#52525b', '#71717a', '#a1a1aa', '#18181b', '#09090b'],
                grid: '#e4e4e7',
                ticks: '#52525b',
                tooltipBg: '#111111',
            };
        }
        if (body.classList.contains('theme-blue-red')) {
            return {
                income: '#93c5fd',
                expense: '#ef4444',
                saving: '#f8fafc',
                donut: ['#ef4444', '#f87171', '#93c5fd', '#dbeafe', '#38bdf8', '#0ea5e9', '#fca5a5', '#60a5fa'],
                grid: 'rgba(191,219,254,0.24)',
                ticks: '#dbeafe',
                tooltipBg: '#082456',
            };
        }
        return {
            income: '#22c55e',
            expense: '#ef4444',
            saving: '#fca5a5',
            donut: ['#ef4444', '#f87171', '#fb7185', '#f59e0b', '#fca5a5', '#22c55e', '#38bdf8', '#a78bfa'],
            grid: '#2b2b33',
            ticks: '#b7b7c2',
            tooltipBg: '#09090b',
        };
    }

    function initMainChart(data, mode = chartMode) {
        const ctx = document.getElementById('mainChart').getContext('2d');
        if (mainChart) mainChart.destroy();
        const palette = getThemePalette();
        const surfaceColor = getComputedStyle(document.body).getPropertyValue('--surface').trim() || '#ffffff';

        const incomeGrad = ctx.createLinearGradient(0, 0, 0, 300);
        incomeGrad.addColorStop(0, `${palette.income}4D`);
        incomeGrad.addColorStop(1, `${palette.income}08`);

        const expenseGrad = ctx.createLinearGradient(0, 0, 0, 300);
        expenseGrad.addColorStop(0, `${palette.expense}4D`);
        expenseGrad.addColorStop(1, `${palette.expense}08`);

        const savingGrad = ctx.createLinearGradient(0, 0, 0, 300);
        savingGrad.addColorStop(0, `${palette.saving}4D`);
        savingGrad.addColorStop(1, `${palette.saving}08`);

        mainChart = new Chart(ctx, {
            type: mode,
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'আয়',
                        data: data.income,
                        borderColor: palette.income,
                        backgroundColor: incomeGrad,
                        tension: 0.4,
                        fill: mode === 'line',
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointBackgroundColor: palette.income,
                        pointBorderColor: surfaceColor,
                        pointBorderWidth: 2,
                        pointHoverRadius: 6,
                        borderRadius: mode === 'bar' ? 6 : 0,
                        maxBarThickness: 24,
                    },
                    {
                        label: 'খরচ',
                        data: data.expense,
                        borderColor: palette.expense,
                        backgroundColor: expenseGrad,
                        tension: 0.4,
                        fill: mode === 'line',
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointBackgroundColor: palette.expense,
                        pointBorderColor: surfaceColor,
                        pointBorderWidth: 2,
                        pointHoverRadius: 6,
                        borderRadius: mode === 'bar' ? 6 : 0,
                        maxBarThickness: 24,
                    },
                    {
                        label: 'সঞ্চয়',
                        data: data.saving,
                        borderColor: palette.saving,
                        backgroundColor: savingGrad,
                        tension: 0.4,
                        fill: mode === 'line',
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointBackgroundColor: palette.saving,
                        pointBorderColor: surfaceColor,
                        pointBorderWidth: 2,
                        pointHoverRadius: 6,
                        borderRadius: mode === 'bar' ? 6 : 0,
                        maxBarThickness: 24,
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { size: 12, family: 'Inter', weight: '500' },
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: palette.tooltipBg,
                        titleFont: { size: 13, family: 'Inter' },
                        bodyFont: { size: 12, family: 'Inter' },
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: function(ctx) {
                                return ctx.dataset.label + ': <?php echo e($user->currency); ?>' + Math.round(ctx.raw).toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: palette.grid, drawBorder: false },
                        ticks: {
                            callback: v => '<?php echo e($user->currency); ?>' + Math.round(v).toLocaleString(),
                            font: { size: 11, family: 'Inter' },
                            color: palette.ticks,
                        },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { size: 11, family: 'Inter' },
                            color: palette.ticks,
                        },
                        border: { display: false }
                    }
                }
            }
        });
    }

    // ===== CATEGORY DONUT CHART =====
    function initCategoryChart(data) {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        const palette = getThemePalette();
        const rawKeys = Object.keys(data);
        const values = Object.values(data);
        const colors = palette.donut;

        // Convert raw keys to Bangla labels
        const labels = rawKeys.map(key => catLabelsMap[key] || key);

        if (labels.length === 0) {
            // Show empty state message on canvas
            ctx.font = '14px Inter, sans-serif';
            ctx.fillStyle = palette.ticks;
            ctx.textAlign = 'center';
            ctx.fillText('খরচের লেনদেন যোগ করুন', ctx.canvas.width / 2, ctx.canvas.height / 2 - 10);
            ctx.font = '12px Inter, sans-serif';
            ctx.fillText('চার্ট এখানে দেখা যাবে', ctx.canvas.width / 2, ctx.canvas.height / 2 + 15);
            return;
        }

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 0,
                    hoverOffset: 8,
                    spacing: 2,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                cutout: '68%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 11, family: 'Inter', weight: '500' },
                            boxWidth: 12,
                            boxHeight: 12,
                            padding: 14,
                            usePointStyle: true,
                            pointStyle: 'rectRounded',
                        }
                    },
                    tooltip: {
                        backgroundColor: palette.tooltipBg,
                        titleFont: { size: 13, family: 'Inter' },
                        bodyFont: { size: 12, family: 'Inter' },
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: ctx => `${ctx.label}: <?php echo e($user->currency); ?>${Math.round(ctx.raw).toLocaleString()}`
                        }
                    }
                }
            }
        });
    }

    // ===== FIN SCORE RING (Canvas) =====
    function drawFinScoreRing(score) {
        const canvas = document.getElementById('fin-score-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const center = size / 2;
        const radius = center - 14;
        const lineWidth = 12;
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (2 * Math.PI * score / 100);

        // Determine color
        let color;
        if (score >= 70) color = '#10b981';
        else if (score >= 40) color = '#f59e0b';
        else color = '#ef4444';

        ctx.clearRect(0, 0, size, size);

        // Background ring
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Score ring
        if (score > 0) {
            ctx.beginPath();
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.stroke();
        }

        // Glow effect
        if (score > 0) {
            ctx.beginPath();
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth + 6;
            ctx.lineCap = 'round';
            ctx.globalAlpha = 0.15;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }

    // ===== PERIOD SWITCHER =====
    async function switchPeriod(period) {
        document.querySelectorAll('.dash-period-pill').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`period-btn-${period}`).classList.add('active');

        try {
            const res = await apiCall(`/transactions/summary/${period}`);
            if (res) {
                const currency = '<?php echo e($user->currency); ?>';
                document.getElementById('stat-income').textContent = currency + Math.round(res.income).toLocaleString('en-US');
                document.getElementById('stat-expense').textContent = currency + Math.round(res.expense).toLocaleString('en-US');
                document.getElementById('stat-saving').textContent = currency + Math.round(res.saving).toLocaleString('en-US');
                document.getElementById('stat-balance').textContent = currency + Math.round(res.balance).toLocaleString('en-US');
            }
        } catch (e) {
            console.error(e);
        }
    }

    // ===== UPDATE CHART =====
    async function updateChart(type) {
        try {
            const res = await apiCall(`/dashboard/chart-data?type=${type}`);
            if (res.data) {
                chartData = res.data;
                initMainChart(chartData, chartMode);
            }
        } catch (e) {
            console.error(e);
        }
    }

    // ===== GENERATE AI =====
    async function generateAI() {
        const btn = document.getElementById('ai-generate-btn');
        const heroBtn = document.getElementById('ai-generate-btn-hero');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> বিশ্লেষণ হচ্ছে...';
            btn.disabled = true;
        }
        if (heroBtn) {
            heroBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> বিশ্লেষণ হচ্ছে...';
            heroBtn.disabled = true;
        }

        try {
            const res = await apiCall('/ai/generate', 'POST');
            showToast(res.message || 'এআই বিশ্লেষণ শুরু হয়েছে!', 'success');

            setTimeout(async () => {
                try {
                    const suggestion = await apiCall('/ai/suggestions');
                    if (suggestion && suggestion.success && suggestion.data) {
                        showToast('এআই বিশ্লেষণ সম্পন্ন! পৃষ্ঠা রিফ্রেশ হচ্ছে...', 'success');
                        setTimeout(() => window.location.reload(), 1000);
                    } else {
                        setTimeout(() => window.location.reload(), 3000);
                    }
                } catch (pollErr) {
                    setTimeout(() => window.location.reload(), 3000);
                }
            }, 2000);
        } catch (e) {
            showToast(e.message || 'এআই তৈরি ব্যর্থ হয়েছে। আবার চেষ্টা করুন।', 'danger');
        }

        setTimeout(() => {
            if (btn) {
                btn.innerHTML = '<i class="fas fa-robot"></i> এআই রিফ্রেশ';
                btn.disabled = false;
            }
            if (heroBtn) {
                heroBtn.innerHTML = '<i class="fas fa-robot"></i> এআই রিফ্রেশ';
                heroBtn.disabled = false;
            }
        }, 5000);
    }

    // ===== INIT =====
    document.addEventListener('DOMContentLoaded', () => {
        initMainChart(chartData, chartMode);
        initCategoryChart(categoryData);
        drawFinScoreRing(<?php echo e($finScore); ?>);

        document.querySelectorAll('.dash-chart-toggle').forEach((btn) => {
            btn.addEventListener('click', () => {
                chartMode = btn.dataset.chartMode;
                document.querySelectorAll('.dash-chart-toggle').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                initMainChart(chartData, chartMode);
            });
        });

        const txFilter = document.getElementById('transaction-filter');
        if (txFilter) {
            txFilter.addEventListener('input', (e) => {
                const keyword = e.target.value.trim().toLowerCase();
                document.querySelectorAll('.dash-table-card tbody tr').forEach((row) => {
                    const rowText = row.textContent.toLowerCase();
                    row.style.display = rowText.includes(keyword) ? '' : 'none';
                });
            });
        }
    });
</script>
<?php $__env->stopPush(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\My projects\Life-Pilot-AI\LP_AI\LP_AI\resources\views/dashboard/index.blade.php ENDPATH**/ ?>