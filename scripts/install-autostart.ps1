#Requires -RunAsAdministrator
# Регистрирует автозапуск Personal RPG при входе в Windows (Планировщик задач)
$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$StartScript = Join-Path $ProjectRoot "scripts\start-all.ps1"
$TaskName = "PersonalRpgAutostart"

if (-not (Test-Path $StartScript)) {
    Write-Error "Не найден $StartScript"
    exit 1
}

$Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$StartScript`""

$Trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME

$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -Description "Автозапуск Личная RPG (nginx + PHP)" `
    -Force

Write-Host "Задача '$TaskName' создана."
Write-Host "При входе в Windows сайт будет на http://127.0.0.1:8080"
Write-Host ""
Write-Host "Проверка сейчас:"
& $StartScript
Start-Sleep -Seconds 2
Write-Host "Откройте http://127.0.0.1:8080"
