/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: accordion-links
 * Base block: accordion
 * Source URL: https://www.medtronic.com/en-us/our-impact/impact-reporting.html
 * Generated: 2026-08-20
 *
 * Container block (Accordion convention): 2 columns, multiple rows. First row =
 * block name (added by createBlock). Each subsequent row is one accordion item
 * with 2 cells matching the `accordion-links-item` model
 * (blocks/accordion-links/_accordion-links.json):
 *   Cell 1 (title, mandatory) -> summary  <!-- field:summary -->  disclosure title
 *   Cell 2 (content, mandatory) -> text   <!-- field:text -->  panel body: a list
 *          of PDF / resource links, each in its own <p>
 *
 * Source: div.cmp-accordion with .cmp-accordion__item panels. Each item's title
 * is `.cmp-accordion__title`; its body is `.cmp-accordion__panel` (a
 * `.cmp-text` block of <p><a>...</a></p> resource links). Expanded/hidden state
 * is irrelevant to extraction.
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());

  const rows = [];

  element.querySelectorAll('.cmp-accordion__item').forEach((item) => {
    const title = item.querySelector('.cmp-accordion__title, .cmp-accordion__header button, h2, h3, h4');
    const panel = item.querySelector('.cmp-accordion__panel');

    // Cell 1: summary (plain-text title).
    const summaryCell = [document.createComment(' field:summary ')];
    if (title && title.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = title.textContent.trim();
      summaryCell.push(p);
    }

    // Cell 2: text (resource/PDF link list).
    const textCell = [document.createComment(' field:text ')];
    if (panel) {
      const links = panel.querySelectorAll('p a[href], li a[href]');
      if (links.length) {
        links.forEach((a) => {
          const p = document.createElement('p');
          p.append(a.cloneNode(true));
          textCell.push(p);
        });
      } else {
        // Fallback: keep whatever rich text the panel holds.
        const textBlock = panel.querySelector('.cmp-text') || panel;
        Array.from(textBlock.childNodes).forEach((n) => textCell.push(n.cloneNode(true)));
      }
    }

    if (summaryCell.length > 1 || textCell.length > 1) {
      rows.push([summaryCell, textCell]);
    }
  });

  // Empty-block guard.
  if (rows.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-links', cells: rows });
  element.replaceWith(block);
}
