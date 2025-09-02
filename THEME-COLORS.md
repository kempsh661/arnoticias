# 🎨 Colores y Tema de Arauca Noticias

## 🌈 Paleta de Colores Principal

### Colores Corporativos
- **Naranja Principal**: `#F47721` 🧡
- **Verde Secundario**: `#1BA347` 💚

### ✨ Distribución Estratégica de Colores

#### 🧡 Naranja (#F47721) - Usado en:
- **Botones principales** (gradiente con variación)
- **Acentos y highlights**
- **Sombras sutiles**
- **Bordes de hover en tarjetas**
- **Gradientes de header y footer**
- **Efectos de enfoque en formularios**

#### 💚 Verde (#1BA347) - Usado en:
- **Botones secundarios**
- **Elementos de éxito y confirmación**
- **Combinado en gradientes**
- **Estados válidos en formularios**
- **Acentos complementarios**

### 🌍 Sistema de Temas Automático

#### ☀️ Tema Claro (6:00 - 19:59)
```css
--text-primary: #2d3748
--bg-primary: #ffffff
--bg-secondary: #f8fafc
--bg-accent: #fff5f0 (tinte naranja suave)
--bg-success: #f0f9f3 (tinte verde suave)
```

#### 🌙 Tema Oscuro (20:00 - 5:59)
```css
--text-primary: #f7fafc
--bg-primary: #1a202c
--bg-secondary: #2d3748
--bg-accent: #2a1f15 (tinte naranja oscuro)
--bg-success: #1a2e1f (tinte verde oscuro)
```

## 🕐 Horarios de Cambio Automático

### Iconos por Horario:
- **🌅 6:00-11:59**: Amanecer
- **☀️ 12:00-17:59**: Día pleno
- **🌆 18:00-19:59**: Atardecer
- **🌙 20:00-5:59**: Noche

### Lógica de Temas:
- **Tema Claro**: 6:00 AM - 7:59 PM
- **Tema Oscuro**: 8:00 PM - 5:59 AM

## 🎯 Principios de Diseño

### ✅ Balance Visual:
- **Sin saturación**: Los colores se usan estratégicamente
- **Jerarquía clara**: Naranja para acciones, verde para confirmaciones
- **Contraste óptimo**: Legibilidad en ambos temas
- **Consistencia**: Misma paleta en todo el sitio

### 🔄 Transiciones Suaves:
- Todos los elementos tienen transiciones de 0.3s
- Cambio de tema gradual sin parpadeos
- Animaciones sutiles que mejoran la experiencia

## 🛠️ Personalización

### Para cambiar colores:
1. Edita las variables CSS en `/src/assets/styles.css`
2. Busca `:root` y `[data-theme="dark"]`
3. Modifica los valores hexadecimales

### Para ajustar horarios de tema:
1. Ve a `/src/components/Home.vue`
2. Busca la función `setThemeBasedOnTime()`
3. Modifica la condición: `(hour >= 20 || hour < 6)`

## 📱 Características del Tema

### Indicador Visual:
- **Icono animado** en el header que muestra la hora actual
- **Tooltip informativo** con hora y tema activo
- **Gradiente sutil** que se anima suavemente

### Persistencia:
- El tema se guarda en `localStorage`
- Se actualiza automáticamente cada 30 minutos
- Funciona en todas las páginas del sitio

### Rendimiento:
- **Transiciones optimizadas** con CSS puro
- **Variables CSS** para cambios instantáneos
- **Sin JavaScript pesado** para el cambio de temas

## 🎨 Elementos con Colores Corporativos

### 🧡 Elementos Naranja:
- Logo hover effect
- Botones primarios
- Enlaces activos
- Bordes de tarjetas en hover
- Overlay del carrusel
- Formulario de contacto

### 💚 Elementos Verde:
- Botones de éxito
- Estados válidos
- Combinaciones en gradientes
- Elementos de confirmación

### 🌈 Gradientes Combinados:
- Header border
- Footer background
- Estadísticas en "Nosotros"
- Indicador de tema
- Sombras sutiles

## 💡 Consejos de Uso

1. **Mantén el balance**: No uses más del 20% de colores vibrantes
2. **Usa neutrales**: Los grises y blancos son la base
3. **Acentos estratégicos**: Naranja para llamar atención, verde para confirmar
4. **Respeta el tema**: Prueba tu contenido en ambos temas
5. **Accesibilidad**: Asegúrate de que el contraste sea suficiente

¡Tu sitio ahora tiene una identidad visual fuerte y un sistema de temas inteligente! 🚀
