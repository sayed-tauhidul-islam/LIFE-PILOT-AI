@echo off
cls
echo.
echo ========================================
echo   Finance Data Setup
echo ========================================
echo.

echo [1/3] Installing Python packages...
cd backend
pip install pandas numpy requests beautifulsoup4 yfinance faker

echo.
echo [2/3] Creating data directory...
if not exist "data" mkdir data

echo.
echo [3/3] Generating synthetic finance data...
python synthetic_data_generator.py

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Generated Files:
echo   - backend/data/personal_finance_data.csv
echo   - backend/data/transaction_data.csv
echo   - backend/data/financial_goals_data.csv
echo   - backend/data/investment_data.csv
echo   - backend/data/dataset_summary.json
echo.
echo Next Steps:
echo   1. Test API client: python backend/finance_api_client.py
echo   2. View data: Check backend/data/ folder
echo   3. Start application: .\run.bat
echo.
pause
