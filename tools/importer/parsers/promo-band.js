/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: promo-band
 * Base block: block/v1/block (container block with promo-link child items)
 * Source URL: https://www.medtronic.com/en-us/index.html
 * Generated: 2026-08-20
 *
 * The promo band renders a full-bleed banner with hero content (image, eyebrow,
 * title, description, primary + secondary text CTAs) plus a row of ICON quick-
 * link tiles (each an SVG icon + label). md2jcr cannot place images inside a
 * richtext field, so the icon tiles must be modelled as child items rather than
 * kept inline in the `text` richtext. This mirrors the working cards-stats
 * container pattern on the same page.
 *
 * Table:
 *   name row      -> added by createBlock
 *   image row     -> [ <!-- field:image --> promo image ]   (or empty cell)
 *   text row      -> [ <!-- field:text --> eyebrow/title/desc/plain CTA links ]
 *   promo-link *  -> [ <!-- field:image --> icon | <!-- field:link --> anchor ]
 *
 * Instances (careers + investors promos):
 *   #Careers / div.wrapper-careers-section
 *   #ShareHolder / div.wrapper-investors-section
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());

  const section = element.querySelector('.careers-section, .investors-section') || element;
  const content = section.querySelector('.careers-content, .investors-content') || section;

  // Promo image (first real image in the section).
  const img = section.querySelector('img[src]:not([src^="data:"])');

  // ---- Hero text content (eyebrow / title / description) ----
  const textCell = [document.createComment(' field:text ')];
  const eyebrow = content.querySelector('.eyebrow');
  const title = content.querySelector('.careers-title, .investors-title, h1, h2, h3, .headline');
  const description = content.querySelector('.careers-description, .investors-description, .copy, p');
  if (eyebrow) textCell.push(eyebrow.cloneNode(true));
  if (title) textCell.push(title.cloneNode(true));
  if (description) textCell.push(description.cloneNode(true));

  const seen = new Set();
  // Track anchors so plain links land in the text richtext while icon links
  // become child items.
  const iconLinks = [];

  const classify = (a) => {
    const href = a.getAttribute('href');
    const text = a.textContent.trim();
    if (!text || !href || seen.has(href)) return;
    seen.add(href);
    const clone = a.cloneNode(true);
    const hasIcon = clone.querySelector('img:not([src^="data:"]), picture');
    if (hasIcon) {
      iconLinks.push(clone);
    } else {
      const p = document.createElement('p');
      p.appendChild(clone);
      textCell.push(p);
    }
  };

  // Primary + secondary CTA links (careers CTAs, careers-links, investor links).
  content.querySelectorAll('.cta a[href], .careers-links a[href], a.link[href], .bottom-right-link[href]').forEach(classify);
  // Job / quick-link tiles (careers-jobs) and any remaining meaningful anchors.
  content.querySelectorAll('.careers-jobs a[href]').forEach(classify);
  section.querySelectorAll('a[href]').forEach(classify);

  // Empty-block guard
  if (!img && textCell.length === 1 && iconLinks.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Parent image row — hinted cell with the image when present, else empty cell.
  if (img) {
    cells.push([[document.createComment(' field:image '), img.cloneNode(true)]]);
  } else {
    cells.push(['']);
  }

  // Parent text row.
  cells.push([textCell]);

  // Child promo-link item rows: icon cell + link cell.
  iconLinks.forEach((a) => {
    const icon = a.querySelector('img:not([src^="data:"])');
    const iconCell = [document.createComment(' field:image ')];
    if (icon) iconCell.push(icon.cloneNode(true));

    // Strip icon markup from the anchor so only the label text remains.
    const linkAnchor = a.cloneNode(true);
    linkAnchor.querySelectorAll('img, picture').forEach((n) => n.remove());
    const label = linkAnchor.textContent.trim();
    linkAnchor.textContent = label;
    const linkP = document.createElement('p');
    linkP.appendChild(linkAnchor);
    const linkCell = [document.createComment(' field:link '), linkP];

    cells.push([iconCell, linkCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'promo-band', cells });
  element.replaceWith(block);
}
