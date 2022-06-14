import { ComponentType } from 'react';
import { Components } from '@mdx-js/react/lib';
import { Route } from 'virtual:conventional-routes';

export interface PageData {
  basePath: string;
  routePath: string;
  filePath: string;
  meta: Record<string, any>;
}

export interface Theme {
  Layout: ComponentType<any>;
  NotFound?: ComponentType<any>;
  mdxComponents?: Components;
}

export interface AppState {
  theme: Theme;
  routes: Route[];
  pagePath?: string;
  pageModule?: any;
  pageLoading: boolean;
  pageError: Error | null;
}
