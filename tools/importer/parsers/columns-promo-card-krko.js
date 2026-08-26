/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the Medtronic kr-ko `columns-promo-card` variant.
 * Base block: columns-promo-card (Columns block — per field-hinting rules,
 * Columns blocks carry NO field comments; cells hold default content only).
 * Source markup: classic AEM promo panels, e.g.
 *   `.med-hero.hero-module:not(.dark)` (#slide-4) and
 *   `.pos-relative:not(.aem-GridColumn--offset--default--0)` (#slide-6, which
 *   wraps a single-item component-carousel). Each holds:
 *     - eyebrow    : .text.eyebrow2 .cmp-text > p     ("HEALTHCARE PROFESSIONALS")
 *     - label/head : .cmp-text > p / > h4             (title + supporting copy)
 *     - CTA        : a.cmp-button (label .cmp-button__text; may be href-less)
 * These panels are text-only (no images), so a single content column is
 * emitted (one row). Decorative carousel actions/indicators are excluded.
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

  // Columns block: no field hints. One row; optional image column + text column.
  const row = [];
  if (img) row.push([img]);
  row.push(textNodes.length ? textNodes : '');

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo-card', cells });
  element.replaceWith(block);
}
