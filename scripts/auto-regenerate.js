#!/usr/bin/env node

/**
 * Script para regenerar automáticamente las páginas estáticas
 * Se ejecuta como cron job para asegurar que las páginas estén actualizadas
 */

const { exec } = require('child_process');
const path = require('path');

console.log('🔄 [Auto-Regenerate] Iniciando regeneración automática de páginas estáticas...');

// Ejecutar el script de generación de meta tags
exec('npm run generate-meta', { cwd: __dirname + '/..' }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ [Auto-Regenerate] Error:', error.message);
    process.exit(1);
  }
  
  if (stderr) {
    console.error('⚠️ [Auto-Regenerate] Stderr:', stderr);
  }
  
  console.log('✅ [Auto-Regenerate] Páginas estáticas regeneradas exitosamente');
  console.log('📝 [Auto-Regenerate] Output:', stdout);
  
  process.exit(0);
});





