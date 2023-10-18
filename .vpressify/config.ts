import { defineConfig } from "vpressify";
import type { ThemeConfig } from "vpressify/theme";
import * as pkg from "../package.json";

const prefix =
  typeof location !== "undefined" && /nikoni/.test(location.hostname)
    ? "https://nikoni.top/rui-next"
    : "";

export default defineConfig<ThemeConfig>({
  pages: "src/docs",
  vite: {
    base: "/rui-next/",
    resolve: {
      alias: [{ find: "rui-next", replacement: "/src/components/index.ts" }],
    },
    css: {
      preprocessorOptions: {
        less: {
          // Inline JavaScript should be enabled.
          javascriptEnabled: true,
        },
      },
    },
  },
  themeConfig: {
    locale: "en-US",
    localeText: "English",
    title: "RUI.next",
    description: "Mobile web UI components based on React and Vite 4",
    banner: [
      "WIP!",
      [
        "a",
        {
          href: "/rui-next/en/sponsor/",
          style: { marginLeft: "24px" },
        },
        "Sponsor this project",
      ],
    ],
    docsRepo: "v-poc/rui-next",
    docsBranch: "main",
    editLink: true,
    algolia: {
      appId: "8UQ4X28Q0C",
      apiKey: "6861a087e7605ae972e4eefd88fc230c",
      indexName: "nikonitop",
    },
    themeConfigByPaths: {
      "/en": {
        locale: "en-US",
        localeText: "English",
        nav: [
          {
            text: "Documentation",
            items: [
              { text: "Tutorial", link: `${prefix}/en/getting-started/` },
              { text: "Examples-vite5", link: "/" },
              {
                text: "Examples-vite2",
                link: "https://nikoni.top/rui-next/docs/",
              },
            ],
          },
          {
            text: "Playground",
            icon: "tabler:ghost",
            link: `${prefix}/en/playground/`,
          },
          {
            text: "Links",
            icon: "tabler:mood-smile",
            items: [
              {
                text: `Repo (v${pkg.version})`,
                icon: "tabler:git-branch",
                link: "https://github.com/v-poc/rui-next",
              },
              {
                text: "Changelog",
                icon: "tabler:clipboard",
                link: "https://github.com/v-poc/rui-next/blob/main/CHANGELOG.md",
              },
              {
                text: "Organization",
                icon: "tabler:world",
                link: "https://github.com/v-poc",
              },
              {
                text: "Team",
                icon: "tabler:users",
                link: "https://github.com/orgs/v-poc/people",
              },
              {
                text: "Vite",
                icon: "tabler:bolt",
                link: "https://vitejs.dev/",
              },
              {
                text: "RUI-poc-vite5",
                icon: "tabler:git-branch",
                link: "https://github.com/v-poc/rui-poc",
              },
              {
                text: "Sponsor",
                icon: "tabler:mood-smile",
                link: `${prefix}/en/sponsor/`,
              },
            ],
          },
          {
            text: " ",
            icon: "lucide:languages",
            items: [
              { text: "English", link: "/" },
              { text: "简体中文", link: "/zh" },
            ],
          },
          {
            icon: "uiw/github",
            link: "https://github.com/v-poc/rui-next",
          },
        ],
        sidebar: [
          {
            text: "RUI",
            icon: "lucide:aperture",
            link: "/",
          },
          {
            text: "Getting Started",
            icon: "lucide:puzzle",
            link: `${prefix}/en/getting-started/`,
          },
          {
            text: "Navigation-Layout",
            icon: "lucide:layout",
            items: [
              {
                text: "NavBar",
                link: `${prefix}/en/nav-bar/`,
              },
              {
                text: "Grid",
                link: `${prefix}/en/grid/`,
              },
              {
                text: "Flex",
                link: `${prefix}/en/flex/`,
              },
              {
                text: "WhiteSpace",
                link: `${prefix}/en/white-space/`,
              },
              {
                text: "Divider",
                link: `${prefix}/en/divider/`,
              },
              {
                text: "AutoJustifyContent",
                link: `${prefix}/en/auto-justify-content/`,
              },
              {
                text: "Space",
                link: `${prefix}/en/space/`,
              },
              {
                text: "SideBar",
                link: `${prefix}/en/side-bar/`,
              },
            ],
          },
          {
            text: "Data-Display",
            icon: "lucide:box",
            items: [
              {
                text: "Card",
                link: `${prefix}/en/card/`,
              },
              {
                text: "Badge",
                link: `${prefix}/en/badge/`,
              },
              {
                text: "Icon",
                link: `${prefix}/en/icon/`,
              },
              {
                text: "Tag",
                link: `${prefix}/en/tag/`,
              },
              {
                text: "Watermark",
                link: `${prefix}/en/watermark/`,
              },
              {
                text: "NoticeBar",
                link: `${prefix}/en/notice-bar/`,
              },
              {
                text: "List",
                link: `${prefix}/en/list/`,
              },
              {
                text: "Steps",
                link: `${prefix}/en/steps/`,
              },
              {
                text: "Image",
                link: `${prefix}/en/image/`,
              },
              {
                text: "Avatar",
                link: `${prefix}/en/avatar/`,
              },
              {
                text: "Footer",
                link: `${prefix}/en/footer/`,
              },
              {
                text: "PageIndicator",
                link: `${prefix}/en/page-indicator/`,
              },
            ],
          },
          {
            text: "Data-Entry",
            icon: "lucide:component",
            items: [
              {
                text: "Button",
                link: `${prefix}/en/button/`,
              },
              {
                text: "Switch",
                link: `${prefix}/en/switch/`,
              },
              {
                text: "Rate",
                link: `${prefix}/en/rate/`,
              },
              {
                text: "CheckList",
                link: `${prefix}/en/check-list/`,
              },
              {
                text: "Input",
                link: `${prefix}/en/input/`,
              },
              {
                text: "TextArea",
                link: `${prefix}/en/text-area/`,
              },
              {
                text: "Slider",
                link: `${prefix}/en/slider/`,
              },
              {
                text: "SearchBar",
                link: `${prefix}/en/search-bar/`,
              },
            ],
          },
          {
            text: "Feedback",
            icon: "lucide:trello",
            items: [
              {
                text: "ActivityIndicator",
                link: `${prefix}/en/activity-indicator/`,
              },
              {
                text: "Progress",
                link: `${prefix}/en/progress/`,
              },
              {
                text: "Result",
                link: `${prefix}/en/result/`,
              },
              {
                text: "Skeleton",
                link: `${prefix}/en/skeleton/`,
              },
              {
                text: "Empty",
                link: `${prefix}/en/empty/`,
              },
              {
                text: "Mask",
                link: `${prefix}/en/mask/`,
              },
              {
                text: "Toast",
                link: `${prefix}/en/toast/`,
              },
            ],
          },
          {
            text: "Misc",
            icon: "lucide:qr-code",
            items: [
              {
                text: "QRCode",
                link: `${prefix}/en/qr-code/`,
              },
              {
                text: "Playground",
                link: `${prefix}/en/playground/`,
              },
            ],
          },
          {
            text: "Hooks",
            icon: "lucide:layout-template",
            items: [
              {
                text: "useNetwork",
                link: `${prefix}/en/use-network/`,
              },
              {
                text: "useFullscreen",
                link: `${prefix}/en/use-fullscreen/`,
              },
              {
                text: "useVisibilityChange",
                link: `${prefix}/en/use-visibilitychange/`,
              },
              {
                text: "useClickAway",
                link: `${prefix}/en/use-clickaway/`,
              },
              {
                text: "useLatest",
                link: `${prefix}/en/use-latest/`,
              },
              {
                text: "useMemoizedFn",
                link: `${prefix}/en/use-memoizedfn/`,
              },
              {
                text: "useInViewport",
                link: `${prefix}/en/use-in-viewport/`,
              },
            ],
          },
          {
            text: "Experimental",
            icon: "lucide:slack",
            items: [
              {
                text: "useLazyload",
                link: `${prefix}/en/use-lazyload/`,
              },
              {
                text: "SafeArea",
                link: `${prefix}/en/safe-area/`,
              },
              {
                text: "Chart",
                link: `${prefix}/en/chart/`,
              },
              {
                text: "Clamp",
                link: `${prefix}/en/clamp/`,
              },
              {
                text: "OnePiece",
                link: `${prefix}/en/one-piece/`,
              },
              {
                text: "LikeButton",
                link: `${prefix}/en/like-button/`,
              },
              {
                text: "XButton",
                link: `${prefix}/en/x-button/`,
              },
              {
                text: "CubeAnim",
                link: `${prefix}/en/cube-anim/`,
              },
            ],
          },
        ],
      },
    },
  },
});
