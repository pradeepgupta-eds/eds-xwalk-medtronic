# Fix: Universal Editor "config.json could not be loaded (404)"

## Diagnosis

The Universal Editor fails to open `/content/eds-xwalk-medtronic/en-us/index.html` with:

> Path Mapping config `https://main--eds-xwalk-medtronic--pradeepgupta-eds.aem.page/config.json` could not be loaded: HTTP/1.1 404 Not Found

**What this means:** The editor needs a *path-mapping config* to translate the AEM author content path (`/content/eds-xwalk-medtronic/...`) into the public delivery path. It fetches that mapping from `config.json` at the delivery origin. That endpoint is returning **404**, so the editor can't resolve the page — hence "The requested content could not be loaded."

**Root cause:** `config.json` is **not** a file in the git repo. It is generated and served by the AEM **Configuration Service** once a path-mapping configuration (`public.json`) has been published for the site. That config was never set up for `eds-xwalk-medtronic`, so the endpoint 404s.

This is a **service configuration issue, not a code issue** — nothing under `content/`, block code, or repo files needs to change. (Confirmed from repo state: `fstab.yaml` mounts `/` to the AEM author markup endpoint for `pradeepgupta-eds/eds-xwalk-medtronic/main` — a crosswalk project — and there is no `config.json`/`paths.json` in the repo.)

## Decision (confirmed from prior planning)

**Root mapping:** content root → `/`, DAM → `/assets/`. This is consistent with the site: the delivery homepage renders at the root (`/index.html`), so `/content/eds-xwalk-medtronic/en-us/index.html` should map to `/en-us/index.html`.

Payload to publish:

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

- [ ] **Switch to Execute mode** — the verification `curl`s and the `admin.aem.page` POST are blocked in plan mode
- [ ] Re-verify current state: confirm `config.json` returns `404` and the homepage returns `200` at `https://main--eds-xwalk-medtronic--pradeepgupta-eds.aem.page/`
- [ ] POST the `public.json` payload to `https://admin.aem.page/config/pradeepgupta-eds/sites/eds-xwalk-medtronic/public.json` (credentials injected automatically — no token in chat)
- [ ] Verify `config.json` now returns `200` at `https://main--eds-xwalk-medtronic--pradeepgupta-eds.aem.page/config.json`
- [ ] Verify the JSON body contains the expected `mappings`
- [ ] Reload `/en-us/index.html` in the Universal Editor and confirm it opens without the "content could not be loaded" error
- [ ] If the POST returns `401`/`403`: enable **Settings → LLM Permissions → "Allow LLM to use my Adobe credentials for admin.hlx.page and Document Authoring uploads"**, then retry

## Notes / Prerequisites

- **Credentials:** The POST needs the Adobe IMS credentials opt-in. I will not accept a pasted token; if auth fails, I'll point you to the Settings toggle rather than ask for a secret.
- **No repo changes** — nothing under `content/` or block code is modified by this fix.
- **Execution requires Execute mode** — approve this plan (or switch modes) and I'll run the verification and publish steps.
