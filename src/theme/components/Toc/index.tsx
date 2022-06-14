import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppState } from 'pressify/client';
import throttle from 'lodash-es/throttle';
import { useScroll } from '../../hooks/useScroll';
import { Link } from '../Link';

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

export const Toc: React.FC = () => {
  const toc: TocItem[] | undefined = useAppState().pageModule?.toc;

  const [headings, setHeadings] = useState<HTMLElement[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const elRef = useRef<HTMLDivElement>(null);

  // collect headings by toc
  useEffect(() => {
    const newHeadings = toc
      ?.map(({ id }) => document.getElementById(id))
      .filter((x): x is HTMLElement => !!x);

    setHeadings(newHeadings || []);
    setActiveIndex(-1);
  }, [toc]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(
    throttle(
      () => {
        if (!elRef.current || !headings.length) {
          return;
        }

        const scrollTop = Math.max(
          window.pageYOffset,
          document.documentElement.scrollTop,
          document.body.scrollTop
        );

        if (scrollTop === 0) {
          setActiveIndex(-1);
          return;
        }

        const index = headings.findIndex((item, index) => {
          const nextItem = headings[index + 1];
          const { top } = item.getBoundingClientRect();
          const { top: nextTop } = nextItem?.getBoundingClientRect() || {};

          return top <= 100 && (!nextItem || nextTop > 100);
        });

        setActiveIndex(index);
      },
      50,
      { trailing: true }
    ),
    [headings]
  );

  // scroll -> active
  useScroll(handleScroll);

  if (!toc?.length) {
    return null;
  }

  return (
    <div ref={elRef} className="w-[var(--right-aside-width)] pl-3 -ml-3">
      <div className="mb-2 text-xs text-c-text-0 font-medium">ON THIS PAGE</div>
      <div className="relative">
        <div
          className={`absolute -left-3 w-1 h-5 rounded bg-c-brand transition-all
          ${activeIndex >= 0 ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: `${Math.max(activeIndex * 28, 0) + 4}px` }}
        />
        {toc.map((item, index) => (
          <Link
            key={index}
            className={`block truncate text-sm leading-7 transition-colors
              ${
                index === activeIndex
                  ? 'text-c-brand'
                  : 'text-c-text-2 hover:text-c-text-1'
              }`}
            to={`#${item.id}`}
            color={false}
            style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}
          >
            {item.text}
          </Link>
        ))}
      </div>
    </div>
  );
};
