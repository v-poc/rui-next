import { fileURLToPath, URL } from 'url';
import fs from 'fs-extra';
import { cac } from 'cac';
import consola from 'consola';
import { createDevServer } from './dev.js';
import { build } from './build/index.js';
import { serve } from './serve.js';

const pkgPath = fileURLToPath(new URL('../../package.json', import.meta.url));
const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

const cli = cac('pressify').version(pkgJson.version).help();

cli
  .command('dev [root]')
  .allowUnknownOptions()
  .action(async (root?: string, opts?: any) => {
    try {
      const server = await createDevServer(root, opts);

      if (!server.httpServer) {
        throw new Error('HTTP server not available');
      }

      await server.listen();
      server.printUrls();
    } catch (err) {
      consola.error(`failed to start dev server. error:\n`, err);
      process.exit(1);
    }
  });

cli
  .command('build [root]')
  .option('--mode <mode>', 'Specify build mode (default: production)')
  .allowUnknownOptions()
  .action(async (root?: string, opts?: any) => {
    try {
      await build(root, opts);
    } catch (err) {
      consola.error(`build error:\n`, err);
      process.exit(1);
    }
  });

cli
  .command('serve [root]')
  .option('--port, -p', 'Specify port')
  .allowUnknownOptions()
  .action(async (root?: string, opts?: any) => {
    try {
      await serve(root, opts);
    } catch (err) {
      consola.error(`failed to start server. error:\n`, err);
      process.exit(1);
    }
  });

cli.parse();
