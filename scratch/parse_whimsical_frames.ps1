$items = Get-Content -Raw "scratch/all_whimsical_items.json" | ConvertFrom-Json

$frames = $items | Where-Object { $_.data.'object-type' -eq 'frame' } | Sort-Object { $_.data.rect.y }, { $_.data.rect.x }

function Get-ItemText($item) {
    $d = $item.data
    if ($d.text) {
        if ($d.text -is [string]) { return $d.text }
        # Sometimes text is rich text object / array
        return ($d.text | ConvertTo-Json -Compress)
    }
    if ($d.title) { return $d.title }
    if ($d.label) { return $d.label }
    if ($d.description) { return $d.description }
    if ($d.content) {
        # parse content if array of paragraphs
        if ($d.content -is [System.Array]) {
            $parts = @()
            foreach ($p in $d.content) {
                if ($p.text) { $parts += $p.text }
                elseif ($p -is [string]) { $parts += $p }
                else { $parts += ($p | ConvertTo-Json -Compress) }
            }
            return ($parts -join "`n")
        }
        return ($d.content | ConvertTo-Json -Compress)
    }
    return $null
}

$report = @()
$report += "# Whimsical Board Content Extraction"
$report += "Extracted from Whimsical Board: VufMYs3XMN8XLXaDRSG1nZ`n"

$frameIndex = 1
foreach ($f in $frames) {
    $fx = $f.data.rect.x
    $fy = $f.data.rect.y
    $fw = $f.data.rect.width
    $fh = $f.data.rect.height
    
    # Find all items inside this frame
    $contained = $items | Where-Object {
        $_.data.'object-type' -ne 'frame' -and
        $_.data.rect -and
        $_.data.rect.x -ge ($fx - 50) -and
        $_.data.rect.x -le ($fx + $fw + 50) -and
        $_.data.rect.y -ge ($fy - 50) -and
        $_.data.rect.y -le ($fy + $fh + 50)
    } | Sort-Object { $_.data.rect.y }, { $_.data.rect.x }

    $report += "## Frame $frameIndex (X=$fx, Y=$fy, W=$fw, H=$fh)"
    if ($f.data.title) {
        $report += "**Title:** $($f.data.title)"
    }
    $report += "Contains $($contained.Count) elements.`n"

    foreach ($c in $contained) {
        $txt = Get-ItemText $c
        $ot = $c.data.'object-type'
        $cx = $c.data.rect.x
        $cy = $c.data.rect.y
        $cw = $c.data.rect.width
        $ch = $c.data.rect.height
        
        if ($txt) {
            $report += "- **[$ot]** (y=$cy, x=$cx): $txt"
        } else {
            # Check if attachment (image/logo)
            if ($c.data.attachment) {
                $report += "- **[Image/Asset]** (y=$cy, x=$cx): $($c.data.attachment.'file-name') ($($c.data.attachment.'mime-type'))"
            } elseif ($ot -eq 'w-shape') {
                # shape might have label
                if ($c.data.label) { $report += "- **[Shape Label]** (y=$cy, x=$cx): $($c.data.label)" }
            }
        }
    }
    $report += "`n---`n"
    $frameIndex++
}

# Also check any items NOT in any frame
$unframed = $items | Where-Object {
    $item = $_
    if ($item.data.'object-type' -eq 'frame') { return $false }
    if (-not $item.data.rect) { return $false }
    $ix = $item.data.rect.x
    $iy = $item.data.rect.y
    $inFrame = $false
    foreach ($f in $frames) {
        $fx = $f.data.rect.x
        $fy = $f.data.rect.y
        $fw = $f.data.rect.width
        $fh = $f.data.rect.height
        if ($ix -ge ($fx - 50) -and $ix -le ($fx + $fw + 50) -and $iy -ge ($fy - 50) -and $iy -le ($fy + $fh + 50)) {
            $inFrame = $true
            break
        }
    }
    return (-not $inFrame)
} | Sort-Object { $_.data.rect.y }, { $_.data.rect.x }

if ($unframed.Count -gt 0) {
    $report += "## Unframed Items ($($unframed.Count) elements)`n"
    foreach ($c in $unframed) {
        $txt = Get-ItemText $c
        $ot = $c.data.'object-type'
        $cx = $c.data.rect.x
        $cy = $c.data.rect.y
        if ($txt) {
            $report += "- **[$ot]** (y=$cy, x=$cx): $txt"
        } elseif ($c.data.attachment) {
            $report += "- **[Image/Asset]** (y=$cy, x=$cx): $($c.data.attachment.'file-name')"
        }
    }
}

$report | Set-Content "scratch/whimsical_full_text.md" -Encoding UTF8
Write-Host "Generated scratch/whimsical_full_text.md with $($report.Count) lines."
