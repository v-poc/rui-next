import { dirname, resolve } from "node:path";
import { defineConfig, esmExternalRequirePlugin } from "vite";

const external = [/^react$/, /^react-dom(?:\/client)?$/, /^react-dom\/(?!jsx)/, /^scheduler$/];

export default defineConfig({
  plugins: [esmExternalRequirePlugin({ external })],
  build: {
    target: "es2020",
    lib: {
      entry: resolve(import.meta.dirname, "./src/components/index.ts"),
      name: "RuiNext",
      formats: ["es", "umd"],
      fileName: (format: string) => `rui-next.${format}.js`,
      cssFileName: "rui-next",
    },
    rolldownOptions: {
      external,
      preserveEntrySignatures: "strict",
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOM",
          scheduler: "Scheduler",
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // Inline JavaScript should be enabled.
        javascriptEnabled: true,
      },
    },
  },
});
