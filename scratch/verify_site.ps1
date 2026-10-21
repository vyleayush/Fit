# Automated Quality Assurance & Verification Script for Dorfie Fit Content Revision
$ErrorActionPreference = 'Stop'

Write-Host "====================================================="
Write-Host "DORFIE FIT AUTOMATED VERIFICATION & QUALITY AUDIT"
Write-Host "====================================================="

$root = "c:\Users\Administrator\Documents\GOSBFY SITE WORK\Dorfie Fits"

# 1. Test Dual-File Mirror Synchronization
Write-Host "`n[TEST 1] Dual-File Mirror Synchronization Hashes..." -ForegroundColor Cyan
$pairs = @(
    @("css/style.css", "style.css"),
    @("js/script.js", "script.js"),
    @("js/policy-data.js", "policy-data.js")
)

$syncPass = $true
foreach ($p in $pairs) {
    $f1 = Join-Path $root $p[0]
    $f2 = Join-Path $root $p[1]
    $h1 = (Get-FileHash -Path $f1 -Algorithm SHA256).Hash
    $h2 = (Get-FileHash -Path $f2 -Algorithm SHA256).Hash
    if ($h1 -eq $h2) {
        Write-Host "  [PASS] $($p[0]) matches $($p[1]) ($($h1.Substring(0,16))...)" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] Hash mismatch between $($p[0]) and $($p[1])" -ForegroundColor Red
        $syncPass = $false
    }
}

# 2. String Integrity & Content Verification in index.html
Write-Host "`n[TEST 2] Verifying Mandatory Content in index.html..." -ForegroundColor Cyan
$html = Get-Content (Join-Path $root "index.html") -Raw

$requiredStrings = @(
    "Free WhatsApp Messaging Integration",
    "wa.me/918585906628",
    "+91 8585906628",
    "BOOKLET COMPARISON MATRIX",
    "VS. THE REST",
    "Under-The-Table PT Detection",
    "Live Tracking Churn Radar",
    "MEMBER ACCESS • FOREVER FREE",
    "ARE YOU AN INDIVIDUAL GYM MEMBER OR ATHLETE?",
    "plan-details-modal",
    "plan-modal-card",
    "plan-modal-title",
    "plan-modal-product-id",
    "policy-modal-overlay"
)

$contentPass = $true
foreach ($str in $requiredStrings) {
    if ($html.Contains($str)) {
        Write-Host "  [PASS] Contains: '$str'" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] Missing: '$str'" -ForegroundColor Red
        $contentPass = $false
    }
}

# 3. Check for Old Placeholder Contacts
Write-Host "`n[TEST 3] Checking for Old Placeholder Contacts..." -ForegroundColor Cyan
$oldPlaceholders = @("9999999999", "99999 99999")
$placeholderPass = $true
foreach ($ph in $oldPlaceholders) {
    if ($html.Contains($ph)) {
        Write-Host "  [FAIL] Found lingering placeholder: '$ph'" -ForegroundColor Red
        $placeholderPass = $false
    } else {
        Write-Host "  [PASS] No lingering placeholder: '$ph'" -ForegroundColor Green
    }
}

# 4. Check Pricing Data in js/script.js
Write-Host "`n[TEST 4] Verifying Pricing Tiers & Apple Store IDs in js/script.js..." -ForegroundColor Cyan
$js = Get-Content (Join-Path $root "js/script.js") -Raw
$requiredJsItems = @(
    "fitness_centre_intermediate_monthly",
    "fitness_centre_advance_monthly",
    "fitness_centre_advance_pro_custom",
    "trainer_intermediate_monthly",
    "trainer_advance_pro_monthly",
    "openPlanDetailsModal",
    "closePlanDetailsModal",
    "Under-the-table PT detection"
)

$jsPass = $true
foreach ($jItem in $requiredJsItems) {
    if ($js.Contains($jItem)) {
        Write-Host "  [PASS] JS contains: '$jItem'" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] JS missing: '$jItem'" -ForegroundColor Red
        $jsPass = $false
    }
}

# 5. Check 5 Legal Policies in js/policy-data.js
Write-Host "`n[TEST 5] Verifying 5 Legal Policies in js/policy-data.js..." -ForegroundColor Cyan
$policyData = Get-Content (Join-Path $root "js/policy-data.js") -Raw
$policyKeys = @("terms-condition", "privacy", "warranty", "refund", "eula")
$policyPass = $true
foreach ($pk in $policyKeys) {
    if ($policyData.Contains("`"$pk`":")) {
        Write-Host "  [PASS] Policy present: '$pk'" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] Policy missing: '$pk'" -ForegroundColor Red
        $policyPass = $false
    }
}
if ($policyData.Contains("policyData['terms']")) {
    Write-Host "  [PASS] Alias mapped: 'terms' -> 'terms-condition'" -ForegroundColor Green
}


Write-Host "`n====================================================="
if ($syncPass -and $contentPass -and $placeholderPass -and $jsPass -and $policyPass) {
    Write-Host "ALL AUDIT CHECKS PASSED PERFECTLY (100% HEALTHY)" -ForegroundColor Green
} else {
    Write-Host "SOME AUDIT CHECKS FAILED! REVIEW ABOVE." -ForegroundColor Red
}
Write-Host "====================================================="
