# 🚀 Configuración del Entorno de Desarrollo - Arauca Noticias

## 📋 Pasos para Configurar el Entorno

### 1. 📁 Renombrar el Archivo de Entorno
```bash
# Renombra el archivo de plantilla
mv env.development .env
```

### 2. 🔧 Configurar Variables de Entorno

#### **Cloudinary (Para gestión de imágenes)**
1. Ve a [Cloudinary Console](https://cloudinary.com/console)
2. Copia tus credenciales:
   - Cloud Name
   - API Key
   - API Secret
3. Actualiza el archivo `.env`:
```env
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name_real
VITE_CLOUDINARY_API_KEY=tu_api_key_real
VITE_CLOUDINARY_API_SECRET=tu_api_secret_real
```

#### **Base de Datos Railway (PostgreSQL)**
1. Ve a tu proyecto en [Railway](https://railway.app)
2. Ve a la sección "Variables" de tu base de datos
3. Copia la `DATABASE_URL`
4. Actualiza el archivo `.env`:
```env
VITE_DATABASE_URL=postgresql://usuario:password@host:puerto/database
```

### 3. 🛠️ Instalar Dependencias
```bash
npm install
```

### 4. 🚀 Ejecutar en Desarrollo
```bash
npm run dev
```

## 📝 Variables de Entorno Disponibles

### **API Configuration**
- `VITE_API_BASE_URL`: URL base de la API Laravel
- `VITE_APP_URL`: URL base de la aplicación

### **Cloudinary Configuration**
- `VITE_CLOUDINARY_CLOUD_NAME`: Nombre de la nube
- `VITE_CLOUDINARY_API_KEY`: Clave API
- `VITE_CLOUDINARY_API_SECRET`: Secreto API

### **Database Configuration**
- `VITE_DATABASE_URL`: URL de conexión a PostgreSQL

### **Application Configuration**
- `VITE_PORT`: Puerto del servidor (default: 3000)
- `VITE_DEV_MODE`: Modo desarrollo (true/false)
- `VITE_CACHE_DURATION`: Duración del cache en ms

### **Image Optimization**
- `VITE_IMAGE_QUALITY`: Calidad de compresión (1-100)
- `VITE_IMAGE_MAX_WIDTH`: Ancho máximo de imágenes grandes
- `VITE_IMAGE_MEDIUM_WIDTH`: Ancho máximo de imágenes medianas
- `VITE_IMAGE_SMALL_WIDTH`: Ancho máximo de imágenes pequeñas

### **Security**
- `VITE_JWT_SECRET`: Clave secreta para JWT

### **Logging**
- `VITE_LOG_LEVEL`: Nivel de logs (debug, info, warn, error)

## 🔒 Seguridad

### **Archivos que NO se suben a Git:**
- `.env` - Variables de entorno sensibles
- `env.development` - Plantilla de configuración
- Archivos de configuración con credenciales

### **Archivos que SÍ se suben a Git:**
- `.env.example` - Plantilla pública (sin credenciales)
- `.gitignore` - Configuración de archivos ignorados
- `SETUP-ENVIRONMENT.md` - Este archivo de instrucciones

## 🚀 Despliegue

### **Desarrollo Local**
```bash
npm run dev
# Servidor en http://localhost:3000
```

### **Producción**
```bash
npm run build
npm run preview
```

## 📞 Soporte

Si tienes problemas con la configuración:
1. Verifica que todas las variables estén configuradas
2. Revisa que las credenciales sean correctas
3. Asegúrate de que la API Laravel esté ejecutándose
4. Verifica la conexión a la base de datos

## 🔄 Actualizaciones

Para actualizar el entorno:
1. Actualiza las variables en `.env`
2. Reinicia el servidor de desarrollo
3. Verifica que todo funcione correctamente
