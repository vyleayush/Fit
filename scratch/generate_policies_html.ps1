$policies = @("terms-condition", "privacy", "warranty", "refund", "eula")

$policyHtml = @{}

foreach ($p in $policies) {
    $lines = Get-Content "scratch/pure_$p.txt" -Encoding UTF8
    $html = @()
    foreach ($line in $lines) {
        $l = $line.Trim()
        if ($l.Length -eq 0) { continue }
        if ($l -match '^(Terms & Conditions|Privacy Policy|Warranty Policy|Refund Policy|End User License Agreement)') {
            $html += "<h3 class='text-xl sm:text-2xl font-bebas tracking-wide text-accent-orange mb-3'>$l</h3>"
        } elseif ($l -match '^(Acceptance of Terms|Account Registration|Payments & Subscriptions|Intellectual Property|Limitation of Liability|Changes to Terms|Information We Collect|How We Use Your Information|Targeted Advertising|No Guarantee on Fitness Results|Service Availability|Third-Party Services|Liability Limitations|Subscription Refunds|Events and Workshops|How to Request a Refund|License Grant|Restrictions|Termination|Disclaimer of Warranties|Governing Law)') {
            $html += "<h4 class='text-sm sm:text-base font-bold text-charcoal dark:text-chalk mt-4 mb-1.5 flex items-center gap-2'><span class='w-1.5 h-1.5 rounded-full bg-accent-orange'></span>$l</h4>"
        } elseif ($l -match '^(Please read|Dorfie Labs|We collect|By using|Refunds are|Contact us|We may|All content|Individual results|Trainers,|You agree|You have|This license|Unless explicitly)') {
            $html += "<p class='text-xs sm:text-sm text-charcoal/80 dark:text-chalk/80 leading-relaxed mb-2.5'>$l</p>"
        } else {
            $html += "<li class='text-xs sm:text-sm text-charcoal/75 dark:text-chalk/75 leading-relaxed ml-4 list-disc mb-1'>$l</li>"
        }
    }
    $policyHtml[$p] = $html -join "`n"
}

$policyHtml | ConvertTo-Json | Set-Content "scratch/policies_html.json" -Encoding UTF8
Write-Host "Policies HTML generated in scratch/policies_html.json"
