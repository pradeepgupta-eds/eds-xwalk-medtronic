/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the Medtronic kr-ko `carousel-news` variant.
 * Base block: carousel-news (container block; item model: media_image,
 * media_imageAlt, content_text).
 * Source markup: classic AEM `.news-media-section` panel (#slide-N) containing
 * a heading ("News & media") + "(swipe for more news)" hint, then N x
 * `.card-module` cards, each card:
 *   - image : .cmp-image img (wrapped in a link to the article)
 *   - title : .cmp-title__text > a.cmp-title__link (article headline + href)
 *   - CTA   : .cmp-text p > a ("자세히 보기" / read more)
 * Each card becomes one slide row: [ imageCell(field:media_image),
 * contentCell(field:content_text) ] — a fixed 2-column table. The section
 * heading / swipe hint are section chrome and are not emitted as slides.
 * Generated: 2026-08-26.
 */

export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.card-module');
  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('.cmp-image img, img.cmp-image__image');

    const content = [];
    // Article headline (linked) — preserve as a heading with its anchor.
    const titleLink = card.querySelector('.cmp-title__text a, .cmp-title__link');
    if (titleLink) {
      const h = document.createElement('h3');
      const a = document.createElement('a');
      a.href = titleLink.getAttribute('href') || '';
      a.textContent = titleLink.textContent.trim();
      h.append(a);
      content.push(h);
    }
    // Read-more CTA link.
    const ctaLink = card.querySelector('.cmp-text p a, .cmp-text a');
    if (ctaLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaLink.getAttribute('href') || '';
      a.textContent = ctaLink.textContent.trim();
      p.append(a);
      content.push(p);
    }

    if (!img && !content.length) return;

    const imageCell = img ? [document.createComment(' field:media_image '), img] : '';
    const contentCell = content.length
      ? [document.createComment(' field:content_text '), ...content]
      : '';

    cells.push([imageCell, contentCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-news', cells });
  element.replaceWith(block);
}
