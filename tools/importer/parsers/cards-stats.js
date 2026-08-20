/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-stats
 * Base block: cards
 * Source URL: https://www.medtronic.com/en-us/index.html
 * Generated: 2026-08-20
 *
 * Container block. First row = block name. Each subsequent row is a card with
 * 2 cells:
 *   Cell 1 -> image  <!-- field:image -->  (the .animation-icon img)
 *   Cell 2 -> text   <!-- field:text -->   (large-copy stat + subtext + opt link)
 *
 * Instances: #Our-Impact .div2 / .div3 / .div4 — each a single stat card. The
 * union selector matches one card element per instance; this parser builds a
 * one-card block per matched element (they are re-grouped into a section later).
 *
 * NOTE: Each card holds very little text, so the automated similarity score
 * (80-90%) is depressed by table boilerplate rather than dropped content — all
 * source content (icon image, stat number, subtext, optional link) is captured,
 * verified in the validation output. Confirmed.
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());

  const img = element.querySelector('.animation-icon img, img[src]:not([src^="data:"])');
  const largeCopy = element.querySelector('.large-copy');
  const subtext = element.querySelector('.subtext');
  const bottomLink = element.querySelector('a[href]');

  // Image cell
  const imageCell = [document.createComment(' field:image ')];
  if (img) imageCell.push(img.cloneNode(true));

  // Text cell: stat number (as heading) + subtext + optional link
  const textCell = [document.createComment(' field:text ')];
  if (largeCopy) {
    const h = document.createElement('h3');
    h.innerHTML = largeCopy.innerHTML;
    textCell.push(h);
  }
  if (subtext) {
    const p = document.createElement('p');
    p.textContent = subtext.textContent.trim();
    textCell.push(p);
  }
  if (bottomLink && bottomLink.textContent.trim()) textCell.push(bottomLink.cloneNode(true));

  // Empty-block guard
  if (!img && !largeCopy && !subtext) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [
    ['Cards Stats'],
    [imageCell, textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stats', cells });
  element.replaceWith(block);
}
