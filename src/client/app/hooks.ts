import { useState, useEffect } from "react";
import importedThemeConfig from "/@pressify/theme-config";

/**
 * get theme config
 */
export function useThemeConfig<T = any>(): T {
  const [themeConfig, setThemeConfig] = useState(importedThemeConfig);

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.accept("/@pressify/theme-config", mod => {
        setThemeConfig(mod.default);
      });
    }
  }, []);

  return themeConfig;
}

export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
