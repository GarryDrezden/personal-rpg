#Requires -RunAsAdministrator
$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Runtime = Join-Path $ProjectRoot "server\runtime"
$Nssm = Join-Path $Runtime "nssm\nssm.exe"
$Nginx = Join-Path $Runtime "nginx\nginx.exe"
$PhpCgi = Join-Path $Runtime "php\php-cgi.exe"
$NginxConf = Join-Path $ProjectRoot "server\nginx.conf"

if (-not (Test-Path $Nssm)) {
    Write-Host "Скачайте NSSM в server/runtime/nssm/ — см. server/README-server.md"
    exit 1
}
if (-not (Test-Path $Nginx)) {
    Write-Host "Скачайте nginx в server/runtime/nginx/ — см. server/README-server.md"
    exit 1
}
if (-not (Test-Path $PhpCgi)) {
    Write-Host "Скачайте PHP в server/runtime/php/ — см. server/README-server.md"
    exit 1
}

# PHP-CGI
& $Nssm install PersonalRpgPhpCgi $PhpCgi "-b" "127.0.0.1:9000"
& $Nssm set PersonalRpgPhpCgi AppDirectory (Join-Path $Runtime "php")
& $Nssm start PersonalRpgPhpCgi

# nginx
& $Nssm install PersonalRpgNginx $Nginx "-p" (Join-Path $Runtime "nginx") "-c" $NginxConf
& $Nssm set PersonalRpgNginx AppDirectory (Join-Path $Runtime "nginx")
& $Nssm start PersonalRpgNginx

Write-Host "Службы PersonalRpgPhpCgi и PersonalRpgNginx установлены."
Write-Host "Сайт: http://127.0.0.1:8080"
