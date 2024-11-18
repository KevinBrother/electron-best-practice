import { resolve } from 'path';
import {
  defineConfig
  // externalizeDepsPlugin,
  // bytecodePlugin,
} from 'electron-vite';

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@common': resolve('src/common')
      }
    },
    // plugins: [externalizeDepsPlugin(), bytecodePlugin()],
    build: {
      outDir: resolve(__dirname, 'dist/main'),
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/base/index.ts')
        }
      }
    }
  },
  preload: {
    // plugins: [externalizeDepsPlugin(), bytecodePlugin()],
    build: {
      outDir: resolve(__dirname, 'dist/preload')
      // rollupOptions: {
      //   input: {
      //     index: resolve(__dirname, 'src/preload/index.ts'),
      //     windows: resolve(__dirname, 'src/preload/windows.ts')
      //   }
      // }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@common': resolve('src/common')
      }
    },
    build: {
      outDir: resolve(__dirname, 'dist/renderer'),
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          windows: resolve(__dirname, 'src/renderer/windows/index.html')
        }
      }
    }
  }
});
