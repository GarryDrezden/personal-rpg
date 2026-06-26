# Регистрирует автозапуск Personal RPG при входе в Windows
param(
    [string]$InstallDir = ""
)

$ErrorActionPreference = "Stop"

if (-not $InstallDir) {
    $InstallDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
}

$InstallDir = (Resolve-Path -LiteralPath $InstallDir).Path.TrimEnd('\')
$StartScript = Join-Path $InstallDir "scripts\start-all.ps1"
$AutostartBat = Join-Path $InstallDir "PersonalRPG-Autostart.bat"
$AutostartVbs = Join-Path $InstallDir "PersonalRPG-Autostart.vbs"
$TaskName = "PersonalRpgAutostart"
$LogFile = Join-Path $InstallDir "server\runtime\autostart-install.log"

function Write-Log([string]$Message) {
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    Write-Host $line
    try {
        $dir = Split-Path -Parent $LogFile
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
        Add-Content -LiteralPath $LogFile -Value $line -Encoding UTF8
    } catch {
        # ignore log errors
    }
}

if (-not (Test-Path -LiteralPath $StartScript)) {
    Write-Log "ERROR: Ne naiden $StartScript"
    exit 1
}

if (-not (Test-Path -LiteralPath $AutostartBat)) {
    Write-Log "ERROR: Ne naiden $AutostartBat"
    exit 1
}

# VBS shablon tolko ASCII — puti berutsya iz ScriptFullName (kirillica ne lomaetsya)
$vbsContent = @'
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("Wscript.Shell")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
batPath = scriptDir & "\PersonalRPG-Autostart.bat"
shell.CurrentDirectory = scriptDir
shell.Run Chr(34) & batPath & Chr(34), 0, False
'@
Set-Content -LiteralPath $AutostartVbs -Value $vbsContent -Encoding ASCII

Write-Log "InstallDir: $InstallDir"

# 1) Планировщик задач (при входе, с задержкой 30 сек)
try {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue | Out-Null

    $Action = New-ScheduledTaskAction `
        -Execute "C:\Windows\System32\cmd.exe" `
        -Argument "/c `"`"$AutostartBat`"`"" `
        -WorkingDirectory $InstallDir

    $Trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
    $Trigger.Delay = "PT30S"

    $Settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -ExecutionTimeLimit ([TimeSpan]::Zero)

    $Principal = New-ScheduledTaskPrincipal `
        -UserId $env:USERNAME `
        -LogonType Interactive `
        -RunLevel Limited

    Register-ScheduledTask `
        -TaskName $TaskName `
        -Action $Action `
        -Trigger $Trigger `
        -Settings $Settings `
        -Principal $Principal `
        -Description "Avtozapusk Personal RPG (nginx + PHP)" `
        -Force | Out-Null

    Write-Log "Scheduled task '$TaskName' created"
} catch {
    Write-Log "WARN: Scheduled task failed: $($_.Exception.Message)"
}

# 2) Папка «Автозагрузка» — дублируем для надёжности
try {
    $startupFolder = [Environment]::GetFolderPath("Startup")
    $shortcutPath = Join-Path $startupFolder "Personal RPG.lnk"

    $wsh = New-Object -ComObject WScript.Shell
    $shortcut = $wsh.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = "wscript.exe"
    $shortcut.Arguments = "`"$AutostartVbs`""
    $shortcut.WorkingDirectory = $InstallDir
    $shortcut.WindowStyle = 7
    $shortcut.Description = "Personal RPG server autostart"
    $shortcut.Save() | Out-Null

    Write-Log "Startup shortcut created: $shortcutPath"
} catch {
    Write-Log "WARN: Startup shortcut failed: $($_.Exception.Message)"
}

Write-Log "Done. Site: http://127.0.0.1:8080"
Write-Host ""
Write-Host "Avtozapusk vklyuchen:"
Write-Host "  - zadacha v Planirovschike: $TaskName"
Write-Host "  - yarlyk v Avtozagruzke: Personal RPG.lnk"
Write-Host "  - pri vhode zapuskaetsya: PersonalRPG-Autostart.bat"
Write-Host "  - log: $LogFile"
