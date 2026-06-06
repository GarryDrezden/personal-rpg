# Сброс БД: удаляет personal-rpg.sqlite, при следующем запросе создаётся заново из seed.json
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Db = Join-Path $ProjectRoot "data\personal-rpg.sqlite"

if (Test-Path $Db) {
    Remove-Item $Db -Force
    Write-Host "Database deleted."
} else {
    Write-Host "Database not found - will be created on first request."
}

Write-Host "Refresh browser: http://127.0.0.1:8080"
