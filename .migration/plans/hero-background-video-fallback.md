# Hero Background: Video with Image Fallback

Replace the CSS `linear-gradient` on the desktop `.hero-video-container .hero-video-wrapper` with a real full-bleed **looping background video + image fallback** behind the white hero card, matching the live Medtronic ocean/sky hero. Confirmed: **video with image poster/fallback**, and **you will provide the asset file(s)**.

## Confirmed decisions
- **Media type:** Looping muted background video, with the attached ocean/sky image as poster/fallback (and gradient as ultimate fallback if neither loads).
- **Asset source:** You will provide the file(s). I'll place them in the repo and reference them.

## Current state (from `blocks/hero-video/hero-video.css`)
- `.hero-video-container .hero-video-wrapper` uses a layered `linear-gradient` (approximation) as the full-bleed background; there is no `<video>`/image element behind the card.
- The white card (`.hero-video`) sits centered over that band; desktop refinements live in the `@media (width >= 900px)` block.
- `blocks/hero-video/hero-video.js` currently promotes an authored video *link* to a `.hero-video-bg` `<video>` if present, but the homepage content has no such link — so nothing renders and the gradient shows.

## Assets needed from you (place in repo, then tell me the filenames)
- [ ] **Video:** a looping, muted, web-optimized `.mp4` (e.g. `blocks/hero-video/hero-bg.mp4`) — the ocean/sky clip. Keep it reasonably small (H.264, no audio) for LCP/perf.
- [ ] **Image fallback/poster:** the attached ocean/sky photo as an optimized `.jpg`/`.webp` (e.g. `blocks/hero-video/hero-bg.jpg`). Used as the `<video poster>` and as the background when video can't play.
- Drop them in `blocks/hero-video/` (committed assets must be optimized/size-checked per project rules) and confirm the exact filenames.

## Approach
### Phase 1 — Add the background media layer
- [ ] Inject a full-bleed `<video class="hero-video-bg" autoplay muted loop playsinline poster="…hero-bg.jpg">` with an `<source>` pointing at the provided `.mp4`, positioned behind the card inside `.hero-video-wrapper` (via `hero-video.js` decorate, or a static element — decide based on how the block is authored)
- [ ] Ensure the video covers the band: absolutely positioned, `width/height:100%`, `object-fit:cover`, `z-index` below the card; card gets `position:relative; z-index:1`

### Phase 2 — CSS: replace gradient with media + fallback
- [ ] On `.hero-video-container .hero-video-wrapper`: keep `max-width:none; margin:0; padding`, set `position:relative; overflow:hidden`, and set **`background-image: url(hero-bg.jpg)` with `background-size:cover; background-position:center`** as the image fallback (shown until/if the video plays, and if the video fails)
- [ ] Keep the existing gradient only as a last-resort fallback color layer (or drop it if the image fallback is sufficient) — no more gradient-as-primary
- [ ] Style `.hero-video-bg` (cover, centered, behind card); confirm the white card and its text/CTA remain fully legible over the photo

### Phase 3 — Scope, perf & fallback behavior
- [ ] Apply the video only where intended (desktop `≥900px` per the request; decide whether mobile keeps the image only for perf) and confirm mobile still renders correctly
- [ ] Muted + `playsinline` so it autoplays on mobile browsers without going fullscreen; `preload` set sensibly for LCP
- [ ] Verify graceful fallback: no video → poster image; reduced-motion users → static image (respect `prefers-reduced-motion`)

### Phase 4 — Verify & QA (local preview)
- [ ] Preview `http://localhost:3000/content/en-us/index` at desktop: video plays full-bleed behind the card, card legible, no layout shift
- [ ] Confirm image fallback shows if video is removed/blocked; check mobile rendering
- [ ] `npm run lint` clean; changes scoped to `blocks/hero-video/` only; committed assets optimized

## Checklist
- [ ] Assets received (video + image) and placed in `blocks/hero-video/` with confirmed filenames
- [ ] Background video element added behind the hero card (autoplay/muted/loop/playsinline + poster)
- [ ] Wrapper CSS switched from gradient to image-fallback + video layer; card stays legible
- [ ] Perf/fallback handled (reduced-motion, mobile, no-video fallback); lint clean; scoped to hero-video

## Notes
- **Blocked on assets:** I can wire the `<video>` + CSS immediately, but I need the actual `.mp4` (and image) file in the repo to reference — the chat-preview image can't be used directly. Tell me the filenames once dropped in `blocks/hero-video/`.
- Committed media must be optimized and size-checked (EDS perf guidance); large hero video harms LCP — a short, compressed loop is best.
- Header **code**/asset deploys via git; the deployed `aem.page` won't reflect this until pushed (same content-vs-code split as prior rounds). Fix + verify locally this round.
- **Execution requires Execute mode** — approve to proceed (and provide the asset filenames).
