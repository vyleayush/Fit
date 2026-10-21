$items = Get-Content -Raw "scratch/all_whimsical_items.json" | ConvertFrom-Json

$objTypes = $items | Group-Object { $_.data.'object-type' }
Write-Host "=== Object Types ==="
foreach ($ot in $objTypes) {
    Write-Host "$($ot.Name): $($ot.Count)"
}

# Find all items that have text or content
$textItems = @()
foreach ($item in $items) {
    $d = $item.data
    $ot = $d.'object-type'
    $text = $null
    
    if ($d.text) {
        $text = $d.text
    } elseif ($d.title) {
        $text = $d.title
    } elseif ($d.content) {
        $text = $d.content | ConvertTo-Json -Compress
    } elseif ($d.description) {
        $text = $d.description
    }

    if ($text) {
        $textItems += [PSCustomObject]@{
            id = $item.'item-id'
            type = $ot
            x = $d.rect.x
            y = $d.rect.y
            width = $d.rect.width
            height = $d.rect.height
            text = $text
            parent = $d.'parent-object-id'
        }
    }
}

Write-Host "Found $($textItems.Count) items with text/content."
# Sort by y then x
$sorted = $textItems | Sort-Object y, x
$sorted | ConvertTo-Json -Depth 5 | Set-Content "scratch/extracted_texts.json"

# Also write a readable text file
$outLines = @()
foreach ($t in $sorted) {
    $outLines += "[$($t.type)] (x=$($t.x), y=$($t.y)) -> $($t.text)"
}
$outLines | Set-Content "scratch/extracted_texts.txt"
Write-Host "Wrote scratch/extracted_texts.txt"
