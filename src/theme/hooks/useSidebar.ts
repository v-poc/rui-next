import { useMemo } from 'react';
import { matchPath, useAppState } from 'pressify/client';
import { useThemeContext } from '../context';
import { SidebarItem } from '../types';

export function useSidebar() {
  const { pagePath } = useAppState();
  const { sidebar } = useThemeContext();

  return useMemo<SidebarItem[] | undefined>(() => {
    if (!sidebar || !pagePath) {
      return undefined;
    }

    if (Array.isArray(sidebar)) {
      return sidebar;
    }

    const found = Object.keys(sidebar)
      .sort((a, b) => b.length - a.length)
      .find(path => matchPath(path, pagePath));

    return found ? sidebar[found] : undefined;
  }, [sidebar, pagePath]);
}
