
<?php $__env->startSection('title', 'থিম সেটিংস'); ?>
<?php $__env->startSection('page-title', 'থিম সেটিংস'); ?>

<?php $__env->startSection('topbar-actions'); ?>
<a href="<?php echo e(route('settings.index')); ?>" class="btn btn-outline btn-sm">
    <i class="fas fa-arrow-left"></i> সেটিংস হোম
</a>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
<style>
    .theme-hero {
        background: var(--dash-hero-bg);
        color: var(--dash-hero-text);
        border-radius: 16px;
        padding: 28px;
        margin-bottom: 22px;
    }

    .theme-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 14px;
    }

    .theme-option {
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 14px;
        background: var(--surface, #fff);
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .theme-option:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.14);
        border-color: var(--primary);
    }

    .theme-option input {
        margin-right: 8px;
        transform: translateY(1px);
    }

    .theme-name {
        font-weight: 800;
        font-size: 14px;
    }

    .theme-preview {
        margin-top: 10px;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.08);
        height: 90px;
        display: grid;
        grid-template-columns: 1fr 1.2fr;
    }

    .theme-preview .left {
        padding: 10px;
        font-size: 11px;
        font-weight: 700;
    }

    .theme-preview .right {
        padding: 10px;
        font-size: 11px;
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        gap: 6px;
    }

    .theme-preview .pill {
        border-radius: 999px;
        padding: 2px 8px;
        font-size: 10px;
        width: fit-content;
    }

    .theme-note {
        font-size: 12px;
        line-height: 1.65;
        color: var(--gray);
        margin-top: 7px;
    }
</style>

<div class="theme-hero">
    <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.75;margin-bottom:8px;">Theme Presets</div>
    <h2 style="font-size:30px;font-weight:800;margin-bottom:8px;">আপনার UI color combination নির্বাচন করুন</h2>
    <p style="line-height:1.75;opacity:0.9;max-width:70ch;">নিচের চারটি predefined theme থেকে একটি বেছে নিলে dashboard, card, button, chart accent color সব update হবে।</p>
</div>

<form method="POST" action="<?php echo e(route('settings.theme.update')); ?>">
    <?php echo csrf_field(); ?>
    <?php echo method_field('PUT'); ?>

    <div class="theme-grid">
        <label class="theme-option">
            <div><input type="radio" name="theme_preference" value="black-red" <?php echo e($activeTheme === 'black-red' ? 'checked' : ''); ?>><span class="theme-name">1) Black BG + Red & White Text</span></div>
            <div class="theme-preview" style="background:#0b0b0c;">
                <div class="left" style="background:#111111;color:#fff;">Sidebar</div>
                <div class="right" style="background:#141418;color:#fff;">
                    <div style="background:linear-gradient(90deg,#dc2626,#ef4444);border-radius:8px;"></div>
                    <span class="pill" style="background:#2b1113;color:#ff8686;">Accent Red</span>
                    <span class="pill" style="background:#f5f5f5;color:#111;">White text card</span>
                </div>
            </div>
            <div class="theme-note">Bold, cinematic, high contrast dashboard mood.</div>
        </label>

        <label class="theme-option">
            <div><input type="radio" name="theme_preference" value="white-green" <?php echo e($activeTheme === 'white-green' ? 'checked' : ''); ?>><span class="theme-name">2) White BG + Green Text</span></div>
            <div class="theme-preview" style="background:#f8fffb;">
                <div class="left" style="background:#ecfdf3;color:#065f46;">Sidebar</div>
                <div class="right" style="background:#ffffff;color:#064e3b;">
                    <div style="background:linear-gradient(90deg,#059669,#10b981);border-radius:8px;"></div>
                    <span class="pill" style="background:#d1fae5;color:#065f46;">Accent Green</span>
                    <span class="pill" style="background:#f0fdf4;color:#065f46;">Fresh clean</span>
                </div>
            </div>
            <div class="theme-note">Calm, clean, productivity-focused experience.</div>
        </label>

        <label class="theme-option">
            <div><input type="radio" name="theme_preference" value="white-black" <?php echo e($activeTheme === 'white-black' ? 'checked' : ''); ?>><span class="theme-name">3) White BG + Black Text</span></div>
            <div class="theme-preview" style="background:#f7f7f8;">
                <div class="left" style="background:#ffffff;color:#111111;">Sidebar</div>
                <div class="right" style="background:#fafafa;color:#111111;">
                    <div style="background:linear-gradient(90deg,#111,#323232);border-radius:8px;"></div>
                    <span class="pill" style="background:#ededed;color:#111;">Monochrome</span>
                    <span class="pill" style="background:#ffffff;color:#111;">Minimal pro</span>
                </div>
            </div>
            <div class="theme-note">Minimal, editorial and distraction-free UI.</div>
        </label>

        <label class="theme-option">
            <div><input type="radio" name="theme_preference" value="blue-red" <?php echo e($activeTheme === 'blue-red' ? 'checked' : ''); ?>><span class="theme-name">4) Blue BG + White, Red Text</span></div>
            <div class="theme-preview" style="background:#0b2d6f;">
                <div class="left" style="background:#123f8f;color:#fff;">Sidebar</div>
                <div class="right" style="background:#0c3278;color:#fff;">
                    <div style="background:linear-gradient(90deg,#ef4444,#f87171);border-radius:8px;"></div>
                    <span class="pill" style="background:#1f4da0;color:#fff;">Blue depth</span>
                    <span class="pill" style="background:#450a0a;color:#fca5a5;">Red contrast</span>
                </div>
            </div>
            <div class="theme-note">Energetic and modern with strong visual contrast.</div>
        </label>
    </div>

    <div style="display:flex;gap:10px;align-items:center;margin-top:18px;">
        <button type="submit" class="btn btn-primary">
            <i class="fas fa-save"></i> থিম সংরক্ষণ করুন
        </button>
        <a href="<?php echo e(route('settings.index')); ?>" class="btn btn-outline">বাতিল</a>
    </div>
</form>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\My projects\Life-Pilot-AI\LP_AI\LP_AI\resources\views/settings/theme.blade.php ENDPATH**/ ?>