/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-feature
 * Base block: cards
 * Source URL: https://www.medtronic.com/en-us/healthcare-professionals/specialties/acute-care-monitoring.html
 * Generated: 2026-08-20
 * Used by two sections on the specialty-detail page (education, investing).
 *
 * Container block (Cards convention): first row = block name (added by
 * createBlock). Each subsequent row is one feature/pillar card with 2 cells
 * matching the `card` model (blocks/cards-feature/_cards-feature.json):
 *   Cell 1 -> image  <!-- field:image -->  (circular-cropped image; empty cell
 *             still included if absent)
 *   Cell 2 -> text   <!-- field:text -->   (h3 heading, description, optional
 *             pill-btn CTA link)
 *
 * `image` is richtext (DM/Scene7 compatible). Source: feature cards are the
 * per-card column containers (`.cmp-container` grids holding `.image` +
 * `.text`) inside the inner grid. Leading section content — a "Download
 * portfolio brochure" pill and an "Education that empowers patient care" h2 +
 * intro paragraph — is section-level default content and intentionally not part
 * of any card row (those `.text` blocks are NOT paired with an image inside the
 * same grid).
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());

  const rows = [];

  // A feature card = a cmp-container whose grid directly holds an image and text.
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

    // Cell 1: image (kept even if empty per Cards convention).
    const imageCell = [document.createComment(' field:image ')];
    if (img) imageCell.push(img.cloneNode(true));

    // Cell 2: text — heading + description + optional CTA. Preserve pill-btn
    // links but unwrap the decorative span so the anchor carries the label.
    const textCell = [document.createComment(' field:text ')];
    if (textBlock) {
      Array.from(textBlock.children).forEach((node) => {
        if (!node.textContent.trim()) return;
        const clone = node.cloneNode(true);
        clone.querySelectorAll('a .pill-btn, a span.pill-btn').forEach((span) => {
          span.replaceWith(...span.childNodes);
        });
        textCell.push(clone);
      });
    }

    if (img || textCell.length > 1) rows.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (rows.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells: rows });
  element.replaceWith(block);
}
