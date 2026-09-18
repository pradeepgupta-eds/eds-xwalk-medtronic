I'll investigate the current state of the migration to build an accurate plan. Let me explore the repo structure and existing migration artifacts.Let me look at the existing homepage migration details and the current state of the migrated content.Let me review the existing homepage migration plan and infrastructure to understand what's already in place.Let me inspect the import infrastructure with read-only tools.Let me check the backed-up homepage template and the homepage import script.I have a clear picture of the existing setup. Let me confirm a couple of scope points before finalizing the plan.# Medtronic /en-us/ Homepage Re-Sync Plan

Re-migrate `https://www.medtronic.com/en-us/index.html` so the EDS page at `https://main--eds-xwalk-medtronic--pradeepgupta-eds.aem.page/en-us/` becomes an **exact copy** of the *current* live homepage. The homepage was migrated a few days ago, but the live page has since changed. This plan re-scrapes the live page, diffs it against the existing migration, and updates content, block/section structure, and design (CSS) to match — including the header/navigation and footer, plus two newly-referenced components: a **hero card** (`hero-jon__card`) and a **hero banner** (`hero-banner-patients`).

## Scope (confirmed)
- **Re-sync targets:** Body content · Header / navigation · Footer · hero card component (`hero-jon__card`) · hero banner (`hero-banner-patients`)
- **Depth:** Content **+** structure **+** design — restyle blocks/CSS wherever the live design has diverged (true exact copy)
- **Delivery:** Regenerate content via the import script and verify in local preview only (no push/PR/publish this round)
- **Source URL:** `https://www.medtronic.com/en-us/index.html`

## Current State (from repo inspection)
- Existing `homepage` template (in `page-templates.en-us.backup.json`) uses blocks: `hero-video`, `carousel-news`, `columns-stats`, `columns-cta`, `columns-impact`, `cards-stats`, `columns-promo`, across 7 sections (hero, news-media, who-we-are, cta-blueprint, our-impact, careers, investors).
- Import script `tools/importer/import-homepage.js` (+ `.bundle.js`) and parsers/transformers already exist and are reusable.
- Live currently-referenced components `hero-jon__card` and `hero-banner-patients` suggest **new/changed source markup** that the old selectors and parsers may not cover — these need analysis and likely new/updated block variants.
- Note: `page-templates.json` presently holds only the `kr-ko` press-article template; the `en-us` homepage config lives in the backup file and embedded in the import script. Re-syncing will restore/update the homepage template config.

## Approach

### Phase 1 — Capture & Diff the Current Live Page
- [ ] Re-scrape the current live homepage (cleaned HTML, metadata, screenshots, images) using the scrape skill
- [ ] Re-analyze page structure: section boundaries and content sequences on the *current* page
- [ ] Diff current structure/selectors against the existing `homepage` template (backup json + import script) — record: changed selectors, new/removed sections, changed content, changed images
- [ ] Identify what `hero-jon__card` and `hero-banner-patients` correspond to (which section, what content model) and whether they map to existing blocks (`hero-video`/`hero-banner`) or need new variants
- [ ] Produce a concrete change list (per section: unchanged / content-changed / structure-changed / new / removed)

### Phase 2 — Block & Design Updates
- [ ] For each changed section, decide reuse vs. new block variant (≥80% similarity → reuse existing block)
- [ ] Create/adjust block variants for `hero-jon__card` and `hero-banner-patients` (JS, CSS, `_{block}.json` model) as needed
- [ ] Update existing block CSS/JS where the live design has changed (colors, spacing, typography, layout) to match exactly
- [ ] Run `npm run build:json` if any `_{block}.json` models changed

### Phase 3 — Import Infrastructure Refresh
- [ ] Update the `homepage` entry in `page-templates.json` (sections, block instances, selectors) to match the current page; restore it alongside the kr-ko template
- [ ] Update/add block DOM selector mappings for new & changed blocks
- [ ] Update/create parsers for new/changed block variants (`hero-jon__card`, `hero-banner-patients`, any changed ones)
- [ ] Update transformers (cleanup / sections / DM-images) if section structure or media handling changed
- [ ] Update `tools/importer/import-homepage.js` (parser registry + embedded PAGE_TEMPLATE) and re-bundle

### Phase 4 — Run Import & Regenerate Content
- [ ] Run the bundled import (via `run-bulk-import.js`) to regenerate `content/en-us/index` — never hand-edit content HTML
- [ ] Confirm the import produced updated `index.plain.html` with the new/changed blocks and sections

### Phase 5 — Header / Navigation & Footer Re-Sync
- [ ] Compare current live header/nav (desktop, mobile, mega-menu) against the migrated header; update structure, links, and styling to match
- [ ] Compare current live footer against the migrated footer; update content, links, and styling to match
- [ ] Style header/footer to match the current source design

### Phase 6 — Validation & QA (local preview)
- [ ] Preview the regenerated homepage locally and inspect DOM/structure (snapshot/evaluate) against the current live page
- [ ] Visual critique: compare migrated homepage, header, and footer section-by-section against the current live page; fix divergences (content + structure + design)
- [ ] Run `npm run lint` (and `npm run build:json` if models changed) and resolve issues
- [ ] Accessibility check (heading hierarchy, alt text, ARIA) and confirm parity with the source

## Checklist (summary)
- [ ] Phase 1 — Current live page captured and diffed against existing migration
- [ ] Phase 2 — Blocks (incl. `hero-jon__card`, `hero-banner-patients`) created/updated and design matched
- [ ] Phase 3 — Import infrastructure (template, parsers, transformers, import script) refreshed
- [ ] Phase 4 — Import re-run; homepage content regenerated
- [ ] Phase 5 — Header/navigation and footer re-synced and styled
- [ ] Phase 6 — Validated against current live page, linted, and QA'd in local preview

## Notes
- This is a re-sync of a previously-migrated single page (homepage) plus its shared header/footer; a full-site re-catalog is out of scope.
- Content HTML is produced only via the project import script — not hand-authored or hand-edited.
- Because "exact copy" is the goal, Phase 6 visual critique will iterate on any pixel/layout/content divergence until parity is reached.
- **Execution requires Execute mode** — approve this plan to proceed.
