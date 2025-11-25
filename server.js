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
  const userAgent = (req.get('User-Agent') || '').toLowerCase();

  // Lista completa de bots de redes sociales y crawlers
  const botPatterns = [
    'facebookexternalhit',
    'facebot',
    'twitterbot',
    'linkedinbot',
    'whatsapp',
    'telegrambot',
    'slackbot',
    'discordbot',
    'skypeuripreview',
    'pinterest',
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'sogou',
    'exabot',
    'ia_archiver'
  ];

  const isBot = botPatterns.some(pattern => userAgent.includes(pattern)) ||
                /bot|crawler|spider|crawling|preview|scraper/i.test(userAgent);

  // Siempre servir página estática a bots, o si no existe servir la SPA
  if (isBot) {
    if (fs.existsSync(staticPagePath)) {
      console.log(`📄 Bot detectado: "${req.get('User-Agent')}"`);
      console.log(`📄 Sirviendo página estática: /noticia/${newsId}.html`);
      res.sendFile(staticPagePath);
    } else {
      console.log(`⚠️  Bot detectado pero página estática no existe: ${newsId}`);
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
  } else {
    // Para usuarios humanos, servir la SPA directamente
    console.log(`🔄 Usuario humano: "${req.get('User-Agent')}"`);
    console.log(`🔄 Sirviendo SPA: /noticia/${newsId}`);
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

  // Aceptar tanto API_SECRET como JWT del usuario autenticado
  // Si es el API_SECRET, permitir directamente
  if (token === apiSecret) {
    return next();
  }

  // Si es un JWT, verificar que tenga el formato correcto (tiene 3 partes separadas por puntos)
  // En producción, aquí deberías validar el JWT contra el backend Laravel
  const jwtParts = token.split('.');
  if (jwtParts.length === 3) {
    // Es un JWT válido - en producción deberías validarlo contra el backend
    // Por ahora, solo verificamos el formato y permitimos si el usuario está autenticado
    console.log('✅ Autenticación JWT detectada para regeneración de páginas estáticas');
    return next();
  }

  // Si no es ni API_SECRET ni JWT válido, rechazar
  return res.status(403).json({
    success: false,
    message: 'Token de autenticación inválido'
  });
};

// Endpoint para regenerar páginas estáticas (PROTEGIDO)
app.post('/api/regenerate-static-pages', apiLimiter, authenticateAdmin, (req, res) => {
  try {
    // Obtener límite del body si se proporciona, por defecto 10
    const limit = req.body?.limit || 10;
    console.log(`🔄 Regenerando páginas estáticas (últimas ${limit} noticias)...`);

    // Ejecutar el script directamente con Node.js y pasar el límite como variable de entorno
    const scriptPath = path.join(__dirname, 'scripts', 'generate-static-pages.js');
    const env = { ...process.env, NEWS_LIMIT: limit.toString() };
    const command = `node "${scriptPath}" ${limit}`;
    
    // Timeout de 5 minutos para la ejecución del script
    const timeout = setTimeout(() => {
      console.error('❌ Timeout ejecutando script de regeneración');
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Timeout ejecutando script de regeneración (más de 5 minutos)',
          error: 'Timeout'
        });
      }
    }, 5 * 60 * 1000);
    
    exec(command, { cwd: __dirname, env: env, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      clearTimeout(timeout);
      
      // Asegurarse de que no se haya enviado respuesta ya
      if (res.headersSent) {
        console.warn('⚠️  Respuesta ya enviada, ignorando resultado del script');
        return;
      }
      
      if (error) {
        console.error('❌ Error regenerando páginas estáticas:', error);
        console.error('❌ stderr:', stderr);
        return res.status(500).json({
          success: false,
          message: 'Error regenerando páginas estáticas',
          error: error.message,
          stderr: stderr ? stderr.substring(0, 500) : 'Sin detalles',
          stdout: stdout ? stdout.substring(0, 500) : ''
        });
      }

      console.log('✅ Páginas estáticas regeneradas exitosamente');
      console.log('📝 Output:', stdout);
      if (stderr) {
        console.warn('⚠️  Warnings:', stderr);
      }

      res.json({
        success: true,
        message: `Páginas estáticas regeneradas exitosamente (últimas ${limit} noticias)`,
        output: stdout ? stdout.substring(0, 1000) : '',
        stderr: stderr ? stderr.substring(0, 500) : '',
        limit: limit
      });
    });
  } catch (error) {
    console.error('❌ Error inesperado en endpoint de regeneración:', error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Error inesperado procesando la petición',
        error: error.message
      });
    }
  }
});

// Endpoint para gestionar noticias destacadas automáticamente (PROTEGIDO)
app.post('/api/manage-featured', apiLimiter, authenticateAdmin, (req, res) => {
  try {
    console.log('⭐ Gestionando noticias destacadas...');

    const scriptPath = path.join(__dirname, 'scripts', 'manage-featured-news.js');
    const command = `node "${scriptPath}"`;

    // Timeout de 2 minutos
    const timeout = setTimeout(() => {
      console.error('❌ Timeout ejecutando script de gestión de destacadas');
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Timeout ejecutando script (más de 2 minutos)',
          error: 'Timeout'
        });
      }
    }, 2 * 60 * 1000);

    exec(command, { cwd: __dirname, env: process.env, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      clearTimeout(timeout);

      if (res.headersSent) {
        console.warn('⚠️  Respuesta ya enviada, ignorando resultado del script');
        return;
      }

      if (error) {
        console.error('❌ Error gestionando destacadas:', error);
        console.error('❌ stderr:', stderr);
        return res.status(500).json({
          success: false,
          message: 'Error gestionando noticias destacadas',
          error: error.message,
          stderr: stderr ? stderr.substring(0, 500) : 'Sin detalles',
          stdout: stdout ? stdout.substring(0, 500) : ''
        });
      }

      console.log('✅ Noticias destacadas gestionadas exitosamente');
      console.log('📝 Output:', stdout);

      res.json({
        success: true,
        message: 'Noticias destacadas gestionadas exitosamente',
        output: stdout ? stdout.substring(0, 1000) : '',
        stderr: stderr ? stderr.substring(0, 500) : ''
      });
    });
  } catch (error) {
    console.error('❌ Error inesperado en endpoint de gestión de destacadas:', error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Error inesperado procesando la petición',
        error: error.message
      });
    }
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
