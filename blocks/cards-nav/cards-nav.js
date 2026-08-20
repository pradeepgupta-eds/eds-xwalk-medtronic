import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Cards Nav variant.
 * Renders a grid of white BORDERED navigation tiles, each with a blue
 * (electric-blue) left-accent bar and a single linked heading. No images, no
 * icons, no body copy. Matches the source design of the Medtronic
 * "Healthcare professionals" section tile grid (Products, Specialties,
 * Services, ...).
 *
 * Distinct from the project's other cards variants:
 *  - cards-tiles:    colored blue full panels + circular icon + label
 *  - cards-awards:   bordered cards with a centered logo + title + description
 *  - cards-topic:    photo teaser cards (image + category + linked heading)
 *  - cards-stats:    icon + large figure + label
 *  - cards-articles: filterable grid with a topic select + Load more
 * This variant is a plain bordered link-tile grid (heading only).
 * @param {Element} block The cards-nav block element
 */
export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-nav-card-image';
      else div.className = 'cards-nav-card-body';
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
