import * as path from "path";
import { defineConfig } from "rspress/config";
import { pluginLess } from "@rsbuild/plugin-less";
import { pluginPreview } from "@rspress/plugin-preview";
// import * as pkg from "./package.json";

export default defineConfig({
  root: path.join(__dirname, "src"),
  base: "/rui-next/",
  title: "RUI.next",
  description: "Mobile web UI components based on React and Vite 6",
  outDir: "dist/docs",
  markdown: {
    mdxRs: false,
    defaultWrapCode: true,
  },
  builderPlugins: [pluginLess()],
  plugins: [pluginPreview()],
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/v-poc/rui-next",
      },
    ],
    footer: {
      message: "Copyright © 2021-present Niko Ni. Built with Rspress.",
    },
    // nav: [
    //   {
    //     text: "Documentation",
    //     items: [
    //       { text: "Tutorial", link: "/getting-started" },
    //       {
    //         text: "Examples-vite2",
    //         link: "https://nikoni.top/rui-next/docs/",
    //       },
    //     ],
    //   },
    //   {
    //     text: "Playground",
    //     link: "/components/playground/playground",
    //   },
    //   {
    //     text: "Links",
    //     items: [
    //       {
    //         text: `Repo (v${pkg.version})`,
    //         link: "https://github.com/v-poc/rui-next",
    //       },
    //       {
    //         text: "Changelog",
    //         link: "https://github.com/v-poc/rui-next/blob/main/CHANGELOG.md",
    //       },
    //       {
    //         text: "Organization",
    //         link: "https://github.com/v-poc",
    //       },
    //       {
    //         text: "Team",
    //         link: "https://github.com/orgs/v-poc/people",
    //       },
    //       {
    //         text: "Vite",
    //         link: "https://vitejs.dev/",
    //       },
    //       {
    //         text: "RUI-poc-vite6",
    //         link: "https://github.com/v-poc/rui-poc",
    //       },
    //       {
    //         text: "Sponsor",
    //         link: "/components/playground/sponsor",
    //       },
    //     ],
    //   },
    // ],
    // sidebar: {
    //   "/guide/": [
    //     {
    //       text: "RUI",
    //       link: "/",
    //     },
    //     {
    //       text: "Getting Started",
    //       link: "/getting-started",
    //     },
    //     {
    //       text: "Navigation-Layout",
    //       items: [
    //         {
    //           text: "NavBar",
    //           link: "/components/nav-bar/index-en",
    //         },
    //         {
    //           text: "Grid",
    //           link: "/components/grid/index-en",
    //         },
    //         {
    //           text: "Flex",
    //           link: "/components/flex/index-en",
    //         },
    //         {
    //           text: "WhiteSpace",
    //           link: "/components/white-space/index-en",
    //         },
    //         {
    //           text: "Divider",
    //           link: "/components/divider/index-en",
    //         },
    //         {
    //           text: "AutoJustifyContent",
    //           link: "/components/auto-justify-content/index-en",
    //         },
    //         {
    //           text: "Space",
    //           link: "/components/space/index-en",
    //         },
    //         {
    //           text: "SideBar",
    //           link: "/components/side-bar/index-en",
    //         },
    //       ],
    //     },
    //     {
    //       text: "Data-Display",
    //       items: [
    //         {
    //           text: "Card",
    //           link: "/components/card/index-en",
    //         },
    //         {
    //           text: "Badge",
    //           link: "/components/badge/index-en",
    //         },
    //         {
    //           text: "Icon",
    //           link: "/components/icon/index-en",
    //         },
    //         {
    //           text: "Tag",
    //           link: "/components/tag/index-en",
    //         },
    //         {
    //           text: "Watermark",
    //           link: "/components/watermark/index-en",
    //         },
    //         {
    //           text: "NoticeBar",
    //           link: "/components/notice-bar/index-en",
    //         },
    //         {
    //           text: "List",
    //           link: "/components/list/index-en",
    //         },
    //         {
    //           text: "Steps",
    //           link: "/components/steps/index-en",
    //         },
    //         {
    //           text: "Image",
    //           link: "/components/image/index-en",
    //         },
    //         {
    //           text: "Avatar",
    //           link: "/components/avatar/index-en",
    //         },
    //         {
    //           text: "Footer",
    //           link: "/components/footer/index-en",
    //         },
    //         {
    //           text: "PageIndicator",
    //           link: "/components/page-indicator/index-en",
    //         },
    //       ],
    //     },
    //     {
    //       text: "Data-Entry",
    //       items: [
    //         {
    //           text: "Button",
    //           link: "/components/button/index-en",
    //         },
    //         {
    //           text: "Switch",
    //           link: "/components/switch/index-en",
    //         },
    //         {
    //           text: "Rate",
    //           link: "/components/rate/index-en",
    //         },
    //         {
    //           text: "CheckList",
    //           link: "/components/check-list/index-en",
    //         },
    //         {
    //           text: "Input",
    //           link: "/components/input/index-en",
    //         },
    //         {
    //           text: "TextArea",
    //           link: "/components/text-area/index-en",
    //         },
    //         {
    //           text: "Slider",
    //           link: "/components/slider/index-en",
    //         },
    //         {
    //           text: "SearchBar",
    //           link: "/components/search-bar/index-en",
    //         },
    //         {
    //           text: "Selector",
    //           link: "/components/selector/index-en",
    //         },
    //       ],
    //     },
    //     {
    //       text: "Feedback",
    //       items: [
    //         {
    //           text: "ActivityIndicator",
    //           link: "/components/activity-indicator/index-en",
    //         },
    //         {
    //           text: "Progress",
    //           link: "/components/progress/index-en",
    //         },
    //         {
    //           text: "Result",
    //           link: "/components/result/index-en",
    //         },
    //         {
    //           text: "Skeleton",
    //           link: "/components/skeleton/index-en",
    //         },
    //         {
    //           text: "Empty",
    //           link: "/components/empty/index-en",
    //         },
    //         {
    //           text: "Mask",
    //           link: "/components/mask/index-en",
    //         },
    //         {
    //           text: "Toast",
    //           link: "/components/toast/index-en",
    //         },
    //       ],
    //     },
    //     {
    //       text: "Misc",
    //       items: [
    //         {
    //           text: "QRCode",
    //           link: "/components/qr-code/index-en",
    //         },
    //         {
    //           text: "Playground",
    //           link: "/components/playground/playground",
    //         },
    //       ],
    //     },
    //     {
    //       text: "Hooks",
    //       items: [
    //         {
    //           text: "useNetwork",
    //           link: "/components/hooks/useNetwork/index-en",
    //         },
    //         {
    //           text: "useFullscreen",
    //           link: "/components/hooks/useFullscreen/index-en",
    //         },
    //         {
    //           text: "useVisibilityChange",
    //           link: "/components/hooks/useVisibilityChange/index-en",
    //         },
    //         {
    //           text: "useClickAway",
    //           link: "/components/hooks/useClickAway/index-en",
    //         },
    //         {
    //           text: "useLatest",
    //           link: "/components/hooks/useLatest/index-en",
    //         },
    //         {
    //           text: "useMemoizedFn",
    //           link: "/components/hooks/useMemoizedFn/index-en",
    //         },
    //         {
    //           text: "useInViewport",
    //           link: "/components/hooks/useInViewport/index-en",
    //         },
    //       ],
    //     },
    //     {
    //       text: "Experimental",
    //       items: [
    //         {
    //           text: "useLazyload",
    //           link: "/components/hooks/useLazyload/index-en",
    //         },
    //         {
    //           text: "SafeArea",
    //           link: "/components/safe-area/index-en",
    //         },
    //         // {
    //         //   text: "Chart",
    //         //   link: "/components/chart/index-en",
    //         // },
    //         {
    //           text: "Clamp",
    //           link: "/components/clamp/index-en",
    //         },
    //         {
    //           text: "OnePiece",
    //           link: "/components/one-piece/index-en",
    //         },
    //         {
    //           text: "LikeButton",
    //           link: "/components/like-button/index-en",
    //         },
    //         {
    //           text: "XButton",
    //           link: "/components/x-button/index-en",
    //         },
    //         {
    //           text: "CubeAnim",
    //           link: "/components/cube-anim/index-en",
    //         },
    //       ],
    //     },
    //   ],
    // },
  },
  ssg: false,
});
