$clientId = "069ffcf0-766c-48ee-82dd-8414d7fe7ea0"
$itemId = "ea1a31f8-6512-41eb-917a-31022362f1ba"
$userId = [guid]::NewGuid().ToString()

$tokenBody = @{
    "user-id" = $userId
    "client-id" = $clientId
} | ConvertTo-Json

$tokenRes = Invoke-RestMethod -Uri "https://whimsical.com/api/account.get-visitor-token" -Method Post -Body $tokenBody -ContentType "application/json"
$token = $tokenRes.'access-token'

$headers = @{
    "Whimsical-Access-Token" = $token
    "Authorization" = "Bearer $token"
}

$allItems = @()
$cursor = $null
$page = 1

do {
    Write-Host "Fetching page $page..."
    $scrollBody = @{
        "parent-id" = $itemId
        "limit" = 500
    }
    if ($cursor) {
        $scrollBody["cursor"] = $cursor
    }
    $bodyJson = $scrollBody | ConvertTo-Json
    $itemsRes = Invoke-RestMethod -Uri "https://whimsical.com/api/items.scroll" -Method Post -Body $bodyJson -ContentType "application/json" -Headers $headers
    
    $items = $itemsRes.items
    if ($items) {
        $allItems += $items
        Write-Host "Page $page returned $($items.Count) items. Total so far: $($allItems.Count)"
    }
    $cursor = $itemsRes.'next-cursor'
    if (-not $cursor) {
        $cursor = $itemsRes.nextCursor
    }
    $page++
} while ($cursor)

Write-Host "Finished! Total items: $($allItems.Count)"
$allItems | ConvertTo-Json -Depth 10 | Set-Content "scratch/all_whimsical_items.json"
