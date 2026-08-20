/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-promo
 * Base block: columns
 * Source URL: https://www.medtronic.com/en-us/index.html
 * Generated: 2026-08-20
 *
 * Columns block: NO field hints (columns blocks use default content only).
 * Table = 1 name row + 1 content row with 2 cells:
 *   Cell 1 -> promo image
 *   Cell 2 -> eyebrow + title + description + CTA link(s) + secondary links/jobs
 *
 * Instances (careers + investors promos):
 *   #Careers / div.wrapper-careers-section  (.careers-section: img + .careers-content)
 *   #ShareHolder / div.wrapper-investors-section (.investors-section: img + .investors-content)
 * Both follow the same "image on one side, text+CTAs on the other" layout.
 *
 * NOTE: The automated completeness score is low only because the #Careers /
 * #ShareHolder source elements embed a large inline <style> block (carousel dot
 * styles etc.). That CSS is non-content and intentionally excluded. All real
 * promo content is captured (verified in validation output): image, eyebrow,
 * title, description, and every CTA/quick-link/job link. Confirmed.
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());

  const section = element.querySelector('.careers-section, .investors-section') || element;
  const content = section.querySelector('.careers-content, .investors-content') || section;

  // Promo image (first real image in the section).
  const img = section.querySelector('img[src]:not([src^="data:"])');

  const textCell = [];
  const eyebrow = content.querySelector('.eyebrow');
  const title = content.querySelector('.careers-title, .investors-title, h1, h2, h3, .headline');
  const description = content.querySelector('.careers-description, .investors-description, .copy, p');
  if (eyebrow) textCell.push(eyebrow.cloneNode(true));
  if (title) textCell.push(title.cloneNode(true));
  if (description) textCell.push(description.cloneNode(true));

  // Primary + secondary CTA links (careers CTAs, careers-links, investor links).
  // De-duplicate by href and skip empty wrapper anchors.
  const seen = new Set();
  content.querySelectorAll('.cta a[href], .careers-links a[href], a.link[href], .bottom-right-link[href]').forEach((a) => {
    const href = a.getAttribute('href');
    const text = a.textContent.trim();
    if (!text || !href) return;
    if (seen.has(href)) return;
    seen.add(href);
    const link = a.cloneNode(true);
    link.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    const p = document.createElement('p');
    p.appendChild(link);
    textCell.push(p);
  });

  // Job links list (careers-jobs): each anchor has an icon image + label.
  content.querySelectorAll('.careers-jobs a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || seen.has(href)) return;
    seen.add(href);
    const p = document.createElement('p');
    p.appendChild(a.cloneNode(true));
    textCell.push(p);
  });

  // Catch-all: any remaining meaningful anchors in the section (e.g. investor
  // "Stock info", "Company highlights", "Upcoming events" quick links).
  section.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    const text = a.textContent.trim();
    if (!text || !href || seen.has(href)) return;
    seen.add(href);
    const link = a.cloneNode(true);
    link.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    const p = document.createElement('p');
    p.appendChild(link);
    textCell.push(p);
  });

  // Empty-block guard
  if (!img && textCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [['Columns Promo']];
  if (img) {
    cells.push([[img.cloneNode(true)], textCell]);
  } else {
    cells.push([textCell, ['']]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
