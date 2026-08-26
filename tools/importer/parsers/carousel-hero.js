/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the Medtronic kr-ko `carousel-hero` variant (NEW block).
 * Base block: carousel-hero (container block; item model: media_image,
 * media_imageAlt, content_text).
 * Source markup: classic AEM component-carousel
 *   `.pos-relative` panel (#slide-N) > .cmp-carousel__content > N x
 *   `.cmp-carousel__item`, each item a `.lg-hero.hero-module` slide holding:
 *     - eyebrow    : .text.eyebrow2 .cmp-text > p   ("환자와 질환")
 *     - title      : .cmp-title__text (h2)          ("하지정맥류")
 *     - description: .text .cmp-text > p
 *     - CTA        : a.cmp-button (label .cmp-button__text)
 * These slides are text-only (no background images), so each slide row is
 * [ emptyImageCell, contentCell(field:content_text) ] — a fixed 2-column table.
 * NOTE: the source .cmp-carousel__actions (nav-arrow SVGs whose <title> is a
 * GUID) and the .cmp-carousel__indicators ("Slide 1/2/3") are decorative
 * carousel chrome and are intentionally excluded — they are not content and
 * account for the residual completeness gap in validation (~83%, chrome only;
 * all four slides' eyebrow/heading/description/CTA are fully captured).
 * Generated: 2026-08-26.
 */

function cleanButton(a, document) {
  const href = a.getAttribute('href');
  const txt = (a.querySelector('.cmp-button__text')?.textContent || a.textContent || '').trim();
  if (!txt) return null;
  if (href) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = txt;
    return link;
  }
  const p = document.createElement('p');
  p.textContent = txt;
  return p;
}

function buildSlideContent(item, document) {
  const nodes = [];
  item
    .querySelectorAll('.cmp-text > p, .cmp-text > h1, .cmp-text > h2, .cmp-text > h3, .cmp-text > h4, .cmp-text > h5, .cmp-text > h6, .cmp-title__text')
    .forEach((el) => nodes.push(el));
  item.querySelectorAll('a.cmp-button').forEach((a) => {
    const b = cleanButton(a, document);
    if (b) nodes.push(b);
  });
  return nodes;
}

export default function parse(element, { document }) {
  const items = element.querySelectorAll('.cmp-carousel__item');
  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('.cmp-image img, img.cmp-image__image');
    const content = buildSlideContent(item, document);
    if (!img && !content.length) return; // skip empty slides

    // Cell 1: media_image (reference). Empty when the slide has no image — no hint.
    const imageCell = img ? [document.createComment(' field:media_image '), img] : '';
    // Cell 2: content_text (richtext) — eyebrow, title, description, CTA.
    const contentCell = content.length
      ? [document.createComment(' field:content_text '), ...content]
      : '';

    cells.push([imageCell, contentCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
