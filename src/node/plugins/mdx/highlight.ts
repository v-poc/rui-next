import shiki, { Theme } from 'shiki';
import type { Plugin } from 'unified';
import { visit, SKIP } from 'unist-util-visit';
import { MdxOptions, ShikiThemeObj } from '../../common/types';

type ThemeType = 'light' | 'dark';

const themeTypeClassMap: Record<ThemeType, string> = {
  light: 'py-code-light',
  dark: 'py-code-dark',
};

const themeStyleMap: Partial<Record<Theme, string>> = {
  'github-light': 'background-color:#f3f4f6',
  'github-dark': 'background-color:#2d333b',
};

export interface Highlighter {
  highlight: (code: string, lang?: string, themeType?: ThemeType) => string;
  theme: NonNullable<MdxOptions['theme']>;
}

export async function getHighlighter(
  theme: Theme | ShikiThemeObj = {
    light: 'github-light',
    dark: 'github-dark',
  }
): Promise<Highlighter> {
  const isStringTheme = typeof theme === 'string';
  const themes = isStringTheme ? [theme] : [theme.dark, theme.light];

  const highlighter = await shiki.getHighlighter({ themes });

  const highlight = (
    code: string,
    lang?: string,
    themeType?: 'light' | 'dark'
  ): string => {
    const _theme = typeof theme === 'string' ? theme : theme[themeType!];

    try {
      let html = highlighter.codeToHtml(code.trim(), lang, _theme);

      if (themeType) {
        html = html.replace(/^<pre.*?(class=".*?")/, (str, originalClassStr) =>
          str.replace(
            originalClassStr,
            `class="${themeTypeClassMap[themeType]}"`
          )
        );
      }

      if (themeStyleMap[_theme]) {
        html = html.replace(/^<pre.*?(style=".*?")/, (str, originalStyleStr) =>
          str.replace(originalStyleStr, `style="${themeStyleMap[_theme]}"`)
        );
      }

      return html;
    } catch (err) {
      if (
        lang !== 'text' &&
        err instanceof Error &&
        err.message === 'No language registration for tree'
      ) {
        // fallback to 'text' for unregistered languages
        return highlight(code, 'text', themeType);
      }
      throw err;
    }
  };

  return {
    highlight,
    theme,
  };
}

export async function getRehypeHighlight(
  options: Pick<MdxOptions, 'theme'>
): Promise<Plugin> {
  const { highlight, theme } = await getHighlighter(options.theme);

  return () => tree => {
    visit(tree, 'element', (node: any, index: number, parent: any) => {
      const codeNode = node.children?.[0];

      if (
        node?.__skip ||
        node?.tagName !== 'pre' ||
        codeNode?.tagName !== 'code'
      ) {
        return;
      }

      const lang = getLanguage(codeNode);

      if (lang === false) {
        return;
      }

      const codeValue = codeNode.children[0].value;

      const results: {
        theme: Theme;
        html: string;
        class?: string;
      }[] = [];

      if (typeof theme === 'string') {
        results.push({
          theme,
          html: highlight(codeValue, lang),
        });
      } else {
        results.push(
          {
            theme: theme.light,
            html: highlight(codeValue, lang, 'light'),
            class: 'py-code-light',
          },
          {
            theme: theme.dark,
            html: highlight(codeValue, lang, 'dark'),
            class: 'py-code-dark',
          }
        );
      }

      if (!results.length) {
        return;
      }

      const preElements = results
        .map(result => {
          const [, classStr, styleStr, codeHtml] =
            result.html.match(
              /^<pre\s+class="(.*?)"\s+style="(.*?)">((.|\n)*)<\/pre>$/
            ) || [];

          if (!classStr || !styleStr) {
            return null;
          }

          return {
            type: 'element',
            tagName: 'pre',
            properties: {
              class: classStr,
              style: styleStr,
            },
            children: [{ type: 'text', value: codeHtml }],
            __skip: true,
          };
        })
        .filter(Boolean);

      parent.children.splice(index, 1, ...preElements);

      return SKIP;
    });
  };
}

/**
 * Get the programming language of `node`.
 */
function getLanguage(node: any): string | false {
  const className: string[] | undefined = node.properties?.className;

  if (Array.isArray(className)) {
    for (let c of className) {
      c = String(c);

      if (c === 'no-highlight' || c === 'nohighlight') {
        return false;
      }

      if (c.startsWith('lang-')) {
        return c.slice(5);
      }

      if (c.startsWith('language-')) {
        return c.slice(9);
      }
    }
  }

  return 'text';
}
