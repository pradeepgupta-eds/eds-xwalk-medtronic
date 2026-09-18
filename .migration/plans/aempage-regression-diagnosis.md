# aem.page Homepage Design Regression — Diagnosis

## Symptom
Local preview (`/content/en-us/`) renders correctly, but the deployed page at
`https://aem-20260918-1404--eds-xwalk-medtronic--pradeepgupta-eds.aem.page/en-us/`
shows broken design for `columns-impact`, `columns-promo`, and other columns blocks.

## Confirmed facts
- **Code IS deployed:** all block CSS fixes + `carousel-news.js` parser are committed and
  pushed on `aem-20260918-1404` (commit `d5940d2`; branch synced 0/0 with origin).
- **Content is NOT shipped via git:** `content/` is git-excluded (`.git/info/exclude`).
  aem.page renders content from the AEM author content source (xwalk project:
  `author-p25321-e1006616.adobeaemcloud.com` via `franklin.delivery`, per `fstab.yaml`).
- **Preview vs aem.page read different sources:**
  - Local `aem up --html-folder content` serves `content/en-us/index.plain.html` directly;
    EDS decorates the block-name row ("Columns Stats") into the variant CSS class
    `.columns-stats` → styling works.
  - aem.page renders the **JCR** (authored content). JCR columns components are emitted as
    generic `<columns>` with **no variant class**.

## Root cause (mechanism)
Block-class comparison:

| Source | hero-video | carousel-news | cards-stats | columns-* |
|---|---|---|---|---|
| local plain.html | `.hero-video` | `.carousel-news` | `.cards-stats` ×3 | `.columns-stats/impact/promo` |
| aem.page (JCR) | `.hero-video` ✅ | `.carousel-news` ✅ | `.cards-stats` ×3 ✅ | **`.columns` ×6** ❌ |

- `hero-video`, `carousel-news`, `cards-stats` are modeled as **block** components
  (`resourceType=core/franklin/components/block/v1/block` + `name` + `filter`) → the JCR
  carries the variant, aem.page renders the variant class. ✅
- `columns-stats/impact/promo/cta` are modeled as **columns** components
  (`resourceType=core/franklin/components/columns/v1/columns`) whose model fields are only
  `columns`/`rows` — **no `classes` field**. The md2jcr converter
  (`@adobe/helix-md2jcr .../partials/columns.js`) only emits a `classes="…"` attribute when
  (a) the model has a `classes` field AND (b) the block name carries a parenthetical class,
  e.g. `Columns (columns-stats)`. Neither is present → JCR emits plain `<columns>` →
  aem.page renders `.columns` → the new CSS (which targets `.columns-stats` etc.) has no
  matching element → broken design. ❌

The aem.page content is also missing the who-we-are stats bar, the Our-Impact access-card,
and the full Careers/Investors content — consistent with the columns variant collapse.

## Conclusion
This is **not a CSS bug**. It is a content-modeling gap: the columns block variants do not
carry their variant class into JCR, so the deployed (author-rendered) page can never match
the CSS. The CSS itself is already correct and deployed.

## Fix options (CORRECTED after deeper verification)

**Decisive fact:** `scripts/aem.js` `decorateBlock()` derives the block name from
**`block.classList[0]`**, and loads `/blocks/<classList[0]>/<classList[0]>.{css,js}`. The
variant CSS in this repo depends on sub-classes (`.columns-impact-content`,
`.columns-stats-info-bar`, `.columns-promo-bg`, …) that are added by each variant's OWN JS
decorator — so both the variant CSS **and** JS must load.

- **Option A (add `classes` field) — REJECTED.** A `core/franklin/components/columns/v1/columns`
  node always renders `<div class="columns …variant… block">`, so `classList[0]` stays
  `"columns"`. EDS would load the base `blocks/columns/columns.{css,js}` (which only adds
  `columns-N-cols` / `columns-img-col`), the variant JS would never run, and the sub-classes
  the variant CSS needs would never exist. Adding a `classes` field does NOT fix aem.page.

- **Option B (re-model as block component) — CORRECT FIX.** Re-model `columns-stats`,
  `columns-impact`, `columns-promo`, `columns-cta` as
  `core/franklin/components/block/v1/block` with `template.name` + `template.filter` (exactly
  like `cards-stats`, which is verified to deliver `<div class="cards-stats">` on aem.page →
  `classList[0]="cards-stats"` → variant CSS+JS load). This makes the delivered block's first
  class the variant name so the existing block code runs unchanged.

**Proof:** On aem.page, `cards-stats` (modeled as block/v1/block) delivers `class="cards-stats"`
and renders correctly; `columns-*` (modeled as columns/v1/columns) deliver `class="columns"`
and render broken. Same page, same deploy — the only difference is the component model.

