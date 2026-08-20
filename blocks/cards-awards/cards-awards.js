import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/*
 * Cards Awards variant.
 * Row of uniform bordered recognition/award cards, each with a centered award
 * logo image, a bold externally-linked title and a short description sentence.
 * Matches the Medtronic "Impact reporting" recognition cards (Ethisphere, JUST,
 * Fortune, S&P Global). Distinct from cards-topic (full-bleed photo teasers),
 * cards-tiles (blue icon-link panels) and cards-stats (figure + label).
 */
export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-awards-card-image';
      else div.className = 'cards-awards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
