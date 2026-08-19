# Production API smoke (works even when local trust store rejects the TLS cert).
# Usage: powershell -File scripts/smoke-production-api.ps1
# Optional: -BaseUrl https://fit-rpg.ru

param(
  [string]$BaseUrl = "https://fit-rpg.ru"
)

$ErrorActionPreference = "Stop"
$login = "smoke_" + [guid]::NewGuid().ToString("N").Substring(0, 10)
$password = "QaTest2026!"
$cookieJar = Join-Path $env:TEMP ("pr-smoke-" + [guid]::NewGuid().ToString("N") + ".txt")
$bodyFile = Join-Path $env:TEMP ("pr-smoke-body-" + [guid]::NewGuid().ToString("N") + ".json")

function Invoke-ApiCurl {
  param([Parameter(Mandatory = $true)][string[]]$CurlArgs)
  $raw = & curl.exe -k -sS @CurlArgs
  if ($LASTEXITCODE -ne 0) {
    throw "curl failed ($LASTEXITCODE): $($CurlArgs -join ' ')"
  }
  # Join so -match works on the full response (curl may return string[])
  return (($raw | ForEach-Object { $_ }) -join "`n")
}

Write-Host "== health =="
$health = Invoke-ApiCurl -CurlArgs @("-i", "$BaseUrl/api/health.php")
if ($health -notmatch '"ok"\s*:\s*true') { throw "health not ok`n$health" }
Write-Host "OK"

Write-Host "== OPTIONS register =="
$opt = Invoke-ApiCurl -CurlArgs @(
  "-i", "-X", "OPTIONS", "$BaseUrl/api/auth/register",
  "-H", "Origin: $BaseUrl",
  "-H", "Access-Control-Request-Method: POST",
  "-H", "Access-Control-Request-Headers: content-type"
)
if ($opt -notmatch "204|200") { throw "OPTIONS failed`n$opt" }
Write-Host "OK"

Write-Host "== register $login =="
[System.IO.File]::WriteAllText($bodyFile, (@{ login = $login; password = $password } | ConvertTo-Json -Compress))
$reg = Invoke-ApiCurl -CurlArgs @(
  "-i", "-c", $cookieJar, "-b", $cookieJar,
  "-X", "POST", "$BaseUrl/api/auth/register",
  "-H", "Content-Type: application/json",
  "-H", "Origin: $BaseUrl",
  "--data-binary", "@$bodyFile"
)
if ($reg -notmatch "201 Created") { throw "register failed`n$reg" }
if ($reg -notmatch "Set-Cookie:\s*pr_session=") { throw "missing Set-Cookie`n$reg" }
Write-Host "OK"

Write-Host "== me =="
$me = Invoke-ApiCurl -CurlArgs @("-i", "-b", $cookieJar, "$BaseUrl/api/auth/me", "-H", "Origin: $BaseUrl")
if ($me -notmatch "200 OK") { throw "me failed`n$me" }
if ($me -notmatch [regex]::Escape($login)) { throw "me missing login`n$me" }
Write-Host "OK"

Write-Host "== data GET =="
$data = Invoke-ApiCurl -CurlArgs @("-i", "-b", $cookieJar, "$BaseUrl/api/data", "-H", "Origin: $BaseUrl")
if ($data -notmatch "200 OK") { throw "data GET failed`n$data" }
Write-Host "OK"

Write-Host "== data PUT fixture =="
[System.IO.File]::WriteAllText($bodyFile, (@{
  payload = @(@{
    id = "smoke-day"
    date = "2026-08-19"
    calories = 2000
    steps = 8000
    alcohol = "none"
    morningExercise = $false
    gym = $false
    journal = $false
    cooking = $false
    repair = $false
    plants = $false
    hobby = $false
    comment = "smoke"
  })
} | ConvertTo-Json -Compress -Depth 6))
$put = Invoke-ApiCurl -CurlArgs @(
  "-i", "-b", $cookieJar, "-c", $cookieJar,
  "-X", "PUT", "$BaseUrl/api/data/dailyEntries",
  "-H", "Content-Type: application/json",
  "-H", "Origin: $BaseUrl",
  "--data-binary", "@$bodyFile"
)
if ($put -notmatch "200 OK") { throw "data PUT failed`n$put" }
Write-Host "OK"

Write-Host "== data GET verify =="
$data2 = Invoke-ApiCurl -CurlArgs @("-i", "-b", $cookieJar, "$BaseUrl/api/data", "-H", "Origin: $BaseUrl")
if ($data2 -notmatch "200 OK") { throw "data GET verify failed`n$data2" }
if ($data2 -notmatch "smoke-day") { throw "PUT payload missing on GET`n$data2" }
Write-Host "OK"

Write-Host "== logout =="
$out = Invoke-ApiCurl -CurlArgs @(
  "-i", "-b", $cookieJar, "-c", $cookieJar,
  "-X", "POST", "$BaseUrl/api/auth/logout",
  "-H", "Origin: $BaseUrl"
)
if ($out -notmatch "200 OK") { throw "logout failed`n$out" }
Write-Host "OK"

Write-Host "== me after logout =="
$me2 = Invoke-ApiCurl -CurlArgs @("-i", "-b", $cookieJar, "$BaseUrl/api/auth/me", "-H", "Origin: $BaseUrl")
if ($me2 -notmatch "401") { throw "expected 401 after logout`n$me2" }
Write-Host "OK"

Remove-Item $cookieJar, $bodyFile -ErrorAction SilentlyContinue
Write-Host "`nProduction API smoke PASSED for $BaseUrl"
Write-Host "Temporary user $login was left on the server — delete it manually in phpMyAdmin if needed."
