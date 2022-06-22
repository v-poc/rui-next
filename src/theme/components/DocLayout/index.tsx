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
      <div className="max-w-[90rem] mx-auto">
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
            hasSidebar ? "lg:pl-[var(--left-aside-width)]" : ""
          }`}
        >
          <div className="w-full max-w-4xl min-w-0 mx-auto pt-8 pb-24 px-6 md:px-8">
            <Mdx className="mb-16">
              <Page fallback={<Loading className="text-xl" />} />
            </Mdx>
            <UpdateInfo />
            <PrevNext />
          </div>
          {(hasSidebar || hasToc) && (
            <div
              className="hidden xl:block
            sticky top-[calc(var(--header-height)+var(--banner-height))]
            w-[var(--right-aside-width)] max-h-[calc(100vh-var(--header-height)-var(--banner-height))]
            shrink-0 pt-8 pb-24 overflow-y-auto"
            >
              <Toc />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
