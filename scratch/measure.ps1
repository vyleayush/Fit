Add-Type -AssemblyName System.Drawing
$images = @('Coffee.png', 'Chilling_Looking_At_Sky.png', 'Gymming.png', 'Running_Marathon.png', 'Pharmacy.png', 'Accounts.png')
foreach ($imgName in $images) {
    if (Test-Path $imgName) {
        $bmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $imgName))
        $w = $bmp.Width
        $h = $bmp.Height
        $minX = $w; $maxX = 0; $minY = $h; $maxY = 0
        for ($y = 0; $y -lt $h; $y += 2) {
            for ($x = 0; $x -lt $w; $x += 2) {
                $pixel = $bmp.GetPixel($x, $y)
                if ($pixel.A -gt 10) {
                    if ($x -lt $minX) { $minX = $x }
                    if ($x -gt $maxX) { $maxX = $x }
                    if ($y -lt $minY) { $minY = $y }
                    if ($y -gt $maxY) { $maxY = $y }
                }
            }
        }
        $bmp.Dispose()
        Write-Host "$imgName : Width=$w, Height=$h | Content: X=[$minX, $maxX], Y=[$minY, $maxY] | LeftPad=$minX, RightPad=$($w - $maxX)"
    }
}
