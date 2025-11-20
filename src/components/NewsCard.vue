<template>
  <article
    :data-news-id="news.id"
    class="news-card card"
  >
    <div class="card-image-container">
      <img
        ref="imageRef"
        :data-src="getOptimizedImageUrl(news.image_url || news.image, size)"
        :alt="news.title"
        class="card-image"
        :class="{ 'loaded': isLoaded }"
        @click="$emit('openModal', news)"
      >
      <div class="image-loading" v-if="!isLoaded">
        <div class="loading-spinner"></div>
      </div>
    </div>
    <div class="card-content">
      <h3 class="card-title" @click="$emit('openModal', news)">
        {{ news.title }}
      </h3>
      <p class="card-excerpt">
        {{ news.excerpt || news.content?.substring(0, 150) + '...' || 'Sin descripción disponible' }}
      </p>
      <div class="card-meta">
        <span>{{ formatDate(news.published_at || news.date) }}</span>
        <span>{{ news.category }}</span>
      </div>
      <div class="card-actions">
        <button @click="$emit('openModal', news)" class="btn btn-sm btn-primary">
          Leer Más
        </button>
        <button @click="$emit('share', news)" class="btn btn-sm btn-secondary">
          🔗 Compartir
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { useLazyImage } from '../composables/useLazyImage.js'

const props = defineProps({
  news: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const emit = defineEmits(['openModal', 'share'])

// Lazy loading de imágenes
const { imageRef, isLoaded } = useLazyImage({ threshold: 0.1 })

// Función simple para obtener URL de imagen
const getOptimizedImageUrl = (url, size = 'medium') => {
  if (!url) return '/assets/images/placeholder.jpg'

  // Si es una URL de Cloudinary, aplicar transformaciones
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
    const sizeMap = {
      small: 'w_400,h_300,c_fill,q_auto,f_auto',
      medium: 'w_800,h_600,c_fill,q_auto,f_auto',
      large: 'w_1200,h_800,c_fill,q_auto,f_auto'
    }

    const transformation = sizeMap[size] || sizeMap.medium

    // Insertar transformación en la URL de Cloudinary
    if (url.includes('/upload/')) {
      return url.replace('/upload/', `/upload/${transformation}/`)
    }
  }

  return url
}

// Función para formatear fecha
const formatDate = (date) => {
  if (!date) return ''

  const dateObj = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - dateObj)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`

  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
/* Estilos del card */
.news-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-image-container {
  position: relative;
  width: 100%;
  padding-top: 66.67%; /* Aspect ratio 3:2 */
  overflow: hidden;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  background: var(--bg-secondary);
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

.card-image.loaded {
  opacity: 1;
}

.card-image:hover {
  transform: scale(1.05);
}

.image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--bg-accent);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: color 0.3s ease;
  line-height: 1.4;
}

.card-title:hover {
  color: var(--primary-color);
}

.card-excerpt {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  flex: 1;
  font-size: 0.9375rem;
  line-height: 1.6;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--bg-accent);
  font-size: 0.875rem;
  color: var(--text-light);
}

.card-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-primary {
  flex: 1;
}

.btn-secondary {
  flex-shrink: 0;
}
</style>
