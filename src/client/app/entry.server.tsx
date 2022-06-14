import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { App, waitForPageReady } from './main';
import { createAppState } from './state';

const basename = import.meta.env.BASE_URL?.replace(/\/$/, '');

export async function render(
  url: string,
  helmetContext: Record<string, unknown>
) {
  const { appState, AppStateProvider } = createAppState();
  await waitForPageReady(appState, url);

  return renderToString(
    <StaticRouter basename={basename} location={url}>
      <HelmetProvider context={helmetContext}>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </HelmetProvider>
    </StaticRouter>
  );
}

export { default as pagesData } from '/@pressify/pages-data';
