import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type ServerOptions } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

const commonServerOptions: ServerOptions = {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => `/api/v1${path.replace(/^\/api/, '')}`,
    },
  },
};

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  preview: commonServerOptions,
  server: commonServerOptions,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
