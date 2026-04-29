<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AdminOS — Control Center</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #060912;
  --bg2: #0d1117;
  --bg3: #111827;
  --surface: #161d2e;
  --surface2: #1e2a3b;
  --border: rgba(99,179,237,0.1);
  --border2: rgba(99,179,237,0.2);
  --accent: #3b82f6;
  --accent2: #6366f1;
  --accent3: #8b5cf6;
  --teal: #14b8a6;
  --green: #10b981;
  --amber: #f59e0b;
  --red: #ef4444;
  --text: #e2e8f0;
  --text2: #94a3b8;
  --text3: #64748b;
  --mono: 'JetBrains Mono', monospace;
  --sans: 'Sora', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--sans); background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }

/* ── SCANLINE OVERLAY ── */
body::before {
  content: '';
  position: fixed; inset: 0; z-index: 9999;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
  pointer-events: none;
}

/* ── GRID BACKGROUND ── */
.grid-bg {
  position: fixed; inset: 0; z-index: 0;
  background-image:
    linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}
.grid-bg::after {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%);
}

/* ─────────── LOGIN SCREEN ─────────── */
#login-screen {
  position: fixed; inset: 0; z-index: 100;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg);
}
.login-box {
  position: relative; z-index: 1;
  width: 420px;
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 0 0 80px rgba(59,130,246,0.12), 0 0 40px rgba(0,0,0,0.6);
}
.login-logo {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 36px;
}
.login-logo-icon {
  width: 48px; height: 48px; border-radius: 14px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; color: #fff;
  box-shadow: 0 8px 24px rgba(99,102,241,0.4);
}
.login-logo-text { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
.login-logo-text span { color: #3b82f6; }
.login-headline { font-size: 28px; font-weight: 800; line-height: 1.2; margin-bottom: 8px; }
.login-sub { font-size: 13px; color: var(--text2); margin-bottom: 32px; }
.login-field { margin-bottom: 18px; }
.login-field label { display: block; font-size: 11px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.login-field input {
  width: 100%; padding: 14px 16px;
  background: var(--bg3); border: 1px solid var(--border2);
  border-radius: 12px; font-family: var(--mono); font-size: 13px;
  color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
.login-field input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
.login-hint {
  font-size: 11px; color: var(--text3); background: rgba(59,130,246,0.08);
  border: 1px solid rgba(59,130,246,0.15); border-radius: 8px;
  padding: 10px 12px; margin-bottom: 24px; font-family: var(--mono);
}
.login-btn {
  width: 100%; padding: 16px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border: none; border-radius: 12px;
  font-family: var(--sans); font-size: 15px; font-weight: 700;
  color: #fff; cursor: pointer; transition: all 0.3s;
  box-shadow: 0 8px 24px rgba(99,102,241,0.35);
}
.login-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,0.5); }
.login-btn:active { transform: translateY(0); }
.login-error { display: none; color: #ef4444; font-size: 12px; margin-top: 12px; text-align: center; }

/* ─────────── ADMIN LAYOUT ─────────── */
#admin-app { display: none; min-height: 100vh; }

/* SIDEBAR */
.sidebar {
  position: fixed; top: 0; left: 0; bottom: 0;
  width: 260px; background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  z-index: 50; transition: transform 0.3s;
}
.sidebar-logo {
  padding: 28px 24px 20px;
  display: flex; align-items: center; gap: 12px;
  border-bottom: 1px solid var(--border);
}
.sidebar-logo-icon {
  width: 40px; height: 40px; border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: #fff;
}
.sidebar-logo-text { font-size: 18px; font-weight: 800; }
.sidebar-logo-text span { color: #3b82f6; }
.sidebar-badge { font-size: 9px; font-weight: 700; color: #fff; background: #ef4444; border-radius: 4px; padding: 2px 6px; }
.sidebar-nav { flex: 1; padding: 16px 12px; overflow-y: auto; }
.sidebar-section { margin-bottom: 20px; }
.sidebar-section-label {
  font-size: 9px; font-weight: 700; color: var(--text3);
  text-transform: uppercase; letter-spacing: 1.5px;
  padding: 0 12px; margin-bottom: 8px;
}
.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 10px;
  font-size: 13px; font-weight: 500; color: var(--text2);
  cursor: pointer; transition: all 0.15s; margin-bottom: 2px;
  border: none; background: none; width: 100%; text-align: left;
}
.nav-item:hover { background: rgba(59,130,246,0.08); color: var(--text); }
.nav-item.active { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }
.nav-item-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.nav-item.active .nav-item-icon { background: rgba(59,130,246,0.2); }
.nav-item-count { margin-left: auto; font-size: 11px; font-family: var(--mono); background: var(--surface2); border-radius: 999px; padding: 2px 8px; color: var(--text3); }
.sidebar-footer {
  padding: 16px; border-top: 1px solid var(--border);
}
.admin-profile {
  display: flex; align-items: center; gap: 10px;
  padding: 12px; background: var(--surface2); border-radius: 12px;
}
.admin-avatar {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0;
}
.admin-info { flex: 1; min-width: 0; }
.admin-name { font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.admin-role { font-size: 10px; color: var(--accent); font-weight: 600; }
.logout-btn { background: none; border: none; color: var(--text3); cursor: pointer; padding: 4px; border-radius: 6px; transition: color 0.15s; font-size: 14px; }
.logout-btn:hover { color: #ef4444; }

/* MAIN CONTENT */
.main { margin-left: 260px; min-height: 100vh; }
.topbar {
  position: sticky; top: 0; z-index: 40;
  background: rgba(6,9,18,0.85); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 0 32px; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
}
.topbar-left { display: flex; align-items: center; gap: 16px; }
.topbar-title { font-size: 17px; font-weight: 700; }
.topbar-breadcrumb { font-size: 12px; color: var(--text3); font-family: var(--mono); }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981; animation: pulse-dot 2s infinite; }
@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.5} }
.topbar-time { font-family: var(--mono); font-size: 12px; color: var(--text2); }

.content { padding: 32px; }
.page { display: none; }
.page.active { display: block; }

/* STAT CARDS */
.stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 28px; }
.stat-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 18px; padding: 22px;
  position: relative; overflow: hidden; cursor: default;
  transition: transform 0.2s, border-color 0.2s;
}
.stat-card:hover { transform: translateY(-3px); border-color: var(--border2); }
.stat-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
}
.stat-card.blue::before { background: linear-gradient(90deg, #3b82f6, #6366f1); }
.stat-card.green::before { background: linear-gradient(90deg, #10b981, #34d399); }
.stat-card.amber::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.stat-card.red::before { background: linear-gradient(90deg, #ef4444, #f97316); }
.stat-icon { font-size: 26px; margin-bottom: 14px; }
.stat-label { font-size: 11px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
.stat-value { font-size: 34px; font-weight: 800; line-height: 1; font-family: var(--mono); }
.stat-sub { font-size: 11px; color: var(--text3); margin-top: 6px; }

/* SECTION HEADER */
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.section-title { font-size: 17px; font-weight: 700; }

/* CARD */
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; }
.card-header { padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.card-title { font-size: 14px; font-weight: 700; }

/* BUTTONS */
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 9px; font-family: var(--sans); font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; }
.btn-primary { background: linear-gradient(135deg, #3b82f6, #6366f1); color: #fff; box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
.btn-primary:hover { box-shadow: 0 6px 20px rgba(99,102,241,0.45); transform: translateY(-1px); }
.btn-outline { background: transparent; border: 1px solid var(--border2); color: var(--text2); }
.btn-outline:hover { background: var(--surface2); color: var(--text); }
.btn-success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #34d399; }
.btn-success:hover { background: rgba(16,185,129,0.25); }
.btn-danger { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }
.btn-danger:hover { background: rgba(239,68,68,0.25); }
.btn-amber { background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); color: #fbbf24; }
.btn-amber:hover { background: rgba(245,158,11,0.25); }
.btn-sm { padding: 6px 12px; font-size: 11px; }
.btn-lg { padding: 12px 24px; font-size: 14px; }
.btn-xs { padding: 4px 8px; font-size: 10px; border-radius: 6px; }

/* USER TABLE */
.data-table { width: 100%; border-collapse: collapse; }
.data-table th {
  padding: 10px 16px; text-align: left;
  font-size: 10px; font-weight: 700; color: var(--text3);
  text-transform: uppercase; letter-spacing: 1px;
  background: var(--bg3); border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.data-table td {
  padding: 12px 16px; border-bottom: 1px solid var(--border);
  font-size: 12px; vertical-align: middle;
}
.data-table tr:last-child td { border-bottom: none; }
.data-table tbody tr { transition: background 0.1s; }
.data-table tbody tr:hover td { background: rgba(59,130,246,0.04); }

/* USER AVATAR */
.user-avatar {
  width: 34px; height: 34px; border-radius: 10px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; flex-shrink: 0;
}
.user-cell { display: flex; align-items: center; gap: 10px; }
.user-name { font-weight: 600; font-size: 13px; }
.user-email { font-size: 11px; color: var(--text3); font-family: var(--mono); }

/* BADGES */
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; }
.badge-green { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.25); }
.badge-red { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }
.badge-amber { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.25); }
.badge-blue { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.25); }
.badge-purple { background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.25); }

/* ACTION BUTTONS */
.action-group { display: flex; gap: 4px; }
.action-btn {
  width: 28px; height: 28px; border-radius: 7px;
  border: 1px solid var(--border); background: var(--surface2);
  color: var(--text2); cursor: pointer; font-size: 11px;
  display: inline-flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.action-btn:hover { transform: scale(1.1); }
.action-btn.view:hover { background: rgba(59,130,246,0.2); color: #60a5fa; border-color: rgba(59,130,246,0.4); }
.action-btn.edit:hover { background: rgba(245,158,11,0.2); color: #fbbf24; border-color: rgba(245,158,11,0.4); }
.action-btn.delete:hover { background: rgba(239,68,68,0.2); color: #f87171; border-color: rgba(239,68,68,0.4); }

/* SEARCH BAR */
.search-bar {
  display: flex; gap: 10px; align-items: center;
  padding: 14px 20px; background: var(--bg3);
  border-bottom: 1px solid var(--border);
}
.search-input-wrap { position: relative; flex: 1; }
.search-input-wrap input {
  width: 100%; padding: 9px 12px 9px 34px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 9px; font-family: var(--sans); font-size: 12px;
  color: var(--text); outline: none;
  transition: border-color 0.2s;
}
.search-input-wrap input:focus { border-color: var(--accent); }
.search-input-wrap::before {
  content: '🔍'; position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
  font-size: 12px;
}

/* MODAL */
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none; transition: opacity 0.2s;
}
.modal-overlay.open { opacity: 1; pointer-events: all; }
.modal {
  background: var(--surface); border: 1px solid var(--border2);
  border-radius: 24px; width: 560px; max-width: 90vw;
  max-height: 90vh; overflow-y: auto;
  transform: scale(0.95) translateY(20px);
  transition: transform 0.25s, opacity 0.25s;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6);
}
.modal-overlay.open .modal { transform: scale(1) translateY(0); }
.modal-header { padding: 24px 28px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); }
.modal-title { font-size: 17px; font-weight: 800; }
.modal-close { background: none; border: none; color: var(--text3); cursor: pointer; font-size: 18px; transition: color 0.15s; }
.modal-close:hover { color: #ef4444; }
.modal-body { padding: 24px 28px; }
.modal-footer { padding: 16px 28px 24px; display: flex; gap: 10px; justify-content: flex-end; border-top: 1px solid var(--border); }

/* FORM */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: 1/-1; }
.form-label { font-size: 10px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.8px; }
.form-input {
  padding: 10px 13px; background: var(--bg3);
  border: 1px solid var(--border2); border-radius: 9px;
  font-family: var(--sans); font-size: 13px; color: var(--text);
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
.form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
.form-select {
  padding: 10px 13px; background: var(--bg3);
  border: 1px solid var(--border2); border-radius: 9px;
  font-family: var(--sans); font-size: 13px; color: var(--text);
  outline: none; cursor: pointer;
}

/* USER DETAIL VIEW */
.detail-header {
  display: flex; align-items: flex-start; gap: 20px;
  padding: 24px; background: var(--bg3);
  border-radius: 16px; margin-bottom: 20px;
  border: 1px solid var(--border);
}
.detail-avatar { width: 72px; height: 72px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; flex-shrink: 0; }
.detail-name { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.detail-meta { font-size: 12px; color: var(--text3); font-family: var(--mono); }
.detail-badges { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.detail-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
.detail-card-label { font-size: 10px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
.detail-card-value { font-size: 15px; font-weight: 600; font-family: var(--mono); }

/* DASHBOARD-SPECIFIC */
.activity-item { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); align-items: flex-start; }
.activity-item:last-child { border-bottom: none; }
.activity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.activity-text { font-size: 12px; color: var(--text2); }
.activity-time { font-size: 10px; color: var(--text3); font-family: var(--mono); margin-top: 2px; }

.db-table-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.db-table-row:last-child { border-bottom: none; }
.db-table-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
.db-table-name { font-size: 13px; font-weight: 600; flex: 1; }
.db-table-count { font-size: 12px; font-family: var(--mono); color: var(--text3); }
.db-table-bar { height: 3px; border-radius: 2px; background: var(--border); position: relative; width: 80px; }
.db-table-bar-fill { position: absolute; top: 0; left: 0; height: 100%; border-radius: 2px; }

/* TOASTER */
.toaster {
  position: fixed; bottom: 24px; right: 24px; z-index: 1000;
  display: flex; flex-direction: column; gap: 8px;
}
.toast {
  background: var(--surface); border: 1px solid var(--border2);
  border-radius: 12px; padding: 12px 18px;
  font-size: 13px; font-weight: 500;
  display: flex; align-items: center; gap: 10px;
  min-width: 260px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  transform: translateX(120%); transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
}
.toast.show { transform: translateX(0); }
.toast-success { border-left: 3px solid #10b981; }
.toast-error { border-left: 3px solid #ef4444; }
.toast-info { border-left: 3px solid #3b82f6; }

/* CONFIRM DIALOG */
.confirm-overlay {
  position: fixed; inset: 0; z-index: 300;
  background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center;
  display: none;
}
.confirm-box {
  background: var(--surface); border: 1px solid #ef4444;
  border-radius: 18px; padding: 32px; width: 380px;
  text-align: center; box-shadow: 0 0 60px rgba(239,68,68,0.2);
}
.confirm-icon { font-size: 48px; margin-bottom: 16px; }
.confirm-title { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
.confirm-msg { font-size: 13px; color: var(--text2); margin-bottom: 24px; }
.confirm-btns { display: flex; gap: 10px; justify-content: center; }

/* CHART BARS */
.mini-chart { display: flex; align-items: flex-end; gap: 4px; height: 48px; }
.mini-bar { flex: 1; border-radius: 4px 4px 0 0; background: rgba(59,130,246,0.3); transition: background 0.2s; }
.mini-bar:hover { background: rgba(59,130,246,0.7); }

/* PILLS filter */
.filter-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-pill {
  padding: 5px 12px; border-radius: 999px; font-size: 11px; font-weight: 600;
  cursor: pointer; border: 1px solid var(--border); color: var(--text3); background: transparent;
  transition: all 0.15s;
}
.filter-pill.active, .filter-pill:hover { background: rgba(59,130,246,0.15); border-color: rgba(59,130,246,0.4); color: #60a5fa; }

/* SCROLLBAR */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--surface2); border-radius: 3px; }

/* ANIMATION */
@keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
.page.active { animation: fadeIn 0.25s ease; }

@media (max-width: 1100px) { .stat-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 768px) {
  .sidebar { transform: translateX(-260px); }
  .main { margin-left: 0; }
  .stat-grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>
<div class="grid-bg"></div>

<!-- ═══════════ LOGIN ═══════════ -->
<div id="login-screen">
  <div class="login-box">
    <div class="login-logo">
      <div class="login-logo-icon">⬡</div>
      <div class="login-logo-text">Admin<span>OS</span></div>
    </div>
    <div class="login-headline">Secure<br>Access Portal</div>
    <div class="login-sub">Authorized personnel only. All activity is logged.</div>
    <div class="login-hint">🔑 admin@lp.com &nbsp;/&nbsp; admin123</div>
    <div class="login-field">
      <label>Email Address</label>
      <input type="email" id="login-email" placeholder="admin@lp.com" value="admin@lp.com">
    </div>
    <div class="login-field">
      <label>Password</label>
      <input type="password" id="login-pass" placeholder="••••••••" value="admin123">
    </div>
    <button class="login-btn" onclick="doLogin()">Access Control Center →</button>
    <div class="login-error" id="login-error">⚠ Invalid credentials. Access denied.</div>
  </div>
</div>

<!-- ═══════════ ADMIN APP ═══════════ -->
<div id="admin-app">
  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon">⬡</div>
      <div>
        <div class="sidebar-logo-text">Admin<span>OS</span></div>
        <span class="sidebar-badge">SUPER ADMIN</span>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="sidebar-section">
        <div class="sidebar-section-label">Overview</div>
        <button class="nav-item active" onclick="showPage('dashboard',this)">
          <div class="nav-item-icon">📊</div> Dashboard
        </button>
        <button class="nav-item" onclick="showPage('database',this)">
          <div class="nav-item-icon">🗄</div> Database Tables
          <span class="nav-item-count">16</span>
        </button>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-label">User Management</div>
        <button class="nav-item" onclick="showPage('users',this)">
          <div class="nav-item-icon">👥</div> All Users
          <span class="nav-item-count" id="nav-user-count">0</span>
        </button>
        <button class="nav-item" onclick="showPage('finance',this)">
          <div class="nav-item-icon">💰</div> Finance Data
        </button>
        <button class="nav-item" onclick="showPage('health',this)">
          <div class="nav-item-icon">❤️</div> Health Profiles
        </button>
        <button class="nav-item" onclick="showPage('tasks',this)">
          <div class="nav-item-icon">✅</div> Tasks & Routines
        </button>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-label">System</div>
        <button class="nav-item" onclick="showPage('logs',this)">
          <div class="nav-item-icon">📋</div> Activity Logs
        </button>
        <button class="nav-item" onclick="showPage('settings',this)">
          <div class="nav-item-icon">⚙️</div> Settings
        </button>
      </div>
    </nav>
    <div class="sidebar-footer">
      <div class="admin-profile">
        <div class="admin-avatar">A</div>
        <div class="admin-info">
          <div class="admin-name">admin@lp.com</div>
          <div class="admin-role">Super Administrator</div>
        </div>
        <button class="logout-btn" onclick="doLogout()" title="Logout">⏻</button>
      </div>
    </div>
  </aside>

  <!-- MAIN -->
  <main class="main">
    <header class="topbar">
      <div class="topbar-left">
        <div class="topbar-title" id="page-title">Dashboard</div>
        <div class="topbar-breadcrumb" id="page-breadcrumb">AdminOS / Dashboard</div>
      </div>
      <div class="topbar-right">
        <div class="status-dot"></div>
        <div class="topbar-time" id="clock"></div>
        <button class="btn btn-primary btn-sm" onclick="showPage('users', document.querySelector('[onclick*=users]'))">+ Add User</button>
      </div>
    </header>

    <div class="content">

      <!-- ── DASHBOARD PAGE ── -->
      <div class="page active" id="page-dashboard">
        <div class="stat-grid">
          <div class="stat-card blue">
            <div class="stat-icon">👤</div>
            <div class="stat-label">Total Users</div>
            <div class="stat-value" id="s-users">0</div>
            <div class="stat-sub">Registered accounts</div>
          </div>
          <div class="stat-card green">
            <div class="stat-icon">✅</div>
            <div class="stat-label">Active Users</div>
            <div class="stat-value" id="s-active">0</div>
            <div class="stat-sub">Status: active</div>
          </div>
          <div class="stat-card amber">
            <div class="stat-icon">💸</div>
            <div class="stat-label">Transactions</div>
            <div class="stat-value" id="s-txn">247</div>
            <div class="stat-sub">Total records</div>
          </div>
          <div class="stat-card red">
            <div class="stat-icon">🗄</div>
            <div class="stat-label">DB Tables</div>
            <div class="stat-value">16</div>
            <div class="stat-sub">Active tables</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 360px;gap:20px;margin-bottom:24px;">
          <!-- Recent Users -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">👥 Recent Users</div>
              <button class="btn btn-outline btn-sm" onclick="showPage('users', document.querySelectorAll('.nav-item')[2])">View All</button>
            </div>
            <div style="overflow-x:auto">
              <table class="data-table" id="dash-user-table"></table>
            </div>
          </div>
          <!-- Activity -->
          <div class="card">
            <div class="card-header"><div class="card-title">📋 Recent Activity</div></div>
            <div style="padding:16px 20px" id="activity-log"></div>
          </div>
        </div>

        <!-- DB overview -->
        <div class="card">
          <div class="card-header"><div class="card-title">🗄 Database Tables Overview</div></div>
          <div style="padding:16px 24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:0" id="db-overview"></div>
        </div>
      </div>

      <!-- ── USERS PAGE ── -->
      <div class="page" id="page-users">
        <div class="section-header" style="margin-bottom:16px">
          <div class="section-title">All Users</div>
          <button class="btn btn-primary" onclick="openModal('add')">+ Add User</button>
        </div>
        <div class="card">
          <div class="search-bar">
            <div class="search-input-wrap" style="flex:1">
              <input type="text" id="user-search" placeholder="Search by name, email, phone..." oninput="filterUsers()">
            </div>
            <div class="filter-pills">
              <button class="filter-pill active" onclick="setFilter('all',this)">All</button>
              <button class="filter-pill" onclick="setFilter('active',this)">Active</button>
              <button class="filter-pill" onclick="setFilter('inactive',this)">Inactive</button>
              <button class="filter-pill" onclick="setFilter('premium',this)">Premium</button>
            </div>
          </div>
          <div style="overflow-x:auto">
            <table class="data-table" id="users-table">
              <thead>
                <tr>
                  <th>User</th><th>Email</th><th>Phone</th>
                  <th>Balance</th><th>Status</th><th>Plan</th>
                  <th>Joined</th><th>Actions</th>
                </tr>
              </thead>
              <tbody id="users-body"></tbody>
            </table>
          </div>
          <div style="padding:14px 20px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border)">
            <div style="font-size:12px;color:var(--text3)" id="user-count-label">0 users</div>
            <div style="display:flex;gap:6px" id="pagination"></div>
          </div>
        </div>
      </div>

      <!-- ── DATABASE PAGE ── -->
      <div class="page" id="page-database">
        <div class="section-header"><div class="section-title">Database Tables</div></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px" id="db-cards"></div>
      </div>

      <!-- ── FINANCE PAGE ── -->
      <div class="page" id="page-finance">
        <div class="section-header"><div class="section-title">Finance Data</div></div>
        <div class="stat-grid" style="margin-bottom:20px">
          <div class="stat-card blue"><div class="stat-icon">💰</div><div class="stat-label">Total Transactions</div><div class="stat-value">247</div><div class="stat-sub">All time</div></div>
          <div class="stat-card green"><div class="stat-icon">📈</div><div class="stat-label">Total Income</div><div class="stat-value">৳1.2M</div><div class="stat-sub">Across all users</div></div>
          <div class="stat-card amber"><div class="stat-icon">📉</div><div class="stat-label">Total Expenses</div><div class="stat-value">৳840K</div><div class="stat-sub">Across all users</div></div>
          <div class="stat-card red"><div class="stat-icon">🎯</div><div class="stat-label">Active Goals</div><div class="stat-value">38</div><div class="stat-sub">Financial goals</div></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">💳 Transaction Records</div></div>
          <div style="overflow-x:auto"><table class="data-table">
            <thead><tr><th>User</th><th>Type</th><th>Amount</th><th>Category</th><th>Date</th><th>Status</th></tr></thead>
            <tbody id="finance-body"></tbody>
          </table></div>
        </div>
      </div>

      <!-- ── HEALTH PAGE ── -->
      <div class="page" id="page-health">
        <div class="section-header"><div class="section-title">Health Profiles</div></div>
        <div class="card">
          <div class="card-header"><div class="card-title">❤️ User Health Records</div></div>
          <div style="overflow-x:auto"><table class="data-table">
            <thead><tr><th>User</th><th>Age</th><th>Weight</th><th>Height</th><th>Blood Type</th><th>Conditions</th><th>Last Updated</th></tr></thead>
            <tbody id="health-body"></tbody>
          </table></div>
        </div>
      </div>

      <!-- ── TASKS PAGE ── -->
      <div class="page" id="page-tasks">
        <div class="section-header"><div class="section-title">Tasks & Routines</div></div>
        <div class="card">
          <div class="card-header"><div class="card-title">✅ All Tasks</div></div>
          <div style="overflow-x:auto"><table class="data-table">
            <thead><tr><th>User</th><th>Task</th><th>Priority</th><th>Due Date</th><th>Status</th></tr></thead>
            <tbody id="tasks-body"></tbody>
          </table></div>
        </div>
      </div>

      <!-- ── LOGS PAGE ── -->
      <div class="page" id="page-logs">
        <div class="section-header"><div class="section-title">Activity Logs</div></div>
        <div class="card">
          <div id="logs-list" style="padding:8px 0"></div>
        </div>
      </div>

      <!-- ── SETTINGS PAGE ── -->
      <div class="page" id="page-settings">
        <div class="section-header"><div class="section-title">Settings</div></div>
        <div style="max-width:600px">
          <div class="card" style="padding:28px;margin-bottom:20px">
            <div style="font-size:15px;font-weight:700;margin-bottom:20px">Admin Account</div>
            <div class="form-group" style="margin-bottom:14px">
              <div class="form-label">Admin Email</div>
              <input class="form-input" value="admin@lp.com" readonly style="opacity:0.7">
            </div>
            <div class="form-group" style="margin-bottom:14px">
              <div class="form-label">Display Name</div>
              <input class="form-input" value="Super Administrator">
            </div>
            <button class="btn btn-primary" onclick="showToast('Settings saved','success')">Save Changes</button>
          </div>
          <div class="card" style="padding:28px">
            <div style="font-size:15px;font-weight:700;margin-bottom:20px">Danger Zone</div>
            <button class="btn btn-danger" onclick="showToast('Export initiated','info')">🗄 Export All Data</button>
          </div>
        </div>
      </div>

      <!-- ── USER DETAIL PAGE ── -->
      <div class="page" id="page-user-detail">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <button class="btn btn-outline" onclick="showPage('users',document.querySelectorAll('.nav-item')[2])">← Back</button>
          <div class="section-title">User Dashboard</div>
        </div>
        <div id="user-detail-content"></div>
      </div>

    </div><!-- /content -->
  </main>
</div>

<!-- MODALS -->
<div class="modal-overlay" id="modal-overlay" onclick="if(event.target===this)closeModal()">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title" id="modal-title">Add User</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-grid">
        <div class="form-group"><div class="form-label">First Name *</div><input class="form-input" id="f-fname" placeholder="Rahim"></div>
        <div class="form-group"><div class="form-label">Last Name *</div><input class="form-input" id="f-lname" placeholder="Uddin"></div>
        <div class="form-group full"><div class="form-label">Email *</div><input class="form-input" id="f-email" type="email" placeholder="user@example.com"></div>
        <div class="form-group"><div class="form-label">Phone</div><input class="form-input" id="f-phone" placeholder="+880-17xx-xxxxxx"></div>
        <div class="form-group"><div class="form-label">Balance (৳)</div><input class="form-input" id="f-balance" type="number" placeholder="0.00"></div>
        <div class="form-group"><div class="form-label">Status</div>
          <select class="form-select" id="f-status">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div class="form-group"><div class="form-label">Plan</div>
          <select class="form-select" id="f-plan">
            <option value="free">Free</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <div class="form-group full"><div class="form-label">Address</div><input class="form-input" id="f-address" placeholder="Dhaka, Bangladesh"></div>
        <div class="form-group full"><div class="form-label">Password</div><input class="form-input" id="f-password" type="password" placeholder="Leave blank to keep current"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" id="modal-save-btn" onclick="saveUser()">Save User</button>
    </div>
  </div>
</div>

<!-- CONFIRM -->
<div class="confirm-overlay" id="confirm-overlay">
  <div class="confirm-box">
    <div class="confirm-icon">⚠️</div>
    <div class="confirm-title">Delete User?</div>
    <div class="confirm-msg" id="confirm-msg">This action cannot be undone. All user data will be permanently removed.</div>
    <div class="confirm-btns">
      <button class="btn btn-outline" onclick="closeConfirm()">Cancel</button>
      <button class="btn btn-danger" id="confirm-ok">Delete Permanently</button>
    </div>
  </div>
</div>

<!-- TOASTER -->
<div class="toaster" id="toaster"></div>

<script>
// ─── DATA ───
const ADMIN = { email: 'admin@lp.com', password: 'admin123' };

let users = [
  { id:1, fname:'Rahim', lname:'Uddin', email:'rahim@example.com', phone:'+880-1711-111111', balance:45200, status:'active', plan:'premium', address:'Dhaka, Bangladesh', joined:'2024-01-15', tasks:12, transactions:34 },
  { id:2, fname:'Fatema', lname:'Khatun', email:'fatema@example.com', phone:'+880-1822-222222', balance:12800, status:'active', plan:'free', address:'Chittagong, Bangladesh', joined:'2024-02-20', tasks:7, transactions:18 },
  { id:3, fname:'Karim', lname:'Hossain', email:'karim@example.com', phone:'+880-1933-333333', balance:89300, status:'active', plan:'enterprise', address:'Sylhet, Bangladesh', joined:'2024-03-10', tasks:23, transactions:56 },
  { id:4, fname:'Sumaiya', lname:'Begum', email:'sumaiya@example.com', phone:'+880-1644-444444', balance:3400, status:'inactive', plan:'free', address:'Rajshahi, Bangladesh', joined:'2024-04-05', tasks:3, transactions:8 },
  { id:5, fname:'Arif', lname:'Khan', email:'arif@example.com', phone:'+880-1755-555555', balance:67100, status:'active', plan:'premium', address:'Khulna, Bangladesh', joined:'2024-05-12', tasks:18, transactions:42 },
  { id:6, fname:'Nasrin', lname:'Akter', email:'nasrin@example.com', phone:'+880-1566-666666', balance:21500, status:'active', plan:'free', address:'Barisal, Bangladesh', joined:'2024-06-01', tasks:9, transactions:27 },
  { id:7, fname:'Rafiqul', lname:'Islam', email:'rafiq@example.com', phone:'+880-1877-777777', balance:134000, status:'active', plan:'enterprise', address:'Comilla, Bangladesh', joined:'2024-07-22', tasks:31, transactions:89 },
  { id:8, fname:'Mitu', lname:'Das', email:'mitu@example.com', phone:'+880-1988-888888', balance:5600, status:'inactive', plan:'free', address:'Mymensingh, Bangladesh', joined:'2024-08-14', tasks:2, transactions:5 },
];

const dbTables = [
  { name:'users', icon:'👤', color:'#3b82f6', rows:8, cols:12, indexes:3 },
  { name:'transactions', icon:'💸', color:'#10b981', rows:247, cols:10, indexes:4 },
  { name:'budgets', icon:'📊', color:'#f59e0b', rows:42, cols:8, indexes:2 },
  { name:'ai_suggestions', icon:'🤖', color:'#8b5cf6', rows:183, cols:7, indexes:2 },
  { name:'health_profiles', icon:'❤️', color:'#ef4444', rows:8, cols:15, indexes:3 },
  { name:'reports', icon:'📄', color:'#6366f1', rows:56, cols:9, indexes:2 },
  { name:'routines', icon:'🔄', color:'#14b8a6', rows:94, cols:8, indexes:2 },
  { name:'meetings', icon:'🤝', color:'#f97316', rows:37, cols:11, indexes:3 },
  { name:'expenses', icon:'💳', color:'#ec4899', rows:312, cols:9, indexes:3 },
  { name:'tasks', icon:'✅', color:'#22c55e', rows:168, cols:10, indexes:2 },
  { name:'prayer_times', icon:'🕌', color:'#a78bfa', rows:365, cols:6, indexes:1 },
  { name:'income_sources', icon:'📈', color:'#0ea5e9', rows:29, cols:8, indexes:2 },
  { name:'financial_goals', icon:'🎯', color:'#fbbf24', rows:38, cols:10, indexes:2 },
  { name:'investments', icon:'📉', color:'#34d399', rows:61, cols:11, indexes:2 },
  { name:'savings', icon:'🐷', color:'#fb7185', rows:47, cols:8, indexes:2 },
  { name:'user_finance_profiles', icon:'🛡', color:'#64748b', rows:8, cols:14, indexes:3 },
];

const avatarColors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899','#14b8a6','#f97316'];

let editingId = null, currentFilter = 'all', currentPage = 0, pendingDeleteId = null;
const PER_PAGE = 5;
const activityLog = [];

// ─── UTILS ───
function getInitials(u){ return (u.fname[0]+u.lname[0]).toUpperCase(); }
function getColor(id){ return avatarColors[(id-1)%avatarColors.length]; }
function fmt(n){ return Number(n).toLocaleString('en-US'); }
function getFilteredUsers(){
  const q = document.getElementById('user-search')?.value.toLowerCase()||'';
  return users.filter(u=>{
    const match = !q || (u.fname+' '+u.lname+u.email+u.phone).toLowerCase().includes(q);
    const filt = currentFilter==='all' || u.status===currentFilter || u.plan===currentFilter;
    return match && filt;
  });
}

// ─── LOGIN ───
function doLogin(){
  const e = document.getElementById('login-email').value.trim();
  const p = document.getElementById('login-pass').value;
  if(e===ADMIN.email && p===ADMIN.password){
    document.getElementById('login-screen').style.display='none';
    document.getElementById('admin-app').style.display='block';
    initApp();
  } else {
    const err = document.getElementById('login-error');
    err.style.display='block';
    setTimeout(()=>err.style.display='none',3000);
  }
}
document.getElementById('login-pass').addEventListener('keydown',e=>{ if(e.key==='Enter')doLogin(); });

function doLogout(){
  document.getElementById('admin-app').style.display='none';
  document.getElementById('login-screen').style.display='flex';
}

// ─── INIT ───
function initApp(){
  updateStats();
  renderDashboard();
  renderUsers();
  renderDbCards();
  renderFinance();
  renderHealth();
  renderTasks();
  renderLogs();
  updateClock();
  setInterval(updateClock, 1000);
  document.getElementById('nav-user-count').textContent = users.length;
}

function updateClock(){
  document.getElementById('clock').textContent = new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
}

// ─── NAVIGATION ───
function showPage(name, btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  if(btn) btn.classList.add('active');
  document.getElementById('page-title').textContent = name.charAt(0).toUpperCase()+name.slice(1).replace('-',' ');
  document.getElementById('page-breadcrumb').textContent = 'AdminOS / '+name.charAt(0).toUpperCase()+name.slice(1);
}

// ─── STATS ───
function updateStats(){
  document.getElementById('s-users').textContent = users.length;
  document.getElementById('s-active').textContent = users.filter(u=>u.status==='active').length;
}

// ─── DASHBOARD ───
function renderDashboard(){
  // mini user table
  const tbl = document.getElementById('dash-user-table');
  tbl.innerHTML = `<thead><tr><th>User</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead><tbody>`+
    users.slice(0,5).map(u=>`<tr>
      <td><div class="user-cell"><div class="user-avatar" style="background:${getColor(u.id)}20;color:${getColor(u.id)}">${getInitials(u)}</div><div class="user-name">${u.fname} ${u.lname}</div></div></td>
      <td style="color:var(--text3);font-family:var(--mono);font-size:11px">${u.email}</td>
      <td><span class="badge ${u.status==='active'?'badge-green':'badge-red'}">${u.status}</span></td>
      <td><div class="action-group">
        <button class="action-btn view" onclick="viewUser(${u.id})" title="View">👁</button>
        <button class="action-btn edit" onclick="openModal('edit',${u.id})" title="Edit">✏</button>
        <button class="action-btn delete" onclick="confirmDelete(${u.id})" title="Delete">🗑</button>
      </div></td>
    </tr>`).join('')+`</tbody>`;

  // activity
  const acts = [
    {icon:'👤',color:'#3b82f6',text:'New user Rahim Uddin registered',time:'2 min ago'},
    {icon:'💸',color:'#10b981',text:'Transaction of ৳5,200 recorded for Karim',time:'14 min ago'},
    {icon:'✏',color:'#f59e0b',text:'User Fatema profile updated',time:'1 hr ago'},
    {icon:'🗑',color:'#ef4444',text:'Task deleted by Arif Khan',time:'3 hr ago'},
    {icon:'📊',color:'#8b5cf6',text:'Budget created for Nasrin Akter',time:'5 hr ago'},
  ];
  document.getElementById('activity-log').innerHTML = acts.map(a=>`
    <div class="activity-item">
      <div class="activity-dot" style="background:${a.color}"></div>
      <div><div class="activity-text">${a.icon} ${a.text}</div><div class="activity-time">${a.time}</div></div>
    </div>`).join('');

  // db overview
  const maxRows = Math.max(...dbTables.map(t=>t.rows));
  document.getElementById('db-overview').innerHTML = dbTables.slice(0,8).map(t=>`
    <div class="db-table-row">
      <div class="db-table-icon" style="background:${t.color}20;color:${t.color}">${t.icon}</div>
      <div class="db-table-name">${t.name}</div>
      <div class="db-table-bar"><div class="db-table-bar-fill" style="width:${Math.round(t.rows/maxRows*100)}%;background:${t.color}"></div></div>
      <div class="db-table-count">${t.rows} rows</div>
    </div>`).join('');
}

// ─── USERS ───
function renderUsers(){
  const filtered = getFilteredUsers();
  const total = filtered.length;
  const totalPages = Math.ceil(total/PER_PAGE);
  if(currentPage>=totalPages) currentPage=0;
  const slice = filtered.slice(currentPage*PER_PAGE, (currentPage+1)*PER_PAGE);

  document.getElementById('user-count-label').textContent = `${total} user${total!==1?'s':''}`;
  document.getElementById('users-body').innerHTML = slice.map(u=>`<tr>
    <td><div class="user-cell">
      <div class="user-avatar" style="background:${getColor(u.id)}25;color:${getColor(u.id)}">${getInitials(u)}</div>
      <div><div class="user-name">${u.fname} ${u.lname}</div><div style="font-size:10px;color:var(--text3)">#${u.id}</div></div>
    </div></td>
    <td style="font-family:var(--mono);font-size:11px;color:var(--text3)">${u.email}</td>
    <td style="font-family:var(--mono);font-size:11px">${u.phone}</td>
    <td style="font-family:var(--mono);color:#10b981;font-weight:600">৳${fmt(u.balance)}</td>
    <td><span class="badge ${u.status==='active'?'badge-green':'badge-red'}">${u.status==='active'?'● ':'○ '}${u.status}</span></td>
    <td><span class="badge ${u.plan==='premium'?'badge-amber':u.plan==='enterprise'?'badge-purple':'badge-blue'}">${u.plan}</span></td>
    <td style="font-family:var(--mono);font-size:11px;color:var(--text3)">${u.joined}</td>
    <td><div class="action-group">
      <button class="action-btn view" onclick="viewUser(${u.id})" title="View Dashboard">👁</button>
      <button class="action-btn edit" onclick="openModal('edit',${u.id})" title="Edit">✏</button>
      <button class="action-btn delete" onclick="confirmDelete(${u.id})" title="Delete">🗑</button>
    </div></td>
  </tr>`).join('') || `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text3)">No users found</td></tr>`;

  // pagination
  const pg = document.getElementById('pagination');
  pg.innerHTML = '';
  if(totalPages>1){
    for(let i=0;i<totalPages;i++){
      const b = document.createElement('button');
      b.className = 'btn btn-xs '+(i===currentPage?'btn-primary':'btn-outline');
      b.textContent = i+1;
      b.onclick = (()=>{ const p=i; return ()=>{ currentPage=p; renderUsers(); }; })();
      pg.appendChild(b);
    }
  }
  document.getElementById('nav-user-count').textContent = users.length;
}

function filterUsers(){ currentPage=0; renderUsers(); }
function setFilter(f,el){
  currentFilter=f;
  document.querySelectorAll('.filter-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  filterUsers();
}

// ─── USER DETAIL ───
function viewUser(id){
  const u = users.find(x=>x.id===id);
  if(!u) return;
  document.getElementById('user-detail-content').innerHTML = `
    <div class="detail-header">
      <div class="detail-avatar" style="background:${getColor(u.id)}25;color:${getColor(u.id)}">${getInitials(u)}</div>
      <div style="flex:1">
        <div class="detail-name">${u.fname} ${u.lname}</div>
        <div class="detail-meta">${u.email} · ${u.phone}</div>
        <div class="detail-meta">${u.address}</div>
        <div class="detail-badges">
          <span class="badge ${u.status==='active'?'badge-green':'badge-red'}">${u.status}</span>
          <span class="badge ${u.plan==='premium'?'badge-amber':u.plan==='enterprise'?'badge-purple':'badge-blue'}">${u.plan}</span>
          <span class="badge badge-blue">ID #${u.id}</span>
        </div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-amber" onclick="openModal('edit',${u.id})">✏ Edit</button>
        <button class="btn btn-danger" onclick="confirmDelete(${u.id})">🗑 Delete</button>
      </div>
    </div>
    <div class="detail-grid" style="margin-bottom:20px">
      <div class="detail-card"><div class="detail-card-label">Balance</div><div class="detail-card-value" style="color:#10b981">৳${fmt(u.balance)}</div></div>
      <div class="detail-card"><div class="detail-card-label">Joined</div><div class="detail-card-value">${u.joined}</div></div>
      <div class="detail-card"><div class="detail-card-label">Tasks</div><div class="detail-card-value">${u.tasks}</div></div>
      <div class="detail-card"><div class="detail-card-label">Transactions</div><div class="detail-card-value">${u.transactions}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card"><div class="card-header"><div class="card-title">💸 Recent Transactions</div></div>
        <div style="padding:16px 20px">
          ${[...Array(4)].map((_,i)=>`<div class="activity-item">
            <div class="activity-dot" style="background:${i%2===0?'#10b981':'#ef4444'}"></div>
            <div><div class="activity-text">${i%2===0?'Income':'Expense'}: ৳${fmt(Math.floor(Math.random()*50000+1000))}</div>
            <div class="activity-time">${i+1} day${i?'s':''} ago</div></div>
          </div>`).join('')}
        </div>
      </div>
      <div class="card"><div class="card-header"><div class="card-title">✅ Tasks</div></div>
        <div style="padding:16px 20px">
          ${['Complete budget review','Set financial goal','Log daily expenses','Update health profile'].map((t,i)=>`
          <div class="activity-item">
            <div class="activity-dot" style="background:${i<2?'#10b981':'#f59e0b'}"></div>
            <div><div class="activity-text">${t}</div>
            <div class="activity-time">${i<2?'Done':'Pending'}</div></div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
  showPage('user-detail', null);
}

// ─── MODAL ───
function openModal(mode, id=null){
  editingId = id;
  const u = id ? users.find(x=>x.id===id) : null;
  document.getElementById('modal-title').textContent = id ? `Edit User — ${u.fname} ${u.lname}` : 'Add New User';
  document.getElementById('modal-save-btn').textContent = id ? 'Update User' : 'Create User';
  document.getElementById('f-fname').value = u?.fname||'';
  document.getElementById('f-lname').value = u?.lname||'';
  document.getElementById('f-email').value = u?.email||'';
  document.getElementById('f-phone').value = u?.phone||'';
  document.getElementById('f-balance').value = u?.balance||'';
  document.getElementById('f-status').value = u?.status||'active';
  document.getElementById('f-plan').value = u?.plan||'free';
  document.getElementById('f-address').value = u?.address||'';
  document.getElementById('f-password').value = '';
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal(){ document.getElementById('modal-overlay').classList.remove('open'); editingId=null; }

function saveUser(){
  const fname=document.getElementById('f-fname').value.trim();
  const lname=document.getElementById('f-lname').value.trim();
  const email=document.getElementById('f-email').value.trim();
  if(!fname||!lname||!email){ showToast('Name and email are required','error'); return; }

  if(editingId){
    const u = users.find(x=>x.id===editingId);
    u.fname=fname; u.lname=lname; u.email=email;
    u.phone=document.getElementById('f-phone').value;
    u.balance=Number(document.getElementById('f-balance').value)||u.balance;
    u.status=document.getElementById('f-status').value;
    u.plan=document.getElementById('f-plan').value;
    u.address=document.getElementById('f-address').value;
    showToast(`User ${fname} updated successfully`,'success');
    logActivity(`Updated user: ${fname} ${lname}`);
  } else {
    const newId = Math.max(...users.map(u=>u.id))+1;
    users.push({ id:newId, fname, lname, email,
      phone:document.getElementById('f-phone').value||'N/A',
      balance:Number(document.getElementById('f-balance').value)||0,
      status:document.getElementById('f-status').value,
      plan:document.getElementById('f-plan').value,
      address:document.getElementById('f-address').value||'Bangladesh',
      joined:new Date().toISOString().split('T')[0], tasks:0, transactions:0 });
    showToast(`User ${fname} created`,'success');
    logActivity(`Created new user: ${fname} ${lname}`);
  }
  closeModal();
  renderUsers(); updateStats(); renderDashboard();
}

// ─── DELETE ───
function confirmDelete(id){
  const u = users.find(x=>x.id===id);
  pendingDeleteId = id;
  document.getElementById('confirm-msg').textContent = `Delete ${u.fname} ${u.lname}? This cannot be undone.`;
  document.getElementById('confirm-overlay').style.display='flex';
}
function closeConfirm(){ document.getElementById('confirm-overlay').style.display='none'; pendingDeleteId=null; }
document.getElementById('confirm-ok').onclick = function(){
  if(!pendingDeleteId) return;
  const u = users.find(x=>x.id===pendingDeleteId);
  const name=`${u.fname} ${u.lname}`;
  users = users.filter(x=>x.id!==pendingDeleteId);
  closeConfirm(); closeModal();
  renderUsers(); updateStats(); renderDashboard();
  showToast(`User ${name} deleted`,'error');
  logActivity(`Deleted user: ${name}`);
  if(document.getElementById('page-user-detail').classList.contains('active'))
    showPage('users', document.querySelectorAll('.nav-item')[2]);
};

// ─── DB CARDS ───
function renderDbCards(){
  document.getElementById('db-cards').innerHTML = dbTables.map(t=>`
    <div class="card" style="padding:22px;border-top:2px solid ${t.color}">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="width:44px;height:44px;border-radius:12px;background:${t.color}20;color:${t.color};display:flex;align-items:center;justify-content:center;font-size:20px">${t.icon}</div>
        <div><div style="font-size:14px;font-weight:700">${t.name}</div><div style="font-size:11px;color:var(--text3);font-family:var(--mono)">MySQL Table</div></div>
      </div>
      <div style="display:flex;gap:16px;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border)">
        <div style="flex:1;text-align:center"><div style="font-size:20px;font-weight:800;font-family:var(--mono)">${t.rows}</div><div style="font-size:10px;color:var(--text3);text-transform:uppercase">Rows</div></div>
        <div style="flex:1;text-align:center"><div style="font-size:20px;font-weight:800;font-family:var(--mono)">${t.cols}</div><div style="font-size:10px;color:var(--text3);text-transform:uppercase">Cols</div></div>
        <div style="flex:1;text-align:center"><div style="font-size:20px;font-weight:800;font-family:var(--mono)">${t.indexes}</div><div style="font-size:10px;color:var(--text3);text-transform:uppercase">Indexes</div></div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-outline btn-xs" style="flex:1;justify-content:center">📋 Schema</button>
        <button class="btn btn-primary btn-xs" style="flex:1;justify-content:center">📊 Data</button>
      </div>
    </div>`).join('');
}

// ─── FINANCE ───
function renderFinance(){
  const types=['Income','Expense','Transfer'];
  const cats=['Salary','Food','Transport','Bills','Shopping','Investment'];
  document.getElementById('finance-body').innerHTML = users.flatMap(u=>[...Array(3)].map((_, i)=>{
    const t=types[i%3], amt=Math.floor(Math.random()*50000+500);
    return `<tr>
      <td><div class="user-cell"><div class="user-avatar" style="background:${getColor(u.id)}20;color:${getColor(u.id)}">${getInitials(u)}</div>${u.fname} ${u.lname}</div></td>
      <td><span class="badge ${t==='Income'?'badge-green':t==='Expense'?'badge-red':'badge-blue'}">${t}</span></td>
      <td style="font-family:var(--mono);color:${t==='Income'?'#10b981':'#ef4444'}">৳${fmt(amt)}</td>
      <td>${cats[i%6]}</td>
      <td style="font-family:var(--mono);font-size:11px;color:var(--text3)">${u.joined}</td>
      <td><span class="badge badge-green">Completed</span></td>
    </tr>`;
  })).join('');
}

// ─── HEALTH ───
function renderHealth(){
  const bloods=['A+','B+','O+','AB+','A-','B-','O-'];
  const conds=['None','Diabetes','Hypertension','Asthma','None','None','None','Thyroid'];
  document.getElementById('health-body').innerHTML = users.map((u,i)=>`<tr>
    <td><div class="user-cell"><div class="user-avatar" style="background:${getColor(u.id)}20;color:${getColor(u.id)}">${getInitials(u)}</div>${u.fname} ${u.lname}</div></td>
    <td>${25+i*3}</td>
    <td>${55+i*5} kg</td>
    <td>${160+i*2} cm</td>
    <td><span class="badge badge-red">${bloods[i%7]}</span></td>
    <td>${conds[i]}</td>
    <td style="font-family:var(--mono);font-size:11px;color:var(--text3)">${u.joined}</td>
  </tr>`).join('');
}

// ─── TASKS ───
function renderTasks(){
  const tasks=['Review budget','Log expenses','Update health profile','Set savings goal','Prayer time check','Weekly report'];
  const priorities=['high','medium','low'];
  document.getElementById('tasks-body').innerHTML = users.flatMap(u=>tasks.slice(0,2).map((t,i)=>`<tr>
    <td><div class="user-cell"><div class="user-avatar" style="background:${getColor(u.id)}20;color:${getColor(u.id)}">${getInitials(u)}</div>${u.fname}</div></td>
    <td>${t}</td>
    <td><span class="badge ${priorities[i]=='high'?'badge-red':priorities[i]=='medium'?'badge-amber':'badge-blue'}">${priorities[i]}</span></td>
    <td style="font-family:var(--mono);font-size:11px">2026-05-${10+u.id+i}</td>
    <td><span class="badge ${i===0?'badge-green':'badge-amber'}">${i===0?'Done':'Pending'}</span></td>
  </tr>`)).join('');
}

// ─── LOGS ───
const logEntries = [
  {time:'09:01:22',action:'Admin login',user:'admin@lp.com',type:'info'},
  {time:'09:04:15',action:'User Rahim profile viewed',user:'admin@lp.com',type:'info'},
  {time:'09:07:33',action:'User Karim balance updated',user:'admin@lp.com',type:'success'},
  {time:'09:12:09',action:'New user Sumaiya created',user:'admin@lp.com',type:'success'},
  {time:'09:18:44',action:'User Mitu deleted',user:'admin@lp.com',type:'error'},
  {time:'09:25:01',action:'Database export initiated',user:'admin@lp.com',type:'info'},
];
function logActivity(msg){
  const now = new Date();
  const t = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
  logEntries.unshift({time:t, action:msg, user:'admin@lp.com', type:'success'});
  renderLogs();
}
function renderLogs(){
  document.getElementById('logs-list').innerHTML = logEntries.map(l=>`
    <div style="display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid var(--border)">
      <div style="font-family:var(--mono);font-size:11px;color:var(--text3);width:70px;flex-shrink:0">${l.time}</div>
      <div style="width:8px;height:8px;border-radius:50%;background:${l.type==='success'?'#10b981':l.type==='error'?'#ef4444':'#3b82f6'};flex-shrink:0"></div>
      <div style="font-size:13px;flex:1">${l.action}</div>
      <div style="font-size:11px;color:var(--text3);font-family:var(--mono)">${l.user}</div>
    </div>`).join('');
}

// ─── TOAST ───
function showToast(msg, type='info'){
  const t = document.createElement('div');
  t.className=`toast toast-${type}`;
  t.innerHTML = `<span>${type==='success'?'✅':type==='error'?'❌':'ℹ️'}</span> ${msg}`;
  document.getElementById('toaster').appendChild(t);
  setTimeout(()=>t.classList.add('show'),10);
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),400); },3000);
}

// Login on Enter
document.getElementById('login-email').addEventListener('keydown',e=>{ if(e.key==='Enter')doLogin(); });
</script>
</body>
</html>