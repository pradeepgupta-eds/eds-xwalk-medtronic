# /en-us/ Homepage Re-Sync — Phase 1 Change List

Source re-scraped: `https://www.medtronic.com/en-us/index.html` (2026-09-18)
Scrape artifacts: `tools/importer/scrape-en-us-homepage/` (cleaned.html, screenshot.png, images/, metadata.json)

## Section-by-section diff (live now vs. existing migration)

| Section | Old block | Status | Change |
|---|---|---|---|
| Hero | `hero-video` (hero-main-content) | **CHANGED — new design** | New `hero-jon` single-card design: looping bg video `hp-hero-ras-bckgrnd-cnpt.mp4`, `hero-jon__card` with eyebrow "ROBOTIC-ASSISTED SURGERY", h2 "What's next in robotic-assisted surgery?", copy, Learn more CTA, media image `hp-hero-ras-cnpt.png`. |
| Spark banner | (freeform picture + text) | **CHANGED — new structured block** | Now `hero-banner-patients` → `award-banner`: media img `hp-spot-spark-scholars-cnpt.png`, eyebrow COMMUNITIES, headline "First 100 Medtronic Spark scholarships…", Learn more CTA to medtronicspark.com. |
| News-Media | `carousel-news` (#News-Media) | **CHANGED — content** | New news items/images: AiBLE/National Geographic (ROBOTIC-ASSISTED SURGERY), Patrick's story (RENAL DENERVATION), How technology is changing surgery (HEALTHCARE TECHNOLOGY), Altaviva (PELVIC HEALTH), Hearts of the wild (CONSERVATION), brain health/stroke, etc. |
| Who-We-Are | `columns-stats` (#who-we-are, dark) | **CHANGED — structure+content** | Now has right-content video `whoweare.mp4` + gif, and info-bar stats: 170+ Active clinical trials, 79M+ Patients served, $2.7B R&D investments, "Key Facts: FY25 data" link. Copy: "From the world's smallest pacemaker…". |
| CTA blueprint | `columns-cta` (wrapper-cta-banner, dark) | **~SAME** | "HEALTHCARE TECHNOLOGY / How a 1960s blueprint became tomorrow's health tech" — now wraps in a story link. |
| Our-Impact | `columns-impact` + `cards-stats` (#Our-Impact) | **CHANGED — access-card** | Intro "A healthy life. A healthy planet. For everyone." + 3 stat cards ($64M, 2.5M+, 60%) SAME. Trailing image replaced by an `access-card`: COMMUNITIES / "When health tech comes to your doorstep" / copy + See how CTA, img `hp-car-healthy-neighbor-hplif.jpg`. |
| Careers | `columns-promo` (#Careers) | **CHANGED — full section** | Now full careers-section: title "Careers that change lives", description, "Join the team" CTA, "Explore our Careers site", "Join our Talent Network", + job links (Sales/Engineering/IT) with icons. |
| Investors | `columns-promo` (#ShareHolder) | **CHANGED — full section** | Now full investors-section: copy "…driving diversified growth…", Learn more CTA to investorrelations, "Read our latest quarterly earnings", "See all quarterly results", + icons (Stock info, Company highlights, Upcoming events). |

## New blocks required
- `hero-jon` / `hero-jon__card` → new hero card block (bg video + card overlay).
- `hero-banner-patients` / `award-banner` → new banner block (media + eyebrow/headline/CTA).

## Blocks to update (content + structure + design)
- `carousel-news` — new items.
- `columns-stats` (who-we-are) — add stats info-bar + video.
- `columns-impact` / `cards-stats` (our-impact) — add access-card.
- `columns-promo` (careers) — full careers layout with job links.
- `columns-promo` (investors) — full investors layout with icons.

## Core page range in cleaned.html
Hero (~115.6k) → Investors end (~178k). Everything after is footer/global content.
