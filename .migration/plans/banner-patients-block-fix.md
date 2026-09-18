I'll investigate how the Spark banner currently renders and maps, then build a plan.Bash is blocked in plan mode. Let me inspect the relevant files with read-only tools.Let me read the content file's top section where the hero and Spark banner live.Let me check how the Spark banner is currently produced by the hero-video parser and how the live block is structured.Let me check existing blocks to pick the right name/pattern for this banner.# Spark Banner (hero-banner-patients) Layout Fix

Fix the "First 100 Medtronic Spark scholarships…" banner that sits directly below the hero on `https://www.medtronic.com/en-us/index.html`. On the live site it is a horizontal banner block (image on the left, text on the right); in the current EDS migration it lands as loose default content (a stray image + paragraphs) with an incorrect layout. This plan turns it into a proper, correctly-styled banner block matching the live design.

## Target design (from the live page)
A single full-width bordered/subtle-shadow banner card:
- **Left (~40%):** the "2026 Scholarship recipients" collage image (`hp-spot-spark-scholars-cnpt.png`).
- **Right (~60%):** `COMMUNITIES` eyebrow (small, uppercase, letter-spaced), bold navy headline "First 100 Medtronic Spark scholarships awarded to students pursuing health tech careers", and a blue arrowed **Learn more** CTA linking to `medtronicspark.com/scholarship/`.
- Image and text vertically centered; stacks to image-over-text on mobile.

## Current state (from repo inspection)
- The banner content is currently emitted by the **hero-video parser** as trailing default content after the hero card — in `content/en-us/index.plain.html` it is a bare `<p><picture>…</picture></p>`, `<p>COMMUNITIES</p>`, `<h3>…</h3>`, `<p><a>Learn more</a></p>` sequence with no block wrapper, so it has no dedicated styling/layout.
- No `hero-banner-patients` / banner block or parser exists yet for it.
- Constraint already established this session: on this xwalk project a block whose name starts with **"columns"** is force-collapsed by the JCR converter — the new block must **not** start with "columns", and must be modeled as a `block/v1/block` with a flat model + field hints (proven pattern: `blocks/hero-video`) so its content survives to the authored/aem.page site.

## Approach
Create a dedicated banner block (proposed name: **`banner-patients`** — descriptive, non-"columns"), split it out of the hero parser so it is a first-class block, model it for JCR round-trip, and style it to match the live banner.

### Phase 1 — Block scaffold & model
- [ ] Create `blocks/banner-patients/` with `banner-patients.js`, `banner-patients.css`, `_banner-patients.json`, `metadata.json`
- [ ] Model as `block/v1/block` with flat model `image` / `imageAlt` / `text` (mirror `blocks/hero-video/_hero-video.json`), `template: { name: "Banner Patients", model: "banner-patients" }`
- [ ] `npm run build:json` to regenerate aggregated component JSON

### Phase 2 — Import infrastructure
- [ ] Add `tools/importer/parsers/banner-patients.js` that captures the Spark banner (image row + text row: eyebrow, headline, CTA) with `<!-- field:image -->` / `<!-- field:text -->` hints, following the working one-field-per-row pattern (no leading name row)
- [ ] Update the **hero-video parser** to stop absorbing the banner content (so it's no longer emitted as trailing default content)
- [ ] Register the new parser + a block instance/selector in `tools/importer/import-homepage.js` (import + registry + PAGE_TEMPLATE) and re-bundle

### Phase 3 — Decoration & styling
- [ ] `banner-patients.js`: read image row + text row, tag eyebrow / headline / CTA, promote the arrowed CTA
- [ ] `banner-patients.css`: horizontal flex layout (image left / text right, vertically centered), bordered card with subtle shadow, correct eyebrow/headline/CTA typography and the blue circular arrow — mobile stacks image over text (scoped to `.banner-patients`)

### Phase 4 — Import, verify & QA
- [ ] Re-run the homepage import to regenerate `content/en-us/index` with the banner as a proper block
- [ ] Confirm the JCR round-trip preserves the banner content (block/v1/block, no `columns/v1/columns`) — consistent with the other band blocks
- [ ] Verify in local preview at `http://localhost:3000/content/en-us/index`: block `data-block-status="loaded"`, `classList[0]="banner-patients"`, layout matches the live banner (desktop + mobile)
- [ ] `npm run lint` clean

## Checklist
- [ ] Phase 1 — `banner-patients` block scaffold + JCR-safe model created; JSON rebuilt
- [ ] Phase 2 — Parser added, hero-video parser no longer emits the banner, import script updated + re-bundled
- [ ] Phase 3 — JS/CSS give the correct image-left / text-right banner layout
- [ ] Phase 4 — Re-imported, JCR-safe, verified in preview (desktop + mobile), lint clean

## Notes / open point
- **Block naming:** I propose `banner-patients` (avoids the "columns" collapse issue and the existing `hero-banner` block). If you'd prefer it match the live class name more closely or reuse the existing `impact-band` image+text block instead of a new one, tell me and I'll adjust.
- Scope is this one banner on the homepage; no other templates are affected.
- Content HTML is regenerated via the import script, never hand-edited.
- The four band blocks from the prior step are mid-remodel; this bander block follows the same verified block/v1/block + field-hint pattern so it round-trips to aem.page correctly.
- **Execution requires Execute mode** — approve to proceed.
