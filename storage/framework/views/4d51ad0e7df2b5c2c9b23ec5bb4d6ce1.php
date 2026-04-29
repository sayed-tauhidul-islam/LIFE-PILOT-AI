<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | LP_AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?php echo e(asset('css/pro-theme.css')); ?>">
    <style> body { font-family: 'Hind Siliguri', 'Inter', sans-serif; }</style>
</head>
<body class="min-h-screen bg-[#0a0f1b] text-slate-100" data-theme="purple">
    <div class="min-h-screen grid lg:grid-cols-[1.35fr_1fr]">
        <div class="login-theme-switcher">
            <button type="button" class="theme-toggle" aria-label="Theme selector">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path>
                </svg>
            </button>
            <div class="theme-panel" aria-label="Theme options">
                <button type="button" class="theme-dot" data-theme="purple" aria-label="Purple theme"></button>
                <button type="button" class="theme-dot theme-dot-blue" data-theme="blue" aria-label="Blue theme"></button>
                <button type="button" class="theme-dot theme-dot-green" data-theme="green" aria-label="Green theme"></button>
            </div>
        </div>
        <aside class="hidden lg:flex relative overflow-hidden bg-[#0b1020] p-12 items-center justify-center">
            <div class="login-hero-card">
                <div class="login-hero-glow"></div>
                <div class="login-hero-ring"></div>
                <div class="login-hero-ring-sm"></div>
                <div class="login-hero-mountains"></div>
                <div class="login-hero-water"></div>
            </div>
        </aside>

        <main class="flex items-center justify-center p-6 md:p-12">
            <div class="login-card">
                <div class="login-brand">
                    <div class="login-logo"></div>
                </div>
                <h2 class="login-title">Welcome <span>back</span></h2>
                <p class="login-subtitle">Login to continue to your account</p>

                <?php if($errors->any()): ?>
                    <div class="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">
                        <?php echo e($errors->first()); ?>

                    </div>
                <?php endif; ?>

                <?php if(session('success')): ?>
                    <div class="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                        <?php echo e(session('success')); ?>

                    </div>
                <?php endif; ?>

                <form method="POST" action="<?php echo e(route('login.post')); ?>" class="space-y-4">
                    <?php echo csrf_field(); ?>
                    <div>
                        <label class="login-label">Email address</label>
                        <div class="login-input">
                            <svg class="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16v12H4z"/><path d="m4 6 8 7 8-7"/></svg>
                            <input type="email" name="email" value="<?php echo e(old('email')); ?>" required placeholder="Enter your email" />
                        </div>
                    </div>
                    <div>
                        <label class="login-label">Password</label>
                        <div class="login-input">
                            <svg class="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            <input type="password" name="password" required placeholder="Enter your password" />
                            <svg class="login-input-icon-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <a href="#" class="text-sm text-purple-400 hover:text-purple-300">Forgot password?</a>
                    </div>
                    <button type="submit" class="btn-primary w-full">Sign in</button>
                </form>

                <div class="login-divider">or continue with</div>
                <div class="flex gap-3">
                    <button type="button" class="login-social" aria-label="Continue with Google">
                        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 33.1 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.3l-6.2-5.1c-2 1.5-4.6 2.4-7.3 2.4-5.4 0-9.9-2.9-11.4-7.2l-6.6 5.1C9.6 39.7 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 2.9-3.3 5.2-6 6.6l6.2 5.1C38.6 36.8 44 31.4 44 24c0-1.3-.1-2.7-.4-3.5z"/></svg>
                    </button>
                    <button type="button" class="login-social" aria-label="Continue with GitHub">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="text-white/90"><path d="M12 .5C5.7.5.6 5.6.6 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.6-.8 2-1.5.1-.7.4-1.1.7-1.4-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.4 5.6 18.3.5 12 .5z"/></svg>
                    </button>
                    <button type="button" class="login-social" aria-label="Continue with Microsoft">
                        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#F25022" d="M6 6h17v17H6z"/><path fill="#7FBA00" d="M25 6h17v17H25z"/><path fill="#00A4EF" d="M6 25h17v17H6z"/><path fill="#FFB900" d="M25 25h17v17H25z"/></svg>
                    </button>
                </div>

                <p class="login-footer">
                    Don’t have an account?
                    <a class="text-purple-400 hover:text-purple-300" href="<?php echo e(route('register')); ?>">Sign up</a>
                </p>
            </div>
        </main>
    </div>
    <script>
        const root = document.body;
        const switcher = document.querySelector('.login-theme-switcher');
        const toggle = document.querySelector('.theme-toggle');
        const dots = document.querySelectorAll('.theme-dot');
        toggle.addEventListener('click', () => {
            switcher.classList.toggle('open');
        });
        dots.forEach((btn) => {
            btn.addEventListener('click', () => {
                root.setAttribute('data-theme', btn.dataset.theme);
                switcher.classList.remove('open');
            });
        });
    </script>
</body>
</html>
<?php /**PATH F:\My projects\Life-Pilot-AI\LP_AI\LP_AI\resources\views/auth/login.blade.php ENDPATH**/ ?>