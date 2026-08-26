/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS (kr-ko variants use -krko suffix to avoid colliding with en-us parsers)
import heroBannerParser from './parsers/hero-banner-krko.js';
import carouselHeroParser from './parsers/carousel-hero.js';
import carouselNewsParser from './parsers/carousel-news-krko.js';
import columnsPromoCardParser from './parsers/columns-promo-card-krko.js';
import columnsPromoParser from './parsers/columns-promo-krko.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/medtronic-cleanup.js';
import sectionsTransformer from './transformers/medtronic-sections.js';

// PARSER REGISTRY - map block names (from page-templates.json) to kr-ko parser functions
const parsers = {
  'hero-banner': heroBannerParser,
  'carousel-hero': carouselHeroParser,
  'carousel-news': carouselNewsParser,
  'columns-promo-card': columnsPromoCardParser,
  'columns-promo': columnsPromoParser,
};

// PAGE TEMPLATE CONFIGURATION - embedded from page-templates.json (hero-landing)
const PAGE_TEMPLATE = {
  name: 'hero-landing',
  description: 'Hero banner at top followed by stacked content/feature sections; homepage and top-level overview pages',
  urls: [
    'https://www.medtronic.com/kr-ko/index.html',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['.lg-hero.hero-module.active-slide', '.hero-module.lg-hero:first-of-type'],
    },
    {
      name: 'carousel-hero',
      instances: ['.pos-relative.aem-GridColumn--offset--default--0'],
    },
    {
      name: 'carousel-news',
      instances: ['.news-media-section'],
    },
    {
      name: 'columns-promo-card',
      instances: ['.med-hero.hero-module:not(.dark)', '.pos-relative:not(.aem-GridColumn--offset--default--0)'],
    },
    {
      name: 'columns-promo',
      instances: ['.dark.med-hero.hero-module', '.lg-hero.hero-module:not(.active-slide)'],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup first; sections only when template defines 2+ sections
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
