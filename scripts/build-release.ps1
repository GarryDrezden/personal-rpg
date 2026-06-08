# Сборка staging-папки для Inno Setup
$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path))).Path
$Staging = Join-Path $ProjectRoot "release\staging"
$PhpCgi = Join-Path $ProjectRoot "server\runtime\php\php-cgi.exe"
$Nginx = Join-Path $ProjectRoot "server\runtime\nginx\nginx.exe"

Write-Host "Building frontend..."
Push-Location $ProjectRoot
npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }
Pop-Location

if (-not (Test-Path $PhpCgi)) {
    Write-Error "PHP not found: $PhpCgi`nPlace portable PHP in server/runtime/php/"
    exit 1
}
if (-not (Test-Path $Nginx)) {
    Write-Error "nginx not found: $Nginx`nDownload from https://nginx.org/en/download.html"
    exit 1
}
if (-not (Test-Path (Join-Path $ProjectRoot "dist\index.html"))) {
    Write-Error "dist/index.html missing after build"
    exit 1
}

Write-Host "Preparing staging: $Staging"
if (Test-Path $Staging) {
    Remove-Item $Staging -Recurse -Force
}
New-Item -ItemType Directory -Path $Staging | Out-Null

function Copy-Tree($src, $dst, $exclude = @()) {
    if (-not (Test-Path $src)) { return }
    New-Item -ItemType Directory -Path $dst -Force | Out-Null
    Get-ChildItem $src -Force | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
        $target = Join-Path $dst $_.Name
        if ($_.PSIsContainer) {
            Copy-Tree $_.FullName $target $exclude
        } else {
            Copy-Item $_.FullName $target -Force
        }
    }
}

Copy-Item (Join-Path $ProjectRoot "dist") (Join-Path $Staging "dist") -Recurse -Force
Copy-Tree (Join-Path $ProjectRoot "api") (Join-Path $Staging "api")
New-Item -ItemType Directory -Path (Join-Path $Staging "data") -Force | Out-Null

Copy-Tree (Join-Path $ProjectRoot "server\runtime\php") (Join-Path $Staging "server\runtime\php")
Copy-Tree (Join-Path $ProjectRoot "server\runtime\nginx") (Join-Path $Staging "server\runtime\nginx") @("logs")

New-Item -ItemType Directory -Path (Join-Path $Staging "server\runtime\nginx\logs") -Force | Out-Null

$scripts = @(
    "start-all.ps1", "stop-all.ps1", "install-autostart.ps1",
    "uninstall-autostart.ps1", "open-on-login.ps1", "reset-data.ps1"
)
New-Item -ItemType Directory -Path (Join-Path $Staging "scripts") -Force | Out-Null
foreach ($s in $scripts) {
    $src = Join-Path $ProjectRoot "scripts\$s"
    if (Test-Path $src) {
        Copy-Item $src (Join-Path $Staging "scripts\$s") -Force
    }
}

foreach ($launcher in @("PersonalRPG.bat", "PersonalRPG-Stop.bat")) {
    Copy-Item (Join-Path $ProjectRoot $launcher) (Join-Path $Staging $launcher) -Force
}

Copy-Item (Join-Path $ProjectRoot "README.md") (Join-Path $Staging "README.md") -Force -ErrorAction SilentlyContinue

Write-Host "Staging ready: $Staging"
Write-Host "Next: compile installer/personal-rpg.iss with Inno Setup"
