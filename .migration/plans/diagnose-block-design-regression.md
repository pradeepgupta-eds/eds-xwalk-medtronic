I need to investigate the discrepancy between the two environments. Let me check what content each is serving.I can't fetch in plan mode. Let me investigate the likely cause with read-only tools — comparing what's committed/pushed versus my local design fixes.# Fix aem.page Homepage Rendering (Design Mismatch vs Preview)

The local/preview homepage at `preview-aemcoder.adobe.io/content/en-us/` renders correctly (content + design synced earlier this session), but the deployed EDS page at `https://aem-20260918-1404--eds-xwalk-medtronic--pradeepgupta-eds.aem.page/en-us/` shows **broken design for `columns-impact`, `columns-promo`, and a few other blocks**. This plan diagnoses the root cause first, then prepares (but does not publish) the fix.

## Objective
- Diagnose why aem.page diverges from the working preview for the affected blocks.
- Prepare a verified fix and hand back exact publish steps — **do not push or publish** this round (per your choice).

## Confirmed decisions
- **Approach:** Diagnose first, then decide — don't make outward changes before the cause is pinpointed.
- **Delivery:** Prepare and verify locally; return the precise publish/deploy steps for you to run. No pushing/publishing by me.

## Most likely root cause (to confirm, not assume)
The `aem.page` preview serves **published content from the content source** (Document Authoring / AEM author), while `localhost`/preview-aemcoder serves the **freshly re-imported local `content/en-us/index`**. The two can disagree in three independent ways:
1. **Stale content on aem.page** — the regenerated homepage DOM was never published, so aem.page renders the OLD block markup while the block CSS was rewritten for the NEW markup → broken layout.
2. **Undeployed CSS/JS** — the block CSS fixes (`columns-impact`, `columns-promo`, `columns-stats`, `hero-video`, carousel parser) are only local/uncommitted, or committed but not on the branch AEM Code Sync built for `aem-20260918-1404`.
3. **DOM mismatch** — content published to aem.page came from a different import (different parser version), so class names/structure the CSS targets don't exist there.

## Approach

### Phase 1 — Establish the delta (read-only diagnosis) — requires Execute mode for network/git
- [ ] Check git state: is branch `aem-20260918-1404` ahead of `origin`? Are the block CSS fixes (`columns-impact`, `columns-promo`, `columns-stats`, `hero-video`) and the `carousel-news.js` parser change **committed and pushed**?
- [ ] Verify `gh pr checks` / AEM Code Sync status for the branch (did the CSS actually deploy to `aem.page`?)
- [ ] Fetch `https://aem-20260918-1404--…aem.page/en-us/index.plain.html` and capture its block DOM (class names, row/cell structure) for `columns-impact` & `columns-promo`
- [ ] Fetch the same blocks' delivered CSS on aem.page (are the new rules present?)
- [ ] Compare against local `content/en-us/index.plain.html` + local block CSS
- [ ] Classify the cause per block: **stale content** vs **undeployed CSS** vs **DOM mismatch**

### Phase 2 — Confirm the content-source state
- [ ] Determine what content is actually published for `/en-us/` on the content source (Document Authoring `admin.da.live` path from `.migration/project.json`)
- [ ] Confirm whether the new imported homepage was ever uploaded/published there (vs. only living in the local repo `content/`)
- [ ] Record the exact org/repo/path needed for a DA upload of `content/en-us/index.plain.html`

### Phase 3 — Prepare the fix (no outward publish)
- [ ] If cause = **undeployed CSS**: ensure the block CSS + parser fixes are committed on `aem-20260918-1404`; prepare the commit/push steps (hand back, don't push)
- [ ] If cause = **stale content**: prepare the exact DA upload/publish command(s) for the regenerated `content/en-us/index.plain.html` (and any dependent assets), plus the `admin.hlx.page` preview/publish calls — hand back, don't run
- [ ] If cause = **DOM mismatch**: re-verify the local import is current (re-bundle + re-import if needed) so the content to be published matches the CSS
- [ ] Re-verify locally that the prepared content + CSS render correctly together in preview (desktop + mobile)

### Phase 4 — Handback
- [ ] Provide a short written diagnosis (per-block cause)
- [ ] Provide the exact, ordered steps you need to run to make `aem.page` match the preview (git push and/or DA upload + publish), with the precise paths/commands
- [ ] Note any settings toggles required (e.g. LLM Permissions for git or Adobe/DA credentials) if you'd later want me to run them

## Checklist
- [ ] Phase 1 — Delta established; per-block cause classified (stale content / undeployed CSS / DOM mismatch)
- [ ] Phase 2 — Content-source (Document Authoring) publish state confirmed
- [ ] Phase 3 — Fix prepared and re-verified locally (nothing pushed or published)
- [ ] Phase 4 — Diagnosis + exact publish steps handed back to you

## Notes
- **Execution requires Execute mode** — Phase 1 needs `curl`/`git`/`gh` (network + repo reads) which are blocked in plan mode. Approve to proceed.
- I will **not** push to git or upload/publish to Document Authoring this round; I'll stop at a verified-local fix plus precise handback steps.
- Key suspicion to check first: the block CSS was rewritten for the NEW imported DOM, so if aem.page still serves OLD/unpublished content, the new CSS will visibly break exactly the blocks you named (`columns-impact`, `columns-promo`). That points to a **publish/content-sync gap**, not a CSS bug.
