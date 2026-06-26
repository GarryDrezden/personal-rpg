@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo  Personal RPG - ustanovka avtozapuska
echo  =====================================
echo.

REM Zapusk bez slozhnyh kavychek: esli net admina - zaprosim povyshenie
net session >nul 2>&1
if errorlevel 1 (
    echo  Zapros prav administratora...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

echo  Papka: %ROOT%
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\scripts\install-autostart.ps1" -InstallDir "%ROOT%"
set "ERR=%ERRORLEVEL%"

echo.
if not "%ERR%"=="0" (
    echo  Oshibka ustanovki. Kod: %ERR%
    echo  Smotrite log: server\runtime\autostart-install.log
) else (
    echo  Gotovo. Posle vhoda v Windows: http://127.0.0.1:8080
)
echo.
pause
exit /b %ERR%
