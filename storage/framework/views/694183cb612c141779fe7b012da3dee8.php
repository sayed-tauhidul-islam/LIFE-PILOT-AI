
<?php $__env->startSection('title','স্বাস্থ্য প্রোফাইল'); ?>
<?php $__env->startSection('page-title','স্বাস্থ্য প্রোফাইল'); ?>

<?php $__env->startSection('content'); ?>

<?php
    $prefLabels = [
        'vegetarian' => 'নিরামিষ',
        'vegan' => 'ভেগান',
        'halal' => 'হালাল',
        'kosher' => 'কোশের',
        'gluten_free' => 'গ্লুটেন মুক্ত',
        'dairy_free' => 'দুগ্ধ মুক্ত',
        'low_carb' => 'কম কার্ব',
        'keto' => 'কিটো',
    ];
    $condLabels = [
        'diabetes' => 'ডায়াবেটিস',
        'hypertension' => 'উচ্চ রক্তচাপ',
        'heart_disease' => 'হৃদরোগ',
        'obesity' => 'স্থূলতা',
        'anemia' => 'রক্তস্বল্পতা',
        'none' => 'কিছু নেই',
    ];
    $goalLabels = [
        'lose_weight' => 'ওজন কমানো',
        'gain_muscle' => 'পেশী বৃদ্ধি',
        'maintain_weight' => 'ওজন বজায় রাখা',
        'improve_energy' => 'শক্তি বৃদ্ধি',
        'better_sleep' => 'ভালো ঘুম',
        'reduce_stress' => 'মানসিক চাপ কমানো',
    ];
    $bmiLabels = [
        'Underweight' => 'কম ওজন',
        'Normal' => 'স্বাভাবিক',
        'Overweight' => 'অতিরিক্ত ওজন',
        'Obese' => 'স্থূল',
    ];
