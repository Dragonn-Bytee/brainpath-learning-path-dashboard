@echo off
title MERN Starter and Organizer

echo ====================================================
echo   MERN Project Organizer and Launcher
echo ====================================================
echo.

:: Step 1: Run the organization script
echo [1/4] Separating frontend and backend folders...
node organize.js
echo.

:: Step 2: Install Backend Dependencies and Start Backend
echo [2/4] Installing backend dependencies...
cd backend
call npm install --legacy-peer-deps
echo.
echo [3/4] Launching backend server in a new window...
start "MERN Backend Server" cmd /k "node server.js"
echo.

:: Step 3: Install Frontend Dependencies and Start Frontend
echo [4/4] Setting up frontend...
cd ../frontend
call npm install --legacy-peer-deps
echo.
echo ====================================================
echo   SUCCESS: Starting Frontend Server...
echo ====================================================
npm run dev
