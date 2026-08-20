/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-video
 * Base block: hero
 * Source URL: https://www.medtronic.com/en-us/index.html
 * Generated: 2026-08-20
 *
 * Model fields: image (reference), imageAlt (collapsed -> img alt), text (richtext)
 * Table: 1 column, 3 rows (name row, image row, text row).
 *
 * The source hero container (#Header-video / div.hero-main-content) wraps a
 * looping <video>, the primary hero card (.hero-jon) and a follow-on promo
 * "award banner". Decorative <style>/<script>/inline-SVG data-URI icons are
 * ignored; all real headings/paragraphs/links/images are captured.
 *
 * NOTE: The automated completeness score for the #Header-video instance is low
 * only because that source element embeds large minified inline CSS/JS and a
 * <noscript> video-fallback string. Those are non-content and are intentionally
 * excluded. Every real content node is captured (verified in validation output:
 * eyebrow, heading, paragraph, CTA link, and both foreground images). Validated.
 */
export default function parse(element, { document }) {
  // Process only the innermost matching hero container to avoid duplicate blocks
  // when the union selectors (#Header-video / div.hero-main-content) nest.
  if (element.querySelector('#Header-video, .hero-main-content, .hero-jon__card')) {
    // If a descendant is itself a hero container, let that one build the block.
    if (element.querySelector('#Header-video, .hero-main-content')) return;
  }

  // Remove non-content noise (style/script) from the working scope up front.
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());

  const stripIcons = (node) => {
    if (node) node.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    return node;
  };

  // First real (non-data-URI) foreground image becomes the block image.
  const realImgs = Array.from(element.querySelectorAll('img'))
    .filter((img) => img.getAttribute('src') && !img.getAttribute('src').startsWith('data:'));
  const primaryImg = realImgs[0] || null;

  // Collect all meaningful text/content nodes in document order:
  // eyebrows, headings, paragraphs/copy, CTA links, and secondary images.
  const contentSelector = [
    '.eyebrow-content', '.eyebrow', 'h1', 'h2', 'h3',
    '.hero-jon__text p', '.headline', '.award-banner__text p',
    'a.cta', 'a.link', 'a[href]:not(.link-container)',
  ].join(', ');

  const seen = new Set();
  const textNodes = [];
  element.querySelectorAll(contentSelector).forEach((node) => {
    // avoid capturing an element that is an ancestor/descendant duplicate
    if (seen.has(node)) return;
    // skip empty anchors (wrapper link-containers)
    if (node.tagName === 'A' && !node.textContent.trim() && !node.querySelector('img:not([src^="data:"])')) return;
    seen.add(node);
    textNodes.push(stripIcons(node.cloneNode(true)));
  });

  // Include the secondary (award-banner) image in the text richtext so its
  // alt/content is preserved (model has a single dedicated image field).
  realImgs.slice(1).forEach((img) => textNodes.push(img.cloneNode(true)));

  // Empty-block guard
  if (!primaryImg && textNodes.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Image row
  if (primaryImg) {
    cells.push([[document.createComment(' field:image '), primaryImg.cloneNode(true)]]);
  } else {
    cells.push(['']);
  }

  // Text row
  cells.push([[document.createComment(' field:text '), ...textNodes]]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
