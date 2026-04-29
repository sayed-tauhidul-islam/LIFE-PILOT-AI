<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>আর্থিক ড্যাশবোর্ড</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Noto+Sans+Bengali:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<style>
:root {
  --bg: #070b14;
  --surface: #0d1525;
  --surface2: #111d30;
  --glass: rgba(255,255,255,0.03);
  --glass-border: rgba(255,255,255,0.06);
  --glass-hover: rgba(255,255,255,0.06);
  --purple: #7c3aed;
  --purple-light: #a78bfa;
  --cyan: #06b6d4;
  --cyan-light: #67e8f9;
  --emerald: #10b981;
  --emerald-light: #6ee7b7;
  --rose: #f43f5e;
  --rose-light: #fda4af;
  --amber: #f59e0b;
  --amber-light: #fcd34d;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #475569;
  --border: rgba(255,255,255,0.06);
  --sidebar-w: 260px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'DM Sans', 'Noto Sans Bengali', sans-serif;
  background: var(--bg);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ─── AMBIENT BACKGROUND ORBS ─── */
.bg-orbs {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: orb-drift 20s ease-in-out infinite alternate;
}
.orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%); top: -200px; left: -100px; animation-delay: 0s; }
.orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%); top: 100px; right: -100px; animation-delay: -7s; }
.orb-3 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%); bottom: -100px; left: 30%; animation-delay: -14s; }
@keyframes orb-drift { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(40px, 30px) scale(1.1); } }

/* ─── LAYOUT ─── */
.layout { display: flex; min-height: 100vh; position: relative; z-index: 1; }

/* ─── SIDEBAR ─── */
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: rgba(13,21,37,0.7);
  border-right: 1px solid var(--border);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 100;
  padding: 28px 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 36px;
  padding: 0 4px;
}
.logo-icon {
  width: 42px; height: 42px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--purple), #a855f7);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  box-shadow: 0 0 24px rgba(124,58,237,0.5);
}
.logo-text { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; background: linear-gradient(135deg, #f1f5f9, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.logo-sub { font-size: 11px; color: var(--text-muted); font-weight: 400; margin-top: 1px; }

.nav-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); margin: 8px 8px 8px; }

.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 14px; font-weight: 500; color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2px;
  text-decoration: none;
}
.nav-item:hover { background: var(--glass-hover); color: var(--text-primary); }
.nav-item.active {
  background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.1));
  color: var(--purple-light);
  border: 1px solid rgba(124,58,237,0.25);
}
.nav-item .nav-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.nav-item.active .nav-icon { background: rgba(124,58,237,0.2); }
.nav-item:not(.active) .nav-icon { background: rgba(255,255,255,0.04); }
.nav-badge { margin-left: auto; background: rgba(124,58,237,0.2); color: var(--purple-light); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 99px; }

.sidebar-user {
  margin-top: auto;
  padding: 16px;
  border-radius: 16px;
  background: var(--glass);
  border: 1px solid var(--border);
  display: flex; align-items: center; gap: 12px;
}
.avatar {
  width: 40px; height: 40px; border-radius: 12px;
  background: linear-gradient(135deg, var(--purple), var(--cyan));
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700; color: #fff;
  flex-shrink: 0;
}
.user-name { font-size: 14px; font-weight: 600; }
.user-role { font-size: 11px; color: var(--text-muted); }
.user-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--emerald); box-shadow: 0 0 6px var(--emerald); margin-left: auto; flex-shrink: 0; }

/* ─── MAIN ─── */
.main {
  margin-left: var(--sidebar-w);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ─── TOPBAR ─── */
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 36px;
  background: rgba(7,11,20,0.6);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 50;
}
.page-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; }
.page-sub { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
.topbar-right { display: flex; align-items: center; gap: 12px; }

.search-bar {
  display: flex; align-items: center; gap: 10px;
  background: var(--glass);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 10px 16px;
  font-size: 13px; color: var(--text-secondary);
  cursor: pointer;
  min-width: 200px;
}
.search-bar input { background: none; border: none; outline: none; color: var(--text-secondary); font-family: inherit; font-size: 13px; flex: 1; }
.search-bar input::placeholder { color: var(--text-muted); }

.icon-btn {
  width: 42px; height: 42px;
  border-radius: 12px;
  background: var(--glass);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.icon-btn:hover { background: var(--glass-hover); color: var(--text-primary); border-color: rgba(255,255,255,0.12); }
.notif-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; border-radius: 50%; background: var(--rose); border: 1.5px solid var(--bg); }

.btn-new-tx {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--purple), #a855f7);
  color: #fff; font-weight: 600; font-size: 14px;
  border: none; cursor: pointer;
  box-shadow: 0 4px 20px rgba(124,58,237,0.4);
  transition: all 0.2s;
}
.btn-new-tx:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(124,58,237,0.5); }

/* ─── CONTENT ─── */
.content { padding: 32px 36px; flex: 1; }

