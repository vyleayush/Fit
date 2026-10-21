$content = Get-Content -Raw "index.html"
$matches = [regex]::Matches($content, '(?i)(privacy|terms|policy|refund|cancellation)')
Write-Host "Found $($matches.Count) matches in index.html"

# Search for links to policy
$links = [regex]::Matches($content, '<a[^>]+href="[^"]*(policy|terms|privacy)[^"]*"[^>]*>.*?</a>')
foreach ($l in $links) {
    Write-Host "Policy link: $($l.Value)"
}
