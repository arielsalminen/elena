---
title: Server-side rendering (SSR)
description: Learn how Elena supports server-side rendering (SSR), and how to use @elenajs/ssr for Primitive Components with render().
---

# Server-side rendering

Elena’s approach to server-side rendering is simple and straightforward. Since [Progressive Web Components](/components/overview) are primarily HTML and CSS, you don’t need any special logic on the server to render them.

Components without a `render()` method are fully SSR-compatible by default, while components with `render()` provide partial support and complete hydration on the client&nbsp;side. 

The “partial support” bit for the latter means that you can render the initial state without JavaScript, but JS is needed for the interactivity _(unless you also use the provided [@elenajs/ssr](#rendering-to-html-strings) tool)._

Elena also supports [Declarative Shadow DOM](#declarative-shadow-dom) for cases where you may need stronger isolation, but still want the component to render server-side.

## Avoiding layout shifts

For components with `render()` specifically, our recommendation is to ship them with CSS styles that visually match the loading and `hydrated` states. This can be achieved utilizing the provided `hydrated` attribute in your web component’s styles:

```css
/* Elena CSS pre-hydration styles */
:scope:not([hydrated]),
.element { ... }
```

Since both selectors now share the same baseline styles, there are no visible layout shifts, FOUC, or FOIC (Flash Of Unstyled Content, Flash Of Invisible Content). For more details, see the [CSS pre-hydration styles](/components/styles#css-pre-hydration-styles) section.

## Rendering to HTML strings <Badge type="danger" text="Experimental" />

When you don’t want to handle the pre-hydration state with CSS, you can expand component templates inline using [@elenajs/ssr](https://github.com/arielsalminen/elena/tree/main/packages/ssr). Please note that this is an experimental package and we do not recommend it for production just yet.

> [!WARNING]
> `@elenajs/ssr` is an experimental package and not yet ready for production use. APIs may change without notice.

### Install

::: code-group

```sh [npm]
npm install @elenajs/ssr
```

```sh [yarn]
yarn add @elenajs/ssr
```

```sh [pnpm]
pnpm add @elenajs/ssr
```

```sh [bun]
bun add @elenajs/ssr
```

:::

### Basic usage

Register your components once, then pass any HTML string through `ssr()`:

```js
import { ssr, register } from "@elenajs/ssr";
const { Button } = await import("@elenajs/components");

register(Button);

const html = ssr(`<elena-button variant="primary">Save</elena-button>`);
// Outputs: '<elena-button variant="primary"><button>Save</button></elena-button>'
```

### With nesting

Nested Elena components are expanded automatically:

```js
import { ssr, register } from "@elenajs/ssr";
const { Button, Stack, Input } = await import("@elenajs/components");

register(Button, Stack, Input);

const html = ssr(`
  <elena-stack direction="row">
    <elena-input label="Email" type="email" placeholder="you@example.com"></elena-input>
    <elena-button>Send</elena-button>
  </elena-stack>
`);
```

Output:

```html
<elena-stack direction="row">
  <elena-input type="email" placeholder="you@example.com">
    <label for="email">Email</label>
    <input id="email" type="email" placeholder="you@example.com" />
  </elena-input>
  <elena-button><button>Send</button></elena-button>
</elena-stack>
```

## `@elenajs/ssr` API

### `register(...components)`

Register Elena component classes for SSR expansion. Each class must have a `tagName` defined. Call this once before using `ssr()`.

```js
import { register } from "@elenajs/ssr";
const { Button, Stack } = await import("@elenajs/components");

register(Button, Stack);
```

Throws an error if a component does not have a `tagName`.

### `ssr(html)`

Parse an HTML string, expand registered components with `render()`, and return the rendered HTML. Full HTML documents are supported: `<!DOCTYPE>`, `<html>`, `<head>`, and `<body>` tags are preserved as-is alongside Elena component expansion.

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `html`    | `string` | HTML string containing Elena components. |

**Returns:** `string`, the rendered HTML with components expanded.

### `unregister(...components)`

Remove previously registered component classes from the SSR registry.

```js
import { register, unregister } from "@elenajs/ssr";
const { Button } = await import("@elenajs/components");

register(Button);
// ... later
unregister(Button);
```

### `clear()`

Remove all registered component classes from the SSR registry at once.

```js
import { clear } from "@elenajs/ssr";

clear();
```

### How it works

1. **Parse** the input HTML string into a tree.
2. **Walk** the tree and look up each custom element tag in the registry.
3. **Expand** matching custom elements by calling their `render()`.
4. **Recurse** into composite component children and non-component tags.
5. **Serialize** the tree back to an HTML string.

The rendered output matches what Elena produces on the client, using the same `html` tagged template escaping and whitespace normalization.

> [!TIP]
> If a component’s `render()` throws an error, the SSR renderer logs a warning and falls back to passing the component through without expansion, preserving its original children. This prevents a single broken component from affecting the rest of the page.

### Client-side hydration

The HTML produced by `ssr()` is designed for progressive enhancement. When the component JavaScript loads on the client:

1. Elena’s `connectedCallback` fires on the pre-rendered element.
2. `render()` runs and hydrates the component with interactivity.
3. Event listeners are attached and methods become available.

## Pre-rendering with Eleventy

Use `@elenajs/ssr` with [Eleventy](https://www.11ty.dev/) as either a transform or a shortcode.

#### As a transform

A transform processes every rendered page automatically, expanding any registered components with `render()` found in the output HTML. No shortcodes or special syntax needed: just write Elena components directly in your templates:

```js
// eleventy.config.js
import { ssr, register } from "@elenajs/ssr";
const { Button, Stack, Input } = await import("@elenajs/components");

register(Button, Stack, Input);

export default function (eleventyConfig) {
  eleventyConfig.addTransform("elena-ssr", (content, outputPath) => {
    if (outputPath?.endsWith(".html")) {
      return ssr(content);
    } else {
      return content;
    }
  });
}
```

> [!TIP]
> Use `await import()` for component modules rather than a static `import` statement. Elena components extend `HTMLElement`, which requires a Node.js shim that `@elenajs/ssr` installs when it loads. Dynamic imports guarantee the shim is in place first, regardless of how an import sorter may reorder your static imports.

Then use Elena components directly in any Nunjucks, Liquid, or Markdown template:

```html
<elena-stack direction="row">
  <elena-input type="email" placeholder="you@example.com"></elena-input>
  <elena-button variant="primary">Subscribe</elena-button>
</elena-stack>
```

#### As a shortcode

If you prefer more control over which parts of a page are processed, use a shortcode instead:

```js
// eleventy.config.js
import { ssr, register } from "@elenajs/ssr";
const { Button } = await import("@elenajs/components");

register(Button);

export default function (eleventyConfig) {
  eleventyConfig.addShortcode("render", (html) => ssr(html));
}
```

Then in a template:

```html
{% render '<elena-button variant="primary">Save</elena-button>' %}
```

## Pre-rendering without a framework

If you’re working with plain HTML files and no framework or static site generator, you can use `@elenajs/ssr` directly in a Node.js build script. Place your HTML files in a `src/` directory and the script will expand all registered Elena components into `dist/`:

```js
// build.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { ssr, register } from "@elenajs/ssr";
const { Button, Stack } = await import("@elenajs/components");

register(Button, Stack);

mkdirSync("dist", { recursive: true });

for (const file of readdirSync("src").filter(f => f.endsWith(".html"))) {
  const html = readFileSync(`src/${file}`, "utf-8");
  writeFileSync(`dist/${file}`, ssr(html));
}
```

Given a source file `src/index.html`:

```html
<elena-stack direction="row">
  <elena-button variant="primary">Save</elena-button>
  <elena-button>Cancel</elena-button>
</elena-stack>
```

The script produces `dist/index.html`:

```html
<elena-stack direction="row">
  <elena-button variant="primary" hydrated><button>Save</button></elena-button>
  <elena-button hydrated><button>Cancel</button></elena-button>
</elena-stack>
```

You can add this as an npm script in your `package.json` for convenience:

```json
{
  "scripts": {
    "build": "node build.mjs"
  }
}
```

Running `pnpm build` will generate the pre-rendered output.

> [!TIP]
> Use `await import()` for component modules rather than a static `import` statement. Elena components extend `HTMLElement`, which requires a Node.js shim that `@elenajs/ssr` installs when it loads. Dynamic imports guarantee the shim is in place first, regardless of how an import sorter may reorder your static imports.

## Declarative Shadow DOM

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

## Framework examples

Elena currently provides SSR examples for the following frameworks:

- **[Eleventy](https://github.com/getelena/eleventy-example-project)**
- **[Plain HTML](https://github.com/getelena/html-example-project)**
- **[Next.js](https://github.com/getelena/next-example-project):** Elena can be used inside [React Server Components](https://github.com/getelena/next-example-project/blob/main/src/app/page.tsx)

