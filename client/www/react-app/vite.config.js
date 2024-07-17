import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    proxy: {
      '/status.json': {
        target: 'http://127.0.0.1:8833',
        changeOrigin: true,
      },
      '/blocks.json': {
        target: 'http://127.0.0.1:8833',
        changeOrigin: true,
      },
      '/bwidth.json': {
        target: 'http://127.0.0.1:8833',
        changeOrigin: true,
      },
      '/system.json': {
        target: 'http://127.0.0.1:8833',
        changeOrigin: true,
      },
      '/txstat.json': {
        target: 'http://127.0.0.1:8833',
        changeOrigin: true,
      },
      '/walsta.json': {
        target: 'http://127.0.0.1:8833',
        changeOrigin: true,
      },
      '/balance.json': {
        target: 'http://127.0.0.1:8833',
        changeOrigin: true,
      },
      '/txs2s.xml': {
        target: 'http://127.0.0.1:8833',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Adjust as needed
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lodash'],
        },
      },
    },
  },
});
