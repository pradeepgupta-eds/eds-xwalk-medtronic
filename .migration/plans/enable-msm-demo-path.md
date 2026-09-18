# Enable MSM for the Demo Path — Setup + UE "Unexpected Error" Troubleshooting

## Goal

Set up Multi Site Management on the demo blueprint AND resolve the **"Unexpected Error"** blocking Universal Editor from opening the page, so you can run a complete MSM lifecycle demo.

- **Master (Blueprint source):** `/content/eds-xwalk-medtronic/demo/language-masters/en`
- **Live Copy target (locale):** `/content/eds-xwalk-medtronic/demo/kr/ko` (Korean)
- **Demo scope:** Full lifecycle — creation, rollout, broken inheritance, resync

---

## Current blocker: UE cannot open the page

The failing URL is the AEM → Edge Delivery bridge (`bin/franklin.delivery/.../main/en-us/index?cmd=open`), which returns:
> *Unexpected Error: Looks like we are having some issues with our service.*

### What this URL tells us

- The repo's `fstab.yaml` mount is:
  `https://author-p25321-e1006616.adobeaemcloud.com/bin/franklin.delivery/pradeepgupta-eds/eds-xwalk-medtronic/main`
- The `franklin.delivery` service resolves a **content path** and returns markup for UE to open. A generic "Unexpected Error" from this endpoint almost always means the service **could not resolve/deliver the requested content path**, not a repo code bug.

### Most likely causes (in order)

1. **Path mismatch** — The failing URL targets `.../main/en-us/index`, but your new demo blueprint lives at `demo/language-masters/en/index`. The old `en-us` node may be missing, unpublished, or its `franklin.delivery` mapping is stale.
2. **Blueprint page not delivery-enabled** — A page created directly in the Sites console (the new `demo/language-masters/en`) may lack the Edge Delivery config / template wiring (`cq:template`, `sling:resourceType`, or the EDS content-source config) that `franklin.delivery` needs to render it.
3. **Missing/incorrect Edge Delivery config on the branch** — The `demo/...` subtree may not inherit the `/conf` Edge Delivery Services cloud config that `main` expects.
4. **Transient service issue** — The endpoint occasionally 5xx's; a retry / different page rules this in or out.

---

## Checklist

### Phase A — Diagnose the UE "Unexpected Error" (do this first)
- [ ] Retry the exact URL once to rule out a transient service error
- [ ] Try opening a **known-good** page (e.g. an existing `en-us` page that previously worked in UE) — isolates path-specific vs. service-wide failure
- [ ] Open the **new demo page's** correct delivery URL: `.../franklin.delivery/pradeepgupta-eds/eds-xwalk-medtronic/main/demo/language-masters/en/index?cmd=open` (note: `demo/language-masters/en`, NOT `en-us`)
- [ ] In Sites console, confirm `demo/language-masters/en/index` actually exists and has content
- [ ] Check the page's **Edit → Properties → Cloud Services / Edge Delivery** config is present and points to the correct content source
- [ ] Confirm the demo page uses the same **template / resource type** as working `en-us` pages
- [ ] Verify the page (and its `demo` ancestors) are **published/previewed** so delivery can resolve them

### Phase B — Fix the resolution issue
- [ ] If path mismatch: open UE via the **correct demo path** (not `en-us`) — update any bookmarked URL
- [ ] If config missing: apply the Edge Delivery cloud config to the `demo` subtree (inherit from `main` / `en-us`)
- [ ] If template/resourceType wrong: recreate or repair the demo blueprint page from the same template as a working page
- [ ] If publish missing: publish/preview `demo/language-masters/en` tree, then retry `cmd=open`
- [ ] Re-open the demo page in UE and confirm it loads without the error

### Phase C — Pre-demo verification (read-only)
- [ ] Confirm the master `demo/language-masters/en` tree has 2–3 pages with authored blocks (so rollout/override is visible)
- [ ] Confirm the `demo/kr` (or `kr/ko`) destination parent path exists or can be created
- [ ] Confirm a **Rollout Configuration** is available (Standard, or custom locale config) under Tools → MSM / `/conf`

### Phase D — Create the Live Copy
- [ ] Sites console → select `demo/language-masters/en` → **Create → Live Copy**
- [ ] Set **Destination** = `demo/kr/ko`; title/name to match locale
- [ ] Choose **Include sub-pages**; assign **Rollout Configuration**
- [ ] Set rollout trigger to **manual/on-demand** (safer for translated locales)
- [ ] Finish wizard → verify the live copy tree under `demo/kr/ko`

### Phase E — Show initial inherited state
- [ ] Open the live copy in UE → **MSM overview** panel shows **Broken inheritance (0)** / **Deleted components (0)**
- [ ] Point out every component is linked to the master

### Phase F — Rollout from master (propagation demo)
- [ ] Edit a component (e.g. hero heading) on master `en` → save/publish
- [ ] Sites console → select `en` → **Rollout** → target `kr/ko`
- [ ] Reload live copy → confirm change propagated

### Phase G — Cancel inheritance / broken inheritance demo
- [ ] In live copy, select a component → **Cancel inheritance** → override locally (Korean text)
- [ ] Reopen MSM panel → component appears under **Broken inheritance**
- [ ] Explain overridden components are detached and protected from rollout

### Phase H — Re-synchronize / reset inheritance
- [ ] Select live copy → **Synchronize** → show override preserved
- [ ] (Optional) On component → **Reset inheritance** → snaps back to master value
- [ ] Confirm MSM panel returns to **Broken inheritance (0)**

### Phase I — Demo wrap-up talking points
- [ ] Summarize source→live-copy model; where rollout configs live (`/conf`)
- [ ] Note translation workflow: rollout brings new page structure down; translate only new/changed pages
- [ ] Confirm repo/EDS rendering is unaffected by MSM structure

---

## Notes

- **This error is an AEM author-side content/config issue**, not a repo code bug — the repo `fstab.yaml` mount is correct. Nothing here needs a code change to fix the UE open error.
- Quickest first test: open the **correct** demo delivery path (`demo/language-masters/en/index`) rather than the `en-us` URL in your screenshot — a stale/incorrect path is the single most common cause of this exact error.
- **Execution of AEM UI steps happens in the AEM author environment.** Execute mode is only needed if you want me to inspect/adjust repo files (e.g. verify `fstab.yaml`, `helix-query.yaml`, or the `kr-ko` locale route alignment).
