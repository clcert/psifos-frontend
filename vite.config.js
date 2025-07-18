import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['crypto'], // Polyfill específico para crypto
    }),
  ],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
    },
  },
  server: {
    host: true, // Permite que el contenedor exponga el frontend
    port: 3000, // Puerto donde correrá Vite
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Ajusta según la API de FastAPI
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
