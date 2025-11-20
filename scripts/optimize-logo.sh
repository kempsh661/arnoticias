#!/bin/bash

# Script para optimizar el logo de Aruca Noticias
# Crea versiones de diferentes tamaños para mejor performance

echo "🎨 Optimizando logo de Aruca Noticias..."

# Verificar si ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick no está instalado."
    echo "💡 Para instalar: sudo apt install imagemagick"
    echo "⚠️  Usando logo original sin optimizar..."
    exit 1
fi

# Directorio de logos
LOGO_DIR="public/assets/logos"
SOURCE_LOGO="$LOGO_DIR/LogoAN.png"

echo "📁 Creando versiones optimizadas del logo..."

# Logo para header (200x60px aproximadamente, manteniendo proporción)
convert "$SOURCE_LOGO" -resize "200x200>" -quality 90 "$LOGO_DIR/logo-header.png"
echo "✅ Logo header creado: logo-header.png"

# Logo para footer (más pequeño)
convert "$SOURCE_LOGO" -resize "120x120>" -quality 85 "$LOGO_DIR/logo-footer.png" 
echo "✅ Logo footer creado: logo-footer.png"

# Favicon (32x32)
convert "$SOURCE_LOGO" -resize "32x32>" -quality 90 "$LOGO_DIR/favicon.png"
echo "✅ Favicon creado: favicon.png"

# Logo principal optimizado (400x400)
convert "$SOURCE_LOGO" -resize "400x400>" -quality 85 "$LOGO_DIR/logo-principal-optimized.png"
echo "✅ Logo principal optimizado creado: logo-principal-optimized.png"

# Mostrar tamaños
echo ""
echo "📊 Tamaños de archivo:"
du -h "$LOGO_DIR"/*.png | sort -h

echo ""
echo "🎉 ¡Optimización completada!"
echo "💡 Puedes usar logo-principal-optimized.png para mejor performance"

