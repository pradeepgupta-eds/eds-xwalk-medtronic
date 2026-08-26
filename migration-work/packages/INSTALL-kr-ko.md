# kr-ko Content Package — Install & Publish

**Package:** `migration-work/packages/eds-xwalk-medtronic-kr-ko.zip` (471 KB)
**Pages:** 111 kr-ko pages as JCR `cq:Page` nodes
**Target:** `/content/eds-xwalk-medtronic/kr-ko` (parallel to `/en-us`)

## Why manual install
This is an author-backed xwalk project (`fstab.yaml` → `author-p25321-e1006616.adobeaemcloud.com`).
The author instance requires HTTP Basic auth (`WWW-Authenticate: Basic realm="Sling (Development)"`).
The enabled Adobe IMS opt-in authenticates the Edge Delivery admin layer (`admin.hlx.page` preview
POST returns 200) but is **not** sent to the author instance, so `crx/packmgr` returns 401 from the
agent environment. Installing via the Package Manager UI (browser session already authenticated)
avoids this.

## Step 1 — Install package (AEM Package Manager)
1. Open `https://author-p25321-e1006616.adobeaemcloud.com/crx/packmgr/index.jsp`
2. **Upload Package** → choose `eds-xwalk-medtronic-kr-ko.zip` → Upload
3. Click **Install** on the uploaded package
4. Verify the tree appears under `/content/eds-xwalk-medtronic/kr-ko` (Sites console)

## Step 2 — Preview & publish (Edge Delivery admin)
Once content is in author, publish via the admin API (agent CAN do this — admin.hlx auth works),
or trigger from the browser. Bulk preview + live:

```bash
# For each path in tools/importer/urls-kr-ko-content.txt (strip domain, .html):
#   POST https://admin.hlx.page/preview/pradeepgupta-eds/eds-xwalk-medtronic/main/<path>
#   POST https://admin.hlx.page/live/pradeepgupta-eds/eds-xwalk-medtronic/main/<path>
```

After Step 1, tell the agent "content is installed, run preview+publish" and it will bulk-preview
and publish all kr-ko paths via admin.hlx.page (that credential is working).

## Verification
- Preview: `https://main--eds-xwalk-medtronic--pradeepgupta-eds.aem.page/kr-ko/index`
- Live: `https://main--eds-xwalk-medtronic--pradeepgupta-eds.aem.live/kr-ko/index`

## Notes
- 111 of 118 pages included. 7 pages (homepage `index`, `c/estore`, 5 obesity pages) lack JCR
  conversion from this session's pipeline — regenerate before a follow-up package, or they can be
  added in the block-heavy refinement pass.
- ~39 block-heavy pages are present as default-content (thin); flagged for richer block treatment later.
