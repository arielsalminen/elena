import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ssr, register, unregister } from "../src/index.js";
import { html } from "../../core/src/common/utils.js";

describe("ssr", () => {
  it("renders a primitive component with text content", () => {
    const html = ssr(`<elena-button>Click me</elena-button>`);
    expect(html).toBe(
      "<elena-button hydrated><button><span>Click me</span></button></elena-button>"
    );
  });

  it("renders a primitive component with attributes", () => {
    const html = ssr(`<elena-button variant="primary">OK</elena-button>`);
    expect(html).toBe(
      '<elena-button variant="primary" hydrated><button><span>OK</span></button></elena-button>'
    );
  });

  it("renders boolean attributes", () => {
    const html = ssr(`<elena-button disabled>No</elena-button>`);
    expect(html).toBe(
      "<elena-button disabled hydrated><button><span>No</span></button></elena-button>"
    );
  });

  it("renders attribute interpolation in templates", () => {
    const html = ssr(`<elena-input type="email" placeholder="you@example.com"></elena-input>`);
    expect(html).toBe(
      '<elena-input type="email" placeholder="you@example.com" hydrated><input type="email" placeholder="you@example.com" /></elena-input>'
    );
  });

  it("renders conditional content (active)", () => {
    const html = ssr(`<elena-conditional label="Go" active></elena-conditional>`);
    expect(html).toBe(
      '<elena-conditional label="Go" active hydrated><button>Go</button></elena-conditional>'
    );
  });

  it("renders conditional content (inactive)", () => {
    const html = ssr(`<elena-conditional label="Go"></elena-conditional>`);
    expect(html).toBe(
      '<elena-conditional label="Go" hydrated><button></button></elena-conditional>'
    );
  });

  it("renders nested html templates", () => {
    const html = ssr(`<elena-nested description="Hello"></elena-nested>`);
    expect(html).toBe(
      '<elena-nested description="Hello" hydrated><div><p>Hello</p></div></elena-nested>'
    );
  });

  it("escapes HTML in text content (XSS prevention)", () => {
    const html = ssr(`<elena-xss label='<script>alert("xss")</script>'></elena-xss>`);
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>alert");
  });

  it("handles component with no render output", () => {
    const html = ssr(`<elena-empty></elena-empty>`);
    expect(html).toBe("<elena-empty hydrated></elena-empty>");
  });

  it("passes through non-Elena HTML unchanged", () => {
    const html = ssr(`<div class="wrapper"><p>Hello</p></div>`);
    expect(html).toBe('<div class="wrapper"><p>Hello</p></div>');
  });

  it("passes through void elements", () => {
    const html = ssr(`<br><hr><img src="test.png">`);
    expect(html).toBe('<br><hr><img src="test.png">');
  });

  it("preserves word boundaries between inline elements", () => {
    const html = ssr(`<span>hello</span> <span>world</span>`);
    expect(html).toBe("<span>hello</span> <span>world</span>");
  });

  it("preserves non-breaking spaces", () => {
    const html = ssr(`<p>hello\u00A0world</p>`);
    expect(html).toContain("hello\u00A0world");
  });

  it("renders a Composite Component preserving children", () => {
    const html = ssr(`<elena-stack direction="row"><p>Hello</p></elena-stack>`);
    expect(html).toBe('<elena-stack direction="row"><p>Hello</p></elena-stack>');
  });

  it("renders nested primitive inside Composite Component", () => {
    const html = ssr(`
      <elena-stack>
        <elena-button>Send</elena-button>
      </elena-stack>
    `);
    expect(html).toBe(
      "<elena-stack> <elena-button hydrated><button><span>Send</span></button></elena-button> </elena-stack>"
    );
  });

  it("renders multiple primitives inside Composite Component", () => {
    const html = ssr(`
      <elena-stack direction="row">
        <elena-input type="email" placeholder="you@example.com"></elena-input>
        <elena-button>Send</elena-button>
      </elena-stack>
    `);
    expect(html).toBe(
      '<elena-stack direction="row"> ' +
        '<elena-input type="email" placeholder="you@example.com" hydrated>' +
        '<input type="email" placeholder="you@example.com" />' +
        "</elena-input> " +
        "<elena-button hydrated><button><span>Send</span></button></elena-button> " +
        "</elena-stack>"
    );
  });

  it("renders deeply nested composites and primitives", () => {
    const html = ssr(`
      <elena-stack>
        <elena-stack direction="row">
          <elena-button variant="primary">Save</elena-button>
          <elena-button>Cancel</elena-button>
        </elena-stack>
      </elena-stack>
    `);
    expect(html).toBe(
      "<elena-stack> " +
        '<elena-stack direction="row"> ' +
        '<elena-button variant="primary" hydrated><button><span>Save</span></button></elena-button> ' +
        "<elena-button hydrated><button><span>Cancel</span></button></elena-button> " +
        "</elena-stack> " +
        "</elena-stack>"
    );
  });

  it("renders a complex template with multiple conditionals and attribute interpolation", () => {
    const html = ssr(
      `<elena-complex-input identifier="email" label="Email" type="email" start="@" error="Required"></elena-complex-input>`
    );
    expect(html).toContain('for="email">Email</label>');
    expect(html).toContain('<div class="elena-input-start">@</div>');
    expect(html).toContain('id="email"');
    expect(html).toContain("elena-input-has-start");
    expect(html).toContain('<div class="elena-input-error">Required</div>');
  });

  it("renders a complex template with conditionals omitted", () => {
    const html = ssr(
      `<elena-complex-input identifier="name" label="Name" type="text"></elena-complex-input>`
    );
    expect(html).toContain('for="name">Name</label>');
    expect(html).toContain('id="name"');
    expect(html).not.toContain("elena-input-start");
    expect(html).not.toContain("elena-input-has-start");
    expect(html).not.toContain("elena-input-error");
  });

  it("renders a complex template inside a composite", () => {
    const html = ssr(`
      <elena-stack>
        <elena-complex-input identifier="email" label="Email" type="email" error="Invalid"></elena-complex-input>
        <elena-button>Submit</elena-button>
      </elena-stack>
    `);
    expect(html).toContain('for="email">Email</label>');
    expect(html).toContain('<div class="elena-input-error">Invalid</div>');
    expect(html).toContain("<button><span>Submit</span></button>");
    expect(html).toMatch(/^<elena-stack>.*<\/elena-stack>$/);
  });
});

