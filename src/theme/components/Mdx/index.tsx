import React from 'react';
import { Callout } from '../Callout';
import { Demo } from '../Demo';
import * as _mdxComponents from './mdxComponents';
import './style.css';

export const mdxComponents = Object.entries(_mdxComponents).reduce(
  (res, [name, component]) => {
    // @ts-ignore
    res[`${name[0].toLowerCase()}${name.slice(1)}`] = component;
    return res;
  },
  {
    Callout,
    Demo,
  } as Record<string, React.ComponentType<any>>
);

export interface MdxProps {
  className?: string;
  children: React.ReactNode;
}

export const Mdx: React.FC<MdxProps> = ({ className = '', children }) => (
  <div
    className={`${className} markdown-body prose dark:prose-invert max-w-none
      prose-h2:pt-[1.25em] prose-h2:border-t prose-h2:border-[color:var(--tw-prose-hr)]
      prose-a:no-underline prose-a:text-c-brand hover:prose-a:text-c-brand-light prose-a:transition-colors
       prose-pre:bg-transparent prose-pre:p-0
    `}
  >
    {children}
  </div>
);
