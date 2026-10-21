$content = Get-Content -Raw "scratch/whimbed.js"
$idx = $content.IndexOf("/api/account.get-visitor-token")
if ($idx -ge 0) {
    $start = [Math]::Max(0, $idx - 200)
    $len = [Math]::Min(1000, $content.Length - $start)
    Write-Host "=== get-visitor-token ==="
    Write-Host $content.Substring($start, $len)
}

$idx2 = $content.IndexOf("/api/items.scroll")
if ($idx2 -ge 0) {
    $start2 = [Math]::Max(0, $idx2 - 200)
    $len2 = [Math]::Min(1000, $content.Length - $start2)
    Write-Host "=== items.scroll ==="
    Write-Host $content.Substring($start2, $len2)
}
