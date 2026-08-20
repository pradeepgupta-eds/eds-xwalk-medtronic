/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-connect
 * Base block: columns
 * Source URL: https://www.medtronic.com/en-us/healthcare-professionals/specialties/acute-care-monitoring.html
 * Generated: 2026-08-20
 *
 * Columns block (3 columns, 1 content row): NO field hints (columns blocks use
 * default content only). Table = 1 name row + 1 content row with 3 cells:
 *   Cell 1 -> social-follow panel ("Follow us on social media." + LinkedIn /
 *             Facebook links)
 *   Cell 2 -> contact panel ("See how our team can help." + "Contact a
 *             representative" CTA button)
 *   Cell 3 -> image engagement band (employee/HCP photo)
 *
 * IMPORTANT — the three panels are SIBLINGS of the intro: the instance selector
 * (#container-d06c5dbb8b) is only the "Connect with us." intro heading +
 * paragraph. The three connect panels (#container-9808e238bc social,
 * #container-af66a5aaea contact, #container-266e23947d image) are sibling
 * columns under the shared parent grid (#container-5e0f9af230). The parser walks
 * up to that parent to collect them. The intro heading + lead paragraph are
 * prepended to the first cell so no content is lost.
 *
 * DM/Scene7: the image is treated as a normal <img>; the DM transformer rewrites
 * any DM URL downstream.
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
  element.querySelectorAll('meta').forEach((m) => m.remove());

  // Walk up to the shared parent grid that also holds the sibling panels.
  const grid = element.closest('.aem-Grid');
  const parentContainer = grid
    ? (grid.parentElement && grid.parentElement.closest('.cmp-container'))
    : element;
  const scope = parentContainer || element;

  // Intro lead-in (from the instance element itself).
  const introBlock = element.querySelector('.cmp-text');
  const introNodes = [];
  if (introBlock) {
    Array.from(introBlock.children).forEach((n) => {
      if (n.textContent && n.textContent.trim()) introNodes.push(n.cloneNode(true));
    });
  }

  // Identify the three panels among the parent grid's child columns
  // (skip the intro container itself).
  const panelContainers = Array.from(scope.querySelectorAll('.cmp-container'))
    .filter((c) => c !== element && c.id !== 'container-d06c5dbb8b')
    .filter((c) => c.querySelector('.cmp-text, .image, .button'))
    // keep only top-level panels (not nested inside another kept panel)
    .filter((c, _i, arr) => !arr.some((o) => o !== c && o.contains(c)));

  const buildPanelCell = (panel) => {
    const cell = [];
    const textBlock = panel.querySelector('.cmp-text');
    if (textBlock) {
      Array.from(textBlock.children).forEach((n) => {
        if (n.textContent && n.textContent.trim()) cell.push(n.cloneNode(true));
      });
    }
    const img = panel.querySelector('.image img[src]');
    if (img) cell.push(img.cloneNode(true));
    const cta = panel.querySelector('.button a[href], a.cmp-button[href]');
    if (cta && cta.textContent.trim()) {
      const a = document.createElement('a');
      a.setAttribute('href', cta.getAttribute('href'));
      const label = cta.querySelector('.cmp-button__text');
      a.textContent = (label ? label.textContent : cta.textContent).trim();
      const p = document.createElement('p');
      p.append(a);
      cell.push(p);
    }
    return cell;
  };

  const cellsRow = panelContainers.map(buildPanelCell);

  // Prepend the intro lead-in to the first cell.
  if (introNodes.length) {
    if (cellsRow.length) {
      cellsRow[0] = [...introNodes, ...cellsRow[0]];
    } else {
      cellsRow.push(introNodes);
    }
  }

  // Empty-block guard.
  if (cellsRow.length === 0 || cellsRow.every((c) => c.length === 0)) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // createBlock adds the block-name header row automatically.
  const cells = [cellsRow.map((c) => (c.length ? c : ''))];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-connect', cells });
  element.replaceWith(block);
}
