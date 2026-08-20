/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-banner
 * Base block: hero
 * Source URL: https://www.medtronic.com/en-us/our-impact/impact-reporting.html
 *             (also: /healthcare-professionals/specialties/acute-care-monitoring.html)
 * Generated: 2026-08-20
 *
 * Library convention (Hero): 1 column, 3 rows. Row 1 = block name (createBlock).
 * Row 2 = full-bleed hero image (optional). Row 3 = eyebrow / title /
 * subheading / CTA as richtext. Never more than 3 rows.
 *
 * Model fields (blocks/hero-banner/_hero-banner.json): image (reference) with
 * collapsed imageAlt, text (richtext).
 *
 * Source: div.mdt-hero-banner. Full-bleed photo (`.hero-image img`) with a
 * left overlay panel (`.hero-content .content`): pre-title, h1.title,
 * description, and an optional download CTA (a "2025 Impact Report (PDF)"
 * button on impact-reporting). On specialty-detail (acute-care) the same block
 * has NO CTA — the CTA extraction is conditional so a missing CTA is handled
 * gracefully. The instance selector wraps a trailing <main>; the parser scopes
 * to `.hero-banner`/`.mdt-hero-banner` so sibling content is not consumed.
 *
 * DM/Scene7: the hero image is treated as a normal <img>; the separate
 * DM/Scene7 transformer rewrites any DM URL to a carrier anchor downstream.
 */
export default function parse(element, { document }) {
  // Scope down to the hero-banner subtree (the instance selector may wrap a
  // trailing <main> with unrelated content on impact-reporting).
  const scope = element.matches
    && element.matches('.hero-banner, .mdt-hero-banner')
    ? element
    : (element.querySelector('.mdt-hero-banner, .hero-banner') || element);

  scope.querySelectorAll('style, script, noscript').forEach((n) => n.remove());

  // Hero image — the real content photo (ignore gradient overlay divs).
  const heroImg = scope.querySelector('.hero-image img[src], img[src]');

  // Overlay copy panel.
  const content = scope.querySelector('.hero-content .content, .hero-content, .banner-content') || scope;
  const preTitle = content.querySelector('.pre-title, .eyebrow');
  const heading = content.querySelector('h1, h2, .title');
  const description = content.querySelector('.description');
  // Optional CTA (download/report button). Absent on specialty-detail.
  const cta = content.querySelector(
    '.mdt-row a[href], .action-link a[href], .banner-cta-wrapper a[href], .cmp-button[href]'
  );

  const textCell = [document.createComment(' field:text ')];
  if (preTitle && preTitle.textContent.trim()) {
    const p = document.createElement('p');
    p.innerHTML = preTitle.innerHTML;
    textCell.push(p);
  }
  if (heading && heading.textContent.trim()) textCell.push(heading.cloneNode(true));
  if (description && description.textContent.trim()) {
    Array.from(description.childNodes).forEach((n) => textCell.push(n.cloneNode(true)));
  }
  if (cta && cta.textContent.trim()) {
    // Rebuild as a clean anchor (drop the download icon span, keep href + label).
    const a = document.createElement('a');
    a.setAttribute('href', cta.getAttribute('href'));
    const label = cta.querySelector('.cmp-button__text');
    a.textContent = (label ? label.textContent : cta.textContent).trim();
    const p = document.createElement('p');
    p.append(a);
    textCell.push(p);
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
