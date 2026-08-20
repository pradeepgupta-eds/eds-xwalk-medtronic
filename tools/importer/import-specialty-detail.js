/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import columnsVideoParser from './parsers/columns-video.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsLogosParser from './parsers/cards-logos.js';
import columnsConnectParser from './parsers/columns-connect.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/medtronic-cleanup.js';
import sectionsTransformer from './transformers/medtronic-sections.js';
import dmImagesTransformer from './transformers/medtronic-dm-images.js';

const parsers = {
  'hero-banner': heroBannerParser,
  'columns-video': columnsVideoParser,
  'cards-product': cardsProductParser,
  'cards-feature': cardsFeatureParser,
  'cards-logos': cardsLogosParser,
  'columns-connect': columnsConnectParser,
};

const PAGE_TEMPLATE = {
  name: 'specialty-detail',
  description: 'Medtronic specialty detail page (Acute Care & Monitoring)',
  urls: ['https://www.medtronic.com/en-us/healthcare-professionals/specialties/acute-care-monitoring.html'],
  sections: [
    { id: 'hero', name: 'hero', selector: '.hero-banner.herobanner' },
    { id: 'video-empower', name: 'video-empower', selector: '#container-32cfe2f49b' },
    { id: 'featured-products', name: 'featured-products', selector: '#container-36081a734a' },
    { id: 'education', name: 'education', selector: '#container-e2ed390e5a' },
    { id: 'investing', name: 'investing', selector: '#container-976abc859c' },
    { id: 'partners', name: 'partners', selector: '#container-e58f54f8a6' },
    { id: 'connect', name: 'connect', selector: '#container-d06c5dbb8b' },
  ],
  blocks: [
    { name: 'hero-banner', instances: ['.hero-banner.herobanner'] },
    { name: 'columns-video', instances: ['#container-32cfe2f49b'] },
    { name: 'cards-product', instances: ['#container-36081a734a'] },
    { name: 'cards-feature', instances: ['#container-e2ed390e5a', '#container-976abc859c'] },
    { name: 'cards-logos', instances: ['#container-e58f54f8a6'] },
    { name: 'columns-connect', instances: ['#container-d06c5dbb8b'] },
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
