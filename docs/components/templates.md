---
title: Templates
description: Learn how to write component templates using Elena’s html tagged template literal, including conditionals, loops, and XSS-safe interpolation.
---

# Templates <VersionBadge />

Elena uses an HTML-based template syntax built on JavaScript [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

## `html`

Use the `html` tagged template to write your component’s markup:

```js
import { html } from "@elenajs/core";

render() {
  return html`
    <button type="${this.type}">
      ${this.text}
    </button>
  `;
}
```

Values you interpolate are escaped automatically to prevent XSS. Nested `html` fragments are passed through as trusted markup without double-escaping:

```js
render() {
  const badge = html`<span class="badge">${this.count}</span>`;

  return html`
    <button>
      ${this.text} ${badge}
    </button>
  `;
}
```

Arrays of `html` fragments are rendered as HTML, so you can use `.map()` to render lists:

```js
render() {
  return html`
    <ul>
      ${this.items.map(item => html`<li>${item}</li>`)}
    </ul>
  `;
}
```

Templates can also have multiple root elements:

```js
render() {
  return html`
    <label for="${this.identifier}">${this.label}</label>
    <input id="${this.identifier}" type="${this.type}" />
  `;
}
```

## `nothing`

Use `nothing` in conditional template expressions when there is nothing to render. It always produces an empty string and signals the template engine that no processing is needed:

```js
import { html, nothing } from "@elenajs/core";

render() {
  return html`
    <button>
      ${this.icon ? html`<span>${this.icon}</span>` : nothing}
      ${this.text}
    </button>
  `;
}
```

Prefer `nothing` over `""` or `false` in template expressions. Empty strings and boolean false can produce unexpected whitespace or output.

## `unsafeHTML`

Values interpolated into `html` are auto-escaped to prevent XSS. `unsafeHTML` lets you render a plain string as raw HTML, skipping the escaping. Only use this for content you fully control, such as an SVG icon or trusted server markup:

```js
import { html, unsafeHTML, nothing } from "@elenajs/core";

render() {
  const icon = this.icon ? unsafeHTML(`<span>${this.icon}</span>`) : nothing;
  const text = this.text ? html`<span>${this.text}</span>` : nothing;

  return html`
    <button class="my-button">
      ${text} ${icon}
    </button>
  `;
}
```

> [!WARNING]
> Only use `unsafeHTML` with content you control. Never pass user-supplied strings to it.

## Element ref

When `static element` is set, Elena resolves `this.element` after the first render, giving you direct access to the inner DOM element. Use it in `firstUpdated()`, `updated()`, or any custom method:

```js
export default class Button extends Elena(HTMLElement) {
  static element = ".my-button";

  updated() {
    this.element.focus();
  }
}
```

See [Options](./options) for details on `static element`.

## Text content

Every Elena element has a built-in reactive `text` prop. On first connect, Elena captures the element’s text content from the light DOM, so you can pass text naturally as children:

```html
<elena-button>Click me</elena-button>
```

Use `this.text` in `render()` to reference it:

```js
render() {
  return html`<button>${this.text}</button>`;
}
```

Setting `text` programmatically triggers a re-render:

```js
const button = document.querySelector("elena-button");
button.text = "Save changes";
```

When used with frameworks, static text as children works fine. For dynamic text that changes over time, use the `text` property instead, since components with `render()` own their internal DOM and frameworks can’t update children after Elena has rendered:

```html
// React
<elena-button text={buttonText} />

// Angular
<elena-button [text]="buttonText"></elena-button>

// Vue
<elena-button :text="buttonText"></elena-button>
```

## Advanced  examples

### Rendering lists

Use `.map()` to render arrays of data as repeated markup. Each array element can be an `html` fragment, a plain string, or `nothing`:

```js
render() {
  return html`
    <nav>
      ${this.links.map(link =>
        link.visible
          ? html`<a href="${link.url}">${link.label}</a>`
          : nothing
      )}
    </nav>
  `;
}
```

For components where the list data is a prop, use `willUpdate()` to derive the filtered or transformed list before rendering:

```js
willUpdate() {
  this._visibleLinks = this.links.filter(link => link.visible);
}

render() {
  return html`
    <nav>
      ${this._visibleLinks.map(link =>
        html`<a href="${link.url}">${link.label}</a>`
      )}
    </nav>
  `;
}
```

### Conditional attributes

You can conditionally add or remove HTML attributes by interpolating a string or `nothing`:

```js
render() {
  return html`
    <button
      type="${this.type}"
      ${this.disabled ? "disabled" : nothing}
      ${this.label ? html`aria-label="${this.label}"` : nothing}
    >
      ${this.text}
    </button>
  `;
}
```

### Helper render methods

For components that can render as different elements (e.g. a button that becomes a link when `href` is set), split the logic into helper methods and compose them in `render()`:

```js
import { html, unsafeHTML, nothing } from "@elenajs/core";

/** @internal */
renderButton(template) {
  return html`
    <button
      type="${this.type}"
      ${this.disabled ? "disabled" : nothing}
      ${this.label ? html`aria-label="${this.label}"` : nothing}
    >
      ${template}
    </button>
  `;
}

/** @internal */
renderLink(template) {
  return html`
    <a
      href="${this.href}"
      target="${this.target}"
      ${this.download ? "download" : nothing}
      ${this.label ? html`aria-label="${this.label}"` : nothing}
    >
      ${template}
    </a>
  `;
}

render() {
  const icon = this.icon ? unsafeHTML(`<span>${this.icon}</span>`) : nothing;
  const markup = html`
    ${this.text ? html`<span>${this.text}</span>` : nothing}
    ${icon}
  `;

  return this.href ? this.renderLink(markup) : this.renderButton(markup);
}
```

### Multi-root template

Templates can return multiple root elements. Useful for components that pair a label with an input:

```js
render() {
  return html`
    <label for="${this.identifier}">${this.label}</label>
    <div class="input-wrapper">
      ${this.start ? html`<div class="start">${this.start}</div>` : nothing}
      <input
        id="${this.identifier}"
        class="input ${this.start ? "has-start" : nothing}"
      />
    </div>
    ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
  `;
}
```

### Declarative Shadow DOM

Declarative Shadow DOM lets you define a shadow root directly in HTML using a `<template shadowrootmode="open">` element. The browser attaches the shadow root during parsing, so the shadow content is visible before JavaScript loads.

When a component with `static shadow` connects and finds a shadow root already attached, Elena skips `attachShadow()` and works with the existing one instead. Content stays in the light DOM and is projected into the shadow root via `<slot>`:

::: code-group

```html [HTML]
<elena-button>
  <template shadowrootmode="open">
    <link rel="stylesheet" href="button.css" />
    <button><slot></slot></button>
  </template>
  Click me
</elena-button>
```

```js [JavaScript]
import { Elena } from "@elenajs/core";

export default class Button extends Elena(HTMLElement) {
  static tagName = "elena-button";
  static shadow = "open";
}

Button.define();
```

:::

In practice, you have to write the `<template>` block by hand every time you use the component, which gets repetitive quickly unless you abstract this duplication away in your own application. `@elenajs/ssr` may later get Declarative Shadow DOM support which would eliminate that entirely, but this isn’t currently on our roadmap. 

For now, Declarative Shadow DOM is mainly useful when you need Shadow DOM style isolation and want the component to be visible before JavaScript loads.