## DEEPER ROOT CAUSE (verified empirically with the installed md2jcr)
Changing only the `_<block>.json` `resourceType` to `block/v1/block` is **NOT sufficient**.
The converter `@adobe/helix-md2jcr` has a hardcoded rule in
`src/mdast2jcr/mdast-columns-block.js` → `splitColumns()`:

```js
if (value.toLowerCase().startsWith('columns')) { table.type = 'columns'; }
```

Any block whose **name row starts with "columns"** (case-insensitive) is retyped to a
`columns` node and rendered by `columns.js`, which is hardcoded to emit
`sling:resourceType="core/franklin/components/columns/v1/columns"` and **ignores the
definition's resourceType**. Verified: after flipping all four models to `block/v1/block`
and re-running md2jcr on the existing markdown, the JCR still emitted 6
`columns/v1/columns` nodes (0 change). So the model edit alone does nothing.

**Therefore the real fix is to RENAME the four blocks so their name no longer starts with
"columns"** (e.g. `Columns Stats`→`Stats Band`, `Columns Impact`→`Impact Promo`,
`Columns Promo`→`Promo Banner`, `Columns Cta`→`Cta Banner`), which requires, per block, a
coordinated rename across ALL of:
1. Block folder + files: `blocks/columns-stats/` → `blocks/stats-band/` (`.js`, `.css`,
   `_<block>.json`, `metadata.json`) — so the delivered `classList[0]` loads the right code.
   The variant CSS/JS internals (sub-class names like `.columns-stats-info-bar`) can stay or
   be renamed; only the top-level block class must match the new folder name.
2. Definition/model/filter ids + titles in `_<block>.json` → rebuild aggregated JSON.
3. Importer parsers (`tools/importer/parsers/columns-*.js`) — the block-name cell they emit
   (`'Columns Stats'` → `'Stats Band'`) and their filenames/registry entries.
4. `import-homepage.js` PAGE_TEMPLATE block names + parser registry, then re-bundle.
5. Re-import → regenerate content + JCR → verify JCR now emits `block/v1/block` with the new
   name and the delivered page carries the variant class.

Because md2jcr routes on the "columns" name prefix, there is no shortcut: block-modeled
variants simply cannot be named "Columns …". This is why `cards-stats` works and
`columns-*` do not.

Recommended: **rename the four blocks off the "columns" prefix** (the corrected Option B).
This is a multi-file coordinated rename touching blocks, models, parsers, and the import
script — larger than a model tweak, but it is the only approach that makes aem.page render
these blocks correctly.

## IMPLEMENTED (homepage scope) — verified locally
Renamed the homepage's four columns variants off the "columns" prefix:
- `columns-stats`  → `stats-band`
- `columns-impact` → `impact-band`
- `columns-cta`    → `cta-band`
- `columns-promo`  → `promo-band` (NEW homepage-specific block; original `columns-promo`
  LEFT INTACT because our-company / our-impact / impact-reporting / hero-landing-krko still
  use it — per user "homepage only" scope)

Changes per block: folder + `.js`/`.css`/`_<block>.json` renamed; all class prefixes updated
(`.columns-stats-*` → `.stats-band-*`, etc.); model set to `block/v1/block` with
`template.name` + `template.filter` and empty `models` (default-content block); JS label-row
check updated to the new name. Importer: cloned parsers `stats-band.js` / `impact-band.js` /
`cta-band.js` / `promo-band.js` (emit new block-name row + `createBlock` name); updated
`import-homepage.js` parser imports, registry, and PAGE_TEMPLATE block names; re-bundled.

Verification (local):
- `npm run build:json` — new defs present as `block/v1/block`; old homepage ids gone.
- Re-import — content now carries `class="stats-band|impact-band|cta-band|promo-band"`.
- `npm run lint` — clean.
- Local preview `/content/en-us/index` — all four blocks `data-block-status="loaded"` with
  `classList[0]` = variant name (stats-band/impact-band/cta-band/promo-band). This is the
  exact condition that was failing on aem.page (`classList[0]="columns"`). Design renders
  identically to the previously-correct preview.
- md2jcr routing: names no longer start with "columns", so `splitColumns` will NOT retype
  them → they emit as `block/v1/block` with the variant name (same shape as `cards-stats`,
  which renders correctly on aem.page today).

NOT pushed / NOT published (per user). See handback steps below for what to run.

## Delivery constraint
Per user: prepare + verify locally only — do NOT push or publish this round. Publishing an
xwalk project means uploading regenerated JCR to AEM author + previewing via admin.hlx.page.
