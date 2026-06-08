# Импорт исторических замеров из api/import-measurements-history.json
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Php = Join-Path $ProjectRoot "server\runtime\php\php.exe"
$Script = Join-Path $ProjectRoot "scripts\import-measurements.php"

if (-not (Test-Path $Php)) {
    Write-Error "PHP not found: $Php"
    exit 1
}

& $Php $Script
