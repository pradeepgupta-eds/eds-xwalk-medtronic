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

  // tools/importer/import-specialty-detail.js
  var import_specialty_detail_exports = {};
  __export(import_specialty_detail_exports, {
    default: () => import_specialty_detail_default
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

  // tools/importer/parsers/columns-video.js
  function parse2(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    const textCell = [];
    const lead = element.querySelector(".cmp-text");
    if (lead) {
      Array.from(lead.children).forEach((n) => {
        if (n.textContent && n.textContent.trim()) textCell.push(n.cloneNode(true));
      });
    }
    const parent = element.closest(".aem-Grid") || element.parentElement && element.parentElement.closest(".cmp-container");
    const mediaCell = [];
    if (parent) {
      const videoCol = parent.querySelector(".mdtdynamicvideo, .dynamicmedia, .mdtdynamic-video");
      if (videoCol) {
        const poster = videoCol.querySelector(
          'img[src*="/is/image/"]:not([src*="s7sdk"]):not([src^="data:"])'
        );
        if (poster) mediaCell.push(poster.cloneNode(true));
      }
    }
    if (textCell.length === 0 && mediaCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [
      [mediaCell.length ? mediaCell : "", textCell.length ? textCell : ""]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse3(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    const rows = [];
    const cards = Array.from(element.querySelectorAll(".cmp-container")).filter((c) => {
      const grid = c.querySelector(":scope > .aem-Grid");
      if (!grid) return false;
      const hasImage = grid.querySelector(":scope > .image");
      const hasText = grid.querySelector(":scope > .text");
      return hasImage && hasText;
    });
    cards.forEach((card) => {
      const img = card.querySelector(".image img[src]");
      const textBlock = card.querySelector(".text .cmp-text");
      const cta = card.querySelector(".button a[href], a.cmp-button[href]");
      const imageCell = [document2.createComment(" field:image ")];
      if (img) imageCell.push(img.cloneNode(true));
      const textCell = [document2.createComment(" field:text ")];
      if (textBlock) {
        textBlock.querySelectorAll("p").forEach((p) => {
          if (p.textContent.trim()) textCell.push(p.cloneNode(true));
        });
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
      if (img || textCell.length > 1) rows.push([imageCell, textCell]);
    });
    if (rows.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-product", cells: rows });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse4(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    const rows = [];
    const cards = Array.from(element.querySelectorAll(".cmp-container")).filter((c) => {
      const grid = c.querySelector(":scope > .aem-Grid");
      if (!grid) return false;
      const hasImage = grid.querySelector(":scope > .image");
      const hasText = grid.querySelector(":scope > .text");
      return hasImage && hasText;
    });
    cards.forEach((card) => {
      const img = card.querySelector(".image img[src]");
      const textBlock = card.querySelector(".text .cmp-text");
      const imageCell = [document2.createComment(" field:image ")];
      if (img) imageCell.push(img.cloneNode(true));
      const textCell = [document2.createComment(" field:text ")];
      if (textBlock) {
        Array.from(textBlock.children).forEach((node) => {
          if (!node.textContent.trim()) return;
          const clone = node.cloneNode(true);
          clone.querySelectorAll("a .pill-btn, a span.pill-btn").forEach((span) => {
            span.replaceWith(...span.childNodes);
          });
          textCell.push(clone);
        });
      }
      if (img || textCell.length > 1) rows.push([imageCell, textCell]);
    });
    if (rows.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-feature", cells: rows });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-logos.js
  function parse5(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    const rows = [];
    element.querySelectorAll(".cmp-image").forEach((cmpImage) => {
      const img = cmpImage.querySelector("img[src]");
      if (!img) return;
      const imageCell = [document2.createComment(" field:image ")];
      const link = cmpImage.querySelector("a.cmp-image__link[href], a[href]");
      if (link) {
        const a = document2.createElement("a");
        a.setAttribute("href", link.getAttribute("href"));
        a.append(img.cloneNode(true));
        imageCell.push(a);
      } else {
        imageCell.push(img.cloneNode(true));
      }
      const textCell = [document2.createComment(" field:text ")];
      rows.push([imageCell, textCell]);
    });
    if (rows.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-logos", cells: rows });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-connect.js
  function parse6(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    element.querySelectorAll("meta").forEach((m) => m.remove());
    const grid = element.closest(".aem-Grid");
    const parentContainer = grid ? grid.parentElement && grid.parentElement.closest(".cmp-container") : element;
    const scope = parentContainer || element;
    const introBlock = element.querySelector(".cmp-text");
    const introNodes = [];
    if (introBlock) {
      Array.from(introBlock.children).forEach((n) => {
        if (n.textContent && n.textContent.trim()) introNodes.push(n.cloneNode(true));
      });
    }
    const panelContainers = Array.from(scope.querySelectorAll(".cmp-container")).filter((c) => c !== element && c.id !== "container-d06c5dbb8b").filter((c) => c.querySelector(".cmp-text, .image, .button")).filter((c, _i, arr) => !arr.some((o) => o !== c && o.contains(c)));
    const buildPanelCell = (panel) => {
      const cell = [];
      const textBlock = panel.querySelector(".cmp-text");
      if (textBlock) {
        Array.from(textBlock.children).forEach((n) => {
          if (n.textContent && n.textContent.trim()) cell.push(n.cloneNode(true));
        });
      }
      const img = panel.querySelector(".image img[src]");
      if (img) cell.push(img.cloneNode(true));
      const cta = panel.querySelector(".button a[href], a.cmp-button[href]");
      if (cta && cta.textContent.trim()) {
        const a = document2.createElement("a");
        a.setAttribute("href", cta.getAttribute("href"));
        const label = cta.querySelector(".cmp-button__text");
        a.textContent = (label ? label.textContent : cta.textContent).trim();
        const p = document2.createElement("p");
        p.append(a);
        cell.push(p);
      }
      return cell;
    };
    const cellsRow = panelContainers.map(buildPanelCell);
    if (introNodes.length) {
      if (cellsRow.length) {
        cellsRow[0] = [...introNodes, ...cellsRow[0]];
      } else {
        cellsRow.push(introNodes);
      }
    }
    if (cellsRow.length === 0 || cellsRow.every((c) => c.length === 0)) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [cellsRow.map((c) => c.length ? c : "")];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-connect", cells });
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

  // tools/importer/transformers/medtronic-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/import-specialty-detail.js
  var parsers = {
    "hero-banner": parse,
    "columns-video": parse2,
    "cards-product": parse3,
    "cards-feature": parse4,
    "cards-logos": parse5,
    "columns-connect": parse6
  };
  var PAGE_TEMPLATE = {
    name: "specialty-detail",
    description: "Medtronic specialty detail page (Acute Care & Monitoring)",
    urls: ["https://www.medtronic.com/en-us/healthcare-professionals/specialties/acute-care-monitoring.html"],
    sections: [
      { id: "hero", name: "hero", selector: ".hero-banner.herobanner" },
      { id: "video-empower", name: "video-empower", selector: "#container-32cfe2f49b" },
      { id: "featured-products", name: "featured-products", selector: "#container-36081a734a" },
      { id: "education", name: "education", selector: "#container-e2ed390e5a" },
      { id: "investing", name: "investing", selector: "#container-976abc859c" },
      { id: "partners", name: "partners", selector: "#container-e58f54f8a6" },
      { id: "connect", name: "connect", selector: "#container-d06c5dbb8b" }
    ],
    blocks: [
      { name: "hero-banner", instances: [".hero-banner.herobanner"] },
      { name: "columns-video", instances: ["#container-32cfe2f49b"] },
      { name: "cards-product", instances: ["#container-36081a734a"] },
      { name: "cards-feature", instances: ["#container-e2ed390e5a", "#container-976abc859c"] },
      { name: "cards-logos", instances: ["#container-e58f54f8a6"] },
      { name: "columns-connect", instances: ["#container-d06c5dbb8b"] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : [],
    transform3
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
  var import_specialty_detail_default = {
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
  return __toCommonJS(import_specialty_detail_exports);
})();
