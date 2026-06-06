# Запуск PHP API для разработки без nginx (порт 8080)
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Php = Join-Path $ProjectRoot "server\runtime\php\php.exe"

if (-not (Test-Path $Php)) {
    Write-Host "PHP не найден в server/runtime/php/."
    Write-Host "Скачайте PHP portable (см. server/README-server.md) и распакуйте в server/runtime/php/"
    exit 1
}

$PhpIni = Join-Path (Split-Path $Php) "php.ini"
if (-not (Test-Path $PhpIni)) {
    Copy-Item (Join-Path (Split-Path $Php) "php.ini-production") $PhpIni -ErrorAction SilentlyContinue
}

Write-Host "API: http://127.0.0.1:8080/api/"
Set-Location (Join-Path $ProjectRoot "api")
& $Php -S 127.0.0.1:8080 router-dev.php
