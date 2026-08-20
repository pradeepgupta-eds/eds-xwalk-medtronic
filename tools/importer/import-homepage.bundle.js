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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document: document2 }) {
    if (element.querySelector("#Header-video, .hero-main-content, .hero-jon__card")) {
      if (element.querySelector("#Header-video, .hero-main-content")) return;
    }
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    const stripIcons = (node) => {
      if (node) node.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
      return node;
    };
    const realImgs = Array.from(element.querySelectorAll("img")).filter((img) => img.getAttribute("src") && !img.getAttribute("src").startsWith("data:"));
    const primaryImg = realImgs[0] || null;
    const contentSelector = [
      ".eyebrow-content",
      ".eyebrow",
      "h1",
      "h2",
      "h3",
      ".hero-jon__text p",
      ".headline",
      ".award-banner__text p",
      "a.cta",
      "a.link",
      "a[href]:not(.link-container)"
    ].join(", ");
    const seen = /* @__PURE__ */ new Set();
    const textNodes = [];
    element.querySelectorAll(contentSelector).forEach((node) => {
      if (seen.has(node)) return;
      if (node.tagName === "A" && !node.textContent.trim() && !node.querySelector('img:not([src^="data:"])')) return;
      seen.add(node);
      textNodes.push(stripIcons(node.cloneNode(true)));
    });
    realImgs.slice(1).forEach((img) => textNodes.push(img.cloneNode(true)));
    if (!primaryImg && textNodes.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (primaryImg) {
      cells.push([[document2.createComment(" field:image "), primaryImg.cloneNode(true)]]);
    } else {
      cells.push([""]);
    }
    cells.push([[document2.createComment(" field:text "), ...textNodes]]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-news.js
  function parse2(element, { document: document2 }) {
    const scroller = element.querySelector(".scroller, #scroller") || (element.matches(".scroller, #scroller") ? element : element);
    const items = Array.from(scroller.querySelectorAll(".news-item"));
    const cells = [["Carousel News"]];
    const seenHrefs = /* @__PURE__ */ new Set();
    items.forEach((item) => {
      const link = item.querySelector("a[href]");
      const href = link ? link.getAttribute("href") : null;
      if (href) {
        const key = href.split("?")[0];
        if (seenHrefs.has(key)) return;
        seenHrefs.add(key);
      }
      const img = item.querySelector("img");
      const category = item.querySelector(".category");
      const title = item.querySelector(".news-title, h2, h3");
      const imageCell = [document2.createComment(" field:media_image ")];
      if (img) imageCell.push(img.cloneNode(true));
      const textCell = [document2.createComment(" field:content_text ")];
      if (category) textCell.push(category.cloneNode(true));
      if (title) {
        if (href) {
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          const h = title.cloneNode(true);
          a.textContent = title.textContent.trim();
          const heading = document2.createElement(title.tagName.toLowerCase().startsWith("h") ? title.tagName.toLowerCase() : "h3");
          heading.appendChild(a);
          textCell.push(heading);
        } else {
          textCell.push(title.cloneNode(true));
        }
      } else if (href) {
        const a = document2.createElement("a");
        a.setAttribute("href", href);
        a.textContent = href;
        textCell.push(a);
      }
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 1) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stats.js
  function parse3(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    const section = element.querySelector(".who-we-are-section") || element;
    const left = section.querySelector(".left-content");
    const right = section.querySelector(".right-content");
    const leftCell = [];
    if (left) {
      const eyebrow = left.querySelector(".eyebrow");
      const heading = left.querySelector(".headline, h1, h2, h3");
      const copy = left.querySelector(".copy, p");
      const cta = left.querySelector(".cta a[href], a.link[href]");
      if (eyebrow) leftCell.push(eyebrow.cloneNode(true));
      if (heading) leftCell.push(heading.cloneNode(true));
      if (copy) leftCell.push(copy.cloneNode(true));
      if (cta) leftCell.push(cta.cloneNode(true));
    }
    const rightCell = [];
    if (right) {
      const img = right.querySelector('img[src]:not([src^="data:"])');
      if (img) rightCell.push(img.cloneNode(true));
      right.querySelectorAll(".info-block").forEach((block2) => {
        const large = block2.querySelector(".large-copy");
        const sub = block2.querySelector(".subtext");
        if (large) {
          const p = document2.createElement("p");
          p.innerHTML = `<strong>${large.textContent.trim()}</strong>${sub ? " " + sub.textContent.trim() : ""}`;
          rightCell.push(p);
        }
      });
      const bottomLink = right.querySelector(".bottom-right-link, a[href]:not(.link-container)");
      if (bottomLink && bottomLink.textContent.trim()) rightCell.push(bottomLink.cloneNode(true));
    }
    if (leftCell.length === 0 && rightCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [
      ["Columns Stats"],
      [leftCell, rightCell]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse4(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    const banner = element.querySelector(".banner-container") || element;
    const contentCell = [];
    const eyebrow = banner.querySelector(".left-section .eyebrow, .eyebrow");
    const headline = banner.querySelector(".left-section .headline, .headline, h1, h2, h3");
    const copy = banner.querySelector(".center-section .copy, .copy, p");
    if (eyebrow) contentCell.push(eyebrow.cloneNode(true));
    if (headline) contentCell.push(headline.cloneNode(true));
    if (copy) contentCell.push(copy.cloneNode(true));
    const ctaCell = [];
    const cta = banner.querySelector(".right-section a[href], .cta a[href], a.link[href]");
    if (cta && cta.textContent.trim()) ctaCell.push(cta.cloneNode(true));
    if (contentCell.length === 0 && ctaCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [
      ["Columns Cta"],
      [contentCell, ctaCell]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-impact.js
  function parse5(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    const eyebrow = element.querySelector(".eyebrow");
    const headline = element.querySelector(".headline, h1, h2, h3");
    const copy = element.querySelector(".copy, p");
    const cta = element.querySelector(".cta a[href], a.link[href]");
    const img = element.querySelector('img[src]:not([src^="data:"])');
    const textCell = [];
    if (eyebrow) textCell.push(eyebrow.cloneNode(true));
    if (headline) textCell.push(headline.cloneNode(true));
    if (copy) textCell.push(copy.cloneNode(true));
    if (cta && cta.textContent.trim()) textCell.push(cta.cloneNode(true));
    if (textCell.length === 0 && !img) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [["Columns Impact"]];
    if (img) {
      cells.push([[img.cloneNode(true)], textCell]);
    } else {
      cells.push([textCell, [""]]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-impact", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-stats.js
  function parse6(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    const img = element.querySelector('.animation-icon img, img[src]:not([src^="data:"])');
    const largeCopy = element.querySelector(".large-copy");
    const subtext = element.querySelector(".subtext");
    const bottomLink = element.querySelector("a[href]");
    const imageCell = [document2.createComment(" field:image ")];
    if (img) imageCell.push(img.cloneNode(true));
    const textCell = [document2.createComment(" field:text ")];
    if (largeCopy) {
      const h = document2.createElement("h3");
      h.innerHTML = largeCopy.innerHTML;
      textCell.push(h);
    }
    if (subtext) {
      const p = document2.createElement("p");
      p.textContent = subtext.textContent.trim();
      textCell.push(p);
    }
    if (bottomLink && bottomLink.textContent.trim()) textCell.push(bottomLink.cloneNode(true));
    if (!img && !largeCopy && !subtext) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [
      ["Cards Stats"],
      [imageCell, textCell]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse7(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    const section = element.querySelector(".careers-section, .investors-section") || element;
    const content = section.querySelector(".careers-content, .investors-content") || section;
    const img = section.querySelector('img[src]:not([src^="data:"])');
    const textCell = [];
    const eyebrow = content.querySelector(".eyebrow");
    const title = content.querySelector(".careers-title, .investors-title, h1, h2, h3, .headline");
    const description = content.querySelector(".careers-description, .investors-description, .copy, p");
    if (eyebrow) textCell.push(eyebrow.cloneNode(true));
    if (title) textCell.push(title.cloneNode(true));
    if (description) textCell.push(description.cloneNode(true));
    const seen = /* @__PURE__ */ new Set();
    content.querySelectorAll(".cta a[href], .careers-links a[href], a.link[href], .bottom-right-link[href]").forEach((a) => {
      const href = a.getAttribute("href");
      const text = a.textContent.trim();
      if (!text || !href) return;
      if (seen.has(href)) return;
      seen.add(href);
      const link = a.cloneNode(true);
      link.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
      const p = document2.createElement("p");
      p.appendChild(link);
      textCell.push(p);
    });
    content.querySelectorAll(".careers-jobs a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || seen.has(href)) return;
      seen.add(href);
      const p = document2.createElement("p");
      p.appendChild(a.cloneNode(true));
      textCell.push(p);
    });
    section.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      const text = a.textContent.trim();
      if (!text || !href || seen.has(href)) return;
      seen.add(href);
      const link = a.cloneNode(true);
      link.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
      const p = document2.createElement("p");
      p.appendChild(link);
      textCell.push(p);
    });
    if (!img && textCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [["Columns Promo"]];
    if (img) {
      cells.push([[img.cloneNode(true)], textCell]);
    } else {
      cells.push([textCell, [""]]);
    }
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

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-video": parse,
    "carousel-news": parse2,
    "columns-stats": parse3,
    "columns-cta": parse4,
    "columns-impact": parse5,
    "cards-stats": parse6,
    "columns-promo": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Medtronic corporate homepage with hero video/card, news carousel, CTA banners, our-impact cards, careers, investors, header and footer",
    urls: [
      "https://www.medtronic.com/en-us/index.html"
    ],
    sections: [
      { id: "hero", name: "hero", selector: "div.hero-main-content" },
      { id: "news-media", name: "news-media", selector: "#News-Media" },
      { id: "who-we-are", name: "who-we-are", selector: "#who-we-are", style: "dark" },
      { id: "cta-blueprint", name: "cta-blueprint", selector: "div.wrapper-cta-banner", style: "dark" },
      { id: "our-impact", name: "our-impact", selector: "#Our-Impact" },
      { id: "careers", name: "careers", selector: "#Careers" },
      { id: "investors", name: "investors", selector: "#ShareHolder" }
    ],
    blocks: [
      { name: "hero-video", instances: ["div.hero-main-content", "#Header-video"] },
      { name: "carousel-news", instances: ["#News-Media", "#scroller"] },
      { name: "columns-stats", instances: ["#who-we-are"] },
      { name: "columns-cta", instances: ["div.wrapper-cta-banner"] },
      { name: "columns-impact", instances: ["#Our-Impact .our-impact-card", "#Our-Impact .access-card"] },
      { name: "cards-stats", instances: ["#Our-Impact .div2", "#Our-Impact .div3", "#Our-Impact .div4"] },
      { name: "columns-promo", instances: ["#Careers", "div.wrapper-careers-section", "#ShareHolder", "div.wrapper-investors-section"] }
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
  var import_homepage_default = {
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
  return __toCommonJS(import_homepage_exports);
})();
