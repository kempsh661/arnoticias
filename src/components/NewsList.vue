<template>
  <div class="news-list">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <img src="/assets/logos/logo-principal.png" alt="Arauca Noticias" class="logo-image">
            <h1 class="logo-text">Arauca Noticias</h1>
          </div>
          
          <nav class="nav" :class="{ 'nav-open': mobileMenuOpen }">
            <ul class="nav-list">
              <li><a href="/" class="nav-link">Inicio</a></li>
              <li><a href="#" class="nav-link active">Noticias</a></li>
              <li><a href="/#nosotros" class="nav-link">Nosotros</a></li>
              <li><a href="#" @click="openContactModal" class="nav-link">Contacto</a></li>
              <li class="theme-indicator">
                <span class="theme-icon" :title="getThemeTooltip()">
                  {{ getThemeIcon() }}
                </span>
              </li>
            </ul>
          </nav>
          
          <button class="mobile-menu-btn" @click="toggleMobileMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">Todas las Noticias</h1>
            <p class="hero-subtitle">Mantente informado con las últimas noticias de Arauca</p>
          </div>
        </div>
      </section>

      <!-- Filter Section -->
      <section class="filter-section">
        <div class="container">
          <div class="filters">
            <button 
              @click="selectedCategory = 'todas'" 
              :class="{ active: selectedCategory === 'todas' }"
              class="filter-btn"
            >
              Todas
            </button>
            <button 
              v-for="category in categories" 
              :key="category"
              @click="selectedCategory = category"
              :class="{ active: selectedCategory === category }"
              class="filter-btn"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </section>

      <!-- News Grid -->
      <section class="news-grid-section">
        <div class="container">
          <div class="news-grid">
            <article 
              v-for="news in filteredNews" 
              :key="news.id"
              class="news-card"
            >
              <div class="card-image-container" @click="openNewsModal(news)">
                <img 
                  :src="getOptimizedImageUrl(news.image_url || news.thumbnail_url || news.optimized_image_url || news.image, 'medium')" 
                  :alt="news.title" 
                  class="card-image"
                  loading="lazy"
                >
                <div class="card-category">{{ news.category }}</div>
              </div>
              <div class="card-content">
                <h3 class="card-title" @click="openNewsModal(news)">{{ news.title }}</h3>
                <p class="card-excerpt">{{ news.excerpt }}</p>
                <div class="card-meta">
                  <span class="card-date">{{ formatDate(news.date) }}</span>
                </div>
                <div class="card-actions">
                  <button @click="openNewsModal(news)" class="btn btn-sm btn-primary">
                    Leer Más
                  </button>
                  <button @click="shareNews(news)" class="btn btn-sm btn-secondary">
                    🔗 Compartir
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-logo">
              <img src="/assets/logos/logo-principal.png" alt="Arauca Noticias" class="footer-logo-image">
              <h3>Arauca Noticias</h3>
            </div>
            <p class="footer-description">
              Tu fuente confiable de información. Mantente al día con las noticias más importantes.
            </p>
          </div>
          
          <div class="footer-section">
            <h4>Enlaces</h4>
            <ul class="footer-links">
              <li><a href="/">Inicio</a></li>
              <li><a href="/noticias">Noticias</a></li>
              <li><a href="/#nosotros">Nosotros</a></li>
              <li><a href="#" @click="openContactModal">Contacto</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Contacto</h4>
            <ul class="footer-contact">
              <li>📧 Araucanoticias2019@gmail.com</li>
              <li>📱 +57 310 2279487</li>
              <li>📍 Arauca, Colombia</li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 Arauca Noticias. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>

    <!-- News Modal -->
    <div v-if="selectedNews" class="modal-overlay" @click="closeNewsModal">
      <div class="modal-content modern-modal" @click.stop>
        <button @click="closeNewsModal" class="modal-close" title="Cerrar">&times;</button>
        
        <!-- Modal Hero Section with Image Carousel -->
        <div class="modal-hero">
          <div class="hero-carousel-container">
            <div 
              v-for="(image, index) in getNewsImages(selectedNews)" 
              :key="index"
              class="hero-carousel-slide"
              :class="{ active: currentImageIndex === index }"
            >
              <img :src="image.src" :alt="image.alt" class="hero-carousel-image">
              <div class="hero-overlay"></div>
            </div>
            
            <!-- Carousel Controls -->
            <div v-if="getNewsImages(selectedNews).length > 1" class="hero-carousel-controls">
              <button @click="prevImage" class="hero-carousel-btn hero-carousel-prev">‹</button>
              <button @click="nextImage" class="hero-carousel-btn hero-carousel-next">›</button>
            </div>
            
            <!-- Carousel Indicators -->
            <div v-if="getNewsImages(selectedNews).length > 1" class="hero-carousel-indicators">
              <button 
                v-for="(image, index) in getNewsImages(selectedNews)" 
                :key="index"
                @click="goToImage(index)"
                class="hero-indicator"
                :class="{ active: currentImageIndex === index }"
              ></button>
            </div>
            
            <!-- Image Caption -->
            <div class="hero-image-caption">
              {{ getNewsImages(selectedNews)[currentImageIndex]?.caption }}
              <span v-if="getNewsImages(selectedNews).length > 1" class="image-counter">
                {{ currentImageIndex + 1 }} / {{ getNewsImages(selectedNews).length }}
              </span>
            </div>
          </div>
          
          <div class="modal-hero-content">
            <div class="modal-meta-badges">
              <span class="modal-category-badge">{{ selectedNews.category }}</span>
              <span class="modal-date-badge">{{ formatDate(selectedNews.date) }}</span>
            </div>
            <h1 class="modal-title">{{ selectedNews.title }}</h1>
          </div>
        </div>
        
        <!-- Modal Body -->
        <div class="modal-body modern-body">
          <div v-if="selectedNews.video" class="modal-video-section">
            <!-- Video de YouTube -->
            <iframe 
              v-if="getVideoType(selectedNews.video) === 'youtube'"
              :src="getYouTubeEmbedUrl(selectedNews.video)"
              class="modal-video iframe-video"
              frameborder="0"
              allowfullscreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
            
            <!-- Video de Facebook -->
            <iframe 
              v-else-if="getVideoType(selectedNews.video) === 'facebook'"
              :src="getFacebookEmbedUrl(selectedNews.video)"
              class="modal-video iframe-video"
              frameborder="0"
              allowfullscreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
            
            <!-- Video de Vimeo -->
            <iframe 
              v-else-if="getVideoType(selectedNews.video) === 'vimeo'"
              :src="getVimeoEmbedUrl(selectedNews.video)"
              class="modal-video iframe-video"
              frameborder="0"
              allowfullscreen
            ></iframe>
            
            <!-- Video directo (MP4, etc.) -->
            <video 
              v-else-if="getVideoType(selectedNews.video) === 'direct'"
              controls 
              :poster="getOptimizedImageUrl(selectedNews.image_url || selectedNews.medium_url || selectedNews.optimized_image_url || selectedNews.image, 'large')" 
              class="modal-video"
            >
              <source :src="selectedNews.video" type="video/mp4">
              Tu navegador no soporta el elemento video.
            </video>
            
            <!-- Fallback para URLs desconocidas -->
            <div v-else class="video-fallback">
              <p>⚠️ Tipo de video no soportado.</p>
              <p>Tipos soportados: YouTube, Facebook, Vimeo, MP4</p>
              <a :href="selectedNews.video" target="_blank" class="video-link">
                Abrir video en nueva pestaña: {{ selectedNews.video }}
              </a>
            </div>
          </div>
          
          <div class="modal-content-text" v-html="getCleanContent(selectedNews)"></div>
        </div>
      </div>
    </div>

    <!-- Contact Modal -->
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
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { newsService } from '../services/api.js'

