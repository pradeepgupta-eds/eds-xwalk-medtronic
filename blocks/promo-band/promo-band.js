/**
 * promo-band — Medtronic "Careers" / "Investors" full-bleed promo banner.
 *
 * Authored/decorated structure (before this runs):
 *   .promo-band
 *     > div > div > p "Promo Band"        <- stray import label row (removed)
 *     > div
 *       > div.promo-band-img-col > picture <- careers photo | investors icon
 *       > div  eyebrow, h2, desc, primary link, 2 secondary links, 3 icon links
 *
 * We detect the variant from the image (raster photo => dark careers banner,
 * svg/no image => light investors banner), promote a photo to a full-bleed
 * background, and regroup the links into: primary CTA, secondary links
 * (top-right) and a row of icon quick-links (bottom-right).
 */
export default function decorate(block) {
  // 1. Drop the stray "Promo Band" label row created during import.
  const rows = [...block.children];
  if (rows.length > 1) {
    const first = rows[0];
    const label = first.textContent.trim().toLowerCase().replace(/[\s-]+/g, ' ');
    if (first.children.length === 1 && label === 'promo band') {
      first.remove();
    }
  }

  const row = block.firstElementChild;
  if (!row) return;
  row.classList.add('promo-band-row');

  const cells = [...row.children];
  const imgCell = cells.find((c) => c.querySelector('picture, img'));
  const textCell = cells.find((c) => c !== imgCell) || cells[cells.length - 1];

  // 2. Determine variant from the image cell.
  const img = imgCell ? imgCell.querySelector('img') : null;
  const src = img ? (img.getAttribute('src') || img.currentSrc || '') : '';
  const isPhoto = /\.(jpe?g|png|webp|gif)(\?|#|$)/i.test(src) && !/\.svg(\?|#|$)/i.test(src);
  const dark = !!imgCell && isPhoto;
  block.classList.add(dark ? 'promo-band-dark' : 'promo-band-light');

  // 3. Background handling.
  if (dark && imgCell) {
    const bg = document.createElement('div');
    bg.className = 'promo-band-bg';
    bg.append(imgCell.querySelector('picture') || img);
    block.prepend(bg);
    imgCell.remove();
  } else if (imgCell) {
    // Light variant: the imported "image" is only a stray stock icon — drop it.
    imgCell.remove();
  }

  if (!textCell) return;
  textCell.classList.add('promo-band-content');

  // 4. Classify the links inside the text column.
  const linkParas = [...textCell.querySelectorAll(':scope > p')].filter((p) => p.querySelector('a'));
  const iconParas = linkParas.filter((p) => p.querySelector('a img, a picture'));
  const plainParas = linkParas.filter((p) => !p.querySelector('a img, a picture'));

  const [primaryPara, ...secondaryParas] = plainParas;
  if (primaryPara) primaryPara.classList.add('promo-band-cta');

  // 5. Move secondary links to a top-right group.
  if (secondaryParas.length) {
    const secondary = document.createElement('div');
    secondary.className = 'promo-band-secondary';
    secondaryParas.forEach((p) => secondary.append(p));
    block.append(secondary);
  }

  // 6. Move icon links into a bottom-right quick-links row.
  if (iconParas.length) {
    const list = document.createElement('ul');
    list.className = 'promo-band-quicklinks';
    iconParas.forEach((p) => {
      const li = document.createElement('li');
      li.append(p.querySelector('a'));
      list.append(li);
      p.remove();
    });
    block.append(list);
  }
}
