import type { PrismTheme } from 'prism-react-renderer';

export const vitesseLightTheme: PrismTheme = {
  plain: {
    color: '#393a34',
    backgroundColor: '#ffffff',
  },
  styles: [
    {
      types: ['comment', 'punctuation', 'string'],
      style: {
        color: 'rgb(160, 173, 160)',
      },
    },
    {
      types: ['constant', 'builtin', 'variable'],
      style: {
        color: 'rgb(166, 94, 43)',
      },
    },
    {
      types: ['tag'],
      style: {
        color: 'rgb(47, 138, 137)',
      },
    },
    {
      types: ['function'],
      style: {
        color: 'rgb(108, 120, 52)',
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: 'rgb(181, 132, 81)',
      },
    },
    {
      types: ['operator', 'keyword'],
      style: {
        color: 'rgb(171, 89, 89)',
      },
    },
    {
      types: ['number'],
      style: {
        color: 'rgb(41, 106, 163)',
      },
    },
    {
      types: ['boolean'],
      style: {
        color: 'rgb(28, 107, 72)',
      },
    },
    {
      types: ['deleted'],
      style: {
        color: 'rgb(179, 29, 40)',
        backgroundColor: 'rgb(255, 238, 240)',
      },
    },
    {
      types: ['inserted'],
      style: {
        color: 'rgb(34, 134, 58)',
        backgroundColor: 'rgb(240, 255, 244)',
      },
    },
    {
      types: ['changed'],
      style: {
        color: 'rgb(227, 98, 9)',
        backgroundColor: 'rgb(255, 235, 218)',
      },
    },
  ],
};

export const vitesseDarkTheme: PrismTheme = {
  plain: {
    color: '#dbd7ca',
    backgroundColor: '#121212',
  },
  styles: [
    {
      types: ['comment', 'punctuation', 'string'],
      style: {
        color: 'rgb(117, 133, 117)',
      },
    },
    {
      types: ['constant', 'builtin', 'variable'],
      style: {
        color: 'rgb(212, 151, 108)',
      },
    },
    {
      types: ['tag'],
      style: {
        color: 'rgb(66, 153, 136)',
      },
    },
    {
      types: ['function'],
      style: {
        color: 'rgb(161, 181, 103)',
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: 'rgb(224, 165, 105)',
      },
    },
    {
      types: ['operator', 'keyword'],
      style: {
        color: 'rgb(203, 118, 118)',
      },
    },
    {
      types: ['number'],
      style: {
        color: 'rgb(99, 148, 191)',
      },
    },
    {
      types: ['boolean'],
      style: {
        color: 'rgb(77, 147, 117)',
      },
    },
    {
      types: ['deleted'],
      style: {
        color: 'rgb(253, 174, 183)',
        backgroundColor: 'rgb(134, 24, 29)',
      },
    },
    {
      types: ['inserted'],
      style: {
        color: 'rgb(133, 232, 157)',
        backgroundColor: 'rgb(20, 70, 32)',
      },
    },
    {
      types: ['changed'],
      style: {
        color: 'rgb(255, 171, 112)',
        backgroundColor: 'rgb(194, 78, 0)',
      },
    },
  ],
};
