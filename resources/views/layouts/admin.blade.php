<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin') — Life Pilot AI</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --bg: #f1f5f9;
            --surface: #ffffff;
            --surface-hover: #f8fafc;
            --text: #0f172a;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --primary: #6366f1;
            --primary-light: #e0e7ff;
            --primary-dark: #4338ca;
            --success: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --info: #3b82f6;
            --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
            --sidebar-bg: #1e293b;
            --sidebar-text: #94a3b8;
            --sidebar-active: #f8fafc;
            --sidebar-active-bg: rgba(99,102,241,0.15);
            --card-radius: 12px;
            --header-bg: #ffffff;
        }

        /* Theme: Black-Red (Default) */
        body.theme-black-red {
            --bg: #0f0f12;
            --surface: #1a1a22;
            --surface-hover: #252532;
            --text: #f1f1f3;
            --text-muted: #888899;
            --border: #2d2d3a;
            --primary: #ef4444;
            --primary-light: rgba(239,68,68,0.15);
            --primary-dark: #dc2626;
            --success: #22c55e;
            --shadow: 0 12px 28px rgba(0,0,0,0.42);
            --sidebar-bg: #0a0a0e;
            --sidebar-text: #b0b0c0;
            --sidebar-active: #ffffff;
            --sidebar-active-bg: rgba(239,68,68,0.18);
            --header-bg: #141419;
        }

        /* Theme: Green-White */
        body.theme-green-white {
            --bg: #f0fdf4;
            --surface: #ffffff;
            --surface-hover: #f0fdf4;
            --text: #14532d;
            --text-muted: #4d7c61;
            --border: #bbf7d0;
            --primary: #16a34a;
            --primary-light: #dcfce7;
            --primary-dark: #15803d;
            --shadow: 0 8px 24px rgba(21,128,61,0.12);
            --sidebar-bg: #ecfdf3;
            --sidebar-text: #2f855a;
            --sidebar-active: #14532d;
            --sidebar-active-bg: rgba(22,163,74,0.12);
            --header-bg: #ffffff;
        }

        /* Theme: Pink-Black */
        body.theme-pink-black {
            --bg: #0c0610;
            --surface: #1a0a1f;
            --surface-hover: #2d1032;
            --text: #f8fafc;
            --text-muted: #d1a0d6;
            --border: rgba(249,168,212,0.2);
            --primary: #ec4899;
            --primary-light: rgba(236,72,153,0.15);
            --primary-dark: #be185d;
            --success: #34d399;
            --shadow: 0 12px 28px rgba(0,0,0,0.45);
            --sidebar-bg: #120716;
            --sidebar-text: #e8a8d8;
            --sidebar-active: #ffffff;
            --sidebar-active-bg: rgba(236,72,153,0.18);
            --header-bg: #17091d;
        }

        /* Theme: Yellow-Black */
        body.theme-yellow-black {
            --bg: #11110b;
            --surface: #1a1a14;
            --surface-hover: #2a2a1e;
            --text: #fefce8;
            --text-muted: #a89f68;
            --border: rgba(234,179,8,0.2);
            --primary: #eab308;
            --primary-light: rgba(234,179,8,0.15);
            --primary-dark: #b48c04;
            --success: #22c55e;
            --shadow: 0 12px 28px rgba(0,0,0,0.5);
            --sidebar-bg: #0a0a07;
            --sidebar-text: #d4cba0;
            --sidebar-active: #fefce8;
            --sidebar-active-bg: rgba(234,179,8,0.15);
            --header-bg: #141411;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: var(--bg);
            color: var(--text);
            display: flex;
            min-height: 100vh;
            transition: background 0.3s, color 0.3s;
        }

        /* ===== SIDEBAR ===== */
        .admin-sidebar {
            width: 260px;
            background: var(--sidebar-bg);
            color: var(--sidebar-text);
            position: fixed;
            top: 0; left: 0; bottom: 0;
            display: flex;
            flex-direction: column;
            z-index: 100;
            overflow-y: auto;
            transition: all 0.3s;
        }

        .admin-sidebar .logo {
            padding: 24px 20px;
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .admin-sidebar .logo i {
            width: 36px; height: 36px;
            background: var(--primary);
            border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            color: #fff;
            font-size: 16px;
        }

        .admin-sidebar .logo span {
            font-size: 18px; font-weight: 800;
            color: var(--sidebar-active);
        }

        .admin-sidebar nav {
            flex: 1;
            padding: 16px 0;
        }

        .nav-section {
            font-size: 10px; font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            padding: 12px 20px 6px;
            color: var(--text-muted);
        }

        .admin-sidebar a {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 18px;
            margin: 2px 10px;
            color: var(--sidebar-text);
            text-decoration: none;
            font-size: 13px; font-weight: 600;
            border-radius: 8px;
            transition: all 0.18s;
        }

        .admin-sidebar a:hover, .admin-sidebar a.active {
            background: var(--sidebar-active-bg);
            color: var(--sidebar-active);
        }

        .admin-sidebar a i { width: 18px; text-align: center; }

        /* ===== MAIN CONTENT ===== */
        .admin-main {
            margin-left: 260px;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .admin-header {
            background: var(--header-bg);
            border-bottom: 1px solid var(--border);
            padding: 16px 28px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 50;
        }

        .admin-header h1 {
            font-size: 20px; font-weight: 800;
        }

        .header-actions {
            display: flex; align-items: center; gap: 12px;
        }

        /* Theme Switcher */
        .theme-switcher {
            display: flex; gap: 6px;
            background: var(--surface);
            padding: 4px;
            border-radius: 20px;
            border: 1px solid var(--border);
        }

        .theme-btn {
            width: 24px; height: 24px;
            border-radius: 50%;
            border: 2px solid transparent;
            cursor: pointer;
            transition: transform 0.2s;
            position: relative;
        }

        .theme-btn:hover { transform: scale(1.15); }
        .theme-btn.active { border-color: var(--primary); box-shadow: 0 0 0 2px var(--primary-light); }

        .theme-btn[data-theme="black-red"] { background: linear-gradient(135deg, #0a0a0e, #ef4444); }
        .theme-btn[data-theme="green-white"] { background: linear-gradient(135deg, #f0fdf4, #16a34a); }
        .theme-btn[data-theme="pink-black"] { background: linear-gradient(135deg, #120716, #ec4899); }
        .theme-btn[data-theme="yellow-black"] { background: linear-gradient(135deg, #0a0a07, #eab308); }

        /* ===== BUTTONS ===== */
        .btn {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px; font-weight: 600;
            border: none;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s;
        }

        .btn-primary {
            background: var(--primary);
            color: #fff;
        }
        .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); }

        .btn-outline {
            background: var(--surface);
            color: var(--text);
            border: 1px solid var(--border);
        }
        .btn-outline:hover { background: var(--surface-hover); }

        .btn-danger {
            background: var(--danger);
            color: #fff;
        }
        .btn-sm { padding: 6px 12px; font-size: 12px; }

        /* ===== CONTENT ===== */
        .admin-content {
            padding: 28px;
            flex: 1;
        }

        .card {
            background: var(--surface);
            border-radius: var(--card-radius);
            border: 1px solid var(--border);
            box-shadow: var(--shadow);
            overflow: hidden;
        }

        .card-header {
            padding: 18px 24px;
            border-bottom: 1px solid var(--border);
            display: flex; align-items: center; justify-content: space-between;
        }

        .card-header h2 {
            font-size: 16px; font-weight: 700;
        }

        .card-body { padding: 20px 24px; }

        /* ===== TABLE STYLES ===== */
        .data-table {
            width: 100%;
            border-collapse: collapse;
        }

        .data-table th {
            text-align: left;
            padding: 12px 16px;
            font-size: 11px; font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-muted);
            border-bottom: 2px solid var(--border);
            white-space: nowrap;
        }

        .data-table th.sortable {
            cursor: pointer;
            user-select: none;
        }
        .data-table th.sortable:hover { color: var(--primary); }

        .data-table td {
            padding: 12px 16px
