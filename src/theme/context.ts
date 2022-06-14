import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { PageData } from 'pressify/client';
import { LocaleConfig, ThemeConfig, NavItem, SidebarItem } from './types';

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextValue extends ThemeConfig {
  textNav: NavItem[];
  iconNav: NavItem[];
  pagesData: Record<string, PageData>;
  currentPageData: PageData | undefined;
  locales: LocaleConfig[];
  currentLocale?: LocaleConfig;
  homePath?: string;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({} as any);

export const useThemeContext = () => useContext(ThemeContext);
