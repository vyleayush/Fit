$tc = Get-Content -Raw "scratch/pure_terms-condition.txt"
$pr = Get-Content -Raw "scratch/pure_privacy.txt"
$wa = Get-Content -Raw "scratch/pure_warranty.txt"
$re = Get-Content -Raw "scratch/pure_refund.txt"
$eu = Get-Content -Raw "scratch/pure_eula.txt"

function Format-Policy($text, $title) {
    $lines = $text -split "`n"
    $parts = @()
    foreach ($l in $lines) {
        $t = $l.Trim()
        if (-not $t) { continue }
        if ($t -match '^(jsx-|_next|terms-hero|terms-title|terms-subtitle|terms-card|terms-content|containe|tp-)') { continue }
        if ($t -match '^[A-Z0-9\s,&/]{3,40}$' -and $t -notmatch '\.') {
            $parts += "<h4 class='text-sm sm:text-base font-bold text-accent-orange mt-4 mb-2 flex items-center gap-2'><span class='w-1.5 h-1.5 rounded-full bg-accent-orange'></span>$t</h4>"
        } elseif ($t -match '^\d+\.\s+' -or $t.Length -gt 100 -or $t -match '\.\s*$') {
            $parts += "<p class='text-xs sm:text-sm text-charcoal/80 dark:text-chalk/80 leading-relaxed mb-3'>$t</p>"
        } else {
            $parts += "<li class='text-xs sm:text-sm text-charcoal/75 dark:text-chalk/75 leading-relaxed ml-4 list-disc mb-1.5'>$t</li>"
        }
    }
    return ($parts -join "`n")
}

$policyObj = @{
    "terms-condition" = @{
        title = "Terms & Conditions"
        subtitle = "Please read these terms carefully before using Dorfie Fit"
        content = Format-Policy $tc "Terms & Conditions"
    }
    "privacy" = @{
        title = "Privacy Policy"
        subtitle = "Your privacy matters to us. Learn how we protect your information."
        content = Format-Policy $pr "Privacy Policy"
    }
    "warranty" = @{
        title = "Warranty Policy"
        subtitle = "Understanding our service guarantees and limitations"
        content = Format-Policy $wa "Warranty Policy"
    }
    "refund" = @{
        title = "Refund Policy"
        subtitle = "Fair and transparent refund process for all Dorfie Fit users"
        content = Format-Policy $re "Refund Policy"
    }
    "eula" = @{
        title = "End User License Agreement (EULA)"
        subtitle = "Please read this agreement carefully before using Dorfie Fit."
        content = Format-Policy $eu "End User License Agreement"
    }
}

$json = $policyObj | ConvertTo-Json -Depth 5
"const policyData = " + $json + ";" | Set-Content "scratch/policyData.js" -Encoding UTF8
Write-Host "Generated scratch/policyData.js ($((Get-Item 'scratch/policyData.js').Length) bytes)"
