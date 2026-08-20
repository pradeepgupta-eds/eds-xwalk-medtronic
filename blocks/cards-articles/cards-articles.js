import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const PAGE_SIZE = 6;

/**
 * Cards Articles variant.
 * Renders a grid of article/story cards (image + category + linked heading)
 * with an "Explore topics" filter and a "Load more" button. Each card's
 * category (first paragraph of the body) drives client-side filtering.
 * @param {Element} block The cards-articles block element
 */
export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-articles-card-image';
      else div.className = 'cards-articles-card-body';
    });
    // derive a filter category from the first paragraph of the card body
    const body = li.querySelector('.cards-articles-card-body');
    const category = body?.querySelector('p')?.textContent?.trim();
    if (category) li.dataset.category = category.toLowerCase();
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Build the topic filter from the distinct card categories.
  const categories = [...new Set([...ul.children]
    .map((li) => li.dataset.category)
    .filter(Boolean))];
  const controls = document.createElement('div');
  controls.className = 'cards-articles-filter';
  const label = document.createElement('span');
  label.className = 'cards-articles-filter-label';
  label.textContent = 'Explore topics:';
  const select = document.createElement('select');
  select.className = 'cards-articles-select';
  const allOpt = document.createElement('option');
  allOpt.value = '';
  allOpt.textContent = 'All';
  select.append(allOpt);
  categories.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.replace(/\b\w/g, (c) => c.toUpperCase());
    select.append(opt);
  });
  controls.append(label, select);

  // "Load more" button reveals the next page of cards.
  const loadMore = document.createElement('button');
  loadMore.type = 'button';
  loadMore.className = 'cards-articles-load-more';
  loadMore.textContent = 'Load more';

  let visible = PAGE_SIZE;

  const apply = () => {
    const filter = select.value;
    const matches = [...ul.children].filter((li) => !filter || li.dataset.category === filter);
    [...ul.children].forEach((li) => { li.hidden = true; });
    matches.slice(0, visible).forEach((li) => { li.hidden = false; });
    loadMore.hidden = matches.length <= visible;
  };

  select.addEventListener('change', () => { visible = PAGE_SIZE; apply(); });
  loadMore.addEventListener('click', () => { visible += PAGE_SIZE; apply(); });

  block.textContent = '';
  block.append(controls, ul, loadMore);
  apply();
}
