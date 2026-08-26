# kr-ko Migration — Coverage Report

**Sitemap:** https://www.medtronic.com/kr-ko/sitemap.xml
**Total URLs in sitemap:** 127 (flat URL set, no nested sitemaps)
**Utility/system pages excluded (per decision):** 9
**Content pages in scope:** ~118

## Utility pages EXCLUDED
- errors/404
- terms-of-use
- privacy-statement
- search-results
- eifu/PA99-1427
- e/governance, e/governance/vyc
- ciam-help, ciam-help-stage

## Template buckets

### Reuses existing en-US templates (~43 pages)
| Bucket | Count | Existing template | Notes |
|---|---|---|---|
| homepage (index) | 1 | `homepage` | verify selectors on kr-ko |
| our-company (core) | ~15 | `our-company` | excludes press/* |
| our-impact | 8 | `our-impact` + `impact-reporting` | impact-reporting.html → impact-reporting |
| healthcare-professionals | 1 | `healthcare-professionals` | landing only; no specialties/detail pages exist in kr-ko |

### Requires NEW templates (~75 pages)
| Bucket | Count | New template needed | Reuse candidates |
|---|---|---|---|
| about/news/* | 30 | `news-article` + `news-listing` | cards-articles, hero-banner |
| our-company/press/* | 18 | `press-release` (may share with news-article) | cards-articles, hero-banner |
| patients/* | 20 | `patient-condition` / `patient-treatment` | hero-banner, columns-*, cards-* |
| c/* (campaigns) | 20 | `campaign-landing` | hero-*, columns-*, cards-* |
| about/* (non-news: about, contact-us, notice) | ~5 | reuse our-company or simple content | columns-*, cards-* |

### Unused en-US templates (no kr-ko pages)
- `specialties`
- `specialty-detail`

## Key finding
"Assume same as en-US" holds only for ~43/127 pages. The dominant content types on kr-ko
(news articles, press releases, patient education, campaign landings) have no en-US template
and require new blocks/parsers before import. Decision taken: build new templates, reusing
existing blocks maximally.
