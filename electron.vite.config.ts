import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  main: {
    build: {
      outDir: 'dist-electron',
    },
  },
  preload: {
    build: {
      outDir: 'dist-electron',
    },
  },
  renderer: {
    root: '.',
    build: {
      outDir: 'dist',
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  },
});
