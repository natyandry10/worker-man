import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  main: {
    entry: 'electron/main.ts',
    vite: {
      build: {
        outDir: 'dist-electron',
        rollupOptions: {
          external: Object.keys('dependencies' in require('./package.json') ? require('./package.json').dependencies : {})
        }
      }
    }
  },
  preload: {
    entry: 'electron/preload.ts',
    vite: {
      build: {
        outDir: 'dist-electron',
        rollupOptions: {
          external: Object.keys('dependencies' in require('./package.json') ? require('./package.json').dependencies : {})
        }
      }
    }
  },
  renderer: {
    root: '.',
    build: {
      outDir: 'dist'
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    }
  }
})
