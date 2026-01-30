@echo off
cls
echo.
echo ========================================
echo   Life Pilot AI - Quick Start
echo ========================================
echo.

REM Check if backend virtual environment exists
if not exist "backend\venv" (
    echo [ERROR] Backend virtual environment not found!
    echo Please run setup.bat first.
    echo.
    pause
    exit /b 1
)

REM Check if frontend node_modules exists
if not exist "frontend\node_modules" (
    echo [ERROR] Frontend dependencies not found!
    echo Please run setup.bat first.
    echo.
    pause
    exit /b 1
)

echo [1/2] Starting Backend Server...
echo      URL: http://localhost:5000
start "Life Pilot - Backend" cmd /k "cd /d "%~dp0backend" && venv\Scripts\activate && python app.py"
timeout /t 3 /nobreak >nul

echo.
echo [2/2] Starting Frontend Server...
echo      URL: http://localhost:3000
start "Life Pilot - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo   Press any key to exit this window
echo   (Servers will keep running)
echo ========================================
echo.
pause >nul
