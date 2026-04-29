import React, { useState } from "react";
import { Mail, Lock, Eye } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const headers = { Accept: 'application/json' };
      if (csrf) headers['X-CSRF-TOKEN'] = csrf;
      headers['Content-Type'] = 'application/json';

      const res = await fetch('/login', {
        method: 'POST',
        headers,
        credentials: 'same-origin',
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        // assume backend redirects or returns json with redirect
        const data = await res.json().catch(() => null);
        if (data && data.redirect) window.location.href = data.redirect;
        else window.location.reload();
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1b] px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
        {/* Left art panel */}
        <div className="hidden md:block">
          <div className="relative h-[560px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#141a2d] via-[#0f1427] to-[#0b0f1f] border border-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(96,75,255,0.18),_rgba(0,0,0,0))]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,_rgba(130,98,255,0.25),_rgba(0,0,0,0.6))]"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full border border-purple-400/70 shadow-[0_0_40px_rgba(120,90,255,0.6)]"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-purple-400/20"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#0a0f1b] to-transparent"></div>
          </div>
        </div>

        {/* Right form card */}
        <div className="w-full max-w-[440px] ml-auto p-8 rounded-3xl bg-[#0f1425] border border-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">LP</div>
            <div className="text-sm tracking-[0.3em] text-purple-300">LIFE PILOT AI</div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome <span className="text-purple-400">back</span>
          </h2>
          <p className="text-sm text-gray-400 mb-6">Login to continue to your account</p>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Email address</label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#0b1120] border border-white/10 focus-within:border-purple-500 transition">
              <Mail size={18} className="text-gray-400" />
              <input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="bg-transparent outline-none text-white placeholder-gray-500 w-full"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Password</label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#0b1120] border border-white/10 focus-within:border-purple-500 transition">
              <Lock size={18} className="text-gray-400" />
              <input
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                className="bg-transparent outline-none text-white placeholder-gray-500 w-full"
                required
              />
              <Eye size={18} className="text-gray-500" />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button type="button" className="text-sm text-purple-400 hover:text-purple-300">Forgot password?</button>
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`p-3 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-95 transition ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Please wait...' : 'Sign in'}
          </button>

          <div className="my-4 text-center text-sm text-gray-400">or continue with</div>
          <div className="flex gap-3">
            <button type="button" className="flex-1 py-2 rounded-lg bg-[#0b1120] border border-white/10 hover:bg-white/5 transition flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 48 48" className="opacity-90">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 33.1 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.3l-6.2-5.1c-2 1.5-4.6 2.4-7.3 2.4-5.4 0-9.9-2.9-11.4-7.2l-6.6 5.1C9.6 39.7 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 2.9-3.3 5.2-6 6.6l6.2 5.1C38.6 36.8 44 31.4 44 24c0-1.3-.1-2.7-.4-3.5z"/>
              </svg>
            </button>
            <button type="button" className="flex-1 py-2 rounded-lg bg-[#0b1120] border border-white/10 hover:bg-white/5 transition flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white/90">
                <path d="M12 .5C5.7.5.6 5.6.6 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.6-.8 2-1.5.1-.7.4-1.1.7-1.4-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.4 5.6 18.3.5 12 .5z"/>
              </svg>
            </button>
            <button type="button" className="flex-1 py-2 rounded-lg bg-[#0b1120] border border-white/10 hover:bg-white/5 transition flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#F25022" d="M6 6h17v17H6z"/>
                <path fill="#7FBA00" d="M25 6h17v17H25z"/>
                <path fill="#00A4EF" d="M6 25h17v17H6z"/>
                <path fill="#FFB900" d="M25 25h17v17H25z"/>
              </svg>
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-400 text-center">
            Don’t have an account? <a href="/register" className="text-purple-400 hover:text-purple-300">Sign up</a>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}