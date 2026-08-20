/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsStatsParser from './parsers/cards-stats.js';
import cardsAwardsParser from './parsers/cards-awards.js';
import columnsPromoCardParser from './parsers/columns-promo-card.js';
import accordionLinksParser from './parsers/accordion-links.js';
import cardsArticlesParser from './parsers/cards-articles.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/medtronic-cleanup.js';
import sectionsTransformer from './transformers/medtronic-sections.js';

const parsers = {
  'hero-banner': heroBannerParser,
  'cards-stats': cardsStatsParser,
  'cards-awards': cardsAwardsParser,
  'columns-promo-card': columnsPromoCardParser,
  'accordion-links': accordionLinksParser,
  'cards-articles': cardsArticlesParser,
};

const PAGE_TEMPLATE = {
  name: 'impact-reporting',
  description: 'Medtronic Impact Reporting page',
  urls: ['https://www.medtronic.com/en-us/our-impact/impact-reporting.html'],
  sections: [
    { id: 'impact-hero', name: 'impact-hero', selector: '#container-06d55a2869' },
    { id: 'year-in-review', name: 'year-in-review', selector: '#container-8df4d32336' },
    { id: 'recognition-cards', name: 'recognition-cards', selector: '#container-78f03a6dc7' },
    { id: 'ceo-dialogue-promo', name: 'ceo-dialogue-promo', selector: '#container-f890070efe' },
    { id: 'esg-disclosures-accordion', name: 'esg-disclosures-accordion', selector: '#container-d473c47fc3' },
    { id: 'article-grid', name: 'article-grid', selector: '#container-7a6689b4bf' },
  ],
  blocks: [
    { name: 'hero-banner', instances: ['#container-06d55a2869'] },
    { name: 'cards-stats', instances: ['#container-8df4d32336'] },
    { name: 'cards-awards', instances: ['#container-78f03a6dc7'] },
    { name: 'columns-promo-card', instances: ['#container-f890070efe'] },
    { name: 'accordion-links', instances: ['#container-d473c47fc3'] },
    { name: 'cards-articles', instances: ['#container-7a6689b4bf'] },
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
