import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 8080,
    allowedHosts: [
      'healthcheck.railway.app',
      'localhost',
      '.railway.app',
      'araucanoticias.com.co',
      'www.araucanoticias.com.co'
    ],
    cors: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  },
  build: {
    outDir: 'dist',
    minify: 'terser'
  },
  optimizeDeps: {
    include: ['vue', 'vue-router']
  }
})

