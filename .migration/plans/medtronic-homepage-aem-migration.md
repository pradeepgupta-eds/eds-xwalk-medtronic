I'll help migrate the Medtronic homepage to AEM Edge Delivery Services. Let me clarify a couple of scope details before finalizing the plan.# Medtronic Homepage Migration Plan

Migrate `https://www.medtronic.com/en-us/index.html` to AEM Edge Delivery Services (crosswalk/Universal Editor project), including the homepage body content, site navigation/header, and footer — matching the original visual design.

## Scope (confirmed)
- **What:** Homepage body content + site header/navigation + footer
- **Design:** Replicate the source site's visual design (colors, fonts, spacing, layout) as closely as possible
- **Source URL:** `https://www.medtronic.com/en-us/index.html`

## Approach

The migration follows the standard EDS content-migration pipeline: analyze the page, map content to blocks, generate import infrastructure, run the import, then instrument navigation and footer, and finally validate against the original.

### Phase 1 — Project & Page Analysis
- [ ] Confirm project type (xwalk/Universal Editor) and the block library endpoint available for this project
- [ ] Scrape the source homepage: capture cleaned HTML, metadata, screenshots, and download images
- [ ] Identify section boundaries and content sequences on the page
- [ ] Decide per sequence: default content vs. block, and select/validate the appropriate blocks
- [ ] Record any new block variants needed to match the source design

### Phase 2 — Block & Design Preparation
- [ ] Survey existing blocks in the project and the block library for reuse (≥80% similarity → reuse)
- [ ] Create/adjust block variants for any content patterns not already covered
- [ ] Extract the site's design tokens (colors, typography, spacing) from the source
- [ ] Apply design styling to the migrated blocks/sections to match the original

### Phase 3 — Import Infrastructure & Content Import
- [ ] Map block DOM selectors into the page template definition
- [ ] Generate import parsers (per block variant) and page transformers (cleanup, sections, media)
- [ ] Build/bundle the project import script (using the bundled import + `run-bulk-import.js`)
- [ ] Run the import to generate the homepage content
- [ ] Preview the imported page locally and confirm rendering

### Phase 4 — Navigation (Header)
- [ ] Instrument the site header/navigation from the source (desktop, mobile, and any mega-menu)
- [ ] Verify nav structure, links, and interactive behavior against the original
- [ ] Style the header to match the source design

### Phase 5 — Footer
- [ ] Migrate the footer from the source (desktop + mobile)
- [ ] Verify footer content, links, and layout
- [ ] Style the footer to match the source design

### Phase 6 — Validation & QA
- [ ] Visual critique: compare migrated homepage, header, and footer against the original
- [ ] Fix any content-completeness or styling divergences found
- [ ] Run `npm run lint` (and `npm run build:json` if models changed) and resolve issues
- [ ] Check accessibility (heading hierarchy, alt text, ARIA) and performance
- [ ] Preview final result and confirm parity with the source

## Checklist (summary)
- [ ] Phase 1 — Project & page analysis complete
- [ ] Phase 2 — Blocks selected/created and design tokens applied
- [ ] Phase 3 — Import infrastructure built and homepage content imported
- [ ] Phase 4 — Header/navigation instrumented and styled
- [ ] Phase 5 — Footer migrated and styled
- [ ] Phase 6 — Validated against original, linted, and QA'd

## Notes
- This is a single-page migration with header + footer; a full-site template catalog is out of scope for this task.
- HTML content will be produced via the project's import script — not hand-authored.
- Execution requires **Execute mode**; approve this plan to proceed.
