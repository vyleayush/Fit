$c = Get-Content -Raw "scratch/layout-53a6891de3ad5982.js"

$idx = $c.IndexOf("Terms & Conditions")
if ($idx -ge 0) {
    $start = [Math]::Max(0, $idx - 500)
    $len = [Math]::Min(2000, $c.Length - $start)
    Write-Host "=== Around Terms & Conditions ==="
    Write-Host $c.Substring($start, $len)
}

$idx2 = $c.IndexOf("policy or payments")
if ($idx2 -ge 0) {
    $start2 = [Math]::Max(0, $idx2 - 200)
    $len2 = [Math]::Min(1000, $c.Length - $start2)
    Write-Host "=== Around policy or payments ==="
    Write-Host $c.Substring($start2, $len2)
}
