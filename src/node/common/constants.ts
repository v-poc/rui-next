import { fileURLToPath } from "url";
import { createRequire } from "module";
import path from "upath";
import { TailwindOptions } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

export const DIST_CLIENT_DIR = path.join(__dirname, "../../client");
export const DIST_APP_DIR = path.join(DIST_CLIENT_DIR, "app");
export const CSR_ENTRY_FILE = path.join(DIST_CLIENT_DIR, "app/entry.client.js");
export const SSR_ENTRY_FILE = path.join(DIST_CLIENT_DIR, "app/entry.server.js");

// routes
export const ROUTES_MODULE_ID = "/@pressify/routes";

// mdx demo
export const MDX_DEMO_RE = /<Demo\s+src=["'](.*?)["']/;
export const DEMO_MODULE_ID_PREFIX = "/@pressify/demo/";

// mdx code demo
export const CODE_DEMO_MODULE_ID_PREFIX = "/@pressify/code-demo/";

// mdx tsInfo
export const MDX_TS_INFO_RE =
  /<TsInfo\s+src=["'](.*?)["']\s+name=["'](.*?)["']/;
export const TS_INFO_MODULE_ID_PREFIX = "/@pressify/ts-info/";

// theme
export const THEME_MODULE_ID = "/@pressify/theme";
export const THEME_CONFIG_MODULE_ID = "/@pressify/theme-config";
export const DIST_THEME_DIR = path.join(__dirname, "../../theme");
export const DEFAULT_THEME_FILE = path.join(DIST_THEME_DIR, "index.ts");
export const DEFAULT_THEME_TAILWIND_CONFIG: TailwindOptions = require("../../../tailwind.config.cjs");

export const SLIDE_MODULE_ID_PREFIX = "/@pressify/slide/";

export const POSSIBLE_CONFIG_FILES = ["config.js", "config.ts"];

export const POSSIBLE_THEME_FILES = [
  "theme.js",
  "theme.ts",
  "theme.jsx",
  "theme.tsx",
];
