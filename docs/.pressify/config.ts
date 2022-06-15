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
      'WIP！',
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
                text: 'RuiPOC',
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
            text: '项目介绍',
            icon: 'openmoji:rocket',
            link: '/zh/guide',
          },
          {
            text: '快速上手',
            link: '/en/one-piece/getting-started',
          },
          {
            text: '配置',
            link: '/zh/guide/config',
          },
          {
            text: '路由规则',
            link: '/zh/guide/routes',
          },
          {
            text: '主题',
            icon: 'lucide:home',
            items: [
              {
                text: '默认主题',
                link: '/zh/guide/default-theme',
              },
              {
                text: '自定义主题',
                link: '/zh/guide/custom-theme',
              },
              {
                text: '使用 Demo 组件进行演示',
                link: '/en/one-piece/demo',
              },
            ],
          },
          {
            text: '路由规则',
            link: '/zh/guide/routes',
          },
          {
            text: '路由规则',
            link: '/zh/guide/routes',
          },
        ],
      },
    },
  },
});
