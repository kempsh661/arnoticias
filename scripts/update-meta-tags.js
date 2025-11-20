#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script para actualizar las meta tags de Open Graph en páginas estáticas existentes
 * Actualiza las dimensiones de imágenes de 400x400 a 1200x630 (óptimo para WhatsApp/Facebook)
 */

const staticDir = path.join(__dirname, '..', 'public', 'noticia');

// Verificar que existe el directorio
if (!fs.existsSync(staticDir)) {
  console.error('❌ No se encontró el directorio:', staticDir);
  process.exit(1);
}

// Leer todos los archivos HTML
const files = fs.readdirSync(staticDir).filter(f => f.endsWith('.html'));

console.log(`🔄 Actualizando ${files.length} páginas estáticas...`);
console.log('');

let updatedCount = 0;
let errorCount = 0;

files.forEach((file) => {
  try {
    const filePath = path.join(staticDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Guardar contenido original para comparar
    const originalContent = content;

    // 1. Actualizar dimensiones de 400x400 a 1200x630
    content = content.replace(
      /<meta property="og:image:width" content="400">/g,
      '<meta property="og:image:width" content="1200">'
    );
    content = content.replace(
      /<meta property="og:image:height" content="400">/g,
      '<meta property="og:image:height" content="630">'
    );

    // También corregir si ya se cambió a 1200 por error
    content = content.replace(
      /<meta property="og:image:height" content="1200">/g,
      '<meta property="og:image:height" content="630">'
    );

    // 2. Actualizar URLs de Cloudinary para usar 1200x630
    content = content.replace(
      /cloudinary\.com\/[^\/]+\/image\/upload\/w_400,h_400,c_fill,f_auto,q_\d+\//g,
      (match) => {
        return match.replace('w_400,h_400,c_fill,f_auto,q_60', 'w_1200,h_630,c_fill,f_auto,q_auto');
      }
    );

    // 3. Agregar og:image:secure_url si no existe
    if (!content.includes('og:image:secure_url')) {
      // Buscar la línea og:image y extraer la URL
      const ogImageMatch = content.match(/<meta property="og:image" content="([^"]+)">/);
      if (ogImageMatch) {
        const imageUrl = ogImageMatch[1];
        const ogImageLine = ogImageMatch[0];

        // Insertar og:image:secure_url después de og:image
        const secureUrlTag = `  <meta property="og:image:secure_url" content="${imageUrl}">`;
        content = content.replace(
          ogImageLine,
          ogImageLine + '\n' + secureUrlTag
        );
      }
    }

    // 4. Actualizar también las imágenes en el body si existen
    content = content.replace(
      /(<img src="https:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload\/)w_400,h_400,c_fill,f_auto,q_\d+\//g,
      '$1w_1200,h_630,c_fill,f_auto,q_auto/'
    );

    // Solo escribir si hubo cambios
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Actualizado: ${file}`);
      updatedCount++;
    } else {
      console.log(`⏭️  Sin cambios: ${file}`);
    }

  } catch (error) {
    console.error(`❌ Error procesando ${file}:`, error.message);
    errorCount++;
  }
});

console.log('');
console.log('='.repeat(50));
console.log(`✅ Páginas actualizadas: ${updatedCount}`);
console.log(`⏭️  Páginas sin cambios: ${files.length - updatedCount - errorCount}`);
console.log(`❌ Errores: ${errorCount}`);
console.log('='.repeat(50));

// También copiar a dist/ si existe
const distDir = path.join(__dirname, '..', 'dist', 'noticia');
if (fs.existsSync(distDir)) {
  console.log('');
  console.log('📁 Copiando páginas actualizadas a dist/noticia/...');

  files.forEach((file) => {
    const srcPath = path.join(staticDir, file);
    const destPath = path.join(distDir, file);
    try {
      fs.copyFileSync(srcPath, destPath);
    } catch (error) {
      console.error(`❌ Error copiando ${file} a dist:`, error.message);
    }
  });

  console.log('✅ Archivos copiados a dist/noticia/');
}

console.log('');
console.log('🎉 Proceso completado!');
