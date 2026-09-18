# Fix: Universal Editor "config.json could not be loaded (404)"

## Diagnosis

The Universal Editor loads path-mapping configuration from:
`https://main--eds-xwalk-medtronic--pradeepgupta-eds.aem.page/config.json`

I verified the state of your site:

- The **site itself renders fine** — the homepage returns `200` with the correct title *"EDS + Xwalk | Medtronic"*.
- **`config.json` genuinely returns `HTTP 404`** — matching the error shown in the editor.
- There is **no path-mapping config published** for this site.

**Root cause:** `config.json` is *not* a file in the git repo. It is generated and served by the AEM **Configuration Service** once a path-mapping configuration (`public.json`) is published for the site. That configuration was never set up for `eds-xwalk-medtronic`, so the endpoint 404s and the Universal Editor cannot resolve which content path (`/content/eds-xwalk-medtronic/en-us/index.html`) maps to which delivery path — hence "The requested content could not be loaded."

This is a **service configuration issue, not a code issue** — nothing in the repo needs to change.

## The Fix

Publish a path-mapping config to the Configuration Service via `admin.aem.page`. The config maps the AEM author content root to the public delivery root so the editor can resolve pages.

Target endpoint:
`https://admin.aem.page/config/pradeepgupta-eds/sites/eds-xwalk-medtronic/public.json`

Proposed mapping payload (maps content root → `/`, and DAM → `/assets/`):

```json
{
  "paths": {
    "mappings": [
      "/content/eds-xwalk-medtronic/:/",
      "/content/dam/eds-xwalk-medtronic/:/assets/"
    ],
    "includes": ["/content/eds-xwalk-medtronic/"],
    "excludes": []
  }
}
```

## Checklist

- [ ] Confirm the AEM author content root path (`/content/eds-xwalk-medtronic/` — matches the failing editor URL and the local `content/` tree)
- [ ] Confirm the mapping strategy (content root → `/`, DAM → `/assets/`)
- [ ] POST the `public.json` payload to `https://admin.aem.page/config/pradeepgupta-eds/sites/eds-xwalk-medtronic/public.json` (credentials injected automatically — no token needed in chat)
- [ ] Verify `config.json` now returns `200` at `https://main--eds-xwalk-medtronic--pradeepgupta-eds.aem.page/config.json`
- [ ] Verify the JSON body contains the expected `mappings`
- [ ] Reload the page in the Universal Editor and confirm `/en-us/index.html` opens without the "content could not be loaded" error
- [ ] If the POST returns `401`/`403`: instruct the user to enable **Settings → LLM Permissions → "Allow LLM to use my Adobe credentials for admin.hlx.page and Document Authoring uploads"**, then retry (no token pasted in chat)

## Notes / Prerequisites

- **Execution requires Execute mode** — the `curl`/`admin.aem.page` calls are write operations blocked in plan mode.
- **Credentials:** the POST needs the Adobe IMS credentials opt-in enabled. I will not accept a pasted token; if auth fails I'll point you to the Settings toggle.
- **No repo changes required** — I will not modify any files under `content/` or the block code for this fix.

One decision worth confirming before I execute:Confirmed: root mapping. Here's the finalized plan — execution requires Execute mode.

# Fix: Universal Editor "config.json could not be loaded (404)"

## Diagnosis

The Universal Editor loads path-mapping config from `https://main--eds-xwalk-medtronic--pradeepgupta-eds.aem.page/config.json`. Verified state:

- The **site renders fine** — homepage returns `200`, title *"EDS + Xwalk | Medtronic"*.
- **`config.json` returns `HTTP 404`** — matches the editor error exactly.
- No path-mapping configuration has ever been published for this site.

**Root cause:** `config.json` is **not** a repo file — it's generated and served by the AEM **Configuration Service** once a path-mapping config (`public.json`) is published for the site. It was never set up for `eds-xwalk-medtronic`, so the endpoint 404s and the editor can't resolve `/content/eds-xwalk-medtronic/en-us/index.html`. This is a **service configuration issue, not a code issue** — no repo files change.

## Decision (confirmed)

**Root mapping:** content root → `/`, DAM → `/assets/`. Payload to publish:

```json
{
  "paths": {
    "mappings": [
      "/content/eds-xwalk-medtronic/:/",
      "/content/dam/eds-xwalk-medtronic/:/assets/"
    ],
    "includes": ["/content/eds-xwalk-medtronic/"],
    "excludes": []
  }
}
```

## Checklist

- [ ] **Switch to Execute mode** (the `admin.aem.page` POST is a write op blocked in plan mode)
- [ ] POST the `public.json` payload to `https://admin.aem.page/config/pradeepgupta-eds/sites/eds-xwalk-medtronic/public.json` (credentials injected automatically — no token in chat)
- [ ] Verify `config.json` now returns `200` at `https://main--eds-xwalk-medtronic--pradeepgupta-eds.aem.page/config.json`
- [ ] Verify the JSON body contains the expected `mappings`
- [ ] Reload `/en-us/index.html` in the Universal Editor and confirm it opens without the "content could not be loaded" error
- [ ] If POST returns `401`/`403`: enable **Settings → LLM Permissions → "Allow LLM to use my Adobe credentials for admin.hlx.page and Document Authoring uploads"**, then retry (no token pasted in chat)

## Notes / Prerequisites

- **Credentials:** POST needs the Adobe IMS credentials opt-in. I will not accept a pasted token; if auth fails I'll point you to the Settings toggle.
- **No repo changes** — nothing under `content/` or block code is modified.
- **Execution requires Execute mode** — approve this plan to proceed.
