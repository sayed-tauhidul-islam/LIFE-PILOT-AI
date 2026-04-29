# Life Pilot AI

Life Pilot AI is now a Laravel-first web application with Blade-based frontend pages, MongoDB models, and a redesigned menu-driven user experience.

## Highlights
- Laravel backend routes and controllers are the active runtime
- Professional redesigned UI with top-left menu toggle
- Menu options include: AI, Settings, Theme, Language, Contrast, Logout
- Language options: Bangla, English, Hindi
- Theme presets: Black+Red, Black+White, Green+White, Yellow+Black, Pink+Black
- Contrast modes: Default, Light, Dark
- Mobile-first responsive layout

## Tech Stack
- Backend: Laravel (PHP)
- Frontend: Blade templates, CSS, Tailwind utility support, JavaScript
- Database: MongoDB

## Architecture
- App logic: `app/`
- Web routes: `routes/web.php`
- UI templates: `resources/views/`
- Static/public assets: `public/`, `assets/`

## Screenshots

Place images in assets/screenshots using the file names below.

### 1) Hero Dashboard
![Hero Dashboard](assets/screenshots/hero-dashboard.png)

### 2) Left Menu + Settings
![Left Menu Settings](assets/screenshots/left-menu-settings.png)

### 3) AI Experience
![AI Chat](assets/screenshots/ai-chat.png)

### 4) Financial Analytics
![Financial Analytics](assets/screenshots/financial-analytics.png)

### 5) Mobile UI
![Mobile View](assets/screenshots/mobile-view.png)

## Local Setup

### Prerequisites
- PHP 8.2+
- Composer
- MongoDB

### 1) Install PHP Dependencies
```bash
composer install
```

### 2) Configure Environment
```bash
copy .env.example .env
```

Update `.env` values (MongoDB URI, app key, and AI provider keys).

### 3) Run Laravel App

If `artisan` exists in your local copy:
```bash
php artisan serve
```

If you run with your own PHP server config, point document root to `public/`.

## Environment Variables

Gemini config (root `.env`):
```env
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-2.0-flash
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

## MongoDB

Database initialization scripts are in `database/`:
- `database/mongodb_init.js`
- `database/seed_data.js`

Default DB name: `lifepilot_ai`

## Notes
- If screenshots are missing in GitHub preview, add them into `assets/screenshots`.

## Implemented AI Features (so far)

- AI chat interface: add income/expense/investment via natural language (Bangla/English/Hindi).
- Auto-save toggle: `Auto AI Add` (dashboard) — when enabled AI will save parsed transactions automatically.
- `created_by_ai` flag and badge: transactions saved by AI are tagged and shown with an "Added by AI" badge; Undo button available in transactions list.
- AI History: quick view of recent transactions and AI runs available from the AI page.
- AI Suggestions & Recommendations pages: list recent AI-generated insights and recommendations (topbar shortcuts updated).
- Real-time suggestion refresh: AI processing dispatched after chat saves to refresh suggestions asynchronously.
- Bangla numeral parsing: improved extraction for Bengali numerals and comma-separated numbers (e.g., ১,২০০ or 1,200) and support for the word `টাকা`.

## Next Planned Work

- Improve Bangla parsing further for colloquial phrases and complex sentences.
- Add confirmation UI in AI chat for pending drafts when auto-save is disabled.
- Add tests and static checks, and polish UI/UX across AI pages.

If you want me to include a changelog entry or more detailed usage examples for the AI chat commands, tell me and I'll add them.
