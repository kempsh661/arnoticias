#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Función para hacer peticiones HTTPS
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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
  });
}

// Función para generar página HTML estática
function generateStaticPage(news) {
  const title = `${news.title} - Arauca Noticias`;
  const description = news.excerpt || news.content?.substring(0, 160) || 'Mantente informado con las últimas noticias y acontecimientos';
  
  // Obtener imagen principal optimizada para redes sociales (1200x630)
  let image = 'https://araucanoticias.com.co/logo-aruca.png';
  if (news.gallery && news.gallery.length > 0) {
    const mainImage = news.gallery.find(img => img.is_main) || news.gallery[0];
    // Priorizar social_url para redes sociales (1200x630)
    if (mainImage.social_url) {
      image = mainImage.social_url;
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
  
  <!-- Redirect to SPA -->
  <script>
    // Redirigir a la SPA después de que los meta tags sean leídos
    setTimeout(() => {
      window.location.href = '/#/noticia/${news.id}';
    }, 100);
  </script>
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Inter, sans-serif; max-width: 800px; margin: 0 auto;">
    <h1 style="color: #1e40af; margin-bottom: 20px;">${news.title}</h1>
    <p style="font-size: 18px; line-height: 1.6; margin-bottom: 30px; color: #374151;">${description}</p>
    <img src="${image}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 30px;">
    <p style="margin-top: 30px;"><a href="/#/noticia/${news.id}" style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Ver noticia completa</a></p>
  </div>
</body>
</html>`;
}

// Función principal
async function generateStaticPages() {
  try {
    console.log('🔄 Obteniendo lista de noticias...');
    
    // Obtener lista de noticias
    const newsList = await makeRequest('https://barnoticias-production.up.railway.app/api/v1/news?limit=50');
    
    if (!newsList.success || !newsList.data) {
      throw new Error('No se pudieron obtener las noticias');
    }
    
    console.log(`📰 Encontradas ${newsList.data.length} noticias`);
    
    // Crear directorio para páginas estáticas
    const staticDir = path.join(__dirname, '..', 'public', 'noticia');
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }
    
    // Generar página estática para cada noticia
    for (const news of newsList.data) {
      console.log(`📝 Generando página estática para: ${news.title}`);
      
      const staticPage = generateStaticPage(news);
      const pageFile = path.join(staticDir, `${news.id}.html`);
      
      fs.writeFileSync(pageFile, staticPage);
    }
    
    console.log('✅ Páginas estáticas generadas exitosamente');
    console.log(`📁 Archivos guardados en: ${staticDir}`);
    
  } catch (error) {
    console.error('❌ Error generando páginas estáticas:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  generateStaticPages();
}

module.exports = { generateStaticPages, generateStaticPage };
