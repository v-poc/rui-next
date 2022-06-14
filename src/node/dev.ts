import { createServer as createViteServer, ServerOptions } from 'vite';
import { resolveConfig } from './common/config.js';
import { UserConfig } from './common/types.js';
import { createPressifyPlugin } from './plugins/index.js';

export async function createDevServer(
  root = process.cwd(),
  serverOptions: ServerOptions = {},
  userConfig?: UserConfig
) {
  const siteConfig = await resolveConfig(root, userConfig);

  return createViteServer({
    root,
    base: siteConfig.base,
    server: serverOptions,
    plugins: createPressifyPlugin(siteConfig, false),
  });
}
