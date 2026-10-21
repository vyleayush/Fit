# Dorfie Fit — Pricing and Product-ID Review

> Authoritative reconciliation of subscription plans, tiers, limits, App Store product IDs, and checkout behaviors implemented across the Dorfie Fit website.

## Reference Authority
1. **Primary Authority:** `Dorfie Fit Subscriptions For IOS.pdf` (Discovered & analyzed in root directory).
2. **Booklet Authority:** `DorfieFitGyms.pdf` (Slide 4, 7, 8, 9).
3. **Legal Document Authority:** Official Dorfie Fit EULA Section 4 (`Subscription Plans, Fees, and Billing`).

---

## 1. Personal Trainer Plans Reconciliation

| Plan | Earlier Listing | Revised Apple Store PDF | Implemented Website Price | App Store Product ID | Key Entitlements & Limits |
|---|---|---|---|---|---|
| **Base** | Free | Free | **₹0 (Forever Free)** | *None (Free Tier)* | • In-app sign-up & gym association<br>• Public coach profile<br>• Manage up to 10 clients<br>• Client progress & diet/workout recommendations<br>• In-app client chat<br>• Job exploration<br>• Fitness events (₹100/event) |
| **Advance** | ₹650/mo<br>₹3,898/yr | ₹699/mo<br>₹3,999/yr | **₹699/month**<br>**₹3,999/year** *(Save ~52%)* | Monthly: `trainer_intermediate_monthly`<br>Yearly: `trainer_intermediate_yearly` | • Everything in Base<br>• Apply to **10 Jobs Daily**<br>• Discovered in *Find a Fitness Coach*<br>• **2 Complimentary events/month**<br>• Manage up to **1,000 clients**<br>• **Up to 3 client leads/day**<br>• Verified trust badges & achievements<br>• Product referral commissions |
| **Advance Pro** | ₹1,300/mo<br>₹6,498/yr | ₹1,299/mo<br>₹6,499/yr | **₹1,299/month**<br>**₹6,499/year** *(Save ~58%)* | Monthly: `trainer_advance_pro_monthly`<br>Yearly: `trainer_advance_pro_yearly` | • Everything in Advance<br>• Apply to **100 Jobs Daily**<br>• **Top rank** in *Find a Fitness Coach*<br>• **10 Complimentary events/month**<br>• Manage up to **1,000 clients**<br>• **Unlimited client leads**<br>• Top placement in gym applicant lists<br>• Community monetization |

---

## 2. Fitness Centre / Gym Management Plans Reconciliation

| Plan | Earlier Listing | Revised Apple Store PDF | Implemented Website Price | App Store Product ID | Key Entitlements & Limits |
|---|---|---|---|---|---|
| **Basic** | Free | Free | **₹0 (Forever Free)** | *None (Free Tier)* | • Public gym profile & discoverability<br>• Basic member intake<br>• Coach & staff talent discovery<br>• Community board access |
| **Intermediate** | ₹1,300/mo<br>₹13,000/yr | ₹1,299/mo<br>₹13,000/yr | **₹1,299/month**<br>**₹13,000/year** *(Save ~17%)* | Monthly: `fitness_centre_intermediate_monthly`<br>Yearly: `fitness_centre_intermediate_yearly` | • Full management suite for **1 Branch**<br>• **Free WhatsApp Messaging Integration**<br>• Real-time crowd radar & sub-second entry logs<br>• Unlimited member accounts<br>• Billing & automated renewal reminders<br>• Staff roles & permissions |
| **Advance** | ₹3,250/mo<br>₹26,000/yr | ₹3,299/mo<br>₹26,000/yr | **₹3,299/month**<br>**₹26,000/year** *(Save ~34%)* | Monthly: `fitness_centre_advance_monthly`<br>Yearly: `fitness_centre_advance_yearly` | • Everything in Intermediate<br>• **Biometric (Face + Fingerprint) + RFID Gate Integration**<br>• **Free WhatsApp Messaging Integration**<br>• **Under-the-table PT detection** & revenue protection<br>• Offline-ready local sync for 100% turnstile uptime<br>• Dedicated hardware setup support |
| **Advance Pro** | Custom | Custom | **Custom Quote** *(Contact Sales)* | Monthly: `fitness_centre_advance_pro_custom`<br>Yearly: `fitness_centre_advance_pro_custom` | • Everything in Advance<br>• **Unlimited Branches** & franchise networks<br>• **2 Job postings per month** in talent network<br>• Free WhatsApp Messaging for all branches<br>• Centralized multi-club analytics & audit<br>• Dedicated enterprise account manager |

---

## 3. Members & Athletes Policy
- **Membership Sign-Up:** Free of charge across iOS and Android apps.
- **Platform Fee:** In accordance with Section 4.3 of the Dorfie Fit EULA, members may be charged a platform fee on certain in-app transactions (such as event passes or trainer bookings), as disclosed at checkout.
- **Gym Revenue Integrity:** Dorfie Fit charges 0% commission cuts on regular gym centre membership dues; 100% of membership revenue flows directly to the gym's merchant gateway.

---

## 4. Verification and Entitlement Display
1. **Dynamic Interactive Modals:**
   - Users can click **"View Details"** on any card to open `#plan-details-modal`.
   - The modal renders the exact App Store Product ID (`code` tag), billing cycle, verbatim descriptions, and bulleted entitlements.
2. **Prominent Free WhatsApp Integration:**
   - Every paid and enterprise fitness centre plan explicitly displays and highlights:
     `<span class="card-tag bg-[#25D366]/20 text-[#25D366] border-[#25D366]/40">FREE WHATSAPP</span>`.
3. **Checkout Linkage:**
   - "Get Started" and "Buy Now" pass exact plan labels, cycle keys (`'monthly'` vs `'annual'`), and amount values into `appRouter.startPlanCheckout()`.
   - "Advance Pro" routes directly to `#book-demo` for sales consultation.
