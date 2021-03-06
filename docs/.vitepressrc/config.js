const path = require('path');
const pkg = require("../../package.json");

module.exports = {
  base: '/rui-next/docs',
  lang: 'en-US',
  title: 'RUI.next',
  description: 'The docs+demos of RUI.next',
  alias: {
    'root': path.resolve(__dirname, '../')
  },

  md: {
	  codeScope: {
		  'rui-next': path.resolve(__dirname, '../components/index.ts'),
      'experimental': path.resolve(__dirname, '../components/experimental.ts'),
	  },
	  docgen: {
		  
	  }
  },

  themeConfig: {
    repo: 'v-poc/rui-next',
    docsDir: 'docs',

    editLinks: true,
    editLinkText: 'Suggest changes to this page',
    lastUpdated: 'Last Updated',

    algolia: {
      apiKey: 'c57105e511faa5558547599f120ceeba',
      indexName: 'vitepress'
    },

    nav: [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: 'Changelog',
        link: 'https://github.com/v-poc/rui-next/blob/main/CHANGELOG.md'
      },
      {
        text: 'Links',
        items: [
          {
            text: `Repo (v${pkg.version})`,
            link: 'https://github.com/v-poc/rui-next'
          },
          {
            text: 'Vite',
            link: 'https://vitejs.dev/'
          },
          {
            text: 'Vitepress',
            link: 'https://vitepress.vuejs.org/'
          },
          {
            text: 'Vitepress-rc',
            link: 'https://github.com/cvnine/vitepress-rc'
          }
        ]
      }
    ],

    sidebar: {
      // '/guide/': getGuideSidebar(),
      // '/config/': getConfigSidebar(),
      '/': getLocalSidebar()
    }
  }
}

function getLocalSidebar() {
	return [
    {
      text: "Navigation-Layout",
      children: [
        { text: "NavBar", link: "/components/nav-bar/index" },
        { text: "Grid", link: "/components/grid/index" },
				{ text: "Flex", link: "/components/flex/index" },
        { text: "WhiteSpace", link: "/components/white-space/index" },
        { text: "Divider", link: "/components/divider/index" },
        { text: "AutoJustifyContent", link: "/components/auto-justify-content/index" },
      ]
    },
		{
			text: "Data-Display",
			children: [
        { text: "Card", link: "/components/card/index" },
        { text: "Badge", link: "/components/badge/index" },
        { text: "Icon", link: "/components/icon/index" },
        { text: "Tag", link: "/components/tag/index" },
        { text: "Watermark", link: "/components/watermark/index" },
        { text: "NoticeBar", link: "/components/notice-bar/index" },
        { text: "List", link: "/components/list/index" },
        { text: "Steps", link: "/components/steps/index" },
			]
		},
    {
      text: "Data-Entry",
      children: [
        { text: "Button", link: "/components/button/index" },
        { text: "Switch", link: "/components/switch/index" },
        { text: "Rate", link: "/components/rate/index" },
        { text: "CheckList", link: "/components/check-list/index" },
        { text: "Input", link: "/components/input/index" },
        { text: "TextArea", link: "/components/text-area/index" },
        { text: "Slider", link: "/components/slider/index" },
        { text: "SearchBar", link: "/components/search-bar/index" },
      ]
    },
		{
			text: "Feedback",
			children: [
				{ text: "ActivityIndicator", link: "/components/activity-indicator/index" },
        { text: "Progress", link: "/components/progress/index" },
        { text: "Result", link: "/components/result/index" },
        { text: "Skeleton", link: "/components/skeleton/index" },
        { text: "Empty", link: "/components/empty/index" },
			]
		},
		{
			text: "Misc",
			children: [
        { text: "QRCode", link: "/components/qr-code/index" },
			]
		},
    {
      text: "Hooks",
      children: [
        { text: "useNetwork", link: "/components/_hooks/useNetwork/index" },
        { text: "useFullscreen", link: "/components/_hooks/useFullscreen/index" },
        { text: "useVisibilityChange", link: "/components/_hooks/useVisibilityChange/index" },
        { text: "useClickAway", link: "/components/_hooks/useClickAway/index" },
        { text: "useLazyload", link: "/components/_hooks/useLazyload/index" },
        { text: "useLatest", link: "/components/_hooks/useLatest/index" },
        { text: "useMemoizedFn", link: "/components/_hooks/useMemoizedFn/index" },
      ]
    },
		{
			text: "Experimental",
			children: [
        { text: "PageIndicator", link: "/components/page-indicator/index" },
        { text: "SafeArea", link: "/components/safe-area/index" },
        { text: "Chart", link: "/components/chart/index" },
        { text: "Clamp", link: "/components/clamp/index" },
        { text: "OnePiece", link: "/components/one-piece/index" },
        { text: "LikeButton", link: "/components/like-button/index" },
        { text: "XButton", link: "/components/x-button/index" },
        { text: "Playground", link: "/playground" }
			]
		},
	]
}
