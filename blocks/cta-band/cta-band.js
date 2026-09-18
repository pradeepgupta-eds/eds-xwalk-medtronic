/**
 * columns-cta — dark full-width call-to-action banner.
 * Left cell: eyebrow + headline + short copy.
 * Right cell: single arrowed "Find out" link.
 * The enclosing .section.dark supplies the dark background and white text.
 */
export default function decorate(block) {
  // Remove the stray block-label row that the import produced
  // (a single-cell row whose only text is the literal block name).
  [...block.children].forEach((row) => {
    if (row.children.length === 1 && row.textContent.trim().toLowerCase() === 'columns cta') {
      row.remove();
    }
  });

  const contentRow = block.querySelector(':scope > div');
  if (!contentRow) return;
  contentRow.classList.add('columns-cta-row');

  const [textCell, actionCell] = [...contentRow.children];
  if (textCell) {
    textCell.classList.add('columns-cta-text');
    // eyebrow = first paragraph, headline = second paragraph
    const paras = [...textCell.querySelectorAll(':scope > p')];
    if (paras[0]) paras[0].classList.add('columns-cta-eyebrow');
    if (paras[1]) paras[1].classList.add('columns-cta-headline');
    if (paras[2]) paras[2].classList.add('columns-cta-copy');
  }
  if (actionCell) actionCell.classList.add('columns-cta-action');
}
