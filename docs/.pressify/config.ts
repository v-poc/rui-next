import { defineConfig } from "pressify";
import type { ThemeConfig } from "pressify/theme";

export default defineConfig<ThemeConfig>({
  vite: {
    base: '/rui-next/docs/',
  },
  pages: "src",
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
    // algolia: {
    //   apiKey: "x",
    //   appId: "x",
    //   indexName: "x",
    // },
    themeConfigByPaths: {
      "/en": {
        locale: "en-US",
        localeText: "English",
        nav: [
          {
            text: "Documentation",
            // activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
            items: [
              { text: "Organization", link: "https://github.com/v-poc" },
              { text: "Tutorial", link: "https://nikoni.top/rui-next/docs/" },
              { text: "Examples", link: "https://nikoni.top/rui-next/docs/" },
            ],
          },
          // {
          //   text: "API",
          //   icon: "tabler:cloud-storm",
          //   // activeMatch: `^/api/`,
          //   link: "https://nikoni.top/rui-next/docs/",
          // },
          {
            text: "Playground",
            icon: "tabler:ghost",
            link: "https://nikoni.top/rui-next/docs/playground.html",
          },
          {
            text: "Links",
            icon: "tabler:mood-smile",
            // activeMatch: `^/about/`,
            items: [
              {
                text: "Changelog",
                icon: "tabler:clipboard",
                link: "https://github.com/v-poc/rui-next/blob/main/CHANGELOG.md",
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
              // {
              //   text: "Vitepress",
              //   icon: "tabler:adjustments-horizontal",
              //   link: "https://vitepress.vuejs.org/",
              // },
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
                text: "Divider",
                link: "/en/divider/doc",
              },
              {
                text: "AutoJustifyContent",
                link: "/en/auto-justify-content/doc",
              },
            ],
          },
          {
            text: "Data-Display",
            icon: "lucide:box",
            items: [
              {
                text: "Badge",
                link: "/en/badge/doc",
              },
            ],
          },
          {
            text: "Misc",
            icon: "lucide:qr-code",
            items: [
              {
                text: "QRCode",
                link: "/en/qr-code/doc",
              },
            ],
          },
          {
            text: "Hooks",
            icon: "lucide:layout-template",
            items: [
              {
                text: "useNetwork",
                link: "/en/hooks/useNetwork/doc",
              },
            ],
          },
          {
            text: "Experimental",
            icon: "lucide:slack",
            items: [
              {
                text: "One Piece",
                link: "/en/one-piece/doc",
              },
              {
                text: "Like Button",
                link: "/en/like-button/doc",
              },
            ],
          },
        ],
      },
    },
  },
});
