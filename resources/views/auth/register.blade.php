<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register | LP_AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Sora', sans-serif; }
    </style>
</head>
<body class="min-h-screen bg-slate-950 text-slate-100">
    <div class="min-h-screen flex items-center justify-center p-6 md:p-10">
        <div class="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur p-8 shadow-2xl">
            <div class="mb-7">
                <p class="text-xs uppercase tracking-[0.2em] text-emerald-300">LP_AI Onboarding</p>
                <h2 class="mt-2 text-3xl font-extrabold">Create your account</h2>
            </div>

            @if($errors->any())
                <div class="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">
                    {{ $errors->first() }}
                </div>
            @endif

            <form method="POST" action="{{ route('register.post') }}" class="grid md:grid-cols-2 gap-4">
                @csrf
                <div>
                    <label class="block text-sm mb-2 text-slate-300">Name</label>
                    <input type="text" name="name" value="{{ old('name') }}" required class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400">
                </div>
                <div>
                    <label class="block text-sm mb-2 text-slate-300">Email</label>
                    <input type="email" name="email" value="{{ old('email') }}" required class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400">
                </div>
                <div>
                    <label class="block text-sm mb-2 text-slate-300">Age</label>
                    <input type="number" name="age" min="13" max="120" value="{{ old('age') }}" required class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400">
                </div>
                <div>
                    <label class="block text-sm mb-2 text-slate-300">Gender</label>
                    <select name="gender" required class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400">
                        <option value="">Select</option>
                        <option value="male" @selected(old('gender') === 'male')>Male</option>
                        <option value="female" @selected(old('gender') === 'female')>Female</option>
                        <option value="other" @selected(old('gender') === 'other')>Other</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm mb-2 text-slate-300">Monthly Income</label>
                    <input type="number" step="0.01" name="monthly_income" value="{{ old('monthly_income') }}" required class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400">
                </div>
                <div>
                    <label class="block text-sm mb-2 text-slate-300">Currency</label>
                    <input type="text" name="currency" value="{{ old('currency', 'USD') }}" class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400">
                </div>
                <div>
                    <label class="block text-sm mb-2 text-slate-300">Password</label>
                    <input type="password" name="password" required class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400">
                </div>
                <div>
                    <label class="block text-sm mb-2 text-slate-300">Confirm Password</label>
                    <input type="password" name="password_confirmation" required class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400">
                </div>
                <div class="md:col-span-2 flex gap-3 mt-2">
                    <button type="submit" class="rounded-xl bg-emerald-600 px-6 py-3 font-semibold hover:bg-emerald-500 transition">Create Account</button>
                    <a href="{{ route('login') }}" class="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 hover:bg-slate-800 transition">Back to Login</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
