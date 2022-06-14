/**
 * Based on @docusaurus/theme-search-algolia
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, Helmet, useNavigate } from 'pressify/client';
import { useDocSearchKeyboardEvents } from '@docsearch/react';
import { IN_BROWSER } from '../../constants';
import { Search as IconSearch, Command as IconCommand } from '../Icons';
import { useThemeContext } from '../../context';
import { removeTailSlash } from '../../utils';

let DocSearchModal: React.ComponentType<any> | null = null;

async function ensureDocSearchModal() {
  if (DocSearchModal) {
    return;
  }

  [{ DocSearchModal }] = await Promise.all([
    // @ts-ignore
    import('@docsearch/react/modal'),
    import('@docsearch/css/dist/style.css'),
  ]);
}

const Hit: React.FC<{ hit: any; children?: React.ReactNode }> = ({
  hit,
  children,
}) => {
  return <Link to={hit.url}>{children}</Link>;
};

export const Search: React.FC<{ iconOnly?: boolean }> = ({ iconOnly }) => {
  const routerNavigate = useNavigate();
  const { algolia, locales, currentLocale } = useThemeContext();
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = useCallback(async () => {
    await ensureDocSearchModal();
    setIsOpen(true);
  }, [setIsOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const transformItems = useCallback((items: any[]) => {
    return items.map(item => {
      const { pathname, hash } = new URL(item.url);
      return {
        ...item,
        url: `${removeTailSlash(import.meta.env.BASE_URL)}${pathname}${hash}`,
      };
    });
  }, []);

  const navigator = useRef({
    navigate({ suggestionUrl }: any) {
      routerNavigate(suggestionUrl);
    },
  }).current;

  // if has multiple locales,
  // the search results should be filtered based on the language
  const facetFilters = useMemo(() => {
    let userFacetFilters = algolia?.searchParameters?.facetFilters || [];
    userFacetFilters =
      typeof userFacetFilters === 'string'
        ? [userFacetFilters]
        : userFacetFilters;

    return locales.length > 1 && currentLocale
      ? [`language:${currentLocale.locale}`, ...userFacetFilters]
      : userFacetFilters;
  }, [locales, currentLocale, algolia]);

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
  });

  if (!algolia?.apiKey || !algolia?.indexName) {
    return null;
  }

  return (
    <>
      <Helmet>
        {/* This hints the browser that the website will load data from Algolia,
        and allows it to preconnect to the DocSearch cluster. It makes the first
        query faster, especially on mobile. */}
        <link
          rel="preconnect"
          href={`https://${algolia.appId || 'BH4D9OD16A'}-dsn.algolia.net`}
          crossOrigin=""
        />
      </Helmet>

      <button
        ref={searchButtonRef}
        className="group flex justify-center items-center h-full ml-6"
        aria-label="Search"
        onMouseOver={ensureDocSearchModal}
        onTouchStart={ensureDocSearchModal}
        onFocus={ensureDocSearchModal}
        onClick={onOpen}
      >
        {iconOnly ? (
          <div className="flex justify-center w-12">
            <IconSearch className="text-xl text-c-text-0 group-hover:text-c-brand transition-colors" />
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-c-text-0 opacity-60 hover:opacity-100 transition-opacity">
            <IconSearch className="text-base" />
            <span className="text-[13px]">Search</span>
            <div className="flex items-center h-4.5 px-0.5 border border-current rounded text-xs opacity-50 group-hover:opacity-100 group-hover:text-c-brand transition-all">
              <IconCommand />K
            </div>
          </div>
        )}
      </button>

      {IN_BROWSER &&
        isOpen &&
        DocSearchModal &&
        createPortal(
          <DocSearchModal
            initialScrollY={window.scrollY}
            transformItems={transformItems}
            hitComponent={Hit}
            navigator={navigator}
            onClose={onClose}
            {...algolia}
            searchParameters={{
              ...algolia.searchParameters,
              facetFilters,
            }}
          />,
          document.body
        )}
    </>
  );
};
