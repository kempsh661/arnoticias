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
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 1 // Reducir a 1 pasada para build más rápido
      },
      format: {
        comments: false
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
    sourcemap: false,
    // Optimizaciones para build más rápido
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false, // Deshabilitar cálculo de tamaño comprimido (más rápido)
    target: 'esnext', // Usar ES modules modernos para mejor performance
    modulePreload: {
      polyfill: false // No polyfill para módulos modernos
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router']
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
})