/* ─── HERO BANNER ─── */
.hero-banner {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  margin-bottom: 32px;
  padding: 36px 40px;
  background: linear-gradient(135deg, #1a0d3d 0%, #0d1f3c 50%, #0a2a2a 100%);
  border: 1px solid rgba(255,255,255,0.08);
}
.hero-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 10% 50%, rgba(124,58,237,0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 90% 20%, rgba(6,182,212,0.2) 0%, transparent 45%),
    radial-gradient(ellipse at 60% 90%, rgba(16,185,129,0.15) 0%, transparent 40%);
}
.hero-banner::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.hero-inner { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px; }
.hero-greeting { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; line-height: 1.2; margin-bottom: 8px; }
.hero-greeting .wave { display: inline-block; animation: wave 2.5s ease-in-out infinite; }
@keyframes wave { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(20deg); } 75% { transform: rotate(-10deg); } }
.hero-sub { font-size: 14px; color: rgba(255,255,255,0.65); max-width: 480px; line-height: 1.7; }
.hero-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
.hero-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 18px; border-radius: 50px;
  font-size: 13px; font-weight: 600;
  backdrop-filter: blur(12px);
  transition: all 0.2s;
}
.pill-balance { background: rgba(124,58,237,0.2); border: 1px solid rgba(124,58,237,0.35); color: var(--purple-light); }
.pill-savings { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: var(--emerald-light); }
.pill-score { background: rgba(6,182,212,0.15); border: 1px solid rgba(6,182,212,0.3); color: var(--cyan-light); }
.hero-pill:hover { transform: translateY(-2px); }

.hero-right { display: flex; flex-direction: column; align-items: flex-end; gap: 16px; }
.hero-kpi {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 20px 28px;
  text-align: right;
  backdrop-filter: blur(16px);
  min-width: 200px;
}
.hero-kpi-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.5); font-weight: 600; margin-bottom: 6px; }
.hero-kpi-value { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; background: linear-gradient(135deg, #e9d5ff, #c4b5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; }
.hero-kpi-change { font-size: 12px; color: var(--emerald-light); margin-top: 6px; }

/* ─── STATS GRID ─── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.stat-card {
  position: relative;
  border-radius: 24px;
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}
.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  border-radius: 24px 24px 0 0;
}
.stat-card:hover { transform: translateY(-6px); border-color: rgba(255,255,255,0.12); box-shadow: 0 24px 48px rgba(0,0,0,0.4); }

.stat-card.purple::before { background: linear-gradient(90deg, var(--purple), #a855f7); }
.stat-card.emerald::before { background: linear-gradient(90deg, var(--emerald), #34d399); }
.stat-card.rose::before { background: linear-gradient(90deg, var(--rose), #fb7185); }
.stat-card.cyan::before { background: linear-gradient(90deg, var(--cyan), #22d3ee); }

.stat-glow {
  position: absolute;
  top: -30px; right: -30px;
  width: 120px; height: 120px;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.15;
}
.purple .stat-glow { background: var(--purple); }
.emerald .stat-glow { background: var(--emerald); }
.rose .stat-glow { background: var(--rose); }
.cyan .stat-glow { background: var(--cyan); }

.stat-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.stat-icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
}
.purple .stat-icon { background: rgba(124,58,237,0.15); color: var(--purple-light); }
.emerald .stat-icon { background: rgba(16,185,129,0.15); color: var(--emerald-light); }
.rose .stat-icon { background: rgba(244,63,94,0.15); color: var(--rose-light); }
.cyan .stat-icon { background: rgba(6,182,212,0.15); color: var(--cyan-light); }

.stat-trend {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 700;
  padding: 5px 10px; border-radius: 99px;
}
.trend-up { background: rgba(16,185,129,0.12); color: var(--emerald-light); }
.trend-down { background: rgba(244,63,94,0.12); color: var(--rose-light); }

.stat-label { font-size: 12px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
.stat-value { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800; line-height: 1.1; color: var(--text-primary); margin-bottom: 8px; }
.stat-sub { font-size: 12px; color: var(--text-muted); }

/* ─── MAIN GRID ─── */
.main-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
  margin-bottom: 28px;
}

/* ─── CARD BASE ─── */
.card {
  border-radius: 24px;
  padding: 28px;
  background: var(--surface);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}
.card:hover { border-color: rgba(255,255,255,0.1); }

.card-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px;
}
.card-title {
  display: flex; align-items: center; gap: 12px;
  font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700;
}
.card-title-icon {
  width: 36px; height: 36px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
}
.icon-purple { background: rgba(124,58,237,0.15); color: var(--purple-light); }
.icon-emerald { background: rgba(16,185,129,0.15); color: var(--emerald-light); }
.icon-cyan { background: rgba(6,182,212,0.15); color: var(--cyan-light); }
.icon-rose { background: rgba(244,63,94,0.15); color: var(--rose-light); }
.icon-amber { background: rgba(245,158,11,0.15); color: var(--amber-light); }

.btn-outline-sm {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 12px;
  font-size: 12px; font-weight: 600; color: var(--text-secondary);
  background: var(--glass); border: 1px solid var(--border);
  cursor: pointer; transition: all 0.2s;
}
.btn-outline-sm:hover { background: var(--glass-hover); color: var(--text-primary); }

