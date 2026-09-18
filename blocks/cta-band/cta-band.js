/**
 * cta-band — dark full-width call-to-action banner.
 * Left cell: eyebrow + headline + short copy.
 * Right cell: single arrowed "Find out" link.
 * The enclosing .section.dark supplies the dark background and white text.
 */
export default function decorate(block) {
  // Remove the stray block-label row that the import produced
  // (a single-cell row whose only text is the literal block name).
  [...block.children].forEach((row) => {
    if (row.children.length === 1 && row.textContent.trim().toLowerCase() === 'cta band') {
      row.remove();
    }
  });

  const contentRow = block.querySelector(':scope > div');
  if (!contentRow) return;
  contentRow.classList.add('cta-band-row');

  const [textCell, actionCell] = [...contentRow.children];
  if (textCell) {
    textCell.classList.add('cta-band-text');
    // eyebrow = first paragraph, headline = second paragraph
    const paras = [...textCell.querySelectorAll(':scope > p')];
    if (paras[0]) paras[0].classList.add('cta-band-eyebrow');
    if (paras[1]) paras[1].classList.add('cta-band-headline');
    if (paras[2]) paras[2].classList.add('cta-band-copy');
  }
  if (actionCell) actionCell.classList.add('cta-band-action');
}
