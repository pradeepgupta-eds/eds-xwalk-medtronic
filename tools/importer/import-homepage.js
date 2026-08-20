/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroVideoParser from './parsers/hero-video.js';
import carouselNewsParser from './parsers/carousel-news.js';
import columnsStatsParser from './parsers/columns-stats.js';
import columnsCtaParser from './parsers/columns-cta.js';
import columnsImpactParser from './parsers/columns-impact.js';
import cardsStatsParser from './parsers/cards-stats.js';
import columnsPromoParser from './parsers/columns-promo.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/medtronic-cleanup.js';
import sectionsTransformer from './transformers/medtronic-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-video': heroVideoParser,
  'carousel-news': carouselNewsParser,
  'columns-stats': columnsStatsParser,
  'columns-cta': columnsCtaParser,
  'columns-impact': columnsImpactParser,
  'cards-stats': cardsStatsParser,
  'columns-promo': columnsPromoParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Medtronic corporate homepage with hero video/card, news carousel, CTA banners, our-impact cards, careers, investors, header and footer',
  urls: [
    'https://www.medtronic.com/en-us/index.html',
  ],
  sections: [
    { id: 'hero', name: 'hero', selector: 'div.hero-main-content' },
    { id: 'news-media', name: 'news-media', selector: '#News-Media' },
    { id: 'who-we-are', name: 'who-we-are', selector: '#who-we-are', style: 'dark' },
    { id: 'cta-blueprint', name: 'cta-blueprint', selector: 'div.wrapper-cta-banner', style: 'dark' },
    { id: 'our-impact', name: 'our-impact', selector: '#Our-Impact' },
    { id: 'careers', name: 'careers', selector: '#Careers' },
    { id: 'investors', name: 'investors', selector: '#ShareHolder' },
  ],
  blocks: [
    { name: 'hero-video', instances: ['div.hero-main-content', '#Header-video'] },
    { name: 'carousel-news', instances: ['#News-Media', '#scroller'] },
    { name: 'columns-stats', instances: ['#who-we-are'] },
    { name: 'columns-cta', instances: ['div.wrapper-cta-banner'] },
    { name: 'columns-impact', instances: ['#Our-Impact .our-impact-card', '#Our-Impact .access-card'] },
    { name: 'cards-stats', instances: ['#Our-Impact .div2', '#Our-Impact .div3', '#Our-Impact .div4'] },
    { name: 'columns-promo', instances: ['#Careers', 'div.wrapper-careers-section', '#ShareHolder', 'div.wrapper-investors-section'] },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then sections (adds breaks/metadata)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
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

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
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

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform (initial cleanup + section break markers)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

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

    // 4. afterTransform (final cleanup + section breaks/metadata)
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
