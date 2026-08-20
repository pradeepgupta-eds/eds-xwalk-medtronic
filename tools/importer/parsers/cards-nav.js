/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-nav
 * Base block: cards
 * Source URL: https://www.medtronic.com/en-us/healthcare-professionals.html
 *             (also: /healthcare-professionals/specialties.html — 20 tiles, same markup)
 * Generated: 2026-08-20
 *
 * Container block (Cards convention): first row = block name (added by
 * createBlock). Each subsequent row is one card with 2 cells matching the
 * `card` model (blocks/cards-nav/_cards-nav.json):
 *   Cell 1 -> image  <!-- field:image -->  (EMPTY for nav tiles — no image —
 *             but the cell is still included per Cards convention)
 *   Cell 2 -> text   <!-- field:text -->   (a single linked heading)
 *
 * Source: white bordered link tiles with a blue left-accent bar. Each tile is
 * `.teaser.title-electric-blue.small-title` → `.cmp-teaser` whose only content
 * is `h2.cmp-teaser__title > a.cmp-teaser__title-link` (a linked heading; no
 * image, no description). The instance selector is `div.multi-teaser-layout`
 * so extraction is scoped to that grid.
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());

  const rows = [];

  element.querySelectorAll('.cmp-teaser').forEach((teaser) => {
    const title = teaser.querySelector('.cmp-teaser__title');
    if (!title || !title.textContent.trim()) return;

    // Cell 1: image — empty for nav tiles, but included per Cards convention.
    const imageCell = [document.createComment(' field:image ')];

    // Cell 2: text — the linked heading (preserve the <a> href).
    const textCell = [document.createComment(' field:text ')];
    const h = document.createElement('h3');
    h.innerHTML = title.innerHTML;
    textCell.push(h);

    rows.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (rows.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-nav', cells: rows });
  element.replaceWith(block);
}