describe("native DOM properties", () => {
  it("does not crash when setting style, class, or id on a component with native setters", () => {
    const html = ssr(
      `<elena-native-test variant="primary" style="color: red" class="my-class" id="my-id">Click</elena-native-test>`
    );
    expect(html).toContain("<button>Click</button>");
    expect(html).toContain('variant="primary"');
    expect(html).toContain('style="color: red"');
    expect(html).toContain('class="my-class"');
    expect(html).toContain('id="my-id"');
  });
});

describe("demo page markup", () => {
  it("renders the full demo page markup without crashing", () => {
    const markup = `<h1>Elena</h1>
                <p>
                  Demonstrating Elena's
                  <a href="https://github.com/arielsalminen/elena">Progressive Web Components</a> in plain HTML:
                </p>
                <!-- uses MIT licensed icons from https://tabler.io/icons -->

                <section>
                  <h2>Default</h2>
                  <elena-stack direction="row">
                    <elena-button>Button</elena-button>
                    <elena-button icon="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M5 12l5 5l10 -10'/></svg>"> Download </elena-button>
                    <elena-button label="Settings" icon="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0'/></svg>"></elena-button>
                  </elena-stack>
                  <pre>
            <code>&lt;<i>elena-stack</i> direction="row"&gt;
              &lt;<i>elena-button</i>&gt;Button&lt;/<i>elena-button</i>&gt;
            &lt;/<i>elena-stack</i>&gt;</code></pre>
                </section>

                <section>
                  <h2>Variant</h2>
                  <elena-stack direction="row">
                    <elena-button variant="primary">Primary</elena-button>
                    <elena-button variant="default">Default</elena-button>
                    <elena-button variant="danger">Danger</elena-button>
                    <elena-button variant="outline">Outline</elena-button>
                    <elena-button disabled>Disabled</elena-button>
                  </elena-stack>
                </section>

                <section>
                  <h2>Style</h2>
                  <elena-stack direction="row">
                    <elena-button style="--elena-button-bg: #ffddd2"> Custom style </elena-button>
                    <elena-button style="--elena-button-bg: #ffddd2" icon="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M7 11v8'/></svg>"> Like </elena-button>
                  </elena-stack>
                </section>`;

    const html = ssr(markup);

    // Components expanded
    expect(html).toContain("<button><span>Button</span></button>");
    expect(html).toContain("<button><span>Primary</span></button>");

    // Attributes preserved on host
    expect(html).toContain('variant="primary"');
    expect(html).toContain('style="--elena-button-bg: #ffddd2"');

    // Pre block entities preserved
    expect(html).toContain("&lt;");
    expect(html).toContain("<i>elena-stack</i>");

    // Pre block whitespace preserved
    expect(html).toContain("\n");

    // Comment preserved
    expect(html).toContain("<!-- uses MIT licensed icons from https://tabler.io/icons -->");
  });
});

