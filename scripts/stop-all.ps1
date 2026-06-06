# Остановка php-cgi и nginx Personal RPG
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Nginx = Join-Path $ProjectRoot "server\runtime\nginx\nginx.exe"

if (Test-Path $Nginx) {
    & $Nginx -s quit 2>$null
}

Get-Process php-cgi -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "Personal RPG остановлен."