/* ─── AI CARD ─── */
.ai-card {
  background: linear-gradient(145deg, #1a0d3d, #0d1f3c, #0a2220);
  border: 1px solid rgba(124,58,237,0.2);
  position: relative; overflow: hidden;
}
.ai-card::before {
  content: '';
  position: absolute;
  top: -40%; right: -20%;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 60%);
  animation: pulse-ai 6s ease-in-out infinite;
}
@keyframes pulse-ai { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
.ai-inner { position: relative; z-index: 1; }
.ai-head { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.ai-avatar {
  width: 50px; height: 50px; border-radius: 16px;
  background: linear-gradient(135deg, var(--purple), #ec4899);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  box-shadow: 0 8px 24px rgba(124,58,237,0.5);
  animation: avatar-glow 3s ease-in-out infinite;
}
@keyframes avatar-glow { 0%,100% { box-shadow: 0 8px 24px rgba(124,58,237,0.5); } 50% { box-shadow: 0 8px 32px rgba(124,58,237,0.8); } }
.ai-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #fff; }
.ai-status { font-size: 12px; color: rgba(255,255,255,0.45); display: flex; align-items: center; gap: 6px; margin-top: 3px; }
.ai-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--emerald); box-shadow: 0 0 8px var(--emerald); animation: blink 2s ease-in-out infinite; }
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

.ai-score-wrap { margin-bottom: 20px; padding: 18px 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; display: flex; align-items: center; gap: 20px; }
.ai-score-ring { position: relative; width: 70px; height: 70px; flex-shrink: 0; }
.ai-score-ring svg { transform: rotate(-90deg); }
.ai-score-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); text-align: center; }
.ai-score-num { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: var(--purple-light); }
.ai-score-label { font-size: 10px; color: rgba(255,255,255,0.4); }
.ai-score-info { flex: 1; }
.ai-score-title { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 4px; }
.ai-score-desc { font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.6; }

.ai-insight {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 10px;
  font-size: 13px; line-height: 1.7; color: rgba(255,255,255,0.8);
}
.ai-insight strong { color: var(--purple-light); }

.ai-tip {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 14px; border-radius: 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  font-size: 12px; color: rgba(255,255,255,0.75);
  margin-bottom: 6px;
  transition: all 0.2s;
}
.ai-tip:hover { background: rgba(255,255,255,0.07); transform: translateX(4px); }
.ai-tip-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.dot-purple { background: var(--purple-light); box-shadow: 0 0 6px var(--purple); }
.dot-cyan { background: var(--cyan-light); box-shadow: 0 0 6px var(--cyan); }
.dot-emerald { background: var(--emerald-light); box-shadow: 0 0 6px var(--emerald); }

/* ─── FINSCORE CARD ─── */
.finscore-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; }
.finscore-ring-outer { position: relative; width: 210px; height: 210px; margin: 0 auto 24px; }
.finscore-ring-outer svg { transform: rotate(-90deg); filter: drop-shadow(0 0 16px rgba(124,58,237,0.4)); }
.finscore-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); }
.finscore-num { font-family: 'Syne', sans-serif; font-size: 52px; font-weight: 800; background: linear-gradient(135deg, var(--purple-light), var(--cyan-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; }
.finscore-max { font-size: 14px; color: var(--text-muted); font-weight: 500; margin-top: 4px; }
.finscore-status { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 8px; }
.finscore-desc { font-size: 13px; color: var(--text-muted); max-width: 240px; line-height: 1.6; }
.finscore-bars { width: 100%; margin-top: 24px; display: flex; flex-direction: column; gap: 10px; }
.fsbar-row { display: flex; align-items: center; gap: 12px; }
.fsbar-label { font-size: 12px; color: var(--text-muted); width: 80px; text-align: right; }
.fsbar-track { flex: 1; height: 6px; border-radius: 99px; background: rgba(255,255,255,0.06); overflow: hidden; }
.fsbar-fill { height: 100%; border-radius: 99px; transition: width 1.5s cubic-bezier(0.4,0,0.2,1); }
.fsbar-val { font-size: 12px; font-weight: 700; width: 36px; text-align: left; }

/* ─── CHART CARD ─── */
.chart-card { margin-bottom: 28px; }
.chart-tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 4px; }
.chart-tab { padding: 8px 18px; border-radius: 9px; font-size: 13px; font-weight: 600; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
.chart-tab.active { background: rgba(124,58,237,0.2); color: var(--purple-light); }
.chart-wrap { height: 280px; margin-top: 20px; position: relative; }

/* ─── BOTTOM GRID ─── */
.bottom-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; margin-bottom: 28px; }

/* ─── TRANSACTIONS TABLE ─── */
.tx-table { width: 100%; border-collapse: collapse; }
.tx-table thead th { padding: 0 16px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); border-bottom: 1px solid var(--border); text-align: left; }
.tx-table thead th:last-child { text-align: right; }
.tx-row { transition: background 0.15s; }
.tx-row:hover td { background: rgba(255,255,255,0.02); }
.tx-row td { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; vertical-align: middle; }
.tx-row:last-child td { border-bottom: none; }

