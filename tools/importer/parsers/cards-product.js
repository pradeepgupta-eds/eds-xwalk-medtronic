/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-product
 * Base block: cards
 * Source URL: https://www.medtronic.com/en-us/healthcare-professionals/specialties/acute-care-monitoring.html
 * Generated: 2026-08-20
 *
 * Container block (Cards convention): first row = block name (added by
 * createBlock). Each subsequent row is one product card with 2 cells matching
 * the `card` model (blocks/cards-product/_cards-product.json):
 *   Cell 1 -> image  <!-- field:image -->  (product thumbnail; empty cell still
 *             included if absent)
 *   Cell 2 -> text   <!-- field:text -->   (product name <strong>, description,
 *             and the "Learn more" CTA link)
 *
 * `image` is richtext (DM/Scene7 compatible). Source: `#container-2e4c02d814`
 * holds per-product column containers (`.container.responsivegrid.pad-left.pad-right`
 * → `.cmp-container` grid with `.image`, `.text`, `.button`). A leading
 * "Featured products" h2 is section-level default content and is intentionally
 * not part of any card row.
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());

  const rows = [];

  // A product card = a cmp-container whose grid directly holds an image and text.
  const cards = Array.from(element.querySelectorAll('.cmp-container')).filter((c) => {
    const grid = c.querySelector(':scope > .aem-Grid');
    if (!grid) return false;
    const hasImage = grid.querySelector(':scope > .image');
    const hasText = grid.querySelector(':scope > .text');
    return hasImage && hasText;
  });

  cards.forEach((card) => {
    const img = card.querySelector('.image img[src]');
    const textBlock = card.querySelector('.text .cmp-text');
    const cta = card.querySelector('.button a[href], a.cmp-button[href]');

    // Cell 1: image (kept even if empty per Cards convention).
    const imageCell = [document.createComment(' field:image ')];
    if (img) imageCell.push(img.cloneNode(true));

    // Cell 2: text — product name + description + Learn more CTA.
    const textCell = [document.createComment(' field:text ')];
    if (textBlock) {
      textBlock.querySelectorAll('p').forEach((p) => {
        if (p.textContent.trim()) textCell.push(p.cloneNode(true));
      });
    }
    if (cta && cta.textContent.trim()) {
      const a = document.createElement('a');
      a.setAttribute('href', cta.getAttribute('href'));
      const label = cta.querySelector('.cmp-button__text');
      a.textContent = (label ? label.textContent : cta.textContent).trim();
      const p = document.createElement('p');
      p.append(a);
      textCell.push(p);
    }

    if (img || textCell.length > 1) rows.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (rows.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells: rows });
  element.replaceWith(block);
}
