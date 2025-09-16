const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 8080;

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

const shortCacheOptions = {
  maxAge: '1h', // 1 hora para HTML
  etag: true,
  lastModified: true
};

// Servir archivos estáticos con configuración de caché optimizada
app.use(express.static('dist', {
  ...cacheOptions,
  setHeaders: (res, path) => {
    // Archivos con hash (JS, CSS) - caché largo
    if (path.match(/\.(js|css)$/) && path.includes('-')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Imágenes - caché largo
    else if (path.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // HTML - caché corto
    else if (path.match(/\.html$/)) {
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
  
  // Verificar si existe la página estática
  if (fs.existsSync(staticPagePath)) {
    console.log(`📄 Sirviendo página estática para noticia ${newsId}`);
    res.sendFile(staticPagePath);
  } else {
    // Si no existe, servir la SPA
    console.log(`🔄 Redirigiendo a SPA para noticia ${newsId}`);
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

// Todas las demás rutas sirven la SPA
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📁 Sirviendo archivos estáticos desde: ${path.join(__dirname, 'dist')}`);
  console.log(`📄 Páginas estáticas de noticias desde: ${path.join(__dirname, 'public', 'noticia')}`);
});
