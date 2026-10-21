$chunks = @(
    "https://dorfiefit.com/_next/static/chunks/app/page-5df2422016613f83.js",
    "https://dorfiefit.com/_next/static/chunks/app/layout-53a6891de3ad5982.js"
)
foreach ($c in $chunks) {
    $fn = [System.IO.Path]::GetFileName($c)
    curl.exe -s -o "scratch/$fn" $c
    $content = Get-Content -Raw "scratch/$fn"
    Write-Host "Downloaded $fn ($($content.Length) bytes)"
    
    # search for policy, terms, privacy, copyright, footer
    $matches = [regex]::Matches($content, '(?i)(privacy|terms|policy|refund|cancellation|copyright|rights reserved)[^"]{0,100}')
    Write-Host "Matches in $fn : $($matches.Count)"
    $matches | Select-Object -First 10 | ForEach-Object { Write-Host "   $($_.Value)" }
}
