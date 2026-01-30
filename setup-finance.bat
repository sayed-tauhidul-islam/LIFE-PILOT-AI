@echo off
cls
echo.
echo ========================================
echo   Finance System Setup
echo ========================================
echo.

echo [1/2] Installing Frontend Dependencies...
echo.
cd frontend
call npm install recharts lucide-react
echo.
echo Frontend dependencies installed!
echo.

echo [2/2] Installing Backend Dependencies...
echo.
cd ..\backend
call venv\Scripts\activate && pip install numpy
echo.
echo Backend dependencies installed!
echo.

cd ..

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Finance system is ready to use!
echo.
echo To start the application, run:
echo   .\run.bat
echo.
echo Or visit the documentation:
echo   FINANCE-QUICK-START.md
echo.
pause
