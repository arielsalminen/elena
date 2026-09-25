import { collapseWhitespace, isArray, isRaw, nothing, resolveValue, toPlainText } from "./utils.js";

const stringsCache = new WeakMap();
const markerKey = "e" + Math.random().toString(36).slice(2);
const SHOW_COMMENT = 128;
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

const newTemplate = () => document.createElement("template");
const treeWalker = node => document.createTreeWalker(node, SHOW_COMMENT);

/**
 * Render a tagged template into an Elena Element with DOM diffing.
 * Returns true if the DOM was fully rebuilt, false if parts were
 * patched in place.
 *
 * @param {HTMLElement} element
 * @param {TemplateStringsArray} strings - Static parts of the tagged template
 * @param {Array} values - Dynamic interpolated values
 * @returns {boolean}
 */
export function renderTemplate(element, strings, values) {
  if (patch(element, strings, values)) {
    return false;
  }
  morph(element, strings, values);
  return true;
}

/**
 * Patch only changed text nodes and attribute values.
 *
 * @param {HTMLElement} element - The host element with cached template state
 * @param {TemplateStringsArray} strings - Static parts of the tagged template
 * @param {Array} values - Dynamic interpolated values
 * @returns {boolean} Whether patching was sufficient (false = do morph instead)
 */
function patch(element, strings, values) {
  // Only works when re-rendering the same template shape
  if (element._templateStrings !== strings || !element._templateParts) {
    return false;
  }

  const parts = element._templateParts;
  const cached = element._templateValues;

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    const comparable = isArray(v) ? toPlainText(v) : v;

    if (comparable === cached[i]) {
      continue;
    }

    if (isRaw(v) && v !== nothing) {
      return false;
    }

    const part = parts[i];

    if (!part) {
      return false;
    }

    cached[i] = comparable;
    const str = String(comparable ?? "");

    if (part.nodeType) {
      part.textContent = str;
    } else {
      part[0].setAttribute(part[1], str);
    }
  }

  return true;
}

/**
 * Clone a cached <template> and morph in new structure.
 *
 * @param {HTMLElement} element - The host element to render into
 * @param {TemplateStringsArray} strings - Static parts of the tagged template
 * @param {Array} values - Dynamic interpolated values
 */
function morph(element, strings, values) {
  let entry = stringsCache.get(strings);

  if (!entry) {
    const _strings = strings.map(collapseWhitespace);
    entry = {
      _strings,
      _template: values.length > 0 ? createTemplate(_strings, values.length) : null,
    };
    stringsCache.set(strings, entry);
  }

  if (entry._template) {
    element._templateParts = cloneAndPatch(element, entry._template, values);
  } else {
    // Fallback for static templates or templates where marker detection failed.
    // White space collapsing here protects against Vue SSR mismatches.
    const renderedValues = values.map(resolveValue);
    const markup = entry._strings
      .reduce((out, str, i) => out + str + (renderedValues[i] ?? ""), "")
      .replace(/>\s+</g, "><")
      .trim();

    // Morph existing DOM to match new markup instead of replacing it.
    const template = newTemplate();
    template.innerHTML = markup;
    morphContent(element, template.content.childNodes);
    element._templateParts = null;
  }

  element._templateStrings = strings;
  element._templateValues = values.map(v => (isArray(v) ? toPlainText(v) : v));
}

/**
 * Create a <template> element with comment markers and string placeholders.
 *
 * @param {string[]} _strings - Whitespace-collapsed static parts
 * @param {number} valueCount - Number of dynamic values
 * @returns {{ _tpl: HTMLTemplateElement, _attrs: (string|null)[] } | null}
 */
