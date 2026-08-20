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

  // tools/importer/import-our-company.js
  var import_our_company_exports = {};
  __export(import_our_company_exports, {
    default: () => import_our_company_default
  });

  // tools/importer/parsers/hero-stats.js
  function parse(element, { document: document2 }) {
    const scope = element.matches && element.matches(".banner, div.mdt-banner") ? element : element.querySelector(".banner, div.mdt-banner") || element;
    scope.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    scope.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
    const contentImg = scope.querySelector(
      'img[src*="/is/image/Medtronic"]:not([src*="_OOTB"]):not([src*="s7sdk"])'
    );
    const content = scope.querySelector(".banner-content, .banner-text-wrapper") || scope;
    const preTitle = content.querySelector(".pre-title, .eyebrow");
    const heading = content.querySelector("h1, h2, .title");
    const description = content.querySelector(".description");
    const cta = content.querySelector(".banner-cta-wrapper a[href], .banner-action a[href]");
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
    if (cta && cta.textContent.trim()) textCell.push(cta.cloneNode(true));
    const heroSection = element.closest && element.closest('.cmp-container, [id^="container-"]') || (scope.parentElement && scope.parentElement.closest ? scope.parentElement.closest('.cmp-container, [id^="container-"]') : null) || document2;
    const infographic = heroSection.querySelector ? heroSection.querySelector(".infographic") : null;
    const statItems = infographic ? infographic.querySelectorAll(".info-block, li") : [];
    statItems.forEach((li) => {
      const title = li.querySelector(".info-title, .info-figure, strong, span:first-child");
      const desc = li.querySelector(".info-desc, .info-label");
      const link = li.querySelector("a[href]");
      if (title && title.textContent.trim()) {
        const p = document2.createElement("p");
        const strong = document2.createElement("strong");
        strong.textContent = title.textContent.trim();
        p.append(strong);
        if (desc && desc.textContent.trim()) {
          p.append(document2.createTextNode(` ${desc.textContent.trim()}`));
        }
        textCell.push(p);
      }
      if (link && link.textContent.trim()) {
        const p = document2.createElement("p");
        p.append(link.cloneNode(true));
        textCell.push(p);
      }
    });
    if (!contentImg && textCell.length === 1) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (contentImg) {
      cells.push([[document2.createComment(" field:image "), contentImg.cloneNode(true)]]);
    } else {
      cells.push([""]);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo-card.js
  function parse2(element, { document: document2 }) {
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

  // tools/importer/parsers/cards-topic.js
  function parse3(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
    element.querySelectorAll('img[src^="data:"]').forEach((i) => i.remove());
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
    element.querySelectorAll(".cmp-teaser").forEach((teaser) => {
      const img = resolveImg(teaser.querySelector(".cmp-teaser__image img"));
      const content = teaser.querySelector(".cmp-teaser__content");
      const imageCell = [document2.createComment(" field:image ")];
      if (img) imageCell.push(img.cloneNode(true));
      const textCell = [document2.createComment(" field:text ")];
      if (content) {
        const pretitle = content.querySelector(".cmp-teaser__pretitle");
        const title = content.querySelector(".cmp-teaser__title");
        if (pretitle && pretitle.textContent.trim()) {
          const p = document2.createElement("p");
          p.textContent = pretitle.textContent.trim();
          textCell.push(p);
        }
        if (title && title.textContent.trim()) {
          const h = document2.createElement("h3");
          h.innerHTML = title.innerHTML;
          textCell.push(h);
        }
      }
      if (img || textCell.length > 1) rows.push([imageCell, textCell]);
    });
    const quote = element.querySelector(".quotations .quote, .quotations blockquote");
    if (quote) {
      const qImg = resolveImg(element.querySelector(".quotations .image img"));
      const bq = element.querySelector(".quotations blockquote") || quote;
      const imageCell = [document2.createComment(" field:image ")];
      if (qImg) imageCell.push(qImg.cloneNode(true));
      const textCell = [document2.createComment(" field:text ")];
      if (bq && bq.textContent.trim()) textCell.push(bq.cloneNode(true));
      if (qImg || textCell.length > 1) rows.push([imageCell, textCell]);
    }
    if (rows.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-topic", cells: rows });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tiles.js
  function parse4(element, { document: document2 }) {
    element.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
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
    element.querySelectorAll(".cmp-image").forEach((tile) => {
      const link = tile.querySelector("a.cmp-image__link[href], a[href]");
      const rawImg = tile.querySelector("img");
      if (!rawImg && !link) return;
      const label = (rawImg && (rawImg.getAttribute("alt") || rawImg.getAttribute("title")) || link && link.textContent.trim() || "").trim();
      const img = resolveImg(rawImg);
      const imageCell = [document2.createComment(" field:image ")];
      if (img) imageCell.push(img.cloneNode(true));
      const textCell = [document2.createComment(" field:text ")];
      if (label) {
        const h = document2.createElement("h3");
        if (link && link.getAttribute("href")) {
          const a = document2.createElement("a");
          a.setAttribute("href", link.getAttribute("href"));
          a.textContent = label;
          h.appendChild(a);
        } else {
          h.textContent = label;
        }
        textCell.push(h);
      }
      rows.push([imageCell, textCell]);
    });
    if (rows.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-tiles", cells: rows });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-articles.js
  function parse5(element, { document: document2 }) {
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

  // tools/importer/import-our-company.js
  var parsers = {
    "hero-stats": parse,
    "columns-promo-card": parse2,
    "cards-topic": parse3,
    "cards-tiles": parse4,
    "cards-articles": parse5
  };
  var PAGE_TEMPLATE = {
    name: "our-company",
    description: "Medtronic Our Company overview page",
    urls: [
      "https://www.medtronic.com/en-us/our-company.html"
    ],
    sections: [
      { id: "stats-hero", name: "stats-hero", selector: "#container-5d1a569867" },
      { id: "promo-stories", name: "promo-stories", selector: "#container-3c577964f4" },
      { id: "topic-cards-grid", name: "topic-cards-grid", selector: "#container-0a7ecc757b" },
      { id: "promo-impact", name: "promo-impact", selector: "#container-9c8bea0160" },
      { id: "explore-tiles", name: "explore-tiles", selector: "#container-eeba63a201" },
      { id: "article-grid", name: "article-grid", selector: "#container-a5f4363e21" }
    ],
    blocks: [
      { name: "hero-stats", instances: ["#container-5d1a569867 .banner", ".banner"] },
      { name: "columns-promo-card", instances: ["#container-3c577964f4", "#container-9c8bea0160"] },
      { name: "cards-topic", instances: ["#container-0a7ecc757b"] },
      { name: "cards-tiles", instances: ["#container-eeba63a201"] },
      { name: "cards-articles", instances: ["#container-a5f4363e21"] }
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
  var import_our_company_default = {
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
  return __toCommonJS(import_our_company_exports);
})();
