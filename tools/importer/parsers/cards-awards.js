/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-awards
 * Base block: cards
 * Source URL: https://www.medtronic.com/en-us/our-impact/impact-reporting.html
 * Generated: 2026-08-20
 *
 * Container block (Cards convention): first row = block name (added by
 * createBlock). Each subsequent row is one card with 2 cells matching the
 * `card` model (blocks/cards-awards/_cards-awards.json):
 *   Cell 1 -> image  <!-- field:image -->  (centered award logo; empty cell
 *             still included per convention if no image)
 *   Cell 2 -> text   <!-- field:text -->  (externally-linked title h4 + body p)
 *
 * The `image` field is `richtext` (DM/Scene7 rewrite compatible). Source cards
 * are `.cmp-teaser` inside `.multi-teaser-layout`. The instance selector
 * (#container-78f03a6dc7) also DOM-encloses a trailing CEO-dialogue promo
 * (#container-f890070efe → columns-promo-card); scoping teaser selection to
 * `.multi-teaser-layout .cmp-teaser` keeps that sibling block for its own
 * parser.
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());

  const scope = element.querySelector('.multi-teaser-layout') || element;
  const rows = [];

  scope.querySelectorAll('.cmp-teaser').forEach((teaser) => {
    const img = teaser.querySelector('.cmp-teaser__image img[src]');
    const desc = teaser.querySelector('.cmp-teaser__description, .cmp-teaser__content');

    // Cell 1: image (kept even when empty per Cards convention).
    const imageCell = [document.createComment(' field:image ')];
    if (img) imageCell.push(img.cloneNode(true));

    // Cell 2: text — linked award title (h4 > a) + body sentence (p).
    const textCell = [document.createComment(' field:text ')];
    if (desc) {
      const heading = desc.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading && heading.textContent.trim()) textCell.push(heading.cloneNode(true));
      desc.querySelectorAll('p').forEach((p) => {
        if (p.textContent.trim()) textCell.push(p.cloneNode(true));
      });
    }

    if (img || textCell.length > 1) rows.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (rows.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-awards', cells: rows });
  element.replaceWith(block);
}
