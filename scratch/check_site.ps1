$res = Invoke-WebRequest -Uri 'http://localhost:3000/' -UseBasicParsing
Write-Host "Status: $($res.StatusCode)"
Write-Host "Features stack stage found: $($res.Content.Contains('id=""features-stack-stage""'))"
Write-Host "Why Dorfie stack stage found: $($res.Content.Contains('id=""why-dorfie-stack-stage""'))"
Write-Host "Capy mascot img v=2 found: $($res.Content.Contains('Chilling_Looking_At_Sky.png?v=2'))"
Write-Host "Gate Clearance tile found: $($res.Content.Contains('Gate Clearance'))"
Write-Host "Athletes Onboarded found: $($res.Content.Contains('12,400+ Athletes Onboarded'))"
Write-Host "42 Connected Gym Hubs found: $($res.Content.Contains('42 Connected Gym Hubs'))"
