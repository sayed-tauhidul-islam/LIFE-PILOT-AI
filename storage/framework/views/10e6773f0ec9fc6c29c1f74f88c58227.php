<!DOCTYPE html>
<html lang="bn">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>নিবন্ধন — LP_AI</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }

        .auth-wrapper {
            width: 100%;
            max-width: 520px;
        }

        .auth-card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
        }

        .auth-logo {
            text-align: center;
            margin-bottom: 28px;
        }

        .auth-logo .icon {
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            font-size: 24px;
        }

        .auth-logo h1 {
            font-size: 22px;
            font-weight: 800;
            color: #1e293b;
        }

        .auth-logo h1 span {
            color: #6366f1;
        }

        .auth-logo p {
            font-size: 13px;
            color: #64748b;
            margin-top: 3px;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }

        .form-label {
            font-size: 13px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 5px;
            display: block;
        }

        .input-wrap {
            position: relative;
        }

        .input-icon {
            position: absolute;
            left: 13px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            font-size: 13px;
        }

        .form-control {
            width: 100%;
            padding: 10px 13px 10px 38px;
            border: 1.5px solid #e2e8f0;
            border-radius: 9px;
            font-size: 13px;
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            outline: none;
            transition: border-color 0.2s;
        }

        .form-control:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        select.form-control {
            cursor: pointer;
        }

        .error-msg {
            color: #ef4444;
            font-size: 11px;
            margin-top: 3px;
        }

        .btn-auth {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            transition: all 0.2s;
            margin-top: 6px;
        }

        .btn-auth:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
        }

        .auth-footer {
            text-align: center;
            margin-top: 20px;
            font-size: 13px;
            color: #64748b;
        }

        .auth-footer a {
            color: #6366f1;
            text-decoration: none;
            font-weight: 600;
        }

        .section-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #94a3b8;
            margin: 20px 0 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #f1f5f9;
        }

        .alert-danger {
            background: #fee2e2;
            color: #991b1b;
            padding: 12px;
            border-radius: 10px;
            font-size: 12px;
            margin-bottom: 16px;
            border-left: 4px solid #ef4444;
        }

        .currency-flag {
            display: flex;
            gap: 8px;
        }

    </style>
</head>

<body>
    <div class="auth-wrapper">
        <div class="auth-card">
            <div class="auth-logo">
                <div class="icon">💰</div>
                <h1>LP<span>_AI</span></h1>
                <p>আপনার বিনামূল্যের অ্যাকাউন্ট তৈরি করুন</p>
            </div>

            <?php if($errors->any()): ?>
                <div class="alert-danger">
                    <i class="fas fa-exclamation-circle"></i>
                    <ul style="margin:6px 0 0 16px;">
                        <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <li><?php echo e($error); ?></li>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </ul>
                </div>
            <?php endif; ?>

            <form method="POST" action="<?php echo e(route('register.post')); ?>">
                <?php echo csrf_field(); ?>

                <div class="section-title">ব্যক্তিগত তথ্য</div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">পূর্ণ নাম</label>
                        <div class="input-wrap">
                            <i class="fas fa-user input-icon"></i>
                            <input type="text" name="name" class="form-control" placeholder="আপনার নাম"
                                value="<?php echo e(old('name')); ?>" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">বয়স</label>
                        <div class="input-wrap">
                            <i class="fas fa-birthday-cake input-icon"></i>
                            <input type="number" name="age" class="form-control" placeholder="25"
                                value="<?php echo e(old('age')); ?>" min="13" max="120" required>
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">লিঙ্গ</label>
                        <div class="input-wrap">
                            <i class="fas fa-venus-mars input-icon"></i>
                            <select name="gender" class="form-control" required>
                                <option value="">নির্বাচন করুন</option>
                                <option value="male"
                                    <?php echo e(old('gender') == 'male' ? 'selected' : ''); ?>>
                                    পুরুষ</option>
                                <option value="female"
                                    <?php echo e(old('gender') == 'female' ? 'selected' : ''); ?>>
                                    মহিলা</option>
                                <option value="other"
                                    <?php echo e(old('gender') == 'other' ? 'selected' : ''); ?>>
                                    অন্যান্য</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">মুদ্রা</label>
                        <div class="input-wrap">
                            <i class="fas fa-dollar-sign input-icon"></i>
                            <select name="currency" class="form-control">
                                <option value="USD"
                                    <?php echo e(old('currency') == 'USD' ? 'selected' : ''); ?>>
                                    USD ($)</option>
                                <option value="EUR"
                                    <?php echo e(old('currency') == 'EUR' ? 'selected' : ''); ?>>
                                    EUR (€)</option>
                                <option value="GBP"
                                    <?php echo e(old('currency') == 'GBP' ? 'selected' : ''); ?>>
                                    GBP (£)</option>
                                <option value="BDT"
                                    <?php echo e(old('currency') == 'BDT' ? 'selected' : ''); ?>>
                                    BDT (৳)</option>
                                <option value="INR"
                                    <?php echo e(old('currency') == 'INR' ? 'selected' : ''); ?>>
                                    INR (₹)</option>
                                <option value="AUD"
                                    <?php echo e(old('currency') == 'AUD' ? 'selected' : ''); ?>>
                                    AUD (A$)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="section-title">অ্যাকাউন্ট তথ্য</div>

                <div class="form-group">
                    <label class="form-label">ইমেইল ঠিকানা</label>
                    <div class="input-wrap">
                        <i class="fas fa-envelope input-icon"></i>
                        <input type="email" name="email" class="form-control" placeholder="you@example.com"
                            value="<?php echo e(old('email')); ?>" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">পাসওয়ার্ড</label>
                        <div class="input-wrap">
                            <i class="fas fa-lock input-icon"></i>
                            <input type="password" name="password" class="form-control" placeholder="সর্বনিম্ন ৬ অক্ষর"
                                required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">পাসওয়ার্ড নিশ্চিত করুন</label>
                        <div class="input-wrap">
                            <i class="fas fa-lock input-icon"></i>
                            <input type="password" name="password_confirmation" class="form-control"
                                placeholder="পাসওয়ার্ড পুনরায় দিন" required>
                        </div>
                    </div>
                </div>

                <div class="section-title">আর্থিক তথ্য</div>

                <div class="form-group">
                    <label class="form-label">মাসিক আয়</label>
                    <div class="input-wrap">
                        <i class="fas fa-money-bill-wave input-icon"></i>
                        <input type="number" name="monthly_income" class="form-control" placeholder="যেমন: ৩০০০"
                            value="<?php echo e(old('monthly_income')); ?>" step="0.01" min="0" required>
                    </div>
                </div>

                <button type="submit" class="btn-auth">
                    <i class="fas fa-user-plus"></i> অ্যাকাউন্ট তৈরি করুন
                </button>
            </form>

            <div class="auth-footer">
                ইতিমধ্যে অ্যাকাউন্ট আছে? <a href="<?php echo e(route('login')); ?>">সাইন ইন করুন</a>
            </div>
        </div>
    </div>
</body>

</html>
<?php /**PATH F:\My projects\Life-Pilot-AI\LP_AI\LP_AI\resources\views/auth/register.blade.php ENDPATH**/ ?>