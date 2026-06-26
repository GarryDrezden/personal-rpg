Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("Wscript.Shell")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
batPath = scriptDir & "\PersonalRPG-Autostart.bat"
shell.CurrentDirectory = scriptDir
shell.Run Chr(34) & batPath & Chr(34), 0, False
