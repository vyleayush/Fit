Add-Type -AssemblyName System.Drawing
$userImg = [System.Drawing.Bitmap]::FromFile("C:\Users\Administrator\.gemini\antigravity-ide\brain\7da2fdf1-127e-4384-b424-2397d3b8a4fb\.user_uploaded\media_1791835023336.png")
Write-Host "User image dimensions: $($userImg.Width)x$($userImg.Height)"
$userImg.Dispose()
