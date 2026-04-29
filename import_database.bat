@echo off
echo ================================================
echo   LP_AI Database Import Tool
echo ================================================
echo.

REM Detect common XAMPP installation paths
set MYSQL_PATH=

if exist "C:\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe
) else if exist "D:\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH=D:\xampp\mysql\bin\mysql.exe
) else if exist "E:\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH=E:\xampp\mysql\bin\mysql.exe
) else if exist "F:\software\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH=F:\software\xampp\mysql\bin\mysql.exe
) else (
    echo ERROR: Could not find mysql.exe
echo Please edit this file and set the correct path to your XAMPP MySQL binary.
echo.
pause
exit /b 1
)

echo Found MySQL at: %MYSQL_PATH%
echo.

REM Check if SQL file exists
set SQL_FILE=database\LP_AI_export.sql

if not exist "%SQL_FILE%" (
    echo ERROR: Export file not found at %SQL_FILE%
echo Make sure you are running this script from the project root folder.
echo.
pause
exit /b 1
)

echo Step 1: Creating database 'LP_AI' (if not exists)..."%MYSQL_PATH%" -u root -e "CREATE DATABASE IF NOT EXISTS LP_AI CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to create database. Make sure XAMPP MySQL is running.
echo.
pause
exit /b 1
)

echo.
echo Step 2: Importing data from %SQL_FILE%..."%MYSQL_PATH%" -u root LP_AI < "%SQL_FILE%"

if %ERRORLEVEL% neq 0 (
    echo ERROR: Import failed.
echo.
pause
exit /b 1
)

echo.
echo ================================================
echo   SUCCESS! Database imported successfully!
echo ================================================
echo.
echo Database: LP_AI
echo Tables: 17
echo.
echo Next steps:
echo 1. Make sure your .env file has:
echo    DB_CONNECTION=mysql
echo    DB_DATABASE=LP_AI
echo    DB_USERNAME=root
echo 2. Run: php artisan config:clear
echo 3. Run: php artisan serve
echo.
pause

