# Запуск Personal RPG: php-cgi + nginx (без окон)
# nginx не понимает кириллицу в путях — используем subst P:
$ErrorActionPreference = "SilentlyContinue"

$ProjectRoot = (Resolve-Path (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path))).Path
$SubstDrive = "P:"
$Runtime = Join-Path $ProjectRoot "server\runtime"
$PhpCgi = Join-Path $Runtime "php\php-cgi.exe"
$Nginx = Join-Path $Runtime "nginx\nginx.exe"
$NginxPrefix = Join-Path $Runtime "nginx"

if (-not (Test-Path $PhpCgi)) {
    Write-Error "Ne naiden php-cgi. Putite PHP v server/runtime/php/"
    exit 1
}
if (-not (Test-Path $Nginx)) {
    Write-Error "Ne naiden nginx. Putite nginx v server/runtime/nginx/"
    exit 1
}
if (-not (Test-Path (Join-Path $ProjectRoot "dist\index.html"))) {
    Write-Error "Net dist/index.html. Zapustite: npm run build"
    exit 1
}

# Виртуальный диск без кириллицы для nginx
$existing = (subst 2>&1) | Where-Object { $_ -match "^$SubstDrive" }
if ($existing -and $existing -notmatch [regex]::Escape($ProjectRoot)) {
    subst $SubstDrive /d 2>$null
    $existing = $null
}
if (-not $existing) {
    subst $SubstDrive $ProjectRoot
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Ne udalos sozdat subst $SubstDrive -> $ProjectRoot"
        exit 1
    }
}

$Root = "$SubstDrive/"
$Dist = "${Root}dist"
$ApiIndex = "${Root}api/index.php"
$NginxPrefixSubst = "${SubstDrive}/server/runtime/nginx"

$NginxConf = Join-Path $NginxPrefix "conf\personal-rpg.conf"
$lines = @(
    "worker_processes  1;"
    "error_log  logs/personal-rpg-error.log;"
    ""
    "events {"
    "    worker_connections  1024;"
    "}"
    ""
    "http {"
    "    include       mime.types;"
    "    default_type  application/octet-stream;"
    "    sendfile      on;"
    "    keepalive_timeout  65;"
    ""
    "    server {"
    "        listen       8080;"
    "        server_name  localhost;"
    ""
    "        root $Dist;"
    "        index index.html;"
    ""
    "        location /api {"
    "            fastcgi_pass   127.0.0.1:9000;"
    "            include        fastcgi_params;"
    "            fastcgi_param  SCRIPT_FILENAME $ApiIndex;"
    "            fastcgi_param  REQUEST_URI `$request_uri;"
    "        }"
    ""
    "        location / {"
    "            try_files `$uri `$uri/ /index.html;"
    "        }"
    "    }"
    "}"
)
Set-Content -Path $NginxConf -Value $lines -Encoding ASCII

function Test-PortInUse([int]$Port) {
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return $null -ne $conn
}

if (-not (Test-PortInUse 9000)) {
    Start-Process -FilePath $PhpCgi `
        -ArgumentList "-b", "127.0.0.1:9000" `
        -WorkingDirectory "${SubstDrive}\server\runtime\php" `
        -WindowStyle Hidden
    Start-Sleep -Seconds 2
}

if (-not (Test-PortInUse 8080)) {
    Start-Process -FilePath $Nginx `
        -ArgumentList "-p", $NginxPrefixSubst, "-c", "conf/personal-rpg.conf" `
        -WorkingDirectory $NginxPrefixSubst `
        -WindowStyle Hidden
    Start-Sleep -Seconds 1
}

Write-Host "Personal RPG: http://127.0.0.1:8080"
