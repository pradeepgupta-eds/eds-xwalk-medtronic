/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-impact
 * Base block: columns
 * Source URL: https://www.medtronic.com/en-us/index.html
 * Generated: 2026-08-20
 *
 * Columns block: NO field hints (columns blocks use default content only).
 * Table = 1 name row + 1 content row with 2 cells:
 *   Cell 1 -> image (if present)
 *   Cell 2 -> eyebrow + headline + copy + CTA link
 *
 * Instances:
 *   #Our-Impact .our-impact-card  (text-only promo: eyebrow/headline/copy/cta)
 *   #Our-Impact .access-card      (image + eyebrow/headline/copy/cta)
 * Both share .eyebrow/.headline/.copy + .cta a structure.
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());

  const eyebrow = element.querySelector('.eyebrow');
  const headline = element.querySelector('.headline, h1, h2, h3');
  const copy = element.querySelector('.copy, p');
  const cta = element.querySelector('.cta a[href], a.link[href]');
  const img = element.querySelector('img[src]:not([src^="data:"])');

  const textCell = [];
  if (eyebrow) textCell.push(eyebrow.cloneNode(true));
  if (headline) textCell.push(headline.cloneNode(true));
  if (copy) textCell.push(copy.cloneNode(true));
  if (cta && cta.textContent.trim()) textCell.push(cta.cloneNode(true));

  // Empty-block guard
  if (textCell.length === 0 && !img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [['Columns Impact']];
  if (img) {
    cells.push([[img.cloneNode(true)], textCell]);
  } else {
    // No image: single content row still needs 2 cells (pad with empty).
    cells.push([textCell, ['']]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-impact', cells });
  element.replaceWith(block);
}
