@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies...
  call npm.cmd install
)
echo Starting the site at http://localhost:5173
call npm.cmd run dev -- --open
pause
