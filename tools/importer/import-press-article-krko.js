/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/medtronic-cleanup.js';

// PAGE TEMPLATE CONFIGURATION - press-article (kr-ko). Pure default content: no blocks.
const PAGE_TEMPLATE = {
  name: 'press-article',
  description: 'Press release / article page: heading, dateline, body copy with inline media, boilerplate footer. Pure default content.',
  urls: [
    'https://www.medtronic.com/kr-ko/our-company/press/2026-08-medtronic-korea-simplera-launch.html',
  ],
  blocks: [],
};

// TRANSFORMER REGISTRY - cleanup only (no sections; default-content template)
const transformers = [cleanupTransformer];

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

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    // Article content lives inside <main>; scope to it when present so the
    // header (mobile menu + country selector) and footer chrome are excluded
    // without relying on removing every nav container by selector.
    const main = document.querySelector('main') || document.body;

    // 1. beforeTransform (chrome cleanup: header/footer/nav/cookie/analytics)
    executeTransformers('beforeTransform', main, payload);

    // 2. No blocks for this template — body content flows as default content.

    // 3. afterTransform (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 4. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 5. Sanitized path from source pathname (root -> /index guard)
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
        blocks: [],
      },
    }];
  },
};
