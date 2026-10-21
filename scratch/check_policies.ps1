$pages = @(
  'https://dorfiefit.com/privacy-policy',
  'https://dorfiefit.com/terms-and-conditions',
  'https://dorfiefit.com/privacy',
  'https://dorfiefit.com/terms',
  'https://dorfiefit.com/refund-policy',
  'https://dorfiefit.com/contact-us',
  'https://dorfiefit.com/about-us'
)
foreach ($p in $pages) {
    $code = curl.exe -s -o scratch/tmp_page.html -w "%{http_code}" $p
    Write-Host "$p -> $code"
    if ($code -eq "200") {
        $title = (Get-Content "scratch/tmp_page.html" -Raw) -match '<title>(.*?)</title>'
        Write-Host "   Title: $($Matches[1])"
    }
}
