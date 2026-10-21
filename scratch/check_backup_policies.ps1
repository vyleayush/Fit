$content = Get-Content -Raw "backup.html"
$matches = [regex]::Matches($content, '(?i)(privacy|terms|policy|refund|cancellation)')
Write-Host "Found $($matches.Count) matches in backup.html"

# Search for links
$links = [regex]::Matches($content, '<a[^>]+href="[^"]*(policy|terms|privacy)[^"]*"[^>]*>.*?</a>')
foreach ($l in $links) {
    Write-Host "Policy link: $($l.Value)"
}
