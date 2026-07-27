<br/>
<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://elenajs.com/elena-v2-dark.png" alt="Elena" width="127" height="156">
  </source>
  <source media="(prefers-color-scheme: light)" srcset="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
  </source>
  <img src="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
</picture>

### Simple, tiny library for building Progressive Web Components

<br/>

<a href="https://arielsalminen.com"><img src="https://img.shields.io/badge/creator-@arielle-F95B1F" alt="Creator @arielle"/></a>
<a href="https://www.npmjs.com/org/elenajs"><img src="https://img.shields.io/npm/v/@elenajs/core.svg" alt="Latest version on npm" /></a>
<a href="https://github.com/arielsalminen/elena/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="Elena is released under the MIT license." /></a>
<a href="https://github.com/arielsalminen/elena/actions/workflows/tests.yml"><img src="https://img.shields.io/badge/coverage-100%25-green" alt="Coverage 100%" /></a>
<a href="https://www.npmjs.com/package/@elenajs/core"><img src="https://img.shields.io/npm/dt/@elenajs/core.svg" alt="Total Downloads"></a>
<a href="https://github.com/arielsalminen/elena/actions/workflows/tests.yml"><img src="https://github.com/arielsalminen/elena/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>

</div>

<br/>

<p align="center">Elena is a simple, tiny library for building <a href="https://elenajs.com/">Progressive Web Components</a>. Unlike most web component libraries, Elena doesn’t force JavaScript for everything. You can load HTML and CSS first, then use JavaScript to progressively add interactivity.</p>

<br/>

> [!NOTE]
> **[github.com/arielsalminen/elena](https://github.com/arielsalminen/elena) is the official Elena repository.** The project moved here from `getelena/elena`, which no longer exists. As far as package usage goes, nothing has changed; `@elenajs/*` packages keep the same names, versioning, and npm organization.

<br/>

## Features

- 🔋 **Extremely lightweight:** 2.9kB minified & compressed, simple and tiny by design.
- 📈 **Progressively enhanced:** Renders HTML & CSS first, then hydrates with JavaScript.
- 🫶 **Accessible by default:** Semantic HTML foundation with no Shadow DOM barriers.
- 🌍 **Standards based:** Built entirely on native custom elements & web standards.
- ⚡ **Reactive updates:** Prop and state changes trigger efficient, batched re-renders.
- 🎨 **Scoped styles:** Simple & clean CSS encapsulation without complex workarounds.
- 🖥️ **SSR friendly:** Works out of the box, with optional server-side utilities if needed.
- 🧩 **Zero dependencies:** No runtime dependencies, runs entirely on the web platform.
- 🔓 **Zero lock-in:** Works with every major framework, or no framework at all.

## Usage

To install Elena as a dependency, run:

```sh
npm install @elenajs/core
```

Then import Elena in a web component:

```js
import { Elena } from "@elenajs/core";

class Stack extends Elena(HTMLElement) {
  static tagName = "my-stack";
  static props = ["direction"];

  direction = "column";
}

Stack.define();
```

**See the full documentation at [elenajs.com](https://elenajs.com).**

## Why was Elena created

Elena was created by [@arielle](https://arielsalminen.com/) after nearly a decade of building enterprise-scale design systems with web components. The recurring pain points were often similar: accessibility issues, server-side rendering, layout shifts, flash of invisible content, React Server Components, too much reliance on client side JavaScript, and compatibility with e.g. third party analytics tools.

Elena was built to solve these problems while staying grounded in web standards and what the platform natively provides. This is how [Progressive Web Components](https://arielsalminen.com/2026/progressive-web-components/) were born.

## Why should I use Elena

**Elena is built for teams creating component libraries and design systems.** If you need web components that work across multiple frameworks (such as [React](https://react.dev), [Next.js](https://nextjs.org), [Vue](https://vuejs.org), [Angular](https://angular.dev)), render HTML and CSS before JavaScript loads, and sidestep common issues like accessibility problems, SSR limitations, and layout shifts, Elena is built for exactly that.

It handles the cross-framework complexity (prop/attribute syncing, event delegation, framework compatibility) so you can focus on building components rather than plumbing.

## Next steps

- Start with the [Quick Start](https://elenajs.com/start/) guide.
- View the [Live examples](https://elenajs.com/examples/) for demos.
- Try Elena in the [Playground](https://elenajs.com/playground/).
- Read how [Elena compares](https://elenajs.com/advanced/faq#how-does-elena-compare-against-other-tools) against other web component libraries.
- Browse our [FAQ](https://elenajs.com/advanced/faq) for frequently asked questions.

## Provided tools

Elena is a monorepo containing several tools (13 in total!) published to npm under the `@elenajs` scope. These are the main tools intended for development:

| Package | Description | Version | Stability |
| --- | --- | --- | --- |
| [`@elenajs/core`](https://github.com/arielsalminen/elena/tree/main/packages/core) | Elena core runtime library. | [![npm](https://img.shields.io/npm/v/@elenajs/core.svg)](https://www.npmjs.com/package/@elenajs/core) | ![stability-stable](https://img.shields.io/badge/stability-stable-green.svg) |
| [`@elenajs/components`](https://github.com/arielsalminen/elena/tree/main/packages/components) | Elena demo web components. | [![npm](https://img.shields.io/npm/v/@elenajs/components.svg)](https://www.npmjs.com/package/@elenajs/components) | ![stability-stable](https://img.shields.io/badge/stability-stable-green.svg) |
| [`@elenajs/bundler`](https://github.com/arielsalminen/elena/tree/main/packages/bundler) | Elena bundler for component libraries. | [![npm](https://img.shields.io/npm/v/@elenajs/bundler.svg)](https://www.npmjs.com/package/@elenajs/bundler) | ![stability-stable](https://img.shields.io/badge/stability-stable-green.svg) |
| [`@elenajs/cli`](https://github.com/arielsalminen/elena/tree/main/packages/cli) | Elena CLI for scaffolding web components. | [![npm](https://img.shields.io/npm/v/@elenajs/cli.svg)](https://www.npmjs.com/package/@elenajs/cli) | ![stability-stable](https://img.shields.io/badge/stability-stable-green.svg) |
| [`@elenajs/ssr`](https://github.com/arielsalminen/elena/tree/main/packages/ssr) | Elena server-side rendering tools. | [![npm](https://img.shields.io/npm/v/@elenajs/ssr.svg)](https://www.npmjs.com/package/@elenajs/ssr) | ![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg) |
| [`@elenajs/mcp`](https://github.com/arielsalminen/elena/tree/main/packages/ssr) | Elena MCP server. | [![npm](https://img.shields.io/npm/v/@elenajs/mcp.svg)](https://www.npmjs.com/package/@elenajs/mcp) | ![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg) |

<!-- https://github.com/orangemug/stability-badges -->

## License

Released under the MIT License. Copyright © 2025-2026 [Ariel Salminen](https://arielsalminen.com).
