# Header/Nav Pixel-Match Fixes — Desktop & Mobile

Fix the global header/nav in `blocks/header/` so it matches the production Medtronic header (`https://www.medtronic.com/en-us/index.html`) at both desktop (~1900px) and mobile (400×428). Extract **exact** computed values from the live site (gradient stops/angle/hex, icon sizes, nav spacing, search width, breakpoints) and replicate them — no approximations. Verify pixel-match in local preview; hand back deploy steps (no push/publish this round).

## Confirmed decisions
- **Delivery:** Fix + verify locally only; hand back push/publish steps. The deployed `aem.page` target will not change until you deploy — verification is against the **live site in local preview**.
- **Fidelity:** Extract exact live computed values and replicate precisely.

## Current state (from `blocks/header/header.css` inspection)
Much scaffolding already exists from prior rounds — this task refines it to exact values and fixes the mobile search bug:
- Desktop gradient present but **approximated** (`linear-gradient(90deg, #0a1244 → #101a5c → #1c3f8f → #3f74c4)`) — needs exact live stops/angle/hex.
- Utility icons (graduation cap, location pin) exist as `currentcolor` masks; region text "United States of America" present — need exact size/stroke/spacing, and to confirm they render on the deployed target (content-dependent).
- Search form has `max-width:560px` / desktop `width:420px`, input `font-size:15px` — placeholder truncation to fix by widening to live spec.
- "Contact Us" is the 5th nav item in the local nav fragment and pushed right via `li:last-child { margin-left:auto }` — needs live spacing logic confirmed.
- **Mobile bug:** the mobile grid (`'search search'`) still includes the full `.nav-search-form` **with** the `.nav-search-select` ("Search within") — it is NOT hidden on mobile, so it splits the row and truncates the input. This is the critical fix.

## Approach (CSS-only in `blocks/header/header.css`; JS only if needed to tag elements)

### Phase 1 — Extract exact live values (reference)
- [ ] Inspect live header `.nav-wrapper`/header container computed `background-image`: exact gradient type, angle, and each color stop (hex + %) — replicate verbatim
- [ ] Extract graduation-cap + location-pin icon computed sizes, stroke color/weight, and gaps/padding; region text font-size/weight/color/letter-spacing
- [ ] Extract search input width, padding, font-size, pill height, border color/radius, and the blue button size/color/icon size
- [ ] Extract primary-nav layout: flex gap vs space-between vs fixed columns; item font weight/size/color and hover/active state
- [ ] Identify the exact **media-query breakpoint** at which the live site hides "Search within" (and any other desktop-only header elements)

### Phase 2 — Desktop fixes (≥ the live breakpoint)
- [ ] **Gradient:** replace approximated stops with exact extracted values (angle, hex, %)
- [ ] **Utility icons:** set graduation-cap + location-pin to exact size/stroke/color; position to the right of the search bar, pin+text next; exact spacing/padding
- [ ] **Search width:** widen input so "Search Medtronic" placeholder is fully visible (match live input width/padding/font-size)
- [ ] **Contact Us:** confirm present as 5th item with live font weight/size/color + hover/active
- [ ] **Nav spacing:** apply the live row's justification logic (replace the `margin-left:auto` hack if the live site uses even gaps/space-between) so all 5 items read as intentionally spaced

### Phase 3 — Mobile fixes (< breakpoint)
- [ ] **Hide "Search within":** collapse `.nav-search-select`(-wrap) entirely at the live mobile breakpoint
- [ ] **Full-width input:** search input expands to fill the row; full "Search Medtronic" placeholder visible, no truncation
- [ ] **Pill styling:** confirm rounded input + blue circular/pill button with white magnifier match live mobile border color/radius, button color, icon size, pill height
- [ ] **Do NOT touch** the logo/hamburger row (validated as correct)

### Phase 4 — Validation (local preview vs live)
- [ ] Desktop side-by-side at ~1900px: gradient, icons, full placeholder, 5 nav links, even spacing
- [ ] Mobile side-by-side at 400×428: "Search within" hidden, full-width input + complete placeholder, logo/hamburger unchanged
- [ ] Tablet/intermediate: confirm "Search within" hides/shows at the **same** breakpoint as live (align the media query if the current 900px differs)
- [ ] `npm run lint` clean; confirm no changes leak outside the header/nav region

## Checklist
- [ ] Phase 1 — Exact live values extracted (gradient, icons, search, nav spacing, breakpoint)
- [ ] Phase 2 — Desktop: exact gradient, icons, search width, Contact Us, even nav spacing
- [ ] Phase 3 — Mobile: "Search within" hidden, full-width search input, pill styling matches
- [ ] Phase 4 — Validated desktop + mobile + tablet vs live; lint clean; header-only scope

## Notes
- **Target vs local:** `aem.page` reflects deployed code + published content and will **not** update from this round (fix + verify locally only). Some items (Contact Us link, tools text) are content-dependent and appear on the deployed site only after the nav fragment is imported to author — I'll include that in the handback.
- Scope strictly the header/nav (`blocks/header/*`, and the local nav fragment if a link/tag is needed). No other page components.
- Proprietary AvenirNextWorld font falls back to a system stack on localhost (expected; exact on the real domain).
- **Execution requires Execute mode** — approve to proceed.
