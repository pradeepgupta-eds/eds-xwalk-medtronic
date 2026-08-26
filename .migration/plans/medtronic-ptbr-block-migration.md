I've reviewed the repo state (7 templates, ~28 blocks, parsers/transformers, and the `.migration/project.json` config). Before I revise the plan for the Korean (kr-ko) site, I need a few decisions — including one real discrepancy I spotted.# Medtronic kr-ko Site Migration Plan (Reuse en-US Blocks)

## Goal

Migrate all pages in `https://www.medtronic.com/kr-ko/sitemap.xml` into AEM Edge Delivery Services, creating a **kr-ko site parallel to en-us** under `/content/eds-xwalk-medtronic` on the AEM Cloud instance `author-p25321-e1006616.adobeaemcloud.com`. Reuse the existing 7 templates and ~28 blocks from this repo as much as possible, assuming kr-ko page structures mirror en-US.

> Execution note: Drafted in Plan mode. Running it (sitemap fetch, script generation, import, upload/publish to AEM) requires **Execute mode**.

## Confirmed Decisions

- **AEM content root:** `/content/eds-xwalk-medtronic` (kr-ko created parallel to en-us). This matches the repo's existing `.migration/project.json`.
- **Reuse strategy:** Assume kr-ko mirrors en-US. Reuse parsers/transformers/selectors directly, adjusting only locale (`kr-ko`) and URLs.
- **Sequencing:** Single bulk import run across the whole sitemap (user-selected).

## ⚠️ Two Risks I Want on the Record

1. **"Assume same as en-US" + Korean locale is the highest-risk combination.** The existing parsers rely on hardcoded en-US DOM container IDs (e.g. `#container-5d1a569867`). Korean localized pages frequently use different container IDs, layouts, and section ordering. If selectors don't match, parsers silently produce empty/broken content. **Mitigation baked into this plan:** a mandatory smoke-test on a few kr-ko pages *before* the full bulk run — this is not full per-template verification, just a go/no-go gate so we don't import 1000 broken pages.
2. **"Everything in one bulk run"** is fragile at ~1000-page scale: a mid-run failure, a bad selector, or an auth timeout can corrupt or abort the batch, and validating 1000 pages at once is noisy. I'll honor it, but the plan keeps a **pre-flight smoke test** and **post-run sampled validation** so failures are caught at the edges rather than silently shipped.

## What I Still Need From You

- **Confirm the target AEM site is reachable & authorized** — the upload/publish steps need the Adobe IMS / Document Authoring credential opt-in enabled in Settings → LLM Permissions (I never take a token in chat). Without it, uploads will 401/403.
- **kr-ko URL scope** — the full sitemap, or a subset (e.g. exclude PDFs, product-detail, or non-HTML entries)?
- **Locale/URL mapping** — should kr-ko pages live at `/content/eds-xwalk-medtronic/kr-ko/...` (locale-prefixed) parallel to `/en-us/...`? Confirm the path convention.
- **Header/footer** — reuse the existing shared header/footer, or does kr-ko need localized nav/footer content?

## Existing Reusable Assets (in repo)

- **7 templates** (`page-templates.json`): homepage, our-company, our-impact, impact-reporting, healthcare-professionals, specialties, specialty-detail.
- **~28 blocks**, **23 parsers**, **3 transformers** (medtronic-cleanup / -sections / -dm-images), **7 bundled import scripts**.

## Phased Approach

### Phase 0 — Config & Locale Setup
- [ ] Fetch/parse `https://www.medtronic.com/kr-ko/sitemap.xml` (+ nested sitemaps); produce full kr-ko URL list and count.
- [ ] Add/adjust a kr-ko locale entry so en-us infra stays intact; confirm content root `/content/eds-xwalk-medtronic` and kr-ko path convention.
- [ ] Confirm AEM credential opt-in is enabled for upload/publish.

### Phase 1 — URL Cataloging & Template Bucketing
- [ ] Classify every kr-ko URL by path pattern into the 7 existing templates.
- [ ] Produce coverage report: URLs-per-template + an **unmatched bucket**.
- [ ] Write per-template kr-ko URL lists (mirroring `urls-*.txt`).

### Phase 2 — Pre-Flight Smoke Test (go/no-go gate)
- [ ] Import 2–3 kr-ko sample pages per template using existing bundled scripts.
- [ ] Preview locally + compare to live kr-ko pages (structure + Korean content parity).
- [ ] If selectors diverge, make parsers/transformers locale-tolerant and re-test.
- [ ] **Gate:** only proceed to the full run once samples render correctly.

### Phase 3 — Full Bulk Import (single run, per user choice)
- [ ] Run the import across the full kr-ko URL set.
- [ ] Capture a failure/dropped-URL log during the run (so partial failures are visible).
- [ ] Generate HTML content via the bundled import scripts (never hand-written).

### Phase 4 — Upload to AEM & Create kr-ko Site
- [ ] Upload imported pages/assets to `/content/eds-xwalk-medtronic` (kr-ko), parallel to en-us.
- [ ] Verify site tree appears correctly in the AEM Cloud instance.

### Phase 5 — Validation & QA
- [ ] Sampled post-import validation per template (source-vs-output completeness, visual critique on flagged pages).
- [ ] Verify header/footer render in kr-ko; confirm images/assets resolved and optimized.
- [ ] Re-import any failed URLs from the Phase 3 log.

### Phase 6 — Publish & PR
- [ ] Push code changes (any locale-tolerant parser fixes) to a feature branch; verify Code Sync + lint + performance.
- [ ] Open PR with a feature-preview link per template; hand off for review/merge.

## Checklist (Master)

- [ ] **P0:** Fetch/parse kr-ko sitemap; capture full URL list + count
- [ ] **P0:** Configure kr-ko locale + confirm content root and path convention
- [ ] **P0:** Confirm AEM credential opt-in enabled
- [ ] **P1:** Bucket all URLs into 7 templates + unmatched report
- [ ] **P1:** Write per-template kr-ko URL lists
- [ ] **P2:** Smoke-test samples per template; fix selector divergence; pass go/no-go gate
- [ ] **P3:** Run full bulk import; capture failure log
- [ ] **P4:** Upload pages/assets to AEM; create kr-ko site parallel to en-us
- [ ] **P5:** Sampled validation + header/footer + asset checks; re-import failures
- [ ] **P6:** Branch, verify checks, open PR with preview links, hand off

## Cost & Scale Note

Token cost concentrates in cataloging, the smoke test, and sampled validation — not the bulk import itself, which is largely deterministic/scripted. The pre-flight gate (Phase 2) is the single most important cost/risk control given the "assume same as en-US" + single-bulk-run choices.

---

To proceed, switch to **Execute mode**. I'll start with Phase 0 (sitemap fetch + confirming the true kr-ko URL count and template distribution). Please also answer the four items under **"What I Still Need From You"** so Phases 0–4 aren't blocked.
