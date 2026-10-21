$files = @("terms-condition", "privacy", "warranty", "refund", "eula")

foreach ($f in $files) {
    $c = Get-Content -Raw "scratch/chunk_$f.js"
    # Extract string literals inside children: "..." or children: [...]
    $matches = [regex]::Matches($c, 'children:\s*(?:"([^"\\]*(?:\\.[^"\\]*)*)"|\[([^\]]+)\])')
    $strings = [regex]::Matches($c, '"([^"\\]*(?:\\.[^"\\]*)*)"') | ForEach-Object {
        $val = $_.Groups[1].Value
        # Replace escaped quotes
        $val = $val.Replace('\"', '"').Replace('\n', "`n")
        $val
    } | Where-Object {
        $_.Length -gt 15 -and
        $_ -notmatch '^(/_next|style|class|rgba|linear-gradient|var\(|@|#|px|rem|flex|grid|hidden)' -and
        $_ -notmatch '^[a-zA-Z0-9_-]+$'
    }
    
    $clean = $strings | Select-Object -Unique
    $clean | Set-Content "scratch/clean_policy_$f.txt" -Encoding UTF8
    Write-Host "Policy $($f): extracted $($clean.Count) unique paragraphs."
}
