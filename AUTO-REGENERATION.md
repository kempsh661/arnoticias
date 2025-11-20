# 🔄 Regeneración Automática de Páginas Estáticas

Este documento explica cómo configurar la regeneración automática de páginas estáticas para que cuando se suba una nueva noticia, se generen automáticamente las páginas para SEO y redes sociales.

## 🚀 Funcionamiento Automático

### 1. Regeneración Inmediata (Recomendado)
Cuando se crea o edita una noticia desde el panel de administración, se ejecuta automáticamente la regeneración de páginas estáticas.

**¿Cómo funciona?**
- Al guardar una noticia exitosamente, se llama al endpoint `/api/regenerate-static-pages`
- Este endpoint ejecuta `npm run generate-meta` en el servidor
- Se regeneran todas las páginas estáticas con la nueva información

### 2. Cron Job de Respaldo (Opcional)
Para asegurar que las páginas estén siempre actualizadas, puedes configurar un cron job que se ejecute periódicamente.

## ⚙️ Configuración del Cron Job

### En Railway (Recomendado)
Railway no soporta cron jobs directamente, pero puedes usar un servicio externo como:

1. **Cron-job.org** (Gratuito)
   - URL: `https://tu-dominio.com/api/regenerate-static-pages`
   - Método: POST
   - Frecuencia: Cada 30 minutos

2. **Uptime Robot** (Gratuito)
   - Configurar como "HTTP(s)" check
   - URL: `https://tu-dominio.com/api/regenerate-static-pages`
   - Método: POST
   - Intervalo: 30 minutos

### En VPS/Servidor propio
```bash
# Editar crontab
crontab -e

# Agregar línea para ejecutar cada 30 minutos
*/30 * * * * cd /ruta/a/tu/proyecto && npm run auto-regenerate
```

## 🔧 Comandos Disponibles

```bash
# Regenerar páginas estáticas manualmente
npm run generate-meta

# Regenerar con script automático (para cron)
npm run auto-regenerate

# Llamar al endpoint del servidor
curl -X POST https://tu-dominio.com/api/regenerate-static-pages
```

## 📋 Verificación

Para verificar que funciona correctamente:

1. **Crear una nueva noticia** desde el panel de administración
2. **Verificar en los logs** del servidor que aparezca:
   ```
   🔄 Regenerando páginas estáticas...
   ✅ Páginas estáticas regeneradas exitosamente
   ```
3. **Probar compartir** la noticia en WhatsApp/Facebook
4. **Verificar** que se muestre la imagen y descripción correctamente

## 🐛 Solución de Problemas

### Si no se regeneran automáticamente:
1. Verificar que el servidor esté ejecutándose
2. Revisar los logs del servidor para errores
3. Ejecutar manualmente: `npm run generate-meta`

### Si las páginas estáticas no se actualizan:
1. Verificar que el endpoint `/api/regenerate-static-pages` responda
2. Revisar permisos de escritura en la carpeta `public/noticia/`
3. Verificar conexión con la API del backend

## 📊 Monitoreo

Los logs del servidor mostrarán:
- `🔄 Regenerando páginas estáticas...` - Inicio del proceso
- `✅ Páginas estáticas regeneradas exitosamente` - Éxito
- `❌ Error regenerando páginas estáticas` - Error (revisar logs)

## 🎯 Beneficios

- ✅ **SEO mejorado**: Las páginas estáticas se actualizan automáticamente
- ✅ **Redes sociales**: WhatsApp, Facebook, Twitter muestran información correcta
- ✅ **Sin intervención manual**: Todo es automático
- ✅ **Respaldo**: Cron job asegura que siempre estén actualizadas





