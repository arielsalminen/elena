---
title: Component libraries
description: Learn how to build and publish an Elena Progressive Web Component library using @elenajs/bundler, including configuration, bundling, and TypeScript support.
---

# Component libraries

**`@elenajs/bundler`** is the build tool for publishing Elena component libraries. It bundles JavaScript and TypeScript source files, minifies CSS, generates a [Custom Elements Manifest](https://custom-elements-manifest.open-wc.org/), and produces TypeScript declarations for each component.

<img src="/bundler.webp"  width="1844" height="1280" alt="Elena bundler" />

## Install

::: code-group

```sh [npm]
npm install --save-dev @elenajs/bundler
```

```sh [yarn]
yarn add --dev @elenajs/bundler
```

```sh [pnpm]
pnpm add --save-dev @elenajs/bundler
```

```sh [bun]
bun add --dev @elenajs/bundler
```

:::

## CLI usage

The bundler provides an `elena` binary with `build` and `watch` commands:

```bash
npx elena build
```

To start a watch session that rebuilds on file changes:

```bash
npx elena watch
```

### Flags

| Flag               | Description                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `--config <path>`  | Path to a config file. Defaults to `elena.config.mjs` or `elena.config.js` in the project root. |

## Configuration

Create an `elena.config.mjs` (or `elena.config.js`) at the root of your package:

```js
/**
 * ░█ [ELENA]: Bundler configuration
 *
 * @type {import("@elenajs/bundler").ElenaConfig}
 */
export default {
  // Source directory scanned for .js/.ts entry files and .css files.
  input: "src",

  // Rollup output options.
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
    filename: "bundle.js",
  },

  // Entry for the single-file bundle. Set to false to disable.
  bundle: "src/index.js",

  // Additional Rollup plugins appended after Elena’s built-in set.
  plugins: [],

  // Custom Elements Manifest options. Set to false to skip entirely.
  analyze: {
    plugins: [],
  },

  // Browserslist targets for transpilation. Enables syntax transforms
  // (e.g. class fields, optional chaining) to widen browser support.
  target: ["chrome 71", "firefox 69", "safari 12.1"],

  // Custom Terser minifier options, merged with the defaults.
  terser: { ecma: 2020, module: true },

  // Banner comment prepended to bundle output files.
  // Use a @license tag so minifiers preserve it.
  banner: `/** @license MIT */`,

  // Controls how components are registered.
  // "auto" (default) preserves .define() calls in the output.
  // "scoped" strips .define() calls and generates a register.js helper.
  registration: "auto",
};
```

### Options

| Option             | Type                          | Default          | Description                                                                                                                                                                         |
| ------------------ | ----------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`            | `string`                      | `"src"`          | Source directory to scan for `.js`, `.ts`, and `.css` files.                                                                                                                        |
| `output.dir`       | `string`                      | `"dist"`         | Output directory for compiled files.                                                                                                                                                |
| `output.format`    | `string`                      | `"esm"`          | Rollup output format.                                                                                                                                                               |
| `output.sourcemap` | `boolean`                     | `true`           | Whether to emit sourcemaps.                                                                                                                                                         |
| `output.filename`  | `string`                      | `"bundle.js"`    | Output filename for the single-file bundle. The CSS bundle filename is derived by replacing the `.js` extension with `.css`.                                                        |
| `bundle`           | `string \| false`             | `"src/index.js"` | Entry point for the single-file bundle. Auto-detects `src/index.ts` if no `.js` entry exists. Set to `false` to disable.                                                           |
| `plugins`          | `Plugin[]`                    | `[]`             | Additional Rollup plugins appended after the built-in set.                                                                                                                          |
| `analyze`          | `object \| false`             | `{ plugins: [] }` | CEM analysis options. Set to `false` to skip Custom Elements Manifest generation, TypeScript declarations, and JSX types entirely.                                                   |
| `analyze.plugins`  | `Plugin[]`                    | `[]`             | Additional CEM analyzer plugins.                                                                                                                                                    |
| `target`           | `string \| string[] \| false` | `false`          | Browserslist target(s) for transpilation. When set, enables syntax transforms (e.g. class fields, optional chaining) via `@babel/preset-env`. Example: `["chrome 71", "safari 12.1"]`. |
| `terser`           | `object`                      | `{ ecma: 2020, module: true }` | Custom Terser minifier options, merged with the defaults. See the [Terser API docs](https://terser.org/docs/api-reference/) for available options.                      |
| `banner`           | `string \| false`             | `false`          | Banner comment prepended to `index.js` and `bundle.js` output files. Use a `@license` JSDoc tag so minifiers preserve it.                                               |
| `registration`     | `"auto" \| "scoped"`          | `"auto"`         | Controls how components are registered. `"auto"` preserves `.define()` calls in the output. `"scoped"` strips `.define()` calls and generates a `register.js` with a `defineAll(registry?)` helper for [scoped registry](/components/options#scoped-registration) usage. |

## Build output

Running `elena build` produces:

| File                        | Description                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `dist/*.js`                 | Individual ES modules for each source file.                                                          |
| `dist/*.css`                | Minified individual CSS files.                                                                       |
| `dist/bundle.js`            | Single-file JavaScript bundle _(optional)_.                                                          |
| `dist/bundle.css`           | Concatenated and minified CSS bundle. CSS files imported as CSS Module Scripts (`with { type: "css" }`) for Shadow DOM are excluded. |
| `dist/custom-elements.json` | [Custom Elements Manifest](https://custom-elements-manifest.open-wc.org/) describing all components. |
| `dist/custom-elements.d.ts` | JSX integration types mapping tag names to prop types.                                               |
| `dist/*.d.ts`               | Per-component TypeScript declarations with typed props and events.                                   |
| `dist/register.js`          | Registration helper with `defineAll(registry?)` and re-exported component classes. Only generated when using `registration: "scoped"`. |

> [!TIP]
> CSS files that are imported as CSS Module Scripts (`import styles from "./button.css" with { type: "css" }`) for Shadow DOM use are automatically excluded from `bundle.css`. These files are instead inlined as `CSSStyleSheet` objects in the JavaScript output. Individual `.css` files are still emitted.

## Scoped registry builds

When `registration: "scoped"` is set, the bundler strips `.define()` calls and side-effect component imports from the output. Components are exported as bare classes, and a `register.js` helper is generated:

```js
export default {
  registration: "scoped",
};
```

The generated `register.js` exports a `defineAll()` function and re-exports all component classes:

```js
import { defineAll } from "@elenajs/components/register";

const registry = new CustomElementRegistry();
defineAll(registry);
```

You can also import individual classes for selective registration:

```js
import { Button, Spinner } from "@elenajs/components/register";

const registry = new CustomElementRegistry();
Button.define(registry);
Spinner.define(registry);
```

This can be useful when multiple versions of the same library need to coexist on a single application. See [Scoped registration](/components/options#scoped-registration) for more details.

## TypeScript support

The bundler supports both JavaScript and TypeScript source files. When `.ts` files are detected in the source directory, the bundler automatically transpiles them via `@rollup/plugin-typescript`. The output is identical to what you get from JavaScript sources.

To use TypeScript, write your components with inline type annotations instead of JSDoc:

```ts
import { Elena, html } from "@elenajs/core";

export default class Button extends Elena(HTMLElement) {
  static tagName = "elena-button";
  static props = ["variant"];

  /**
   * The style variant of the component.
   * @property
   */
  variant: "default" | "primary" | "danger" = "default";

  render() {
    return html`<button>${this.text}</button>`;
  }
}
Button.define();
```

A `tsconfig.json` is required in the project root. A minimal configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

> [!TIP]
> The bundler handles TypeScript declarations separately via the CEM analyzer. You don’t need `declaration: true` in your `tsconfig.json`.

See the [TypeScript](/advanced/typescript) page for more on using and consuming the generated types.

## Programmatic API

The bundler exports its internals so you can integrate it into your own build scripts:

```js
import {
  createRollupConfig,
  runRollupBuild,
  watchRollupBuild,
  createCemConfig,
  runCemAnalyze,
} from "@elenajs/bundler";
```

Sub-path imports are also available:

```js
import { createRollupConfig, runRollupBuild, watchRollupBuild } from "@elenajs/bundler/rollup";
import { createCemConfig, runCemAnalyze } from "@elenajs/bundler/cem";
```

### `createRollupConfig(options?)`

Returns a Rollup configuration array. Useful if you want to wrap or extend the config in a custom `rollup.config.js`.

### `runRollupBuild(config)`

Runs both build phases (individual modules + optional single-file bundle) programmatically.

### `watchRollupBuild(config, opts?)`

Starts a Rollup watch session that rebuilds on file changes. Returns the Rollup watcher instance. Pass `opts.onRebuild` as an async callback to run after each successful rebuild (e.g. to re-run CEM analysis).

### `createCemConfig(options?)`

Returns the Custom Elements Manifest analyzer configuration object.

### `runCemAnalyze(config, cwd?)`

Runs the CEM analysis and writes `custom-elements.json`, `custom-elements.d.ts`, and per-component `.d.ts` files.

## Example library

**`@elenajs/components`** is a reference component library built with Elena. It demonstrates real-world component patterns and is available as a starting point for your own library.

::: code-group

```sh [npm]
npm install @elenajs/components
```

```sh [yarn]
yarn add @elenajs/components
```

```sh [pnpm]
pnpm add @elenajs/components
```

```sh [bun]
bun add @elenajs/components
```

:::

It includes the following components:

| Component              | Tag                      | Description                                                     |
| ---------------------- | ------------------------ | --------------------------------------------------------------- |
| Button                 | `<elena-button>`         | Renders a `<button>` or `<a>` with variants, states, and icons. |
| Spinner                | `<elena-spinner>`        | Animated loading indicator that inherits the current color.     |
| Stack                  | `<elena-stack>`          | Flexbox layout wrapper with configurable direction and gap.     |
| Visually Hidden        | `<elena-visually-hidden>`| Hides content visually while keeping it accessible.             |

### Usage

Import the full bundle to register all components:

```js
import "@elenajs/components";
```

Or import individual components for better tree-shaking:

```js
import "@elenajs/components/dist/button.js";
import "@elenajs/components/dist/stack.js";
```

Each component has a matching CSS file:

```css
@import "@elenajs/components/dist/button.css";
@import "@elenajs/components/dist/stack.css";
```

Or import the full CSS bundle:

```css
@import "@elenajs/components/dist/bundle.css";
```

When a library is built with `registration: "scoped"`, import from `register.js` to control where components are registered:

```js
import { defineAll } from "@elenajs/components/register";

const registry = new CustomElementRegistry();
defineAll(registry);
```

The source code is in `packages/components/` of the [Elena monorepo](https://github.com/arielsalminen/elena) and serves as an example of how to structure, build, and publish a library with `@elenajs/bundler`.

## Next steps

- Explore [Framework Integration](/advanced/frameworks) examples for React, Vue, Angular, Next.js and more.
