// import { Plugin, ModuleNode } from 'vite';
// import mdx from 'vite-plugin-mdx';
// import grayMatter from 'gray-matter';
// import { parseSlides } from '../parseSlides';
// import { SLIDE_MODULE_ID_PREFIX } from '../constants';
// import { SiteConfig, Slide } from '../types';

// function extractSlideIndex(id: string) {
//   return Number(id.match(/\/(\d+)\.mdx$/)?.[1]);
// }

// export function createMdxPlugin(config: SiteConfig): Plugin[] {
//   const idToSlidesMap = new Map<string, Slide[]>();

//   return [
//     {
//       name: 'pressify:mdx',

//       resolveId(source) {
//         if (source.startsWith(SLIDE_MODULE_ID_PREFIX)) {
//           return source;
//         }
//       },

//       load(id) {
//         if (id.startsWith(SLIDE_MODULE_ID_PREFIX)) {
//           const index = extractSlideIndex(id);
//           id = id
//             .slice(SLIDE_MODULE_ID_PREFIX.length)
//             .replace(/\/\d+\.mdx$/, '');

//           if (idToSlidesMap.has(id)) {
//             return idToSlidesMap.get(id)?.[index - 1]?.content;
//           }
//         }
//       },

//       transform(code, id) {
//         if (/\.mdx?$/.test(id)) {
//           const { data: frontMatter, content } = grayMatter(code);
//           let slideExports = '';

//           if (frontMatter.slide && !id.startsWith(SLIDE_MODULE_ID_PREFIX)) {
//             const slides = parseSlides(content);

//             if (slides.length) {
//               idToSlidesMap.set(id, slides);

//               slideExports = slides
//                 .map(
//                   (_, index) =>
//                     `export { default as Slide_${
//                       index + 1
//                     } } from '${SLIDE_MODULE_ID_PREFIX}${id}/${index + 1}.mdx';`
//                 )
//                 .join('\n');
//             }
//           }

//           // vite-plugin-mdx looks for dependencies such as react from the vite root, which may cause errors,
//           // so I inject the dependency myself here.
//           return `
// import React from 'react';
// import { mdx } from '@mdx-js/react';

// export const frontMatter = ${JSON.stringify(frontMatter)};

// ${slideExports}
// ${content}`;
//         }
//       },

//       async handleHotUpdate(ctx) {
//         if (/\.mdx?$/.test(ctx.file) && idToSlidesMap.has(ctx.file)) {
//           const prevSlides = idToSlidesMap.get(ctx.file)!;

//           const { content } = grayMatter(await ctx.read());
//           const slides = parseSlides(content);
//           idToSlidesMap.set(ctx.file, slides);

//           const affectedModules = new Set<ModuleNode>();

//           ctx.modules[0]?.importedModules.forEach(m => {
//             if (m.id?.startsWith(SLIDE_MODULE_ID_PREFIX)) {
//               const index = extractSlideIndex(m.id);

//               if (
//                 prevSlides[index - 1]?.content !== slides[index - 1]?.content
//               ) {
//                 affectedModules.add(m);
//               }
//             }
//           });

//           if (affectedModules.size) {
//             return [...affectedModules];
//           }
//         }
//       },
//     },
//     // at the same time, I use `withImport({})` here to avoid MDX errors.
//     ...mdx.withImports({})(config.mdx),
//   ];
// }
