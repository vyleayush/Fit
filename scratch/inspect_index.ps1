$lines = Get-Content "index.html"
Write-Host "Total lines: $($lines.Count)"
for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    if ($line -match '<!--\s*===+' -or $line -match '<section' -or $line -match '<main' -or $line -match '<header' -or $line -match '<footer' -or $line -match 'id="[a-zA-Z0-9_-]+"' -and $line -match '<(section|div|nav|header|footer|main)') {
        if ($line.Length -gt 150) { $line = $line.Substring(0, 150) + "..." }
        Write-Host "Line $($i+1): $($line.Trim())"
    }
}
