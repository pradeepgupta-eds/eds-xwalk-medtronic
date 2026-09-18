Let me inspect the desktop media query for the nav-sections to diagnose why the links disappeared.Let me see the rest of the desktop nav-sections rules to confirm whether the white background is reset on desktop.# Restore Desktop Nav Links (Regression Fix)

The desktop primary nav links (Healthcare Professionals · Patients & Caregivers · Our Company · Our Impact · Contact Us) are no longer visible in the **local preview**, and the hero video is confirmed correctly desktop-only (scope reminder only — no video change needed). This plan diagnoses and fixes the desktop nav-links regression, scoped to the header.

## Scope (confirmed)
- **Environment:** Local preview (my recent changes are live there) — so this is a real regression I introduced, to be diagnosed and fixed.
- **Video:** Desktop-only is the intended scope and already correct — **no changes to the hero video**; focus solely on restoring the desktop nav links.

## Likely cause (to confirm in Execute mode)
Recent header changes for the mobile full-screen overlay and the mobile "links-only / white menu" treatment added rules on `.nav-sections` (and its `ul`/`li`) that may now be suppressing the links on desktop. Leading suspects to verify via computed styles in the local preview:
1. **Stacking/visibility under the hero:** the header is `position: static` (non-sticky) with the hero video/section that has stacking layers (`z-index`, `overflow:hidden`, `position:relative`) — the desktop nav-links row (which sits on the gradient just above the hero) may be rendered but visually **covered by the hero section** or clipped, so links appear "gone."
2. **Color/inherited text:** `.nav-sections` links use `color: inherit`; if the desktop `nav` white color isn't cascading to the sections row (or a mobile rule set navy on a now-transparent/gradient background), links could be present but **invisible (same color as background)**.
3. **Display/overlay leakage:** a mobile rule (e.g. the expanded-overlay `position:fixed`, or `display:none`/white-panel rules) not fully reset inside `@media (width >= 900px)`, hiding or mis-positioning the desktop sections row.

## Approach (read-only diagnosis → minimal CSS fix)
### Phase 1 — Diagnose in local preview (desktop ≥900px)
- [ ] Inspect the desktop `.nav-sections` and its `ul`/`li`/`a` computed styles: `display`, `visibility`, `opacity`, `color`, `z-index`, `position`, and bounding-box (are links laid out but off-screen/behind the hero, or truly `display:none`?)
- [ ] Check whether the links’ **text color equals the background** (invisible-but-present) vs. actually hidden
- [ ] Check stacking against the hero: is the `.nav-sections` row covered by the `.hero-video-wrapper`/section or clipped by an `overflow:hidden` ancestor?
- [ ] Confirm which recent rule regressed it (mobile overlay `position:fixed`, white-panel background, or a color/inherit change)

### Phase 2 — Minimal targeted fix (header CSS only)
- [ ] Restore desktop nav links to visible: ensure the desktop `.nav-sections` row is `display:flex`, `visibility:visible`, white text on the gradient, correctly positioned within the two-row grid, and above the hero (appropriate `z-index`/stacking if needed)
- [ ] Ensure any mobile-only rule (overlay position, white background, link color) is properly reset within the `@media (width >= 900px)` block so it can’t leak to desktop
- [ ] Keep Contact Us right-aligned and the 16px/spacing values already established; do not disturb the mobile overlay or the hero video

### Phase 3 — Verify & QA
- [ ] Desktop 1440: all 5 nav links visible on the gradient row, correct color/spacing, Contact Us right-aligned; hero video still plays behind the card
- [ ] Mobile 400: hamburger overlay still correct (links-only white full-screen), no regression
- [ ] Tablet check at the 768/900 boundaries; no horizontal overflow
- [ ] `npm run lint` clean; changes scoped to `blocks/header/header.css`

## Checklist
- [ ] Phase 1 — Root cause of missing desktop nav links identified via computed styles in local preview
- [ ] Phase 2 — Minimal header-CSS fix restores visible desktop nav links without touching hero video or mobile overlay
- [ ] Phase 3 — Verified desktop + mobile + tablet; lint clean; header-only scope

## Notes
- Diagnosis-first: I’ll confirm the exact failing rule with computed styles before editing, so the fix is minimal and doesn’t reintroduce the earlier mobile issues.
- No hero-video changes (desktop-only scope already correct). No nav-content changes.
- Header code deploys via git; local preview is the source of truth for this fix. Fix + verify locally.
- **Execution requires Execute mode** — approve to proceed.
