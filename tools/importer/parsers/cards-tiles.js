/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-tiles
 * Base block: cards
 * Source URL: https://www.medtronic.com/en-us/our-company.html
 * Generated: 2026-08-20
 *
 * Container block (Cards convention): first row = block name (added by
 * createBlock). Each subsequent row is one tile with 2 cells matching the
 * `card` model:
 *   Cell 1 -> image  <!-- field:image -->  (the linked tile image)
 *   Cell 2 -> text   <!-- field:text -->  (a linked title derived from the
 *            image link href + alt/title text)
 *
 * Instance #container-eeba63a201 holds 4 icon-link tiles: Key Facts,
 * Locations, Leadership, History. Each tile is a .cmp-image whose
 * a.cmp-image__link wraps an <img> carrying the label in alt/title. There is
 * no separate title element, so the tile label is reconstructed as a linked
 * heading in the text cell to preserve navigation + label.
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());

  // Resolve a real src for lazy-loaded images; keep the element so its
  // alt/title label survives even when only a data: placeholder is present.
  const resolveImg = (img) => {
    if (!img) return null;
    const src = img.getAttribute('src') || '';
    if (src && !src.startsWith('data:')) return img;
    const lazy = img.getAttribute('data-src')
      || img.getAttribute('data-original')
      || img.getAttribute('data-lazy-src')
      || (img.getAttribute('data-srcset') || '').split(/\s|,/)[0];
    if (lazy) { img.setAttribute('src', lazy); return img; }
    return null; // no recoverable real URL (lazy, below-the-fold)
  };

  const rows = [];

  element.querySelectorAll('.cmp-image').forEach((tile) => {
    const link = tile.querySelector('a.cmp-image__link[href], a[href]');
    const rawImg = tile.querySelector('img');
    if (!rawImg && !link) return;

    // Label lives on the img alt/title (read before any src resolution so it
    // is available even for lazy placeholders); fall back to link text.
    const label = (rawImg && (rawImg.getAttribute('alt') || rawImg.getAttribute('title'))
      || (link && link.textContent.trim())
      || '').trim();

    const img = resolveImg(rawImg);

    const imageCell = [document.createComment(' field:image ')];
    if (img) imageCell.push(img.cloneNode(true));

    const textCell = [document.createComment(' field:text ')];
    if (label) {
      const h = document.createElement('h3');
      if (link && link.getAttribute('href')) {
        const a = document.createElement('a');
        a.setAttribute('href', link.getAttribute('href'));
        a.textContent = label;
        h.appendChild(a);
      } else {
        h.textContent = label;
      }
      textCell.push(h);
    }

    rows.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (rows.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tiles', cells: rows });
  element.replaceWith(block);
}