.tx-cat { display: flex; align-items: center; gap: 10px; }
.tx-cat-icon { width: 36px; height: 36px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.tx-cat-name { font-weight: 600; font-size: 13px; }
.tx-cat-date { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

.tx-type { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; }
.type-income { background: rgba(16,185,129,0.12); color: var(--emerald-light); }
.type-expense { background: rgba(244,63,94,0.12); color: var(--rose-light); }
.type-saving { background: rgba(6,182,212,0.12); color: var(--cyan-light); }

.tx-amount { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; text-align: right; }
.amount-income { color: var(--emerald-light); }
.amount-expense { color: var(--rose-light); }
.amount-saving { color: var(--cyan-light); }

/* ─── BUDGET CARDS ─── */
.budget-list { display: flex; flex-direction: column; gap: 14px; }
.budget-card {
  background: var(--glass);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px 20px;
  transition: all 0.2s;
  position: relative; overflow: hidden;
}
.budget-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
.budget-ok::before { background: linear-gradient(90deg, var(--emerald), #34d399); }
.budget-warn::before { background: linear-gradient(90deg, var(--amber), #fbbf24); }
.budget-danger::before { background: linear-gradient(90deg, var(--rose), #fb7185); }
.budget-card:hover { background: var(--glass-hover); border-color: rgba(255,255,255,0.1); }
.budget-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.budget-cat { display: flex; align-items: center; gap: 10px; }
.budget-cat-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.budget-cat-name { font-size: 14px; font-weight: 600; }
.budget-pct { font-size: 13px; font-weight: 800; padding: 4px 12px; border-radius: 99px; }
.pct-ok { background: rgba(16,185,129,0.12); color: var(--emerald-light); }
.pct-warn { background: rgba(245,158,11,0.12); color: var(--amber-light); }
.pct-danger { background: rgba(244,63,94,0.12); color: var(--rose-light); }
.budget-bar { height: 6px; border-radius: 99px; background: rgba(255,255,255,0.06); overflow: hidden; margin-bottom: 10px; }
.budget-fill { height: 100%; border-radius: 99px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
.bar-ok { background: linear-gradient(90deg, var(--emerald), #34d399); }
.bar-warn { background: linear-gradient(90deg, var(--amber), #fbbf24); }
.bar-danger { background: linear-gradient(90deg, var(--rose), #fb7185); }
.budget-amounts { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); }

/* ─── ANOMALY ─── */
.anomaly-wrap { margin-bottom: 28px; }
.anomaly-card {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 18px 20px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(245,158,11,0.06), rgba(244,63,94,0.04));
  border: 1px solid rgba(245,158,11,0.2);
  margin-bottom: 10px;
  transition: all 0.2s;
}
.anomaly-card:hover { background: linear-gradient(135deg, rgba(245,158,11,0.1), rgba(244,63,94,0.07)); }
.anomaly-icon-wrap { width: 38px; height: 38px; border-radius: 12px; background: rgba(245,158,11,0.15); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.anomaly-msg { font-size: 13px; color: var(--amber-light); font-weight: 500; line-height: 1.6; }
.anomaly-meta { font-size: 11px; color: var(--text-muted); margin-top: 5px; display: flex; gap: 12px; flex-wrap: wrap; }
.anomaly-chip { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; background: rgba(255,255,255,0.05); border-radius: 99px; }

/* ─── SCROLLBAR ─── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }

/* ─── ANIMATIONS ─── */
.fade-up { animation: fadeUp 0.6s ease both; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; } .delay-3 { animation-delay: 0.3s; } .delay-4 { animation-delay: 0.4s; } .delay-5 { animation-delay: 0.5s; }
</style>
</head>
<body>

<div class="bg-orbs">
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>
</div>

<div class="layout">
  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="logo">
      <div class="logo-icon">💎</div>
      <div>
        <div class="logo-text">Life Pilot</div>
        <div class="logo-sub">আর্থিক ব্যবস্থাপনা</div>
      </div>
    </div>

    <div class="nav-label">মূল মেনু</div>
    <a href="#" class="nav-item active">
      <div class="nav-icon"><i class="fas fa-grid-2"></i></div>
      ড্যাশবোর্ড
    </a>
    <a href="#" class="nav-item">
      <div class="nav-icon"><i class="fas fa-exchange-alt"></i></div>
      লেনদেন
      <span class="nav-badge">12</span>
    </a>
    <a href="#" class="nav-item">
      <div class="nav-icon"><i class="fas fa-wallet"></i></div>
      বাজেট
    </a>
    <a href="#" class="nav-item">
      <div class="nav-icon"><i class="fas fa-chart-line"></i></div>
      বিশ্লেষণ
    </a>
    <a href="#" class="nav-item">
      <div class="nav-icon"><i class="fas fa-robot"></i></div>
      AI সহায়ক
    </a>

    <div class="nav-label" style="margin-top:16px;">সেটিংস</div>
    <a href="#" class="nav-item">
      <div class="nav-icon"><i class="fas fa-cog"></i></div>
      পছন্দসমূহ
    </a>
    <a href="#" class="nav-item">
      <div class="nav-icon"><i class="fas fa-shield-alt"></i></div>
      নিরাপত্তা
    </a>

      <div class="sidebar-user">
      <div class="avatar">{{ $user->avatar ?? \Illuminate\Support\Str::substr($user->name ?? '', 0, 1) }}</div>
      <div>
        <div class="user-name">{{ $user->name ?? 'ব্যবহারকারী' }}</div>
        <div class="user-role">{{ $user->profile_complete ? 'প্রিমিয়াম সদস্য' : 'সাধারণ সদস্য' }}</div>
      </div>
      <div class="user-dot"></div>
      <form method="POST" action="{{ route('logout') }}" style="margin-left:auto;">
        @csrf
        <button type="submit" style="background: none; border: none; color: var(--rose-light); font-size: 12px; cursor: pointer; padding: 4px 8px; border-radius: 6px; font-weight:500;">লগআউট</button>
      </form>
    </div>
  </aside>

  <!-- MAIN -->
  <main class="main">
    <!-- TOPBAR -->
    <div class="topbar">
      <div>
        <div class="page-title">ড্যাশবোর্ড</div>
        <div class="page-sub">এপ্রিল ২০২৬ — সর্বশেষ আপডেট ২ মিনিট আগে</div>
      </div>
      <div class="topbar-right">
        <div class="search-bar">
          <i class="fas fa-search" style="color:var(--text-muted);font-size:13px;"></i>
          <input type="text" placeholder="খুঁজুন..."/>
          <span style="font-size:11px;color:var(--text-muted);background:rgba(255,255,255,0.06);padding:2px 8px;border-radius:6px;">⌘K</span>
        </div>
        <div class="icon-btn"><i class="fas fa-bell"></i><div class="notif-dot"></div></div>
        <div class="icon-btn"><i class="fas fa-sun"></i></div>
        <button class="btn-new-tx">
          <i class="fas fa-plus"></i>
          নতুন লেনদেন
        </button>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="content">

      <!-- HERO BANNER -->
      <div class="hero-banner fade-up">
        <div class="hero-inner">
          <div>
            <div class="hero-greeting">
              সুপ্রভাত, <span style="background:linear-gradient(135deg,#e9d5ff,#a5f3fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">{{ $user->name ?? 'ব্যবহারকারী' }}</span> <span class="wave">👋</span>
            </div>
            <div class="hero-sub">আপনার আর্থিক স্বাস্থ্য আজ বেশ ভালো। AI বিশ্লেষণ বলছে এই মাসে ব্যয় ১৮% কমেছে।</div>
            <div class="hero-pills">
              <div class="hero-pill pill-balance"><i class="fas fa-wallet" style="font-size:12px;"></i> ৳৪৫,২৩০ মাসিক ব্যালেন্স</div>
              <div class="hero-pill pill-savings"><i class="fas fa-piggy-bank" style="font-size:12px;"></i> ৩২% সঞ্চয়ের হার</div>
              <div class="hero-pill pill-score"><i class="fas fa-star" style="font-size:12px;"></i> ৭৮ FinScore</div>
            </div>
          </div>
          <div class="hero-right">
          <div class="hero-kpi">
              <div class="hero-kpi-label">মোট ব্যালেন্স</div>
              <div class="hero-kpi-value">৳{{ number_format($monthStats->balance ?? 0, 0) }}</div>
              <div class="hero-kpi-change"><i class="fas fa-arrow-up" style="font-size:10px;"></i> FinScore: {{ $finScore ?? 0 }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- STATS GRID -->
      <div class="stats-grid fade-up delay-1">
        <div class="stat-card purple">
          <div class="stat-glow"></div>
          <div class="stat-header">
            <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
            <div class="stat-trend trend-up"><i class="fas fa-arrow-up" style="font-size:10px;"></i> {{ round(($monthStats->income ?? 0) / ($monthStats->expense ?? 1) * 100) }}%</div>
          </div>
          <div class="stat-label">মোট ব্যালেন্স</div>
          <div class="stat-value">৳{{ number_format($monthStats->balance ?? 0, 0) }}</div>
          <div class="stat-sub">মাসিক: {{ $user->monthly_income ? number_format($user->monthly_income, 0) : 'N/A' }}</div>
        </div>
        <div class="stat-card emerald">
          <div class="stat-glow"></div>
          <div class="stat-header">
            <div class="stat-icon"><i class="fas fa-arrow-down"></i></div>
            <div class="stat-trend trend-up"><i class="fas fa-arrow-up" style="font-size:10px;"></i> ৮.৩%</div>
          </div>
          <div class="stat-label">মোট আয়</div>
          <div class="stat-value">৳৪৫,২৩০</div>
          <div class="stat-sub">এপ্রিল ২০২৬</div>
        </div>
        <div class="stat-card rose">
          <div class="stat-glow"></div>
          <div class="stat-header">
            <div class="stat-icon"><i class="fas fa-arrow-up"></i></div>
            <div class="stat-trend trend-down"><i class="fas fa-arrow-down" style="font-size:10px;"></i> ১৮%</div>
          </div>
          <div class="stat-label">মোট ব্যয়</div>
          <div class="stat-value">৳৩০,৭৫৬</div>
          <div class="stat-sub">বাজেটের ৬৮% ব্যবহৃত</div>
        </div>
        <div class="stat-card cyan">
          <div class="stat-glow"></div>
          <div class="stat-header">
            <div class="stat-icon"><i class="fas fa-piggy-bank"></i></div>
            <div class="stat-trend trend-up"><i class="fas fa-arrow-up" style="font-size:10px;"></i> ২৩%</div>
          </div>
          <div class="stat-label">মোট সঞ্চয়</div>
          <div class="stat-value">৳১৪,৪৭৪</div>
          <div class="stat-sub">লক্ষ্যমাত্রার ৮৮%</div>
        </div>
      </div>

      <!-- CHART -->
      <div class="card chart-card fade-up delay-2">
        <div class="card-head">
          <div class="card-title">
            <div class="card-title-icon icon-purple"><i class="fas fa-chart-bar"></i></div>
            মাসিক আয় বনাম ব্যয়
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="chart-tabs">
              <div class="chart-tab active">৬ মাস</div>
              <div class="chart-tab">১ বছর</div>
              <div class="chart-tab">সব</div>
            </div>
            <div class="btn-outline-sm"><i class="fas fa-download"></i> রিপোর্ট</div>
          </div>
        </div>
        <div class="chart-wrap">
          <canvas id="monthlyChart"></canvas>
        </div>
      </div>

      <!-- MAIN GRID: AI + FINSCORE -->
      <div class="main-grid fade-up delay-3">
        <!-- AI Card -->
        <div class="card ai-card">
          <div class="ai-inner">
            <div class="ai-head">
              <div class="ai-avatar">🤖</div>
              <div>
                <div class="ai-title">AI আর্থিক সহায়ক</div>
                <div class="ai-status"><div class="ai-dot"></div> সক্রিয় · ৫ মিনিট আগে আপডেট</div>
              </div>
            </div>

            <div class="ai-score-wrap">
              <div class="ai-score-ring">
                <svg width="70" height="70" viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="6"/>
                  <circle id="ai-ring" cx="35" cy="35" r="28" fill="none" stroke="url(#aiGrad)" stroke-width="6" stroke-linecap="round"
                    stroke-dasharray="175.9" stroke-dashoffset="37.6"/>
                  <defs>
                    <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#7c3aed"/>
                      <stop offset="100%" stop-color="#ec4899"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div class="ai-score-center">
                  <div class="ai-score-num">৭৮</div>
                  <div class="ai-score-label">/১০০</div>
                </div>
              </div>
              <div class="ai-score-info">
                <div class="ai-score-title">আর্থিক স্বাস্থ্য স্কোর</div>
                <div class="ai-score-desc">আপনার সঞ্চয়ের অভ্যাস উন্নত হচ্ছে। আরও ভালো করার সুযোগ আছে।</div>
              </div>
            </div>

            <div class="ai-insight">
              <strong>মূল অন্তর্দৃষ্টি:</strong> এই মাসে খাদ্য খরচ ১৮% কমেছে। বিনোদনে ব্যয় বেড়েছে তবে সঞ্চয়ের লক্ষ্যমাত্রা অর্জনে এখনও ট্র্যাকে আছেন।
            </div>

            <div class="ai-tip"><div class="ai-tip-dot dot-purple"></div> প্রতি মাসে আয়ের কমপক্ষে ৩০% সঞ্চয়ের চেষ্টা করুন।</div>
            <div class="ai-tip"><div class="ai-tip-dot dot-cyan"></div> জরুরি তহবিলে ৬ মাসের ব্যয় রাখুন — এখন ৩.২ মাস আছে।</div>
            <div class="ai-tip"><div class="ai-tip-dot dot-emerald"></div> বিনোদন বাজেট এই মাসে ৮৫% ব্যবহৃত — সতর্ক থাকুন।</div>
          </div>
        </div>

        <!-- FinScore -->
        <div class="card">
          <div class="finscore-wrap">
            <div style="font-family:'Syne',sans-serif;font-size:17px;font-weight:700;margin-bottom:24px;display:flex;align-items:center;gap:10px;">
              <div class="card-title-icon icon-cyan"><i class="fas fa-chart-pie"></i></div> FinScore বিশ্লেষণ
            </div>
            <div class="finscore-ring-outer">
              <svg viewBox="0 0 210 210" width="210" height="210">
                <defs>
                  <linearGradient id="fsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#7c3aed"/>
                    <stop offset="100%" stop-color="#06b6d4"/>
                  </linearGradient>
                </defs>
                <circle cx="105" cy="105" r="90" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="12"/>
                <circle id="fs-ring" cx="105" cy="105" r="90" fill="none" stroke="url(#fsGrad)" stroke-width="12"
                  stroke-linecap="round" stroke-dasharray="565.5" stroke-dashoffset="124.4" />
              </svg>
              <div class="finscore-center">
                <div class="finscore-num">৭৮</div>
                <div class="finscore-max">/ ১০০</div>
              </div>
            </div>
            <div class="finscore-status" style="color:var(--cyan-light);">🟢 চমৎকার</div>
            <div class="finscore-desc">আপনার আর্থিক স্বাস্থ্য দারুণ! আরও ভালো করতে সঞ্চয় বাড়ান।</div>
            <div class="finscore-bars">
              <div class="fsbar-row">
                <div class="fsbar-label">সঞ্চয়</div>
                <div class="fsbar-track"><div class="fsbar-fill bar-ok" style="width:88%;background:linear-gradient(90deg,var(--emerald),#34d399);"></div></div>
                <div class="fsbar-val" style="color:var(--emerald-light);">৮৮%</div>
              </div>
              <div class="fsbar-row">
                <div class="fsbar-label">ব্যয় নিয়ন্ত্রণ</div>
                <div class="fsbar-track"><div class="fsbar-fill" style="width:72%;background:linear-gradient(90deg,var(--purple),#a855f7);"></div></div>
                <div class="fsbar-val" style="color:var(--purple-light);">৭২%</div>
              </div>
              <div class="fsbar-row">
                <div class="fsbar-label">বাজেট</div>
                <div class="fsbar-track"><div class="fsbar-fill" style="width:65%;background:linear-gradient(90deg,var(--cyan),#22d3ee);"></div></div>
                <div class="fsbar-val" style="color:var(--cyan-light);">৬৫%</div>
              </div>
              <div class="fsbar-row">
                <div class="fsbar-label">বিনিয়োগ</div>
                <div class="fsbar-track"><div class="fsbar-fill bar-warn" style="width:45%;background:linear-gradient(90deg,var(--amber),#fbbf24);"></div></div>
                <div class="fsbar-val" style="color:var(--amber-light);">৪৫%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BOTTOM GRID: TRANSACTIONS + BUDGETS -->
      <div class="bottom-grid fade-up delay-4">
        <!-- Transactions -->
        <div class="card">
          <div class="card-head">
            <div class="card-title">
              <div class="card-title-icon icon-emerald"><i class="fas fa-exchange-alt"></i></div>
              সাম্প্রতিক লেনদেন
            </div>
            <div class="btn-outline-sm"><i class="fas fa-arrow-right"></i> সব দেখুন</div>
          </div>
          <table class="tx-table">
            <thead>
              <tr>
                <th>বিবরণ</th>
                <th>ধরন</th>
                <th>তারিখ</th>
                <th>টাকা</th>
              </tr>
            </thead>
            <tbody>
              <tr class="tx-row">
                <td>
                  <div class="tx-cat">
                    <div class="tx-cat-icon" style="background:rgba(16,185,129,0.12);color:var(--emerald-light);">💼</div>
                    <div><div class="tx-cat-name">বেতন</div><div class="tx-cat-date">০১ এপ্রিল</div></div>
                  </div>
                </td>
                <td><span class="tx-type type-income"><i class="fas fa-arrow-down" style="font-size:10px;"></i> আয়</span></td>
                <td style="color:var(--text-muted);font-size:12px;">১ এপ্রিল</td>
                <td class="tx-amount amount-income">+৳৪৫,০০০</td>
              </tr>
              <tr class="tx-row">
                <td>
                  <div class="tx-cat">
                    <div class="tx-cat-icon" style="background:rgba(244,63,94,0.12);color:var(--rose-light);">🛒</div>
                    <div><div class="tx-cat-name">মুদিখানা</div><div class="tx-cat-date">০৩ এপ্রিল</div></div>
                  </div>
                </td>
                <td><span class="tx-type type-expense"><i class="fas fa-arrow-up" style="font-size:10px;"></i> ব্যয়</span></td>
                <td style="color:var(--text-muted);font-size:12px;">৩ এপ্রিল</td>
                <td class="tx-amount amount-expense">-৳৩,৪৫০</td>
              </tr>
              <tr class="tx-row">
                <td>
                  <div class="tx-cat">
                    <div class="tx-cat-icon" style="background:rgba(6,182,212,0.12);color:var(--cyan-light);">🏦</div>
                    <div><div class="tx-cat-name">মাসিক সঞ্চয়</div><div class="tx-cat-date">০৫ এপ্রিল</div></div>
                  </div>
                </td>
                <td><span class="tx-type type-saving"><i class="fas fa-piggy-bank" style="font-size:10px;"></i> সঞ্চয়</span></td>
                <td style="color:var(--text-muted);font-size:12px;">৫ এপ্রিল</td>
                <td class="tx-amount amount-saving">+৳১০,০০০</td>
              </tr>
              <tr class="tx-row">
                <td>
                  <div class="tx-cat">
                    <div class="tx-cat-icon" style="background:rgba(244,63,94,0.12);color:var(--rose-light);">⚡</div>
                    <div><div class="tx-cat-name">বিদ্যুৎ বিল</div><div class="tx-cat-date">০৮ এপ্রিল</div></div>
                  </div>
                </td>
                <td><span class="tx-type type-expense"><i class="fas fa-arrow-up" style="font-size:10px;"></i> ব্যয়</span></td>
                <td style="color:var(--text-muted);font-size:12px;">৮ এপ্রিল</td>
                <td class="tx-amount amount-expense">-৳১,৮৯০</td>
              </tr>
              <tr class="tx-row">
                <td>
                  <div class="tx-cat">
                    <div class="tx-cat-icon" style="background:rgba(245,158,11,0.12);color:var(--amber-light);">🎮</div>
                    <div><div class="tx-cat-name">বিনোদন</div><div class="tx-cat-date">১২ এপ্রিল</div></div>
                  </div>
                </td>
                <td><span class="tx-type type-expense"><i class="fas fa-arrow-up" style="font-size:10px;"></i> ব্যয়</span></td>
                <td style="color:var(--text-muted);font-size:12px;">১২ এপ্রিল</td>
                <td class="tx-amount amount-expense">-৳২,৩৪০</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Budgets -->
        <div class="card">
          <div class="card-head">
            <div class="card-title">
              <div class="card-title-icon icon-amber"><i class="fas fa-wallet"></i></div>
              বাজেট অবস্থা
            </div>
            <div class="btn-outline-sm"><i class="fas fa-plus"></i> নতুন</div>
          </div>
          <div class="budget-list">
            <div class="budget-card budget-ok">
              <div class="budget-top">
                <div class="budget-cat">
                  <div class="budget-cat-icon" style="background:rgba(16,185,129,0.12);color:var(--emerald-light);">🛒</div>
                  <div class="budget-cat-name">খাদ্য</div>
                </div>
                <div class="budget-pct pct-ok">৬৮%</div>
              </div>
              <div class="budget-bar"><div class="budget-fill bar-ok" style="width:68%;"></div></div>
              <div class="budget-amounts"><span>৳৬,৮০০ ব্যয়</span><span>৳১০,০০০ লিমিট</span></div>
            </div>
            <div class="budget-card budget-warn">
              <div class="budget-top">
                <div class="budget-cat">
                  <div class="budget-cat-icon" style="background:rgba(245,158,11,0.12);color:var(--amber-light);">🎮</div>
                  <div class="budget-cat-name">বিনোদন</div>
                </div>
                <div class="budget-pct pct-warn">৮৫%</div>
              </div>
              <div class="budget-bar"><div class="budget-fill bar-warn" style="width:85%;"></div></div>
              <div class="budget-amounts"><span>৳৪,২৫০ ব্যয়</span><span>৳৫,০০০ লিমিট</span></div>
            </div>
            <div class="budget-card budget-danger">
              <div class="budget-top">
                <div class="budget-cat">
                  <div class="budget-cat-icon" style="background:rgba(244,63,94,0.12);color:var(--rose-light);">👗</div>
                  <div class="budget-cat-name">পোশাক</div>
                </div>
                <div class="budget-pct pct-danger">১০৮%</div>
              </div>
              <div class="budget-bar"><div class="budget-fill bar-danger" style="width:100%;"></div></div>
              <div class="budget-amounts"><span>৳৫,৪০০ ব্যয়</span><span>৳৫,০০০ লিমিট</span></div>
            </div>
            <div class="budget-card budget-ok">
              <div class="budget-top">
                <div class="budget-cat">
                  <div class="budget-cat-icon" style="background:rgba(6,182,212,0.12);color:var(--cyan-light);">🚗</div>
                  <div class="budget-cat-name">পরিবহন</div>
                </div>
                <div class="budget-pct pct-ok">৪২%</div>
              </div>
              <div class="budget-bar"><div class="budget-fill bar-ok" style="width:42%;"></div></div>
              <div class="budget-amounts"><span>৳২,১০০ ব্যয়</span><span>৳৫,০০০ লিমিট</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ANOMALY -->
      <div class="anomaly-wrap card fade-up delay-5">
        <div class="card-head">
          <div class="card-title">
            <div class="card-title-icon" style="background:rgba(245,158,11,0.15);color:var(--amber-light);"><i class="fas fa-exclamation-triangle"></i></div>
            ব্যয় সতর্কতা
          </div>
          <div class="btn-outline-sm"><i class="fas fa-times"></i> বন্ধ করুন</div>
        </div>
        <div class="anomaly-card">
          <div class="anomaly-icon-wrap">⚠️</div>
          <div>
            <div class="anomaly-msg">পোশাক খাতে ব্যয় স্বাভাবিকের চেয়ে উল্লেখযোগ্যভাবে বেশি — বাজেট ছাড়িয়ে গেছে।</div>
            <div class="anomaly-meta">
              <span class="anomaly-chip"><i class="fas fa-calendar" style="font-size:10px;"></i> এই মাস: ৳৫,৪০০</span>
              <span class="anomaly-chip"><i class="fas fa-chart-bar" style="font-size:10px;"></i> গড়: ৳৩,২০০</span>
              <span class="anomaly-chip" style="color:var(--rose-light);">↑ ৬৮.৭% বৃদ্ধি</span>
            </div>
          </div>
        </div>
        <div class="anomaly-card" style="border-color:rgba(6,182,212,0.2);background:linear-gradient(135deg,rgba(6,182,212,0.05),rgba(124,58,237,0.03));">
          <div class="anomaly-icon-wrap" style="background:rgba(6,182,212,0.15);">💡</div>
          <div>
            <div class="anomaly-msg" style="color:var(--cyan-light);">বিনোদন বাজেটে মাত্র ১৫% অবশিষ্ট — এই মাস শেষে অতিক্রম করতে পারে।</div>
            <div class="anomaly-meta">
              <span class="anomaly-chip"><i class="fas fa-calendar" style="font-size:10px;"></i> এই মাস: ৳৪,২৫০</span>
              <span class="anomaly-chip"><i class="fas fa-chart-bar" style="font-size:10px;"></i> গড়: ৳৩,৮০০</span>
              <span class="anomaly-chip" style="color:var(--amber-light);">↑ ১১.৮% বৃদ্ধি</span>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /content -->
  </main>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('monthlyChart');
  if (!ctx) return;
  const labels = ['নভেম্বর','ডিসেম্বর','জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল'];
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'আয়', data: [38000,42000,40000,44000,43000,45230], backgroundColor: 'rgba(16,185,129,0.75)', borderRadius: 8, borderSkipped: false },
        { label: 'ব্যয়', data: [31000,33000,29000,36000,37500,30756], backgroundColor: 'rgba(244,63,94,0.7)', borderRadius: 8, borderSkipped: false },
        { label: 'সঞ্চয়', data: [7000,9000,11000,8000,5500,14474], type: 'line', borderColor: 'rgba(6,182,212,0.9)', backgroundColor: 'rgba(6,182,212,0.08)', borderWidth: 2.5, pointBackgroundColor: 'rgba(6,182,212,1)', pointRadius: 5, pointHoverRadius: 8, tension: 0.4, fill: true }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, padding: 20, color: 'rgba(241,245,249,0.7)', font: { size: 12 } } },
        tooltip: { backgroundColor: 'rgba(13,21,37,0.95)', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, padding: 14, cornerRadius: 12, titleColor: '#f1f5f9', bodyColor: '#94a3b8', callbacks: { label: ctx => ` ৳${ctx.raw.toLocaleString()}` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: 'rgba(148,163,184,0.6)', font: { size: 12 } }, border: { display: false } },
        y: { grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }, ticks: { color: 'rgba(148,163,184,0.6)', font: { size: 11 }, callback: v => '৳'+v.toLocaleString() }, border: { display: false } }
      },
      interaction: { intersect: false, mode: 'index' }
    }
  });
});
</script>
</body>
</html>