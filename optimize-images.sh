#!/bin/bash

# Script para optimizar imágenes automáticamente
# Uso: ./optimize-images.sh

echo "🖼️  Iniciando optimización de imágenes..."

# Crear directorio de respaldo si no existe
mkdir -p public/assets/logos/backup

# Función para optimizar imágenes
optimize_image() {
    local input_file="$1"
    local output_file="$2"
    local max_width="$3"
    local max_height="$4"
    local quality="$5"
    
    if [ -f "$input_file" ]; then
        echo "📸 Optimizando: $input_file"
        
        # Crear respaldo
        cp "$input_file" "public/assets/logos/backup/$(basename "$input_file")"
        
        # Optimizar con ImageMagick
        convert "$input_file" -resize "${max_width}x${max_height}>" -quality "$quality" -strip "$output_file"
        
        # Mostrar comparación de tamaños
        original_size=$(du -h "$input_file" | cut -f1)
        optimized_size=$(du -h "$output_file" | cut -f1)
        echo "   Original: $original_size → Optimizado: $optimized_size"
    else
        echo "⚠️  Archivo no encontrado: $input_file"
    fi
}

# Optimizar logo principal (55x55 en pantalla)
optimize_image "public/assets/logos/logo-principal.png" "public/assets/logos/logo-principal.png" "110x110" "110x110" "90"

# Optimizar imagen del director (200x300 en pantalla)
optimize_image "public/assets/logos/director-noticiero.jpg" "public/assets/logos/director-noticiero.jpg" "400x600" "400x600" "85"

# Optimizar otras imágenes en el directorio de logos
for img in public/assets/logos/*.{jpg,jpeg,png}; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        if [[ "$filename" != "logo-principal.png" && "$filename" != "director-noticiero.jpg" ]]; then
            echo "📸 Optimizando imagen adicional: $filename"
            convert "$img" -resize "800x800>" -quality "85" -strip "$img"
        fi
    fi
done

echo "✅ Optimización de imágenes completada!"
echo "📁 Respaldos guardados en: public/assets/logos/backup/"

