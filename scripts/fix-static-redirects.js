const fs = require('fs');
const path = require('path');

const noticiaDir = path.join(__dirname, 'public', 'noticia');

// Función para actualizar una página HTML
function updateHtmlFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar el script de redirección actual (ambos formatos)
    const redirectScriptRegex = /<!-- Redirect to SPA -->\s*<script>\s*\/\/ Redirigir a la SPA después de que los meta tags sean leídos\s*setTimeout\(\(\) => \{\s*window\.location\.href = '\/[#]?\/?noticia\/\d+';/g;
    
    if (redirectScriptRegex.test(content)) {
      // Extraer el ID de la noticia del archivo
      const fileName = path.basename(filePath, '.html');
      const newsId = fileName;
      
      // Nuevo script con detección de bots
      const newScript = `  <!-- Redirect to SPA -->
  <script>
    // Solo redirigir si no estamos en un bot o crawler de redes sociales
    const isBot = /bot|crawler|spider|crawling/i.test(navigator.userAgent) || 
                  /facebookexternalhit|twitterbot|linkedinbot|whatsapp/i.test(navigator.userAgent);
    
    if (!isBot) {
      // Redirigir a la SPA después de que los meta tags sean leídos
      setTimeout(() => {
        window.location.href = '/noticia/${newsId}';
      }, 100);
    }
  </script>`;
      
      // Reemplazar el script existente
      content = content.replace(
        /<!-- Redirect to SPA -->\s*<script>[\s\S]*?<\/script>/,
        newScript
      );
      
      // Escribir el archivo actualizado
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Actualizado: ${filePath}`);
      return true;
    } else {
      console.log(`⚠️  No se encontró script de redirección en: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error actualizando ${filePath}:`, error.message);
    return false;
  }
}

// Función principal
function fixAllStaticPages() {
  console.log('🔧 Iniciando corrección de páginas estáticas...');
  
  if (!fs.existsSync(noticiaDir)) {
    console.error('❌ Directorio de noticias no encontrado:', noticiaDir);
    return;
  }
  
  const files = fs.readdirSync(noticiaDir);
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  
  console.log(`📁 Encontrados ${htmlFiles.length} archivos HTML`);
  
  let updatedCount = 0;
  
  htmlFiles.forEach(file => {
    const filePath = path.join(noticiaDir, file);
    if (updateHtmlFile(filePath)) {
      updatedCount++;
    }
  });
  
  console.log(`\n🎉 Proceso completado:`);
  console.log(`   - Archivos procesados: ${htmlFiles.length}`);
  console.log(`   - Archivos actualizados: ${updatedCount}`);
  console.log(`   - Archivos sin cambios: ${htmlFiles.length - updatedCount}`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixAllStaticPages();
}

module.exports = { fixAllStaticPages, updateHtmlFile };