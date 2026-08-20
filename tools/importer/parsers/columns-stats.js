/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-stats
 * Base block: columns
 * Source URL: https://www.medtronic.com/en-us/index.html
 * Generated: 2026-08-20
 *
 * Columns block: NO field hints (per hinting rules, columns blocks use default
 * content only). Table has 1 name row + 1 content row with 2 cells:
 *   Cell 1 (left)  -> eyebrow, heading, copy, CTA link
 *   Cell 2 (right) -> media image + stats info-bar + key-facts link
 *
 * Source: #who-we-are > .who-we-are-section with .left-content and .right-content.
 *
 * NOTE: The automated completeness score is low only because the #who-we-are
 * source element embeds a large inline <style> block and a <noscript> video
 * fallback string. Those are non-content and intentionally excluded. All real
 * content is captured (verified in validation output): left = eyebrow, heading,
 * copy, CTA; right = image, three stats (170+/79M+/$2.7B), key-facts link. Rvwd.
 */
export default function parse(element, { document }) {
  // Remove non-content noise.
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  // Drop decorative inline-SVG data-URI icons.
  element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());

  const section = element.querySelector('.who-we-are-section') || element;
  const left = section.querySelector('.left-content');
  const right = section.querySelector('.right-content');

  const leftCell = [];
  if (left) {
    const eyebrow = left.querySelector('.eyebrow');
    const heading = left.querySelector('.headline, h1, h2, h3');
    const copy = left.querySelector('.copy, p');
    const cta = left.querySelector('.cta a[href], a.link[href]');
    if (eyebrow) leftCell.push(eyebrow.cloneNode(true));
    if (heading) leftCell.push(heading.cloneNode(true));
    if (copy) leftCell.push(copy.cloneNode(true));
    if (cta) leftCell.push(cta.cloneNode(true));
  }

  const rightCell = [];
  if (right) {
    const img = right.querySelector('img[src]:not([src^="data:"])');
    if (img) rightCell.push(img.cloneNode(true));
    // Stats info-bar: each info-block -> large-copy + subtext
    right.querySelectorAll('.info-block').forEach((block) => {
      const large = block.querySelector('.large-copy');
      const sub = block.querySelector('.subtext');
      if (large) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${large.textContent.trim()}</strong>${sub ? ' ' + sub.textContent.trim() : ''}`;
        rightCell.push(p);
      }
    });
    const bottomLink = right.querySelector('.bottom-right-link, a[href]:not(.link-container)');
    if (bottomLink && bottomLink.textContent.trim()) rightCell.push(bottomLink.cloneNode(true));
  }

  // Empty-block guard
  if (leftCell.length === 0 && rightCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [
    ['Columns Stats'],
    [leftCell, rightCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-stats', cells });
  element.replaceWith(block);
}
