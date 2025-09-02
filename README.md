# Arauca Noticias

Sitio web de noticias moderno desarrollado con Vue.js 3, optimizado para SEO y performance.

## Características

- 🚀 **Vue.js 3** con Composition API
- ⚡ **Vite** para desarrollo rápido y build optimizado
- 📱 **Diseño responsivo** que funciona en todos los dispositivos
- 🎨 **UI moderna** con animaciones y transiciones suaves
- 📰 **Carrusel de noticias** con auto-scroll
- 🔍 **SEO optimizado** con meta tags dinámicos
- 📺 **Soporte para videos** en noticias
- 💬 **Modales interactivos** para detalles de noticias y contacto
- 🎯 **Performance optimizado** para carga rápida

## Estructura del Proyecto

```
src/
├── components/
│   ├── Home.vue          # Página principal
│   └── NewsDetail.vue    # Página de detalle de noticia
├── assets/
│   └── styles.css        # Estilos globales
├── App.vue               # Componente raíz
└── main.js              # Punto de entrada
```

## Instalación y Uso

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Construir para producción:**
   ```bash
   npm run build
   ```

4. **Vista previa de la build:**
   ```bash
   npm run preview
   ```

## Características Técnicas

### SEO y Performance
- Meta tags optimizados
- Open Graph y Twitter Cards
- Lazy loading de imágenes
- Code splitting automático
- Minificación y optimización de assets

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Menú hamburguesa en móviles
- Grids adaptativos

### Funcionalidades
- Carrusel automático con controles manuales
- Modales para noticias con soporte de video
- Formulario de contacto
- Navegación suave entre secciones
- Breadcrumbs en páginas de detalle

## Subir Archivos 📁

### Estructura de Assets
Los archivos están organizados en `/public/assets/`:

```
assets/
├── logos/           # Logos y elementos de marca
├── images/
│   ├── news/        # Imágenes de noticias
│   ├── gallery/     # Galería general
│   ├── banners/     # Banners promocionales
│   └── icons/       # Iconos y elementos gráficos
└── videos/          # Videos para noticias
```

### Script de Ayuda
Usa el script incluido para subir archivos fácilmente:

```bash
# Subir logo principal
./upload-helper.sh logo mi-logo.png

# Subir imagen de noticia
./upload-helper.sh noticia economia-2024.jpg

# Subir video
./upload-helper.sh video entrevista-alcalde.mp4

# Ver ayuda completa
./upload-helper.sh help
```

### Subida Manual
También puedes copiar archivos directamente:

```bash
# Para el logo principal
cp mi-logo.png public/assets/logos/logo-principal.png

# Para imágenes de noticias
cp mi-imagen.jpg public/assets/images/news/noticia-descripcion.jpg
```

## Personalización

### Colores y Temas
Los colores están definidos como variables CSS en `/src/assets/styles.css`:

```css
:root {
  --primary-color: #1a365d;
  --secondary-color: #2c5282;
  --accent-color: #e53e3e;
  /* ... más variables */
}
```

### Contenido
Para modificar el contenido de las noticias, edita los arrays `featuredNews` y `highlightedNews` en `/src/components/Home.vue`.

## Estructura de Datos de Noticias

```javascript
{
  id: 1,
  title: "Título de la noticia",
  excerpt: "Resumen breve",
  image: "/ruta/imagen.jpg",
  imageCaption: "Descripción de la imagen",
  category: "Categoría",
  date: new Date(),
  author: "Autor",
  tags: ["tag1", "tag2"],
  content: "Contenido HTML completo",
  video: "/ruta/video.mp4" // Opcional
}
```

## Optimizaciones Implementadas

1. **Code Splitting**: Separación automática de vendors
2. **Lazy Loading**: Carga bajo demanda de componentes
3. **Asset Optimization**: Minificación y compresión
4. **SEO**: Meta tags dinámicos y estructura semántica
5. **Performance**: Optimización de imágenes y fonts

## Navegadores Soportados

- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Para más información sobre Arauca Noticias:
- Email: info@araucanoticias.com
- Teléfono: +57 310 2279487
- Facebook: https://www.facebook.com/arauca.noticia
