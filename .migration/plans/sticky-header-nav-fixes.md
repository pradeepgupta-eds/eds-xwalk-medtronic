Let me examine the desktop media query (sticky positioning) and the mobile layout rules.I have enough to see the issues but need to confirm the background intent, which is genuinely ambiguous from the two screenshots.# Header / Nav Fixes — Sticky, Background & Mobile Layout

Fix three issues in the EDS homepage header so it matches the live Medtronic site (`https://www.medtronic.com/en-us/index.html`) at both breakpoints, per the attached screenshots.

## Issues & confirmed decisions
1. **Scroll behavior:** Header should **not** stick — it scrolls away normally with the page (confirmed "Not sticky"). *Note: this reverses the framing of issue #1; see Notes.*
2. **Background color:** **Mobile = white** background with navy logo/hamburger/search; **Desktop = the dark navy→blue gradient** with white logo/links (matches the two screenshots).
3. **Mobile header contents:** Show **only hamburger + Medtronic logo + search bar**. Hide the education (graduation-cap) icon and the "United States of America" country/region selector on mobile.

## Current state (from `blocks/header/header.css` inspection)
- `.nav-wrapper` is `position: fixed` **globally** (no desktop override) → header is currently pinned, and the mobile complaint plus desktop non-stick behavior indicate the fixed positioning is both unwanted and misbehaving.
- Background gradient + `color:#fff` are applied on the **base** rule (all breakpoints), so mobile is incorrectly dark/white-text instead of white-bg/navy-text.
- Mobile grid (`nav[aria-expanded]`) includes a `tools` area, so the education + country icons show on mobile; they should be hidden there.
- Search widget, nav links, and desktop two-row grid already work (built previously); only the above need correcting.

## Approach (CSS-only, `blocks/header/header.css`)

### Fix 1 — Non-sticky header
- [ ] Change `.nav-wrapper` from `position: fixed` to `position: static` (or `relative`) so the header scrolls with the page at all breakpoints
- [ ] Remove any now-unneeded fixed-related side effects (z-index kept for dropdown layering only); ensure no content is hidden under a pinned bar

### Fix 2 — Mobile-first white bg / desktop gradient
- [ ] Move the navy→blue **gradient background** and `color:#fff` out of the base rule and **into the `@media (width >= 900px)` block** (desktop only)
- [ ] Set the **base (mobile) header** to white background with navy (`--brand-navy #170f5f`) logo, hamburger, and search-adjacent text; keep the white search pill + blue search button
- [ ] Verify the desktop gradient tone matches the live screenshot (navy `#0a1244` → blue `#3f74c4`); adjust stops if the rendered tone is off
- [ ] Ensure nav-link text color switches correctly per breakpoint (navy on mobile menu, white on desktop bar)

### Fix 3 — Mobile shows only hamburger + logo + search
- [ ] In the mobile grid, drop the `tools` row from the default (collapsed) template so the education + country selector are hidden on mobile
- [ ] Keep the search bar visible in the mobile top area (as in the live mobile screenshot)
- [ ] Confirm the education/country tools still appear on desktop (right side of the top row) and, if desired, inside the expanded mobile menu only — hidden on the collapsed mobile bar

### Verify & QA
- [ ] Preview `http://localhost:3000/content/en-us/index`; check computed styles + screenshots at **mobile 375** and **desktop 1440** against the two attached screenshots
- [ ] Mobile: white bar, navy logo, hamburger, search bar, no tools icons, no horizontal overflow, header scrolls away
- [ ] Desktop: gradient bar, white logo/links, search + tools top row, nav links row with Contact Us right-aligned, header scrolls away
- [ ] `npm run lint` clean; no regressions to page body/footer

## Checklist
- [ ] Fix 1 — Header no longer sticks (scrolls with page) at both breakpoints
- [ ] Fix 2 — Mobile white bg + navy text; desktop navy→blue gradient + white text, tone matches live
- [ ] Fix 3 — Mobile bar shows only hamburger + logo + search (tools hidden on mobile)
- [ ] Verified in preview (mobile 375 + desktop 1440), lint clean

## Notes
- **Sticky tension:** Issue #1 described the header as "does not stick while scrolling" (implying it *should*), but the follow-up selection was **"Not sticky."** I'm building to the explicit selection (non-sticky). If you actually want the header pinned on scroll, say so and I'll instead fix the `position: fixed` so it sticks correctly (and add top padding so content isn't hidden).
- Changes are **CSS-only** in `blocks/header/header.css`; no JS/nav-content changes needed for these three fixes.
- Header **code** deploys via git; nav link **content** remains the separate author-import item noted previously.
- Proprietary AvenirNextWorld font falls back to a system stack on localhost (expected; matches on the real domain).
- **Execution requires Execute mode** — approve to proceed.
