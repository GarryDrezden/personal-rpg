# Удаление задачи автозапуска Personal RPG
$ErrorActionPreference = "SilentlyContinue"
$TaskName = "PersonalRpgAutostart"

Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
Write-Host "Task '$TaskName' removed (if existed)."
