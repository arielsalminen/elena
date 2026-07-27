<br/>
<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://elenajs.com/elena-v2-dark.png" alt="Elena" width="127" height="156">
  </source>
  <source media="(prefers-color-scheme: light)" srcset="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
  </source>
  <img src="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
</picture>

### Shared ESLint config for Elena projects

<br/>

<a href="https://arielsalminen.com"><img src="https://img.shields.io/badge/creator-@arielle-F95B1F" alt="Creator @arielle"/></a>
<a href="https://www.npmjs.com/package/@elenajs/eslint-config"><img src="https://img.shields.io/npm/v/@elenajs/eslint-config.svg" alt="Latest version on npm" /></a>
<a href="https://github.com/arielsalminen/elena/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="Elena is released under the MIT license." /></a>
<a href="https://github.com/arielsalminen/elena/actions/workflows/tests.yml"><img src="https://github.com/arielsalminen/elena/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>

</div>

<br/>

<p align="center"><strong>@elenajs/eslint-config</strong> is the shared <a href="https://eslint.org">ESLint</a> config used across Elena packages. It enforces consistent code style with lenient TypeScript rules suited for JavaScript-first projects.</p>

<br/>

## Installation

```bash
npm install --save-dev @elenajs/eslint-config eslint
```

## Usage

In your `eslint.config.js`:

```js
import elenaConfig from "@elenajs/eslint-config";

export default [...elenaConfig];
```

## What it includes

- Requires braces for all control flow (`curly: ["error", "all"]`), single-line `if` bodies without braces are not allowed.
- Trailing commas allowed in multiline expressions (`comma-dangle: "only-multiline"`).
- Lenient TypeScript rules, most `@typescript-eslint/*` strictness rules are turned off for JS-first projects.
- Ignores `node_modules/`, `dist/`, `test/`, and `coverage/` by default.

## Peer Dependencies

- `eslint >= 9.0.0`

## License

MIT
