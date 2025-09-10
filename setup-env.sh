#!/bin/bash

# ===========================================
# SCRIPT DE CONFIGURACIÓN DEL ENTORNO
# ARAUCA NOTICIAS - DESARROLLO
# ===========================================

echo "🚀 Configurando entorno de desarrollo para Arauca Noticias..."

# Verificar si existe el archivo .env
if [ -f ".env" ]; then
    echo "⚠️  El archivo .env ya existe."
    read -p "¿Deseas sobrescribirlo? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Configuración cancelada."
        exit 1
    fi
fi

# Copiar el archivo de plantilla
if [ -f "env.development" ]; then
    cp env.development .env
    echo "✅ Archivo .env creado desde la plantilla."
else
    echo "❌ No se encontró el archivo env.development"
    exit 1
fi

# Crear directorio de logs si no existe
mkdir -p logs

echo ""
echo "🔧 Configuración completada!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Edita el archivo .env con tus credenciales reales"
echo "2. Configura Cloudinary: https://cloudinary.com/console"
echo "3. Configura Railway: https://railway.app"
echo "4. Ejecuta: npm run dev"
echo ""
echo "📚 Para más información, lee: SETUP-ENVIRONMENT.md"
echo ""
echo "🎉 ¡Listo para desarrollar!"
