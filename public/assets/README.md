# Organización de Assets - Aruca Noticias

Esta carpeta contiene todos los recursos multimedia del sitio web organizados de manera estructurada.

## 📁 Estructura de Carpetas

### 🎨 `/logos/`
**Propósito:** Logos y elementos de marca
- `logo-principal.png` - Logo principal (recomendado: 200x60px)
- `logo-horizontal.png` - Versión horizontal del logo
- `logo-vertical.png` - Versión vertical del logo
- `favicon.ico` - Favicon del sitio
- `logo-footer.png` - Logo para el footer (más pequeño)

### 📸 `/images/`

#### `/images/news/`
**Propósito:** Imágenes de noticias y artículos
- Formato recomendado: JPG/PNG
- Resolución: 800x450px (16:9) para noticias principales
- Resolución: 400x300px (4:3) para noticias destacadas
- Nombres sugeridos: `noticia-{id}-{descripcion}.jpg`

#### `/images/gallery/`
**Propósito:** Galería de imágenes general
- Imágenes de eventos
- Fotos de la redacción
- Imágenes institucionales

#### `/images/banners/`
**Propósito:** Banners y elementos promocionales
- Banners del carrusel principal
- Banners publicitarios
- Imágenes promocionales

#### `/images/icons/`
**Propósito:** Iconos y elementos gráficos pequeños
- Iconos sociales personalizados
- Iconos de categorías
- Elementos decorativos

### 🎬 `/videos/`
**Propósito:** Videos para noticias
- Formato recomendado: MP4 (H.264)
- Resolución máxima: 1920x1080px
- Nombres sugeridos: `video-noticia-{id}.mp4`

## 📝 Guía de Uso

### Para subir el logo:
1. Coloca tu archivo de logo en `/public/assets/logos/`
2. Renómbralo como `logo-principal.png` o `logo-principal.jpg`
3. El código se actualizará automáticamente

### Para subir imágenes de noticias:
1. Coloca las imágenes en `/public/assets/images/news/`
2. Usa nombres descriptivos como `economia-desarrollo-2024.jpg`
3. Actualiza las rutas en el código Vue

### Para subir videos:
1. Coloca los videos en `/public/assets/videos/`
2. Asegúrate de que sean archivos MP4 optimizados
3. Actualiza las rutas en el código Vue

## ⚡ Optimización Recomendada

### Imágenes:
- Comprime las imágenes antes de subirlas
- Usa formatos WebP cuando sea posible para mejor performance
- Mantén un tamaño de archivo razonable (< 500KB para noticias)

### Videos:
- Comprime los videos para web
- Considera usar un poster/thumbnail
- Limita la duración a 2-3 minutos para mejor experiencia

## 🔄 Actualización de Rutas

Cuando subas nuevos assets, actualiza las rutas correspondientes en:
- `/src/components/Home.vue` - para imágenes principales
- `/src/components/NewsDetail.vue` - para detalles de noticias
- `/src/assets/styles.css` - para elementos CSS

## 📊 Convenciones de Nombres

### Logos:
- `logo-principal.*` - Logo principal
- `logo-{variante}.*` - Variantes del logo

### Imágenes de Noticias:
- `noticia-{id}-{descripcion}.*`
- `banner-{evento}-{fecha}.*`

### Videos:
- `video-{id}-{descripcion}.mp4`
- `entrevista-{nombre}-{fecha}.mp4`

Esta organización facilita el mantenimiento y escalabilidad del sitio web.

