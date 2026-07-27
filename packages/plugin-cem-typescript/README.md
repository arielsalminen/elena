<br/>
<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://elenajs.com/elena-v2-dark.png" alt="Elena" width="127" height="156">
  </source>
  <source media="(prefers-color-scheme: light)" srcset="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
  </source>
  <img src="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
</picture>

### CEM analyzer plugin that generates per-component TypeScript declarations for Elena

<br/>

<a href="https://arielsalminen.com"><img src="https://img.shields.io/badge/creator-@arielle-F95B1F" alt="Creator @arielle"/></a>
<a href="https://www.npmjs.com/package/@elenajs/plugin-cem-typescript"><img src="https://img.shields.io/npm/v/@elenajs/plugin-cem-typescript.svg" alt="Latest version on npm" /></a>
<a href="https://github.com/arielsalminen/elena/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="Elena is released under the MIT license." /></a>
<a href="https://github.com/arielsalminen/elena/actions/workflows/tests.yml"><img src="https://github.com/arielsalminen/elena/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>

</div>

<br/>

<p align="center"><strong>@elenajs/plugin-cem-typescript</strong> is a <a href="https://custom-elements-manifest.open-wc.org/">Custom Elements Manifest</a> analyzer plugin that generates per-component TypeScript declaration files (<code>.d.ts</code>) for <a href="https://elenajs.com">Elena</a> Progressive Web Components.</p>

<br/>

## Table of contents

- **[Install](#install)**
- **[Usage](#usage)**
- **[Options](#options)**
- **[Generated output](#generated-output)**

## Install

```bash
npm install --save-dev @elenajs/plugin-cem-typescript
```

**Peer dependency:** `@custom-elements-manifest/analyzer >= 0.10.0`

## Usage

```js
import { elenaTypeScriptPlugin } from "@elenajs/plugin-cem-typescript";

// In your CEM analyzer config
export default {
  plugins: [elenaTypeScriptPlugin()],
};
```

Or when using `@elenajs/bundler`, add it to the `analyze.plugins` array in `elena.config.mjs`:

```js
import { elenaTypeScriptPlugin } from "@elenajs/plugin-cem-typescript";

export default {
  analyze: {
    plugins: [elenaTypeScriptPlugin({ outdir: "dist" })],
  },
};
```

> [!NOTE]
> The `@elenajs/bundler` already includes this plugin by default. You only need to add it manually if you’re using the CEM analyzer independently.

## Options

| Option   | Type     | Default  | Description                                       |
| -------- | -------- | -------- | ------------------------------------------------- |
| `outdir` | `string` | `"dist"` | Output directory where `.d.ts` files are written. |

## Generated output

For each registered custom element, the plugin generates a `.d.ts` file with typed properties, event handlers, and the built-in `text` property. For example, a `<elena-button>` component produces:

```typescript
// dist/button.d.ts
export type { ElenaButtonProps } from "./custom-elements.js";

declare class ElenaButton extends HTMLElement {
  /** The style variant of the button. */
  variant?: string;

  /** Makes the component disabled. */
  disabled?: boolean;

  /** Fired when the button is clicked. */
  onclick?: (e: CustomEvent<never>) => void;

  /** Fired when the button receives focus. */
  onfocus?: (e: CustomEvent<never>) => void;

  /** Fired when the button loses focus. */
  onblur?: (e: CustomEvent<never>) => void;

  /**
   * The text content of the element, captured from the light DOM
   * before rendering.
   */
  text?: string;
}

export default ElenaButton;
```

The plugin also adds the built-in `text` property to all Elena components in the CEM manifest, ensuring it appears in documentation tools and IDE autocomplete.

## License

MIT

## Copyright

Copyright © 2026 [Ariel Salminen](https://arielsalminen.com)
