import React, { useMemo, useState } from "react";
import { matchPath, Page, useAppState } from "pressify/client";
import { Sidebar, SidebarIndicator } from "../Sidebar";
import { Mdx } from "../Mdx";
import { UpdateInfo } from "../UpdateInfo";
import { PrevNext } from "../PrevNext";
import { Toc } from "../Toc";
import { Loading } from "../Loading";
import "./style.css";
import { useSidebar } from "../../hooks/useSidebar";
import { SidebarItem } from "../../types";

export const DocLayout: React.FC = () => {
  const { pagePath, pageModule } = useAppState();
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
  const hasToc = !__HASH_ROUTER__ && Boolean(pageModule?.toc?.length);

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
              ? "lg:pl-[calc(var(--left-aside-width)+32px)] xl:pl-[var(--left-aside-width)]"
              : ""
          }`}
        >
          <div className={`flex-auto w-full min-w-0 lg:mx-8 xl:mx-16`}>
            <div className="max-w-[736px] mx-auto pt-8 pb-24">
              <Mdx className="mb-16">
                <Page fallback={<Loading className="text-xl" />} />
              </Mdx>
              <UpdateInfo />
              <PrevNext />
            </div>
          </div>
          {(hasSidebar || hasToc) && (
            <div
              className="hidden xl:block
            sticky top-[calc(var(--header-height)+var(--banner-height))]
            w-[var(--right-aside-width)] shrink-0
            pt-8 pb-24"
            >
              <Toc />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
