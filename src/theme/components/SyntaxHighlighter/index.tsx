import React from 'react';
// @ts-ignore
import Highlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import type { SyntaxHighlighterProps as HighlighterProps } from 'react-syntax-highlighter';

// styles
// @ts-ignore
import lightStyle from 'react-syntax-highlighter/dist/esm/styles/prism/one-light';
// @ts-ignore
import darkStyle from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';

// languages
import {
  bash,
  c,
  clike,
  cpp,
  css,
  dart,
  diff,
  docker,
  ejs,
  go,
  graphql,
  handlebars,
  http,
  java,
  javascript,
  json,
  json5,
  jsx,
  kotlin,
  less,
  makefile,
  markdown,
  markup,
  objectivec,
  php,
  python,
  regex,
  ruby,
  rust,
  sass,
  scss,
  sql,
  stylus,
  swift,
  toml,
  tsx,
  typescript,
  yaml,
  // @ts-ignore
} from 'react-syntax-highlighter/dist/esm/languages/prism/index';
// import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
// import clike from 'react-syntax-highlighter/dist/esm/languages/prism/clike';
// import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
// import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
// import dart from 'react-syntax-highlighter/dist/esm/languages/prism/dart';
// import diff from 'react-syntax-highlighter/dist/esm/languages/prism/diff';
// import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker';
// import ejs from 'react-syntax-highlighter/dist/esm/languages/prism/ejs';
// import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
// import graphql from 'react-syntax-highlighter/dist/esm/languages/prism/graphql';
// import handlebars from 'react-syntax-highlighter/dist/esm/languages/prism/handlebars';
// import http from 'react-syntax-highlighter/dist/esm/languages/prism/http';
// import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
// import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
// import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
// import json5 from 'react-syntax-highlighter/dist/esm/languages/prism/json5';
// import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
// import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin';
// import less from 'react-syntax-highlighter/dist/esm/languages/prism/less';
// import makefile from 'react-syntax-highlighter/dist/esm/languages/prism/makefile';
// import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
// import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
// import objectivec from 'react-syntax-highlighter/dist/esm/languages/prism/objectivec';
// import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
// import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
// import regex from 'react-syntax-highlighter/dist/esm/languages/prism/regex';
// import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
// import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
// import sass from 'react-syntax-highlighter/dist/esm/languages/prism/sass';
// import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
// import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
// import stylus from 'react-syntax-highlighter/dist/esm/languages/prism/stylus';
// import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift';
// import toml from 'react-syntax-highlighter/dist/esm/languages/prism/toml';
// import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
// import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
// import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';

import { useThemeContext } from '../../context';

const builtInLanguages = [
  bash,
  c,
  clike,
  cpp,
  css,
  dart,
  diff,
  docker,
  ejs,
  go,
  graphql,
  handlebars,
  http,
  java,
  javascript,
  json,
  json5,
  jsx,
  kotlin,
  less,
  makefile,
  markdown,
  markup,
  objectivec,
  php,
  python,
  regex,
  ruby,
  rust,
  sass,
  scss,
  sql,
  stylus,
  swift,
  toml,
  tsx,
  typescript,
  yaml,
];

/**
 * Register prism language for code highlight
 *
 * @example
 * import zig from 'react-syntax-highlighter/dist/esm/languages/prism/zig';
 * registerLanguage(zig);
 */
export function registerLanguage(lang: any) {
  // Actually `react-syntax-highlighter` doesn't need the `name` parameter,
  // so we're just passing the empty string here
  Highlighter.registerLanguage('', lang);
}

builtInLanguages.forEach(registerLanguage);

function createPreTag(language?: string, pure?: boolean) {
  return function PreTag({ children }: React.HTMLAttributes<HTMLElement>) {
    return (
      <div className="relative">
        {language && (
          <span className="absolute top-0.5 right-1.5 text-xs font-medium opacity-40 pointer-events-none">
            {language}
          </span>
        )}
        <pre className={pure ? '!my-0 !rounded-none' : ''}>{children}</pre>
      </div>
    );
  };
}

function CodeTag({ style, ...restProps }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      style={{
        ...style,
        background: 'var(--c-bg-1)',
        lineHeight: 'unset',
      }}
      {...restProps}
    />
  );
}

export interface SyntaxHighlighterProps extends HighlighterProps {
  pure?: boolean;
}

export function SyntaxHighlighter({
  language,
  pure,
  ...restProps
}: SyntaxHighlighterProps) {
  const { themeMode } = useThemeContext();

  return (
    <Highlighter
      language={language}
      style={themeMode === 'dark' ? darkStyle : lightStyle}
      PreTag={createPreTag(language, pure)}
      CodeTag={CodeTag}
      {...restProps}
    />
  );
}
