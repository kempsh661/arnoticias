#!/usr/bin/env node

const axios = require('axios');

// Configuración
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://barnoticias-production.up.railway.app/api/v1';
const AUTH_TOKEN = process.env.ADMIN_AUTH_TOKEN; // Token de administrador

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Agregar token si existe
if (AUTH_TOKEN) {
  api.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`;
}

/**
 * Gestiona automáticamente las noticias destacadas:
 * - Las últimas 10 noticias publicadas se marcan como destacadas
 * - El resto se desmarcan como destacadas
 */
async function manageFeaturedNews() {
  try {
    console.log('🔄 Gestionando noticias destacadas...\n');

    // 1. Obtener las últimas 10 noticias publicadas
    console.log('📰 Obteniendo últimas 10 noticias publicadas...');
    const latestResponse = await api.get('/news', {
      params: {
        page: 1,
        per_page: 10,
        status: 'published'
      }
    });

    if (!latestResponse.data || !latestResponse.data.success) {
      throw new Error('Error obteniendo noticias de la API');
    }

    const latestNews = latestResponse.data.data;
    const latestIds = latestNews.map(n => n.id);
    console.log(`  ✅ ${latestNews.length} noticias más recientes: ${latestIds.join(', ')}\n`);

    // 2. Obtener TODAS las noticias destacadas actuales
    console.log('⭐ Obteniendo noticias actualmente destacadas...');
    const featuredResponse = await api.get('/news', {
      params: {
        featured: true,
        per_page: 100 // Obtener todas las destacadas
      }
    });

    const currentFeatured = featuredResponse.data.data || [];
    const currentFeaturedIds = currentFeatured.map(n => n.id);
    console.log(`  ✅ ${currentFeatured.length} noticias actualmente destacadas: ${currentFeaturedIds.join(', ')}\n`);

    // 3. Calcular cambios necesarios
    const toFeature = latestIds.filter(id => !currentFeaturedIds.includes(id));
    const toUnfeature = currentFeaturedIds.filter(id => !latestIds.includes(id));

    console.log('📋 Cambios a realizar:');
    console.log(`  ➕ Marcar como destacadas: ${toFeature.length} noticias`);
    console.log(`  ➖ Desmarcar como destacadas: ${toUnfeature.length} noticias\n`);

    if (toFeature.length === 0 && toUnfeature.length === 0) {
      console.log('✅ No hay cambios necesarios. Todo está correcto.');
      return;
    }

    // 4. Marcar nuevas noticias como destacadas
    if (toFeature.length > 0) {
      console.log('➕ Marcando noticias como destacadas...');
      for (const newsId of toFeature) {
        try {
          await api.put(`/news/${newsId}`, {
            featured: true
          });
          console.log(`  ✅ Noticia ${newsId} marcada como destacada`);
        } catch (error) {
          console.error(`  ❌ Error marcando noticia ${newsId}:`, error.message);
        }
      }
      console.log('');
    }

    // 5. Desmarcar noticias que ya no deben estar destacadas
    if (toUnfeature.length > 0) {
      console.log('➖ Desmarcando noticias destacadas antiguas...');
      for (const newsId of toUnfeature) {
        try {
          await api.put(`/news/${newsId}`, {
            featured: false
          });
          console.log(`  ✅ Noticia ${newsId} desmarcada como destacada`);
        } catch (error) {
          console.error(`  ❌ Error desmarcando noticia ${newsId}:`, error.message);
        }
      }
      console.log('');
    }

    console.log('✅ Gestión de noticias destacadas completada exitosamente');
    console.log(`\n📊 Resumen:`);
    console.log(`   • ${toFeature.length} noticias marcadas como destacadas`);
    console.log(`   • ${toUnfeature.length} noticias desmarcadas`);
    console.log(`   • Total destacadas ahora: ${latestIds.length}`);

  } catch (error) {
    console.error('❌ Error gestionando noticias destacadas:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  manageFeaturedNews();
}

module.exports = { manageFeaturedNews };
