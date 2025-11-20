<template>
  <section id="inicio" class="hero-section">
    <div class="carousel-container">
      <div class="carousel">
        <div
          v-for="(news, index) in newsItems"
          :key="news.id || index"
          class="carousel-slide"
          :class="{ active: currentSlide === index }"
        >
          <div class="slide-image">
            <img
              :src="getImageUrl(news)"
              :alt="news.title"
              :class="{ 'loaded': loadedImages[index] }"
              @load="onImageLoad(index)"
              @error="onImageError(index)"
              loading="lazy"
            />
            <div class="image-loading" v-if="!loadedImages[index]">
              <div class="loading-spinner"></div>
            </div>
            <div class="slide-overlay"></div>
          </div>
          <div class="slide-content">
            <div class="container">
              <div class="slide-meta">
                <span class="slide-date">🗓️ {{ formatDate(news.published_at || news.date) }}</span>
                <span class="slide-category">📂 {{ news.category }}</span>
              </div>
              <h2 class="slide-title">{{ news.title }}</h2>
              <p class="slide-excerpt">{{ news.excerpt }}</p>
              <div class="slide-actions">
                <button @click="$emit('open-news', news)" class="btn btn-primary">
                  Leer Más
                </button>
                <button @click="$emit('share-news', news)" class="btn btn-secondary">
                  🔗 Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="carousel-controls" v-if="newsItems.length > 1">
        <button @click="handlePrevSlide" class="carousel-btn carousel-prev" aria-label="Previous slide">‹</button>
        <button @click="handleNextSlide" class="carousel-btn carousel-next" aria-label="Next slide">›</button>
      </div>

      <div class="carousel-indicators" v-if="newsItems.length > 1">
        <button
          v-for="(_, index) in newsItems"
          :key="index"
          @click="handleGoToSlide(index)"
          class="indicator"
          :class="{ active: currentSlide === index }"
          :aria-label="`Go to slide ${index + 1}`"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCarousel } from '../composables/useCarousel.js'

const props = defineProps({
  newsItems: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['open-news', 'share-news'])

const loadedImages = ref({})

// Usar el composable de carrusel
const {
  currentSlide,
  nextSlide,
  prevSlide,
  goToSlide,
  resetAutoplay
} = useCarousel({
  itemsCount: computed(() => props.newsItems.length),
  autoplayInterval: 5000,
  autoplay: true
})

// Manejar eventos con reset de autoplay
const handleNextSlide = () => {
  nextSlide()
  resetAutoplay()
}

const handlePrevSlide = () => {
  prevSlide()
  resetAutoplay()
}

const handleGoToSlide = (index) => {
  goToSlide(index)
  resetAutoplay()
}

// Función simple para obtener URL de imagen
const getImageUrl = (news) => {
  const url = news.image_url || news.image
  if (!url) return '/assets/images/placeholder.jpg'

  // Si es base64, advertir pero usar directamente (temporal)
  if (typeof url === 'string' && url.startsWith('data:image')) {
    console.warn('⚠️ Imagen base64 detectada. Recomendación: El backend debería guardar imágenes como archivos.')
    return url
  }

  return url
}

// Manejo de carga de imágenes
const onImageLoad = (index) => {
  loadedImages.value[index] = true
}

// Manejo de errores de carga
const onImageError = (index) => {
  loadedImages.value[index] = true
  console.error(`❌ Error al cargar imagen ${index}`)
}

// Función para formatear fecha
const formatDate = (date) => {
  if (!date) return 'Fecha no disponible'

  try {
    const dateObj = new Date(date)

    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida'
    }

    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj)
  } catch (error) {
    return 'Error en fecha'
  }
}
</script>

<style scoped>
/* Hero Carousel Styles */
.hero-section {
  margin-top: 70px;
  position: relative;
  height: 70vh;
  min-height: 500px;
  overflow: hidden;
  background: var(--bg-secondary, #f7fafc);
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  pointer-events: none;
}

.carousel-slide.active {
  opacity: 1;
  pointer-events: all;
}

.slide-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.slide-image img.loaded {
  opacity: 1;
}

.image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  z-index: 1;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3rem 0;
  color: white;
  z-index: 2;
}

.slide-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

.slide-date {
  background: rgba(244, 119, 33, 0.9);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 500;
}

.slide-category {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  font-weight: 500;
}

.slide-title {
  font-size: clamp(1.75rem, 5vw, 3rem);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.slide-excerpt {
  font-size: clamp(1rem, 2vw, 1.25rem);
  margin-bottom: 2rem;
  opacity: 0.95;
  max-width: 600px;
  line-height: 1.5;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.slide-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  transform: translateY(-50%);
  z-index: 3;
}

.carousel-btn {
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--primary-color, #1a365d);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.carousel-btn:hover {
  background-color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.carousel-indicators {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 3;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.indicator.active,
.indicator:hover {
  background-color: white;
  transform: scale(1.2);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    height: 60vh;
    min-height: 400px;
  }

  .slide-content {
    padding: 2rem 0;
  }

  .carousel-controls {
    padding: 0 1rem;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
}
</style>
