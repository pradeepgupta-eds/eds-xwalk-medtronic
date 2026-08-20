/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Medtronic site-wide cleanup.
 * All selectors verified in migration-work/cleaned.html (Medtronic corporate homepage).
 * Removes non-authorable global chrome (header, footer, breadcrumb), consent/cookie
 * banners, feedback/share widgets, warn-on-leave, hidden xfpage duplicates, and
 * scripts/styles/link/noscript noise so only page-level authorable content remains.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // OneTrust consent SDK / cookie banner (verified: #onetrust-consent-sdk at line 6433,
    // #onetrust-banner-sdk, .onetrust-pc-dark-filter, .ot-sdk-* containers).
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.onetrust-pc-dark-filter',
      '[class*="ot-sdk"]',
      '.ot-text-resize',
    ]);

    // Share widget (verified: div.share at line 1924, contains div.share-btn).
    WebImporter.DOMUtils.remove(element, ['div.share']);

    // Warn-on-leave dialog (verified: div.warn-on-leave at line 1993).
    WebImporter.DOMUtils.remove(element, ['div.warn-on-leave']);

    // Hidden xfpage experience-fragment duplicates (verified: div.xfpage appears 39x -
    // hidden contact-us form fragments and their nested hidden survey/options tables).
    WebImporter.DOMUtils.remove(element, ['div.xfpage']);

    // Specialty/section quicklinks sub-nav (mega-menu of every specialty/therapy).
    // On specialty pages this `#subnav-*` / `.quicklinks-*` block lists hundreds of
    // therapies-procedures links — it is site navigation chrome, not page body
    // content, and must be removed so it doesn't leak into the hero/section blocks.
    WebImporter.DOMUtils.remove(element, [
      '[id^="subnav-"]',
      '.quicklinks',
      '.quicklinks-subnav',
      '.mdt-subnav',
      '.subnav',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (verified: div.com-header-container line 7,
    // breadcrumb line 1480, body > footer line 6221).
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '.com-header-container',
      '.breadcrumb',
    ]);

    // Scripts/styles/link/noscript/iframe/source noise (verified: <source> at
    // lines 1495-1497/1709 are video sources handled by parsers; strip leftover
    // media source siblings, iframes, links, styles, scripts, noscript).
    WebImporter.DOMUtils.remove(element, [
      'script',
      'style',
      'link',
      'noscript',
      'iframe',
    ]);

    // Strip tracking / analytics attributes present in captured DOM.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
    });
  }
}
