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

  // tools/importer/import-healthcare-professionals.js
  var import_healthcare_professionals_exports = {};
  __export(import_healthcare_professionals_exports, {
    default: () => import_healthcare_professionals_default
  });

  // tools/importer/parsers/hero-menu.js
  function parse(element, { document: document2 }) {
    const scope = element.matches && element.matches(".hero-banner, .mdt-hero-banner") ? element : element.querySelector(".mdt-hero-banner, .hero-banner") || element;
    scope.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    const heroImg = scope.querySelector(".hero-image img[src], img[src]");
    const content = scope.querySelector(".hero-content .content, .hero-content") || scope;
    const preTitle = content.querySelector(".pre-title, .eyebrow");
    const heading = content.querySelector("h1, h2, .title");
    const description = content.querySelector(".description");
    const textCell = [document2.createComment(" field:text ")];
    if (preTitle && preTitle.textContent.trim()) {
      const p = document2.createElement("p");
      p.innerHTML = preTitle.innerHTML;
      textCell.push(p);
    }
    if (heading && heading.textContent.trim()) textCell.push(heading.cloneNode(true));
    if (description && description.textContent.trim()) {
      Array.from(description.childNodes).forEach((n) => {
        if (n.textContent && n.textContent.trim()) textCell.push(n.cloneNode(true));
      });
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
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-menu", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-nav.js
  function parse2(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    const rows = [];
    element.querySelectorAll(".cmp-teaser").forEach((teaser) => {
      const title = teaser.querySelector(".cmp-teaser__title");
      if (!title || !title.textContent.trim()) return;
      const imageCell = [document2.createComment(" field:image ")];
      const textCell = [document2.createComment(" field:text ")];
      const h = document2.createElement("h3");
      h.innerHTML = title.innerHTML;
      textCell.push(h);
      rows.push([imageCell, textCell]);
    });
    if (rows.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-nav", cells: rows });
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

  // tools/importer/import-healthcare-professionals.js
  var parsers = {
    "hero-menu": parse,
    "cards-nav": parse2
  };
  var PAGE_TEMPLATE = {
    name: "healthcare-professionals",
    description: "Medtronic Healthcare Professionals menu page",
    urls: ["https://www.medtronic.com/en-us/healthcare-professionals.html"],
    sections: [
      { id: "hero", name: "hero", selector: "div.hero-main-content" },
      { id: "nav-tiles", name: "nav-tiles", selector: "div.multi-teaser-layout" }
    ],
    blocks: [
      { name: "hero-menu", instances: ["div.hero-main-content"] },
      { name: "cards-nav", instances: ["div.multi-teaser-layout"] }
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
  var import_healthcare_professionals_default = {
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
  return __toCommonJS(import_healthcare_professionals_exports);
})();
