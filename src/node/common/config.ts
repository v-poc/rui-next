import { createRequire } from 'module';
import path from 'upath';
import fs from 'fs-extra';
import { bundleRequire } from 'bundle-require';
import { pick } from 'lodash-es';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import { remarkMdxFrontmatter } from 'remark-mdx-frontmatter';
import remarkDirective from 'remark-directive';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import {
  resolvePagesConfig,
  PagesConfig,
} from 'vite-plugin-conventional-routes';
import { remarkMdxCodeDemo } from '../plugins/mdx/code.js';
import { getRemarkMdxDemo } from '../plugins/mdx/demo.js';
import { remarkCallout } from '../plugins/mdx/callout.js';
import { remarkMdxToc } from '../plugins/mdx/toc.js';
import { getRehypeHighlight } from '../plugins/mdx/highlight.js';
import {
  UserConfig,
  SiteConfig,
  TailwindOptions,
  MdxOptions,
} from './types.js';
import {
  DEFAULT_THEME_FILE,
  DEFAULT_THEME_TAILWIND_CONFIG,
  POSSIBLE_CONFIG_FILES,
} from './constants.js';

const require = createRequire(import.meta.url);

async function requireModule(filepath: string) {
  const { mod } = await bundleRequire({ filepath });
  return mod?.default ?? mod;
}

/**
 * Type helper to make it easier to create pressify config
 */
export function defineConfig<ThemeConfig = any>(
  config: UserConfig<ThemeConfig>
) {
  return config;
}

function resolveInPressify(root: string, targetPath: string) {
  return path.resolve(root, '.pressify', targetPath);
}

export function resolveThemePath(
  root: string
): [themePath: string, useDefaultTheme: boolean] {
  const userThemePath = resolveInPressify(root, 'theme');
  return fs.pathExistsSync(userThemePath)
    ? [userThemePath, false]
    : [DEFAULT_THEME_FILE, true];
}

export async function loadUserConfig(root: string): Promise<{
  configPath?: string;
  userConfig: UserConfig;
}> {
  let configPath: string | undefined;
  let userConfig: any = {};

  for (const configFile of POSSIBLE_CONFIG_FILES) {
    const tryPath = resolveInPressify(root, configFile);

    if (fs.pathExistsSync(tryPath)) {
      configPath = tryPath;
      break;
    }
  }

  if (configPath) {
    userConfig = (await requireModule(configPath)) ?? {};
  }

  return {
    configPath,
    userConfig,
  };
}

async function resolveMdxOptions(
  root: string,
  mdxOptions?: MdxOptions
): Promise<MdxOptions> {
  return {
    ...mdxOptions,
    providerImportSource: '@mdx-js/react',
    remarkPlugins: (mdxOptions?.remarkPlugins || []).concat([
      remarkGfm,
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: 'meta' }],
      remarkDirective,
      // CodeDemo needs to come before CodeMeta to preprocess the demo prop in the meta
      remarkMdxCodeDemo,
      // remarkMdxCodeMeta,
      getRemarkMdxDemo(root),
      remarkCallout,
      remarkMdxToc,
    ]),
    rehypePlugins: (mdxOptions?.rehypePlugins || []).concat([
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            class: 'header-anchor',
            ariaHidden: 'true',
            tabIndex: -1,
          },
          content: {
            type: 'text',
            value: '#',
          },
        },
      ],
      await getRehypeHighlight({
        theme: mdxOptions?.theme,
      }),
    ]),
  };
}

function resolveTailwindConfig(
  root: string,
  pages: PagesConfig,
  useDefaultTheme: boolean,
  userTailwind: TailwindOptions | string = 'tailwind.config.js'
): TailwindOptions {
  const userTailwindConfigPath =
    typeof userTailwind === 'string' && path.resolve(root, userTailwind);

  const userTailwindOptions: TailwindOptions | undefined =
    userTailwindConfigPath && fs.pathExistsSync(userTailwindConfigPath)
      ? require(userTailwindConfigPath)
      : undefined;

  const content = Object.values(pages)
    .map(({ dir }) => `${dir}/**/*.{html,md,mdx,js,jsx,ts,tsx}`)
    .concat(
      resolveInPressify(root, '**/*.{js,jsx,ts,tsx}'),
      userTailwindOptions?.content || [],
      // inject content of default theme
      useDefaultTheme ? DEFAULT_THEME_TAILWIND_CONFIG.content || [] : []
    );

  return {
    ...userTailwindOptions,
    content,
    darkMode: useDefaultTheme
      ? 'class'
      : userTailwindOptions?.darkMode || 'class',
    theme: {
      ...userTailwindOptions?.theme,
      extend: {
        ...userTailwindOptions?.theme?.extend,
        ...(useDefaultTheme && DEFAULT_THEME_TAILWIND_CONFIG.theme?.extend),
      },
    },
    plugins: (userTailwindOptions?.plugins || []).concat(
      (useDefaultTheme && DEFAULT_THEME_TAILWIND_CONFIG.plugins) || []
    ),
  };
}

export async function resolveConfig(
  root: string,
  inlineConfig?: UserConfig
): Promise<SiteConfig> {
  let userConfig = inlineConfig;
  let configPath: string | undefined;

  if (!userConfig) {
    ({ userConfig, configPath } = await loadUserConfig(root));
  }

  const base = userConfig.vite?.base || '/';
  const outDir = path.resolve(root, userConfig.vite?.build?.outDir || 'dist');
  const [themePath, useDefaultTheme] = resolveThemePath(root);

  const { config: pages } = resolvePagesConfig(
    root,
    undefined,
    userConfig.pages || 'docs',
    userConfig.ignore || []
  );

  return {
    ...userConfig,
    configPath,
    root,
    base,
    outDir,
    tempDir: path.resolve(outDir, '.temp'),
    useDefaultTheme,
    themePath,
    themeConfig: {
      title: 'Pressify',
      description: 'A Pressify site',
      ...userConfig.themeConfig,
    },
    pages,
    mdx: await resolveMdxOptions(root, userConfig.mdx),
    tailwind: resolveTailwindConfig(
      root,
      pages,
      useDefaultTheme,
      userConfig.tailwind
    ),
    icons: {
      compiler: 'jsx',
      autoInstall: true,
      ...userConfig.icons,
    },
  };
}

const compareFields: string[] = [
  'base',
  'src',
  'ignored',
  'vite',
  'react',
  'mdx',
  'tailwind',
  'icons',
];
const ignoreFields: string[] = [];

export function isConfigChanged(
  oldConfig: SiteConfig,
  newConfig: SiteConfig
): boolean {
  let hasError = false;

  function stringify(config: SiteConfig) {
    try {
      return JSON.stringify(
        pick(config, compareFields),
        (key: string, value: any) => {
          if (ignoreFields.includes(key)) {
            return undefined;
          }
          return value;
        }
      );
    } catch (e) {
      hasError = true;
      return '';
    }
  }

  // When an error occurs, the config is assumed to have changed
  return hasError || stringify(oldConfig) !== stringify(newConfig);
}
