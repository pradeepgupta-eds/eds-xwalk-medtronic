/**
 * promo-band — Medtronic "Careers" / "Investors" full-bleed promo banner.
 *
 * Delivered (container-block) structure before this runs:
 *   .promo-band
 *     > div > div            parent hero image (picture, no text)
 *     > div > div            parent text: eyebrow, h2, description, plain CTA links
 *     > div > div | div      promo-link item: icon cell | link cell   (repeats)
 *
 * We detect the variant from the hero image (raster photo => dark careers
 * banner, svg/no image => light investors banner), promote a photo to a
 * full-bleed background, and regroup the content into: a text column top-left,
 * a group of secondary links top-right and a row of icon quick-links (the
 * promo-link items) bottom-right, all overlaid on the background.
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Drop a stray "Promo Band" label row if one slipped through.
  if (
    rows.length
    && rows[0].children.length === 1
    && !rows[0].querySelector('picture, img, a')
    && rows[0].textContent.trim().toLowerCase().replace(/[\s-]+/g, ' ') === 'promo band'
  ) {
    rows.shift().remove();
  }

  let picture = null; // parent hero image
  const textNodes = []; // eyebrow / heading / description / plain CTA links
  const quicklinks = []; // { icon, anchor } from promo-link item rows

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      // promo-link item row: icon cell + link cell
      const icon = cells[0].querySelector('picture, img');
      const anchor = cells[1].querySelector('a[href]');
      if (anchor) quicklinks.push({ icon, anchor });
      return;
    }
    const cell = cells[0];
    if (!cell) return;
    const media = cell.querySelector('picture, img');
    if (media && !cell.textContent.trim()) {
      // parent hero image cell (image only, no text)
      picture = picture || media;
      return;
    }
    // parent text cell: keep its block-level children in order
    [...cell.children].forEach((n) => textNodes.push(n));
  });

  // 1. Determine variant from the hero image.
  const img = picture ? picture.querySelector('img') || picture : null;
  const src = img ? (img.getAttribute('src') || img.currentSrc || '') : '';
  const isPhoto = /\.(jpe?g|png|webp|gif)(\?|#|$)/i.test(src) && !/\.svg(\?|#|$)/i.test(src);
  const dark = !!picture && isPhoto;

  // 2. Rebuild the block into the layout the CSS expects.
  block.textContent = '';
  block.classList.add(dark ? 'promo-band-dark' : 'promo-band-light');

  // 3. Background handling (dark variant promotes the photo to a full-bleed bg).
  if (dark && picture) {
    const bg = document.createElement('div');
    bg.className = 'promo-band-bg';
    bg.append(picture);
    block.append(bg);
  }
  // Light variant: the imported "image" is only a stray stock icon — dropped.

  // 4. Text column.
  const content = document.createElement('div');
  content.className = 'promo-band-content';
  textNodes.forEach((n) => content.append(n));
  block.append(content);

  // 5. Classify the plain links inside the text column.
  const linkParas = [...content.querySelectorAll(':scope > p')].filter((p) => p.querySelector('a'));
  const [primaryPara, ...secondaryParas] = linkParas;
  if (primaryPara) primaryPara.classList.add('promo-band-cta');

  // 6. Move secondary links to a top-right group.
  if (secondaryParas.length) {
    const secondary = document.createElement('div');
    secondary.className = 'promo-band-secondary';
    secondaryParas.forEach((p) => secondary.append(p));
    block.append(secondary);
  }

  // 7. Build the icon quick-links row (bottom-right) from the promo-link items.
  if (quicklinks.length) {
    const list = document.createElement('ul');
    list.className = 'promo-band-quicklinks';
    quicklinks.forEach(({ icon, anchor }) => {
      if (icon && !anchor.querySelector('picture, img')) {
        anchor.prepend(icon);
      }
      const li = document.createElement('li');
      li.append(anchor);
      list.append(li);
    });
    block.append(list);
  }
}
