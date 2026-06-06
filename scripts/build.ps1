Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent)
npm run build
Write-Host "Сборка завершена. dist/ готов для nginx."
