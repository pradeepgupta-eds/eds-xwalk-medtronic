/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-hero-landing-krko.js
  var import_hero_landing_krko_exports = {};
  __export(import_hero_landing_krko_exports, {
    default: () => import_hero_landing_krko_default
  });

  // tools/importer/parsers/hero-banner-krko.js
  function cleanButton(a, document2) {
    var _a;
    const href = a.getAttribute("href");
    const txt = (((_a = a.querySelector(".cmp-button__text")) == null ? void 0 : _a.textContent) || a.textContent || "").trim();
    if (!txt) return null;
    if (href) {
      const link = document2.createElement("a");
      link.href = href;
      link.textContent = txt;
      return link;
    }
    const p = document2.createElement("p");
    p.textContent = txt;
    return p;
  }
  function parse(element, { document: document2 }) {
    const contentNodes = [];
    element.querySelectorAll(".cmp-text > p, .cmp-text > h1, .cmp-text > h2, .cmp-text > h3, .cmp-text > h4, .cmp-text > h5, .cmp-text > h6, .cmp-title__text").forEach((el) => contentNodes.push(el));
    element.querySelectorAll("a.cmp-button").forEach((a) => {
      const b = cleanButton(a, document2);
      if (b) contentNodes.push(b);
    });
    if (!contentNodes.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const textCell = [document2.createComment(" field:text "), ...contentNodes];
    const cells = [];
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-hero.js
  function cleanButton2(a, document2) {
    var _a;
    const href = a.getAttribute("href");
    const txt = (((_a = a.querySelector(".cmp-button__text")) == null ? void 0 : _a.textContent) || a.textContent || "").trim();
    if (!txt) return null;
    if (href) {
      const link = document2.createElement("a");
      link.href = href;
      link.textContent = txt;
      return link;
    }
    const p = document2.createElement("p");
    p.textContent = txt;
    return p;
  }
  function buildSlideContent(item, document2) {
    const nodes = [];
    item.querySelectorAll(".cmp-text > p, .cmp-text > h1, .cmp-text > h2, .cmp-text > h3, .cmp-text > h4, .cmp-text > h5, .cmp-text > h6, .cmp-title__text").forEach((el) => nodes.push(el));
    item.querySelectorAll("a.cmp-button").forEach((a) => {
      const b = cleanButton2(a, document2);
      if (b) nodes.push(b);
    });
    return nodes;
  }
  function parse2(element, { document: document2 }) {
    const items = element.querySelectorAll(".cmp-carousel__item");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".cmp-image img, img.cmp-image__image");
      const content = buildSlideContent(item, document2);
      if (!img && !content.length) return;
      const imageCell = img ? [document2.createComment(" field:media_image "), img] : "";
      const contentCell = content.length ? [document2.createComment(" field:content_text "), ...content] : "";
      cells.push([imageCell, contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-news-krko.js
  function parse3(element, { document: document2 }) {
    const cards = element.querySelectorAll(".card-module");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".cmp-image img, img.cmp-image__image");
      const content = [];
      const titleLink = card.querySelector(".cmp-title__text a, .cmp-title__link");
      if (titleLink) {
        const h = document2.createElement("h3");
        const a = document2.createElement("a");
        a.href = titleLink.getAttribute("href") || "";
        a.textContent = titleLink.textContent.trim();
        h.append(a);
        content.push(h);
      }
      const ctaLink = card.querySelector(".cmp-text p a, .cmp-text a");
      if (ctaLink) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.href = ctaLink.getAttribute("href") || "";
        a.textContent = ctaLink.textContent.trim();
        p.append(a);
        content.push(p);
      }
      if (!img && !content.length) return;
      const imageCell = img ? [document2.createComment(" field:media_image "), img] : "";
      const contentCell = content.length ? [document2.createComment(" field:content_text "), ...content] : "";
      cells.push([imageCell, contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo-card-krko.js
  function cleanButton3(a, document2) {
    var _a;
    const href = a.getAttribute("href");
    const txt = (((_a = a.querySelector(".cmp-button__text")) == null ? void 0 : _a.textContent) || a.textContent || "").trim();
    if (!txt) return null;
    const p = document2.createElement("p");
    if (href) {
      const link = document2.createElement("a");
      link.href = href;
      link.textContent = txt;
      p.append(link);
    } else {
      p.textContent = txt;
    }
    return p;
  }
  function parse4(element, { document: document2 }) {
    const img = element.querySelector(".cmp-image img, img.cmp-image__image");
    const textNodes = [];
    element.querySelectorAll(".cmp-text > p, .cmp-text > h1, .cmp-text > h2, .cmp-text > h3, .cmp-text > h4, .cmp-text > h5, .cmp-text > h6, .cmp-title__text").forEach((el) => textNodes.push(el));
    element.querySelectorAll("a.cmp-button").forEach((a) => {
      const b = cleanButton3(a, document2);
      if (b) textNodes.push(b);
    });
    if (!img && !textNodes.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const row = [];
    if (img) row.push([img]);
    row.push(textNodes.length ? textNodes : "");
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-promo-card", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo-krko.js
  function cleanButton4(a, document2) {
    var _a;
    const href = a.getAttribute("href");
    const txt = (((_a = a.querySelector(".cmp-button__text")) == null ? void 0 : _a.textContent) || a.textContent || "").trim();
    if (!txt) return null;
    const p = document2.createElement("p");
    if (href) {
      const link = document2.createElement("a");
      link.href = href;
      link.textContent = txt;
      p.append(link);
    } else {
      p.textContent = txt;
    }
    return p;
  }
  function parse5(element, { document: document2 }) {
    const img = element.querySelector(".cmp-image img, img.cmp-image__image");
    const textNodes = [];
    element.querySelectorAll(".cmp-text > p, .cmp-text > h1, .cmp-text > h2, .cmp-text > h3, .cmp-text > h4, .cmp-text > h5, .cmp-text > h6, .cmp-title__text").forEach((el) => textNodes.push(el));
    element.querySelectorAll("a.cmp-button").forEach((a) => {
      const b = cleanButton4(a, document2);
      if (b) textNodes.push(b);
    });
    if (!img && !textNodes.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const row = [];
    if (img) row.push([img]);
    row.push(textNodes.length ? textNodes : "");
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/medtronic-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".onetrust-pc-dark-filter",
        '[class*="ot-sdk"]',
        ".ot-text-resize"
      ]);
      WebImporter.DOMUtils.remove(element, ["div.share"]);
      WebImporter.DOMUtils.remove(element, ["div.warn-on-leave"]);
      WebImporter.DOMUtils.remove(element, ["div.xfpage"]);
      WebImporter.DOMUtils.remove(element, [
        '[id^="subnav-"]',
        ".quicklinks",
        ".quicklinks-subnav",
        ".mdt-subnav",
        ".subnav"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#notification-container",
        "#outdated",
        "#search-overlay"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".com-header-container",
        ".breadcrumb"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "script",
        "style",
        "link",
        "noscript",
        "iframe"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
        el.removeAttribute("data-analytics");
      });
    }
  }

  // tools/importer/transformers/medtronic-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-hero-landing-krko.js
  var parsers = {
    "hero-banner": parse,
    "carousel-hero": parse2,
    "carousel-news": parse3,
    "columns-promo-card": parse4,
    "columns-promo": parse5
  };
  var PAGE_TEMPLATE = {
    name: "hero-landing",
    description: "Hero banner at top followed by stacked content/feature sections; homepage and top-level overview pages",
    urls: [
      "https://www.medtronic.com/kr-ko/index.html"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [".lg-hero.hero-module.active-slide", ".hero-module.lg-hero:first-of-type"]
      },
      {
        name: "carousel-hero",
        instances: [".pos-relative.aem-GridColumn--offset--default--0"]
      },
      {
        name: "carousel-news",
        instances: [".news-media-section"]
      },
      {
        name: "columns-promo-card",
        instances: [".med-hero.hero-module:not(.dark)", ".pos-relative:not(.aem-GridColumn--offset--default--0)"]
      },
      {
        name: "columns-promo",
        instances: [".dark.med-hero.hero-module", ".lg-hero.hero-module:not(.active-slide)"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_hero_landing_krko_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_hero_landing_krko_exports);
})();
