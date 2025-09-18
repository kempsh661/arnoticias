import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const server = await createServer({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true,
    middlewareMode: false,
    fs: {
      allow: ['..']
    }
  }
})

// Middleware personalizado para manejar rutas de noticias
server.middlewares.use('/noticia/:id', (req, res, next) => {
  const newsId = req.params.id
  const staticPagePath = join(process.cwd(), 'public', 'noticia', `${newsId}.html`)
  
  console.log(`🔍 [Dev Server] Intentando servir noticia ${newsId}`)
  console.log(`📁 [Dev Server] Ruta estática: ${staticPagePath}`)
  
  // Verificar si existe la página estática
  if (existsSync(staticPagePath)) {
    console.log(`📄 [Dev Server] Sirviendo página estática para noticia ${newsId}`)
    try {
      const content = readFileSync(staticPagePath, 'utf8')
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(content)
      return
    } catch (error) {
      console.error(`❌ [Dev Server] Error leyendo archivo estático:`, error)
    }
  } else {
    console.log(`🔄 [Dev Server] Página estática no encontrada, sirviendo SPA`)
  }
  
  // Si no existe o hay error, continuar con el middleware normal
  next()
})

// Todas las demás rutas sirven la SPA
server.middlewares.use('*', (req, res, next) => {
  // Dejar que Vite maneje las rutas normales
  next()
})

await server.listen()
console.log('🚀 Servidor de desarrollo ejecutándose en http://localhost:3000')
console.log('📄 Rutas de noticias configuradas para desarrollo')

