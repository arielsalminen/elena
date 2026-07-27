<br/>
<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://elenajs.com/elena-v2-dark.png" alt="Elena" width="127" height="156">
  </source>
  <source media="(prefers-color-scheme: light)" srcset="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
  </source>
  <img src="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
</picture>

### Rollup plugin that minifies and bundles individual Elena CSS files

<br/>

<a href="https://arielsalminen.com"><img src="https://img.shields.io/badge/creator-@arielle-F95B1F" alt="Creator @arielle"/></a>
<a href="https://www.npmjs.com/package/@elenajs/plugin-rollup-css"><img src="https://img.shields.io/npm/v/@elenajs/plugin-rollup-css.svg" alt="Latest version on npm" /></a>
<a href="https://github.com/arielsalminen/elena/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="Elena is released under the MIT license." /></a>
<a href="https://github.com/arielsalminen/elena/actions/workflows/tests.yml"><img src="https://github.com/arielsalminen/elena/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>

</div>

<br/>

<p align="center"><strong>@elenajs/plugin-rollup-css</strong> is a <a href="https://rollupjs.org">Rollup</a> plugin that minifies individual Elena CSS files and optionally concatenates them into a single bundle. Built for <a href="https://elenajs.com">Elena</a> Progressive Web Component libraries, but works with any Rollup project.</p>

<br/>

## Table of contents

- **[Install](#install)**
- **[Usage](#usage)**
  - **[Individual CSS files](#individual-css-files)**
  - **[CSS bundle](#css-bundle)**
  - **[CSS Module Scripts](#css-module-scripts)**
  - **[Static styles](#static-styles)**
  - **[All together](#all-together)**
- **[API](#api)**
  - **[`cssPlugin(srcDir)`](#csspluginsrcdir)**
  - **[`cssBundlePlugin(srcDir, fileName)`](#cssbundlepluginsrcdir-filename)**
  - **[`cssModuleScriptPlugin()`](#cssmodulescriptplugin)**
  - **[`cssStaticStylesPlugin()`](#cssstaticstylesplugin)**
  - **[`minifyCss(css, filename?)`](#minifycsscss-filename)**

## Install

```bash
npm install --save-dev @elenajs/plugin-rollup-css
```

**Peer dependency:** `rollup >= 4.0.0`

## Usage

### Individual CSS files

Emit minified copies of each CSS file from your source directory:

```js
// rollup.config.js
import { cssPlugin } from "@elenajs/plugin-rollup-css";

export default {
  input: "src/index.js",
  output: { dir: "dist", format: "esm" },
  plugins: [cssPlugin("src")],
};
```

This scans `src/` for `.css` files and emits each one (minified) into the output directory, preserving the original file name.

### CSS bundle

Concatenate all CSS files into a single minified bundle:

```js
// rollup.config.js
import { cssBundlePlugin } from "@elenajs/plugin-rollup-css";

export default {
  input: "src/index.js",
  output: { dir: "dist", format: "esm" },
  plugins: [cssBundlePlugin("src", "bundle.css")],
};
```

### CSS Module Scripts

Handle `import styles from "./component.css" with { type: "css" }` imports. The plugin intercepts these imports, minifies the CSS, and returns a JS module that constructs a `CSSStyleSheet` for Shadow DOM adoption. CSS files handled this way are automatically excluded from `cssBundlePlugin`:

```js
// rollup.config.js
import { cssModuleScriptPlugin } from "@elenajs/plugin-rollup-css";

export default {
  input: "src/index.js",
  output: { dir: "dist", format: "esm" },
  plugins: [cssModuleScriptPlugin()],
};
```

### Static styles

Minify CSS strings assigned to `static styles` template literal class fields:

```js
// rollup.config.js
import { cssStaticStylesPlugin } from "@elenajs/plugin-rollup-css";

export default {
  input: "src/index.js",
  output: { dir: "dist", format: "esm" },
  plugins: [cssStaticStylesPlugin()],
};
```

### All together

Use all plugins together for a complete CSS build pipeline:

```js
// rollup.config.js
import {
  cssPlugin,
  cssBundlePlugin,
  cssModuleScriptPlugin,
  cssStaticStylesPlugin,
} from "@elenajs/plugin-rollup-css";

export default {
  input: "src/index.js",
  output: { dir: "dist", format: "esm" },
  plugins: [
    cssModuleScriptPlugin(),
    cssStaticStylesPlugin(),
    cssPlugin("src"),
    cssBundlePlugin("src", "bundle.css"),
  ],
};
```

## API

### `cssPlugin(srcDir)`

Returns a Rollup plugin that finds all `.css` files in `srcDir` and emits each one as a minified asset.

| Parameter | Type     | Description                                |
| --------- | -------- | ------------------------------------------ |
| `srcDir`  | `string` | Source directory to scan for `.css` files. |

### `cssBundlePlugin(srcDir, fileName)`

Returns a Rollup plugin that concatenates all `.css` files in `srcDir`, minifies the result, and emits it as a single asset. CSS files resolved by `cssModuleScriptPlugin` are automatically excluded from the bundle.

| Parameter  | Type     | Description                                           |
| ---------- | -------- | ----------------------------------------------------- |
| `srcDir`   | `string` | Source directory to scan for `.css` files.            |
| `fileName` | `string` | Output filename for the bundle (e.g. `"bundle.css"`). |

### `cssModuleScriptPlugin()`

Returns a Rollup plugin that handles CSS Module Script imports (`with { type: "css" }`). Reads the CSS file, minifies it, and returns a JS module that constructs and exports a `CSSStyleSheet` for Shadow DOM adoption. Must be listed before `@rollup/plugin-node-resolve` in the plugins array.

### `cssStaticStylesPlugin()`

Returns a Rollup plugin that finds `static styles` class fields with template literal values and minifies the CSS inside them.

### `minifyCss(css, filename?)`

Minifies a CSS string using [Lightning CSS](https://lightningcss.dev/).

| Parameter   | Type     | Description                            |
| ----------- | -------- | -------------------------------------- |
| `css`       | `string` | The CSS source to minify.              |
| `filename?` | `string` | Optional filename for error reporting. |

**Returns:** `string`, the minified CSS.

## License

MIT

## Copyright

Copyright © 2026 [Ariel Salminen](https://arielsalminen.com)
