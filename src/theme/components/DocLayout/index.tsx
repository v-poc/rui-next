import React, { useMemo, useState } from 'react';
import { matchPath, Page, useAppState } from 'pressify/client';
import { Sidebar, SidebarIndicator } from '../Sidebar';
import { Mdx } from '../Mdx';
import { UpdateInfo } from '../UpdateInfo';
import { PrevNext } from '../PrevNext';
import { Toc } from '../Toc';
import { Loading } from '../Loading';
import './style.css';
import { useSidebar } from '../../hooks/useSidebar';
import { SidebarItem } from '../../types';

export const DocLayout: React.FC = () => {
  const { pagePath } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebar = useSidebar();

  const activeSidebar = useMemo<SidebarItem[]>(() => {
    if (!pagePath || !sidebar?.length) {
      return [];
    }

    const res: SidebarItem[] = [];

    const find = (items: SidebarItem[]) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.link && matchPath(item.link, pagePath)) {
          res.push(item);
          return true;
        }

        if (item.items?.length) {
          res.push(item);

          if (find(item.items)) {
            return true;
          }
          res.pop();
        }
      }

      return false;
    };

    find(sidebar);

    return res;
  }, [pagePath, sidebar]);

  const hasSidebar = sidebar && sidebar?.length > 0 && activeSidebar.length > 0;

  return (
    <>
      {hasSidebar && (
        <SidebarIndicator
          activeItems={activeSidebar}
          onOpenChange={setSidebarOpen}
        />
      )}
      <div className={`max-w-8xl px-6 md:px-8 mx-auto`}>
        {hasSidebar && (
          <Sidebar
            items={sidebar}
            activeItems={activeSidebar}
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
          />
        )}
        <div
          key={pagePath}
          className={`w-full flex justify-center items-start ${
            hasSidebar
              ? 'lg:pl-[var(--left-aside-width)] space-x-8'
              : 'space-x-16'
          }`}
        >
          <div
            className={`flex-auto w-full min-w-0 ${
              hasSidebar ? 'lg:pl-16 lg:pr-8' : ''
            }`}
          >
            <div className="max-w-[736px] mx-auto pt-8 pb-24">
              <Mdx className="mb-16">
                <Page fallback={<Loading className="text-xl" />} />
              </Mdx>
              <UpdateInfo />
              <PrevNext />
            </div>
          </div>
          {/* FIXME: move width to toc inner */}
          {/* disable toc while using hash router */}
          {!__HASH_ROUTER__ && (
            <div
              className="hidden xl:block
            sticky top-[calc(var(--header-height)+var(--banner-height))]
            shrink-0 pt-8 pb-24"
            >
              <Toc />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
