#!/usr/bin/env node

/**
 * Script para regenerar las 2 últimas noticias en producción
 * Uso: node scripts/regenerate-latest-2.js
 */

const { generateStaticPages } = require('./generate-static-pages.js');

console.log('🔄 Regenerando páginas estáticas para las 2 últimas noticias...');

generateStaticPages(2)
  .then(() => {
    console.log('✅ Regeneración completada exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en la regeneración:', error.message);
    process.exit(1);
  });

