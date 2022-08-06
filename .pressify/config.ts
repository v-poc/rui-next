import { defineConfig } from "pressify";
import type { ThemeConfig } from "pressify/theme";

export default defineConfig<ThemeConfig>({
  pages: "src/docs",
  vite: {
    base: "/rui-next/",
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
    title: "RUI playground",
    description: "The Vite based PoC playground.",
    banner: [
      "WIP!",
      [
        "a",
        {
          href: "https://patreon.com/nikoni",
          target: "_blank",
          style: { marginLeft: "24px" },
        },
        "Sponsor this project",
      ],
    ],
    docsRepo: "v-poc/rui-playground",
    docsBranch: "main",
    editLink: true,
    algolia: {
      appId: 'D64BBPKSIG',
      apiKey: '9d34b6f14d6272405205d97816d7dd1b',
      indexName: 'nikoni',
    },
    themeConfigByPaths: {
      "/en": {
        locale: "en-US",
        localeText: "English",
        nav: [
          {
            text: "Documentation",
            items: [
              { text: "Tutorial", link: "https://nikoni.top/rui-next/en/getting-started" },
              { text: "Examples", link: "https://nikoni.top/rui-next/" },
            ],
          },
          {
            text: "Playground",
            icon: "tabler:ghost",
            link: "https://nikoni.top/rui-next/docs/playground.html",
          },
          {
            text: "Links",
            icon: "tabler:mood-smile",
            items: [
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
                text: "RUI-next",
                icon: "tabler:git-branch",
                link: "https://github.com/v-poc/rui-next",
              },
              {
                text: "RUI-poc",
                icon: "tabler:git-branch",
                link: "https://github.com/v-poc/rui-poc",
              },
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
            ],
          },
          {
            text: "Data-Entry",
            icon: "lucide:component",
            items: [
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
                text: "Skeleton",
                link: "/en/skeleton",
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
            ],
          },
          {
            text: "Experimental",
            icon: "lucide:slack",
            items: [
              {
                text: "PageIndicator",
                link: "/en/page-indicator",
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
            ],
          },
        ],
      },
    },
  },
});
