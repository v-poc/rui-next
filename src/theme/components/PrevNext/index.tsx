import React, { useMemo } from 'react';
import { useAppState } from 'pressify/client';
import { Link } from '../Link';
import { ChevronLeft, ChevronRight } from '../Icons';
import { useSidebar } from '../../hooks/useSidebar';
import { SidebarItem } from '../../types';

const Item: React.FC<{ type: 'prev' | 'next'; item?: SidebarItem }> = ({
  type,
  item,
}) => {
  if (!item) {
    return <div></div>;
  }

  return (
    <Link
      className="group max-w-[48%] font-medium"
      to={item.link}
      color={false}
    >
      {type === 'prev' ? (
        <div className="flex items-center text-xs text-c-text-2 group-hover:text-c-text-1 transition-colors">
          <ChevronLeft className="mr-0.5" />
          Previous
        </div>
      ) : (
        <div className="flex items-center justify-end text-xs text-c-text-2 group-hover:text-c-text-1 transition-colors">
          Next
          <ChevronRight className="ml-0.5" />
        </div>
      )}
      <div
        className={`mt-1 text-base text-c-brand group-hover:text-c-brand-light transition-colors ${
          type === 'prev' ? 'text-left' : 'text-right'
        }`}
      >
        {item.text}
      </div>
    </Link>
  );
};

export const PrevNext: React.FC = () => {
  const sidebar = useSidebar();
  const { pagePath } = useAppState();

  const { prev, next } = useMemo<{
    prev?: SidebarItem;
    next?: SidebarItem;
  }>(() => {
    let _prev: SidebarItem | undefined;
    let _next: SidebarItem | undefined;
    let found = false;

    function find(items: SidebarItem[] = []) {
      for (let i = 0; i < items.length; i++) {
        if (_next) {
          break;
        }

        if (items[i].items) {
          find(items[i].items);
          continue;
        }

        if (found) {
          _next = items[i];
          break;
        }

        if (items[i].link === pagePath) {
          found = true;
          continue;
        }

        _prev = items[i];
      }
    }

    find(sidebar);

    // not found, indicating that the current path does not have a sidebar and prev/next
    if (!found) {
      return {};
    }

    return { prev: _prev, next: _next };
  }, [sidebar, pagePath]);

  if (!prev && !next) {
    return null;
  }

  return (
    <div className="flex justify-between items-center mt-4 pt-4 space-x-8 border-t border-c-border-1">
      <Item type="prev" item={prev} />
      <Item type="next" item={next} />
    </div>
  );
};
