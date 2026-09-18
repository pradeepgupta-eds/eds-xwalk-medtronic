I'll investigate the current header/nav implementation and how it differs from the live site.Let me examine the header block implementation and the nav content source.Let me examine the header CSS and the nav fragment content to build an accurate plan.Let me check the nav content source and the design tokens the header uses.Let me check the design tokens and how the nav content is currently sourced for this project.# Header / Navigation Live-Match Fix

Rebuild the EDS homepage header so it matches the current live Medtronic header (`https://www.medtronic.com/en-us/index.html`, shown in the attached image): a dark navy→blue gradient bar with a white Medtronic logo, a "Search within" + search input + blue search button, education and country/region utility icons, and a white nav row (Healthcare Professionals · Patients & Caregivers · Our Company · Our Impact … Contact Us). The current EDS header is a plain white bar with a hamburger and a minimal link list — this closes that gap.

## Scope (confirmed)
- **Visual match:** dark navy→blue gradient background, white logo, white nav links, correct spacing/typography, "Contact Us" right-aligned.
- **Search bar:** "Search within" dropdown + "Search Medtronic" input + blue search button (top row).
- **Utility icons:** education/graduation-cap icon + "United States of America" country/region selector with location pin.
- **Nav links / content:** match live items (incl. any mega-menu dropdowns) — Healthcare Professionals, Patients & Caregivers, Our Company, Our Impact, Contact Us.
- **Behavior:** widgets are **visual-only** (render correctly, non-functional or link out — no live search wiring).
- **Nav content:** update **both** the header block code **and** prepare the nav-fragment content locally so links/structure match; hand back the author-import step for the content part.

## Current state (from repo inspection)
- `blocks/header/header.js` — standard boilerplate: loads a `/nav` (falls back to `/content/nav`) fragment, splits into `nav-brand` / `nav-sections` / `nav-tools`, adds a hamburger. No search, no icons, no gradient.
- `blocks/header/header.css` — plain **white** fixed bar (`background-color:#fff`), navy text, boilerplate dropdown styling. No gradient, no search/tools layout matching live.
- Nav link content is a **shared fragment sourced from AEM author** (not in git; served at `/nav` → `/content/nav`). It currently renders brand + 4 links (missing "Contact Us", search, icons, region).
- Design tokens exist in `styles/brand.css` (`--brand-navy #170f5f`, `--brand-blue-tint`, `--nav-height 80px`, font stack). The proprietary AvenirNextWorld font falls back to a system stack locally (expected).

## Approach

### Phase 1 — Capture the live header spec
- [ ] Extract exact live header computed styles: gradient stops (navy→mid-blue), heights, logo size/color (white), nav link color/size/spacing, search box dimensions/colors, blue search button, icon sizes, country-selector layout
- [ ] Capture the live nav structure: ordered top-level items + any mega-menu dropdown contents
- [ ] Identify SVG assets needed (white Medtronic wordmark, graduation-cap icon, location pin, search/chevron) — reuse existing `icons/` where possible, add new SVGs otherwise

### Phase 2 — Header structure & content (code + local nav fragment)
- [ ] Define the header regions to match live: **brand** (white logo) · **search** (dropdown+input+button) · **tools** (edu icon, country selector) on the top row; **sections** (nav links) on the row below, with Contact Us right-aligned
- [ ] Prepare the local nav fragment content so the link set/order matches live (add Contact Us, and the search/tools/region as authored blocks or as header-injected widgets) — regenerate via the project's content path, not hand-edited page HTML
- [ ] Update `blocks/header/header.js` to build the search bar + utility icons + region selector (visual-only) and wire the new region classes; keep hamburger for mobile

### Phase 3 — Styling to match live
- [ ] `blocks/header/header.css`: navy→blue gradient bar, white logo/links, two-row desktop layout (search+tools top, nav links bottom), pill "Search within" dropdown + input + blue round search button, icon + country-selector styling, Contact Us right-aligned
- [ ] Responsive: collapse to mobile (hamburger + stacked/hidden widgets) at <900px, matching boilerplate breakpoints
- [ ] Add any new SVG icons to `icons/` (optimized) and reference them

### Phase 4 — Verify & QA (local preview)
- [ ] Preview `http://localhost:3000/content/en-us/index`; inspect header DOM + computed styles (snapshot/evaluate) against the live header
- [ ] Screenshot the header at desktop (1440) and mobile (375); iterate until it visually matches the attached live header
- [ ] `npm run lint` clean; confirm no layout regressions to page body/footer

## Checklist
- [ ] Phase 1 — Live header styles, nav structure, and required icons captured
- [ ] Phase 2 — Header regions built (brand/search/tools/sections) + local nav fragment content matches live
- [ ] Phase 3 — Gradient, white logo/links, search bar, utility icons, country selector, Contact-Us-right all styled
- [ ] Phase 4 — Verified in preview (desktop + mobile), lint clean

## Notes
- **Shared-fragment caveat:** the header/nav is used site-wide. Code changes (CSS/JS) deploy via git and affect every page; the nav **content** lives in AEM author and only changes on the live site after the prepared fragment is imported there. I'll prepare the content locally and hand back the exact author-import step (consistent with the earlier content-vs-code split) — I won't push or publish.
- Search and country selector are **visual-only** this round (no backend wiring).
- Proprietary AvenirNextWorld font won't load on localhost (system fallback) — not a bug; matches on the real domain.
- **Execution requires Execute mode** — approve this plan to proceed.