?>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">

    
    <div class="card">
        <div class="card-title">
            <span>💚 আপনার স্বাস্থ্য তথ্য</span>
            <?php if($health): ?>
                <span class="badge badge-success">প্রোফাইল সক্রিয়</span>
            <?php endif; ?>
        </div>

        <form method="POST"
            action="<?php echo e($health ? route('health.update') : route('health.store')); ?>">
            <?php echo csrf_field(); ?>
            <?php if($health): ?> <?php echo method_field('PUT'); ?> <?php endif; ?>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">বয়স</label>
                        <input type="number" name="age" class="form-control"
                            value="<?php echo e($health->age ?? auth()->user()->age); ?>" min="13" max="120" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">লিঙ্গ</label>
                        <select name="gender" class="form-control" required>
                            <option value="male"
                                <?php echo e(($health->gender ?? auth()->user()->gender) === 'male' ? 'selected' : ''); ?>>
                                পুরুষ</option>
                            <option value="female"
                                <?php echo e(($health->gender ?? auth()->user()->gender) === 'female' ? 'selected' : ''); ?>>
                                মহিলা</option>
                            <option value="other"
                                <?php echo e(($health->gender ?? auth()->user()->gender) === 'other' ? 'selected' : ''); ?>>
                                অন্যান্য</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">উচ্চতা (সেমি)</label>
                        <input type="number" name="height_cm" class="form-control"
                            value="<?php echo e($health->height_cm ?? ''); ?>" placeholder="170"
                            step="0.1" min="50" max="300" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">ওজন (কেজি)</label>
                        <input type="number" name="weight_kg" class="form-control"
                            value="<?php echo e($health->weight_kg ?? ''); ?>" placeholder="70"
                            step="0.1" min="10" required>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">কার্যকলাপের মাত্রা</label>
                    <select name="activity_level" class="form-control" required>
                        <option value="sedentary"
                            <?php echo e(($health->activity_level ?? '') === 'sedentary' ? 'selected' : ''); ?>>
                            🪑 বসে থাকা (ডেস্ক জব, সামান্য ব্যায়াম)</option>
                        <option value="light"
                            <?php echo e(($health->activity_level ?? '') === 'light' ? 'selected' : ''); ?>>
                            🚶 হালকা (সপ্তাহে ১-৩ দিন ব্যায়াম)</option>
                        <option value="moderate"
                            <?php echo e(($health->activity_level ?? 'moderate') === 'moderate' ? 'selected' : ''); ?>>
                            🏃 মাঝারি (সপ্তাহে ৩-৫ দিন)</option>
                        <option value="active"
                            <?php echo e(($health->activity_level ?? '') === 'active' ? 'selected' : ''); ?>>
                            💪 সক্রিয় (সপ্তাহে ৬-৭ দিন)</option>
                        <option value="very_active"
                            <?php echo e(($health->activity_level ?? '') === 'very_active' ? 'selected' : ''); ?>>
                            🏋️ খুব সক্রিয় (খেলোয়াড়/শারীরিক কাজ)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">খাদ্যতালিকা পছন্দ</label>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:6px;">
                        <?php $__currentLoopData = ['vegetarian','vegan','halal','kosher','gluten_free','dairy_free','low_carb','keto']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $pref): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <label
                                style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;padding:8px;border:1px solid var(--border);border-radius:8px;">
                                <input type="checkbox" name="dietary_preferences[]" value="<?php echo e($pref); ?>"
                                    <?php echo e(in_array($pref, $health->dietary_preferences ?? []) ? 'checked' : ''); ?>>
                                <?php echo e($prefLabels[$pref] ?? ucwords(str_replace('_',' ',$pref))); ?>

                            </label>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">স্বাস্থ্য সমস্যা (যদি থাকে)</label>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:6px;">
                        <?php $__currentLoopData = ['diabetes','hypertension','heart_disease','obesity','anemia','none']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $cond): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <label
                                style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;padding:8px;border:1px solid var(--border);border-radius:8px;">
                                <input type="checkbox" name="health_conditions[]" value="<?php echo e($cond); ?>"
                                    <?php echo e(in_array($cond, $health->health_conditions ?? ['none']) ? 'checked' : ''); ?>>
                                <?php echo e($condLabels[$cond] ?? ucwords(str_replace('_',' ',$cond))); ?>

                            </label>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">স্বাস্থ্য লক্ষ্য</label>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:6px;">
                        <?php $__currentLoopData = ['lose_weight','gain_muscle','maintain_weight','improve_energy','better_sleep','reduce_stress']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $goal): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <label
                                style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;padding:8px;border:1px solid var(--border);border-radius:8px;">
                                <input type="checkbox" name="health_goals[]" value="<?php echo e($goal); ?>"
                                    <?php echo e(in_array($goal, $health->health_goals ?? []) ? 'checked' : ''); ?>>
                                <?php echo e($goalLabels[$goal] ?? ucwords(str_replace('_',' ',$goal))); ?>

                            </label>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">দৈনিক খাদ্য বাজেট ($)</label>
                    <input type="number" name="daily_food_budget" class="form-control"
                        value="<?php echo e($health->daily_food_budget ?? ''); ?>"
                        placeholder="যেমন: ১৫" step="0.01" min="0" required>
                </div>

                <button type="submit" class="btn btn-primary" style="width:100%;">
                    <i class="fas fa-save"></i>
                    <?php echo e($health ? 'স্বাস্থ্য প্রোফাইল আপডেট করুন' : 'স্বাস্থ্য প্রোফাইল সংরক্ষণ করুন'); ?>

                </button>
        </form>
    </div>

    
    <div>
        <?php if($health): ?>
            
            <div class="card" style="margin-bottom:16px;">
                <div class="card-title">📊 স্বাস্থ্য সারসংক্ষেপ</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div style="text-align:center;padding:16px;background:var(--light);border-radius:10px;">
                        <div style="font-size:32px;font-weight:800;color:var(--primary);"><?php echo e($health->bmi); ?></div>
                        <div style="font-size:12px;color:var(--gray);font-weight:600;">বিএমআই</div>
                        <div
                            style="font-size:13px;font-weight:700;color:<?php echo e($health->getBMICategory() === 'Normal' ? 'var(--success)' : 'var(--warning)'); ?>;margin-top:4px;">
                            <?php echo e($bmiLabels[$health->getBMICategory()] ?? $health->getBMICategory()); ?></div>
                    </div>
                    <div style="text-align:center;padding:16px;background:var(--light);border-radius:10px;">
                        <div style="font-size:32px;font-weight:800;color:var(--success);">
                            <?php echo e($health->calculateDailyCalories()); ?></div>
                        <div style="font-size:12px;color:var(--gray);font-weight:600;">দৈনিক ক্যালোরি</div>
                        <div style="font-size:12px;color:var(--gray);margin-top:4px;">সুপারিশকৃত</div>
                    </div>
                </div>
                <div
                    style="margin-top:12px;padding:12px;background:#f0fdf4;border-radius:10px;font-size:13px;color:#166534;">
                    💧 সুপারিশকৃত পানি গ্রহণ: <?php echo e(round(($health->weight_kg ?? 70) * 0.033, 1)); ?>L
                    প্রতিদিন
                </div>
            </div>
        <?php endif; ?>

        
        <div class="card" id="meal-plan-card">
            <div class="card-title">🍽️ এআই খাদ্য পরিকল্পনা</div>
            <div id="meal-plan-content">
                <div style="text-align:center;padding:30px;color:var(--gray);">
                    <i class="fas fa-utensils" style="font-size:36px;margin-bottom:12px;display:block;opacity:0.3;"></i>
                    <div id="meal-loading-msg">
                        <?php if(!$health): ?>
                            এআই খাদ্য সুপারিশ পেতে আপনার স্বাস্থ্য প্রোফাইল সংরক্ষণ করুন।
                        <?php else: ?>
                            আপনার ব্যক্তিগত খাদ্য পরিকল্পনা লোড হচ্ছে...
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
<?php $__env->stopSection(); ?>

