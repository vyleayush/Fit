$c = Get-Content -Raw "script.js"

Write-Host "Script.js length: $($c.Length)"

# Find all const/var/let declarations at top or functions
$matches = [regex]::Matches($c, '(?m)^(?:const|let|var|function)\s+([a-zA-Z0-9_]+)')
Write-Host "Top-level symbols ($($matches.Count)):"
$matches | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique | ForEach-Object { Write-Host " - $_" }