function createTemplate(_strings, valueCount) {
  const marker = `<!--${markerKey}-->`;
  const attrs = [];
  let markup = "";

  for (let i = 0; i < _strings.length; i++) {
    markup += _strings[i];

    if (i < valueCount) {
      const match = _strings[i].match(/([^\s"'>/=]+)\s*=\s*["']$/);

      if (match) {
        attrs.push(match[1]);
        markup += markerKey + "_" + i;
      } else {
        attrs.push(null);
        markup += marker;
      }
    }
  }

  const template = newTemplate();
  template.innerHTML = markup.trim();

  // Mismatch means this template shape cannot use the clone path.
  const walker = treeWalker(template.content);
  let commentCount = 0;

  while (walker.nextNode()) {
    if (walker.currentNode.data === markerKey) {
      commentCount++;
    }
  }

  const expectedComments = attrs.filter(n => n === null).length;

  if (commentCount !== expectedComments) {
    return null;
  }

  return { _tpl: template, _attrs: attrs };
}

/**
 * Clone a cached template and replace markers with actual content.
 *
 * @param {HTMLElement} element - The host element to render into
 * @param {{ _tpl: HTMLTemplateElement, _attrs: (string|null)[] }} templateInfo
 * @param {Array} values - Raw interpolated values
 * @returns {Array<Text | [Element, string] | undefined> | null}
 */
function cloneAndPatch(element, templateInfo, values) {
  const { _tpl, _attrs } = templateInfo;
  const clone = _tpl.content.cloneNode(true);
  const walker = treeWalker(clone);
  const parts = Array(values.length);
  const markers = [];
  let node;

  // Collect markers before modifying the tree
  while ((node = walker.nextNode())) {
    if (node.data === markerKey) {
      markers.push(node);
    }
  }

  let contentIdx = 0;

  for (let i = 0; i < values.length; i++) {
    const attr = _attrs[i];

    if (attr) {
      // Find the element with the placeholder value
      const placeholder = markerKey + "_" + i;
      const el = clone.querySelector(`[${attr}="${placeholder}"]`);

      if (el) {
        const value = values[i];
        const str = String((isArray(value) ? toPlainText(value) : value) ?? "");
        el.setAttribute(attr, str);
        parts[i] = [el, attr];
      }
    } else {
      // Replace comment marker with value
      const marker = markers[contentIdx++];
      const value = values[i];

      // Parse and insert raw HTML as a fragment
      if (isRaw(value) && value !== nothing) {
        const tmp = newTemplate();
        tmp.innerHTML = resolveValue(value);
        marker.parentNode.replaceChild(tmp.content, marker);

        // Create text node with unescaped content
      } else {
        const textNode = document.createTextNode(toPlainText(value));
        marker.parentNode.replaceChild(textNode, marker);
        parts[i] = textNode;
      }
    }
  }

  if (element._templateStrings) {
    morphContent(element, clone.childNodes);
    return null;
  }
  element.replaceChildren(clone);
  return parts;
}

/**
 * Patches attributes and text content in-place when structure is stable,
 * preserving element identity and focus state across re-renders.
 *
 * @param {Node} parent
 * @param {NodeList} nextNodes - The desired child nodes from the new render
 */
function morphContent(parent, nextNodes) {
  const current = Array.from(parent.childNodes);
  const next = Array.from(nextNodes);
  const len = Math.max(current.length, next.length);

  for (let i = 0; i < len; i++) {
    const cur = current[i];
    const nxt = next[i];

    if (!cur) {
      parent.appendChild(nxt);
    } else if (!nxt) {
      parent.removeChild(cur);
    } else if (
      cur.nodeType !== nxt.nodeType ||
      (cur.nodeType === ELEMENT_NODE && cur.tagName !== nxt.tagName)
    ) {
      parent.replaceChild(nxt, cur);
    } else if (cur.nodeType === TEXT_NODE) {
      if (cur.textContent !== nxt.textContent) {
        cur.textContent = nxt.textContent;
      }
    } else if (cur.nodeType === ELEMENT_NODE) {
      morphAttributes(cur, nxt);

      // Don't morph child content of Elena elements that render Light DOM template
      if (cur._templateStrings) {
        continue;
      }
      morphContent(cur, nxt.childNodes);
    }
  }
}

/**
 * Morph element’s attributes without rebuilding the DOM.
 *
 * @param {Element} current - The current existing DOM element
 * @param {Element} next - The desired element from the new render
 */
function morphAttributes(current, next) {
  for (let i = current.attributes.length - 1; i >= 0; i--) {
    const { name } = current.attributes[i];

    if (!next.hasAttribute(name)) {
      current.removeAttribute(name);
    }
  }

  for (let i = 0; i < next.attributes.length; i++) {
    const { name, value } = next.attributes[i];

    if (current.getAttribute(name) !== value) {
      current.setAttribute(name, value);
    }
  }
}
