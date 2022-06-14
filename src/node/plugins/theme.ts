import { normalizePath, Plugin } from 'vite';
import consola from 'consola';
import { SiteConfig } from '../common/types.js';
import { THEME_CONFIG_MODULE_ID } from '../common/constants.js';
import { isConfigChanged, resolveConfig } from '../common/config.js';
import { pascalCase } from '../common/utils.js';

/**
 * Detect icons in theme config,
 * and inject the icon components by unplugin-icons.
 */
function injectIcons(themeConfig: any): string {
  const iconImports: string[] = [];

  const themeConfigStr = JSON.stringify(themeConfig, null, 2).replace(
    /"icon":\s("(.*?)")/g,
    (str: string, replaceStr: string, icon: string) => {
      // The name of the icon copied from https://icones.js.org/ has a `:`,
      // and for ease of use, we do some compatibility processing here
      // so that it can be properly resolved by the unplugin-icons
      icon = icon.replace(':', '/');

      const name = pascalCase(icon);
      const importStr = `import ${name} from '~icons/${icon}';`;

      if (!iconImports.includes(importStr)) {
        iconImports.push(importStr);
      }

      return str.replace(replaceStr, name);
    }
  );

  return `${iconImports.join('\n')}

export default ${themeConfigStr};
`;
}

export function createThemePlugin(siteConfig: SiteConfig): Plugin {
  let { themeConfig } = siteConfig;

  return {
    name: 'pressify:theme',

    resolveId(id) {
      if (id === THEME_CONFIG_MODULE_ID) {
        return id;
      }
    },

    load(id) {
      if (id === THEME_CONFIG_MODULE_ID) {
        return injectIcons(themeConfig);
      }
    },

    async handleHotUpdate(ctx) {
      // handle config hmr
      const { file, server } = ctx;

      if (
        siteConfig.configPath &&
        file === normalizePath(siteConfig.configPath)
      ) {
        const newConfig = await resolveConfig(siteConfig.root);
        ({ themeConfig } = newConfig);

        if (isConfigChanged(siteConfig, newConfig)) {
          consola.warn(
            `[pressify] config has changed. Please restart the dev server.`
          );
        }

        const themeConfigModule = server.moduleGraph.getModuleById(
          THEME_CONFIG_MODULE_ID
        );

        if (themeConfigModule) {
          return [themeConfigModule];
        }
      }
    },
  };
}
