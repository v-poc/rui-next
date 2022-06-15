import reachRefresh from '@vitejs/plugin-react';

const path = require('path');

export default {
  plugins: [
    reachRefresh(), // for react-refresh plugin
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, './docs/src/en/index.ts'),
      name: 'RuiNext',
    },
    // outDir: 'dist',
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'reactdom'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          reactdom: 'ReactDOM',
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
};