export default {
  name: 'NewsList',
  setup() {
    const route = useRoute()
    const mobileMenuOpen = ref(false)
    const selectedNews = ref(null)
    const showContactModal = ref(false)
    const currentImageIndex = ref(0)
    const selectedCategory = ref('todas')
    const contactForm = ref({
      name: '',
      email: '',
      subject: '',
      message: ''
    })

    // Todas las noticias disponibles
    const allNews = ref([])

    const loadNews = async () => {
      try {
        // Usar la API pública que filtra noticias despublicadas automáticamente
        const response = await newsService.getAll({ per_page: 100 })
        console.log('API Response:', response) // Debug log
        allNews.value = response.data || []
      } catch (error) {
        console.error('Error cargando noticias:', error)
        allNews.value = []
      }
    }

    // Categorías únicas
    const categories = computed(() => {
      const cats = [...new Set(allNews.value.map(news => news.category))]
      return cats.sort()
    })

    // Noticias filtradas
    const filteredNews = computed(() => {
      console.log('All news:', allNews.value) // Debug log
      console.log('Selected category:', selectedCategory.value) // Debug log
      
      if (selectedCategory.value === 'todas') {
        return allNews.value.sort((a, b) => new Date(b.published_at || b.date) - new Date(a.published_at || a.date))
      }
      return allNews.value
        .filter(news => news.category === selectedCategory.value)
        .sort((a, b) => new Date(b.published_at || b.date) - new Date(a.published_at || a.date))
    })

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const openNewsModal = async (news) => {
      try {
        // Cargar los datos completos de la noticia desde la API
        console.log('📖 Cargando noticia completa para modal:', news.id)
        const response = await newsService.getById(news.id)
        
        if (response.success) {
          selectedNews.value = response.data
          currentImageIndex.value = 0
          document.body.style.overflow = 'hidden'
          console.log('✅ Noticia completa cargada:', response.data.title)
        } else {
          console.error('❌ Error al cargar noticia completa:', response.message)
          // Fallback: usar los datos parciales disponibles
          selectedNews.value = news
          currentImageIndex.value = 0
          document.body.style.overflow = 'hidden'
        }
      } catch (error) {
        console.error('❌ Error al cargar noticia completa:', error)
        // Fallback: usar los datos parciales disponibles
        selectedNews.value = news
        currentImageIndex.value = 0
        document.body.style.overflow = 'hidden'
      }
    }

    const shareNews = (news) => {
      const url = `${window.location.origin}/noticias?news=${news.id}`
      
      if (navigator.share) {
        // Usar la API nativa de compartir si está disponible
        navigator.share({
          title: news.title,
          text: news.excerpt,
          url: url
        }).catch(err => {
          console.log('Error al compartir:', err)
          copyToClipboard(url)
        })
      } else {
        // Fallback: copiar al portapapeles
        copyToClipboard(url)
      }
    }

    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        // Enlace copiado silenciosamente
      } catch (err) {
        // Fallback para navegadores más antiguos
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        // Enlace copiado silenciosamente
      }
    }

    const closeNewsModal = () => {
      selectedNews.value = null
      currentImageIndex.value = 0
      document.body.style.overflow = 'auto'
    }

    const openContactModal = () => {
      showContactModal.value = true
      document.body.style.overflow = 'hidden'
      mobileMenuOpen.value = false
    }

    const closeContactModal = () => {
      showContactModal.value = false
      document.body.style.overflow = 'auto'
    }

    const submitContact = () => {
      const submitBtn = document.querySelector('.contact-form .btn-primary')
      submitBtn.style.opacity = '0.7'
      submitBtn.style.cursor = 'not-allowed'
      submitBtn.innerHTML = '<span class="btn-icon">⏳</span>Enviando...'
      
      setTimeout(() => {
        alert('¡Mensaje enviado correctamente! Te contactaremos pronto.')
        contactForm.value = {
          name: '',
          email: '',
          subject: '',
          message: ''
        }
        
        submitBtn.style.opacity = '1'
        submitBtn.style.cursor = 'pointer'
        submitBtn.innerHTML = '<span class="btn-icon">🚀</span>Enviar Mensaje'
        
        closeContactModal()
      }, 1500)
    }

    const formatDate = (date) => {
      if (!date) return 'Fecha no disponible'
      
      try {
        const dateObj = new Date(date)
        
        // Verificar si la fecha es válida
        if (isNaN(dateObj.getTime())) {
          console.warn('Fecha inválida recibida:', date)
          return 'Fecha inválida'
        }
        
        return new Intl.DateTimeFormat('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(dateObj)
      } catch (error) {
        console.error('Error formateando fecha:', error, 'Fecha recibida:', date)
        return 'Error en fecha'
      }
    }

    // Función para extraer imágenes de una noticia
    const getNewsImages = (news) => {
      const images = []
      
      console.log('🔍 NewsList getNewsImages - datos de noticia:', news)
      
      // Prioridad 1: Usar galería nueva si existe
      if (news.gallery && news.gallery.length > 0) {
        console.log('📸 NewsList - Galería encontrada:', news.gallery.length, 'imágenes')
        console.log('📊 NewsList - Datos de galería:', news.gallery)
        
        // Ordenar por orden y mostrar imagen principal primero
        const sortedGallery = [...news.gallery].sort((a, b) => {
          if (a.is_main) return -1  // Imagen principal va primero
          if (b.is_main) return 1
          return a.order - b.order  // Luego por orden
        })
        
        sortedGallery.forEach((image, index) => {
          const imageUrl = image.large_url || image.medium_url || image.thumbnail_url || image.optimized_url
          console.log(`🖼️ NewsList - Imagen ${index + 1}:`, {
            id: image.id,
            url: imageUrl,
            large_url: image.large_url,
            medium_url: image.medium_url,
            thumbnail_url: image.thumbnail_url,
            optimized_url: image.optimized_url
          })
          
          if (imageUrl) {
            images.push({
              src: getOptimizedImageUrl(imageUrl, 'large'),
              alt: image.alt_text || news.title,
              caption: image.caption || (image.is_main ? 'Imagen principal' : `Imagen ${index + 1}`)
            })
          } else {
            console.warn(`⚠️ NewsList - No se encontró URL válida para imagen ${image.id}`)
          }
        })
        
        console.log('✅ NewsList - Imágenes procesadas:', images.length)
        return images
      }
      
      // Fallback: Imagen principal legacy
      if (news.image_url || news.image) {
        images.push({
          src: getOptimizedImageUrl(news.image_url || news.image, 'large'),
          alt: news.title,
          caption: 'Imagen principal'
        })
      }
      
      // Fallback: Extraer imágenes del contenido HTML (para noticias antiguas)
      if (news.content) {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = news.content
        const imgElements = tempDiv.querySelectorAll('img')
        
        imgElements.forEach((img, index) => {
          if (img.src !== news.image) {
            images.push({
              src: getOptimizedImageUrl(img.src, 'large'),
              alt: img.alt || `Imagen ${index + 1}`,
              caption: img.alt || `Imagen ${index + 1}`
            })
          }
        })
      }
      
      return images
    }

    const nextImage = () => {
      if (selectedNews.value) {
        const images = getNewsImages(selectedNews.value)
        currentImageIndex.value = (currentImageIndex.value + 1) % images.length
      }
    }

    const prevImage = () => {
      if (selectedNews.value) {
        const images = getNewsImages(selectedNews.value)
        currentImageIndex.value = currentImageIndex.value === 0 ? images.length - 1 : currentImageIndex.value - 1
      }
    }

    const goToImage = (index) => {
      currentImageIndex.value = index
    }

    const getCleanContent = (news) => {
      if (!news || !news.content) return ''
      
      let cleanContent = news.content
      
      // Remove gallery elements
      cleanContent = cleanContent.replace(/<div class="news-gallery">[\s\S]*?<\/div>\s*<\/div>/g, '')
      cleanContent = cleanContent.replace(/<div class="news-gallery">[\s\S]*?<\/div>/g, '')
      cleanContent = cleanContent.replace(/<div class="gallery-grid">[\s\S]*?<\/div>/g, '')
      cleanContent = cleanContent.replace(/<div class="gallery-item">[\s\S]*?<\/div>/g, '')
      cleanContent = cleanContent.replace(/<img[^>]*class="gallery-image"[^>]*>/g, '')
      cleanContent = cleanContent.replace(/<div class="gallery-badge">[^<]*<\/div>/g, '')
      cleanContent = cleanContent.replace(/<div class="gallery-caption">[^<]*<\/div>/g, '')
      
      // Optimize base64 images in content by using the medium-sized optimized image
      if (news.medium_url) {
        cleanContent = cleanContent.replace(
          /<img([^>]*?)src="data:image\/[^"]*"([^>]*?)>/g, 
          `<img$1src="${getOptimizedImageUrl(news.medium_url, 'medium')}"$2 loading="lazy">`
        )
      }
      
      // Add lazy loading to all remaining images
      cleanContent = cleanContent.replace(/<img([^>]*?)>/g, '<img$1 loading="lazy">')
      
      cleanContent = cleanContent.replace(/\s*\n\s*\n\s*/g, '\n\n')
      cleanContent = cleanContent.trim()
      
      return cleanContent
    }

    // Funciones para el indicador de tema
    const getThemeIcon = () => {
      const hour = new Date().getHours()
      if (hour >= 7 && hour < 12) return '🌅' // Amanecer
      if (hour >= 12 && hour < 18) return '☀️' // Día
      if (hour >= 18 && hour < 20) return '🌆' // Atardecer
      return '🌙' // Noche
    }

    const getThemeTooltip = () => {
      const hour = new Date().getHours()
      const currentTheme = document.documentElement.getAttribute('data-theme')
      const themeText = currentTheme === 'dark' ? 'Tema Oscuro' : 'Tema Claro'
      return `${themeText} - Horario: ${hour}:00h (Automático)`
    }

    // Sistema de tema automático día/noche
    const setThemeBasedOnTime = () => {
      const hour = new Date().getHours()
      // Tema oscuro: 18:00 - 7:00 (más natural)
      const theme = (hour >= 18 || hour < 7) ? 'dark' : 'light'
      
      // Debug info
      console.log(`🕐 [NewsList] Hora: ${hour}:${new Date().getMinutes()}, Tema: ${theme}`)
      
      document.documentElement.setAttribute('data-theme', theme)
      
      // Guardar preferencia
      localStorage.setItem('theme-preference', theme)
      localStorage.setItem('theme-set-time', Date.now().toString())
      
      // Force update del body si es necesario
      document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease'
    }

    // Verificar tema guardado y tiempo
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme-preference')
      const savedTime = localStorage.getItem('theme-set-time')
      
      console.log('🎨 [NewsList] Inicializando tema...')
      console.log('💾 Tema guardado:', savedTheme)
      
      if (savedTheme && savedTime) {
        const timeDiff = Date.now() - parseInt(savedTime)
        console.log('⏰ Tiempo desde última actualización:', Math.round(timeDiff / 60000), 'minutos')
        
        // Si han pasado más de 5 minutos, revisar el horario (más frecuente)
        if (timeDiff > 5 * 60 * 1000) {
          console.log('🔄 [NewsList] Actualizando tema por tiempo transcurrido')
          setThemeBasedOnTime()
        } else {
          console.log('✅ [NewsList] Usando tema guardado:', savedTheme)
          document.documentElement.setAttribute('data-theme', savedTheme)
        }
      } else {
        console.log('🆕 [NewsList] Primera vez, estableciendo tema basado en horario')
        setThemeBasedOnTime()
      }
    }

    // Funciones para manejo de videos
    const getVideoType = (videoUrl) => {
      if (!videoUrl) return null
      
      // Detectar YouTube
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        return 'youtube'
      }
      
      // Detectar Facebook
      if (videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch')) {
        return 'facebook'
      }
      
      // Detectar Vimeo
      if (videoUrl.includes('vimeo.com')) {
        return 'vimeo'
      }
      
      // Detectar archivos de video directos
      if (videoUrl.match(/\.(mp4|webm|ogg|avi|mov)(\?.*)?$/i)) {
        return 'direct'
      }
      
      return 'unknown'
    }

    const getYouTubeEmbedUrl = (url) => {
      let videoId = null
      
      // Formato: https://www.youtube.com/watch?v=VIDEO_ID
      const watchMatch = url.match(/[?&]v=([^&]+)/)
      if (watchMatch) {
        videoId = watchMatch[1]
      }
      
      // Formato: https://youtu.be/VIDEO_ID
      const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
      if (shortMatch) {
        videoId = shortMatch[1]
      }
      
      // Formato embed directo
      const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/)
      if (embedMatch) {
        videoId = embedMatch[1]
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`
      }
      
      return null
    }

    const getVimeoEmbedUrl = (url) => {
      const match = url.match(/vimeo\.com\/(\d+)/)
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}`
      }
      return null
    }

    const getFacebookEmbedUrl = (url) => {
      // Limpiar la URL y extraer el enlace original
      let cleanUrl = url
      
      // Si es un enlace fb.watch, obtener la URL original
      if (url.includes('fb.watch')) {
        // Para fb.watch necesitaríamos redirigir, por ahora usamos directamente
        cleanUrl = url
      }
      
      // Codificar la URL para el iframe de Facebook
      const encodedUrl = encodeURIComponent(cleanUrl)
      return `https://www.facebook.com/plugins/video.php?height=314&href=${encodedUrl}&show_text=false&width=560&t=0`
    }

    // Función para obtener URLs optimizadas de imágenes
    const getOptimizedImageUrl = (imageUrl, size = 'medium') => {
      if (!imageUrl) return ''
      
      // Si es una URL de Cloudinary, usar la URL directamente
      if (imageUrl.includes('cloudinary.com')) {
        return imageUrl
      }
      
      // Si es una URL local, agregar parámetros de optimización
      if (imageUrl.includes('localhost:8000') || imageUrl.includes('api/v1/news')) {
        const baseUrl = imageUrl.split('?')[0]
        const params = new URLSearchParams()
        
        switch (size) {
          case 'thumbnail':
            params.set('width', '400')
            params.set('height', '300')
            params.set('quality', '80')
            break
          case 'medium':
            params.set('width', '800')
            params.set('height', '600')
            params.set('quality', '85')
            break
          case 'large':
            params.set('width', '1200')
            params.set('height', '900')
            params.set('quality', '90')
            break
          default:
            params.set('width', '800')
            params.set('height', '600')
            params.set('quality', '85')
        }
        
        return `${baseUrl}?${params.toString()}`
      }
      
      // Si es una URL base64 o otra, devolver tal como está
      return imageUrl
    }

    // Verificar si hay un parámetro de noticia para abrir en modal al cargar
    onMounted(async () => {
      await loadNews()
      initializeTheme() // Inicializar sistema de tema
      
      if (route.query.news) {
        const newsId = parseInt(route.query.news)
        const news = allNews.value.find(item => item.id === newsId)
        if (news) {
          openNewsModal(news)
        }
      }
    })

    // Observar cambios en la ruta para abrir modal cuando se comparta un enlace
    watch(() => route.query.news, (newNewsId) => {
      if (newNewsId) {
        const newsId = parseInt(newNewsId)
        const news = allNews.value.find(item => item.id === newsId)
        if (news) {
          openNewsModal(news)
        }
      }
    })

    return {
      mobileMenuOpen,
      selectedNews,
      showContactModal,
      currentImageIndex,
      selectedCategory,
      contactForm,
      allNews,
      categories,
      filteredNews,
      toggleMobileMenu,
      openNewsModal,
      shareNews,
      copyToClipboard,
      closeNewsModal,
      openContactModal,
      closeContactModal,
      submitContact,
      formatDate,
      getNewsImages,
      nextImage,
      prevImage,
      goToImage,
      getCleanContent,
      getThemeIcon,
      getThemeTooltip,
      getVideoType,
      getYouTubeEmbedUrl,
      getVimeoEmbedUrl,
      getFacebookEmbedUrl,
      getOptimizedImageUrl
    }
  }
}
</script>

