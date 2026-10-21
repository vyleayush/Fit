$urls = @(
    "https://dorfiefit.com/policies/terms-condition",
    "https://dorfiefit.com/policies/privacy",
    "https://dorfiefit.com/policies/warranty",
    "https://dorfiefit.com/policies/refund",
    "https://dorfiefit.com/policies/eula"
)

foreach ($u in $urls) {
    $slug = [System.IO.Path]::GetFileName($u)
    $file = "scratch/policy_$slug.html"
    curl.exe -s -o $file $u
    $c = Get-Content -Raw $file
    Write-Host "Downloaded $u -> $file ($($c.Length) bytes)"
    
    # Extract Next.js data chunks from HTML to find page text
    $scripts = [regex]::Matches($c, 'self\.__next_f\.push\(\[1,"(.*?)"\]\)')
    $allText = ""
    foreach ($s in $scripts) {
        $allText += $s.Groups[1].Value
    }
    
    # Unescape json
    $unescaped = [System.Text.RegularExpressions.Regex]::Unescape($allText)
    
    # Extract readable text pieces
    $textPieces = [regex]::Matches($unescaped, '(?<=>)[^<>{}\[\]]+(?=<)|"(?:title|description|children|text)":\s*"([^"]+)"')
    $cleanLines = @()
    foreach ($tp in $textPieces) {
        $t = $tp.Groups[1].Value
        if (-not $t) { $t = $tp.Value.Trim() }
        if ($t -and $t.Length -gt 2 -and $t -notmatch '^\s*$' -and $t -notmatch '^[\d\.,\s]+$') {
            $cleanLines += $t
        }
    }
    $cleanLines | Select-Object -Unique | Set-Content "scratch/policy_$slug.txt"
    Write-Host "   Extracted $($cleanLines.Count) lines to scratch/policy_$slug.txt"
}
