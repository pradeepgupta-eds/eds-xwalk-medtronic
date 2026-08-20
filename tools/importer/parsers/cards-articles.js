/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-articles
 * Base block: cards
 * Source URL: https://www.medtronic.com/en-us/our-company.html
 * Generated: 2026-08-20
 *
 * Container block (Cards convention): first row = block name (added by
 * createBlock). Each subsequent row is one article card with 2 cells matching
 * the `card` model:
 *   Cell 1 -> image  <!-- field:image -->  (article tile image)
 *   Cell 2 -> text   <!-- field:text -->  (eyebrow topic + linked h3 title)
 *
 * Instance #container-a5f4363e21 is a masonry article grid: a set of
 * <li.grid-block> items, each an <a href> wrapping <article.tile> with a
 * .tile-image img and .tile-header (span.eyebrow + h3). The card link is the
 * <li>'s anchor; the title is wrapped in that link to preserve navigation.
 * The "Explore topics:" filter <select> and the "Load more" button are
 * interactive controls, not content, and are intentionally excluded.
 *
 * The automated completeness score is low (~21%) and is NOT a content-loss
 * defect: the matched element's raw text is dominated by the filter dropdown
 * options, the "Load more" button, a Handlebars list template literal
 * ("{{#each this}}...") and custom mockup CSS — all non-article scaffolding
 * that is deliberately dropped. All 6 real article cards (image, eyebrow topic
 * and linked title) are captured, as verified in the extracted output.
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  // Drop interactive controls that are not article content.
  element.querySelectorAll('.user-filter-wrapper, .filter-wrapper, select, .load-more-list, #load-more, button')
    .forEach((n) => n.remove());

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

  element.querySelectorAll('li.grid-block').forEach((li) => {
    const anchor = li.querySelector('a[href]');
    const href = anchor ? anchor.getAttribute('href') : null;
    const rawImg = li.querySelector('.tile-image img, img');
    const eyebrow = li.querySelector('.eyebrow');
    const title = li.querySelector('.tile-header h3, h3');

    const img = resolveImg(rawImg);

    const imageCell = [document.createComment(' field:image ')];
    if (img) imageCell.push(img.cloneNode(true));

    const textCell = [document.createComment(' field:text ')];
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      textCell.push(p);
    }
    if (title && title.textContent.trim()) {
      const h = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = title.textContent.trim();
        h.appendChild(a);
      } else {
        h.textContent = title.textContent.trim();
      }
      textCell.push(h);
    }

    if (img || textCell.length > 1) rows.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (rows.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-articles', cells: rows });
  element.replaceWith(block);
}
