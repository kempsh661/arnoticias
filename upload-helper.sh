#!/bin/bash

# Script de ayuda para subir archivos a Aruca Noticias
# Uso: ./upload-helper.sh [tipo] [archivo]

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Helper para subir archivos - Arauca Noticias${NC}"
echo "=============================================="

# Función para mostrar ayuda
show_help() {
    echo -e "${YELLOW}Uso: ./upload-helper.sh [tipo] [archivo]${NC}"
    echo ""
    echo "Tipos disponibles:"
    echo "  logo      - Subir logo principal"
    echo "  noticia   - Subir imagen de noticia"
    echo "  galeria   - Subir imagen a galería"
    echo "  banner    - Subir banner"
    echo "  video     - Subir video"
    echo "  icono     - Subir icono"
    echo ""
    echo "Ejemplos:"
    echo "  ./upload-helper.sh logo mi-logo.png"
    echo "  ./upload-helper.sh noticia imagen-economia.jpg"
    echo "  ./upload-helper.sh video entrevista.mp4"
    echo ""
    echo -e "${GREEN}📁 Estructura actual:${NC}"
    find public/assets -type d | sed 's/public\/assets//' | sed 's/^/  /'
}

# Función para subir logo
upload_logo() {
    local file=$1
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Error: Archivo no encontrado: $file${NC}"
        exit 1
    fi
    
    # Detectar extensión
    extension="${file##*.}"
    
    # Copiar archivo
    cp "$file" "public/assets/logos/logo-principal.$extension"
    
    echo -e "${GREEN}✅ Logo subido exitosamente!${NC}"
    echo -e "${BLUE}📍 Ubicación: public/assets/logos/logo-principal.$extension${NC}"
    echo -e "${YELLOW}💡 Tip: El sitio web se actualizará automáticamente${NC}"
}

# Función para subir imagen de noticia
upload_noticia() {
    local file=$1
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Error: Archivo no encontrado: $file${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}📝 Ingresa un nombre descriptivo para la noticia:${NC}"
    read -p "Ejemplo: economia-desarrollo, salud-campana, etc.: " nombre
    
    # Detectar extensión
    extension="${file##*.}"
    
    # Generar nombre de archivo
    filename="noticia-$(date +%Y%m%d)-$nombre.$extension"
    
    # Copiar archivo
    cp "$file" "public/assets/images/news/$filename"
    
    echo -e "${GREEN}✅ Imagen de noticia subida exitosamente!${NC}"
    echo -e "${BLUE}📍 Ubicación: public/assets/images/news/$filename${NC}"
    echo -e "${YELLOW}💡 Recuerda actualizar la ruta en el código Vue${NC}"
}

# Función para subir a galería
upload_galeria() {
    local file=$1
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Error: Archivo no encontrado: $file${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}📝 Ingresa un nombre descriptivo:${NC}"
    read -p "Ejemplo: evento-inauguracion, equipo-redaccion, etc.: " nombre
    
    # Detectar extensión
    extension="${file##*.}"
    
    # Generar nombre de archivo
    filename="$nombre.$extension"
    
    # Copiar archivo
    cp "$file" "public/assets/images/gallery/$filename"
    
    echo -e "${GREEN}✅ Imagen subida a galería exitosamente!${NC}"
    echo -e "${BLUE}📍 Ubicación: public/assets/images/gallery/$filename${NC}"
}

# Función para subir video
upload_video() {
    local file=$1
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Error: Archivo no encontrado: $file${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}📝 Ingresa un nombre descriptivo para el video:${NC}"
    read -p "Ejemplo: entrevista-alcalde, evento-cultural, etc.: " nombre
    
    # Detectar extensión
    extension="${file##*.}"
    
    # Generar nombre de archivo
    filename="video-$(date +%Y%m%d)-$nombre.$extension"
    
    # Copiar archivo
    cp "$file" "public/assets/videos/$filename"
    
    echo -e "${GREEN}✅ Video subido exitosamente!${NC}"
    echo -e "${BLUE}📍 Ubicación: public/assets/videos/$filename${NC}"
    echo -e "${YELLOW}💡 Recuerda actualizar la ruta en el código Vue${NC}"
}

# Verificar argumentos
if [ $# -lt 1 ]; then
    show_help
    exit 1
fi

tipo=$1
archivo=$2

case $tipo in
    "logo")
        if [ -z "$archivo" ]; then
            echo -e "${RED}❌ Error: Especifica el archivo del logo${NC}"
            exit 1
        fi
        upload_logo "$archivo"
        ;;
    "noticia")
        if [ -z "$archivo" ]; then
            echo -e "${RED}❌ Error: Especifica el archivo de la imagen${NC}"
            exit 1
        fi
        upload_noticia "$archivo"
        ;;
    "galeria")
        if [ -z "$archivo" ]; then
            echo -e "${RED}❌ Error: Especifica el archivo de la imagen${NC}"
            exit 1
        fi
        upload_galeria "$archivo"
        ;;
    "video")
        if [ -z "$archivo" ]; then
            echo -e "${RED}❌ Error: Especifica el archivo del video${NC}"
            exit 1
        fi
        upload_video "$archivo"
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Error: Tipo no válido: $tipo${NC}"
        show_help
        exit 1
        ;;
esac
