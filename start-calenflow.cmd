@echo off
title CalenFlow dev server
cd /d "%~dp0"

echo Starting CalenFlow...
echo.

if not exist "node_modules" (
  echo First run: installing dependencies. This can take a few minutes.
  call npm install
  if errorlevel 1 goto fail
)

rem Open the browser a few seconds after the server starts.
start "" /min cmd /c "timeout /t 12 >nul & start http://localhost:3000"

echo Website  : http://localhost:3000
echo App demo : http://localhost:3000/welcome
echo.
echo Keep this window open. Press Ctrl+C to stop the server.
echo.

call npm run dev
goto end

:fail
echo.
echo npm install failed. Check the messages above, then run this file again.
pause

:end
pause
