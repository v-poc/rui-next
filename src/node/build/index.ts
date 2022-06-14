import consola from 'consola';
import { BuildOptions } from 'vite';
import { resolveConfig } from '../common/config.js';
import { UserConfig } from '../common/types.js';
import { bundle } from './bundle.js';
import { renderPages } from './render.js';

export async function build(
  root = process.cwd(),
  buildOptions: BuildOptions = {},
  userConfig?: UserConfig
) {
  const start = Date.now();
  const siteConfig = await resolveConfig(root, userConfig);

  try {
    const clientResult = await bundle(siteConfig, buildOptions);
    await renderPages(siteConfig, clientResult);
  } finally {
    // await fs.remove(siteConfig.tempDir);
  }

  consola.success(
    `build complete in ${((Date.now() - start) / 1000).toFixed(2)}s.`
  );
}
