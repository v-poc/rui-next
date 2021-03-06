# Getting Started

[![npm](https://img.shields.io/npm/v/rui-next)](https://www.npmjs.com/package/rui-next) <a href="https://nikoni.top/rui-next/docs/" target="_blank"><img src="https://img.shields.io/static/v1?label=&message=docs%20%26%20demos&color=3366cc" alt="docs & demos" /></a> [![Required Node.JS >= v12.2.0](https://img.shields.io/static/v1?label=node&message=%3E=12.2.0&logo=node.js&color=3f893e&style=flat)](https://nodejs.org/about/releases) <img alt="react" src="https://badges.aleen42.com/src/react.svg" /> <img alt="vite" src="https://badges.aleen42.com/src/vitejs.svg" />

## Overview

React with Vite Playground - Mobile web UI components - (react-hooks+vite2).

Thanks to [`vitepress-rc`](https://github.com/cvnine/vitepress-rc) that could support `React docs+demos` well to run with `vitepress+vite`, the `CodeBlock` is able to play a role of `LiveEditor+LivePreview`.

Compare to other tools:

- [`dumi`](https://d.umijs.org/)
  - it is coupled with webpack instead.
- [`vuepress@next`](https://github.com/vuepress/vuepress-next) with `vite bundler`
  - it seems not good enough to support `React docs+demos`.
- [`vite-plugin-react-pages`](https://github.com/vitejs/vite-plugin-react-pages)
  - for early version, it seems not able to show both demos and source codes in the `CodeBlock`.

## Preview

Try [QR code playground](./components/qr-code/index.html) to scan to access the examples on mobile/tablet device.

## Project setup

Install dependencies

```bash
$ npm i
```

Start the dev server for [docs-dev](http://localhost:3000/rui-next/docs/)

```bash
$ npm start
```

Build UI library

```bash
$ npm run build-lib
```

Build documentation (docs+demos)

```bash
$ npm run build-docs
```

## License

<a href="https://www.npmjs.com/package/rui-next" target="_blank">
    <img alt="license" src="https://img.shields.io/npm/l/rui-next.svg" />
</a>
<br />
<img src="https://nikoni.top/images/niko-mit-react.png" alt="MIT License" width="396" height="250"/>
