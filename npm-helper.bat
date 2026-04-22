@echo off
REM LP_AI Project - NPM Helper Script
REM This script sets up the NODE.JS environment and runs npm commands

setlocal enabledelayedexpansion

REM Set Node.js path
set NODE_PATH=C:\Program Files\nodejs
set PATH=%NODE_PATH%;%PATH%

REM Check if Node.js is installed
if not exist "%NODE_PATH%\node.exe" (
    echo Error: Node.js not found at %NODE_PATH%
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

REM Change to project directory
cd /d "F:\My projects\Life-Pilot-AI\LP_AI\LP_AI"

REM Show Node/npm versions
echo ===============================================
echo Node.js and npm setup for LP_AI
echo ===============================================
call %NODE_PATH%\node.exe --version
call %NODE_PATH%\npm.cmd --version
echo.

REM Run the provided npm command or show usage
if "%1"=="" (
    echo Usage: npm-helper.bat [command]
    echo.
    echo Examples:
    echo   npm-helper.bat install
    echo   npm-helper.bat run build
    echo   npm-helper.bat run dev
    echo   npm-helper.bat audit fix
    echo.
) else (
    echo Running: npm %*
    call %NODE_PATH%\npm.cmd %*
)

endlocal
