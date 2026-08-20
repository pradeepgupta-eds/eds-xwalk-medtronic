/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-logos
 * Base block: cards
 * Source URL: https://www.medtronic.com/en-us/healthcare-professionals/specialties/acute-care-monitoring.html
 * Generated: 2026-08-20
 *
 * Container block (Cards convention): first row = block name (added by
 * createBlock). Each subsequent row is one logo card with 2 cells matching the
 * `card` model (blocks/cards-logos/_cards-logos.json):
 *   Cell 1 -> image  <!-- field:image -->  (partner logo, optionally wrapped in
 *             a link)
 *   Cell 2 -> text   <!-- field:text -->   (EMPTY for a logo-only wall — no
 *             title/description — but the cell is still included per convention)
 *
 * `image` is richtext (DM/Scene7 compatible). Source: `#container-17635c9628`
 * holds per-logo column containers, each `.image > .cmp-image` with a single
 * `img` (some logos wrapped in `a.cmp-image__link`). A leading "Partners in
 * patient safety" h2 + intro + "Our partners include:" h3 is section-level
 * default content and intentionally not part of any logo card.
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());

  const rows = [];

  element.querySelectorAll('.cmp-image').forEach((cmpImage) => {
    const img = cmpImage.querySelector('img[src]');
    if (!img) return;

    // Cell 1: image — preserve an enclosing link if present.
    const imageCell = [document.createComment(' field:image ')];
    const link = cmpImage.querySelector('a.cmp-image__link[href], a[href]');
    if (link) {
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.append(img.cloneNode(true));
      imageCell.push(a);
    } else {
      imageCell.push(img.cloneNode(true));
    }

    // Cell 2: text — empty for a logo-only wall, but included per convention.
    const textCell = [document.createComment(' field:text ')];

    rows.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (rows.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-logos', cells: rows });
  element.replaceWith(block);
}
