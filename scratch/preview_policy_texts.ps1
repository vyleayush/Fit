$files = @("terms-condition", "privacy", "warranty", "refund", "eula")

foreach ($f in $files) {
    $lines = Get-Content "scratch/clean_policy_$f.txt" -Encoding UTF8
    Write-Host "=== Policy: $f ($($lines.Count) lines) ==="
    $lines | Select-Object -First 5 | ForEach-Object { Write-Host "  $_" }
}