<style scoped>
/* Import the same styles from Home.vue */
@import url('../assets/styles.css');

/* Header Styles */
.header {
  background: var(--header-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--shadow-md);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: var(--transition);
  border-bottom: 2px solid transparent;
  background-image: linear-gradient(var(--header-bg), var(--header-bg)), 
                    linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-image {
  height: 55px;
  width: auto;
  transition: var(--transition);
}

.logo-image:hover {
  transform: scale(1.05);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: var(--transition);
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  color: var(--accent-color);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -0.25rem;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--accent-color);
  transition: var(--transition);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

/* Theme indicator */
.theme-indicator {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

.theme-icon {
  font-size: 1.2rem;
  cursor: help;
  padding: 0.5rem;
  border-radius: 50%;
  transition: var(--transition);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  background-size: 200% 200%;
  animation: themeGlow 3s ease-in-out infinite;
}

.theme-icon:hover {
  transform: scale(1.1);
}

@keyframes themeGlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-btn span {
  width: 25px;
  height: 3px;
  background-color: var(--primary-color);
  transition: var(--transition);
}

/* Main Content */
.main-content {
  margin-top: 70px;
  min-height: calc(100vh - 70px);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto;
}

/* Filter Section */
.filter-section {
  background-color: var(--bg-secondary);
  padding: 2rem 0;
  border-bottom: 1px solid var(--border-light);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.filter-btn {
  background: var(--bg-primary);
  border: 2px solid var(--border-light);
  color: var(--text-secondary);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.875rem;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.filter-btn.active {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(244, 119, 33, 0.3);
}

/* News Grid */
.news-grid-section {
  padding: 4rem 0;
  background-color: var(--bg-primary);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.news-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
  cursor: pointer;
  border: 1px solid var(--border-light);
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-color);
}

.card-image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
  background-color: #f0f0f0;
  background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.news-card:hover .card-image {
  transform: scale(1.05);
}

.card-category {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, var(--primary-color), #e6661a);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 15px rgba(244, 119, 33, 0.3);
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-excerpt {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-date {
  color: var(--text-light);
  font-size: 0.875rem;
  font-weight: 500;
}

/* Footer Styles */
.footer {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 3rem 0 1rem;
  position: relative;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--secondary-color), var(--primary-color), var(--secondary-color));
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.footer-logo-image {
  height: 32px;
  width: auto;
}

.footer-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.footer-section h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.footer-links,
.footer-contact {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-links li,
.footer-contact li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: var(--transition);
}

.footer-links a:hover {
  color: white;
}

.footer-contact li {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

/* Modal Styles - Import all modal styles from Home.vue */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  position: relative;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modern-modal {
  max-width: 900px !important;
  width: 95% !important;
  max-height: 95vh !important;
  padding: 0 !important;
  border-radius: 20px !important;
  overflow: hidden !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
  display: flex !important;
  flex-direction: column !important;
}

.modal-close {
  position: absolute !important;
  top: 1.5rem !important;
  right: 1.5rem !important;
  background: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(10px) !important;
  border: none !important;
  font-size: 1.5rem !important;
  cursor: pointer !important;
  color: white !important;
  transition: var(--transition) !important;
  width: 50px !important;
  height: 50px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 50% !important;
  z-index: 1002 !important;
  font-weight: bold !important;
}

.modal-close:hover {
  background: rgba(244, 119, 33, 0.9) !important;
  transform: scale(1.1) !important;
}

/* Modal Hero Section with Carousel */
.modal-hero {
  position: relative;
  height: 400px;
  overflow: hidden;
  flex-shrink: 0;
}

.hero-carousel-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.hero-carousel-slide.active {
  opacity: 1;
}

.hero-carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
}

/* Carousel Controls */
.hero-carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 3;
  transform: translateY(-50%);
}

.hero-carousel-btn {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.hero-carousel-btn:hover {
  background: rgba(244, 119, 33, 0.9);
  transform: scale(1.1);
}

/* Carousel Indicators */
.hero-carousel-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 3;
}

.hero-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  background-color: transparent;
  cursor: pointer;
  transition: var(--transition);
  backdrop-filter: blur(5px);
}

.hero-indicator.active,
.hero-indicator:hover {
  background-color: white;
  border-color: white;
  transform: scale(1.2);
}

/* Image Caption */
.hero-image-caption {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 500;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.image-counter {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
}

.modal-hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  z-index: 2;
}

.modal-meta-badges {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.modal-category-badge {
  background: linear-gradient(135deg, var(--primary-color), #e6661a);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 15px rgba(244, 119, 33, 0.3);
}

.modal-date-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.modal-title {
  color: white;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

/* Modal Body */
.modern-body {
  padding: 2rem;
  background: var(--bg-primary);
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.modal-video-section {
  margin-bottom: 2rem;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.modal-video {
  width: 100%;
  max-height: 400px;
  border-radius: 15px;
}

.iframe-video {
  width: 100%;
  height: 400px;
  border: none;
  border-radius: 15px;
}

.video-fallback {
  text-align: center;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 15px;
  border: 2px dashed var(--border-light);
}

.video-fallback p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-weight: 500;
}

.video-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  word-break: break-all;
}

.video-link:hover {
  text-decoration: underline;
}

/* Content Text Styling */
.modal-content-text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-secondary);
  white-space: pre-wrap; /* Preserva espacios y saltos de línea */
  word-wrap: break-word; /* Permite quebrar palabras largas */
}

.modal-content-text p {
  margin-bottom: 1.5rem;
  white-space: pre-wrap; /* Preserva formato de párrafos */
}

.modal-content-text p:first-child {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-primary);
}

.modal-content-text strong {
  color: var(--primary-color);
  font-weight: 700;
}

.modal-content-text ul,
.modal-content-text ol {
  margin: 1.5rem 0;
  padding-left: 2rem;
  white-space: normal; /* Listas con formato normal */
}

.modal-content-text li {
  margin-bottom: 0.75rem;
  position: relative;
  white-space: pre-wrap; /* Preserva formato en listas */
}

.modal-content-text ul li::marker {
  color: var(--primary-color);
}

.modal-content-text ol li::marker {
  color: var(--primary-color);
  font-weight: bold;
}

/* Estilos adicionales para preservar formato */
.modal-content-text h1,
.modal-content-text h2,
.modal-content-text h3,
.modal-content-text h4,
.modal-content-text h5,
.modal-content-text h6 {
  margin: 1.5rem 0 1rem 0;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.modal-content-text blockquote {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background-color: var(--bg-accent);
  border-left: 4px solid var(--primary-color);
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  font-style: italic;
  white-space: pre-wrap;
}

.modal-content-text pre {
  background-color: var(--bg-secondary);
  padding: 1rem;
  border-radius: var(--border-radius);
  overflow-x: auto;
  white-space: pre;
  font-family: 'Courier New', monospace;
}

.modal-content-text code {
  background-color: var(--bg-secondary);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

/* Modern News Gallery Styles */
.news-gallery {
  margin: 2.5rem 0;
  padding: 0;
  position: relative;
}

.news-gallery::before {
  content: "📸 Galería de Imágenes";
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 1rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.gallery-item {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: var(--bg-primary);
}

.gallery-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(244, 119, 33, 0.2);
}

.gallery-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.1);
}

.gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  color: white;
  padding: 1.5rem 1rem 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.gallery-item:hover .gallery-caption {
  transform: translateY(0);
}

.gallery-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, var(--primary-color), #e6661a);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(244, 119, 33, 0.3);
  z-index: 2;
}

/* Contact Form Styles */
.contact-form {
  max-width: 600px;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-accent) 100%);
  padding: 2.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid rgba(26, 54, 93, 0.1);
}

