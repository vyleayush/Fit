$items = Get-Content -Raw "scratch/all_whimsical_items.json" | ConvertFrom-Json

$frames = $items | Where-Object { $_.data.'object-type' -eq 'frame' }
Write-Host "=== Frames ($($frames.Count)) ==="
foreach ($f in $frames) {
    Write-Host "Frame: ID=$($f.'item-id') Title='$($f.data.title)' X=$($f.data.rect.x) Y=$($f.data.rect.y) W=$($f.data.rect.width) H=$($f.data.rect.height)"
}
