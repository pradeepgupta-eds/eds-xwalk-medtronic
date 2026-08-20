# Medtronic Multi-Page Migration Plan (Batch 3)

Migrate five additional pages into the existing `/en-us/` Edge Delivery Services site, **reusing the already-implemented block variants, shared header/footer, and design system** wherever content patterns match. New block variants are created only when a pattern is genuinely not covered by an existing block.

## Target URLs
1. `https://www.medtronic.com/en-us/our-impact.html`
2. `https://www.medtronic.com/en-us/our-impact/impact-reporting.html`
3. `https://www.medtronic.com/en-us/healthcare-professionals.html`
4. `https://www.medtronic.com/en-us/healthcare-professionals/specialties.html`
5. `https://www.medtronic.com/en-us/healthcare-professionals/specialties/acute-care-monitoring.html`

## Guiding Principles
- **Reuse first:** match each content sequence against existing variants at ≥80% similarity before creating anything new. Existing inventory: `hero-video`, `hero-stats`, `carousel-news`, `columns-stats`, `columns-cta`, `columns-impact`, `columns-promo`, `columns-promo-card`, `cards-stats`, `cards-topic`, `cards-tiles`, `cards-articles` (plus base `cards`/`columns`/`hero`/`carousel`).
- **Shared chrome:** header (`content/nav.plain.html`) and footer (`content/footer.plain.html`) are already migrated — exclude them from body analysis; they render automatically via the fallback fetch.
- **Design:** rely on global `styles/brand.css` tokens and existing block CSS; only add styling for genuinely new variants.
- **Infrastructure reuse:** reuse `medtronic-cleanup.js`, `medtronic-sections.js`, and (if DM/Scene7 images appear) `medtronic-dm-images.js`. The DM client-side pipeline (`scripts/scripts.js` auto-block + `scripts/aem.js` dispatcher) is already installed with the lint fix in place.
- **Paths:** each page imports to its source path under `/en-us/` (e.g. `content/en-us/our-impact.plain.html`, `content/en-us/healthcare-professionals/specialties.plain.html`).

## Approach
The 5 URLs likely form 3–5 templates (an "our-impact" overview, a reporting/content page, a "healthcare-professionals" landing, a specialties listing, and a specialty detail page). I'll analyze each, group into templates, maximize variant reuse, then run the standard per-template import pipeline (mapping → infrastructure → import → verify).

## Checklist

### Phase 0 — Setup
- [ ] Confirm dev server is serving current content and existing blocks/design are intact
- [ ] Snapshot existing block inventory to drive reuse decisions

### Phase 1 — Per-page analysis (all 5 URLs)
- [ ] Analyze `our-impact.html` → sections, sequences, reuse vs. new variants
- [ ] Analyze `our-impact/impact-reporting.html`
- [ ] Analyze `healthcare-professionals.html`
- [ ] Analyze `healthcare-professionals/specialties.html`
- [ ] Analyze `healthcare-professionals/specialties/acute-care-monitoring.html`
- [ ] Group URLs into templates; record reuse map and any new variants needed
- [ ] Produce analysis artifacts per page under `migration-work/<page>/` (do not overwrite existing pages' artifacts)

### Phase 2 — Blocks & design
- [ ] Reuse existing variants for matched patterns (≥80% similarity)
- [ ] Create any genuinely new block variants (js/css/model), styled to match source using brand tokens
- [ ] Run `npm run build:json` if any block models change

### Phase 3 — Block mapping & import infrastructure
- [ ] Add each new template (with block + section mappings) to `tools/importer/page-templates.json`
- [ ] Cache per-block source HTML for new variants
- [ ] Reuse cleanup/sections transformers; generate DM transformer only if Scene7/DM URLs are detected
- [ ] Generate parsers for new variants only
- [ ] Generate one import script per template

### Phase 4 — Content import
- [ ] Bundle and run import for each template → `content/en-us/...plain.html` at correct paths
- [ ] Verify all blocks and content are captured; fix parser/transformer gaps and re-import as needed

### Phase 5 — Validation & QA
- [ ] Preview each migrated page (shared header/footer + body blocks) and compare to source
- [ ] Fix content-completeness or styling divergences
- [ ] Run `npm run lint` (JS + CSS) and resolve any issues; confirm no `no-underscore-dangle`/ordering regressions
- [ ] Confirm visual parity and report per-page status

## Notes
- Pages like the specialties listing and specialty detail may contain patterns not yet covered (link lists, resource/download grids, longform content, tables). Those become new reusable variants added to the shared inventory for future pages.
- If any page turns out to be product/listing (commerce) or forms-heavy, I'll flag it; dedicated commerce/forms tooling exists but is not enabled (only the Figma plugin was surfaced this turn, which isn't relevant here).
- Execution (analysis sub-agents, file writes, imports, lint) requires **Execute mode** — approve this plan to proceed.
