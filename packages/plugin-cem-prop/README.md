<br/>
<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://elenajs.com/elena-v2-dark.png" alt="Elena" width="127" height="156">
  </source>
  <source media="(prefers-color-scheme: light)" srcset="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
  </source>
  <img src="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
</picture>

### CEM analyzer plugin that creates attribute entries from @property/@prop JSDoc tags

<br/>

<a href="https://arielsalminen.com"><img src="https://img.shields.io/badge/creator-@arielle-F95B1F" alt="Creator @arielle"/></a>
<a href="https://www.npmjs.com/package/@elenajs/plugin-cem-prop"><img src="https://img.shields.io/npm/v/@elenajs/plugin-cem-prop.svg" alt="Latest version on npm" /></a>
<a href="https://github.com/arielsalminen/elena/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="Elena is released under the MIT license." /></a>
<a href="https://github.com/arielsalminen/elena/actions/workflows/tests.yml"><img src="https://github.com/arielsalminen/elena/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>

</div>

<br/>

<p align="center"><strong>@elenajs/plugin-cem-prop</strong> is a <a href="https://custom-elements-manifest.open-wc.org/">Custom Elements Manifest</a> analyzer plugin that creates <code>attributes</code> entries from <code>@property</code> and <code>@prop</code> JSDoc tags on <a href="https://elenajs.com">Elena</a> Progressive Web Component class fields.</p>

<br/>

## Table of contents

- **[Install](#install)**
- **[Usage](#usage)**
- **[How it works](#how-it-works)**

## Install

```bash
npm install --save-dev @elenajs/plugin-cem-prop
```

**Peer dependency:** `@custom-elements-manifest/analyzer >= 0.10.0`

## Usage

```js
import { elenaPropPlugin } from "@elenajs/plugin-cem-prop";

// In your CEM analyzer config
export default {
  plugins: [
    elenaPropPlugin(),
  ],
};
```

Or when using `@elenajs/bundler`, add it to the `analyze.plugins` array in `elena.config.mjs`:

```js
import { elenaPropPlugin } from "@elenajs/plugin-cem-prop";

export default {
  analyze: {
    plugins: [
      elenaPropPlugin(),
    ],
  },
};
```

> [!NOTE]
> The `@elenajs/bundler` already includes this plugin by default. You only need to add it manually if you’re using the CEM analyzer independently.

## How it works

The plugin scans class fields for `@property` or `@prop` JSDoc tags and creates corresponding `attributes` entries in the Custom Elements Manifest. For example, given this component:

```js
export default class Button extends Elena(HTMLElement) {
  static tagName = "elena-button";
  static props = ["variant", "disabled"];

  /**
   * The style variant of the button.
   * @property
   * @type {"default" | "primary" | "danger"}
   */
  variant = "default";

  /**
   * Makes the component disabled.
   * @prop
   * @type {boolean}
   */
  disabled = false;
}
```

The plugin will add both `variant` and `disabled` to the `attributes` array in the manifest, with their type, default value, and description. It also links each member to its attribute via the `attribute` field.

Without this plugin, these fields only appear in the `members` array. The `attributes` array is what IDEs, documentation generators, and other tools use to provide autocomplete and validation for HTML attributes.

## API

### `elenaPropPlugin()`

Returns a CEM analyzer plugin. Takes no arguments.

## License

MIT

## Copyright

Copyright © 2026 [Ariel Salminen](https://arielsalminen.com)
