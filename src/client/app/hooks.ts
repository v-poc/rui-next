import { useState, useEffect } from 'react';
import importedThemeConfig from '/@pressify/theme-config';
import importedPagesData from '/@pressify/pages-data';
import { PageData } from './types';

/**
 * get theme config
 */
export function useThemeConfig<T = any>(): T {
  const [themeConfig, setThemeConfig] = useState(importedThemeConfig);

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.accept('/@pressify/theme-config', mod => {
        setThemeConfig(mod.default);
      });
    }
  }, []);

  return themeConfig;
}

/**
 * get pages data
 */
export function usePagesData(): Record<string, PageData> {
  const [pagesData, setPagesData] = useState(importedPagesData);

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.accept('/@pressify/pages-data', mod => {
        setPagesData(mod.default);
      });
    }
  }, []);

  return pagesData;
}

export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
