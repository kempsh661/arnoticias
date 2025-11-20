# 🔄 Regenerar Páginas Estáticas en Producción

Este documento explica cómo regenerar todas las páginas estáticas existentes en producción después de corregir el script de generación.

## 🎯 Objetivo

Regenerar las 34 páginas estáticas existentes con las correcciones aplicadas para que las vistas previas en WhatsApp y Facebook funcionen correctamente.

## 📋 Opciones para Regenerar

### Opción 1: Usar el Endpoint del Servidor (Recomendado)

Una vez que el código esté desplegado en producción, puedes regenerar todas las páginas usando el endpoint protegido:

```bash
curl -X POST https://araucanoticias.com.co/api/regenerate-static-pages \
  -H "Authorization: Bearer TU_API_SECRET" \
  -H "Content-Type: application/json"
```

**Nota:** Reemplaza `TU_API_SECRET` con el valor de la variable de entorno `API_SECRET` configurada en Railway.

### Opción 2: Desde el Panel de Administración

Si el panel de administración tiene un botón para regenerar páginas estáticas, úsalo después de desplegar los cambios.

### Opción 3: Ejecutar Manualmente en el Servidor

Si tienes acceso SSH al servidor de Railway:

1. Conectarte al servidor
2. Navegar al directorio del proyecto
3. Ejecutar:
   ```bash
   npm run generate-meta
   ```

### Opción 4: Forzar Regeneración desde el Código

El script se ejecutará automáticamente cuando:
- Se cree una nueva noticia
- Se edite una noticia existente
- Se ejecute el endpoint `/api/regenerate-static-pages`

## 🔍 Verificación

Después de regenerar, verifica que las páginas se hayan actualizado:

1. **Revisar una página estática:**
   ```bash
   curl https://araucanoticias.com.co/noticia/34
   ```

2. **Verificar los meta tags:**
   - Buscar `og:image` en el HTML
   - Verificar que la URL de la imagen sea correcta (sin paths duplicados)
   - Verificar que tenga dimensiones 1200x630

3. **Probar en WhatsApp:**
   - Compartir la URL de una noticia
   - Verificar que se muestre la imagen y descripción

4. **Probar en Facebook:**
   - Usar el [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - Pegar la URL de una noticia
   - Verificar que se muestre correctamente

## 🚨 Solución de Problemas

### Si el endpoint no funciona:

1. Verificar que el servidor esté ejecutándose
2. Verificar que la variable `API_SECRET` esté configurada en Railway
3. Revisar los logs del servidor para errores

### Si las páginas no se regeneran:

1. Verificar permisos de escritura en `public/noticia/`
2. Verificar conexión con la API del backend
3. Revisar los logs del script de generación

### Si las imágenes siguen sin mostrarse:

1. Verificar que las URLs de Cloudinary sean accesibles
2. Verificar que las imágenes existan en Cloudinary
3. Usar el Facebook Debugger para limpiar el caché de Facebook

## 📝 Notas Importantes

- **Caché de Redes Sociales:** WhatsApp y Facebook cachean las vistas previas. Puede tomar unos minutos en actualizarse.
- **Tiempo de Procesamiento:** Regenerar 34 páginas puede tomar 1-2 minutos.
- **Backup:** Las páginas antiguas se sobrescriben, pero el código está en Git.

## ✅ Checklist Post-Regeneración

- [ ] Verificar que todas las páginas se regeneraron (34 archivos)
- [ ] Probar compartir una noticia en WhatsApp
- [ ] Probar compartir una noticia en Facebook
- [ ] Verificar que las imágenes se muestren correctamente
- [ ] Verificar que los títulos y descripciones sean correctos

