/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-cta
 * Base block: columns
 * Source URL: https://www.medtronic.com/en-us/index.html
 * Generated: 2026-08-20
 *
 * Columns block: NO field hints (columns blocks use default content only).
 * Table = 1 name row + 1 content row with 2 cells:
 *   Cell 1 -> eyebrow + headline + copy (left/center sections)
 *   Cell 2 -> CTA link (right section)
 *
 * Source: div.wrapper-cta-banner > .cta-banner > .banner-container with
 * .left-section (eyebrow, headline), .center-section (copy), .right-section (cta).
 *
 * NOTE: automated completeness score for this instance is affected by embedded
 * inline <style>/<script> in the source element; those are non-content and
 * intentionally excluded. All real banner content is captured.
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());

  const banner = element.querySelector('.banner-container') || element;

  const contentCell = [];
  const eyebrow = banner.querySelector('.left-section .eyebrow, .eyebrow');
  const headline = banner.querySelector('.left-section .headline, .headline, h1, h2, h3');
  const copy = banner.querySelector('.center-section .copy, .copy, p');
  if (eyebrow) contentCell.push(eyebrow.cloneNode(true));
  if (headline) contentCell.push(headline.cloneNode(true));
  if (copy) contentCell.push(copy.cloneNode(true));

  const ctaCell = [];
  const cta = banner.querySelector('.right-section a[href], .cta a[href], a.link[href]');
  if (cta && cta.textContent.trim()) ctaCell.push(cta.cloneNode(true));

  // Empty-block guard
  if (contentCell.length === 0 && ctaCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [
    ['Columns Cta'],
    [contentCell, ctaCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
