Add-Type -AssemblyName System.Drawing

function Analyze-File($name) {
    $bmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $name))
    $w = $bmp.Width
    $h = $bmp.Height
    Write-Host "File $name : ${w}x${h}"

    foreach ($thresh in @(10, 35, 70)) {
        $minX = $w; $maxX = 0; $minY = $h; $maxY = 0
        for ($y = 0; $y -lt $h; $y += 2) {
            for ($x = 0; $x -lt $w; $x += 2) {
                if ($bmp.GetPixel($x, $y).A -ge $thresh) {
                    if ($x -lt $minX) { $minX = $x }
                    if ($x -gt $maxX) { $maxX = $x }
                    if ($y -lt $minY) { $minY = $y }
                    if ($y -gt $maxY) { $maxY = $y }
                }
            }
        }
        $cw = $maxX - $minX + 1
        $ch = $maxY - $minY + 1
        Write-Host " Thresh $thresh : X=[$minX, $maxX] Y=[$minY, $maxY] size=${cw}x${ch}"
    }
    $bmp.Dispose()
}

Analyze-File "Gymming.png.orig.png"
Analyze-File "Chilling_Looking_At_Sky.png.orig.png"
Analyze-File "Pharmacy.png.orig.png"
