import { Plugin } from 'vite';
import mdx from '@mdx-js/rollup';
import { createFilter } from '@rollup/pluginutils';
import { MdxOptions } from '../../common/types.js';
import {
  CODE_DEMO_MODULE_ID_PREFIX,
  DEMO_MODULE_ID_PREFIX,
} from '../../common/constants.js';
import { loadDemo } from './demo.js';
import { loadCodeDemo } from './code.js';

function mdxRefresh({
  include,
  exclude,
}: Pick<MdxOptions, 'include' | 'exclude'>): Plugin {
  const filter = createFilter(include, exclude);
  let viteReactPlugin: Plugin | undefined;

  const withHmr = (code: string, exportFields: string[]) => {
    exportFields.forEach(field => {
      if (
        code.includes(`export const ${field} =`) &&
        !code.includes('import.meta.hot.accept()')
      ) {
        code += `
        if (import.meta.hot) {
          // cache export
          import.meta.hot.data.${field} = import.meta.hot.data.${field} || ${field};
  
          import.meta.hot.accept(newModule => {
            // if the export has changed, invalidate the module
            if (JSON.stringify(newModule.${field}) !== JSON.stringify(import.meta.hot.data.${field})) {
              import.meta.hot.invalidate();
            }
          });
        }`;
      }
    });

    return code;
  };

  return {
    name: 'pressify:mdx-refresh',
    configResolved(config) {
      viteReactPlugin = config.plugins.find(p => p.name === 'vite:react-babel');
    },
    async transform(code, id, opts) {
      if (filter(id) && /\.mdx?$/.test(id) && viteReactPlugin?.transform) {
        // use vite react plugin to inject react refresh code into markdown
        const result = await viteReactPlugin.transform.call(
          this,
          code,
          id + '?.jsx',
          opts
        );

        // handle markdown hmr
        if (typeof result === 'object' && result?.code) {
          result.code = withHmr(result.code, ['meta', 'toc']);
        }

        return result;
      }
    },
  };
}

function mdxDemo(options: Pick<MdxOptions, 'theme'>): Plugin {
  return {
    name: `pressify:mdx-demo`,
    resolveId(source) {
      // resolve demo. fulfill demo file path
      if (source.startsWith(DEMO_MODULE_ID_PREFIX)) {
        return source;
        // const filePath = extractDemoPath(source);
        // const resolved = await this.resolve(filePath, importer);

        // if (!resolved || resolved.external) {
        //   throw new Error(
        //     `[pressify] Cannot resolve demo: '${filePath}'. importer: '${importer}'`
        //   );
        // }

        // demoFiles.add(resolved.id);

        // return getDemoModuleId(resolved.id);
      }
    },
    load(id) {
      if (id.startsWith(DEMO_MODULE_ID_PREFIX)) {
        return loadDemo(id, options);
      }
    },
    // handleHotUpdate(ctx) {
    //   const modules = ctx.modules.slice();

    //   if (demoFiles.has(ctx.file)) {
    //     // update virtual demo module
    //     ctx.modules[0]?.importers.forEach(importer => {
    //       if (importer.id?.startsWith(DEMO_MODULE_ID_PREFIX)) {
    //         modules.push(importer);
    //       }
    //     });
    //   }

    //   // `handleHotUpdate` is hook first, so we return modules when it is changed
    //   if (modules.length !== ctx.modules.length) {
    //     return modules;
    //   }
    // },
  };
}

function mdxCodeDemo({
  transformDemo,
}: Pick<MdxOptions, 'transformDemo'>): Plugin {
  return {
    name: `pressify:mdx-code-demo`,
    resolveId(source) {
      if (source.startsWith(CODE_DEMO_MODULE_ID_PREFIX)) {
        return source;
      }
    },
    load(id) {
      if (id.startsWith(CODE_DEMO_MODULE_ID_PREFIX)) {
        return loadCodeDemo(id, transformDemo);
      }
    },
  };
}

export function createMdxPlugin(mdxOptions: MdxOptions = {}): Plugin[] {
  // const demoFiles = new Set<string>();
  // const tsInfoFileToModuleIdMap = new Map<string, string>();

  return [
    mdx(mdxOptions),
    mdxRefresh(mdxOptions),
    mdxDemo(mdxOptions),
    mdxCodeDemo(mdxOptions),
    // {
    //   name: 'pressify:mdx',
    //   configResolved(config) {
    //     viteReactPlugin = config.plugins.find(
    //       item => item.name === 'vite:react-babel'
    //     );
    //   },
    //   async transform(code, id, opts) {
    //     if (/\.mdx?/.test(id)) {
    //       const { data: meta, content } = grayMatter(code);
    //       // TODO: parse slides
    //       code = await compileMdx(content, id);

    //       const result = await viteReactPlugin?.transform?.call(
    //         this,
    //         code,
    //         id + '?.jsx',
    //         opts
    //       );
    //       let map: any;

    //       if (typeof result === 'string') {
    //         code = result;
    //       } else if (result?.code) {
    //         ({ code, map } = result);
    //       }

    //       // We should append meta export after vite-react's transform
    //       // so that vite-react can better identify it as a RefreshBoundary
    //       code = `${code}\nexport const meta = ${JSON.stringify(meta)};`;

    //       return {
    //         code,
    //         map,
    //       };
    //     }
    //   },
    // },
  ];
}
