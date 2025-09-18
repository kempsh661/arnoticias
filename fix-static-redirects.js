#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const noticiaDir = path.join(__dirname, 'public', 'noticia');

console.log('🔧 Corrigiendo redirecciones en páginas estáticas...');

// Leer todos los archivos HTML en el directorio noticia
fs.readdir(noticiaDir, (err, files) => {
  if (err) {
    console.error('❌ Error leyendo directorio:', err);
    return;
  }

  const htmlFiles = files.filter(file => file.endsWith('.html'));
  console.log(`📄 Encontrados ${htmlFiles.length} archivos HTML`);

  let fixedCount = 0;

  htmlFiles.forEach(file => {
    const filePath = path.join(noticiaDir, file);
    const newsId = file.replace('.html', '');
    
    try {
      // Leer el contenido del archivo
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Reemplazar las redirecciones con hash por redirecciones sin hash
      const oldRedirect = `window.location.href = '/#/noticia/${newsId}';`;
      const newRedirect = `window.location.href = '/noticia/${newsId}';`;
      
      const oldLink = `href="/#/noticia/${newsId}"`;
      const newLink = `href="/noticia/${newsId}"`;
      
      if (content.includes(oldRedirect) || content.includes(oldLink)) {
        content = content.replace(oldRedirect, newRedirect);
        content = content.replace(oldLink, newLink);
        
        // Escribir el archivo corregido
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Corregido: ${file}`);
        fixedCount++;
      } else {
        console.log(`⏭️  Sin cambios: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error procesando ${file}:`, error.message);
    }
  });

  console.log(`\n🎉 Proceso completado. ${fixedCount} archivos corregidos.`);
});

