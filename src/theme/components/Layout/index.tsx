import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useThemeConfig,
  usePagesData,
  useAppState,
  Helmet,
  matchPath,
} from 'pressify/client';
import { ThemeContext, useThemeContext } from '../../context';
import { ThemeConfig, NavItem } from '../../types';
import { IN_BROWSER, THEME_MODE_STORAGE_KEY } from '../../constants';
import { getLocales, getThemeMode, mergeThemeConfig } from '../../utils';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { Header } from '../Header';
import { DocLayout } from '../DocLayout';
import { HomeLayout } from '../HomeLayout';

if (IN_BROWSER) {
  const themeMode = getThemeMode();
  const doc = document.documentElement;

  if (themeMode === 'dark') {
    doc.classList.add('dark');
  } else {
    doc.classList.remove('dark');
  }
}

const InternalLayout: React.FC = () => {
  const { currentPageData } = useThemeContext();

  return (
    <>
      <Header />
      {currentPageData?.meta.home ? <HomeLayout /> : <DocLayout />}
    </>
  );
};

export const Layout: React.FC = () => {
  const themeConfig = useThemeConfig<ThemeConfig>();
  const pagesData = usePagesData();
  const { pagePath } = useAppState();

  const [themeMode, setThemeMode] = useState(() => getThemeMode());

  const toggleThemeMode = useCallback(() => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const finalThemeConfig = useMemo(
    () => mergeThemeConfig(themeConfig, pagePath),
    [themeConfig, pagePath]
  );

  const currentPageData = useMemo(() => {
    const found =
      pagePath &&
      Object.keys(pagesData)
        .sort((a, b) => b.length - a.length)
        .find(item => matchPath(item, pagePath));
    return found ? pagesData[found] : undefined;
  }, [pagesData, pagePath]);

  const locales = useMemo(() => getLocales(themeConfig), [themeConfig]);

  const currentLocale = useMemo(
    () => locales.find(item => item.locale === finalThemeConfig.locale),
    [locales, finalThemeConfig]
  );

  const homePaths = useMemo(() => {
    return Object.keys(pagesData)
      .filter(path => pagesData[path].meta.home)
      .sort((pathA, pathB) => pathA.length - pathB.length);
  }, [pagesData]);

  const homePath = currentLocale
    ? homePaths.find(item => item.startsWith(currentLocale.localePath))
    : homePaths[0];

  const { textNav, iconNav } = useMemo(() => {
    const { nav } = finalThemeConfig;
    const textNav: NavItem[] = [];
    const iconNav: NavItem[] = [];

    // sort nav，move the icon nav back
    (nav || []).forEach(item => {
      if (item.icon && !item.text) {
        iconNav.push(item);
      } else {
        textNav.push(item);
      }
    });

    return { textNav, iconNav };
  }, [finalThemeConfig]);

  const htmlClassName = useMemo(() => {
    return [
      themeMode === 'dark' && 'dark',
      finalThemeConfig.banner && 'has-banner',
    ]
      .filter(Boolean)
      .join(' ');
  }, [themeMode, finalThemeConfig.banner]);

  useScrollToTop();

  if (!pagePath) {
    return null;
  }

  return (
    <>
      <Helmet
        titleTemplate={
          finalThemeConfig.title ? `%s | ${finalThemeConfig.title}` : ''
        }
        defaultTitle={finalThemeConfig.title}
      >
        <html lang={currentLocale?.locale} className={htmlClassName} />
        <title>{currentPageData?.meta?.title}</title>
        {finalThemeConfig.description && (
          <meta name="description" content={finalThemeConfig.description} />
        )}
        {finalThemeConfig.head?.map(([tagName, tagProps, tagChildren], index) =>
          React.createElement(tagName, { ...tagProps, key: index }, tagChildren)
        )}
      </Helmet>
      <ThemeContext.Provider
        value={{
          ...finalThemeConfig,
          textNav,
          iconNav,
          pagesData,
          currentPageData,
          locales,
          currentLocale,
          homePath,
          themeMode,
          toggleThemeMode,
        }}
      >
        <InternalLayout />
      </ThemeContext.Provider>
    </>
  );
};
