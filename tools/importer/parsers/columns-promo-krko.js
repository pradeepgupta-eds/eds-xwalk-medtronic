/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the Medtronic kr-ko `columns-promo` variant.
 * Base block: columns-promo (Columns block — per field-hinting rules, Columns
 * blocks carry NO field comments; cells hold default content only).
 * Source markup: classic AEM promo hero panels, e.g.
 *   `.dark.med-hero.hero-module` (#slide-5/#slide-7) and
 *   `.lg-hero.hero-module:not(.active-slide)` (#slide-8). Each panel holds:
 *     - eyebrow    : .text.eyebrow2 .cmp-text > p        ("OUR IMPACT" / "CAREERS")
 *     - label/head : .cmp-text > p / > h4               (title + supporting copy)
 *     - image      : .cmp-image img (optional decorative eyebrow bar / photo)
 *     - CTA        : a.cmp-button (label .cmp-button__text)
 * Rendered as a Columns block: an optional image column + a text column (the
 * block's decorate() detects the image cell and promotes a photo to a
 * full-bleed background). Single row (block model default rows=1).
 * Generated: 2026-08-26.
 */

function cleanButton(a, document) {
  const href = a.getAttribute('href');
  const txt = (a.querySelector('.cmp-button__text')?.textContent || a.textContent || '').trim();
  if (!txt) return null;
  const p = document.createElement('p');
  if (href) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = txt;
    p.append(link);
  } else {
    p.textContent = txt;
  }
  return p;
}

export default function parse(element, { document }) {
  const img = element.querySelector('.cmp-image img, img.cmp-image__image');

  const textNodes = [];
  element
    .querySelectorAll('.cmp-text > p, .cmp-text > h1, .cmp-text > h2, .cmp-text > h3, .cmp-text > h4, .cmp-text > h5, .cmp-text > h6, .cmp-title__text')
    .forEach((el) => textNodes.push(el));
  element.querySelectorAll('a.cmp-button').forEach((a) => {
    const b = cleanButton(a, document);
    if (b) textNodes.push(b);
  });

  if (!img && !textNodes.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Columns block: no field hints. One row; image column (if present) + text column.
  const row = [];
  if (img) row.push([img]);
  row.push(textNodes.length ? textNodes : '');

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
