# Dorfie Fit — Quality Assurance & Verification Report

> Meticulous record of automated tests, hash synchronization verifications, and regression checks executed on the Dorfie Fit website.

## Environment
- **Operating System:** Windows 10/11 (PowerShell 5.1 / Core)
- **Local Workspace Root:** `c:\Users\Administrator\Documents\GOSBFY SITE WORK\Dorfie Fits`
- **Architecture:** Static High-Performance Web Application (Vanilla JS, Modern CSS, Tailwind CSS CDN, Font Awesome 6)
- **Test Automation Harness:** `scratch/verify_site.ps1` (SHA-256 cryptographic verification & DOM string integrity suite)

---

## 1. Automated Verification Checks

| Category | Check / Target | Command / Script | Result | Verification Details |
|---|---|---|---|---|
| **Mirror Synchronization** | `css/style.css` == `style.css` | `(Get-FileHash css/style.css).Hash -eq (Get-FileHash style.css).Hash` | **PASS** | SHA-256 checksum: `FEEDC5B9C9A825C8...` (100% Identical) |
| **Mirror Synchronization** | `js/script.js` == `script.js` | `(Get-FileHash js/script.js).Hash -eq (Get-FileHash script.js).Hash` | **PASS** | SHA-256 checksum: `54361A0110D316F8...` (100% Identical) |
| **Mirror Synchronization** | `js/policy-data.js` == `policy-data.js` | `(Get-FileHash js/policy-data.js).Hash -eq (Get-FileHash policy-data.js).Hash` | **PASS** | SHA-256 checksum: `21E867DE4B56EB36...` (100% Identical) |
| **Client Requirement** | Free WhatsApp Messaging Integration | String assertion in `index.html` | **PASS** | Present in top offers ribbon, hero badge, pricing cards, comparison table, and footer |
| **Official Contact** | Verified Phone & WhatsApp Link | String assertion `+91 8585906628` & `wa.me/918585906628` | **PASS** | Floating button, demo card, and footer point to official Booklet Slide 10 number |
| **Placeholder Cleanliness** | Zero placeholder phone numbers | Regex search for `9999999999` and `99999 99999` | **PASS** | Lingering placeholder occurrences: 0 |
| **Booklet Integration** | Comparison Matrix (Dorfie Fit vs. Typical) | String assertion in `#why-dorfie` | **PASS** | 6 dimensions rendered: Purpose, Member Engagement, Churn, PT Revenue, Hiring, WhatsApp |
| **Booklet Integration** | Under-The-Table PT Detection | String assertion in `script.js` & `index.html` | **PASS** | Integrated into Role Carousel and Advance/Advance Pro plans |
| **Booklet Integration** | Live Tracking Churn Radar | String assertion in `script.js` & `index.html` | **PASS** | Highlighted as key retention differentiator |
| **Pricing Reconciliation** | 4th Gym Tier: Advance Pro (Custom) | String assertion `fitness_centre_advance_pro_custom` | **PASS** | Included with "Contact Sales" / Demo Walkthrough routing |
| **Pricing Reconciliation** | App Store Product IDs | String assertions for 4 IAP IDs | **PASS** | Verified in `pricingData` object and plan modal trigger |
| **Member Policy** | Free Member Sign-up Banner | String assertion in `#pricing` | **PASS** | Renders "Member Access • Forever Free" callout below cards |
| **Interactive Modals** | Plan Details Modal Elements | String assertion for `#plan-details-modal` & sub-IDs | **PASS** | Title, tier, price, product ID, description, features, action button |
| **Legal Compliance** | 5 Official Preserved Policies | `policyKeys` verification in `policy-data.js` | **PASS** | Terms & Conditions, Privacy Policy, Warranty Policy, Refund Policy, EULA |

---

## 2. Responsive Layout & Viewport Verification

| Viewport Range | Target Device Class | Elements Tested | Expected Behavior | Observed Result |
|---|---|---|---|---|
| **320–375 px** | Small Mobile (iPhone SE) | Navigation, Offers Ribbon, Comparison Table, Plan Modal | No horizontal overflow; comparison table scrolls horizontally via `.comparison-table-wrapper` | **PASS** |
| **390–430 px** | Standard Mobile (iPhone 14/15, Pixel) | Hero badge, Pricing card stack, WhatsApp floating button | Touch targets ≥ 44px; floating button positioned cleanly above bottom bar | **PASS** |
| **768 px** | Tablet (iPad, Surface) | 2-column pricing cards, Split-screen about manifesto | Clean 2x2 grid for centres; smooth card hover states | **PASS** |
| **1280 px** | Laptop / Desktop | Full 4-column pricing cards, Comparison table matrix | Side-by-side comparison dimensions; prominent Dorfie Fit column highlight | **PASS** |
| **1440 px+** | Large Desktop / Ultra-Wide | Liquid-glass containers, Perspective tilt stage | Max-width clamped at 1580px; centered fluid typography | **PASS** |

---

## 3. Functional Regression Matrix

- [x] **Existing Routes & Navigation:** `#about`, `#features`, `#pricing`, `#events`, `#communities`, `#book-demo` smooth-scroll seamlessly via `appRouter.navigateLandingSection()`.
- [x] **Billing Interval Toggle:** "Monthly" vs "Annual" toggle updates pricing cards, cycle labels, and App Store product IDs dynamically.
- [x] **Audience Switcher:** "Fitness Centres / Communities" vs "Personal Trainers" toggles 4-column vs 3-column card grid without layout shifts.
- [x] **Plan Details Modal:** Clicking "View Details" opens `#plan-details-modal` with exact App Store ID and entitlements; clicking close or backdrop dismisses modal.
- [x] **Policy Modal:** Clicking any legal link in the footer opens `#policy-modal-overlay` with the 5 live policies preserved verbatim from `dorfiefit.com`.
- [x] **Demo Inquiries Form:** Submitting form validates inputs and displays feedback toast indicating WhatsApp specialist follow-up.
- [x] **Dual-File Mirror Integrity:** All edits to CSS, JS, and policies mirrored 100% identically between root and subfolders.
- [x] **Zero Lingering Faked Data:** No artificial metrics, fake reviews, or placeholder phone numbers remain.

---

## 4. Remaining Risks & Edge Cases
1. **Third-Party Biometric Turnstiles:** Physical COM-port gate access controllers and facial recognition kiosks depend on on-premise hardware setup by Dorfie Fit technicians.
2. **Apple IAP Review:** In-app purchase product IDs are embedded in code for compliance; actual purchase completion occurs inside the native iOS binary via StoreKit.
