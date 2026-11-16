@echo off
title Athena Library System - Live Server
color 0A

echo.
echo  ====================================================
echo   ATHENA CENTRAL LIBRARY - Digital Circulation System
echo  ====================================================
echo.

cd /d "%~dp0"

REM -- Check if dist/ folder exists, if not, build first --
IF NOT EXIST "dist\index.html" (
    echo  [INFO] First run detected. Building production files...
    call npm run build
    IF ERRORLEVEL 1 (
        echo.
        echo  [ERROR] Build failed!
        pause
        exit /b 1
    )
    echo  [SUCCESS] Build complete!
    echo.
)

REM -- Free port 3000 if already occupied --
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " 2^>nul') do (
    echo  [INFO] Freeing port 3000 (PID %%a)...
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 1 /nobreak >nul

echo  [INFO] Starting Athena Library server...
echo  [INFO] Browser will open at: http://localhost:3000
echo.

node server.js

echo.
echo  Server has stopped.
pause
