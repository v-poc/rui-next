import type { PrismTheme } from 'prism-react-renderer';

export const tokyoNightLightTheme: PrismTheme = {
  plain: {
    color: '#343b59',
    backgroundColor: '#d5d6db',
  },
  styles: [
    {
      types: ['comment'],
      style: {
        fontStyle: 'italic',
      },
    },
    {
      types: ['keyword', 'operator'],
      style: {
        color: 'rgb(76, 80, 94)',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: 'rgb(150, 153, 163)',
      },
    },
    {
      types: ['builtin', 'number'],
      style: {
        color: 'rgb(150, 80, 39)',
      },
    },
    {
      types: ['string', 'symbol', 'constant', 'attr-name'],
      style: {
        color: 'rgb(72, 94, 48)',
      },
    },
    {
      types: ['function'],
      style: {
        color: 'rgb(22, 103, 117)',
      },
    },
    {
      types: ['tag'],
      style: {
        color: 'rgb(140, 67, 81)',
      },
    },
    {
      types: ['variable'],
      style: {
        color: 'rgb(143, 94, 21)',
      },
    },
    {
      types: ['char'],
      style: {
        color: 'rgb(90, 74, 120)',
      },
    },
    {
      types: ['property'],
      style: {
        color: 'rgb(72, 76, 97)',
      },
    },
    {
      types: ['inserted'],
      style: {
        color: 'rgb(68, 157, 171)',
      },
    },
    {
      types: ['deleted'],
      style: {
        color: 'rgb(145, 76, 84)',
      },
    },
    {
      types: ['changed'],
      style: {
        color: 'rgb(52, 84, 138)',
      },
    },
  ],
};

export const tokyoNightDarkTheme: PrismTheme = {
  plain: {
    color: '#a9b1d6',
    backgroundColor: '#1a1b26',
  },
  styles: [
    {
      types: ['comment'],
      style: {
        fontStyle: 'italic',
      },
    },
    {
      types: ['keyword', 'operator'],
      style: {
        color: 'rgb(137, 221, 255)',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: 'rgb(68, 75, 106)',
      },
    },
    {
      types: ['builtin', 'number'],
      style: {
        color: 'rgb(255, 158, 100)',
      },
    },
    {
      types: ['string', 'symbol', 'constant', 'attr-name'],
      style: {
        color: 'rgb(158, 206, 106)',
      },
    },
    {
      types: ['function'],
      style: {
        color: 'rgb(13, 185, 215)',
      },
    },
    {
      types: ['tag'],
      style: {
        color: 'rgb(247, 118, 142)',
      },
    },
    {
      types: ['variable'],
      style: {
        color: 'rgb(224, 175, 104)',
      },
    },
    {
      types: ['char'],
      style: {
        color: 'rgb(187, 154, 247)',
      },
    },
    {
      types: ['property'],
      style: {
        color: 'rgb(154, 189, 245)',
      },
    },
    {
      types: ['inserted'],
      style: {
        color: 'rgb(68, 157, 171)',
      },
    },
    {
      types: ['deleted'],
      style: {
        color: 'rgb(145, 76, 84)',
      },
    },
    {
      types: ['changed'],
      style: {
        color: 'rgb(97, 131, 187)',
      },
    },
  ],
};
