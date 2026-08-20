/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-video
 * Base block: columns
 * Source URL: https://www.medtronic.com/en-us/healthcare-professionals/specialties/acute-care-monitoring.html
 * Generated: 2026-08-20
 *
 * Columns block (2 columns, 1 content row): NO field hints (columns blocks use
 * default content only). Table = 1 name row + 1 content row with 2 cells:
 *   Cell 1 -> media (looping Scene7 video / poster image) on a grey panel
 *   Cell 2 -> text ("We empower healthcare professionals..." lead statement)
 *
 * IMPORTANT — media is a SIBLING column: the instance selector
 * (#container-32cfe2f49b) is only the TEXT column (a 5-col grid holding the
 * "We empower..." paragraph). The looping video lives in a sibling 6-col column
 * (`.mdtdynamicvideo.dynamicmedia` → `#container-cf3caa2644`) under the shared
 * parent grid (#container-c7dd06d557). The parser walks up to that parent to
 * find the media column. The video is a Scene7 player (blob-backed <video> + s7
 * sprite chrome) with NO real DM poster image present in the cleaned DOM, so the
 * media cell is emitted empty (the grey panel / column is preserved). The
 * separate DM/Scene7 transformer rewrites any DM <img> to a carrier anchor if
 * one is present.
 */
export default function parse(element, { document }) {
  element.querySelectorAll('style, script, noscript').forEach((n) => n.remove());
  element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());

  // Text column (the instance element itself).
  const textCell = [];
  const lead = element.querySelector('.cmp-text');
  if (lead) {
    Array.from(lead.children).forEach((n) => {
      if (n.textContent && n.textContent.trim()) textCell.push(n.cloneNode(true));
    });
  }

  // Media column — a sibling under the shared parent grid.
  const parent = element.closest('.aem-Grid') || (element.parentElement
    && element.parentElement.closest('.cmp-container'));
  const mediaCell = [];
  if (parent) {
    const videoCol = parent.querySelector('.mdtdynamicvideo, .dynamicmedia, .mdtdynamic-video');
    if (videoCol) {
      // Only a genuine DM/content poster (never a Scene7 player sprite).
      const poster = videoCol.querySelector(
        'img[src*="/is/image/"]:not([src*="s7sdk"]):not([src^="data:"])'
      );
      if (poster) mediaCell.push(poster.cloneNode(true));
    }
  }

  // Empty-block guard.
  if (textCell.length === 0 && mediaCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // createBlock adds the block-name header row automatically — do NOT include
  // it here or the name row is duplicated.
  const cells = [
    [mediaCell.length ? mediaCell : '', textCell.length ? textCell : ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-video', cells });
  element.replaceWith(block);
}
