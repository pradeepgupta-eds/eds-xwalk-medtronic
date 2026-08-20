/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroStatsParser from './parsers/hero-stats.js';
import columnsPromoCardParser from './parsers/columns-promo-card.js';
import cardsTopicParser from './parsers/cards-topic.js';
import cardsTilesParser from './parsers/cards-tiles.js';
import cardsArticlesParser from './parsers/cards-articles.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/medtronic-cleanup.js';
import sectionsTransformer from './transformers/medtronic-sections.js';
import dmImagesTransformer from './transformers/medtronic-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'hero-stats': heroStatsParser,
  'columns-promo-card': columnsPromoCardParser,
  'cards-topic': cardsTopicParser,
  'cards-tiles': cardsTilesParser,
  'cards-articles': cardsArticlesParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'our-company',
  description: 'Medtronic Our Company overview page',
  urls: [
    'https://www.medtronic.com/en-us/our-company.html',
  ],
  sections: [
    { id: 'stats-hero', name: 'stats-hero', selector: '#container-5d1a569867' },
    { id: 'promo-stories', name: 'promo-stories', selector: '#container-3c577964f4' },
    { id: 'topic-cards-grid', name: 'topic-cards-grid', selector: '#container-0a7ecc757b' },
    { id: 'promo-impact', name: 'promo-impact', selector: '#container-9c8bea0160' },
    { id: 'explore-tiles', name: 'explore-tiles', selector: '#container-eeba63a201' },
    { id: 'article-grid', name: 'article-grid', selector: '#container-a5f4363e21' },
  ],
  blocks: [
    { name: 'hero-stats', instances: ['#container-5d1a569867 .banner', '.banner'] },
    { name: 'columns-promo-card', instances: ['#container-3c577964f4', '#container-9c8bea0160'] },
    { name: 'cards-topic', instances: ['#container-0a7ecc757b'] },
    { name: 'cards-tiles', instances: ['#container-eeba63a201'] },
    { name: 'cards-articles', instances: ['#container-a5f4363e21'] },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then sections, then DM images (afterTransform)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
  dmImagesTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform (initial cleanup + section break markers)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page — collect elements across ALL instance selectors,
    //    deduped by element identity so multi-instance blocks (e.g. the two
    //    promo cards) are all captured while overlapping selectors that resolve
    //    to the same element (e.g. hero-stats `.banner` variants) parse once.
    const seen = new Set();
    const pageBlocks = [];
    PAGE_TEMPLATE.blocks.forEach((blockDef) => {
      let matchedAny = false;
      blockDef.instances.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          matchedAny = true;
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
      if (!matchedAny) console.warn(`Block "${blockDef.name}" - no selector matched`);
    });

    // 3. Parse each block (skip elements already replaced by a prior parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata + DM images)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root/homepage URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
