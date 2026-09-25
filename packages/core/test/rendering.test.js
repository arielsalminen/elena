import { describe, it, expect } from "vitest";
import { createElement } from "./setup.js";
import { renderTemplate } from "../src/common/render.js";
import { html, nothing, unsafeHTML } from "../src/elena.js";
import "./fixtures/basic-element.js";
import "./fixtures/attr-element.js";
import "./fixtures/multiline-element.js";
import "./fixtures/complex-element.js";
import "./fixtures/nested-element.js";

const multiValueTemplate = Object.assign(
  ["<span class='one'>", "</span><span class='two'>", "</span><span class='three'>", "</span>"],
  {
    raw: [
      "<span class='one'>",
      "</span><span class='two'>",
      "</span><span class='three'>",
      "</span>",
    ],
  }
);

describe("rendering", () => {
  describe("render()", () => {
    it("renders template markup into the element", async () => {
      const el = await createElement("basic-element", { label: "Hello" });
      expect(el.innerHTML).toContain("Hello");
      expect(el.querySelector(".inner")).not.toBeNull();
    });
  });

  describe("html`` (tagged template)", () => {
    it("renders tagged template markup into the element", () => {
      const el = createElement("basic-element", { label: "Hello" });
      expect(el.querySelector(".inner").textContent).toBe("Hello");
    });

    it("escapes HTML in dynamic values", () => {
      const el = createElement("basic-element", { label: "<img src=x onerror=alert(1)>" });
      expect(el.querySelector("img")).toBeNull();
      expect(el.querySelector(".inner").textContent).toBe("<img src=x onerror=alert(1)>");
    });

    it("escapes script tags in dynamic values", () => {
      const el = createElement("basic-element", { label: '<script>alert("xss")</script>' });
      expect(el.querySelector("script")).toBeNull();
      expect(el.querySelector(".inner").textContent).toContain("<script>");
    });

    it("handles empty string values", () => {
      const el = createElement("basic-element", { label: "" });
      expect(el.querySelector(".inner").textContent).toBe("");
    });

    it("re-renders with escaping on attribute change", async () => {
      const el = createElement("basic-element", { label: "safe" });
      expect(el.querySelector(".inner").textContent).toBe("safe");

      el.setAttribute("label", "<b>bold</b>");
      await el.updateComplete;
      expect(el.querySelector("b")).toBeNull();
      expect(el.querySelector(".inner").textContent).toBe("<b>bold</b>");
    });

    it("handles null and undefined values in tagged template", () => {
      const el = createElement("basic-element");
      const t1 = html`<span class="inner">${null}</span>`;
      renderTemplate(el, t1.strings, t1.values);
      expect(el.querySelector(".inner").textContent).toBe("");

      const t2 = html`<span class="inner">${undefined}</span>`;
      renderTemplate(el, t2.strings, t2.values);
      expect(el.querySelector(".inner").textContent).toBe("");
    });
  });

  describe("re-rendering", () => {
    it("clears previous content before rendering", async () => {
      const el = await createElement("basic-element", { label: "First" });
      expect(el.querySelector(".inner").textContent).toBe("First");

      // Trigger re-render by changing attribute
      el.setAttribute("label", "Second");
      await el.updateComplete;
      const spans = el.querySelectorAll(".inner");
      expect(spans.length).toBe(1);
      expect(spans[0].textContent).toBe("Second");
    });

    it("re-render on attribute change produces updated markup", async () => {
      const el = await createElement("basic-element", { label: "A" });
      el.setAttribute("label", "B");
      await el.updateComplete;
      expect(el.querySelector(".inner").textContent).toBe("B");
    });
  });

  describe("whitespace stripping", () => {
    it("strips indentation whitespace around text content", () => {
      const el = createElement("multiline-element", { label: "Click me", type: "button" });
      const btn = el.querySelector(".btn");
      // Text content should not have leading/trailing whitespace from indentation
      expect(btn.textContent).toBe("Click me");
    });

    it("preserves spaces between HTML attributes", () => {
      const el = createElement("multiline-element", { label: "Submit", type: "submit" });
      const btn = el.querySelector(".btn");
      // Attributes should be properly separated, not merged
      expect(btn.getAttribute("class")).toBe("btn");
      expect(btn.getAttribute("type")).toBe("submit");
    });

    it("handles empty conditional attribute values without extra whitespace", () => {
      const el = createElement("multiline-element", { label: "Click", type: "button" });
      const btn = el.querySelector(".btn");
      // name="" and disabled="" produce empty strings: no stray whitespace in output
      expect(btn.outerHTML).not.toMatch(/\s{2,}/);
    });

    it("handles conditional attributes that are present", () => {
      const el = createElement("multiline-element", {
        label: "Submit",
        type: "submit",
        name: "action",
        disabled: true,
      });
      const btn = el.querySelector(".btn");
      expect(btn.hasAttribute("disabled")).toBe(true);
      expect(btn.getAttribute("type")).toBe("submit");
    });

    it("preserves inline spaces in single-line template", () => {
      const el = createElement("basic-element", { label: "Hello" });
      const t = html` <span class="inner"> ${"world"} </span> `;
      renderTemplate(el, t.strings, t.values);
      // Spaces around the value are inline (no newlines), so they're preserved
      expect(el.querySelector(".inner").textContent).toBe(" world ");
    });

    it("does not strip spaces within single-line content", () => {
      const el = createElement("basic-element", { label: "Hello" });
      const t = html`<span class="inner">${"hello"} ${"world"}</span>`;
      renderTemplate(el, t.strings, t.values);
      // The space between "hello" and "world" is in a static string on one line: preserved
      expect(el.querySelector(".inner").textContent).toBe("hello world");
    });

    it("maintains clean whitespace after text-only re-render", async () => {
      const el = createElement("multiline-element", { label: "First", type: "button" });
      expect(el.querySelector(".btn").textContent).toBe("First");

      // Patches text node directly
      el.setAttribute("label", "Second");
      await el.updateComplete;
      expect(el.querySelector(".btn").textContent).toBe("Second");
      expect(el.innerHTML).not.toMatch(/>\s+</);
    });

    it("maintains clean whitespace after attribute-position re-render", async () => {
      const el = createElement("multiline-element", { label: "Click", type: "button" });
      expect(el.querySelector(".btn").textContent).toBe("Click");
      el.setAttribute("type", "submit");
      await el.updateComplete;
      expect(el.querySelector(".btn").getAttribute("type")).toBe("submit");
      expect(el.querySelector(".btn").textContent).toBe("Click");
      expect(el.innerHTML).not.toMatch(/>\s+</);
    });

    it("produces no whitespace between adjacent tags", () => {
      const el = createElement("basic-element", { label: "Hello" });
      const t = html`
        <div class="inner">
          <span>${"a"}</span>
          <span>${"b"}</span>
        </div>
      `;
      renderTemplate(el, t.strings, t.values);
      // Should be <div><span>a</span><span>b</span></div>, not with whitespace between tags
      expect(el.innerHTML).not.toMatch(/>\s+</);
    });

    it("preserves whitespace between adjacent interpolated HTML fragments", () => {
      const el = createElement("basic-element", { label: "Hello" });
      const t = html`
        <div class="inner">
          ${html`<span>a</span>`}
          ${html`<span>b</span>`}
        </div>
      `;
      renderTemplate(el, t.strings, t.values);
      // Whitespace between fragments is preserved, matching plain HTML behavior
      expect(el.querySelector(".inner").childNodes.length).toBe(3);
      expect(el.querySelector(".inner").children.length).toBe(2);
    });
  });

  describe("DOM diffing", () => {
    it("preserves DOM text node when tagged template value unchanged", () => {
      const el = createElement("basic-element", { label: "Hello" });
      const textNode = el.querySelector(".inner").firstChild;

      // Re-render with same value
      el.setAttribute("label", "Hello");
      // Text node should be the exact same object (not recreated)
      expect(el.querySelector(".inner").firstChild).toBe(textNode);
    });

    it("patches text node directly on value change", async () => {
      const el = createElement("basic-element", { label: "Before" });
      const textNode = el.querySelector(".inner").firstChild;

      el.setAttribute("label", "After");
      await el.updateComplete;
      // Same text node object, but with updated content
      expect(el.querySelector(".inner").firstChild).toBe(textNode);
      expect(el.querySelector(".inner").textContent).toBe("After");
    });

    it("should not fall back to innerHTML when attribute-position value changes", async () => {
      const el = createElement("attr-element", { label: "Hello", variant: "default" });
      const textNode = el.querySelector(".inner").firstChild;

      // Change attribute-position value
      el.setAttribute("variant", "primary");
      await el.updateComplete;
      expect(el.getAttribute("variant")).toBe("primary");
      // Text node was not recreated, but instead was updated directly
      expect(el.querySelector(".inner").firstChild).toBe(textNode);
    });

    it("skips redundant renders when values are unchanged", () => {
      const el = createElement("basic-element", { label: "Test" });

      // Spy on innerHTML setter after initial render
      let innerHTMLCallCount = 0;
      const originalDescriptor =
        Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML") ||
        Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerHTML");
      const origSet = originalDescriptor.set;
      Object.defineProperty(el, "innerHTML", {
        configurable: true,
        get: originalDescriptor.get,
        set(val) {
          innerHTMLCallCount++;
          origSet.call(this, val);
        },
      });

      // Trigger re-render with same value: patch() skips innerHTML
      el.render();
      expect(innerHTMLCallCount).toBe(0);

      delete el.innerHTML;
    });

    it("patches text node with null value", async () => {
      const el = createElement("basic-element", { label: "Hello" });
      el.setAttribute("label", "");
      await el.updateComplete;
      expect(el.querySelector(".inner").textContent).toBe("");
    });

    it("text-only re-render preserves the inner element ref", () => {
      const el = createElement("basic-element", { label: "Hello" });
      const innerEl = el.element;

      el.setAttribute("label", "World");
      // Inner element should be same object
      expect(el.element).toBe(innerEl);
      expect(el.querySelector(".inner")).toBe(innerEl);
    });
  });

  describe("morphing nested components", () => {
    it("morph preserves nested component's rendered content", async () => {
      const el = createElement("nested-element");
      const child = el.querySelector("child-element");
      const childInner = child.querySelector(".child-inner");
      expect(childInner.textContent).toBe("default");
      expect(el.querySelector(".extra")).toBeNull();

      // attribute that doesn't change child component
      el.setAttribute("extra", "");
      await el.updateComplete;
      expect(el.querySelector(".extra")).not.toBeNull();
      expect(el.querySelector("child-element")).toBe(child);
      expect(child.querySelector(".child-inner")).toBe(childInner);
      expect(childInner.textContent).toBe("default");
    });

    it("morph updates nested component's rendered content", async () => {
      const el = createElement("nested-element");
      const child = el.querySelector("child-element");
      expect(child.textContent).toBe("default");

      el.setAttribute("variant", "updated");
      await el.updateComplete;
      expect(child.getAttribute("variant")).toBe("updated");
      expect(child.variant).toBe("updated");
      expect(child.textContent).toBe("updated");
    });

    it("morph updates slotted children of nested composite component", async () => {
      const el = createElement("nested-element");
      const wrapped = el.querySelector("wrapper-element .wrapped");
      expect(wrapped.textContent).toBe("default");

      el.setAttribute("variant", "updated");
      await el.updateComplete;
      expect(wrapped.textContent).toBe("updated");
    });

    it("morph updates slotted children of nested shadow DOM component", async () => {
      const el = createElement("nested-element");
      const slotted = el.querySelector("shadow-slot-element .slotted");
      expect(slotted.textContent).toBe("default");

      el.setAttribute("variant", "updated");
      await el.updateComplete;
      expect(slotted.textContent).toBe("updated");
    });
  });

  describe("template cache lifecycle", () => {
    it("re-render morphs DOM and clears _templateParts", () => {
      const el = createElement("basic-element", { label: "Hello" });
      expect(el._templateParts[0].textContent).toBe("Hello");
      const oldSpan = el.querySelector(".inner");

      // Different strings ref (from this call site) forces morph()
      const t = html`<span class="inner">${"World"}</span>`;
      renderTemplate(el, t.strings, t.values);
      // Morph preserves element identity when structure is stable
      expect(el.querySelector(".inner")).toBe(oldSpan);
      expect(oldSpan.textContent).toBe("World");
      // Parts are null because morph updates live DOM in place
      expect(el._templateParts).toBeNull();
    });

    it("cache stays coherent after disconnect and reconnect", async () => {
      const el = createElement("basic-element", { label: "Hello" });
      const textNode = el._templateParts[0];

      // Remove and re-insert
      const container = document.createElement("div");
      document.body.appendChild(container);
      el.remove();
      container.appendChild(el);

      // After reconnect, patch() should still work with cached parts
      el.setAttribute("label", "World");
      await el.updateComplete;
      expect(el.querySelector(".inner").textContent).toBe("World");
      // Same text node was patched (not a full morph())
      expect(el._templateParts[0]).toBe(textNode);
    });

    it("repeated attribute changes do not grow _templateValues", () => {
      const el = createElement("basic-element", { label: "A" });
      const initialLength = el._templateValues.length;

      el.setAttribute("label", "B");
      el.setAttribute("label", "C");
      el.setAttribute("label", "D");

      expect(el._templateValues.length).toBe(initialLength);
    });
  });

  describe("complex templates", () => {
    it("renders a complex template with all interpolation types", () => {
      const el = createElement("complex-element", {
        label: "Email",
        type: "email",
        name: "email",
        description: "Enter your email",
        error: "Invalid email",
      });
      expect(el.querySelector("label").textContent).toBe("Email");
      expect(el.querySelector(".elena-desc").textContent).toBe("Enter your email");
      expect(el.querySelector(".elena-input").getAttribute("type")).toBe("email");
      expect(el.querySelector(".elena-input").getAttribute("name")).toBe("email");
      expect(el.querySelector(".elena-error").textContent).toBe("Invalid email");
    });

    it("omits conditional HTML blocks when condition is falsy", () => {
      const el = createElement("complex-element", { label: "Name", type: "text" });
      expect(el.querySelector("label").textContent).toBe("Name");
      expect(el.querySelector(".elena-desc")).toBeNull();
      expect(el.querySelector(".elena-error")).toBeNull();
    });

    it("renders conditional HTML block when condition becomes truthy", async () => {
      const el = createElement("complex-element", { label: "Name" });
      expect(el.querySelector(".elena-desc")).toBeNull();

      el.setAttribute("description", "Please enter your name");
      await el.updateComplete;
      expect(el.querySelector(".elena-desc")).not.toBeNull();
      expect(el.querySelector(".elena-desc").textContent).toBe("Please enter your name");
    });

    it("removes conditional HTML block when condition becomes falsy", async () => {
      const el = createElement("complex-element", {
        label: "Name",
        error: "Required",
      });
      expect(el.querySelector(".elena-error").textContent).toBe("Required");

      el.setAttribute("error", "");
      await el.updateComplete;
      expect(el.querySelector(".elena-error")).toBeNull();
    });

    it("handles conditional attributes", () => {
      const el = createElement("complex-element", {
        label: "Name",
        name: "username",
        disabled: true,
      });
      const input = el.querySelector(".elena-input");
      expect(input.getAttribute("name")).toBe("username");
      expect(input.hasAttribute("disabled")).toBe(true);
    });

    it("has no attributes when condition is falsy", () => {
      const el = createElement("complex-element", { label: "Name" });
      const input = el.querySelector(".elena-input");
      // Props are synced as attributes by connectedCallback, so name="" should not be present
      expect(input.getAttribute("name")).toBeNull();
      expect(input.hasAttribute("disabled")).toBe(false);
    });

    it("re-renders correctly when multiple values change", async () => {
      const el = createElement("complex-element", { label: "Name" });
      expect(el.querySelector(".elena-desc")).toBeNull();
      expect(el.querySelector(".elena-error")).toBeNull();

      el.setAttribute("description", "Help text");
      el.setAttribute("error", "Error text");
      await el.updateComplete;
      expect(el.querySelector(".elena-desc").textContent).toBe("Help text");
      expect(el.querySelector(".elena-error").textContent).toBe("Error text");
    });
  });

  describe("_stringsCache WeakMap behavior", () => {
    it("caches string processing across multiple renders from same template literal", () => {
      const tplWithIndent = Object.assign(
        ["<span class='test'>\n            ", "\n          </span>"],
        { raw: ["<span class='test'>\n            ", "\n          </span>"] }
      );

      const el = document.createElement("div");

      // First render
      renderTemplate(el, tplWithIndent, ["hello"]);
      const firstOutput = el.innerHTML;

      // Second render
      renderTemplate(el, tplWithIndent, ["world"]);
      const secondOutput = el.innerHTML;

      // The markup structure should be identical
      expect(firstOutput).toMatch(/<span[^>]*>hello<\/span>/);
      expect(secondOutput).toMatch(/<span[^>]*>world<\/span>/);

      // Both should have no stray indentation
      expect(firstOutput).not.toMatch(/>\s{3,}</);
      expect(secondOutput).not.toMatch(/>\s{3,}</);
    });
  });

  describe("template edge cases", () => {
    it("back-to-back expressions with no static text between them", () => {
      const el = document.createElement("div");
      const t = html`<span>${"hello"}${" world"}</span>`;
      renderTemplate(el, t.strings, t.values);
      expect(el.querySelector("span").textContent).toBe("hello world");
    });

    it("HTML comments in templates", () => {
      const el = document.createElement("div");
      const t = html`<!-- comment --><span>${"value"}</span>`;
      renderTemplate(el, t.strings, t.values);
      expect(el.querySelector("span").textContent).toBe("value");
    });

    it("template with only dynamic content (no static wrapper)", () => {
      const el = document.createElement("div");
      const t = html`${"hello"}`;
      renderTemplate(el, t.strings, t.values);
      expect(el.textContent).toBe("hello");
    });

    it("multiple expressions in same attribute", () => {
      const el = document.createElement("div");
      const t = html`<span class="${"base"} ${"variant"}">text</span>`;
      renderTemplate(el, t.strings, t.values);
      expect(el.querySelector("span").getAttribute("class")).toBe("base variant");
    });

    it("nothing in render output produces empty content", () => {
      const el = document.createElement("div");
      const t = html`<span>${nothing}</span>`;
      renderTemplate(el, t.strings, t.values);
      expect(el.querySelector("span").textContent).toBe("");
    });

    it("less-than signs in text content are escaped", () => {
      const el = document.createElement("div");
      const t = html`<span>${"a < b"}</span>`;
      renderTemplate(el, t.strings, t.values);
      expect(el.querySelector("span").textContent).toBe("a < b");
    });

    it("boolean-like strings render as text", () => {
      const el = document.createElement("div");
      const t = html`<span>${"true"}</span>`;
      renderTemplate(el, t.strings, t.values);
      expect(el.querySelector("span").textContent).toBe("true");
    });

    it("SVG content via unsafeHTML renders correctly", () => {
      const el = document.createElement("div");
      const svg = `<svg width="10" height="10"><circle cx="5" cy="5" r="5"/></svg>`;
      const t = html`<span>${unsafeHTML(svg)}</span>`;
      renderTemplate(el, t.strings, t.values);
      expect(el.querySelector("svg")).not.toBeNull();
    });
  });

  describe("with multiple values", () => {
    it("preserves unchanged text node identity while patching changed node", () => {
      const el = document.createElement("div");

      // Initial render with three text values
      renderTemplate(el, multiValueTemplate, ["A", "B", "C"]);
      const oneNode = el.querySelector(".one").firstChild;
      const twoNode = el.querySelector(".two").firstChild;
      const threeNode = el.querySelector(".three").firstChild;

      expect(oneNode.textContent).toBe("A");
      expect(twoNode.textContent).toBe("B");
      expect(threeNode.textContent).toBe("C");

      // Re-render: change only the middle value
      renderTemplate(el, multiValueTemplate, ["A", "B2", "C"]);

      // The unchanged nodes should still be the same objects (not recreated)
      expect(el.querySelector(".one").firstChild).toBe(oneNode);
      expect(el.querySelector(".three").firstChild).toBe(threeNode);

      // The changed node should be the same object but with updated content
      expect(el.querySelector(".two").firstChild).toBe(twoNode);
      expect(twoNode.textContent).toBe("B2");
    });
  });
});
