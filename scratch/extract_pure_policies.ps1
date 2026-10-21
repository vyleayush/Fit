$policies = @("terms-condition", "privacy", "warranty", "refund", "eula")

foreach ($p in $policies) {
    $c = Get-Content -Raw "scratch/chunk_$p.js"
    # Find all strings in jsx calls
    $matches = [regex]::Matches($c, '"([^"\\]*(?:\\.[^"\\]*)*)"')
    $texts = @()
    foreach ($m in $matches) {
        $val = $m.Groups[1].Value.Replace('\"', '"').Replace('\n', ' ').Trim()
        if ($val.Length -gt 15 -and
            $val -notmatch '^(jsx-|_next|style|class|rgba|linear|width|height|color|display|font|margin|padding|border|radius|flex|grid|hidden|text-|bg-|\.|#)' -and
            $val -notmatch '^\d+px' -and
            $val -notmatch '^calc\(' -and
            $val -notmatch '^var\(' -and
            $val -notmatch '^[a-zA-Z0-9_\-\s]{1,15}$') {
            $texts += $val
        }
    }
    $texts = $texts | Select-Object -Unique
    $texts | Set-Content "scratch/pure_$p.txt" -Encoding UTF8
    Write-Host "Policy $p -> $($texts.Count) clean text sections"
}