describe("text node escaping", () => {
  it("re-encodes HTML entities decoded by the parser", () => {
    const html = ssr(`<p>Use &lt;elena-button&gt; for actions</p>`);
    expect(html).toContain("&lt;elena-button&gt;");
    expect(html).not.toContain("<elena-button>");
  });

  it("escapes ampersands in text content", () => {
    const html = ssr(`<p>Tom &amp; Jerry</p>`);
    expect(html).toContain("Tom &amp; Jerry");
  });
});

describe("pre block whitespace", () => {
  it("preserves whitespace inside pre elements", () => {
    const html = ssr(`<pre>  line one\n  line two</pre>`);
    expect(html).toContain("  line one\n  line two");
  });

  it("preserves whitespace inside pre > code with entities", () => {
    const html = ssr(
      `<pre><code>&lt;elena-button&gt;Click&lt;/elena-button&gt;\n&lt;elena-button variant="primary"&gt;OK&lt;/elena-button&gt;</code></pre>`
    );
    expect(html).toContain("&lt;elena-button&gt;Click&lt;/elena-button&gt;");
    expect(html).toContain(
      "&lt;elena-button variant=&quot;primary&quot;&gt;OK&lt;/elena-button&gt;"
    );
    expect(html).toContain("\n");
  });

  it("preserves indentation in pre blocks alongside Elena components", () => {
    const html = ssr(`
      <elena-stack direction="row">
        <elena-button>Click</elena-button>
      </elena-stack>
      <pre>
  <code>&lt;elena-stack&gt;
    &lt;elena-button&gt;Click&lt;/elena-button&gt;
  &lt;/elena-stack&gt;</code></pre>
    `);
    expect(html).toContain(
      "<elena-button hydrated><button><span>Click</span></button></elena-button>"
    );
    expect(html).toContain("&lt;elena-button&gt;Click&lt;/elena-button&gt;");
    expect(html).toContain("\n");
  });
});

describe("whitespace-sensitive elements", () => {
  it("preserves whitespace inside textarea", () => {
    const html = ssr(`<textarea>  line one\n  line two\n  line three</textarea>`);
    expect(html).toContain("  line one\n  line two\n  line three");
  });

  it("preserves whitespace inside textarea with attributes", () => {
    const html = ssr(`<textarea name="body" rows="5">first\nsecond</textarea>`);
    expect(html).toBe('<textarea name="body" rows="5">first\nsecond</textarea>');
  });

  it("preserves whitespace inside listing elements", () => {
    const html = ssr(`<listing>  indented\n  block</listing>`);
    expect(html).toContain("  indented\n  block");
  });

  it("preserves whitespace inside xmp elements", () => {
    const html = ssr(`<xmp>  indented\n  block</xmp>`);
    expect(html).toContain("  indented\n  block");
  });
});

describe("willUpdate lifecycle", () => {
  it("calls willUpdate() before render() so derived state is available in the template", () => {
    const html = ssr(`<elena-will-update base="hello"></elena-will-update>`);
    expect(html).toBe(
      '<elena-will-update base="hello" hydrated><span>computed:hello</span></elena-will-update>'
    );
  });
});

