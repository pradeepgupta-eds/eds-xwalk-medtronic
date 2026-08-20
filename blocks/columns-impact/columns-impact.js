export default function decorate(block) {
  // Imported content carries a leading label row ("Columns Impact"). Drop it
  // so the first row holds real content.
  const firstRow = block.firstElementChild;
  if (
    firstRow
    && firstRow.children.length === 1
    && firstRow.textContent.trim().toLowerCase() === 'columns impact'
  ) {
    firstRow.remove();
  }

  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-impact-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1) {
        // dedicated photo cell (report-card variant)
        col.classList.add('columns-impact-img-col');
        return;
      }

      const paras = [...col.querySelectorAll(':scope > p')];
      if (paras.length < 2) return;

      // this is the text cell: label eyebrow / headline / copy / cta
      col.classList.add('columns-impact-content');
      const ctas = paras.filter((p) => p.querySelector('a'));
      const textParas = paras.filter((p) => !p.querySelector('a'));

      if (textParas[0]) textParas[0].classList.add('columns-impact-eyebrow');
      if (textParas[1]) textParas[1].classList.add('columns-impact-headline');
      textParas.slice(2).forEach((p) => p.classList.add('columns-impact-copy'));
      ctas.forEach((p) => p.classList.add('columns-impact-cta'));
    });
  });
}
