# 📦 Comandos Git para Subir los Cambios

## 🚀 Pasos para Subir al Repositorio

### 1. 📋 Verificar Estado del Repositorio
```bash
git status
```

### 2. 🔍 Ver Cambios Pendientes
```bash
git diff
```

### 3. ➕ Agregar Archivos al Staging
```bash
# Agregar todos los archivos modificados
git add .

# O agregar archivos específicos
git add src/components/AdminDashboard.vue
git add src/services/api.js
git add .gitignore
git add SETUP-ENVIRONMENT.md
git add setup-env.sh
```

### 4. 📝 Crear Commit con Mensaje Descriptivo
```bash
git commit -m "feat: Mejoras en vista previa del admin y configuración de entorno

- ✅ Corregido problema de contenido en vista previa del admin
- ✅ Reorganizadas etiquetas de estado en tabla de noticias
- ✅ Preservado formato de texto en todas las vistas
- ✅ Agregada configuración de variables de entorno
- ✅ Creado archivo .env para desarrollo
- ✅ Agregado .gitignore para archivos sensibles
- ✅ Documentación de configuración del entorno"
```

### 5. 🚀 Subir Cambios al Repositorio
```bash
# Si es la primera vez
git push -u origin main

# Si ya existe la rama
git push origin main
```

## 📁 Archivos que se Suben

### ✅ **Archivos de Código:**
- `src/components/AdminDashboard.vue` - Mejoras en vista previa
- `src/services/api.js` - Configuración de variables de entorno
- `src/components/Home.vue` - Optimizaciones de carga
- `src/components/NewsList.vue` - Mejoras en formato
- `src/components/NewsDetail.vue` - Preservación de formato
- `src/components/NewsForm.vue` - Mejoras en vista previa

### ✅ **Archivos de Configuración:**
- `.gitignore` - Archivos ignorados por Git
- `SETUP-ENVIRONMENT.md` - Documentación de configuración
- `setup-env.sh` - Script de configuración automática
- `env.development` - Plantilla de variables de entorno

### ❌ **Archivos que NO se Suben:**
- `.env` - Variables de entorno sensibles (protegido por .gitignore)
- `node_modules/` - Dependencias (protegido por .gitignore)
- `dist/` - Archivos de build (protegido por .gitignore)

## 🔒 Seguridad

### **Antes de Subir:**
1. ✅ Verificar que `.env` esté en `.gitignore`
2. ✅ No incluir credenciales reales en commits
3. ✅ Usar `env.development` como plantilla pública
4. ✅ Documentar configuración en `SETUP-ENVIRONMENT.md`

### **Verificar Archivos Sensibles:**
```bash
# Verificar que .env no se va a subir
git check-ignore .env

# Verificar archivos que se van a subir
git ls-files --cached
```

## 🏷️ Tags y Versiones

### **Crear Tag de Versión:**
```bash
# Crear tag para la versión actual
git tag -a v1.2.0 -m "Versión 1.2.0 - Mejoras en Admin y Configuración"

# Subir tags
git push origin v1.2.0
```

## 🔄 Flujo de Trabajo Recomendado

### **Para Desarrollo:**
1. `git checkout -b feature/nueva-funcionalidad`
2. Hacer cambios
3. `git add .`
4. `git commit -m "feat: descripción del cambio"`
5. `git push origin feature/nueva-funcionalidad`
6. Crear Pull Request

### **Para Producción:**
1. `git checkout main`
2. `git pull origin main`
3. `git merge feature/nueva-funcionalidad`
4. `git push origin main`
5. `git tag -a v1.x.x -m "Versión x.x.x"`

## 📞 Comandos de Emergencia

### **Deshacer Último Commit:**
```bash
git reset --soft HEAD~1
```

### **Deshacer Cambios en Archivo:**
```bash
git checkout -- archivo.txt
```

### **Ver Historial:**
```bash
git log --oneline
```

### **Ver Cambios de un Commit:**
```bash
git show commit-hash
```
