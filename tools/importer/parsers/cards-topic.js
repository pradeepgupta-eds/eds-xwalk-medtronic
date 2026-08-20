/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-topic
 * Base block: cards
 * Source URL: https://www.medtronic.com/en-us/our-company.html
 * Generated: 2026-08-20
 *
 * Container block (Cards convention): first row = block name (added by
 * createBlock). Each subsequent row is one card with 2 cells matching the
 * `card` model:
 *   Cell 1 -> image  <!-- field:image -->  (empty cell still included if none)
 *   Cell 2 -> text   <!-- field:text -->  (pretitle eyebrow + linked heading)
 *
 * Instance #container-0a7ecc757b holds 5 topic teasers (.cmp-teaser):
 * Healthcare technology, Patients & caregivers, Healthcare professionals,
 * Newsroom, Our mission — plus a trailing CEO quotation (.quotations) which is
 * emitted as a final card (image = Geoff Martha portrait, text = quote + attr).
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());

  const resolveImg = (img) => {
    if (!img) return null;
    const src = img.getAttribute('src') || '';
    if (src && !src.startsWith('data:')) return img;
    const lazy = img.getAttribute('data-src')
      || img.getAttribute('data-original')
      || img.getAttribute('data-lazy-src')
      || (img.getAttribute('data-srcset') || '').split(/\s|,/)[0];
    if (lazy) { img.setAttribute('src', lazy); return img; }
    return null;
  };

  const rows = [];

  // Topic teasers -> one card each.
  element.querySelectorAll('.cmp-teaser').forEach((teaser) => {
    const img = resolveImg(teaser.querySelector('.cmp-teaser__image img'));
    const content = teaser.querySelector('.cmp-teaser__content');

    const imageCell = [document.createComment(' field:image ')];
    if (img) imageCell.push(img.cloneNode(true));

    const textCell = [document.createComment(' field:text ')];
    if (content) {
      const pretitle = content.querySelector('.cmp-teaser__pretitle');
      const title = content.querySelector('.cmp-teaser__title');
      if (pretitle && pretitle.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = pretitle.textContent.trim();
        textCell.push(p);
      }
      if (title && title.textContent.trim()) {
        // Preserve the heading and its link.
        const h = document.createElement('h3');
        h.innerHTML = title.innerHTML;
        textCell.push(h);
      }
    }
    if (img || textCell.length > 1) rows.push([imageCell, textCell]);
  });

  // Trailing CEO quotation -> final card.
  const quote = element.querySelector('.quotations .quote, .quotations blockquote');
  if (quote) {
    const qImg = resolveImg(element.querySelector('.quotations .image img'));
    const bq = element.querySelector('.quotations blockquote') || quote;

    const imageCell = [document.createComment(' field:image ')];
    if (qImg) imageCell.push(qImg.cloneNode(true));

    const textCell = [document.createComment(' field:text ')];
    if (bq && bq.textContent.trim()) textCell.push(bq.cloneNode(true));

    if (qImg || textCell.length > 1) rows.push([imageCell, textCell]);
  }

  // Empty-block guard.
  if (rows.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-topic', cells: rows });
  element.replaceWith(block);
}
