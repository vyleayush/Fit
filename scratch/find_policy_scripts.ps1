$html = Get-Content -Raw "scratch/policy_terms-condition.html"
$scripts = [regex]::Matches($html, 'src="([^"]+\.js)"') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
Write-Host "Scripts loaded by terms-condition:"
$scripts | ForEach-Object { Write-Host $_ }
