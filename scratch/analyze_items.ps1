$items = Get-Content -Raw "scratch/all_whimsical_items.json" | ConvertFrom-Json

Write-Host "Total items: $($items.Count)"
$types = $items | Group-Object type
foreach ($t in $types) {
    Write-Host "$($t.Name): $($t.Count)"
}

# Sample some items
$items | Select-Object -First 5 | ConvertTo-Json -Depth 3 | Set-Content "scratch/sample_items.json"
