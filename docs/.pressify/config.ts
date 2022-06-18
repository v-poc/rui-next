import { defineConfig } from 'pressify';
import type { ThemeConfig } from 'pressify/theme';

export default defineConfig<ThemeConfig>({
  pages: 'src',
  themeConfig: {
    locale: 'en-US',
    localeText: 'English',
    title: 'RUI playground',
    description: 'The Vite based PoC playground.',
    banner: [
      'WIP!',
      [
        'a',
        {
          href: 'https://patreon.com/nikoni',
          target: '_blank',
          style: { marginLeft: '24px' },
        },
        'Sponsor this project',
      ],
    ],
    repo: 'v-poc/rui-playground',
    editLink: true,
    // algolia: {
    //   apiKey: 'x',
    //   appId: 'x',
    //   indexName: 'x',
    // },
    themeConfigByPaths: {
      '/en': {
        locale: 'en-US',
        localeText: 'English',
        nav: [
          {
            text: 'Documentation',
            // activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
            items: [
              { text: 'Organization', link: 'https://github.com/v-poc' },
              { text: 'Tutorial', link: 'https://nikoni.top/rui-next/docs/' },
              { text: 'Examples', link: 'https://nikoni.top/rui-next/docs/' },
            ],
          },
          {
            text: 'API',
            icon: 'tabler:cloud-storm',
            // activeMatch: `^/api/`,
            link: 'https://nikoni.top/rui-next/docs/',
          },
          {
            text: 'Playground',
            link: 'https://nikoni.top/rui-next/docs/playground.html',
          },
          {
            text: 'Links',
            icon: 'tabler:mood-smile',
            // activeMatch: `^/about/`,
            items: [
              {
                text: 'Changelog',
                icon: 'tabler:ghost',
                link: 'https://github.com/v-poc/rui-next/blob/main/CHANGELOG.md',
              },
              {
                text: 'Team',
                icon: 'tabler:users',
                link: 'https://github.com/orgs/v-poc/people',
              },
              {
                text: 'Vite',
                icon: 'tabler:battery-automotive',
                link: 'https://vitejs.dev/',
              },
              {
                text: 'Vitepress',
                icon: 'tabler:adjustments-horizontal',
                link: 'https://vitepress.vuejs.org/',
              },
              {
                text: 'RUI(POC)',
                icon: 'tabler:ghost',
                link: 'https://github.com/v-poc/rui-poc',
              },
            ],
          },
          {
            icon: 'uiw/github',
            link: 'https://github.com/v-poc/rui-next',
          },
        ],
        sidebar: [
          {
            text: 'RUI',
            icon: 'openmoji:rocket',
            link: '/en/getting-started',
          },
          {
            text: 'Quick start',
            link: '/en/getting-started',
          },
          {
            text: 'Navigation-Layout',
            icon: 'lucide:layout',
            items: [
              {
                text: 'Divider',
                link: '/en/divider/doc',
              },
              {
                text: 'AutoJustifyContent',
                link: '/en/auto-justify-content/doc',
              },
            ],
          },
          {
            text: 'Experimental',
            icon: 'lucide:slack',
            items: [
              {
                text: 'One Piece',
                link: '/en/one-piece/doc',
              },
            ],
          },
        ],
      },
    },
  },
});
