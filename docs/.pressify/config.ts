import { defineConfig } from 'pressify';
import type { ThemeConfig } from 'pressify/theme';

export default defineConfig<ThemeConfig>({
  pages: 'src',
  themeConfig: {
    locale: 'zh-CN',
    localeText: '中文',
    title: 'Pressify',
    description: 'A Pressify App',
    banner: [
      'WIP！',
      [
        'a',
        {
          href: 'http://t.tt/',
          target: '_blank',
          style: { marginLeft: '24px' },
        },
        '查看详情',
      ],
    ],
    repo: 'codpoe/pressify',
    editLink: true,
    algolia: {
      apiKey: 'x',
      appId: 'x',
      indexName: 'x',
    },
    themeConfigByPaths: {
      '/zh': {
        locale: 'zh',
        localeText: '中文',
        nav: [
          {
            text: '文档',
            activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
            items: [
              { text: '指引', link: '/guide/introduction' },
              { text: '教程', link: '/tutorial/' },
              { text: '范例', link: '/examples/' },
              { text: '快速开始', link: '/guide/quick-start' },
              { text: '风格指南', link: '/style-guide/' },
              {
                text: '从 Vue 2 迁移',
                link: 'https://v3-migration.vuejs.org/',
              },
            ],
          },
          {
            text: 'API',
            icon: 'tabler:cloud-storm',
            activeMatch: `^/api/`,
            link: '/api/',
          },
          {
            text: 'Playground',
            link: 'https://sfc.vuejs.org',
          },
          {
            text: '指南',
            link: '/zh/guide',
          },
          {
            text: '关于',
            icon: 'tabler:mood-smile',
            activeMatch: `^/about/`,
            items: [
              { text: 'FAQ', icon: 'tabler:question-mark', link: '/about/faq' },
              { text: '团队', icon: 'tabler:users', link: '/about/team' },
              {
                text: '版本发布',
                icon: 'tabler:battery-automotive',
                link: '/about/releases',
              },
              {
                text: '社区指南',
                icon: 'tabler:adjustments-horizontal',
                link: '/about/community-guide',
              },
              { text: '行为准则', icon: 'tabler:ghost', link: '/about/coc' },
              {
                text: '纪录片',
                icon: 'tabler:video',
                link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI',
              },
            ],
          },
          {
            icon: 'uiw/github',
            link: 'https://github.com/codpoe/pressify',
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
            link: '/zh/guide/getting-started',
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
                link: '/zh/guide/demo',
              },
            ],
          },
          {
            text: '主题',
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
                link: '/zh/guide/demo',
              },
            ],
          },
          {
            text: '主题',
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
                link: '/zh/guide/demo',
              },
            ],
          },
          {
            text: '主题',
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
                link: '/zh/guide/demo',
              },
            ],
          },
          {
            text: '主题',
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
                link: '/zh/guide/demo',
              },
            ],
          },
          {
            text: '主题',
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
                link: '/zh/guide/demo',
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
