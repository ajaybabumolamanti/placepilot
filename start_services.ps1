$workspace = "C:\Users\M AJAY BABU\Desktop\placementpilot-ai"

# 1. Kill any existing processes on 8000 or 3000 or cloudflared
Get-Process -Name "cloudflared" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-NetTCPConnection -LocalPort 8000, 3000 -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.OwningProcess -gt 0) {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

Start-Sleep -Seconds 1

# 2. Start Backend
$pBackend = Start-Process -FilePath "$workspace\backend\.venv\Scripts\uvicorn.exe" `
    -ArgumentList "app.main:app", "--host", "127.0.0.1", "--port", "8000" `
    -WorkingDirectory "$workspace\backend" `
    -RedirectStandardOutput "$workspace\backend_stdout.log" `
    -RedirectStandardError "$workspace\backend_stderr.log" `
    -WindowStyle Hidden -PassThru

# 3. Start Frontend
$pFrontend = Start-Process -FilePath "npm.cmd" `
    -ArgumentList "run", "start" `
    -WorkingDirectory "$workspace\frontend" `
    -RedirectStandardOutput "$workspace\frontend_stdout.log" `
    -RedirectStandardError "$workspace\frontend_stderr.log" `
    -WindowStyle Hidden -PassThru

# 4. Wait for local services to be ready
$ready = $false
for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Seconds 1
    try {
        $res = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/departments" -TimeoutSec 2 -ErrorAction Stop
        if ($res.Count -gt 0) {
            $ready = $true
            break
        }
    } catch {}
}

Write-Output "SERVICES_READY: $ready"

# 5. Start Cloudflare Tunnel
$tunnelLog = "$workspace\tunnel.log"
if (Test-Path $tunnelLog) { Remove-Item $tunnelLog -Force }

$pTunnel = Start-Process -FilePath "$workspace\cloudflared.exe" `
    -ArgumentList "tunnel", "--url", "http://localhost:3000" `
    -RedirectStandardError $tunnelLog `
    -WindowStyle Hidden -PassThru

# 6. Extract live URL
$liveUrl = ""
for ($j = 0; $j -lt 20; $j++) {
    Start-Sleep -Seconds 1
    if (Test-Path $tunnelLog) {
        $logText = Get-Content $tunnelLog -Raw
        $regex = [regex]'https://[a-zA-Z0-9-]+\.trycloudflare\.com'
        $match = $regex.Match($logText)
        if ($match.Success) {
            $liveUrl = $match.Value
            break
        }
    }
}

Write-Output "LIVE_URL: $liveUrl"
