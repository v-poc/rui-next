import { DocSearchProps } from '@docsearch/react';

export interface NavItem {
  text?: string;
  icon?: string;
  link?: string;
  items?: NavItem[];
  locale?: string;
  activeMatch?: string;
}

export interface SidebarItem {
  text: string;
  icon?: string;
  link?: string;
  items?: SidebarItem[];
}

export interface LocaleConfig {
  locale: string;
  localeText: string;
  localePath: string;
}

export type HtmlTagConfig =
  | [string, Record<string, any>]
  | [string, Record<string, any>, string];

export interface ThemeConfig {
  [key: string]: any;
  locale?: string;
  localeText?: string;
  logo?: string;
  title?: string;
  description?: string;
  banner?: string | (string | HtmlTagConfig)[];
  head?: HtmlTagConfig[];
  nav?: NavItem[];
  sidebar?: SidebarItem[] | Record<string, SidebarItem[]>;
  docsRepo?: string;
  docsDir?: string;
  docsBranch?: string;
  editLink?: boolean | string;
  lastUpdated?: boolean | string;
  algolia?: DocSearchProps;
  themeConfigByPaths?: Record<string, ThemeConfig>;
}
