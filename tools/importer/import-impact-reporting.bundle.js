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

  // tools/importer/import-impact-reporting.js
  var import_impact_reporting_exports = {};
  __export(import_impact_reporting_exports, {
    default: () => import_impact_reporting_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document: document2 }) {
    const scope = element.matches && element.matches(".hero-banner, .mdt-hero-banner") ? element : element.querySelector(".mdt-hero-banner, .hero-banner") || element;
    scope.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    const heroImg = scope.querySelector(".hero-image img[src], img[src]");
    const content = scope.querySelector(".hero-content .content, .hero-content, .banner-content") || scope;
    const preTitle = content.querySelector(".pre-title, .eyebrow");
    const heading = content.querySelector("h1, h2, .title");
    const description = content.querySelector(".description");
    const cta = content.querySelector(
      ".mdt-row a[href], .action-link a[href], .banner-cta-wrapper a[href], .cmp-button[href]"
    );
    const textCell = [document2.createComment(" field:text ")];
    if (preTitle && preTitle.textContent.trim()) {
      const p = document2.createElement("p");
      p.innerHTML = preTitle.innerHTML;
      textCell.push(p);
    }
    if (heading && heading.textContent.trim()) textCell.push(heading.cloneNode(true));
    if (description && description.textContent.trim()) {
      Array.from(description.childNodes).forEach((n) => textCell.push(n.cloneNode(true)));
    }
    if (cta && cta.textContent.trim()) {
      const a = document2.createElement("a");
      a.setAttribute("href", cta.getAttribute("href"));
      const label = cta.querySelector(".cmp-button__text");
      a.textContent = (label ? label.textContent : cta.textContent).trim();
      const p = document2.createElement("p");
      p.append(a);
      textCell.push(p);
    }
    if (!heroImg && textCell.length === 1) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (heroImg) {
      cells.push([[document2.createComment(" field:image "), heroImg.cloneNode(true)]]);
    } else {
      cells.push([""]);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-stats.js
  function parse2(element, { document: document2 }) {
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

  // tools/importer/parsers/cards-awards.js
  function parse3(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    const scope = element.querySelector(".multi-teaser-layout") || element;
    const rows = [];
    scope.querySelectorAll(".cmp-teaser").forEach((teaser) => {
      const img = teaser.querySelector(".cmp-teaser__image img[src]");
      const desc = teaser.querySelector(".cmp-teaser__description, .cmp-teaser__content");
      const imageCell = [document2.createComment(" field:image ")];
      if (img) imageCell.push(img.cloneNode(true));
      const textCell = [document2.createComment(" field:text ")];
      if (desc) {
        const heading = desc.querySelector("h1, h2, h3, h4, h5, h6");
        if (heading && heading.textContent.trim()) textCell.push(heading.cloneNode(true));
        desc.querySelectorAll("p").forEach((p) => {
          if (p.textContent.trim()) textCell.push(p.cloneNode(true));
        });
      }
      if (img || textCell.length > 1) rows.push([imageCell, textCell]);
    });
    if (rows.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-awards", cells: rows });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo-card.js
  function parse4(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    element.querySelectorAll(".icon").forEach((n) => n.remove());
    const resolveImg = (img) => {
      if (!img) return null;
      const src = img.getAttribute("src") || "";
      if (src && !src.startsWith("data:")) return img;
      const lazy = img.getAttribute("data-src") || img.getAttribute("data-original") || img.getAttribute("data-lazy-src") || (img.getAttribute("data-srcset") || "").split(/\s|,/)[0];
      if (lazy) {
        img.setAttribute("src", lazy);
        return img;
      }
      return null;
    };
    const imageWrap = element.querySelector(".cmp-image");
    const imageCell = [];
    if (imageWrap) {
      const candidate = Array.from(imageWrap.querySelectorAll("img")).find((im) => !/(icon|arrow)/i.test(im.className));
      const img = resolveImg(candidate);
      if (img) imageCell.push(img.cloneNode(true));
    }
    const contentCell = [];
    const eyebrow = element.querySelector(".text-eyebrow-default .cmp-text");
    const heading = element.querySelector(".text-heading-small .cmp-text h3, .text-heading-small h3");
    const ctaLink = element.querySelector(".text .cmp-text p a[href], .text .cmp-text a[href]");
    if (eyebrow) {
      const p = document2.createElement("p");
      p.innerHTML = eyebrow.innerHTML;
      contentCell.push(p);
    }
    if (heading) contentCell.push(heading.cloneNode(true));
    if (ctaLink && ctaLink.textContent.trim()) {
      const p = document2.createElement("p");
      p.appendChild(ctaLink.cloneNode(true));
      contentCell.push(p);
    }
    if (imageCell.length === 0 && contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [
      [imageCell.length ? imageCell : "", contentCell.length ? contentCell : ""]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-promo-card", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-links.js
  function parse5(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    const rows = [];
    element.querySelectorAll(".cmp-accordion__item").forEach((item) => {
      const title = item.querySelector(".cmp-accordion__title, .cmp-accordion__header button, h2, h3, h4");
      const panel = item.querySelector(".cmp-accordion__panel");
      const summaryCell = [document2.createComment(" field:summary ")];
      if (title && title.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = title.textContent.trim();
        summaryCell.push(p);
      }
      const textCell = [document2.createComment(" field:text ")];
      if (panel) {
        const links = panel.querySelectorAll("p a[href], li a[href]");
        if (links.length) {
          links.forEach((a) => {
            const p = document2.createElement("p");
            p.append(a.cloneNode(true));
            textCell.push(p);
          });
        } else {
          const textBlock = panel.querySelector(".cmp-text") || panel;
          Array.from(textBlock.childNodes).forEach((n) => textCell.push(n.cloneNode(true)));
        }
      }
      if (summaryCell.length > 1 || textCell.length > 1) {
        rows.push([summaryCell, textCell]);
      }
    });
    if (rows.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-links", cells: rows });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-articles.js
  function parse6(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    element.querySelectorAll(".user-filter-wrapper, .filter-wrapper, select, .load-more-list, #load-more, button").forEach((n) => n.remove());
    const resolveImg = (img) => {
      if (!img) return null;
      const src = img.getAttribute("src") || "";
      if (src && !src.startsWith("data:")) return img;
      const lazy = img.getAttribute("data-src") || img.getAttribute("data-original") || img.getAttribute("data-lazy-src") || (img.getAttribute("data-srcset") || "").split(/\s|,/)[0];
      if (lazy) {
        img.setAttribute("src", lazy);
        return img;
      }
      return null;
    };
    const rows = [];
    element.querySelectorAll("li.grid-block").forEach((li) => {
      const anchor = li.querySelector("a[href]");
      const href = anchor ? anchor.getAttribute("href") : null;
      const rawImg = li.querySelector(".tile-image img, img");
      const eyebrow = li.querySelector(".eyebrow");
      const title = li.querySelector(".tile-header h3, h3");
      const img = resolveImg(rawImg);
      const imageCell = [document2.createComment(" field:image ")];
      if (img) imageCell.push(img.cloneNode(true));
      const textCell = [document2.createComment(" field:text ")];
      if (eyebrow && eyebrow.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        textCell.push(p);
      }
      if (title && title.textContent.trim()) {
        const h = document2.createElement("h3");
        if (href) {
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          a.textContent = title.textContent.trim();
          h.appendChild(a);
        } else {
          h.textContent = title.textContent.trim();
        }
        textCell.push(h);
      }
      if (img || textCell.length > 1) rows.push([imageCell, textCell]);
    });
    if (rows.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-articles", cells: rows });
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

  // tools/importer/import-impact-reporting.js
  var parsers = {
    "hero-banner": parse,
    "cards-stats": parse2,
    "cards-awards": parse3,
    "columns-promo-card": parse4,
    "accordion-links": parse5,
    "cards-articles": parse6
  };
  var PAGE_TEMPLATE = {
    name: "impact-reporting",
    description: "Medtronic Impact Reporting page",
    urls: ["https://www.medtronic.com/en-us/our-impact/impact-reporting.html"],
    sections: [
      { id: "impact-hero", name: "impact-hero", selector: "#container-06d55a2869" },
      { id: "year-in-review", name: "year-in-review", selector: "#container-8df4d32336" },
      { id: "recognition-cards", name: "recognition-cards", selector: "#container-78f03a6dc7" },
      { id: "ceo-dialogue-promo", name: "ceo-dialogue-promo", selector: "#container-f890070efe" },
      { id: "esg-disclosures-accordion", name: "esg-disclosures-accordion", selector: "#container-d473c47fc3" },
      { id: "article-grid", name: "article-grid", selector: "#container-7a6689b4bf" }
    ],
    blocks: [
      { name: "hero-banner", instances: ["#container-06d55a2869"] },
      { name: "cards-stats", instances: ["#container-8df4d32336"] },
      { name: "cards-awards", instances: ["#container-78f03a6dc7"] },
      { name: "columns-promo-card", instances: ["#container-f890070efe"] },
      { name: "accordion-links", instances: ["#container-d473c47fc3"] },
      { name: "cards-articles", instances: ["#container-7a6689b4bf"] }
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
  var import_impact_reporting_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const seen = /* @__PURE__ */ new Set();
      const pageBlocks = [];
      PAGE_TEMPLATE.blocks.forEach((blockDef) => {
        let matchedAny = false;
        blockDef.instances.forEach((selector) => {
          document2.querySelectorAll(selector).forEach((element) => {
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
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
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
  return __toCommonJS(import_impact_reporting_exports);
})();
