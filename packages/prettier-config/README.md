<br/>
<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://elenajs.com/elena-v2-dark.png" alt="Elena" width="127" height="156">
  </source>
  <source media="(prefers-color-scheme: light)" srcset="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
  </source>
  <img src="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
</picture>

### Shared Prettier config for Elena projects

<br/>

<a href="https://arielsalminen.com"><img src="https://img.shields.io/badge/creator-@arielle-F95B1F" alt="Creator @arielle"/></a>
<a href="https://www.npmjs.com/package/@elenajs/prettier-config"><img src="https://img.shields.io/npm/v/@elenajs/prettier-config.svg" alt="Latest version on npm" /></a>
<a href="https://github.com/arielsalminen/elena/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="Elena is released under the MIT license." /></a>
<a href="https://github.com/arielsalminen/elena/actions/workflows/tests.yml"><img src="https://github.com/arielsalminen/elena/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>

</div>

<br/>

<p align="center"><strong>@elenajs/prettier-config</strong> is the shared <a href="https://prettier.io">Prettier</a> config used across Elena packages. It enforces consistent formatting with double quotes, semicolons, and 100-character line width.</p>

<br/>

## Installation

```bash
npm install --save-dev @elenajs/prettier-config prettier
```

## Usage

In your `package.json`:

```json
{
  "prettier": "@elenajs/prettier-config"
}
```

Or in `.prettierrc.json`:

```json
"@elenajs/prettier-config"
```

## Settings

| Option | Value |
|--------|-------|
| `printWidth` | `100` |
| `singleQuote` | `false` (double quotes) |
| `trailingComma` | `"es5"` |
| `semi` | `true` |
| `tabWidth` | `2` |
| `useTabs` | `false` |
| `arrowParens` | `"avoid"` (no parens for single-arg arrows) |
| `bracketSpacing` | `true` |
| `bracketSameLine` | `false` |
| `embeddedLanguageFormatting` | `"off"` |

## Peer Dependencies

- `prettier`

## License

MIT
