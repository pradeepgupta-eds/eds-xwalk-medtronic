/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Medtronic section boundaries.
 * Inserts section breaks (<hr>) between the 7 body sections and Section Metadata
 * blocks for styled sections (who-we-are, cta-blueprint -> style "dark").
 *
 * Section selectors are read from payload.template.sections (page-templates.json),
 * each verified unique in migration-work/cleaned.html:
 *   hero          -> div.hero-main-content   (line 1487)
 *   news-media    -> #News-Media             (line 1556)
 *   who-we-are    -> #who-we-are  [dark]     (line 1691)
 *   cta-blueprint -> div.wrapper-cta-banner  (line 1735)
 *   our-impact    -> #Our-Impact             (line 1759)
 *   careers       -> #Careers                (line 1818)
 *   investors     -> #ShareHolder            (line 1880)
 *
 * Both hooks are used per the reference: breaks are inserted in beforeTransform
 * (while every section element still exists, before parsers replace them), and
 * Section Metadata blocks are inserted in afterTransform anchored to a marker <hr>.
 * Sections are iterated in reverse so live-element inserts never disturb the
 * positions of sections not yet processed.
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      // First section gets no leading break; skip entirely if it also has no style.
      if (i === 0 && !section.style) continue;

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue; // selector didn't match on this page — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove();
      }
    }
  }
}
