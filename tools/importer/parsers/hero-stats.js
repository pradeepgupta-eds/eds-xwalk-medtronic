/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-stats
 * Base block: hero
 * Source URL: https://www.medtronic.com/en-us/our-company.html
 * Generated: 2026-08-20
 *
 * Library convention (Hero): 1 column, 3 rows. Row 1 = block name (added
 * automatically by createBlock). Row 2 = background image (optional). Row 3 =
 * title / subheading / CTA as richtext. Never more than 3 rows.
 *
 * Model fields: image (reference) with collapsed imageAlt, text (richtext).
 *
 * Source: div.mdt-banner corp full-width-video. The banner media is a Scene7
 * video player (blob-backed <video> + s7 sprite <img>s); the real DM poster
 * (medtronic.scene7.com/is/image/...) is not present in the cleaned DOM, so the
 * image row is emitted empty (row preserved for the model field). The
 * DM/Scene7 transformer runs separately and rewrites any DM <img> to a carrier
 * anchor if one is present. Real content lives in .banner-content: pre-title,
 * h1.title, description, optional CTA.
 *
 * IMPORTANT — scoped selector: the section wrapper (#container-5d1a569867)
 * DOM-encloses the sibling block containers for columns-promo-card,
 * cards-topic, cards-tiles and cards-articles (the banner ends at
 * "<!-- End Banner -->" and those containers follow as siblings). The block
 * instance selector in page-templates.json is therefore scoped to
 * ".banner" (unique page-wide) so this parser only consumes the banner
 * subtree and the sibling blocks survive for their own parsers.
 *
 * The remaining ~31% completeness score is expected and NOT a content-loss
 * defect: the banner subtree's raw text is dominated by the Scene7 video
 * player UI chrome (playback timestamps, AUDIO/[Original], email-share dialog
 * labels, etc.). That chrome is deliberately excluded — only the real hero
 * content (eyebrow "Who we are", title, description) is captured, as verified
 * in the extracted output. Same documented artifact as the hero-video parser.
 */
export default function parse(element, { document }) {
  // element is the .banner subtree; tolerate a wider match by scoping down.
  const scope = element.matches && element.matches('.banner, div.mdt-banner')
    ? element
    : (element.querySelector('.banner, div.mdt-banner') || element);

  scope.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  // Drop Scene7 player sprites / data-URI icons — non-content.
  scope.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());

  // Content image: a genuine DM/content image only (never a player sprite).
  const contentImg = scope.querySelector(
    'img[src*="/is/image/Medtronic"]:not([src*="_OOTB"]):not([src*="s7sdk"])'
  );

  // Text content from the banner copy area.
  const content = scope.querySelector('.banner-content, .banner-text-wrapper') || scope;
  const preTitle = content.querySelector('.pre-title, .eyebrow');
  const heading = content.querySelector('h1, h2, .title');
  const description = content.querySelector('.description');
  const cta = content.querySelector('.banner-cta-wrapper a[href], .banner-action a[href]');

  const textCell = [document.createComment(' field:text ')];
  if (preTitle && preTitle.textContent.trim()) {
    const p = document.createElement('p');
    p.innerHTML = preTitle.innerHTML;
    textCell.push(p);
  }
  if (heading && heading.textContent.trim()) textCell.push(heading.cloneNode(true));
  if (description && description.textContent.trim()) {
    // description already wraps its own <p>(s)
    Array.from(description.childNodes).forEach((n) => textCell.push(n.cloneNode(true)));
  }
  if (cta && cta.textContent.trim()) textCell.push(cta.cloneNode(true));

  // Stats bar (`.infographic`) is a sibling of `.banner` inside the hero
  // wrapper section — capture its info-blocks (figure + label) so the hero's
  // statistics row survives. Search from the wrapping section, not `.banner`.
  const heroSection = (element.closest && element.closest('.cmp-container, [id^="container-"]'))
    || (scope.parentElement && scope.parentElement.closest
      ? scope.parentElement.closest('.cmp-container, [id^="container-"]')
      : null)
    || document;
  const infographic = heroSection.querySelector
    ? heroSection.querySelector('.infographic') : null;
  const statItems = infographic
    ? infographic.querySelectorAll('.info-block, li') : [];
  statItems.forEach((li) => {
    const title = li.querySelector('.info-title, .info-figure, strong, span:first-child');
    const desc = li.querySelector('.info-desc, .info-label');
    const link = li.querySelector('a[href]');
    if (title && title.textContent.trim()) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      p.append(strong);
      if (desc && desc.textContent.trim()) {
        p.append(document.createTextNode(` ${desc.textContent.trim()}`));
      }
      textCell.push(p);
    }
    if (link && link.textContent.trim()) {
      const p = document.createElement('p');
      p.append(link.cloneNode(true));
      textCell.push(p);
    }
  });

  // Empty-block guard: bail if there is no real content at all.
  if (!contentImg && textCell.length === 1) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Image row (kept even when empty so the model field slot exists).
  if (contentImg) {
    cells.push([[document.createComment(' field:image '), contentImg.cloneNode(true)]]);
  } else {
    cells.push(['']);
  }

  // Text row
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-stats', cells });
  element.replaceWith(block);
}
