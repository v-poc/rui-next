import type { PrismTheme } from 'prism-react-renderer';

export const evaLightTheme: PrismTheme = {
  plain: {
    color: '#5d5d5f',
    backgroundColor: '#ebeef5',
  },
  styles: [
    {
      types: ['url'],
      style: {
        color: 'rgb(83, 160, 83)',
      },
    },
    {
      types: ['operator'],
      style: {
        color: 'rgb(142, 142, 144)',
      },
    },
    {
      types: ['variable'],
      style: {
        color: 'rgb(205, 96, 105)',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: 'rgb(169, 169, 170)',
      },
    },
    {
      types: ['builtin'],
      style: {
        color: 'rgb(255, 109, 18)',
      },
    },
    {
      types: ['class-name', 'attr-name', 'string'],
      style: {
        color: 'rgb(67, 122, 237)',
      },
    },
    {
      types: ['constant', 'keyword'],
      style: {
        color: 'rgb(200, 56, 198)',
      },
    },
  ],
};

export const evaDarkTheme: PrismTheme = {
  plain: {
    color: '#9da5b3',
    backgroundColor: '#282c34',
  },
  styles: [
    {
      types: ['url'],
      style: {
        color: 'rgb(152, 195, 121)',
      },
    },
    {
      types: ['variable'],
      style: {
        color: 'rgb(224, 108, 117)',
      },
    },
    {
      types: ['operator'],
      style: {
        color: 'rgb(142, 153, 177)',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: 'rgb(103, 110, 149)',
      },
    },
    {
      types: ['builtin'],
      style: {
        color: 'rgb(255, 144, 112)',
      },
    },
    {
      types: ['class-name', 'attr-name', 'string'],
      style: {
        color: 'rgb(100, 149, 238)',
      },
    },
    {
      types: ['constant', 'keyword'],
      style: {
        color: 'rgb(207, 104, 225)',
      },
    },
  ],
};
