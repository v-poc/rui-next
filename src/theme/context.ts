import { createContext, useContext } from "react";
import { LocaleConfig, ThemeConfig, NavItem } from "./types";

export type ThemeMode = "light" | "dark";

export interface ThemeContextValue extends ThemeConfig {
  textNav: NavItem[];
  iconNav: NavItem[];
  locales: LocaleConfig[];
  currentLocale?: LocaleConfig;
  homePath?: string;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({} as any);

export const useThemeContext = () => useContext(ThemeContext);
