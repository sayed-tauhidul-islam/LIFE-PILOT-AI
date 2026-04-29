<!DOCTYPE html>
<html lang="{{ auth()->user()->language === 'english' ? 'en' : (auth()->user()->language === 'hindi' ? 'hi' : 'bn') }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'ড্যাশবোর্ড') — LP_AI</title>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <!-- Tailwind CSS (utility usage for modern UI composition) -->
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --primary-light: #e0e7ff;
            --success: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --info: #3b82f6;
            --dark: #1e293b;
            --gray: #64748b;
            --light: #f8fafc;
            --surface: #ffffff;
            --border: #e2e8f0;
            --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04);
            --sidebar-width: 260px;
            --body-gradient:
                radial-gradient(circle at top left, rgba(99, 102, 241, 0.08), transparent 28%),
                radial-gradient(circle at top right, rgba(14, 165, 233, 0.07), transparent 24%),
                linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
            --sidebar-bg: #0f172a;
            --sidebar-border: #1e293b;
            --sidebar-text: #cbd5e1;
            --sidebar-muted: #94a3b8;
            --sidebar-hover: #1e293b;
            --sidebar-active-bg: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1));
            --sidebar-active-text: #818cf8;
            --topbar-bg: #ffffff;
            --topbar-border: #e2e8f0;
            --table-row-hover: #f8fafc;
            --hero-accent: #dc2626;
            --dash-hero-bg: linear-gradient(128deg, #111 0%, #320809 46%, #dc2626 100%);
            --dash-hero-text: #ffffff;
            --dash-hero-sub: rgba(255, 255, 255, 0.86);
            --dash-hero-pill-bg: rgba(255, 255, 255, 0.14);
            --dash-hero-pill-border: rgba(255, 255, 255, 0.28);
            --dash-hero-pill-text: #ffffff;
            --dash-glass-bg: rgba(255, 255, 255, 0.17);
            --dash-glass-bg-hover: rgba(255, 255, 255, 0.25);
            --dash-glass-border: rgba(255, 255, 255, 0.3);
            --dash-ai-bg: linear-gradient(130deg, #09090b 0%, #3f0a0c 50%, #8f1518 100%);
            --dash-ai-text: #ffffff;
            --dash-ai-muted: #ffd1d3;
            --dash-ai-panel: rgba(255, 255, 255, 0.09);
            --dash-ai-border: rgba(255, 255, 255, 0.28);
            --dash-grid-line: rgba(255, 255, 255, 0.08);
        }

        body.theme-black-red {
            --primary: #ef4444;
            --primary-dark: #dc2626;
            --primary-light: rgba(239, 68, 68, 0.2);
            --success: #22c55e;
            --danger: #ef4444;
            --warning: #f59e0b;
            --info: #fca5a5;
            --dark: #f5f5f5;
            --gray: #b7b7c2;
            --light: #15151b;
            --surface: #121218;
            --border: #2d2d36;
            --card-shadow: 0 12px 28px rgba(0, 0, 0, 0.42);
            --body-gradient:
                radial-gradient(circle at 15% 0%, rgba(239, 68, 68, 0.18), transparent 30%),
                radial-gradient(circle at 85% 0%, rgba(255, 255, 255, 0.08), transparent 28%),
                linear-gradient(180deg, #050506 0%, #0f0f12 100%);
            --sidebar-bg: #09090b;
            --sidebar-border: #1d1d24;
            --sidebar-text: #f1f1f3;
            --sidebar-muted: #b6b7be;
            --sidebar-hover: #17171d;
            --sidebar-active-bg: linear-gradient(135deg, rgba(239, 68, 68, 0.26), rgba(255, 255, 255, 0.08));
            --sidebar-active-text: #ffe5e5;
            --topbar-bg: rgba(14, 14, 18, 0.88);
            --topbar-border: #26262f;
            --table-row-hover: #1a1a22;
            --hero-accent: #ef4444;
        }

        body.theme-green-white,
        body.theme-white-green {
            --primary: #16a34a;
            --primary-dark: #15803d;
            --primary-light: #dcfce7;
            --success: #16a34a;
            --danger: #166534;
            --warning: #15803d;
            --info: #059669;
            --dark: #14532d;
            --gray: #4d7c61;
            --light: #f0fdf4;
            --surface: #ffffff;
            --border: #d1fae5;
            --card-shadow: 0 8px 24px rgba(21, 128, 61, 0.12);
            --body-gradient:
                radial-gradient(circle at top left, rgba(22, 163, 74, 0.15), transparent 32%),
                linear-gradient(180deg, #f8fffa 0%, #ecfdf5 100%);
            --sidebar-bg: #ecfdf3;
            --sidebar-border: #c5edd8;
            --sidebar-text: #166534;
            --sidebar-muted: #2f855a;
            --sidebar-hover: #dcfce7;
            --sidebar-active-bg: linear-gradient(135deg, rgba(22, 163, 74, 0.18), rgba(255, 255, 255, 0.65));
            --sidebar-active-text: #14532d;
            --topbar-bg: #ffffff;
            --topbar-border: #d1fae5;
            --table-row-hover: #f0fdf4;
            --hero-accent: #16a34a;
            --dash-hero-bg: linear-gradient(128deg, #ffffff 0%, #f0fdf4 52%, #dcfce7 100%);
            --dash-hero-text: #14532d;
            --dash-hero-sub: #166534;
            --dash-hero-pill-bg: #ecfdf3;
            --dash-hero-pill-border: #bbf7d0;
            --dash-hero-pill-text: #166534;
            --dash-glass-bg: #ecfdf3;
            --dash-glass-bg-hover: #dcfce7;
            --dash-glass-border: #bbf7d0;
            --dash-ai-bg: linear-gradient(130deg, #ffffff 0%, #f0fdf4 50%, #dcfce7 100%);
            --dash-ai-text: #14532d;
            --dash-ai-muted: #166534;
            --dash-ai-panel: rgba(22, 163, 74, 0.08);
            --dash-ai-border: rgba(22, 163, 74, 0.25);
            --dash-grid-line: rgba(22, 163, 74, 0.08);
        }

        body.theme-black-white,
        body.theme-white-black {
            --primary: #111827;
            --primary-dark: #030712;
            --primary-light: #e5e7eb;
            --success: #111827;
            --danger: #111827;
            --warning: #27272a;
            --info: #27272a;
            --dark: #111111;
            --gray: #52525b;
            --light: #f4f4f5;
            --surface: #ffffff;
            --border: #e4e4e7;
            --card-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
            --body-gradient:
                radial-gradient(circle at top right, rgba(17, 24, 39, 0.08), transparent 28%),
                linear-gradient(180deg, #ffffff 0%, #f4f4f5 100%);
            --sidebar-bg: #fafafa;
            --sidebar-border: #e4e4e7;
            --sidebar-text: #18181b;
            --sidebar-muted: #3f3f46;
            --sidebar-hover: #f4f4f5;
            --sidebar-active-bg: linear-gradient(135deg, rgba(17, 24, 39, 0.12), rgba(0, 0, 0, 0.04));
            --sidebar-active-text: #09090b;
            --topbar-bg: #ffffff;
            --topbar-border: #e4e4e7;
            --table-row-hover: #f4f4f5;
            --hero-accent: #111827;
            --dash-hero-bg: linear-gradient(128deg, #ffffff 0%, #f7f7f8 52%, #ededed 100%);
            --dash-hero-text: #111111;
            --dash-hero-sub: #27272a;
            --dash-hero-pill-bg: #f4f4f5;
            --dash-hero-pill-border: #e4e4e7;
            --dash-hero-pill-text: #18181b;
            --dash-glass-bg: #f4f4f5;
            --dash-glass-bg-hover: #ededed;
            --dash-glass-border: #d4d4d8;
            --dash-ai-bg: linear-gradient(130deg, #ffffff 0%, #f4f4f5 50%, #e4e4e7 100%);
            --dash-ai-text: #111111;
            --dash-ai-muted: #3f3f46;
            --dash-ai-panel: rgba(24, 24, 27, 0.06);
            --dash-ai-border: rgba(24, 24, 27, 0.15);
            --dash-grid-line: rgba(24, 24, 27, 0.07);
        }

        body.theme-pink-black,
        body.theme-blue-red {
            --primary: #ef4444;
            --primary-dark: #dc2626;
            --primary-light: rgba(239, 68, 68, 0.16);
            --success: #22c55e;
            --danger: #ec4899;
            --warning: #f472b6;
            --info: #f9a8d4;
            --dark: #f8fafc;
            --gray: #f5c6df;
            --light: #2d1032;
            --surface: #1f0b24;
            --border: rgba(249, 168, 212, 0.24);
            --card-shadow: 0 10px 28px rgba(27, 3, 22, 0.38);
            --body-gradient:
                radial-gradient(circle at 12% 0%, rgba(236, 72, 153, 0.25), transparent 34%),
                linear-gradient(180deg, #0c0610 0%, #1a0a1f 100%);
            --sidebar-bg: #120716;
            --sidebar-border: #3a1a42;
            --sidebar-text: #f8fafc;
            --sidebar-muted: #f3bad8;
            --sidebar-hover: #2b1332;
            --sidebar-active-bg: linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(255, 255, 255, 0.1));
            --sidebar-active-text: #ffffff;
            --topbar-bg: rgba(23, 9, 29, 0.92);
            --topbar-border: rgba(249, 168, 212, 0.2);
            --table-row-hover: rgba(55, 20, 58, 0.72);
            --hero-accent: #ec4899;
            --dash-hero-bg: linear-gradient(128deg, #0e0612 0%, #2d1032 56%, #5b1d5f 100%);
            --dash-hero-text: #ffffff;
            --dash-hero-sub: #f7d3e7;
            --dash-hero-pill-bg: rgba(249, 168, 212, 0.16);
            --dash-hero-pill-border: rgba(249, 168, 212, 0.34);
            --dash-hero-pill-text: #ffffff;
            --dash-glass-bg: rgba(249, 168, 212, 0.16);
            --dash-glass-bg-hover: rgba(249, 168, 212, 0.26);
            --dash-glass-border: rgba(249, 168, 212, 0.34);
            --dash-ai-bg: linear-gradient(130deg, #120716 0%, #3a1441 50%, #5b1d5f 100%);
            --dash-ai-text: #f8fafc;
            --dash-ai-muted: #f7d3e7;
            --dash-ai-panel: rgba(249, 168, 212, 0.14);
            --dash-ai-border: rgba(249, 168, 212, 0.3);
            --dash-grid-line: rgba(249, 168, 212, 0.1);
        }

        body.theme-yellow-black {
            --primary: #eab308;
            --primary-dark: #ca8a04;
            --primary-light: rgba(234, 179, 8, 0.18);
            --success: #84cc16;
            --danger: #f97316;
            --warning: #facc15;
            --info: #fde047;
            --dark: #fefce8;
            --gray: #fde68a;
            --light: #1a1a12;
            --surface: #11110b;
            --border: rgba(250, 204, 21, 0.25);
            --card-shadow: 0 12px 28px rgba(26, 26, 18, 0.42);
            --body-gradient:
                radial-gradient(circle at 12% 0%, rgba(250, 204, 21, 0.26), transparent 34%),
                linear-gradient(180deg, #080807 0%, #11110b 100%);
            --sidebar-bg: #0a0a07;
            --sidebar-border: #252518;
            --sidebar-text: #fefce8;
            --sidebar-muted: #fde68a;
            --sidebar-hover: #181811;
            --sidebar-active-bg: linear-gradient(135deg, rgba(250, 204, 21, 0.35), rgba(255, 255, 255, 0.08));
            --sidebar-active-text: #111111;
            --topbar-bg: rgba(14, 14, 11, 0.92);
            --topbar-border: rgba(250, 204, 21, 0.22);
            --table-row-hover: rgba(39, 39, 24, 0.75);
            --hero-accent: #eab308;
            --dash-hero-bg: linear-gradient(128deg, #0b0b08 0%, #1d1d14 56%, #302f19 100%);
            --dash-hero-text: #fefce8;
            --dash-hero-sub: #fde68a;
            --dash-hero-pill-bg: rgba(250, 204, 21, 0.18);
            --dash-hero-pill-border: rgba(250, 204, 21, 0.36);
            --dash-hero-pill-text: #fefce8;
            --dash-glass-bg: rgba(250, 204, 21, 0.18);
            --dash-glass-bg-hover: rgba(250, 204, 21, 0.26);
            --dash-glass-border: rgba(250, 204, 21, 0.36);
            --dash-ai-bg: linear-gradient(130deg, #0a0a07 0%, #1f1d10 50%, #383118 100%);
            --dash-ai-text: #fefce8;
            --dash-ai-muted: #fde68a;
            --dash-ai-panel: rgba(250, 204, 21, 0.14);
            --dash-ai-border: rgba(250, 204, 21, 0.3);
            --dash-grid-line: rgba(250, 204, 21, 0.12);
        }

        body.contrast-light {
            filter: contrast(0.94) saturate(0.96);
        }

        body.contrast-dark {
            filter: contrast(1.14) saturate(1.08);
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: var(--body-gradient);
            background-attachment: fixed;
            color: var(--dark);
            display: flex;
            min-height: 100vh;
        }

        ::selection {
            background: rgba(99, 102, 241, 0.18);
        }

        /* ===== SIDEBAR ===== */
        .sidebar {
            width: var(--sidebar-width);
            background: var(--sidebar-bg);
            color: var(--sidebar-text);
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.34s cubic-bezier(0.2, 0.9, 0.22, 1.1);
            box-shadow: 12px 0 34px rgba(0, 0, 0, 0.2);
        }

        .sidebar.open {
            transform: translateX(0);
        }

        .sidebar.spring-in {
            animation: sidebar-spring-in 0.34s cubic-bezier(0.2, 0.9, 0.22, 1.12);
        }

        .sidebar.spring-out {
            animation: sidebar-spring-out 0.28s ease;
        }

        .sidebar-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.28);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
            z-index: 95;
        }

        .sidebar-backdrop.show {
            opacity: 1;
            pointer-events: auto;
        }

        .sidebar-logo {
            padding: 24px 20px;
            border-bottom: 1px solid var(--sidebar-border);
            display: inline-flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            cursor: pointer;
        }

        .sidebar-logo .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--primary), #8b5cf6);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        .sidebar-logo .logo-text {
            font-size: 20px;
            font-weight: 700;
            color: var(--sidebar-text);
            letter-spacing: -0.5px;
        }

        .sidebar-logo .logo-text span {
            color: var(--primary);
        }

        .sidebar-nav {
            flex: 1;
            padding: 16px 0;
            overflow-y: auto;
        }

        .nav-section-title {
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: var(--sidebar-muted);
            padding: 12px 20px 6px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 18px;
            color: var(--sidebar-muted);
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            border-radius: 10px;
            transition: all 0.18s ease;
            position: relative;
            margin: 6px 10px;
        }

        .nav-item:hover {
            background: var(--sidebar-hover);
            color: var(--sidebar-text);
        }

        .nav-item.active {
            background: var(--sidebar-active-bg);
            color: var(--sidebar-active-text);
            border-left: 3px solid var(--primary);
            box-shadow: 0 6px 18px color-mix(in oklab, var(--primary) 12%, transparent), inset 0 0 0 1px color-mix(in oklab, var(--primary) 10%, transparent);
            transform: translateX(4px);
        }

        .nav-item i {
            width: 18px;
            text-align: center;
            font-size: 15px;
        }

        .nav-group {
            position: relative;
        }

        .nav-item-toggle {
            width: 100%;
            text-align: left;
            background: transparent;
            border: none;
        }

        .nav-item-toggle .chevron {
            margin-left: auto;
            font-size: 10px;
            opacity: 0.8;
            transition: transform 0.2s ease;
        }

        .nav-group.open .nav-item-toggle .chevron {
            transform: rotate(90deg);
        }

        .nav-sub {
            padding: 4px 0 8px 44px;
            display: grid;
            gap: 2px;
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: max-height 0.24s ease, opacity 0.2s ease, padding-top 0.2s ease, padding-bottom 0.2s ease;
            pointer-events: none;
        }

        .nav-group.open .nav-sub {
            max-height: 220px;
            opacity: 1;
            pointer-events: auto;
        }

        .nav-sub-item {
            color: var(--sidebar-muted);
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
            padding: 6px 10px;
            border-radius: 8px;
            width: fit-content;
            transition: all 0.18s ease;
        }

        .nav-sub-item:hover {
            color: var(--sidebar-text);
            background: color-mix(in oklab, var(--sidebar-hover) 92%, transparent);
        }

        .nav-sub-item.active {
            color: var(--sidebar-active-text);
            background: color-mix(in oklab, var(--primary) 30%, transparent);
            box-shadow: 0 0 0 1px color-mix(in oklab, var(--primary) 45%, transparent), 0 0 18px color-mix(in oklab, var(--primary) 30%, transparent);
        }

        .nav-sub-item.active i {
            filter: drop-shadow(0 0 6px color-mix(in oklab, var(--primary) 45%, transparent));
        }

        .nav-badge {
            margin-left: auto;
            background: var(--danger);
            color: white;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 20px;
        }

        .sidebar-footer {
            padding: 16px 20px;
            border-top: 1px solid var(--sidebar-border);
        }

        .user-card {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: var(--sidebar-hover);
            border-radius: 10px;
        }

        .user-avatar {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, var(--primary), #8b5cf6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: white;
            font-size: 14px;
        }

        .user-info {
            flex: 1;
            min-width: 0;
        }

        .user-info .name {
            font-size: 13px;
            font-weight: 600;
            color: var(--sidebar-text);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .user-info .email {
            font-size: 11px;
            color: var(--sidebar-muted);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* ===== MAIN CONTENT ===== */
        .main-content {
            margin-left: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .topbar-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .topbar-heading {
            min-width: 0;
        }

        .topbar-shortcuts {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }

        .topbar-shortcut {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 999px;
            border: 1px solid var(--border);
            background: color-mix(in oklab, var(--surface) 88%, transparent);
            color: var(--dark);
            text-decoration: none;
            font-size: 12px;
            font-weight: 700;
            transition: transform 0.18s ease, border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
            white-space: nowrap;
        }

        .topbar-shortcut:hover {
            color: var(--primary);
            border-color: color-mix(in oklab, var(--primary) 45%, var(--border));
            background: color-mix(in oklab, var(--primary) 9%, var(--surface));
            transform: translateY(-1px);
        }

        .topbar-shortcut.is-current {
            background: color-mix(in oklab, var(--primary) 14%, var(--surface));
            border-color: color-mix(in oklab, var(--primary) 35%, var(--border));
            color: var(--primary);
        }

        .menu-toggle {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: var(--bg-surface);
            color: var(--text-primary);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }

        .menu-toggle:hover {
            background: var(--light);
            border-color: var(--primary);
            color: var(--primary);
        }

        .menu-toggle.is-active {
            color: var(--primary);
            border-color: var(--primary);
            box-shadow: 0 0 0 1px color-mix(in oklab, var(--primary) 28%, transparent), 0 8px 20px color-mix(in oklab, var(--primary) 20%, transparent);
        }

        .menu-toggle::after {
            content: attr(data-tip);
            position: absolute;
            top: calc(100% + 8px);
            left: 50%;
            transform: translateX(-50%) translateY(-3px);
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.03em;
            color: #fff;
            background: color-mix(in oklab, var(--primary) 80%, #111);
            border-radius: 999px;
            padding: 3px 8px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.18s ease, transform 0.18s ease;
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
        }

        .menu-toggle.show-tip::after,
        .menu-toggle:hover::after,
        .menu-toggle:focus-visible::after {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        .topbar {
            gap: 14px;
        }

        .topbar-actions {
            flex-wrap: wrap;
            justify-content: flex-end;
        }

        .btn:focus-visible,
        .menu-toggle:focus-visible,
        .nav-item:focus-visible,
        .nav-sub-item:focus-visible {
            outline: 2px solid color-mix(in oklab, var(--primary) 65%, #ffffff);
            outline-offset: 2px;
        }

        @keyframes sidebar-spring-in {
            0% { transform: translateX(-100%); }
            72% { transform: translateX(8px); }
            100% { transform: translateX(0); }
        }

        @keyframes sidebar-spring-out {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
        }

        /* ===== TOP BAR ===== */
        .topbar {
            background: var(--topbar-bg);
            border-bottom: 1px solid var(--topbar-border);
            padding: 14px 24px;
            min-height: 78px;
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
            align-items: center;
            gap: 14px;
            position: sticky;
            top: 0;
            z-index: 50;
            backdrop-filter: blur(8px);
            box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
        }

        .topbar-title {
            font-size: 18px;
            font-weight: 800;
            color: var(--dark);
            line-height: 1.1;
        }

        .topbar-subtitle {
            font-size: 12px;
            color: var(--gray);
            margin-top: 4px;
        }

        .topbar-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            justify-content: flex-end;
            flex-wrap: wrap;
        }

        .topbar-center {
            display: flex;
            justify-content: center;
            text-align: center;
            min-width: 0;
        }

        .topbar-right {
            display: flex;
            justify-content: flex-end;
            min-width: 0;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 9px 18px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            text-decoration: none;
            transition: all 0.2s;
        }

        .btn-primary {
            background: var(--accent);
            color: white;
        }

        .btn-primary:hover {
            background: var(--primary-dark);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .btn-success {
            background: var(--success);
            color: white;
        }

        .btn-success:hover {
            background: #059669;
        }

        .btn-danger {
            background: var(--danger);
            color: white;
        }

        .btn-outline {
            background: transparent;
            color: var(--text-primary);
            border: 1px solid var(--border);
        }

        .btn-outline:hover {
            background: var(--light);
        }

        .btn-sm {
            padding: 6px 14px;
            font-size: 12px;
        }

        /* ===== PAGE CONTENT ===== */
        .page-content {
            padding: 28px;
            flex: 1;
        }

        /* ===== CARDS ===== */
        .card {
            background: var(--bg-card);
            border-radius: 14px;
            padding: 24px;
            box-shadow: var(--card-shadow);
            border: 1px solid var(--border);
            color: var(--text-primary);
        }

        .card-title {
            font-size: 15px;
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        /* ===== STAT CARDS ===== */
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }

        .stat-card {
            background: var(--surface);
            border-radius: 14px;
            padding: 20px;
            box-shadow: var(--card-shadow);
            border: 1px solid var(--border);
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 80px;
            height: 80px;
            border-radius: 0 0 0 80px;
            opacity: 0.08;
        }

        .stat-card.income::before {
            background: var(--success);
        }

        .stat-card.expense::before {
            background: var(--danger);
        }

        .stat-card.saving::before {
            background: var(--info);
        }

        .stat-card.balance::before {
            background: var(--primary);
        }

        .stat-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            margin-bottom: 14px;
        }

        .stat-card.income .stat-icon {
            background: #d1fae5;
            color: var(--success);
        }

        .stat-card.expense .stat-icon {
            background: #fee2e2;
            color: var(--danger);
        }

        .stat-card.saving .stat-icon {
            background: #dbeafe;
            color: var(--info);
        }

        .stat-card.balance .stat-icon {
            background: var(--primary-light);
            color: var(--primary);
        }

        .stat-label {
            font-size: 12px;
            color: var(--gray);
            font-weight: 500;
            margin-bottom: 4px;
        }

        .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--dark);
        }

        .stat-sub {
            font-size: 12px;
            color: var(--gray);
            margin-top: 6px;
        }

        .stat-sub .up {
            color: var(--success);
        }

        .stat-sub .down {
            color: var(--danger);
        }

        /* ===== CHARTS ===== */
        .chart-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
        }

        /* ===== TABLES ===== */
        .table-container {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            font-size: 11px;
            font-weight: 700;
            color: var(--gray);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 12px 16px;
            border-bottom: 2px solid var(--border);
            text-align: left;
        }

        td {
            padding: 13px 16px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 13px;
            color: var(--dark);
            vertical-align: middle;
        }

        tr:hover td {
            background: var(--table-row-hover);
        }

        /* ===== BADGES ===== */
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
        }

        .badge-income {
            background: #d1fae5;
            color: #065f46;
        }

        .badge-expense {
            background: #fee2e2;
            color: #991b1b;
        }

        .badge-saving {
            background: #dbeafe;
            color: #1e40af;
        }

        .badge-warning {
            background: #fef3c7;
            color: #92400e;
        }

        .badge-success {
            background: #d1fae5;
            color: #065f46;
        }

        /* ===== ALERTS ===== */
        .alert {
            padding: 14px 16px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .alert-success {
            background: #d1fae5;
            color: #065f46;
            border-left: 4px solid var(--success);
        }

        .alert-danger {
            background: #fee2e2;
            color: #991b1b;
            border-left: 4px solid var(--danger);
        }

        .alert-warning {
            background: #fef3c7;
            color: #92400e;
            border-left: 4px solid var(--warning);
        }

        .alert-info {
            background: #dbeafe;
            color: #1e40af;
            border-left: 4px solid var(--info);
        }

        /* ===== FORMS ===== */
        .form-group {
            margin-bottom: 18px;
        }

        .form-label {
            font-size: 13px;
            font-weight: 600;
            color: var(--dark);
            margin-bottom: 6px;
            display: block;
        }

        .form-control {
            width: 100%;
            padding: 10px 14px;
            border: 1.5px solid var(--border);
            border-radius: 8px;
            font-size: 13px;
            font-family: 'Inter', sans-serif;
            color: var(--dark);
            background: var(--surface);
            transition: border-color 0.2s;
            outline: none;
        }

        .reveal-on-scroll {
            opacity: 0;
            transform: translateY(12px);
            transition: opacity 0.45s ease, transform 0.45s ease;
        }

        .reveal-on-scroll.in-view {
            opacity: 1;
            transform: translateY(0);
        }

        .ripple-btn {
            position: relative;
            overflow: hidden;
        }

        .ripple-btn .ripple {
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: btn-ripple 0.6s linear;
            background: rgba(255, 255, 255, 0.32);
            pointer-events: none;
        }

        @keyframes btn-ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .form-control:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .form-error {
            color: var(--danger);
            font-size: 12px;
            margin-top: 4px;
        }

        /* ===== FIN SCORE RING ===== */
        .fin-score-container {
            text-align: center;
            padding: 20px;
        }

        .fin-score-ring {
            position: relative;
            width: 140px;
            height: 140px;
            margin: 0 auto 14px;
        }

        /* ===== PROGRESS BAR ===== */
        .progress-bar {
            background: #f1f5f9;
            border-radius: 10px;
            height: 8px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 1s ease;
        }

        /* ===== AI SUGGESTION CARD ===== */
        .ai-card {
            background: linear-gradient(135deg, #1e1b4b, #312e81);
            color: white;
            border-radius: 16px;
            padding: 24px;
            position: relative;
            overflow: hidden;
        }

        .ai-card::before {
            content: '🤖';
            position: absolute;
            top: -10px;
            right: -10px;
            font-size: 80px;
            opacity: 0.1;
        }

        .ai-card .ai-title {
            font-size: 14px;
            font-weight: 500;
            color: #a5b4fc;
            margin-bottom: 8px;
        }

        .ai-card h3 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 16px;
        }

        .ai-tip {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 13px;
            margin-bottom: 8px;
            backdrop-filter: blur(4px);
        }

        .ai-tip::before {
            content: '💡 ';
        }

        /* ===== MEAL PLAN ===== */
        .meal-card {
            background: white;
            border-radius: 12px;
            padding: 16px;
            border: 1px solid var(--border);
        }

        .meal-card .meal-time {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--primary);
            margin-bottom: 6px;
        }

        .meal-card .meal-name {
            font-size: 15px;
            font-weight: 600;
            color: var(--dark);
            margin-bottom: 4px;
        }

        .meal-card .meal-meta {
            font-size: 12px;
            color: var(--gray);
        }

        .meal-card .meal-cost {
            font-weight: 700;
            color: var(--success);
        }

        /* ===== ANOMALY ===== */
        .anomaly-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            background: #fff7ed;
            border-radius: 10px;
            border-left: 4px solid var(--warning);
            margin-bottom: 8px;
        }

        .anomaly-item .anomaly-icon {
            font-size: 20px;
        }

        .anomaly-item .anomaly-msg {
            font-size: 13px;
            color: #92400e;
            font-weight: 500;
        }

        /* ===== TOAST NOTIFICATION ===== */
        #toast-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .toast {
            background: white;
            border-radius: 12px;
            padding: 14px 18px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
            border-left: 4px solid var(--success);
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideUp 0.3s ease;
            max-width: 320px;
        }

        @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
        body.no-scroll {
            overflow: hidden;
        }

        .sidebar {
            width: min(86vw, 320px);
        }

        .topbar {
            height: auto;
            min-height: 64px;
            padding: 10px 14px;
            align-items: flex-start;
        }

        .topbar-left {
            flex: 1;
            min-width: 0;
            align-items: flex-start;
        }

        .topbar-title {
            font-size: 16px;
            line-height: 1.25;
        }

        .topbar-shortcuts {
            width: 100%;
        }

        .topbar {
            grid-template-columns: 1fr;
        }

        .topbar-center {
            justify-content: flex-start;
            text-align: left;
        }

        .topbar-right {
            width: 100%;
            justify-content: flex-start;
        }

        .topbar-actions {
            width: 100%;
            justify-content: flex-start;
            margin-left: 50px;
            gap: 8px;
        }

        .topbar-actions .btn {
            padding: 7px 11px;
            font-size: 12px;
        }

        .main-content {
            margin-left: 0;
        }

        .chart-grid {
            grid-template-columns: 1fr;
        }

        .form-row {
            grid-template-columns: 1fr;
        }

        .stat-grid {
            grid-template-columns: 1fr 1fr;
        }
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation: none !important;
                transition: none !important;
                scroll-behavior: auto !important;
            }
        }

    </style>

    @stack('styles')
    <!-- Theme stylesheet (loads CSS variables for moods) -->
    <link rel="stylesheet" href="{{ asset('css/theme.css') }}">
    <link rel="stylesheet" href="{{ asset('css/pro-theme.css') }}">
</head>

<body class="theme-{{ auth()->user()->theme_preference ?? 'black-red' }} contrast-{{ auth()->user()->contrast_mode ?? 'default' }}">

    <!-- SIDEBAR -->
    <nav class="sidebar" id="sidebar">
        <a href="{{ url()->current() }}" class="sidebar-logo" onclick="window.location.reload(); return false;" title="রিফ্রেশ করুন">
            <div class="logo-icon">💰</div>
            <div class="logo-text">LP<span>_AI</span></div>
        </a>

        <div class="sidebar-nav">
            <div class="nav-section-title">মূল</div>
            <a href="{{ route('dashboard') }}"
                class="nav-item {{ request()->routeIs('dashboard') ? 'active' : '' }}">
                <i class="fas fa-chart-pie"></i> ড্যাশবোর্ড
            </a>

            <div class="nav-section-title">অর্থ</div>
            <a href="{{ route('transactions.index') }}"
                class="nav-item {{ request()->routeIs('transactions.*') ? 'active' : '' }}">
                <i class="fas fa-exchange-alt"></i> লেনদেন
            </a>
            <a href="{{ route('budget.index') }}"
                class="nav-item {{ request()->routeIs('budget.*') ? 'active' : '' }}">
                <i class="fas fa-wallet"></i> বাজেট
            </a>
            <a href="{{ route('reports.index') }}"
                class="nav-item {{ request()->routeIs('reports.*') ? 'active' : '' }}">
                <i class="fas fa-file-chart-line"></i> রিপোর্ট
            </a>

            <div class="nav-section-title">AI</div>
            <a href="{{ route('ai.index') }}"
                class="nav-item {{ request()->routeIs('ai.*') ? 'active' : '' }}">
                <i class="fas fa-robot"></i> AI Workspace
            </a>

            <div class="nav-section-title">সেটিংস</div>
            <div class="nav-group {{ request()->routeIs('settings.*') ? 'open' : '' }}" id="settings-group">
                <button type="button" class="nav-item nav-item-toggle {{ request()->routeIs('settings.*') ? 'active' : '' }}" id="settings-toggle">
                    <i class="fas fa-sliders-h"></i> সেটিংস
                    <i class="fas fa-chevron-right chevron"></i>
                </button>
                <div class="nav-sub">
                    <a href="{{ route('settings.index') }}" class="nav-sub-item {{ request()->routeIs('settings.index') ? 'active' : '' }}">
                        <i class="fas fa-house"></i> Home
                    </a>
                    <a href="{{ route('settings.theme') }}" class="nav-sub-item {{ request()->routeIs('settings.theme*') ? 'active' : '' }}">
                        <i class="fas fa-palette"></i> Theme
                    </a>
                    <a href="{{ route('settings.preferences') }}" class="nav-sub-item {{ request()->routeIs('settings.preferences*') ? 'active' : '' }}">
                        <i class="fas fa-language"></i> Language
                    </a>
                    <a href="{{ route('settings.preferences') }}" class="nav-sub-item {{ request()->routeIs('settings.preferences*') ? 'active' : '' }}">
                        <i class="fas fa-circle-half-stroke"></i> Contrast
                    </a>
                    <a href="{{ route('settings.ai') }}" class="nav-sub-item {{ request()->routeIs('settings.ai*') ? 'active' : '' }}">
                        <i class="fas fa-microchip"></i> AI Engine
                    </a>
                </div>
            </div>

            <form method="POST" action="{{ route('logout') }}" style="margin: 8px 12px 0 12px;">
                @csrf
                <button type="submit" class="nav-item nav-item-toggle" style="color:#fca5a5; border-radius: 10px;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </form>
        </div>

        <div class="sidebar-footer">
            <div class="user-card">
                <div class="user-avatar">{{ strtoupper(substr(auth()->user()->name, 0, 1)) }}</div>
                <div class="user-info">
                    <div class="name">{{ auth()->user()->name }}</div>
                    <div class="email">{{ auth()->user()->email }}</div>
                </div>
                <form method="POST" action="{{ route('logout') }}" style="margin:0">
                    @csrf
                    <button type="submit"
                        style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:14px;" title="লগআউট">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </form>
            </div>
        </div>
    </nav>

    <div class="sidebar-backdrop" id="sidebar-backdrop"></div>

    <!-- MAIN CONTENT -->
    <div class="main-content">
        @include('layouts.partials.topbar')

        <!-- PAGE CONTENT -->
        <div class="page-content">
            @if(session('success'))
                <div class="alert alert-success"><i class="fas fa-check-circle"></i>
                    {{ session('success') }}</div>
            @endif
            @if(session('info'))
                <div class="alert alert-info"><i class="fas fa-info-circle"></i> {{ session('info') }}
                </div>
            @endif
            @if(session('error'))
                <div class="alert alert-danger"><i class="fas fa-exclamation-triangle"></i>
                    {{ session('error') }}</div>
            @endif

            @yield('content')
        </div>
    </div>

    <!-- TOAST CONTAINER -->
    <div id="toast-container"></div>

    @php
        $__aiHistory = [];
        try {
            if (auth()->check()) {
                $__aiHistory = \App\Models\AISuggestion::where('user_id', auth()->id())->orderBy('created_at', 'desc')->limit(10)->get();
            }
        } catch (\Throwable $e) {
            $__aiHistory = [];
        }
    @endphp

    <div id="ai-history-panel" style="position:fixed;right:18px;top:70px;width:320px;max-height:70vh;overflow:auto;background:var(--surface);border:1px solid var(--border);box-shadow:0 12px 30px rgba(0,0,0,0.12);padding:12px;border-radius:12px;display:none;z-index:9999">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <strong>AI History</strong>
            <button id="ai-history-close" style="background:none;border:none;cursor:pointer">&times;</button>
        </div>
        <div id="ai-history-list">
            @forelse($__aiHistory as $s)
                <div class="ai-history-item" data-id="{{ $s->id }}" style="padding:8px;border-radius:8px;border:1px solid var(--border);margin-bottom:8px;background:var(--light)">
                    <div style="font-size:13px;font-weight:700">{{ Str::limit($s->summary ?? 'AI Suggestion', 80) }}</div>
                    <div style="font-size:12px;color:var(--gray);margin-top:6px">{{ $s->created_at->translatedFormat('Y-m-d H:i') }}</div>
                </div>
            @empty
                <div style="color:var(--gray)">কোন এআই ইতিহাস পাওয়া যায়নি।</div>
            @endforelse
        </div>
    </div>

    <!-- PUSHER REAL-TIME -->
    <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/laravel-echo@1.16.0/dist/echo.iife.js"></script>

    <script>
        // ===== GLOBAL SETUP =====
        const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').content;
        const USER_ID = '{{ auth()->id() }}';

        // Axios-like fetch wrapper
        async function apiCall(url, method = 'GET', data = null) {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': CSRF_TOKEN,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                }
            };
            if (data) options.body = JSON.stringify(data);
            const res = await fetch(url, options);
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Server error' }));
                throw new Error(errorData.message || `HTTP ${res.status}`);
            }
            return res.json();
        }

        // Toast notifications
        function showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.style.borderLeftColor = type === 'success' ? 'var(--success)' : type === 'warning' ?
                'var(--warning)' : 'var(--danger)';
            toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'}"
           style="color: ${type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : 'var(--danger)'}"></i>
        ${message}
    `;
            container.appendChild(toast);
            setTimeout(() => toast.remove(), 5000);
        }

        // ===== PUSHER REAL-TIME SETUP =====
        try {
            const pusherKey = '{{ env("PUSHER_APP_KEY") }}';
            if (pusherKey && pusherKey !== 'your_pusher_app_key' && pusherKey.length > 5) {
                window.Echo = new Echo({
                    broadcaster: 'pusher',
                    key: pusherKey,
                    cluster: '{{ env("PUSHER_APP_CLUSTER") }}',
                    forceTLS: true,
                    authEndpoint: '/broadcasting/auth',
                    auth: {
                        headers: {
                            'X-CSRF-TOKEN': CSRF_TOKEN
                        }
                    }
                });

                // Listen for AI suggestions on private channel
                Echo.private(`user.${USER_ID}`)
                    .listen('.ai.suggestion.ready', (data) => {
                        showToast('🤖 এআই আপনার আর্থিক পরামর্শ আপডেট করেছে!', 'success');

                        // Update FinScore if element exists
                        const finScoreEl = document.getElementById('fin-score-value');
                        if (finScoreEl && data.fin_score !== undefined) {
                            finScoreEl.textContent = data.fin_score;
                            animateFinScore(data.fin_score);
                        }

                        // Update daily limit if element exists
                        const dailyLimitEl = document.getElementById('ai-daily-limit');
                        if (dailyLimitEl && data.daily_limit) {
                            dailyLimitEl.textContent = Math.round(parseFloat(data.daily_limit));
                        }

                        // Update anomaly badge
                        if (data.anomalies && data.anomalies.length > 0) {
                            showToast(`⚠️ ${data.anomalies.length} টি ব্যয় অসামঞ্জস্য সনাক্ত হয়েছে!`, 'warning');
                        }
                    });
            } else {
                console.log('Pusher কনফিগার করা হয়নি — রিয়েল-টাইম আপডেট নিষ্ক্রিয়। পোলিং ব্যবহার করা হচ্ছে।');
            }
        } catch (echoErr) {
            console.warn('Echo/Pusher init skipped:', echoErr.message);
        }

        // AI history panel toggle and realtime updates
        document.addEventListener('DOMContentLoaded', function () {
            const panel = document.getElementById('ai-history-panel');
            const toggle = document.getElementById('ai-history-toggle');
            const closeBtn = document.getElementById('ai-history-close');
            const list = document.getElementById('ai-history-list');
            const countEl = document.getElementById('ai-history-count');

            function updateCount() {
                const items = list ? list.querySelectorAll('.ai-history-item').length : 0;
                if (countEl) countEl.textContent = items > 0 ? `(${items})` : '';
            }

            if (toggle) {
                toggle.addEventListener('click', () => {
                    if (!panel) return;
                    panel.style.display = panel.style.display === 'none' || panel.style.display === '' ? 'block' : 'none';
                });
            }

            if (closeBtn) {
                closeBtn.addEventListener('click', () => panel && (panel.style.display = 'none'));
            }

            updateCount();

            // Prepend new suggestion when received via Echo
            if (window.Echo) {
                try {
                    Echo.private(`user.${USER_ID}`)
                        .listen('.ai.suggestion.ready', (payload) => {
                            const data = payload.suggestion || payload;
                            const item = document.createElement('div');
                            item.className = 'ai-history-item';
                            item.style = 'padding:8px;border-radius:8px;border:1px solid var(--border);margin-bottom:8px;background:var(--light)';
                            item.dataset.id = data.id || '';
                            const title = document.createElement('div');
                            title.style.fontSize = '13px'; title.style.fontWeight = '700';
                            title.textContent = (data.summary || data.title || 'AI Suggestion').slice(0, 120);
                            const meta = document.createElement('div');
                            meta.style.fontSize = '12px'; meta.style.color = 'var(--gray)'; meta.style.marginTop = '6px';
                            meta.textContent = new Date(data.created_at || Date.now()).toLocaleString();
                            item.appendChild(title); item.appendChild(meta);
                            if (list) list.prepend(item);
                            updateCount();
                        });
                } catch (e) {
                    // ignore
                }
            }
        });

        // Animate FinScore ring
        function animateFinScore(score) {
            const canvas = document.getElementById('fin-score-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const W = canvas.width,
                H = canvas.height;
            const cx = W / 2,
                cy = H / 2,
                radius = W / 2 - 12;

            let current = 0;
            const target = score;
            const interval = setInterval(() => {
                ctx.clearRect(0, 0, W, H);
                // Background ring
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 12;
                ctx.stroke();
                // Score arc
                const color = current >= 70 ? '#10b981' : current >= 40 ? '#f59e0b' : '#ef4444';
                ctx.beginPath();
                ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + (2 * Math.PI * current / 100));
                ctx.strokeStyle = color;
                ctx.lineWidth = 12;
                ctx.lineCap = 'round';
                ctx.stroke();

                current = Math.min(current + 2, target);
                if (current >= target) clearInterval(interval);
            }, 20);
        }

        document.addEventListener('DOMContentLoaded', () => {
            const sidebar = document.getElementById('sidebar');
            const menuToggle = document.getElementById('menu-toggle');
            const sidebarBackdrop = document.getElementById('sidebar-backdrop');
            const settingsGroup = document.getElementById('settings-group');
            const settingsToggle = document.getElementById('settings-toggle');
            const menuIcon = menuToggle?.querySelector('i');
            const TIP_KEY = 'lpai_menu_hint_seen_v1';

            const getMenuTipText = (open) => {
                const isTouch = window.matchMedia('(pointer: coarse)').matches;
                if (isTouch) return open ? 'Tap to close menu' : 'Tap to open menu';
                return open ? 'Press M to close menu' : 'Press M to open menu';
            };

            const lockBodyScroll = (shouldLock) => {
                if (window.innerWidth <= 768) {
                    document.body.classList.toggle('no-scroll', shouldLock);
                } else {
                    document.body.classList.remove('no-scroll');
                }
            };

            const setMenuState = (open) => {
                if (!menuToggle || !menuIcon) return;
                menuToggle.classList.toggle('is-active', open);
                menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
                menuToggle.setAttribute('data-tip', getMenuTipText(open));
                menuIcon.classList.remove('fa-bars', 'fa-xmark');
                menuIcon.classList.add(open ? 'fa-xmark' : 'fa-bars');
            };

            const closeSidebar = () => {
                if (sidebar?.classList.contains('open')) {
                    sidebar.classList.remove('spring-in');
                    sidebar.classList.add('spring-out');
                }
                sidebar?.classList.remove('open');
                sidebarBackdrop?.classList.remove('show');
                lockBodyScroll(false);
                setMenuState(false);
            };

            const openSidebar = () => {
                sidebar?.classList.remove('spring-out');
                sidebar?.classList.add('spring-in');
                sidebar?.classList.add('open');
                sidebarBackdrop?.classList.add('show');
                lockBodyScroll(true);
                setMenuState(true);
            };

            if (menuToggle && !localStorage.getItem(TIP_KEY)) {
                menuToggle.classList.add('show-tip');
                setTimeout(() => menuToggle.classList.remove('show-tip'), 3200);
            }

            const markTipSeen = () => {
                if (!menuToggle) return;
                menuToggle.classList.remove('show-tip');
                localStorage.setItem(TIP_KEY, '1');
            };

            menuToggle?.addEventListener('click', () => {
                markTipSeen();
                const isOpen = sidebar?.classList.contains('open');
                if (isOpen) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            });

            sidebarBackdrop?.addEventListener('click', closeSidebar);

            sidebar?.querySelectorAll('a.nav-item, a.nav-sub-item').forEach((link) => {
                link.addEventListener('click', closeSidebar);
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    lockBodyScroll(false);
                }
            });

            let touchStartX = 0;
            let touchStartY = 0;
            let touchMode = '';

            document.addEventListener('touchstart', (event) => {
                if (!event.touches || event.touches.length !== 1) return;
                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;
                const isOpen = sidebar?.classList.contains('open');
                if (!isOpen && touchStartX <= 24) {
                    touchMode = 'open';
                } else if (isOpen && touchStartX <= (sidebar?.offsetWidth || 320)) {
                    touchMode = 'close';
                } else {
                    touchMode = '';
                }
            }, { passive: true });

            document.addEventListener('touchend', (event) => {
                if (!touchMode || !event.changedTouches || event.changedTouches.length !== 1) return;
                const deltaX = event.changedTouches[0].clientX - touchStartX;
                const deltaY = event.changedTouches[0].clientY - touchStartY;
                if (Math.abs(deltaY) < 40) {
                    if (touchMode === 'open' && deltaX > 42) openSidebar();
                    if (touchMode === 'close' && deltaX < -42) closeSidebar();
                }
                touchMode = '';
            }, { passive: true });

            document.addEventListener('keydown', (event) => {
                const tag = event.target?.tagName;
                const editable = tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable;
                if (event.key === 'Escape') closeSidebar();
                if (!editable && (event.key === 'm' || event.key === 'M')) {
                    event.preventDefault();
                    markTipSeen();
                    const isOpen = sidebar?.classList.contains('open');
                    if (isOpen) {
                        closeSidebar();
                    } else {
                        openSidebar();
                    }
                }
            });

            settingsToggle?.addEventListener('click', () => {
                settingsGroup?.classList.toggle('open');
            });

            setMenuState(false);

            // Animate FinScore on load
            const finScoreEl = document.getElementById('fin-score-value');
            if (finScoreEl) animateFinScore(parseInt(finScoreEl.textContent) || 0);

            // Shared scroll-reveal animation for cards
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.14 });

            document.querySelectorAll('.card, .dash-stat-card, .dash-chart-card, .dash-table-card, .dash-budget-item').forEach((el, index) => {
                el.classList.add('reveal-on-scroll');
                el.style.transitionDelay = `${Math.min(index * 40, 260)}ms`;
                observer.observe(el);
            });

            // Auto-dismiss alerts
            setTimeout(() => {
                document.querySelectorAll('.alert').forEach(el => el.style.display = 'none');
            }, 5000);
        });

        // Button ripple effect
        document.addEventListener('click', (event) => {
            const button = event.target.closest('.btn, .dash-btn-glass');
            if (!button) return;
            button.classList.add('ripple-btn');
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.className = 'ripple';
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;
            ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        });

    </script>

    @stack('scripts')

    <script>
        // Theme loader: apply saved mood and contrast from localStorage
        (function(){
            try{
                const mood = localStorage.getItem('theme_mood') || null;
                if(mood) document.documentElement.setAttribute('data-mood', mood);
                const contrast = localStorage.getItem('contrast_level');
                const wrapper = document.getElementById('app') || document.querySelector('.main-content') || document.body;
                if(contrast && wrapper){ wrapper.style.filter = `brightness(${contrast}%)`; }
                // Load fonts for Bengali + Inter for numbers
                const link1 = document.createElement('link');
                link1.rel = 'stylesheet';
                link1.href = 'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap';
                document.head.appendChild(link1);
                const link2 = document.createElement('link');
                link2.rel = 'stylesheet';
                link2.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap';
                document.head.appendChild(link2);
            }catch(e){ console.warn('Theme loader error', e); }
        })();
    </script>
    <script>
        // If server set flash payload to set localStorage, apply it immediately
        (function(){
            try{
                @if(session()->has('set_theme_mood'))
                    localStorage.setItem('theme_mood', '{{ session('set_theme_mood') }}');
                    document.documentElement.setAttribute('data-mood','{{ session('set_theme_mood') }}');
                @endif
                @if(session()->has('set_contrast_level'))
                    localStorage.setItem('contrast_level', '{{ session('set_contrast_level') }}');
                    const wrapper = document.getElementById('app') || document.querySelector('.main-content') || document.body;
                    if(wrapper) wrapper.style.filter = `brightness({{ session('set_contrast_level') } }%)`;
                @endif
            }catch(e){ }
        })();
    </script>
</body>

</html>