.form-group {
  margin-bottom: 1.75rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
}

.form-group label::after {
  content: '';
  position: absolute;
  bottom: -0.25rem;
  left: 0;
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
  border-radius: 1px;
}

.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid transparent;
  background-color: var(--bg-primary);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  font-family: inherit;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
}

.form-input::placeholder {
  color: var(--text-light);
  opacity: 0.8;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 4px rgba(229, 62, 62, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.form-input:hover:not(:focus) {
  border-color: var(--secondary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.form-input:valid {
  border-color: #48bb78;
}

.form-input:valid:focus {
  border-color: #48bb78;
  box-shadow: 0 0 0 4px rgba(72, 187, 120, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Textarea specific styles */
textarea.form-input {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}

/* Submit button enhanced */
.contact-form .btn-primary {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
  background: linear-gradient(135deg, var(--accent-color) 0%, #c53030 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(229, 62, 62, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  overflow: hidden;
  color: white;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.contact-form .btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.contact-form .btn-primary:hover::before {
  left: 100%;
}

.contact-form .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(229, 62, 62, 0.4);
}

.contact-form .btn-primary:active {
  transform: translateY(0);
}

/* Form header and subtitle */
.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  font-style: italic;
}

/* Label icons */
.label-icon {
  margin-right: 0.5rem;
  font-size: 1rem;
}

/* Button enhancements */
.btn-icon {
  margin-right: 0.5rem;
  font-size: 1rem;
}

/* Form footer */
.form-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.privacy-note {
  font-size: 0.875rem;
  color: var(--text-light);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: rgba(26, 54, 93, 0.05);
  border-radius: var(--border-radius);
  border-left: 3px solid var(--secondary-color);
}

.privacy-icon {
  font-size: 1rem;
}

.modal-header {
  padding: 2rem 2rem 0;
  text-align: center;
}

.modal-header h2 {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }
  
  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--bg-primary);
    box-shadow: var(--shadow-lg);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: var(--transition);
  }
  
  .nav-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-list {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .news-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .filter-btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.8rem;
  }
  
  .modern-modal {
    width: 95% !important;
    max-height: 95vh !important;
    margin: 2.5vh auto !important;
  }
  
  .modal-hero {
    height: 280px;
  }
  
  .hero-carousel-btn {
    width: 40px !important;
    height: 40px !important;
    font-size: 1.25rem !important;
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
  
  .modern-body {
    padding: 1.5rem;
  }
  
  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .gallery-caption {
    transform: translateY(0);
    background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4));
  }
  
  .contact-form {
    padding: 1.5rem;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .filters {
    gap: 0.75rem;
  }
  
  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
  
  .card-content {
    padding: 1.25rem;
  }
  
  .card-title {
    font-size: 1.125rem;
  }
}

/* Estilos para botones de compartir */
.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-secondary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .card-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
