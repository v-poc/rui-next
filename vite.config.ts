import path from "path";

export default {
  build: {
    lib: {
      entry: path.resolve(__dirname, "./src/components/index.ts"),
      name: "RuiNext",
      fileName: (format: string) => `rui-next.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "reactdom"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          reactdom: "ReactDOM",
        },
      },
    },
  },
};
