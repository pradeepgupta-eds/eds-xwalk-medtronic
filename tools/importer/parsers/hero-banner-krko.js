/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the Medtronic kr-ko `hero-banner` variant.
 * Base block: hero-banner (simple block; xwalk model: image, imageAlt, text).
 * Source markup: classic AEM `.lg-hero.hero-module.active-slide` panel (#slide-N).
 *   - eyebrow  : .text.eyebrow2 > .cmp-text > p        ("Who we are")
 *   - subhead  : .text.h1 > .cmp-text > p              ("Engineering the extraordinary")
 *   - headline : .cmp-title__text (h1, Korean copy)
 *   - CTA      : a.cmp-button (label in .cmp-button__text)
 * No background image exists in the kr-ko source, so the optional image row
 * (row 2) is omitted; all copy + CTA go into the single richtext `text` field.
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

export default function parse(element, { document }) {
  // Copy nodes in DOM order: eyebrow / subhead paragraphs then the headline.
  const contentNodes = [];
  element
    .querySelectorAll('.cmp-text > p, .cmp-text > h1, .cmp-text > h2, .cmp-text > h3, .cmp-text > h4, .cmp-text > h5, .cmp-text > h6, .cmp-title__text')
    .forEach((el) => contentNodes.push(el));

  // Single download / resource CTA.
  element.querySelectorAll('a.cmp-button').forEach((a) => {
    const b = cleanButton(a, document);
    if (b) contentNodes.push(b);
  });

  // Empty-block guard.
  if (!contentNodes.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single-column hero: one row whose one cell holds all copy + CTA, prefixed
  // by the xwalk field hint for the richtext `text` field.
  const textCell = [document.createComment(' field:text '), ...contentNodes];

  const cells = [];
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
