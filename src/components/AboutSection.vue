<template>
  <section id="nosotros" class="section about-section">
    <div class="container">
      <div class="about-content">
        <div class="about-text">
          <h2 class="section-title">Sobre Arauca Noticias</h2>
          <p class="about-description">
            Arauca Noticias es tu fuente confiable de información, comprometida con llevarte
            las noticias más importantes de manera veraz, oportuna y objetiva. Con un equipo
            de periodistas experimentados, nos dedicamos a mantener informada a nuestra comunidad
            sobre los acontecimientos que realmente importan.
          </p>
          <div class="about-stats">
            <div class="stat">
              <h3>5+</h3>
              <p>Años de experiencia</p>
            </div>
            <div class="stat">
              <h3>10K+</h3>
              <p>Lectores diarios</p>
            </div>
            <div class="stat">
              <h3>24/7</h3>
              <p>Cobertura continua</p>
            </div>
          </div>
        </div>
        <div class="about-images">
          <div class="about-image director-image">
            <img
              ref="directorImageRef"
              data-src="/assets/logos/director-noticiero.jpg"
              alt="Director de Arauca Noticias"
              :class="{ 'loaded': isImageLoaded }"
            >
            <div class="image-loading" v-if="!isImageLoaded">
              <div class="loading-spinner"></div>
            </div>
            <div class="image-caption">Director del Noticiero</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLazyImage } from '../composables/useLazyImage.js'

// Lazy loading para la imagen del director
const { imageRef: directorImageRef, isLoaded: isImageLoaded } = useLazyImage({
  threshold: 0.2
})
</script>

<style scoped>
.section {
  padding: 4rem 0;
}

.about-section {
  background: var(--bg-accent, #f7fafc);
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary, #2d3748);
}

.about-description {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-secondary, #718096);
  margin-bottom: 2rem;
  text-align: justify;
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.stat {
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
}

.stat h3 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color, #1a365d);
  margin-bottom: 0.5rem;
}

.stat p {
  font-size: 0.875rem;
  color: var(--text-secondary, #718096);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.about-images {
  position: relative;
  display: flex;
  justify-content: center;
}

.about-image {
  position: relative;
  max-width: 300px;
  width: 100%;
}

.about-image img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: var(--border-radius-lg, 12px);
  box-shadow: var(--shadow-xl, 0 20px 25px rgba(0, 0, 0, 0.15));
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.3s ease;
  object-fit: cover;
}

.about-image img.loaded {
  opacity: 1;
}

.about-image:hover img.loaded {
  transform: scale(1.05);
}

.image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--bg-accent, #f7fafc);
  border-top-color: var(--primary-color, #1a365d);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  font-weight: 600;
  text-align: center;
}

/* Responsive */
@media (max-width: 968px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .about-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .section-title {
    font-size: 2rem;
  }

  .about-description {
    font-size: 1rem;
  }

  .about-stats {
    grid-template-columns: 1fr;
  }

  .stat h3 {
    font-size: 2rem;
  }
}
</style>
