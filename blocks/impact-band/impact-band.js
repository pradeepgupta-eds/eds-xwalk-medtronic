export default function decorate(block) {
  // Imported content carries a leading label row ("Impact Band"). Drop it
  // so the first row holds real content.
  const firstRow = block.firstElementChild;
  if (
    firstRow
    && firstRow.children.length === 1
    && firstRow.textContent.trim().toLowerCase() === 'impact band'
  ) {
    firstRow.remove();
  }

  const cols = [...block.firstElementChild.children];
  block.classList.add(`impact-band-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1) {
        // dedicated photo cell (report-card variant)
        col.classList.add('impact-band-img-col');
        return;
      }

      const paras = [...col.querySelectorAll(':scope > p')];
      if (paras.length < 2) return;

      // this is the text cell: label eyebrow / headline / copy / cta
      col.classList.add('impact-band-content');
      const ctas = paras.filter((p) => p.querySelector('a'));
      const textParas = paras.filter((p) => !p.querySelector('a'));

      if (textParas[0]) textParas[0].classList.add('impact-band-eyebrow');
      if (textParas[1]) textParas[1].classList.add('impact-band-headline');
      textParas.slice(2).forEach((p) => p.classList.add('impact-band-copy'));
      ctas.forEach((p) => p.classList.add('impact-band-cta'));
    });
  });
}
