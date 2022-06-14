import { UserConfig as ViteConfig } from 'vite';
import { Options as ReactOptions } from '@vitejs/plugin-react';
import { Options as IconsOptions } from 'unplugin-icons';
import { Options as RollupMdxOptions } from '@mdx-js/rollup';
import { UserPages, PagesConfig } from 'vite-plugin-conventional-routes';
import { Theme } from 'shiki';

export interface Page {
  basePath: string;
  routePath: string;
  filePath: string;
  meta: Record<string, any>;
  isLayout: boolean;
  is404: boolean;
}

export interface Route {
  path: string;
  component: any;
  children?: Route[];
}

export interface ShikiThemeObj {
  light: Theme;
  dark: Theme;
}

export interface MdxOptions extends RollupMdxOptions {
  theme?: Theme | ShikiThemeObj;
  transformDemo?: (code: string) => string;
}

export interface TailwindOptions {
  [key: string]: any;
  content?: string[];
  darkMode?: 'media' | 'class';
  theme?: {
    extend?: Record<string, any>;
  };
  plugins?: any[];
}

export interface UserConfig<ThemeConfig = any> {
  /**
   * Theme config
   */
  themeConfig?: ThemeConfig;
  /**
   * Config to find pages
   * @default 'docs'
   */
  pages?: UserPages;
  /**
   * Defines files/paths to be ignored.
   */
  ignore?: string | string[];
  /**
   * Whether to use hash router
   */
  useHashRouter?: boolean;
  /**
   * Vite config
   */
  vite?: ViteConfig;
  /**
   * Options to pass on to `@vitejs/plugin-react`
   */
  react?: ReactOptions;
  /**
   * Options to pass on to mdx compiler
   */
  mdx?: MdxOptions;
  /**
   * Tailwindcss options or config file path.
   * @default '<root>/tailwind.config.js'
   * @see https://tailwindcss.com/docs/configuration
   */
  tailwind?: TailwindOptions | string;
  /**
   * Options to pass on to `unplugin-icons`
   */
  icons?: IconsOptions;
}

export interface SiteConfig<ThemeConfig = any> extends UserConfig<ThemeConfig> {
  configPath?: string;
  root: string;
  base: string;
  outDir: string;
  tempDir: string;
  useDefaultTheme: boolean;
  themePath: string;
  themeConfig: ThemeConfig;
  pages: PagesConfig;
  tailwind: TailwindOptions;
  icons: IconsOptions;
}

export interface GitContributor {
  name: string;
  email: string;
  commits: number;
}

export interface Slide {
  content: string;
}
