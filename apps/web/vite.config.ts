import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@viarteia/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@viarteia/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@viarteia/types': path.resolve(__dirname, '../../packages/types/src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    exclude: ['@vanilla-extract/css'],
  },
});