describe("prop type coercion", () => {
  it("coerces number props from attribute strings", () => {
    // count defaults to 0 (number). Receives "5" as string from HTML.
    // render() computes count + 1; correct coercion gives 6, wrong gives "51".
    const html = ssr(`<elena-typed count="5" items="[]"></elena-typed>`);
    expect(html).toContain('data-count="6"');
  });

  it("coerces array props from JSON attribute strings", () => {
    const html = ssr(`<elena-typed count="0" items='["a","b","c"]'></elena-typed>`);
    expect(html).toContain("a,b,c");
  });

  it("handles { name, reflect: false } object form in static props", () => {
    const html = ssr(`<elena-reflect-false label="Save" icon="★"></elena-reflect-false>`);
    expect(html).toBe(
      '<elena-reflect-false label="Save" icon="★" hydrated><button>Save<span>★</span></button></elena-reflect-false>'
    );
  });
});

describe("boolean attribute coercion", () => {
  it("coerces bare boolean attributes", () => {
    const result = ssr(`<elena-bool-prop active label="Go"></elena-bool-prop>`);
    expect(result).toContain("<button>Go</button>");
  });

  it('coerces boolean attributes with value "true"', () => {
    const result = ssr(`<elena-bool-prop active="true" label="Go"></elena-bool-prop>`);
    expect(result).toContain("<button>Go</button>");
  });

  it("coerces boolean attributes with name as value", () => {
    const result = ssr(`<elena-bool-prop active="active" label="Go"></elena-bool-prop>`);
    expect(result).toContain("<button>Go</button>");
  });
});

describe("text attribute", () => {
  it("uses text attribute when no children are present", () => {
    const result = ssr(`<elena-button text="Click me"></elena-button>`);
    expect(result).toBe(
      '<elena-button text="Click me" hydrated><button><span>Click me</span></button></elena-button>'
    );
  });

  it("text attribute overrides text children", () => {
    const result = ssr(`<elena-button text="Override">Original</elena-button>`);
    expect(result).toContain("<span>Override</span>");
    expect(result).not.toContain("Original");
  });
});

describe("recursive text content", () => {
  it("captures text from nested child elements", () => {
    const result = ssr(`<elena-button><b>Bold</b> text</elena-button>`);
    expect(result).toContain("<span>Bold text</span>");
  });

  it("captures text from deeply nested elements", () => {
    const result = ssr(`<elena-button><span><em>Deep</em></span></elena-button>`);
    expect(result).toContain("<span>Deep</span>");
  });
});

describe("DOCTYPE preservation", () => {
  it("preserves <!DOCTYPE html> declarations", () => {
    const result = ssr(`<!DOCTYPE html><html><body><p>Hello</p></body></html>`);
    expect(result).toMatch(/^<!DOCTYPE html>/);
    expect(result).toContain("<p>Hello</p>");
  });
});

describe("error handling", () => {
  let warnSpy;
  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("falls back gracefully when render() throws", () => {
    const result = ssr(`<elena-error>Fallback</elena-error>`);
    expect(result).toBe("<elena-error>Fallback</elena-error>");
    expect(result).not.toContain("hydrated");
  });

  it("continues rendering sibling components after an error", () => {
    const result = ssr(`<elena-error>Oops</elena-error><elena-button>OK</elena-button>`);
    expect(result).toContain("<elena-error>Oops</elena-error>");
    expect(result).toContain("<button><span>OK</span></button>");
  });
});

describe("inherited render", () => {
  it("expands components with inherited render methods", () => {
    const result = ssr(`<inherited-child label="Hello"></inherited-child>`);
    expect(result).toBe(
      '<inherited-child label="Hello" hydrated><span>Hello</span></inherited-child>'
    );
  });
});

describe("registry management", () => {
  it("unregister removes a specific component", () => {
    class TempComp {
      static tagName = "temp-unreg";
      render() {
        return html`<span>temp</span>`;
      }
    }
    register(TempComp);
    expect(ssr("<temp-unreg></temp-unreg>")).toContain("hydrated");

    unregister(TempComp);
    expect(ssr("<temp-unreg></temp-unreg>")).toBe("<temp-unreg></temp-unreg>");
  });
});

describe("register", () => {
  it("throws for components without tagName", () => {
    class NoTag {
      render() {
        return "";
      }
    }
    expect(() => register(NoTag)).toThrow("tagName");
  });
});
