<br/>
<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://elenajs.com/elena-v2-dark.png" alt="Elena" width="127" height="156">
  </source>
  <source media="(prefers-color-scheme: light)" srcset="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
  </source>
  <img src="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
</picture>

### CEM analyzer plugin that registers the Elena components in the manifest

<br/>

<a href="https://arielsalminen.com"><img src="https://img.shields.io/badge/creator-@arielle-F95B1F" alt="Creator @arielle"/></a>
<a href="https://www.npmjs.com/package/@elenajs/plugin-cem-define"><img src="https://img.shields.io/npm/v/@elenajs/plugin-cem-define.svg" alt="Latest version on npm" /></a>
<a href="https://github.com/arielsalminen/elena/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="Elena is released under the MIT license." /></a>
<a href="https://github.com/arielsalminen/elena/actions/workflows/tests.yml"><img src="https://github.com/arielsalminen/elena/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>

</div>

<br/>

<p align="center"><strong>@elenajs/plugin-cem-define</strong> is a <a href="https://custom-elements-manifest.open-wc.org/">Custom Elements Manifest</a> analyzer plugin that extracts the <code>tagName</code> from <a href="https://elenajs.com">Elena</a> Progressive Web Component definitions and registers the custom element in the manifest.</p>

<br/>

## Table of contents

- **[Install](#install)**
- **[Usage](#usage)**
- **[How it works](#how-it-works)**

## Install

```bash
npm install --save-dev @elenajs/plugin-cem-define
```

**Peer dependency:** `@custom-elements-manifest/analyzer >= 0.10.0`

## Usage

```js
import { elenaDefinePlugin } from "@elenajs/plugin-cem-define";

// In your CEM analyzer config
export default {
  plugins: [elenaDefinePlugin()],
};
```

Or when using `@elenajs/bundler`, add it to the `analyze.plugins` array in `elena.config.mjs`:

```js
import { elenaDefinePlugin } from "@elenajs/plugin-cem-define";

export default {
  analyze: {
    plugins: [elenaDefinePlugin()],
  },
};
```

> [!NOTE]
> The `@elenajs/bundler` already includes this plugin by default. You only need to add it manually if you’re using the CEM analyzer independently.

## How it works

The plugin scans Elena component source files and extracts the value of the `static tagName` class field:

```js
class Button extends Elena(HTMLElement) {
  static tagName = "elena-button";
}
```

It adds the `tagName` to the CEM class declaration and creates a `custom-element-definition` export entry, making the component discoverable by IDEs and documentation tools.

## License

MIT

## Copyright

Copyright © 2026 [Ariel Salminen](https://arielsalminen.com)
