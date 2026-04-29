# LP_AI Database Setup & Import Guide

## Database Info
- **Database Name:** `LP_AI`
- **Engine:** MySQL (via XAMPP)
- **Charset:** `utf8mb4`
- **Collation:** `utf8mb4_unicode_ci`

## Current Status
- Database `LP_AI` is created in your XAMPP MySQL server
- All 17 tables are migrated and seeded with sample data
- Export file: `LP_AI_export.sql` (includes structure + data)

## After Reinstalling XAMPP

Follow these steps to restore the database:

### Step 1: Start XAMPP MySQL
Open XAMPP Control Panel → Start **MySQL**

### Step 2: Create the Database
Open Command Prompt or Terminal, then run:

```bash
# Windows (adjust path if XAMPP is installed elsewhere)
C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS LP_AI CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Or if you use the included import script:
import_database.bat
```

### Step 3: Import the SQL File
```bash
# Windows
C:\xampp\mysql\bin\mysql.exe -u root LP_AI < database\LP_AI_export.sql

# Or simply run the batch file:
import_database.bat
```

### Step 4: Update `.env` File
Make sure your `.env` file has these settings:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=LP_AI
DB_USERNAME=root
DB_PASSWORD=
```

### Step 5: Clear Config Cache
```bash
php artisan config:clear
```

## Alternative: Full Reset with Migrations
If you prefer to rebuild from migrations instead of importing:

```bash
php artisan migrate:fresh --seed
```

## Table List (17 Tables)
1. `users` - Admin and regular users
2. `transactions` - Income, expenses, savings records
3. `budgets` - Monthly budget limits
4. `expenses` - Detailed expense tracking
5. `ai_suggestions` - AI-generated financial advice
6. `health_profiles` - User health data
7. `reports` - Monthly/annual financial reports
8. `routines` - Daily/family routines
9. `meetings` - Scheduled meetings
10. `tasks` - Todo items
11. `prayer_times` - Prayer time tracking
12. `income_sources` - Income source records
13. `financial_goals` - Savings goals
14. `investments` - Investment portfolio
15. `savings` - Savings accounts
16. `user_finance_profiles` - Financial health scores
17. `migrations` - Laravel migration tracking

## Default Login Credentials
- **Admin:** `admin@lifepilot.ai` / `admin123`
- **User 1:** `john.doe@example.com` / `password123`
- **User 2:** `fatima.rahman@example.com` / `password123`

## Backup Note
To create a fresh export anytime:
```bash
mysqldump -u root LP_AI > database\LP_AI_export.sql
```

