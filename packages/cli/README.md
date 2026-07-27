<br/>
<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://elenajs.com/elena-v2-dark.png" alt="Elena" width="127" height="156">
  </source>
  <source media="(prefers-color-scheme: light)" srcset="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
  </source>
  <img src="https://elenajs.com/elena-v2.png" alt="Elena" width="127" height="156">
</picture>

### Elena CLI for scaffolding Progressive Web Components

<br/>

<a href="https://arielsalminen.com"><img src="https://img.shields.io/badge/creator-@arielle-F95B1F" alt="Creator @arielle"/></a>
<a href="https://www.npmjs.com/package/@elenajs/cli"><img src="https://img.shields.io/npm/v/@elenajs/cli.svg" alt="Latest version on npm" /></a>
<a href="https://github.com/arielsalminen/elena/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="Elena is released under the MIT license." /></a>
<a href="https://github.com/arielsalminen/elena/actions/workflows/tests.yml"><img src="https://github.com/arielsalminen/elena/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>

</div>

<br/>

<p align="center"><strong>@elenajs/cli</strong> is an interactive command-line tool for scaffolding <a href="https://elenajs.com">Elena</a> components. It generates JavaScript, TypeScript, or single-file HTML source files and scoped CSS with all Elena Progressive Web Component patterns pre-configured: <code>Elena()</code> factory, <code>html</code> tagged templates, <code>@scope</code> CSS, JSDoc annotations, and <code>ClassName.define()</code>.</p>

<br/>

## Table of contents

- **[Install](#install)**
- **[Usage](#usage)**
  - **[Interactive mode](#interactive-mode)**
  - **[With a component name](#with-a-component-name)**
- **[Prompts](#prompts)**
  - **[Component features](#component-features)**
- **[Generated files](#generated-files)**

## Install

```bash
npm install --save-dev @elenajs/cli
```

## Usage

### Interactive mode

Run without arguments to be guided through all options:

```bash
npx elena-create
```

### With a component name

Pass a kebab-case name (must contain at least one hyphen) to skip the name prompt:

```bash
npx elena-create my-button
npx elena-create my-stack
```

## Prompts

The CLI walks you through the following steps:

| Prompt                 | Description                                                                                                         | Default          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------- |
| **Component name**     | Kebab-case name with at least one hyphen (e.g. `my-button`, `my-stack`). Skipped if passed as argument.             |                  |
| **Component features** | Feature toggles for the generated code. See [Component features](#component-features) below.                        | None selected    |
| **Language**           | `JavaScript`, `TypeScript`, or `HTML`.                                                                              |                  |
| **Output directory**   | Where to generate the component folder.                                                                             | `src/components` |

### Component features

Toggle features to include in the generated code:

| Option                | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| **Props**             | Adds example props with `@property` / `@type` JSDoc annotations.       |
| **Events**            | Adds `events` option and `@event` JSDoc annotations.                    |
| **Methods**           | Adds an example method stub.                                            |
| **CSS Variables**     | Adds `@cssprop` JSDoc annotations and CSS custom property declarations. |
| **CSS Encapsulation** | Adds the `all: unset` reset to prevent global styles from leaking in.   |
| **CSS Pre-hydration** | Adds `:scope:not([hydrated])` styles for pre-hydration rendering.       |
| **Code Comments**     | Includes JSDoc annotations and CSS comments in the generated code.      |

## Generated files

For a component named `my-button`, the CLI creates:

```
src/components/my-button/
├── my-button.js (or .ts)
└── my-button.css
```

When using the HTML language, a single file is generated instead:

```
src/components/my-button/
└── my-button.html
```

The generated files include:

- `Elena()` factory with `tagName` and optional `props` / `events`
- A `render()` method returning an `html` tagged template
- JSDoc annotations for `@displayName` and `@status`, plus `@event` and `@cssprop` when selected
- Scoped CSS with `@scope`, optional encapsulation reset, and CSS custom properties

## License

MIT

## Copyright

Copyright © 2026 [Ariel Salminen](https://arielsalminen.com)
