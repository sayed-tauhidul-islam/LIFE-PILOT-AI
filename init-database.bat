@echo off
echo ================================
echo MongoDB Database Initialization
echo ================================
echo.

echo This script will initialize the Life Pilot AI database in MongoDB.
echo Make sure MongoDB is running before proceeding!
echo.
pause

echo.
echo Initializing database...
mongosh < database\mongodb_init.js

echo.
echo ================================
echo Database initialized!
echo ================================
echo.
echo Would you like to load sample data? (Y/N)
set /p LOAD_SAMPLE=

if /i "%LOAD_SAMPLE%"=="Y" (
    echo Loading sample data...
    mongosh < database\seed_data.js
    echo Sample data loaded!
)

echo.
echo Setup complete!
echo.
pause
