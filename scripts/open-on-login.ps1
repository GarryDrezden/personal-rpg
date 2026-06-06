$TaskName = "PersonalRpgOpenBrowser"
$Action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c start http://127.0.0.1:8080"
$Trigger = New-ScheduledTaskTrigger -AtLogOn
Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Description "Открыть Личная RPG при входе"
Write-Host "Задача $TaskName создана."