<?php $__env->startPush('scripts'); ?>
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            <?php if($health): ?>
                try {
                    const res = await apiCall('/health/meal-plan');
                    const container = document.getElementById('meal-plan-content');

                    if (res.success && res.meal_plan) {
                        const mp = res.meal_plan;
                        const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];
                        const icons = {
                            breakfast: '☀️',
                            lunch: '🌤️',
                            dinner: '🌙',
                            snacks: '🍎'
                        };

                        container.innerHTML = meals.map(meal => {
                            if (!mp[meal]) return '';
                            return `
                <div class="meal-card" style="margin-bottom:10px;">
                    <div class="meal-time">${icons[meal]} ${{breakfast:'সকালের নাস্তা',lunch:'দুপুরের খাবার',dinner:'রাতের খাবার',snacks:'স্ন্যাকস'}[meal]||meal}</div>
                    <div class="meal-name">${mp[meal].meal}</div>
                    <div class="meal-meta">
                        🔥 ${mp[meal].calories} cal &nbsp;|&nbsp;
                        <span class="meal-cost">৳${Math.round(mp[meal].cost)}</span> &nbsp;|&nbsp;
                        ${mp[meal].nutrients}
                    </div>
                </div>`;
                        }).join('') + `
            <div style="background:#f0fdf4;border-radius:10px;padding:12px;margin-top:10px;font-size:13px;color:#166534;">
                💧 ${mp.hydration_tip || 'প্রতিদিন ৮ গ্লাস পানি পান করুন'}
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">
                <span style="font-size:13px;font-weight:700;">মোট: ${mp.total_daily_calories} ক্যাল</span>
                <span style="font-size:13px;font-weight:700;color:var(--success);">দৈনিক খরচ: ৳${ Math.round(parseFloat(mp.total_daily_cost))}</span>
            </div>`;
                    } else {
                        container.innerHTML =
                            `<div style="text-align:center;padding:30px;color:var(--gray);">
                <p>এখনো কোনো খাদ্য পরিকল্পনা নেই। <button onclick="generateAI()" class="btn btn-primary btn-sm">এআই পরিকল্পনা তৈরি করুন</button></p></div>`;
                    }
                } catch (e) {
                    console.error(e);
                }
            <?php endif; ?>
        });

        async function generateAI() {
            await apiCall('/ai/generate', 'POST');
            showToast('এআই আপনার খাদ্য পরিকল্পনা তৈরি করছে। ৩০ সেকেন্ডে রিফ্রেশ করুন!', 'success');
        }

    </script>
<?php $__env->stopPush(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\My projects\Life-Pilot-AI\LP_AI\LP_AI\resources\views/health/index.blade.php ENDPATH**/ ?>