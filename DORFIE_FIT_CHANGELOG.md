# Dorfie Fit — Change Log

> Complete, verified audit log of content revisions and ecosystem updates performed on the Dorfie Fit website.

## Scope & Mandate
- Implement client-requested content changes based on:
  1. Whimsical design wireframe for content hierarchy and narrative copy (`https://whimsical.com/gosbfy/dorfie-fit-website-VufMYs3XMN8XLXaDRSG1nZ`).
  2. Live site policies preserved verbatim from `https://dorfiefit.com/` (Terms & Conditions, Privacy Policy, Warranty Policy, Refund Policy, EULA).
  3. Official iOS Subscription specification (`Dorfie Fit Subscriptions For IOS.pdf`) for plans, pricing tiers, limits, leads, and store product IDs.
  4. Official Dorfie Fit Gym Booklet (`DorfieFitGyms.pdf`) for mandatory brand positioning, manifesto, core capabilities (*Under-the-table PT detection*, *Live tracking churn radar*), and side-by-side comparison matrix.
  5. Prominent inclusion of client mandatory service: **Free WhatsApp Messaging Integration**.
  6. Official verified contact phone & WhatsApp link: **+91 8585906628** (`https://wa.me/918585906628`).
- Strict in-place preservation of existing frontend architecture, routes, modal logic, responsive layout, and interactive 3D motion engine.
- Strict maintenance of dual-file mirror synchronization (root files must remain 100% SHA-256 hash-identical to subfolder mirrors).

---

## Detailed Table of Changes Made

| File | Change | Reason / Authority | Verification |
|---|---|---|---|
| `index.html` | Updated floating WhatsApp action to `https://wa.me/918585906628` | Official contact number specified in Booklet Slide 10 | Verified automated string presence and link target |
| `index.html` | Updated dynamic top offers ribbon to highlight **"Free WhatsApp Messaging Integration Included on All Gym Centre Plans"** | Mandatory client requirement | Verified automated audit check |
| `index.html` | Embedded brand manifesto quote in Hero: *"A gym is a community with equipment, not equipment with members"* | Booklet Slide 2 & GEMINI_IMPLEMENTATION_PROMPT | Verified automated string match |
| `index.html` | Updated `#about` section with Whimsical's verbatim copy and Booklet Manifesto (*Stop Running Your Gym on Patchwork: Why Your Current Tools Are Failing You vs. Why Dorfie Fit*) | Whimsical Frame 08 & Booklet Slide 3 | Verified automated string match |
| `index.html` | Inserted Booklet Comparison Matrix (*Dorfie Fit vs. Typical Gym Software*) inside `#why-dorfie` covering 6 operational dimensions | Booklet Slide 8 | Verified automated audit check |
| `index.html` | Fixed unclosed `<span class="text-accen">` pill tag in `#software-apps` | Tag cleanliness and HTML validation | Verified valid markup |
| `index.html` | Added Member Free Access callout banner in `#pricing` (100% Free App Registration, Zero Recurring Fees) | Booklet Slide 4, Whimsical Frame 10, & EULA Section 4.3 | Verified automated audit check |
| `index.html` | Added `#plan-details-modal` markup for verbatim plan entitlements, limits, and store product IDs | iOS Subscription PDF & Booklet specs | Verified modal DOM elements and interaction |
| `index.html` | Replaced lingering placeholder `+91 99999 99999` and `wa.me/919999999999` in `#book-demo` with `+91 8585906628` | Booklet Slide 10 official phone/WhatsApp | Automated audit passed (zero placeholders found) |
| `index.html` | Added direct call & WhatsApp phone number `+91 8585906628` to footer "INQUIRIES & CAREERS" | Official contact details accessibility | Verified automated audit check |
| `css/style.css` & `style.css` | Added styles for `.comparison-table-wrapper`, `.comparison-table`, `.card-view-details-btn`, `.manifesto-problem-card`, and `.manifesto-solution-card` | Styling comparison matrix and plan details triggers | SHA-256 equality check passed (`FEEDC5B9C9A825C8...`) |
| `js/script.js` & `script.js` | Updated `roleData.owner` with the 6 authentic booklet pillars: Gym Management Zero Chaos, Free WhatsApp Messaging Integration, Under-The-Table PT Detection, Live Tracking Churn Radar, Hiring Talent Pipeline, and Community Moat | Booklet Slides 3–9 & Whimsical wireframe | SHA-256 equality check passed (`54361A0110D316F8...`) |
| `js/script.js` & `script.js` | Updated `pricingData` with the 4th tier for Fitness Centres (`Advance Pro` - Custom Pricing) and official store product IDs (`fitness_centre_intermediate_monthly/yearly`, `fitness_centre_advance_monthly/yearly`, `trainer_intermediate_monthly/yearly`, `trainer_advance_pro_monthly/yearly`) | iOS Subscription PDF | SHA-256 equality check passed (`54361A0110D316F8...`) |
| `js/script.js` & `script.js` | Added `openPlanDetailsModal(planIndex, audienceKey)` and `closePlanDetailsModal()` functions | Enabling detailed plan entitlement modals | Tested and verified in DOM |
| `policy-data.js` & `js/policy-data.js` | Preserved all 5 live policies from dorfiefit.com (Terms, Privacy, Warranty, Refund, EULA) with `window.dorfiePolicies` export and `terms` alias | Client policy preservation requirement | SHA-256 equality check passed (`21E867DE4B56EB36...`) |

---

## Architectural & Design Consistency
1. **Design System & Aesthetics:**
   - Preserved liquid-glass neumorphic dark theme with vibrant amber/orange accents (`#FF5E00`), emerald badges (`#25D366`), and high-contrast typography (Bebas Neue, Plus Jakarta Sans, JetBrains Mono).
   - Ensured all newly added sections (Comparison Table, Manifesto Cards, Member Access Strip, Plan Details Modal) inherit the exact same glassmorphic visual language.
2. **Dual-File Mirror Integrity:**
   - Both root files and subfolder files are verified identical via SHA-256 checksums on every update:
     - `css/style.css` == `style.css`
     - `js/script.js` == `script.js`
     - `js/policy-data.js` == `policy-data.js`
3. **No Placeholders or Faked Data:**
   - Contact numbers use the real, verified `+91 8585906628`.
   - Store Product IDs use the exact strings from Apple App Store submission documents.
   - Policies use the exact verbatim legal text from dorfiefit.com.
