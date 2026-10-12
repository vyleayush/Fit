Add-Type -AssemblyName System.Drawing

$files = @('Pharmacy.png', 'Running_Marathon.png', 'Coffee.png', 'Gymming.png', 'Chilling_Looking_At_Sky.png', 'Accounts.png')

foreach ($f in $files) {
    $fullPath = Resolve-Path $f
    $backupPath = "$f.orig.png"
    if (-not (Test-Path $backupPath)) {
        Copy-Item $fullPath $backupPath
    }
    
    $bmp = [System.Drawing.Bitmap]::FromFile($fullPath)
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

    $contentW = $maxX - $minX + 1
    $contentH = $maxY - $minY + 1
    
    # We create a new square canvas whose size fits content with ~6% padding on each side
    $maxDim = [Math]::Max($contentW, $contentH)
    $pad = [int]($maxDim * 0.06)
    $newSize = $maxDim + ($pad * 2)

    $newBmp = New-Object System.Drawing.Bitmap($newSize, $newSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($newBmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $destX = ($newSize - $contentW) / 2
    $destY = ($newSize - $contentH) / 2

    $srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $contentW, $contentH)
    $destRect = New-Object System.Drawing.Rectangle([int]$destX, [int]$destY, $contentW, $contentH)

    $g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Dispose()

    # Save cleanly to temporary and replace
    $tempOut = "$f.tmp.png"
    $newBmp.Save($tempOut, [System.Drawing.Imaging.ImageFormat]::Png)
    $newBmp.Dispose()

    Move-Item -Force $tempOut $fullPath
    Write-Host "Successfully centered $f (Content: ${contentW}x${contentH} -> Canvas: ${newSize}x${newSize})"
}
