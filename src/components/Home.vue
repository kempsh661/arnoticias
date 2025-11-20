<template>
  <div class="home">
    <!-- Header Component -->
    <HeaderComponent
      @scroll-to-section="scrollToSection"
      @open-contact="openContactModal"
    />

    <!-- Main Content -->
    <main>
      <!-- Hero Carousel -->
      <HeroCarousel
        :news-items="featuredNews"
        @open-news="openNewsDetail"
        @share-news="shareNews"
      />

      <!-- Featured News Section -->
      <FeaturedNewsSection
        :news-items="highlightedNews"
        @open-news="openNewsDetail"
        @share-news="shareNews"
      />

      <!-- About Section -->
      <AboutSection />
    </main>

    <!-- Footer -->
    <FooterComponent
      @scroll-to-section="scrollToSection"
      @open-contact="openContactModal"
      @open-privacy="openPrivacyModal"
      @open-terms="openTermsModal"
    />

    <!-- Contact Modal -->
    <Teleport to="body">
      <div v-if="showContactModal" class="modal-overlay" @click="closeContactModal">
        <div class="modal-content" @click.stop>
          <button @click="closeContactModal" class="modal-close" title="Cerrar">&times;</button>
          <div class="modal-header">
            <h2>Contáctanos</h2>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitContact" class="contact-form">
              <div class="form-header">
                <p class="form-subtitle">¿Tienes alguna pregunta o sugerencia? ¡Nos encantaría escucharte!</p>
              </div>

              <div class="form-group">
                <label for="name">
                  <span class="label-icon">👤</span>
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  v-model="contactForm.name"
                  required
                  class="form-input"
                  placeholder="Escribe tu nombre completo"
                  autocomplete="name"
                >
              </div>

              <div class="form-group">
                <label for="email">
                  <span class="label-icon">📧</span>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  v-model="contactForm.email"
                  required
                  class="form-input"
                  placeholder="tu-email@ejemplo.com"
                  autocomplete="email"
                >
              </div>

              <div class="form-group">
                <label for="subject">
                  <span class="label-icon">📝</span>
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  v-model="contactForm.subject"
                  required
                  class="form-input"
                  placeholder="¿De qué quieres hablarnos?"
                >
              </div>

              <div class="form-group">
                <label for="message">
                  <span class="label-icon">💬</span>
                  Mensaje
                </label>
                <textarea
                  id="message"
                  v-model="contactForm.message"
                  required
                  rows="5"
                  class="form-input"
                  placeholder="Escribe tu mensaje aquí. Nos pondremos en contacto contigo lo antes posible."
                ></textarea>
              </div>

              <button type="submit" class="btn btn-primary">
                <span class="btn-icon">🚀</span>
                Enviar Mensaje
              </button>

              <div class="form-footer">
                <p class="privacy-note">
                  <span class="privacy-icon">🔒</span>
                  Tu información está segura. Nunca compartiremos tus datos personales.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { newsService } from '../services/api.js'
import { getLatestNews, getHighlightedNews } from '../data/newsData.js'

// Components
import HeaderComponent from './HeaderComponent.vue'
import HeroCarousel from './HeroCarousel.vue'
import FeaturedNewsSection from './FeaturedNewsSection.vue'
import AboutSection from './AboutSection.vue'
import FooterComponent from './FooterComponent.vue'

const router = useRouter()

// State
const featuredNews = ref([])
const highlightedNews = ref([])
const showContactModal = ref(false)
const showPrivacyModal = ref(false)
const showTermsModal = ref(false)
const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// Load news data
const loadNews = async () => {
  try {
    console.log('🔄 Home - Iniciando carga de noticias...')
    const startTime = performance.now()

    // CARGAR DESDE EL BACKEND (prioritario)
    const [latestResponse, featuredResponse] = await Promise.all([
      newsService.getLatest(6),
      newsService.getFeatured()
    ])

    featuredNews.value = latestResponse.data || []
    highlightedNews.value = featuredResponse.data || []

    const endTime = performance.now()
    console.log('✅ Noticias cargadas desde el backend')
    console.log('📰 Carrusel:', featuredNews.value.length, 'noticias')
    console.log('⭐ Destacadas:', highlightedNews.value.length, 'noticias')
    console.log(`⏱️ Tiempo: ${Math.round(endTime - startTime)}ms`)

  } catch (error) {
    console.error('❌ Error crítico cargando noticias:', error)
    // Último recurso: arrays vacíos
    featuredNews.value = []
    highlightedNews.value = []
  }
}

// Navigation
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// News actions
const openNewsDetail = (news) => {
  router.push(`/noticia/${news.id}`)
}

const shareNews = async (news) => {
  const url = `${window.location.origin}/noticia/${news.id}`

  if (navigator.share) {
    try {
      await navigator.share({
        title: news.title,
        text: news.excerpt,
        url: url
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        copyToClipboard(url)
      }
    }
  } else {
    copyToClipboard(url)
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('Enlace copiado al portapapeles')
  } catch (err) {
    // Fallback para navegadores más antiguos
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Enlace copiado al portapapeles')
  }
}

// Modal actions
const openContactModal = () => {
  showContactModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeContactModal = () => {
  showContactModal.value = false
  document.body.style.overflow = ''
}

const openPrivacyModal = () => {
  showPrivacyModal.value = true
  document.body.style.overflow = 'hidden'
}

const closePrivacyModal = () => {
  showPrivacyModal.value = false
  document.body.style.overflow = ''
}

const openTermsModal = () => {
  showTermsModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeTermsModal = () => {
  showTermsModal.value = false
  document.body.style.overflow = ''
}

// Contact form
const submitContact = () => {
  const { name, email, subject, message } = contactForm.value

  // Crear enlace mailto
  const mailtoLink = `mailto:Araucanoticias2019@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`)}`

  window.location.href = mailtoLink

  // Cerrar modal y resetear formulario
  closeContactModal()
  contactForm.value = { name: '', email: '', subject: '', message: '' }
}

// Lifecycle
onMounted(() => {
  loadNews()
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #333;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.modal-header {
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.875rem;
  color: #1a365d;
}

.modal-body {
  padding: 2rem;
}

/* Contact Form Styles */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-header {
  text-align: center;
  margin-bottom: 1rem;
}

.form-subtitle {
  color: #718096;
  font-size: 1rem;
  margin: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #e53e3e;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.form-input::placeholder {
  color: #a0aec0;
}

textarea.form-input {
  resize: vertical;
  min-height: 120px;
}

.btn {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
  color: white;
  font-size: 1rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
}

.form-footer {
  text-align: center;
  margin-top: 1rem;
}

.privacy-note {
  font-size: 0.875rem;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  margin: 0;
}
</style>
