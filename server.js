const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const { exec } = require('child_process');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware para parsear JSON
app.use(express.json());

// Middleware de compresión
app.use(compression());

// Helmet para headers de seguridad mejorados
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://barnoticias-production.up.railway.app"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://www.facebook.com", "https://player.vimeo.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por IP
  message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde',
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting estricto para API endpoints sensibles
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // Solo 5 peticiones por hora
  message: 'Límite de regeneración excedido, intente en 1 hora',
  standardHeaders: true,
  legacyHeaders: false
});

app.use(globalLimiter);

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

// Middleware de autenticación para endpoints administrativos
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const apiSecret = process.env.API_SECRET || 'change-me-in-production';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No se proporcionó token de autenticación'
    });
  }

  const token = authHeader.substring(7);

  if (token !== apiSecret) {
    return res.status(403).json({
      success: false,
      message: 'Token de autenticación inválido'
    });
  }

  next();
};

// Endpoint para regenerar páginas estáticas (PROTEGIDO)
app.post('/api/regenerate-static-pages', apiLimiter, authenticateAdmin, (req, res) => {
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
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📁 Sirviendo archivos estáticos desde: ${path.join(__dirname, 'dist')}`);
  console.log(`📄 Páginas estáticas de noticias desde: ${path.join(__dirname, 'public', 'noticia')}`);
});
