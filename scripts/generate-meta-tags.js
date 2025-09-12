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

// Función para generar meta tags HTML
function generateMetaTags(news) {
  const title = `${news.title} - Arauca Noticias`;
  const description = news.excerpt || news.content?.substring(0, 160) || 'Mantente informado con las últimas noticias y acontecimientos';
  
  // Obtener imagen principal
  let image = 'https://araucanoticias.com.co/logo-aruca.png';
  if (news.gallery && news.gallery.length > 0) {
    const mainImage = news.gallery.find(img => img.is_main) || news.gallery[0];
    if (mainImage.large_url) {
      image = mainImage.large_url;
    }
  } else if (news.image_url || news.image) {
    image = news.image_url || news.image;
  }
  
  const url = `https://araucanoticias.com.co/noticia/${news.id}`;
  
  return `
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
  <meta name="theme-color" content="#1e40af">`;
}

// Función principal
async function generateMetaTagsForNews() {
  try {
    console.log('🔄 Obteniendo lista de noticias...');
    
    // Obtener lista de noticias
    const newsList = await makeRequest('https://barnoticias-production.up.railway.app/api/v1/news?limit=50');
    
    if (!newsList.success || !newsList.data) {
      throw new Error('No se pudieron obtener las noticias');
    }
    
    console.log(`📰 Encontradas ${newsList.data.length} noticias`);
    
    // Crear directorio para meta tags
    const metaDir = path.join(__dirname, '..', 'public', 'meta');
    if (!fs.existsSync(metaDir)) {
      fs.mkdirSync(metaDir, { recursive: true });
    }
    
    // Generar meta tags para cada noticia
    for (const news of newsList.data) {
      console.log(`📝 Generando meta tags para: ${news.title}`);
      
      const metaTags = generateMetaTags(news);
      const metaFile = path.join(metaDir, `noticia-${news.id}.html`);
      
      fs.writeFileSync(metaFile, metaTags);
    }
    
    console.log('✅ Meta tags generados exitosamente');
    console.log(`📁 Archivos guardados en: ${metaDir}`);
    
  } catch (error) {
    console.error('❌ Error generando meta tags:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  generateMetaTagsForNews();
}

module.exports = { generateMetaTagsForNews, generateMetaTags };
