param(
    [int]$IntervalSeconds = 30
)

# ====================================
# Git Auto Push Script
# ====================================

$repoPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Git Auto Push - Started" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Path: $repoPath" -ForegroundColor Gray
Write-Host "  Interval: ${IntervalSeconds}s" -ForegroundColor Gray
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $repoPath

while ($true) {
    $status = git status --porcelain 2>&1

    if ($status) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $fileCount = ($status | Measure-Object).Count

        Write-Host "[$timestamp] Detected $fileCount file changes, pushing..." -ForegroundColor Yellow

        git add -A

        $commitMsg = "auto-update: $timestamp"
        git commit -m $commitMsg 2>&1 | Out-Null

        $pushResult = git push origin main 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$timestamp] PUSH OK ($fileCount files)" -ForegroundColor Green
        } else {
            Write-Host "[$timestamp] PUSH FAILED: $pushResult" -ForegroundColor Red
        }
    }

    Start-Sleep -Seconds $IntervalSeconds
}
