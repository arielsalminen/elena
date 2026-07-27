<br/>
<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://elenajs.com/elena-v2-dark.png" alt="Elena" width="127" height="156">
  </source>
  <source media="(prefers-color-scheme: light)" srcset="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
  </source>
  <img src="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
</picture>

### CEM analyzer plugin that copies custom Elena JSDoc tags into the manifest

<br/>

<a href="https://arielsalminen.com"><img src="https://img.shields.io/badge/creator-@arielle-F95B1F" alt="Creator @arielle"/></a>
<a href="https://www.npmjs.com/package/@elenajs/plugin-cem-tag"><img src="https://img.shields.io/npm/v/@elenajs/plugin-cem-tag.svg" alt="Latest version on npm" /></a>
<a href="https://github.com/arielsalminen/elena/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="Elena is released under the MIT license." /></a>
<a href="https://github.com/arielsalminen/elena/actions/workflows/tests.yml"><img src="https://github.com/arielsalminen/elena/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>

</div>

<br/>

<p align="center"><strong>@elenajs/plugin-cem-tag</strong> is a <a href="https://custom-elements-manifest.open-wc.org/">Custom Elements Manifest</a> analyzer plugin that copies custom JSDoc tags from <a href="https://elenajs.com">Elena</a> Progressive Web Component classes into the manifest.</p>

<br/>

## Table of contents

- **[Install](#install)**
- **[Usage](#usage)**
- **[How it works](#how-it-works)**

## Install

```bash
npm install --save-dev @elenajs/plugin-cem-tag
```

**Peer dependency:** `@custom-elements-manifest/analyzer >= 0.10.0`

## Usage

Create one plugin instance per JSDoc tag you want to extract:

```js
import { elenaTagPlugin } from "@elenajs/plugin-cem-tag";

// In your CEM analyzer config
export default {
  plugins: [
    elenaTagPlugin("status"),
    elenaTagPlugin("displayName"),
  ],
};
```

Or when using `@elenajs/bundler`, add it to the `analyze.plugins` array in `elena.config.mjs`:

```js
import { elenaTagPlugin } from "@elenajs/plugin-cem-tag";

export default {
  analyze: {
    plugins: [
      elenaTagPlugin("status"),
      elenaTagPlugin("displayName"),
    ],
  },
};
```

> [!NOTE]
> The `@elenajs/bundler` already includes this plugin by default for `@status` and `@displayName`. You only need to add it manually if you're using the CEM analyzer independently or want to extract additional custom tags.

## How it works

The plugin scans registered custom element classes for a specified JSDoc tag and writes its value onto the CEM class declaration. For example, given this component:

```js
/**
 * Button component for interface actions.
 *
 * @displayName Button
 * @status beta
 */
export default class Button extends Elena(HTMLElement, {
  tagName: "elena-button",
}) {}
```

Using `elenaTagPlugin("status")` will add `"status": "beta"` to the component's CEM declaration, and `elenaTagPlugin("displayName")` will add `"displayName": "Button"`. This metadata is then available to IDEs, documentation generators, and other tools that consume the Custom Elements Manifest.

## API

### `elenaTagPlugin(tagName)`

Returns a CEM analyzer plugin that extracts the specified JSDoc tag.

| Parameter | Type     | Description                                                       |
| --------- | -------- | ----------------------------------------------------------------- |
| `tagName` | `string` | The JSDoc tag name to extract (e.g. `"status"`, `"displayName"`). |

## License

MIT

## Copyright

Copyright © 2026 [Ariel Salminen](https://arielsalminen.com)
