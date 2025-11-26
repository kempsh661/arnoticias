#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Crear instancia de axios con configuración optimizada
const api = axios.create({
  timeout: 60000, // 60 segundos
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; StaticPageGenerator/1.0)',
    'Accept': 'application/json'
  },
  maxRedirects: 5,
  validateStatus: (status) => status < 500
});

// Función para generar página HTML estática (igual que en generate-static-pages.js)
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
      imageNeedsProcessing = false; // Ya viene optimizada para redes sociales
    } else if (mainImage.cloudinary_secure_url) {
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

  // IMPORTANTE: WhatsApp NO soporta WebP en Open Graph
  // Asegurar que todas las imágenes de Cloudinary usen JPEG para compatibilidad con WhatsApp
  if (image.includes('cloudinary.com')) {
    // Si la imagen tiene f_webp o f_auto, reemplazarla por f_jpg
    if (image.includes('f_webp') || image.includes('f_auto')) {
      image = image.replace(/f_(webp|auto)/g, 'f_jpg');
    }
    
    // Si la imagen necesita procesamiento (no es social_url), optimizarla
    if (imageNeedsProcessing) {
      const uploadIndex = image.indexOf('/image/upload/');
      if (uploadIndex !== -1) {
        const afterUpload = image.substring(uploadIndex + '/image/upload/'.length);
        const parts = afterUpload.split('/');
        
        // Extraer publicId (última parte)
        const publicId = parts.length > 0 ? parts[parts.length - 1] : null;
        
        if (publicId) {
          const baseUrl = image.substring(0, uploadIndex + '/image/upload/'.length);
          // Reconstruir URL con dimensiones y formato correctos para redes sociales
          image = `${baseUrl}w_1200,h_630,c_fill,f_jpg,q_90/${publicId}`;
        }
      }
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

// Función principal
async function generateStaticPages(limit = null) {
  try {
    const newsLimit = limit || 10;
    console.log(`🔄 Obteniendo últimas ${newsLimit} noticias...`);

    // Obtener noticias de la API con axios
    const response = await api.get('https://barnoticias-production.up.railway.app/api/v1/news', {
      params: {
        page: 1,
        per_page: newsLimit
      }
    });

    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Respuesta inválida de la API');
    }

    const allNews = response.data.data;
    console.log(`📰 Procesando ${allNews.length} noticias`);

    // Crear directorios
    const staticDir = path.join(__dirname, '..', 'public', 'noticia');
    const distDir = path.join(__dirname, '..', 'dist', 'noticia');

    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Generar páginas
    console.log(`⚡ Generando ${allNews.length} páginas estáticas...`);
    let generatedCount = 0;

    for (const news of allNews) {
      try {
        const staticPage = generateStaticPage(news);
        const pageFile = path.join(staticDir, `${news.id}.html`);
        const distPageFile = path.join(distDir, `${news.id}.html`);

        fs.writeFileSync(pageFile, staticPage, 'utf8');
        fs.writeFileSync(distPageFile, staticPage, 'utf8');

        generatedCount++;
        console.log(`  ✅ Generada noticia ${news.id}: ${news.title.substring(0, 50)}...`);
      } catch (err) {
        console.error(`  ❌ Error generando noticia ${news.id}:`, err.message);
      }
    }

    console.log(`\n✅ ${generatedCount} páginas generadas exitosamente`);
    console.log(`📁 Archivos guardados en:`);
    console.log(`   - ${staticDir}`);
    console.log(`   - ${distDir}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Ejecutar
const limit = process.argv[2] ? parseInt(process.argv[2]) : 10;
generateStaticPages(limit);
