$html = Get-Content -Raw "C:\Users\Administrator\.gemini\antigravity-ide\brain\b593959c-5ae2-418f-b58d-afa6d3769a3b\.system_generated\steps\33\content.md"

# Extract all hrefs
$hrefs = [regex]::Matches($html, 'href="([^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
Write-Host "=== Hrefs in dorfiefit.com ==="
$hrefs | ForEach-Object { Write-Host $_ }

# Extract all text in Next.js data scripts
$scripts = [regex]::Matches($html, 'self\.__next_f\.push\(\[1,"(.*?)"\]\)')
Write-Host "Found $($scripts.Count) next data chunks"
$allText = ""
foreach ($s in $scripts) {
    $allText += $s.Groups[1].Value
}
[regex]::Matches($allText, 'https?://[^\s\\"]+|/[a-zA-Z0-9_\-\/]+') | ForEach-Object { $_.Value } | Select-Object -Unique | Where-Object { $_ -match 'privacy|terms|policy|legal|refund' }
