/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-impact
 * Base block: hero
 * Source URL: https://www.medtronic.com/en-us/our-impact.html
 * Generated: 2026-08-20
 *
 * Library convention (Hero): 1 column, 3 rows. Row 1 = block name (added
 * automatically by createBlock). Row 2 = background/media image (optional).
 * Row 3 = eyebrow / title / description / CTA / stats as richtext.
 *
 * Model fields (blocks/hero-impact/_hero-impact.json): image (reference) with
 * collapsed imageAlt, text (richtext).
 *
 * Source: div.mdt-banner corp full-width-video. The banner media is a Scene7
 * video player (blob-backed <video> + s7 sprite <img>s); the real DM poster
 * (medtronic.scene7.com/is/image/...) is not present in the cleaned DOM, so the
 * image row is emitted empty (row preserved for the model field). The
 * DM/Scene7 transformer runs separately and rewrites any DM <img> to a carrier
 * anchor if one is present. Real content lives in .banner-content: pre-title,
 * h1.title, description.
 *
 * IMPORTANT — stats bar is a SIBLING of .banner: like hero-stats, this hero's
 * `.infographic` strip (`.info-block` items with `.info-title` figures like
 * 79M+, 1.1M+, 60% and `.info-desc` labels, plus a `.info-ref` key-facts link)
 * lives as a SIBLING of `.banner-content` inside the banner subtree — NOT inside
 * `.banner-content`. The parser walks the banner subtree, captures the hero copy
 * (eyebrow, title, description, CTA), then pulls each stat into the text cell as
 * `<p><strong>figure</strong> label</p>` and any key-facts link as its own `<p>`.
 * Mirrors tools/importer/parsers/hero-stats.js exactly.
 *
 * The remaining completeness score is expected and NOT a content-loss defect:
 * the banner subtree's raw text is dominated by the Scene7 video player UI
 * chrome (playback timestamps, AUDIO/[Original], email-share dialog labels,
 * etc.). That chrome is deliberately excluded — only the real hero content
 * (eyebrow, title, description, stats) is captured. Same documented artifact as
 * the hero-stats / hero-video parsers.
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

  // Stats bar (`.infographic`) is a sibling of `.banner-content` inside the
  // banner subtree — capture its info-blocks (figure + label) so the hero's
  // statistics survive. Search from the banner scope.
  const infographic = scope.querySelector('.infographic');
  const statItems = infographic
    ? infographic.querySelectorAll('.info-block, li') : [];
  statItems.forEach((li) => {
    const title = li.querySelector('.info-title, .info-figure, strong, span:first-child');
    const desc = li.querySelector('.info-desc, .info-label');
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
    // Key-facts / footnote reference link (e.g. "Information reflects 2025 Impact Report").
    const refLink = li.querySelector('.info-ref a[href]');
    if (refLink && refLink.textContent.trim()) {
      const p = document.createElement('p');
      p.append(refLink.cloneNode(true));
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-impact', cells });
  element.replaceWith(block);
}
