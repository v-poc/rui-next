/**
 * vscode panda theme
 * Converted automatically using https://github.com/FormidableLabs/prism-react-renderer/blob/master/tools/themeFromVsCode
 */

import { PrismTheme } from 'prism-react-renderer';

export const pandaTheme: PrismTheme = {
  plain: {
    color: '#e6e6e6',
    backgroundColor: '#282f36',
  },
  styles: [
    {
      types: ['comment'],
      style: {
        color: 'rgb(103, 107, 121)',
        fontStyle: 'italic',
      },
    },
    {
      types: ['operator', 'variable'],
      style: {
        color: 'rgb(230, 230, 230)',
      },
    },
    {
      types: ['constant'],
      style: {
        color: 'rgb(255, 184, 108)',
      },
    },
    {
      types: ['char'],
      style: {
        color: 'rgb(69, 169, 249)',
      },
    },
    {
      types: ['string', 'symbol', 'inserted'],
      style: {
        color: 'rgb(25, 249, 216)',
      },
    },
    {
      types: ['punctuation', 'tag', 'attr-name'],
      style: {
        color: 'rgb(255, 204, 149)',
      },
    },
    {
      types: ['builtin', 'function'],
      style: {
        color: 'rgb(111, 193, 255)',
      },
    },
    {
      types: ['keyword'],
      style: {
        color: 'rgb(255, 154, 193)',
      },
    },
    {
      types: ['changed'],
      style: {
        color: 'rgb(255, 117, 181)',
      },
    },
    {
      types: ['deleted'],
      style: {
        color: 'rgb(255, 44, 109)',
      },
    },
  ],
};
