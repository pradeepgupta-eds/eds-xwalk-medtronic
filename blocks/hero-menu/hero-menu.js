/**
 * Hero Menu variant.
 * Renders a FULL-BLEED dark hero for section "menu" / landing pages: a large
 * background graphic fills the band edge-to-edge and a single left-aligned
 * white heading sits directly over it. No translucent panel, no CTA, no stats
 * bar, no side media. Matches the source design of the Medtronic
 * "Healthcare professionals" hero (navy particle graphic + white headline).
 *
 * Distinct from the project's other hero variants:
 *  - hero-video:  light band, centered white card, background VIDEO
 *  - hero-stats:  dark full-bleed VIDEO band with an overlaid stats strip + CTA
 *  - hero-impact: light two-column text-beside-media card with a stats bar
 *  - hero-banner: light full-bleed photo with a left translucent panel + CTA
 * This variant is a dark full-bleed image band with a plain heading only.
 * @param {Element} block The hero-menu block element
 */
export default function decorate(block) {
  // The block has (up to) two cells: a media/background cell (contains the
  // picture) and a content cell (the heading). Identify each so the picture
  // becomes the full-bleed background and the text sits over it, regardless
  // of authoring order.
  const cells = [...block.querySelectorAll(':scope > div > div')];

  const mediaCell = cells.find((c) => c.querySelector('picture, img')) || cells[0];
  const contentCell = cells.find((c) => c !== mediaCell && c.textContent.trim())
    || cells.find((c) => c !== mediaCell);

  if (mediaCell) mediaCell.classList.add('hero-menu-media');
  if (contentCell) contentCell.classList.add('hero-menu-content');
}
