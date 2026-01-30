@echo off
echo ================================
echo Life Pilot AI Agent - Setup
echo ================================
echo.

echo Installing Frontend Dependencies...
cd frontend
call npm install
cd ..
echo.

echo Installing Backend Dependencies...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..
echo.

echo ================================
echo Setup Complete!
echo ================================
echo.
echo To start the application:
echo 1. Start MongoDB service
echo 2. Run: start-dev.bat
echo.
pause
