import { createRequire } from 'module';
import path from 'upath';
import fs from 'fs-extra';
import ora from 'ora';
import consola from 'consola';
import { RollupOutput, OutputChunk } from 'rollup';
import { FilledContext } from 'react-helmet-async';
import { trapConsole } from '../common/utils.js';
import { Page, SiteConfig } from '../common/types.js';

const require = createRequire(import.meta.url);

export async function renderPages(
  siteConfig: SiteConfig,
  clientResult: RollupOutput
) {
  const entryChunk = clientResult.output.find(
    chunk => chunk.type === 'chunk' && chunk.isEntry
  ) as OutputChunk | undefined;

  if (!entryChunk) {
    throw new Error('entry chunk is not found.');
  }

  // it is generated in building client bundle
  const clientHtml = await fs.readFile(
    path.resolve(siteConfig.outDir, 'index.html'),
    'utf-8'
  );

  // const manifest = require(path.resolve(
  //   siteConfig.outDir,
  //   'ssr-manifest.json'
  // ));

  // it is generated in building server bundle
  const { render, pagesData } = require(path.resolve(
    siteConfig.tempDir,
    'entry.server.js'
  )) as {
    render: (pagePath: string, helmetContext: FilledContext) => string;
    pagesData: Record<string, Page>;
  };

  const pagePaths = Object.keys(pagesData);
  consola.info('pagePaths', pagePaths);

  const spinner = ora('render pages...').start();

  try {
    await Promise.all(
      Object.entries(pagesData).map(async ([pagePath, pageData]) => {
        // not support page with path params
        if (/\/:\w/.test(pagePath)) {
          return;
        }

        const helmetContext = {} as FilledContext;

        // disable console while rendering
        const recoverConsole = trapConsole();
        const appHtml = await render(pagePath, helmetContext);
        recoverConsole();

        const { helmet } = helmetContext;

        const pageChunk = clientResult.output.find(
          chunk =>
            chunk.type === 'chunk' &&
            chunk.facadeModuleId?.endsWith(pageData.filePath)
        ) as OutputChunk | undefined;

        const preloadLinks = renderPreloadLinks(
          siteConfig.base,
          entryChunk,
          pageChunk
        );

        // for client hydrate
        const ssrData = {
          pagePath,
        };

        const html = clientHtml
          .replace('<html>', `<html ${helmet.htmlAttributes.toString()}>`)
          .replace(
            '</head>',
            `${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${preloadLinks}
            ${helmet.link.toString()}
            ${helmet.style.toString()}
          </head>`
          )
          .replace('<body>', `<body ${helmet.bodyAttributes.toString()}>`)
          .replace(
            '<div id="root"></div>',
            `<script>window.__PRESSIFY_SSR_DATA__ = ${JSON.stringify(
              ssrData
            )};</script>
            <div id="root">${appHtml}</div>`
          );

        const targetPath = path.join(
          siteConfig.outDir,
          pagePath.toLowerCase(),
          'index.html'
        );

        await fs.outputFile(targetPath, html);
      })
    );

    spinner.succeed();
  } catch (err) {
    spinner.fail();
    throw err;
  }
}

function renderPreloadLinks(
  base: string,
  entryChunk: OutputChunk,
  pageChunk: OutputChunk | undefined
) {
  const seen = new Set<string>();

  return entryChunk.imports
    .concat(
      entryChunk.fileName,
      pageChunk?.imports || [],
      pageChunk?.fileName || []
    )
    .reduce((res, fileName) => {
      if (seen.has(fileName)) {
        return res;
      }
      seen.add(fileName);
      return (res += renderPreloadLink(base, fileName));
    }, '');
}

function renderPreloadLink(base: string, fileName: string) {
  fileName = base + fileName;

  if (fileName.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${fileName}">`;
  } else if (fileName.endsWith('.css')) {
    return `<link rel="stylesheet" href="${fileName}">`;
  } else if (fileName.endsWith('.woff')) {
    return ` <link rel="preload" href="${fileName}" as="font" type="font/woff" crossorigin>`;
  } else if (fileName.endsWith('.woff2')) {
    return ` <link rel="preload" href="${fileName}" as="font" type="font/woff2" crossorigin>`;
  } else if (fileName.endsWith('.gif')) {
    return ` <link rel="preload" href="${fileName}" as="image" type="image/gif">`;
  } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
    return ` <link rel="preload" href="${fileName}" as="image" type="image/jpeg">`;
  } else if (fileName.endsWith('.png')) {
    return ` <link rel="preload" href="${fileName}" as="image" type="image/png">`;
  } else {
    // TODO
    return '';
  }
}
