/**
 * stats-band — "Who we are" split band.
 * Left cell: eyebrow + heading + copy + CTA.
 * Right cell: media (gif/video), a stats info-bar, and a key-facts link.
 */
export default function decorate(block) {
  // Remove the stray block-label row that the import produced
  // (a single-cell row whose only text is the literal block name).
  [...block.children].forEach((row) => {
    if (row.children.length === 1 && row.textContent.trim().toLowerCase() === 'stats band') {
      row.remove();
    }
  });

  const contentRow = block.querySelector(':scope > div');
  if (!contentRow) return;
  contentRow.classList.add('stats-band-row');

  const [textCell, mediaCell] = [...contentRow.children];
  if (textCell) textCell.classList.add('stats-band-text');
  if (!mediaCell) return;
  mediaCell.classList.add('stats-band-media');

  // Mark the media image paragraph.
  const imgP = mediaCell.querySelector(':scope > p picture')?.closest('p');
  if (imgP) imgP.classList.add('stats-band-media-img');

  // Gather stat paragraphs (those containing a <strong> figure) into an info-bar.
  const statParas = [...mediaCell.querySelectorAll(':scope > p')].filter((p) => p.querySelector('strong'));
  if (statParas.length) {
    const bar = document.createElement('div');
    bar.className = 'stats-band-info-bar';
    statParas[0].before(bar);
    statParas.forEach((p) => {
      const strong = p.querySelector('strong');
      const item = document.createElement('div');
      item.className = 'stats-band-info-block';

      const num = document.createElement('span');
      num.className = 'stats-band-number';
      num.textContent = strong.textContent.trim();

      const label = document.createElement('span');
      label.className = 'stats-band-label';
      label.textContent = p.textContent.replace(strong.textContent, '').trim();

      item.append(num, label);
      bar.append(item);
      p.remove();
    });
  }

  // Mark the trailing key-facts link paragraph.
  const linkP = [...mediaCell.querySelectorAll(':scope > p')].find((p) => p.querySelector('a'));
  if (linkP) linkP.classList.add('stats-band-keyfacts');
}
