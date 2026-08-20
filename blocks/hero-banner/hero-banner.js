/**
 * Hero Banner variant.
 * Renders a FULL-BLEED photographic hero: a large background image fills the
 * band edge-to-edge, and a left-aligned translucent white panel holds the
 * eyebrow, headline, supporting line and a single download / resource CTA.
 * Matches the source design of the Medtronic "Impact reporting" hero
 * ("Leading with purpose" / "Our performance and progress" + a "2025 Impact
 * Report (PDF)" button).
 *
 * Distinct from the project's other hero variants:
 *  - hero-video: light band with a centered white card + background VIDEO
 *  - hero-stats: DARK full-bleed video band with an overlaid stats strip
 *  - hero-impact: LIGHT two-column text-beside-media card with a stats bar
 * This variant is a plain full-bleed photo with a left overlay text panel and
 * a single call-to-action; no video, no stats bar, no side media card.
 * @param {Element} block The hero-banner block element
 */
export default function decorate(block) {
  // The block has (up to) two cells: a media/background cell (contains the
  // picture) and a content cell (eyebrow + heading + copy + CTA). Identify each
  // so we can position the picture as the full-bleed background and the text as
  // the overlay panel, regardless of authoring order.
  const cells = [...block.querySelectorAll(':scope > div > div')];

  const mediaCell = cells.find((c) => c.querySelector('picture, img')) || cells[0];
  const contentCell = cells.find((c) => c !== mediaCell && c.textContent.trim())
    || cells.find((c) => c !== mediaCell);

  if (mediaCell) mediaCell.classList.add('hero-banner-media');
  if (contentCell) contentCell.classList.add('hero-banner-content');
}
