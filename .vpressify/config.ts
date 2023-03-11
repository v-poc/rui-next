import { defineConfig } from "vpressify";
import type { ThemeConfig } from "vpressify/theme";
import * as pkg from "../package.json";

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
          href: "/rui-next/en/sponsor",
          // target: "_blank",
          style: { marginLeft: "24px" },
        },
        "Sponsor this project",
      ],
    ],
    docsRepo: "v-poc/rui-playground",
    docsBranch: "main",
    editLink: true,
    // algolia: {
    //   appId: 'D64BBPKSIG',
    //   apiKey: '9d34b6f14d6272405205d97816d7dd1b',
    //   indexName: 'nikoni',
    // },
    themeConfigByPaths: {
      "/en": {
        locale: "en-US",
        localeText: "English",
        nav: [
          {
            text: "Documentation",
            items: [
              { text: "Tutorial", link: "/en/getting-started" },
              { text: "Examples-vite4", link: "/" },
              {
                text: "Examples-vite2",
                link: "https://nikoni.top/rui-next/docs/",
              },
            ],
          },
          {
            text: "Playground",
            icon: "tabler:ghost",
            link: "/en/playground",
          },
          {
            text: "Links",
            icon: "tabler:mood-smile",
            items: [
              {
                text: `Repo (v${pkg.version})`,
                icon: "tabler:git-branch",
                link: "https://github.com/v-poc/rui-playground",
              },
              {
                text: "Changelog",
                icon: "tabler:clipboard",
                link: "https://github.com/v-poc/rui-playground/blob/main/CHANGELOG.md",
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
                text: "RUI-poc-vite4",
                icon: "tabler:git-branch",
                link: "https://github.com/v-poc/rui-poc",
              },
              {
                text: "Sponsor",
                icon: "tabler:mood-smile",
                link: "/en/sponsor",
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
            link: "https://github.com/v-poc/rui-playground",
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
            link: "/en/getting-started",
          },
          {
            text: "Navigation-Layout",
            icon: "lucide:layout",
            items: [
              {
                text: "NavBar",
                link: "/en/nav-bar",
              },
              {
                text: "Grid",
                link: "/en/grid",
              },
              {
                text: "Flex",
                link: "/en/flex",
              },
              {
                text: "WhiteSpace",
                link: "/en/white-space",
              },
              {
                text: "Divider",
                link: "/en/divider",
              },
              {
                text: "AutoJustifyContent",
                link: "/en/auto-justify-content",
              },
              {
                text: "Space",
                link: "/en/space",
              },
              {
                text: "SideBar",
                link: "/en/side-bar",
              },
            ],
          },
          {
            text: "Data-Display",
            icon: "lucide:box",
            items: [
              {
                text: "Card",
                link: "/en/card",
              },
              {
                text: "Badge",
                link: "/en/badge",
              },
              {
                text: "Icon",
                link: "/en/icon",
              },
              {
                text: "Tag",
                link: "/en/tag",
              },
              {
                text: "Watermark",
                link: "/en/watermark",
              },
              {
                text: "NoticeBar",
                link: "/en/notice-bar",
              },
              {
                text: "List",
                link: "/en/list",
              },
              {
                text: "Steps",
                link: "/en/steps",
              },
              {
                text: "Image",
                link: "/en/image",
              },
              {
                text: "Avatar",
                link: "/en/avatar",
              },
              {
                text: "Footer",
                link: "/en/footer",
              },
              {
                text: "PageIndicator",
                link: "/en/page-indicator",
              },
            ],
          },
          {
            text: "Data-Entry",
            icon: "lucide:component",
            items: [
              {
                text: "Button",
                link: "/en/button",
              },
              {
                text: "Switch",
                link: "/en/switch",
              },
              {
                text: "Rate",
                link: "/en/rate",
              },
              {
                text: "CheckList",
                link: "/en/check-list",
              },
              {
                text: "Input",
                link: "/en/input",
              },
              {
                text: "TextArea",
                link: "/en/text-area",
              },
              {
                text: "Slider",
                link: "/en/slider",
              },
              {
                text: "SearchBar",
                link: "/en/search-bar",
              },
            ],
          },
          {
            text: "Feedback",
            icon: "lucide:trello",
            items: [
              {
                text: "ActivityIndicator",
                link: "/en/activity-indicator",
              },
              {
                text: "Progress",
                link: "/en/progress",
              },
              {
                text: "Result",
                link: "/en/result",
              },
              {
                text: "Skeleton",
                link: "/en/skeleton",
              },
              {
                text: "Empty",
                link: "/en/empty",
              },
              {
                text: "Mask",
                link: "/en/mask",
              },
              {
                text: "Toast",
                link: "/en/toast",
              },
            ],
          },
          {
            text: "Misc",
            icon: "lucide:qr-code",
            items: [
              {
                text: "QRCode",
                link: "/en/qr-code",
              },
            ],
          },
          {
            text: "Hooks",
            icon: "lucide:layout-template",
            items: [
              {
                text: "useNetwork",
                link: "/en/use-network",
              },
              {
                text: "useFullscreen",
                link: "/en/use-fullscreen",
              },
              {
                text: "useVisibilityChange",
                link: "/en/use-visibilitychange",
              },
              {
                text: "useClickAway",
                link: "/en/use-clickaway",
              },
              {
                text: "useLatest",
                link: "/en/use-latest",
              },
              {
                text: "useMemoizedFn",
                link: "/en/use-memoizedfn",
              },
              {
                text: "useInViewport",
                link: "/en/use-in-viewport",
              },
            ],
          },
          {
            text: "Experimental",
            icon: "lucide:slack",
            items: [
              {
                text: "useLazyload",
                link: "/en/use-lazyload",
              },
              {
                text: "SafeArea",
                link: "/en/safe-area",
              },
              {
                text: "Chart",
                link: "/en/chart",
              },
              {
                text: "Clamp",
                link: "/en/clamp",
              },
              {
                text: "OnePiece",
                link: "/en/one-piece",
              },
              {
                text: "LikeButton",
                link: "/en/like-button",
              },
              {
                text: "XButton",
                link: "/en/x-button",
              },
              {
                text: "CubeAnim",
                link: "/en/cube-anim",
              },
              {
                text: "Playground",
                link: "/en/playground",
              },
            ],
          },
        ],
      },
    },
  },
});
