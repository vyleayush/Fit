$c = Get-Content "script.js"
for ($i = 0; $i -lt $c.Count; $i++) {
    $line = $c[$i]
    if ($line -match '/\*' -or $line -match 'class ' -or $line -match 'const [a-zA-Z0-9_]+\s*=' -or $line -match 'function [a-zA-Z0-9_]+') {
        if ($line.Trim().Length -lt 120) {
            Write-Host "Line $($i+1): $($line.Trim())"
        }
    }
}
