/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroImpactParser from './parsers/hero-impact.js';
import columnsPromoCardParser from './parsers/columns-promo-card.js';
import cardsTopicParser from './parsers/cards-topic.js';
import cardsTilesParser from './parsers/cards-tiles.js';
import cardsArticlesParser from './parsers/cards-articles.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/medtronic-cleanup.js';
import sectionsTransformer from './transformers/medtronic-sections.js';
import dmImagesTransformer from './transformers/medtronic-dm-images.js';

const parsers = {
  'hero-impact': heroImpactParser,
  'columns-promo-card': columnsPromoCardParser,
  'cards-topic': cardsTopicParser,
  'cards-tiles': cardsTilesParser,
  'cards-articles': cardsArticlesParser,
};

const PAGE_TEMPLATE = {
  name: 'our-impact',
  description: 'Medtronic Our Impact overview',
  urls: ['https://www.medtronic.com/en-us/our-impact.html'],
  sections: [
    { id: 'impact-hero', name: 'impact-hero', selector: '#container-f654cca8c6' },
    { id: 'labs-promo', name: 'labs-promo', selector: '#container-107b7b993b' },
    { id: 'topic-cards-grid', name: 'topic-cards-grid', selector: '#container-3266305601' },
    { id: 'where-health-promo', name: 'where-health-promo', selector: '#container-60773eb30d' },
    { id: 'more-about-tiles', name: 'more-about-tiles', selector: '#container-6595faf5b7' },
    { id: 'article-grid', name: 'article-grid', selector: '#container-7b6f81c377' },
  ],
  blocks: [
    { name: 'hero-impact', instances: ['#container-f654cca8c6 .banner', '.banner'] },
    { name: 'columns-promo-card', instances: ['#container-107b7b993b', '#container-60773eb30d'] },
    { name: 'cards-topic', instances: ['#container-3266305601'] },
    { name: 'cards-tiles', instances: ['#container-6595faf5b7'] },
    { name: 'cards-articles', instances: ['#container-7b6f81c377'] },
  ],
};

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

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    // Collect block elements across all instance selectors, deduped by element.
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

    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

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
