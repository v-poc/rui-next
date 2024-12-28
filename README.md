# rui-next (aka RUI.next)

[![npm](https://img.shields.io/npm/v/rui-next)](https://www.npmjs.com/package/rui-next) <a href="https://nikoni.top/rui-next/" target="_blank"><img src="https://img.shields.io/static/v1?label=&message=docs%20%26%20demos&color=3366cc" alt="docs & demos" /></a> <img alt="react" src="https://badges.aleen42.com/src/react.svg" /> <img alt="vite" src="https://badges.aleen42.com/src/vitejs.svg" />

> Yet another **lightweight** and **Vite-powered** Mobile web UI components based on **React hooks** and **Vite 6**.

## Overview

This is just one kind of playground to dev `react-hooks` based UI components based on `rspress`. Thanks to [`rspress`](https://github.com/web-infra-dev/rspress) that could support `React docs+demos` well.

- 📦 **Out of the box** - focus on component development and documentation
- 🧑‍💻 **Developer Friendly** - built-in syntax highlighting, embedding React components seamlessly
- ⚡️ **Lightweight and Fast** - lighter page weight, instant reloading (lightning-fast HMR) powered by [Vite](https://vitejs.dev), faster dev server start, hot updates and build

## Preview

Try [QR code playground](https://nikoni.top/rui-next/components/qr-code/index-en.html) to scan to access the examples on mobile/tablet device.

> react-hooks `docs+demos` playground based on [vite](https://vitejs.dev/config/).

## Status

- More UI components WIP based on React hooks.

## Project setup

Install dependencies (use package manager: [pnpm](https://pnpm.io/))

```bash
$ pnpm i
```

Start the dev server for [`docs-dev`](http://127.0.0.1:5173/rui-next/)

```bash
$ pnpm start
```

Build UI library

```bash
$ pnpm run build-lib
```

[`Library Mode`](https://vitejs.dev/guide/build.html#library-mode) output info

```
vite v6.0.6 building for production...
✓ 179 modules transformed.
dist/rui-next.css      39.00 kB │ gzip:  7.69 kB
dist/rui-next.es.js   233.40 kB │ gzip: 69.42 kB
dist/rui-next.umd.js  153.70 kB │ gzip: 56.91 kB
✓ built in 677ms
```

Build documentation (docs+demos)

```bash
$ pnpm run build-docs
```

## Customize configuration

About vite, please check Configuration Reference - [vite](https://vitejs.dev/config/).

## License

<a href="https://www.npmjs.com/package/rui-next" target="_blank">
    <img alt="license" src="https://img.shields.io/npm/l/rui-next.svg" />
</a>
<br />
<img src="https://nikoni.top/images/niko-mit-react.png" alt="MIT License" width="396" height="250"/>
