const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 8080;

// Verificar que el directorio dist existe
const distPath = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');

if (!fs.existsSync(distPath)) {
  console.error('❌ Error: El directorio dist no existe. Ejecuta npm run build primero.');
  process.exit(1);
}

if (!fs.existsSync(indexHtmlPath)) {
  console.error('❌ Error: El archivo dist/index.html no existe. Ejecuta npm run build primero.');
  process.exit(1);
}

// Middleware de compresión
app.use(compression());

// Headers de seguridad
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Configuración de caché para diferentes tipos de archivos
const cacheOptions = {
  maxAge: '1y', // 1 año para archivos con hash
  etag: true,
  lastModified: true
};

// Endpoint de healthcheck explícito para Railway (debe estar ANTES del middleware estático)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint raíz para healthcheck (debe estar ANTES del middleware estático)
app.get('/', (req, res) => {
  // Verificar que el archivo existe antes de servirlo
  if (fs.existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
  } else {
    res.status(500).send('Error: index.html no encontrado');
  }
});

// Servir archivos estáticos con configuración de caché optimizada
// IMPORTANTE: El middleware estático debe ir DESPUÉS de las rutas específicas
app.use(express.static('dist', {
  ...cacheOptions,
  index: false, // Deshabilitar el index automático para que nuestra ruta '/' tenga prioridad
  setHeaders: (res, filePath) => {
    // Archivos con hash (JS, CSS) - caché largo
    if (filePath.match(/\.(js|css)$/) && filePath.includes('-')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Imágenes - caché largo
    else if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // HTML - caché corto
    else if (filePath.match(/\.html$/)) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    // Otros archivos
    else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

// Middleware para servir páginas estáticas de noticias
app.get('/noticia/:id', (req, res) => {
  const newsId = req.params.id;
  const staticPagePath = path.join(__dirname, 'public', 'noticia', `${newsId}.html`);
  
  // Detectar si es un bot de redes sociales
  const userAgent = req.get('User-Agent') || '';
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent) || 
                /facebookexternalhit|twitterbot|linkedinbot|whatsapp/i.test(userAgent);
  
  // Solo servir página estática a bots de redes sociales
  if (isBot && fs.existsSync(staticPagePath)) {
    console.log(`📄 Sirviendo página estática para bot: ${userAgent}`);
    res.sendFile(staticPagePath);
  } else {
    // Para usuarios humanos, servir la SPA directamente
    console.log(`🔄 Sirviendo SPA para usuario humano: noticia ${newsId}`);
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

// Endpoint para regenerar páginas estáticas
app.post('/api/regenerate-static-pages', (req, res) => {
  console.log('🔄 Regenerando páginas estáticas...');
  
  exec('npm run generate-meta', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error regenerando páginas estáticas:', error);
      return res.status(500).json({
        success: false,
        message: 'Error regenerando páginas estáticas',
        error: error.message
      });
    }
    
    console.log('✅ Páginas estáticas regeneradas exitosamente');
    console.log('📝 Output:', stdout);
    
    res.json({
      success: true,
      message: 'Páginas estáticas regeneradas exitosamente',
      output: stdout
    });
  });
});

// Todas las demás rutas sirven la SPA
app.get('/*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('Error: index.html no encontrado');
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error en el servidor:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Iniciar servidor con manejo de errores
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📁 Sirviendo archivos estáticos desde: ${distPath}`);
  console.log(`📄 Páginas estáticas de noticias desde: ${path.join(__dirname, 'public', 'noticia')}`);
  console.log(`✅ Healthcheck disponible en: http://0.0.0.0:${PORT}/health`);
});

// Manejo de errores del servidor
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error: El puerto ${PORT} ya está en uso`);
  } else {
    console.error('❌ Error al iniciar el servidor:', err);
  }
  process.exit(1);
});

// Manejo de señales de cierre
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('⚠️ SIGINT recibido, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});
