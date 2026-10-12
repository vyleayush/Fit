Add-Type -AssemblyName System.Drawing
Get-ChildItem -Filter *.png | ForEach-Object {
    $bmp = [System.Drawing.Bitmap]::FromFile($_.FullName)
    $w = $bmp.Width
    $h = $bmp.Height
    $minX = $w; $maxX = 0; $minY = $h; $maxY = 0
    for ($y = 0; $y -lt $h; $y += 2) {
        for ($x = 0; $x -lt $w; $x += 2) {
            $pixel = $bmp.GetPixel($x, $y)
            if ($pixel.A -gt 15) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    $bmp.Dispose()
    $contentWidth = $maxX - $minX
    $contentHeight = $maxY - $minY
    $contentCenterX = ($minX + $maxX) / 2
    $contentCenterY = ($minY + $maxY) / 2
    $offsetX = $contentCenterX - ($w / 2)
    $offsetY = $contentCenterY - ($h / 2)
    Write-Host "$($_.Name) [${w}x${h}]: Bounds X=[$minX..$maxX] Y=[$minY..$maxY] ContentSize=${contentWidth}x${contentHeight} CenterOffset=(${offsetX}, ${offsetY})"
}
