$policies = @(
    @{ name = "terms-condition"; url = "https://dorfiefit.com/policies/terms-condition" },
    @{ name = "privacy"; url = "https://dorfiefit.com/policies/privacy" },
    @{ name = "warranty"; url = "https://dorfiefit.com/policies/warranty" },
    @{ name = "refund"; url = "https://dorfiefit.com/policies/refund" },
    @{ name = "eula"; url = "https://dorfiefit.com/policies/eula" }
)

foreach ($p in $policies) {
    $html = curl.exe -s $p.url
    $match = [regex]::Match($html, '/_next/static/chunks/app/policies/' + $p.name + '/page-[a-f0-9]+\.js')
    if ($match.Success) {
        $chunkUrl = "https://dorfiefit.com" + $match.Value
        $chunkFile = "scratch/chunk_$($p.name).js"
        curl.exe -s -o $chunkFile $chunkUrl
        Write-Host "Downloaded $($p.name) chunk from $chunkUrl ($((Get-Item $chunkFile).Length) bytes)"
    } else {
        Write-Host "Could not find chunk url in $($p.url)"
    }
}
