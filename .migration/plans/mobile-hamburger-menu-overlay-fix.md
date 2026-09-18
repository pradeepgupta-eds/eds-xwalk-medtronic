# Mobile Hamburger Menu — Overlay Fix

Fix the expanded mobile hamburger menu in `blocks/header/header.css`. Currently when the hamburger is tapped, the nav links render **transparently over the page content** (the hero heading and "ROBOTIC-ASSISTED SURGERY" bleed through behind "Healthcare Professionals", "Patients & Caregivers", etc.), making the menu unreadable. The menu should instead be an **opaque full-screen white overlay** like the live Medtronic mobile menu.

## Issue
- On mobile, `header nav[aria-expanded='true']` sets `min-height: 100dvh` and reveals `.nav-sections`, but the expanded nav has **no background** and is **not positioned as an overlay** — so it sits in normal flow with a transparent backdrop and the page content shows through behind the links.

## Confirmed decisions
- **Menu style:** Full-screen **opaque white overlay** covering the viewport above the page content (page must not show through). Navy links stacked vertically.
- **Menu items:** **Links only** — the 5 nav links (Healthcare Professionals, Patients & Caregivers, Our Company, Our Impact, Contact Us). Keep the Education/region tools hidden on mobile entirely (revert the current "tools appear when expanded" behavior).

## Current state (from `blocks/header/header.css`)
- `header nav[aria-expanded='true']` (mobile) expands the grid to include `sections` + `tools` rows and sets `min-height:100dvh`, but the nav itself has no `background` and no overlay positioning → transparent bleed-through.
- `.nav-wrapper` is `position: static` (non-sticky) and white — fine to keep; the overlay treatment will live on the expanded `nav`/`.nav-sections`.
- Currently `header nav[aria-expanded='true'] .nav-tools { display:block }` shows tools in the open menu — this must be removed per "links only".
- `.nav-sections` links currently inherit navy on mobile (correct once the backdrop is opaque white).

## Approach (CSS-only, mobile `< 900px` only; do not affect desktop ≥900px)
- [ ] Give the expanded mobile menu an **opaque white background** so nothing shows through — apply a solid `background:#fff` to the expanded `nav` (and/or a full-bleed `.nav-sections` panel) covering the viewport
- [ ] Make it a proper **full-screen overlay**: cover the area below the top bar (hamburger+logo+search) up to the viewport height, above page content (use fixed/absolute positioning with a high z-index scoped to mobile), so the hero/page is fully hidden behind it
- [ ] **Stack the 5 links vertically** with readable spacing, navy text, matching the live mobile menu; ensure they sit on the white overlay (no bleed-through)
- [ ] **Remove tools from the expanded menu** (drop the `aria-expanded='true'] .nav-tools { display:block }` rule) so only the 5 links show; tools stay hidden on mobile
- [ ] Keep the top bar (hamburger + logo + search) intact and the close (X) affordance working; body scroll already locked via existing JS (`overflow-y:hidden`) — verify it still applies
- [ ] Ensure all changes are gated to mobile and **do not alter the desktop header** (≥900px two-row gradient layout)

## Validation (local preview)
- [ ] At mobile 400×~700: open the hamburger — menu is a solid white panel, page content NOT visible behind the links, 5 links stacked and readable, no tools shown
- [ ] Close (X) returns to the collapsed bar (hamburger + logo + search) unchanged
- [ ] Desktop ≥900px header unchanged (gradient, search, tools, nav row all intact)
- [ ] No horizontal overflow; `npm run lint` clean; changes scoped to `blocks/header/header.css`

## Checklist
- [ ] Expanded mobile menu has an opaque white full-screen overlay (no bleed-through)
- [ ] 5 nav links stacked vertically, navy, readable; tools hidden on mobile (links only)
- [ ] Collapsed bar + close (X) behavior intact; body scroll locked while open
- [ ] Desktop header unaffected; no overflow; lint clean

## Notes
- CSS-only fix in `blocks/header/header.css`; no JS or nav-content changes needed (the existing `toggleMenu` already toggles `aria-expanded` and locks body scroll).
- Header **code** deploys via git; the deployed `aem.page` won't reflect this until pushed (same content-vs-code split as prior rounds). Fix + verify locally this round.
- Proprietary AvenirNextWorld font falls back to a system stack on localhost (expected).
- **Execution requires Execute mode** — approve to proceed.
