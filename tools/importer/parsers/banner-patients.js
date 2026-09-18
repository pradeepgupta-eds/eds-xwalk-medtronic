/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: banner-patients
 * Base block: block (block/v1/block)
 * Source URL: https://www.medtronic.com/en-us/index.html
 *
 * Full-width promo banner directly below the hero (#hero-banner-patients >
 * .award-banner): collage image on the left, eyebrow + headline + CTA on the
 * right. Flat model (image, imageAlt, text) — one field per ROW (single cell),
 * matching the working hero-video pattern so md2jcr maps content to the model.
 *   Row 1 -> field:image (collage image)
 *   Row 2 -> field:text  (eyebrow + headline + CTA link)
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());

  const banner = element.querySelector('.award-banner') || element;

  const img = banner.querySelector('.award-banner__media img[src]:not([src^="data:"])')
    || banner.querySelector('img[src]:not([src^="data:"])');

  const textWrap = banner.querySelector('.award-banner__text') || banner;
  const eyebrow = textWrap.querySelector('.eyebrow');
  const headline = textWrap.querySelector('.headline, h1, h2, h3, h4');
  const cta = textWrap.querySelector('a.cta[href], a.link[href], a[href]');

  const textCell = [];
  if (eyebrow && eyebrow.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = eyebrow.textContent.trim();
    textCell.push(p);
  }
  if (headline && headline.textContent.trim()) {
    const h = document.createElement('h3');
    h.textContent = headline.textContent.trim();
    textCell.push(h);
  }
  if (cta && cta.getAttribute('href')) {
    const link = cta.cloneNode(true);
    link.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    // keep just the label text + href (drop nested arrow icon markup)
    const label = link.textContent.trim();
    const a = document.createElement('a');
    a.setAttribute('href', cta.getAttribute('href'));
    a.textContent = label || 'Learn more';
    const p = document.createElement('p');
    p.appendChild(a);
    textCell.push(p);
  }

  // Empty-block guard
  if (!img && textCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Image row — hinted cell with the image, or a plain empty cell (no comment).
  if (img) {
    cells.push([[document.createComment(' field:image '), img.cloneNode(true)]]);
  } else {
    cells.push(['']);
  }
  // Text row.
  cells.push([[document.createComment(' field:text '), ...textCell]]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'banner-patients', cells });
  element.replaceWith(block);
}
