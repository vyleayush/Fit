# Gemini Website Implementation Prompt — Dorfie Fit

Act as a senior frontend engineer, product designer, accessibility specialist, and QA engineer. Modify the EXISTING Dorfie Fit website in place. Do not rebuild it from scratch, replace the stack, or remove working features.

## First: inspect before editing
1. Inspect the entire repository and identify the framework, entry points, routes, reusable components, styling system, assets, package scripts, and current working tree.
2. Read the current website source and understand the existing design and behavior before changing anything.
3. Identify the relevant page(s) for gym management, trainers, memberships/subscriptions, member experience, and conversion.
4. If the project has uncommitted work, preserve it. Do not reset, overwrite, or delete user changes.
5. Create a concise implementation plan and then execute it. Do not stop after giving recommendations.

## Product positioning and source of truth
Dorfie Fit is a holistic, connected, community-driven fitness platform. Its gym product brings operations, members, trainers, and talent into one connected system. Keep the brand's core positioning:
- “A gym is a community with equipment, not equipment with members.”
- One command centre rather than disconnected tools.
- Live operational insight rather than only historical reporting.
- Trainer discovery and hiring built into the platform.
- Community and member engagement as retention tools.

Use these capabilities where they fit the existing site's information architecture:
- Memberships, renewals, and automated reminders
- Billing, payments, and invoicing
- Attendance, check-ins, and class scheduling
- Staff roles and permissions
- Trainer management
- Under-the-table PT detection
- Dynamic live member data and gym occupancy
- Churn alerts when attendance drops
- Member progress and trainer performance
- Peak-hour and revenue insights
- Verified trainer discovery, certifications, experience, hiring, onboarding, and scheduling
- Challenges, leaderboards, events, milestones, personalised workout/wellness plans, branded gym app, bookings, payments, and notifications

Do not invent features, integrations, testimonials, statistics, customer logos, awards, guarantees, or performance claims. If a capability is mentioned in the provided product materials but is not implemented in the product, present it as product positioning only and do not fabricate a functioning UI.

## Visual direction
Create a polished, premium, credible fitness-tech experience. Avoid generic “AI website” styling and unnecessary decoration.
- Use a restrained palette: approximately 60% warm ivory/off-white, 30% deep emerald or dark olive, and 10% warm amber/gold for important accents and calls to action.
- Maintain strong contrast and clear hierarchy. Use gold sparingly.
- Choose an elegant display serif for selected headlines and a highly readable modern sans-serif for body copy and controls. Prefer fonts already bundled or configured; if adding a font, use a reliable existing project approach and sensible fallbacks.
- Use generous whitespace, consistent spacing, deliberate typography, aligned grids, and carefully composed imagery.
- Use liquid-glass effects only where they materially help. Do not apply blur/glass to every card.
- Avoid excessive gradients, glowing orbs, giant rounded pills, excessive shadows, repetitive card grids, and decorative elements that compete with the content.
- Use authentic fitness/community imagery already in the repository where available. Do not replace real brand assets with unrelated stock imagery.
- Preserve the existing brand identity and logo. Do not create a new logo unless explicitly asked.

## UX and content
- Make the opening section communicate what Dorfie Fit is, who it serves, and why it is different within a few seconds.
- Improve the hierarchy and scannability of headlines, supporting text, feature sections, pricing, and calls to action.
- Use concise, specific copy. Avoid vague claims such as “revolutionary”, “next-level”, “unleash potential”, and other generic marketing filler.
- Make navigation labels understandable and consistent.
- Ensure primary and secondary calls to action have clear, distinct priorities.
- Make buttons, links, cards, menus, forms, and interactive controls behave as their labels promise.
- Ensure mobile layouts are intentional, not merely desktop layouts squeezed down.
- Preserve current routes and integrations unless a change is necessary and safe.

## Subscription information: treat as source data, not permission to invent
Use the following plans only where relevant to the current website. First inspect existing pricing and billing logic. Do not silently alter product IDs, purchase flows, store billing, currency, or plan entitlements.

### Trainers
**Base — Free**
- Sign up and associate with the gym where the trainer works
- Create fitness events (INR 100 per individually created event)
- Explore fitness-industry jobs
- Manage up to 10 clients
- Track client progress and chat with clients
- Public profile
- Recommend diets and exercises to clients

**Advance — monthly/yearly**
The source PDF contains an earlier listing of ₹650/month and ₹3,898/year, and a revised Apple-related listing of ₹699/month and ₹3,999/year. Treat the revised values as the latest displayed proposal, but inspect current code and purchase configuration before changing anything.
- Everything in Base
- Apply to 10 jobs daily
- Discovery on the “Find a Fitness Coach” page
- 2 complimentary events per month
- Manage up to 1,000 clients
- Up to 3 new-client leads daily
- Eligible for badges and achievements
- Refer clients to products/services and earn commissions

**Advance Pro — monthly/yearly**
The source PDF contains earlier values of ₹1,300/month and ₹6,498/year, and revised Apple-related values of ₹1,299/month and ₹6,499/year. Treat revised values as the latest displayed proposal, but verify the app/store product configuration and current website before changing billing.
- Everything in Advance
- Apply to 100 jobs daily
- Boosted placement in coach discovery
- 10 complimentary events per month
- Manage up to 1,000 clients
- Unlimited client leads
- Prominent placement in job applicant lists
- Connections with fitness communities

