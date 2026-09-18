/**
 * banner-patients — full-width promo banner below the hero.
 * Collage image on the left, eyebrow + headline + arrowed CTA on the right.
 *
 * Authored/decorated structure (block/v1/block, flat model image/imageAlt/text):
 *   .banner-patients
 *     > div > div  (image row)  -> picture
 *     > div > div  (text row)   -> eyebrow <p>, headline <h3>, CTA <p><a>
 */
export default function decorate(block) {
  // Drop the stray "Banner Patients" label row if the import produced one.
  const first = block.firstElementChild;
  if (
    first
    && first.children.length === 1
    && first.textContent.trim().toLowerCase() === 'banner patients'
  ) {
    first.remove();
  }

  const rows = [...block.children];
  const imgRow = rows.find((r) => r.querySelector('picture, img'));
  const textRow = rows.find((r) => r !== imgRow);

  if (imgRow) {
    imgRow.classList.add('banner-patients-media');
    const cell = imgRow.firstElementChild;
    if (cell) cell.classList.add('banner-patients-media-inner');
  }

  if (textRow) {
    textRow.classList.add('banner-patients-content');
    const cell = textRow.firstElementChild || textRow;
    const paras = [...cell.querySelectorAll(':scope > p')];
    const heading = cell.querySelector('h1, h2, h3, h4');
    if (heading) heading.classList.add('banner-patients-headline');

    // eyebrow = first text-only paragraph; CTA = paragraph containing a link.
    const eyebrow = paras.find((p) => !p.querySelector('a') && p.textContent.trim());
    if (eyebrow) eyebrow.classList.add('banner-patients-eyebrow');
    paras
      .filter((p) => p.querySelector('a'))
      .forEach((p) => p.classList.add('banner-patients-cta'));
  }
}
