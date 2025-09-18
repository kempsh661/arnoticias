import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true,
    // Configurar para manejar rutas de noticias en desarrollo
    middlewareMode: false,
    fs: {
      allow: ['..']
    }
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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router']
        }
      }
    },
    cssCodeSplit: true,
    sourcemap: false
  },
  optimizeDeps: {
    include: ['vue', 'vue-router']
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
})