Product IDs supplied in the source:
- `trainer_intermediate_monthly`
- `trainer_intermediate_yearly`
- `trainer_advance_pro_monthly`
- `trainer_advance_pro_yearly`

### Fitness centres
**Basic — Free**
- Let potential customers discover the centre
- Hire fitness-industry professionals
- Showcase centre offerings

**Intermediate — monthly/yearly**
- The PDF lists ₹1,300/month and ₹13,000/year in one section; a revised Apple-related listing gives ₹1,299/month and ₹13,000/year.
- Everything in Basic
- Complete management software for one branch
- Multiple-branch access and no membership cap are described in the source; inspect the actual entitlement wording and do not overpromise if the implementation differs.

Product IDs:
- `fitness_centre_intermediate_monthly`
- `fitness_centre_intermediate_yearly`

**Advance — monthly/yearly**
- The PDF lists ₹3,250/month and ₹26,000/year in one section; the revised Apple-related listing gives ₹3,299/month and ₹26,000/year.
- Everything in Intermediate
- Biometric integration (face + fingerprint)
- RFID integration

Product IDs:
- `fitness_centre_advance_monthly`
- `fitness_centre_advance_yearly`

**Advance Pro**
- Custom pricing
- Everything in Advance
- Unlimited branches
- Two job postings per month

### Members
- Free sign-up
- A platform fee applies to each payment. Do not invent the fee amount; display it only if the exact fee is available in existing code/configuration.

### Important pricing safety rules
1. Before editing pricing, search the repository for every relevant product ID, plan name, price, billing interval, Apple/IAP/StoreKit/subscription configuration, and payment handler.
2. Preserve product IDs exactly.
3. Do not alter billing logic or entitlements just to make the page look consistent.
4. Where code and the PDF conflict, do not make a silent business decision. Keep the existing working integration, document the discrepancy, and surface it in the final report.
5. If pricing changes are needed, update only the customer-facing display after confirming the intended source value; never fake a successful payment or subscription.
6. Clearly distinguish monthly and yearly prices, and label custom pricing accurately.
7. Do not imply that a monthly plan is billed annually or vice versa.

## Engineering constraints
- Preserve the existing stack and dependency versions unless there is a clear, justified need.
- Avoid unnecessary dependencies.
- Do not rewrite the whole app for cosmetic improvements.
- Do not remove analytics, SEO metadata, accessibility features, authentication, forms, APIs, or existing payment integrations.
- Keep changes scoped, readable, maintainable, and consistent with the existing code style.
- Use semantic HTML and accessible labels.
- Ensure keyboard navigation, visible focus states, sensible touch targets, and reduced-motion support.
- Respect `prefers-reduced-motion`.
- Avoid layout shifts, horizontal overflow, scroll hijacking, cursor lag, animation flicker, and expensive always-running effects.
- If the site uses Lenis, GSAP, ScrollTrigger, or similar motion libraries, ensure correct lifecycle cleanup and synchronization; do not add a second smooth-scrolling system.
- Prefer transform/opacity animations; avoid animating layout properties unnecessarily.
- Do not block page interaction with a preloader indefinitely.
- Add robust loading, empty, error, and success states to forms or interactive features only when those features already exist.
- Do not expose API keys, secrets, private endpoints, or personal data.

## Responsive and browser QA
Check at minimum:
- Small mobile: 320–375 px
- Standard mobile: 390–430 px
- Tablet: 768 px
- Desktop: 1280 px
- Wide desktop: 1440 px and above

Check:
- Navigation and menus
- Hero layout and text wrapping
- Feature sections and image crops
- Pricing/subscription comparison
- CTA and footer
- Keyboard focus and reduced motion
- Console errors and missing assets
- Horizontal overflow and unexpected layout shifts
- Existing forms, routes, authentication, and purchase-related flows (without making real purchases)

## Execution workflow
1. Inspect and map the project.
2. Identify bugs, visual inconsistencies, content issues, and responsive failures.
3. Implement the highest-impact improvements in the existing code.
4. Run available lint, type-check, test, and build commands.
5. Fix regressions introduced by your changes.
6. Review the final diff and ensure unrelated files were not modified.
7. Do not claim a test passed unless you actually ran it. If a test cannot run, state why.
8. Do not stop at a plan; make the edits directly in the working repository if repository access is available.

## Required deliverables
Create/update these Markdown files in the project root:
- `GEMINI_IMPLEMENTATION_PROMPT.md` — this complete prompt and product constraints.
- `DORFIE_FIT_CHANGELOG.md` — files changed, major UI/UX decisions, behavior changes, and known discrepancies.
- `DORFIE_FIT_QA_REPORT.md` — actual commands/tests run, results, manual checks performed, and remaining risks.
- `DORFIE_FIT_PRICING_REVIEW.md` — pricing/product-ID comparison, unresolved conflicts, and any decisions that require owner approval.

In the final response, summarize what was changed, list the modified files, report actual test results, and explicitly flag any unresolved pricing discrepancies. If repository access is not available, say so and provide the Markdown deliverables for the user to add manually. Do not claim repository changes were made without access.
