# Удаление автозапуска Personal RPG
$ErrorActionPreference = "SilentlyContinue"
$TaskName = "PersonalRpgAutostart"

Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false

$startupFolder = [Environment]::GetFolderPath("Startup")
$shortcutPath = Join-Path $startupFolder "Personal RPG.lnk"
if (Test-Path -LiteralPath $shortcutPath) {
    Remove-Item -LiteralPath $shortcutPath -Force
}

Write-Host "Avtozapusk udalen (zadacha '$TaskName' i yarlyk v Avtozagruzke)."
