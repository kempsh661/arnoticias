#!/bin/bash

# Script para actualizar el logo de Aruca Noticias
# Uso: ./update-logo.sh [archivo-del-logo]

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎨 Actualizador de Logo - Arauca Noticias${NC}"
echo "============================================"

# Verificar argumentos
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}📁 Logos actuales en el sistema:${NC}"
    find public/assets/logos -name "*.png" -o -name "*.jpg" -o -name "*.svg" | sort
    echo ""
    echo -e "${BLUE}💡 Uso: ./update-logo.sh tu-nuevo-logo.png${NC}"
    echo ""
    echo -e "${GREEN}ℹ️  El logo actual es: LogoAN.png${NC}"
    exit 0
fi

NUEVO_LOGO=$1

# Verificar que el archivo existe
if [ ! -f "$NUEVO_LOGO" ]; then
    echo -e "${RED}❌ Error: No se encontró el archivo $NUEVO_LOGO${NC}"
    exit 1
fi

# Mostrar información del archivo
echo -e "${BLUE}📋 Información del nuevo logo:${NC}"
file "$NUEVO_LOGO"
echo -e "${BLUE}📏 Tamaño:${NC} $(du -h "$NUEVO_LOGO" | cut -f1)"

# Preguntar confirmación
echo ""
    echo -e "${YELLOW}❓ ¿Deseas actualizar el logo de Arauca Noticias? (s/n):${NC}"
read -p "" confirm

if [[ $confirm == "s" || $confirm == "S" || $confirm == "si" || $confirm == "SI" ]]; then
    
    # Crear backup del logo actual
    if [ -f "public/assets/logos/logo-principal.png" ]; then
        cp "public/assets/logos/logo-principal.png" "public/assets/logos/logo-backup-$(date +%Y%m%d-%H%M%S).png"
        echo -e "${GREEN}💾 Backup creado del logo anterior${NC}"
    fi
    
    # Detectar extensión del nuevo logo
    extension="${NUEVO_LOGO##*.}"
    
    # Copiar el nuevo logo
    cp "$NUEVO_LOGO" "public/assets/logos/logo-principal.$extension"
    
    # Si no es PNG, crear también una versión PNG
    if [ "$extension" != "png" ]; then
        if command -v convert &> /dev/null; then
            convert "$NUEVO_LOGO" "public/assets/logos/logo-principal.png"
            echo -e "${GREEN}🔄 Convertido a PNG para mejor compatibilidad${NC}"
        else
            echo -e "${YELLOW}⚠️  Recomendación: Instala ImageMagick para conversión automática${NC}"
        fi
    fi
    
    # Actualizar favicon
    cp "public/assets/logos/logo-principal.$extension" "public/favicon.png"
    
    echo ""
    echo -e "${GREEN}✅ ¡Logo actualizado exitosamente!${NC}"
    echo -e "${BLUE}📍 Ubicación: public/assets/logos/logo-principal.$extension${NC}"
    echo -e "${BLUE}🌐 El sitio web se actualizará automáticamente${NC}"
    echo ""
    echo -e "${YELLOW}💡 Tip: Recarga la página en tu navegador (Ctrl+F5) para ver los cambios${NC}"
    
else
    echo -e "${YELLOW}❌ Actualización cancelada${NC}"
fi
