$clientId = "069ffcf0-766c-48ee-82dd-8414d7fe7ea0"
$itemId = "ea1a31f8-6512-41eb-917a-31022362f1ba"
$userId = [guid]::NewGuid().ToString()

Write-Host "Requesting visitor token with clientId=$clientId, userId=$userId..."

$tokenBody = @{
    "user-id" = $userId
    "client-id" = $clientId
} | ConvertTo-Json

$tokenRes = Invoke-RestMethod -Uri "https://whimsical.com/api/account.get-visitor-token" -Method Post -Body $tokenBody -ContentType "application/json"
$token = $tokenRes.'access-token'

Write-Host "Got token: $($token.Substring(0, 10))..."

$headers = @{
    "Whimsical-Access-Token" = $token
    "Authorization" = "Bearer $token"
}

$scrollBody = @{
    "parent-id" = $itemId
    "limit" = 500
} | ConvertTo-Json

Write-Host "Fetching items..."
$itemsRes = Invoke-RestMethod -Uri "https://whimsical.com/api/items.scroll" -Method Post -Body $scrollBody -ContentType "application/json" -Headers $headers

$itemsRes | ConvertTo-Json -Depth 10 | Set-Content "scratch/whimsical_items.json"
Write-Host "Success! Saved items to scratch/whimsical_items.json. Count: $($itemsRes.items.Count)"
