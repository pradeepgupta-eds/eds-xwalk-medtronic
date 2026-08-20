/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-promo-card
 * Base block: columns
 * Source URL: https://www.medtronic.com/en-us/our-company.html
 * Generated: 2026-08-20
 *
 * Columns block. Library convention: first row = block name (added by
 * createBlock), second row = N column cells. Per the field-hinting rules,
 * Columns blocks must NOT contain field:xyz comments — cells hold default
 * content only.
 *
 * Layout: 2 columns, 1 content row.
 *   Col 1 = a linked promo image (a.cmp-image__link > img).
 *   Col 2 = eyebrow (demi text) + heading (h3) + "Learn more" CTA link.
 *
 * Two instances: #container-3c577964f4 (Medtronic Stories) and
 * #container-9c8bea0160 (Our impact). Both share the same inner structure.
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  // Remove decorative data-URI arrow icons inside CTA links.
  element.querySelectorAll('.icon').forEach((n) => n.remove());

  // Recover a real src for lazy-loaded images (live page uses a data: URI
  // placeholder with the real URL kept in a data-* attribute).
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

  // Column 1: the promo image (skip decorative data-URI arrows).
  const imageWrap = element.querySelector('.cmp-image');
  const imageCell = [];
  if (imageWrap) {
    const candidate = Array.from(imageWrap.querySelectorAll('img'))
      .find((im) => !/(icon|arrow)/i.test(im.className));
    const img = resolveImg(candidate);
    if (img) imageCell.push(img.cloneNode(true));
  }

  // Column 2: eyebrow + heading + CTA, in document order.
  const contentCell = [];
  const eyebrow = element.querySelector('.text-eyebrow-default .cmp-text');
  const heading = element.querySelector('.text-heading-small .cmp-text h3, .text-heading-small h3');
  const ctaLink = element.querySelector('.text .cmp-text p a[href], .text .cmp-text a[href]');

  if (eyebrow) {
    const p = document.createElement('p');
    p.innerHTML = eyebrow.innerHTML;
    contentCell.push(p);
  }
  if (heading) contentCell.push(heading.cloneNode(true));
  if (ctaLink && ctaLink.textContent.trim()) {
    const p = document.createElement('p');
    p.appendChild(ctaLink.cloneNode(true));
    contentCell.push(p);
  }

  // Empty-block guard.
  if (imageCell.length === 0 && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // 2-column, single content row. No field comments (Columns block).
  const cells = [
    [imageCell.length ? imageCell : '', contentCell.length ? contentCell : ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo-card', cells });
  element.replaceWith(block);
}
