$content = Get-Content -Raw "scratch/whimbed.js"
$matches = [regex]::Matches($content, 'https?://[^\s"'']+|/api/[^\s"'']+')
$matches | ForEach-Object { $_.Value } | Select-Object -Unique | Where-Object { $_ -match 'api' }
