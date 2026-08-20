/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-menu
 * Base block: hero
 * Source URL: https://www.medtronic.com/en-us/healthcare-professionals.html
 *             (also: /healthcare-professionals/specialties.html)
 * Generated: 2026-08-20
 *
 * Library convention (Hero): 1 column, 3 rows. Row 1 = block name (createBlock).
 * Row 2 = full-bleed background/graphic image (optional). Row 3 = title /
 * subheading / CTA as richtext. Never more than 3 rows.
 *
 * Model fields (blocks/hero-menu/_hero-menu.json): image (reference) with
 * collapsed imageAlt, text (richtext).
 *
 * Source: dark div.mdt-hero-banner (class "dark"). A full-bleed graphic
 * (`.hero-image img`) with a single white heading (h1.title). The eyebrow
 * (.pre-title) and description are empty placeholders on this page, so only the
 * title lands in the text cell. There is NO CTA, panel, or stats strip.
 *
 * IMPORTANT — scope: the instance selector (div.hero-main-content) DOM-encloses
 * a trailing <main> holding the navigation link tiles (cards-nav) plus share
 * buttons. The parser scopes to `.hero-banner`/`.mdt-hero-banner` so those
 * siblings survive for the cards-nav parser.
 *
 * DM/Scene7: hero image treated as a normal <img>; the DM transformer rewrites
 * any DM URL downstream.
 */
export default function parse(element, { document }) {
  const scope = element.matches
    && element.matches('.hero-banner, .mdt-hero-banner')
    ? element
    : (element.querySelector('.mdt-hero-banner, .hero-banner') || element);

  scope.querySelectorAll('style, script, noscript').forEach((n) => n.remove());

  // Full-bleed graphic (ignore gradient overlay divs).
  const heroImg = scope.querySelector('.hero-image img[src], img[src]');

  const content = scope.querySelector('.hero-content .content, .hero-content') || scope;
  const preTitle = content.querySelector('.pre-title, .eyebrow');
  const heading = content.querySelector('h1, h2, .title');
  const description = content.querySelector('.description');

  const textCell = [document.createComment(' field:text ')];
  if (preTitle && preTitle.textContent.trim()) {
    const p = document.createElement('p');
    p.innerHTML = preTitle.innerHTML;
    textCell.push(p);
  }
  if (heading && heading.textContent.trim()) textCell.push(heading.cloneNode(true));
  if (description && description.textContent.trim()) {
    Array.from(description.childNodes).forEach((n) => {
      if (n.textContent && n.textContent.trim()) textCell.push(n.cloneNode(true));
    });
  }

  // Empty-block guard.
  if (!heroImg && textCell.length === 1) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Image row (kept even when empty so the model field slot exists).
  if (heroImg) {
    cells.push([[document.createComment(' field:image '), heroImg.cloneNode(true)]]);
  } else {
    cells.push(['']);
  }

  // Text row
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-menu', cells });
  element.replaceWith(block);
}
