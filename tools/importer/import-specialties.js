/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroMenuParser from './parsers/hero-menu.js';
import cardsNavParser from './parsers/cards-nav.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/medtronic-cleanup.js';
import sectionsTransformer from './transformers/medtronic-sections.js';

const parsers = {
  'hero-menu': heroMenuParser,
  'cards-nav': cardsNavParser,
};

const PAGE_TEMPLATE = {
  name: 'specialties',
  description: 'Medtronic Specialties listing page',
  urls: ['https://www.medtronic.com/en-us/healthcare-professionals/specialties.html'],
  sections: [
    { id: 'hero', name: 'hero', selector: 'div.hero-main-content' },
    { id: 'nav-tiles', name: 'nav-tiles', selector: 'div.multi-teaser-layout' },
  ],
  blocks: [
    { name: 'hero-menu', instances: ['div.hero-main-content'] },
    { name: 'cards-nav', instances: ['div.multi-teaser-layout'] },
  ],
};

const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
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
