import fs from 'fs-extra';
import ora from 'ora';
import { build as viteBuild, BuildOptions, InlineConfig } from 'vite';
import { RollupOutput } from 'rollup';
import { createPressifyPlugin } from '../plugins/index.js';
import { SiteConfig } from '../common/types.js';
import { SSR_ENTRY_FILE } from '../common/constants.js';

export async function bundle(
  siteConfig: SiteConfig,
  buildOptions: BuildOptions,
  mode = 'production'
) {
  const resolveViteConfig = (ssr: boolean): InlineConfig => {
    return {
      mode,
      configFile: false,
      root: siteConfig.root,
      base: siteConfig.base,
      plugins: createPressifyPlugin(siteConfig, ssr),
      logLevel: 'warn',
      // @ts-ignore
      ssr: {
        // set react-helmet to external so that we can use the same instance of react-helmet.
        // see: https://github.com/nfl/react-helmet#note-use-the-same-instance
        // external: ['react-helmet'],
        noExternal: [
          'pressify',
          /pressify-theme-/,
          '@mdx-js/react',
          'react-syntax-highlighter',
          'lodash-es',
        ],
      },
      build: {
        ...buildOptions,
        ssr,
        // avoid empty outDir while building because we will build client and server in parallel
        emptyOutDir: false,
        outDir: ssr ? siteConfig.tempDir : siteConfig.outDir,
        cssCodeSplit: false,
        minify: mode !== 'development',
        ssrManifest: !ssr,
        rollupOptions: {
          ...buildOptions.rollupOptions,
          input: ssr ? SSR_ENTRY_FILE : undefined,
        },
      },
    };
  };

  const spinner = ora('build client + server bundles...').start();
  let clientResult: RollupOutput;

  // empty outDir before build
  if (buildOptions.emptyOutDir !== false) {
    await fs.emptyDir(siteConfig.outDir);
  }

  try {
    [clientResult] = (await Promise.all([
      viteBuild(resolveViteConfig(false)),
      viteBuild(resolveViteConfig(true)),
    ])) as [RollupOutput, RollupOutput];

    spinner.succeed();
  } catch (err) {
    spinner.fail();
    throw err;
  }

  return clientResult;
}
