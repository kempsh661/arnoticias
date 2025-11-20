#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Función para hacer peticiones HTTPS con timeout
function makeRequest(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
    
    // Agregar timeout
    request.setTimeout(timeout, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Función para generar página HTML estática
function generateStaticPage(news) {
  const title = `${news.title} - Arauca Noticias`;
  const description = news.excerpt || news.content?.substring(0, 160) || 'Mantente informado con las últimas noticias y acontecimientos';
  
  // Obtener imagen principal optimizada para redes sociales (1200x630)
  let image = 'https://araucanoticias.com.co/logo-aruca.png';
  let imageNeedsProcessing = true;
  
  if (news.gallery && news.gallery.length > 0) {
    const mainImage = news.gallery.find(img => img.is_main) || news.gallery[0];
    // Priorizar social_url para redes sociales (1200x630) - ya viene optimizada
    if (mainImage.social_url) {
      image = mainImage.social_url;
      imageNeedsProcessing = false; // Ya está optimizada, no procesar
    } else if (mainImage.cloudinary_secure_url) {
      // Si está en Cloudinary, extraer el public_id y generar URL optimizada
      image = mainImage.cloudinary_secure_url;
    } else if (mainImage.large_url) {
      image = mainImage.large_url;
    } else if (mainImage.medium_url) {
      image = mainImage.medium_url;
    } else if (mainImage.optimized_url) {
      image = mainImage.optimized_url;
    }
  } else if (news.image_url || news.image) {
    image = news.image_url || news.image;
  }

  // Optimizar imagen para WhatsApp y Facebook (1200x630 - formato óptimo)
  // Solo procesar si la imagen no viene ya optimizada (social_url)
  if (imageNeedsProcessing && image.includes('cloudinary.com')) {
    // Extraer el public_id de la URL de Cloudinary
    // Formato: https://res.cloudinary.com/{cloud}/image/upload/{transformations}/{public_id}
    // Ejemplo: https://res.cloudinary.com/du8kmvlpm/image/upload/w_400,h_300,c_fill,q_80/news/69/news/69/images/temp_1763587731_0
    // El public_id puede contener slashes, así que extraemos todo después de /upload/
    const uploadIndex = image.indexOf('/image/upload/');
    if (uploadIndex !== -1) {
      const afterUpload = image.substring(uploadIndex + '/image/upload/'.length);
      // Las transformaciones están antes del primer slash que no es parte de una transformación
      // Las transformaciones son como: w_400,h_300,c_fill,q_80
      // El public_id es todo lo que viene después de las transformaciones y su slash
      // Si hay un slash, todo después del primer segmento es el public_id
      const parts = afterUpload.split('/');
      if (parts.length > 1) {
        // Hay transformaciones: el primer segmento son las transformaciones, el resto es el public_id
        const publicId = parts.slice(1).join('/');
        const baseUrl = image.substring(0, uploadIndex + '/image/upload/'.length);
        // Formato óptimo para WhatsApp, Facebook, Twitter: 1200x630
        image = `${baseUrl}w_1200,h_630,c_fill,f_auto,q_auto/${publicId}`;
      } else {
        // No hay transformaciones o el public_id no tiene slashes
        // Intentar extraer el public_id de otra forma
        const publicIdMatch = afterUpload.match(/^(?:[^\/]+\/)?(.+)$/);
        if (publicIdMatch) {
          const publicId = publicIdMatch[1];
          const baseUrl = image.substring(0, uploadIndex + '/image/upload/'.length);
          image = `${baseUrl}w_1200,h_630,c_fill,f_auto,q_auto/${publicId}`;
        } else {
          console.warn(`⚠️  No se pudo extraer public_id de URL de Cloudinary: ${image}`);
        }
      }
    } else {
      console.warn(`⚠️  URL de Cloudinary con formato inesperado: ${image}`);
    }
  } else if (imageNeedsProcessing && image.includes('barnoticias-production.up.railway.app')) {
    // Para URLs del backend, solicitar dimensiones óptimas para redes sociales
    try {
      const url = new URL(image);
      url.searchParams.set('width', '1200');
      url.searchParams.set('height', '630');
      url.searchParams.set('quality', '85');
      image = url.toString();
    } catch (e) {
      console.warn('Error procesando URL del backend:', e.message);
    }
  }

  // Asegurar que la URL sea absoluta
  if (image && !image.startsWith('http://') && !image.startsWith('https://')) {
    image = image.startsWith('/')
      ? `https://araucanoticias.com.co${image}`
      : `https://araucanoticias.com.co/${image}`;
  }
  
  const url = `https://araucanoticias.com.co/noticia/${news.id}`;
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="author" content="Arauca Noticias">
  <meta name="publisher" content="Arauca Noticias">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:alt" content="${title}">
  <meta property="og:site_name" content="Arauca Noticias">
  <meta property="og:locale" content="es_CO">
  
  <!-- Twitter Card -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${url}">
  <meta property="twitter:title" content="${title}">
  <meta property="twitter:description" content="${description}">
  <meta property="twitter:image" content="${image}">
  <meta property="twitter:image:alt" content="${title}">
  <meta property="twitter:site" content="@AraucaNoticias">
  <meta property="twitter:creator" content="@AraucaNoticias">
  
  <!-- Meta tags adicionales -->
  <meta name="twitter:domain" content="araucanoticias.com.co">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#1e40af">
  <meta name="format-detection" content="telephone=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Arauca Noticias">
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" href="/favicon.png">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- No redirect needed - only bots will see this page -->
</head>
<body>
  <!-- Contenido solo para bots de redes sociales -->
  <div style="text-align: center; padding: 50px; font-family: Inter, sans-serif; max-width: 800px; margin: 0 auto;">
    <h1 style="color: #1e40af; margin-bottom: 20px;">${news.title}</h1>
    <p style="font-size: 18px; line-height: 1.6; margin-bottom: 30px; color: #374151;">${description}</p>
    <img src="${image}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 30px;">
    <p style="margin-top: 30px;"><a href="/noticia/${news.id}" style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Ver noticia completa</a></p>
  </div>
</body>
</html>`;
}

// Función para escribir archivo de forma asíncrona
function writeFileAsync(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, 'utf8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Función para procesar en paralelo con límite de concurrencia
async function processInParallel(items, processor, concurrency = 10) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  return results;
}

// Función principal
async function generateStaticPages() {
  try {
    console.log('🔄 Obteniendo lista de noticias...');
    
    // Obtener todas las noticias (manejar paginación)
    // Aumentar límite por página para reducir número de peticiones
    let allNews = [];
    let currentPage = 1;
    let hasMorePages = true;
    const maxRetries = 2;
    const itemsPerPage = 100; // Aumentado de 50 a 100 para menos peticiones
    
    while (hasMorePages) {
      console.log(`📄 Obteniendo página ${currentPage}...`);
      
      let response = null;
      let lastError = null;
      
      // Intentar con reintentos (reducir timeout y tiempo de espera)
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          response = await makeRequest(`https://barnoticias-production.up.railway.app/api/v1/news?page=${currentPage}&limit=${itemsPerPage}`, 8000);
          break; // Éxito, salir del loop de reintentos
        } catch (error) {
          lastError = error;
          console.warn(`⚠️  Intento ${attempt}/${maxRetries} falló: ${error.message}`);
          if (attempt < maxRetries) {
            // Reducir tiempo de espera
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      // Si no se pudo obtener la respuesta después de todos los reintentos
      if (!response) {
        console.warn('⚠️  No se pudo conectar con la API después de varios intentos');
        console.warn('⚠️  Motivo:', lastError?.message || 'Error desconocido');
        
        // Verificar si ya existen páginas estáticas
        const staticDir = path.join(__dirname, '..', 'public', 'noticia');
        const distDir = path.join(__dirname, '..', 'dist', 'noticia');
        
        if (fs.existsSync(staticDir)) {
          const existingFiles = fs.readdirSync(staticDir).filter(f => f.endsWith('.html'));
          console.log(`ℹ️  Se encontraron ${existingFiles.length} páginas estáticas existentes en public/noticia`);
        }
        
        if (fs.existsSync(distDir)) {
          const existingFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));
          console.log(`ℹ️  Se encontraron ${existingFiles.length} páginas estáticas existentes en dist/noticia`);
        }
        
        console.log('⚠️  Continuando sin generar nuevas páginas estáticas...');
        console.log('ℹ️  Las páginas se pueden generar después del despliegue con el auto-regenerate');
        return; // Salir sin error
      }
      
      if (!response.success || !response.data) {
        console.warn(`⚠️  Respuesta inválida de la API en la página ${currentPage}`);
        break;
      }
      
      allNews = allNews.concat(response.data);
      
      // Verificar si hay más páginas
      hasMorePages = response.meta && response.meta.has_more_pages;
      currentPage++;
      
      // Límite de seguridad para evitar bucles infinitos
      if (currentPage > 100) {
        console.warn('⚠️  Se alcanzó el límite máximo de páginas (100)');
        break;
      }
    }
    
    if (allNews.length === 0) {
      console.warn('⚠️  No se encontraron noticias para generar páginas estáticas');
      return;
    }
    
    console.log(`📰 Encontradas ${allNews.length} noticias en total`);
    
    // Crear directorio para páginas estáticas
    const staticDir = path.join(__dirname, '..', 'public', 'noticia');
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }
    
    // Generar páginas estáticas en paralelo (procesamiento por lotes)
    console.log(`⚡ Generando ${allNews.length} páginas estáticas en paralelo...`);
    const startTime = Date.now();
    
    await processInParallel(allNews, async (news) => {
      const staticPage = generateStaticPage(news);
      const pageFile = path.join(staticDir, `${news.id}.html`);
      await writeFileAsync(pageFile, staticPage);
      return news.id;
    }, 20); // Procesar 20 archivos en paralelo
    
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Páginas estáticas generadas exitosamente en ${elapsedTime}s`);
    console.log(`📁 Archivos guardados en: ${staticDir}`);
    
  } catch (error) {
    console.error('❌ Error inesperado generando páginas estáticas:', error.message);
    console.error('⚠️  Continuando sin generar páginas estáticas...');
    // No llamar a process.exit(1) para permitir que el build continúe
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  generateStaticPages();
}

module.exports = { generateStaticPages, generateStaticPage };
