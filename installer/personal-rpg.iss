; Inno Setup — Personal RPG
; Сборка: сначала .\scripts\build-release.ps1, затем Compile в Inno Setup

#define MyAppName "Personal RPG"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Personal RPG"
#define MyAppURL "https://github.com/GarryDrezden/personal-rpg"
#define MyStagingDir "..\release\staging"

[Setup]
AppId={{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
DefaultDirName={autopf}\PersonalRPG
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
OutputDir=..\release
OutputBaseFilename=PersonalRPG-Setup
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
ArchitecturesInstallIn64BitMode=x64compatible

[Languages]
Name: "russian"; MessagesFile: "compiler:Languages\Russian.isl"

[Tasks]
Name: "desktopicon"; Description: "Создать ярлык на рабочем столе"; GroupDescription: "Дополнительно:"; Flags: unchecked
Name: "autostart"; Description: "Запускать сервер при входе в Windows"; GroupDescription: "Дополнительно:"; Flags: unchecked
Name: "openbrowser"; Description: "Открыть сайт после установки"; GroupDescription: "Дополнительно:"

[Files]
Source: "{#MyStagingDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\PersonalRPG.bat"; WorkingDir: "{app}"
Name: "{group}\Остановить {#MyAppName}"; Filename: "{app}\PersonalRPG-Stop.bat"; WorkingDir: "{app}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\PersonalRPG.bat"; Tasks: desktopicon; WorkingDir: "{app}"

[Run]
Filename: "powershell.exe"; Parameters: "-NoProfile -ExecutionPolicy Bypass -File ""{app}\scripts\install-autostart.ps1"" -InstallDir ""{app}"""; StatusMsg: "Настройка автозапуска..."; Tasks: autostart; Flags: runhidden
Filename: "powershell.exe"; Parameters: "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File ""{app}\scripts\start-all.ps1"""; StatusMsg: "Запуск сервера..."; Flags: nowait runhidden
Filename: "http://127.0.0.1:8080/"; Description: "Открыть Personal RPG"; Tasks: openbrowser; Flags: postinstall shellexec skipifsilent

[UninstallRun]
Filename: "powershell.exe"; Parameters: "-NoProfile -ExecutionPolicy Bypass -File ""{app}\scripts\stop-all.ps1"""; Flags: runhidden; RunOnceId: "StopServer"
Filename: "powershell.exe"; Parameters: "-NoProfile -ExecutionPolicy Bypass -File ""{app}\scripts\uninstall-autostart.ps1"""; Flags: runhidden; RunOnceId: "RemoveAutostart"

[Code]
function InitializeSetup(): Boolean;
begin
  if not DirExists(ExpandConstant('{#MyStagingDir}')) then
  begin
    MsgBox('Не найдена папка release\staging.' + #13#10 +
      'Сначала выполните: .\scripts\build-release.ps1', mbError, MB_OK);
    Result := False;
  end
  else
    Result := True;
end;
