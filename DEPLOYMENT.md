# Guía de Despliegue - Frontend

## Configuración para Producción

### Variables de Entorno
El archivo `env.production` contiene las variables de entorno para producción:

```bash
VITE_API_BASE_URL=https://barnoticias-production.up.railway.app/api/v1
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
VITE_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
VITE_CACHE_DURATION=300000
```

### Despliegue en Railway

1. **Configurar variables de entorno en Railway:**
   - Ve al dashboard de Railway
   - Selecciona el proyecto del frontend
   - Ve a Variables
   - Agrega las variables de entorno necesarias

2. **Comandos de despliegue:**
   - El `Procfile` y `railway.json` están configurados para:
     - Copiar `env.production` a `.env`
     - Ejecutar `npm run build`
     - Servir la aplicación con `vite preview`

3. **Verificar despliegue:**
   - La aplicación estará disponible en la URL de Railway
   - Debe conectarse automáticamente a la API de producción

### Solución de Problemas

- **CORS:** Asegúrate de que el backend tenga configurado CORS para el dominio del frontend
- **Variables de entorno:** Verifica que todas las variables estén configuradas en Railway
- **Build:** Si el build falla, revisa los logs de Railway

### Comandos Locales

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview local de producción
npm run preview
```
