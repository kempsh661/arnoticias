<template>
  <div class="news-detail">
    <!-- Meta tags dinámicos para SEO y redes sociales -->
    <MetaTags
      :title="metaTitle"
      :description="metaDescription"
      :image="metaImage"
      :url="metaUrl"
      type="article"
    />
    
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <img src="/assets/logos/logo-principal.png" alt="Arauca Noticias" class="logo-image">
            <h1 class="logo-text">
              <router-link to="/" class="logo-link">Arauca Noticias</router-link>
            </h1>
          </div>
          
          <nav class="nav" :class="{ 'nav-open': mobileMenuOpen }">
            <ul class="nav-list">
              <li><router-link to="/" class="nav-link">Inicio</router-link></li>
              <li><a href="/#destacadas" class="nav-link">Destacadas</a></li>
              <li><router-link to="/noticias" class="nav-link">Noticias</router-link></li>
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

    <main class="main-content">
      <div class="container">
        <article class="article" v-if="news && !isLoading">
          <header class="article-header">
            <div class="breadcrumb">
              <router-link to="/">Inicio</router-link>
              <span class="separator">›</span>
              <span class="current">{{ news.category }}</span>
            </div>
            
            <h1 class="article-title">{{ news.title }}</h1>
            
            <div class="article-meta">
              <span class="article-date">{{ formatDate(news.date) }}</span>
              <span class="article-category">{{ news.category }}</span>
              <span class="article-author">Por {{ news.author || 'Redacción Aruca Noticias' }}</span>
            </div>
          </header>

          <div class="article-content">
            <!-- Image Gallery/Carousel -->
            <div class="article-image-gallery" v-if="getNewsImages(news).length > 0">
              <div class="gallery-container">
                <div 
                  v-for="(image, index) in getNewsImages(news)" 
                  :key="index"
                  class="gallery-slide"
                  :class="{ active: currentImageIndex === index }"
                >
                  <img 
                    :src="image.src" 
                    :alt="image.alt" 
                    class="gallery-image"
                    :loading="index === 0 ? 'eager' : 'lazy'"
                    :decoding="index === 0 ? 'sync' : 'async'"
                  >
                  <div class="gallery-overlay"></div>
                </div>
                
                <!-- Gallery Controls -->
                <div v-if="getNewsImages(news).length > 1" class="gallery-controls">
                  <button @click="prevImage" class="gallery-btn gallery-prev">‹</button>
                  <button @click="nextImage" class="gallery-btn gallery-next">›</button>
                </div>
                
                <!-- Gallery Indicators -->
                <div v-if="getNewsImages(news).length > 1" class="gallery-indicators">
                  <button 
                    v-for="(image, index) in getNewsImages(news)" 
                    :key="index"
                    @click="goToImage(index)"
                    class="gallery-indicator"
                    :class="{ active: currentImageIndex === index }"
                  ></button>
                </div>
                
                <!-- Image Caption -->
                <div class="gallery-caption">
                  {{ getNewsImages(news)[currentImageIndex]?.caption }}
                  <span v-if="getNewsImages(news).length > 1" class="image-counter">
                    {{ currentImageIndex + 1 }} / {{ getNewsImages(news).length }}
                  </span>
                </div>
              </div>
            </div>

            <div class="article-video" v-if="news.video">
              <!-- Video de YouTube -->
              <iframe 
                v-if="getVideoType(news.video) === 'youtube'"
                :src="getYouTubeEmbedUrl(news.video)"
                class="article-video-iframe"
                frameborder="0"
                allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
              
              <!-- Video de Facebook -->
              <iframe 
                v-else-if="getVideoType(news.video) === 'facebook'"
                :src="getFacebookEmbedUrl(news.video)"
                class="article-video-iframe"
                frameborder="0"
                allowfullscreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
              
              <!-- Video de Vimeo -->
              <iframe 
                v-else-if="getVideoType(news.video) === 'vimeo'"
                :src="getVimeoEmbedUrl(news.video)"
                class="article-video-iframe"
                frameborder="0"
                allowfullscreen
              ></iframe>
              
              <!-- Video directo (MP4, etc.) -->
              <video 
                v-else-if="getVideoType(news.video) === 'direct'"
                controls 
                :poster="getOptimizedImageUrl(news.image_url || news.image, 'large')"
                class="article-video-element"
              >
                <source :src="news.video" type="video/mp4">
                Tu navegador no soporta el elemento video.
              </video>
              
              <!-- Fallback para URLs desconocidas -->
              <div v-else class="video-fallback">
                <p>⚠️ Tipo de video no soportado.</p>
                <p>Tipos soportados: YouTube, Facebook, Vimeo, MP4</p>
                <a :href="news.video" target="_blank" class="video-link">
                  Abrir video en nueva pestaña: {{ news.video }}
                </a>
              </div>
            </div>

            <div class="article-body">
              <div class="article-excerpt">
                {{ news.excerpt }}
              </div>
              
              <div class="article-text" v-html="news.content"></div>
            </div>

            <div class="article-tags" v-if="news.tags">
              <h4>Etiquetas:</h4>
              <div class="tags-list">
                <span 
                  v-for="tag in news.tags" 
                  :key="tag" 
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </article>

        <div v-else-if="isLoading" class="loading">
          <!-- Skeleton Loading -->
          <div class="skeleton-container">
            <div class="skeleton-header">
              <div class="skeleton-breadcrumb"></div>
              <div class="skeleton-title"></div>
              <div class="skeleton-meta">
                <div class="skeleton-meta-item"></div>
                <div class="skeleton-meta-item"></div>
                <div class="skeleton-meta-item"></div>
              </div>
            </div>
            
            <div class="skeleton-content">
              <div class="skeleton-image"></div>
              <div class="skeleton-text">
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
              </div>
              <div class="skeleton-text">
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="hasError" class="error-container">
          <div class="error-content">
            <div class="error-icon">⚠️</div>
            <h2 class="error-title">Oops! Algo salió mal</h2>
            <p class="error-message">{{ errorMessage }}</p>
            <div class="error-actions">
              <button @click="loadCurrentNews" class="btn btn-primary">
                🔄 Reintentar
              </button>
              <router-link to="/" class="btn btn-secondary">
                🏠 Ir al Inicio
              </router-link>
            </div>
          </div>
        </div>

        <!-- Related News Section -->
        <section class="related-section" v-if="relatedNews.length > 0">
          <h2 class="section-title">Noticias Relacionadas</h2>
          <div class="related-grid">
            <article 
              v-for="relatedItem in relatedNews" 
              :key="relatedItem.id"
              class="related-card"
              @click="goToNews(relatedItem.id)"
            >
              <img :src="getOptimizedImageUrl(relatedItem.image_url || relatedItem.image, 'medium')" :alt="relatedItem.title" class="related-image">
              <div class="related-content">
                <h3 class="related-title">{{ relatedItem.title }}</h3>
                <p class="related-excerpt">{{ relatedItem.excerpt }}</p>
                <div class="related-meta">
                  <span>{{ formatDate(relatedItem.date) }}</span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
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
              <li><router-link to="/">Inicio</router-link></li>
              <li><a href="/#destacadas">Destacadas</a></li>
              <li><router-link to="/noticias">Noticias</router-link></li>
              <li><a href="/#nosotros">Nosotros</a></li>
              <li><a href="/#contacto">Contacto</a></li>
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
          
          <div class="footer-section">
            <h4>Síguenos</h4>
            <div class="social-links">
              <a href="https://www.facebook.com/arauca.noticia" target="_blank" rel="noopener noreferrer" class="social-link facebook-link">
                <svg class="social-logo" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a href="https://www.instagram.com/arauca_noticias20?igsh=OHVuemY2dXhnaGpr" target="_blank" rel="noopener noreferrer" class="social-link instagram-link">
                <svg class="social-logo" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.79 0-1.5.61-1.5 1.5s.71 1.5 1.5 1.5 1.5-.61 1.5-1.5-.71-1.5-1.5-1.5z"/>
                </svg>
                Instagram
              </a>
              <a href="https://x.com/arauca1noticias?s=21" target="_blank" rel="noopener noreferrer" class="social-link twitter-link">
                <svg class="social-logo" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X (Twitter)
              </a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 Arauca Noticias. Todos los derechos reservados.</p>
          <div class="footer-legal">
            <a href="#" @click="openPrivacyModal">Política de Privacidad</a>
            <a href="#" @click="openTermsModal">Términos de Uso</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Privacy Policy Modal -->
    <div v-if="showPrivacyModal" class="modal-overlay" @click="closePrivacyModal">
      <div class="modal-content policy-modal" @click.stop>
        <button @click="closePrivacyModal" class="modal-close" title="Cerrar">&times;</button>
        <div class="modal-header">
          <h2>Política de Privacidad</h2>
        </div>
        <div class="modal-body policy-body">
          <div class="policy-content">
            <p class="policy-date"><strong>Última actualización:</strong> 2 de septiembre de 2025</p>
            
            <h3>1. Información que recopilamos</h3>
            <p>Recopilamos información que nos proporcionas directamente, como cuando te suscribes a nuestro boletín, nos contactas o participas en nuestras encuestas.</p>
            
            <h3>2. Cómo usamos tu información</h3>
            <p>Utilizamos la información recopilada para:</p>
            <ul>
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Enviarte actualizaciones y noticias relevantes</li>
              <li>Responder a tus consultas y comentarios</li>
              <li>Analizar el uso de nuestro sitio web</li>
            </ul>
            
            <h3>3. Compartir información</h3>
            <p>No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto cuando sea necesario para proporcionar nuestros servicios o cuando la ley lo requiera.</p>
            
            <h3>4. Seguridad</h3>
            <p>Implementamos medidas de seguridad apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.</p>
            
            <h3>5. Tus derechos</h3>
            <p>Tienes derecho a acceder, corregir, eliminar o restringir el procesamiento de tu información personal. Para ejercer estos derechos, contáctanos.</p>
            
            <h3>6. Contacto</h3>
            <p>Si tienes preguntas sobre esta Política de Privacidad, puedes contactarnos en:</p>
            <p>📧 Email: Araucanoticias2019@gmail.com<br>
            📱 Teléfono: +57 310 2279487</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Terms of Use Modal -->
    <div v-if="showTermsModal" class="modal-overlay" @click="closeTermsModal">
      <div class="modal-content policy-modal" @click.stop>
        <button @click="closeTermsModal" class="modal-close" title="Cerrar">&times;</button>
        <div class="modal-header">
          <h2>Términos de Uso</h2>
        </div>
        <div class="modal-body policy-body">
          <div class="policy-content">
            <p class="policy-date"><strong>Última actualización:</strong> 2 de septiembre de 2025</p>
            
            <h3>1. Aceptación de los términos</h3>
            <p>Al acceder y usar este sitio web, aceptas cumplir con estos términos de uso y todas las leyes y regulaciones aplicables.</p>
            
            <h3>2. Uso del sitio</h3>
            <p>Puedes usar nuestro sitio web para:</p>
            <ul>
              <li>Leer noticias y artículos informativos</li>
              <li>Compartir contenido en redes sociales</li>
              <li>Contactarnos para consultas</li>
              <li>Suscribirte a nuestro boletín</li>
            </ul>
            
            <h3>3. Contenido</h3>
            <p>Todo el contenido publicado en este sitio web es propiedad de Arauca Noticias o se usa con permiso. No puedes reproducir, distribuir o modificar nuestro contenido sin autorización escrita.</p>
            
            <h3>4. Conducta del usuario</h3>
            <p>Al usar nuestro sitio, te comprometes a:</p>
            <ul>
              <li>No usar el sitio para actividades ilegales</li>
              <li>No intentar acceder a áreas restringidas</li>
              <li>No interferir con el funcionamiento del sitio</li>
              <li>Respetar los derechos de otros usuarios</li>
            </ul>
            
            <h3>5. Limitación de responsabilidad</h3>
            <p>Arauca Noticias no se hace responsable por daños directos, indirectos, incidentales o consecuenciales que puedan resultar del uso de este sitio web.</p>
            
            <h3>6. Modificaciones</h3>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio.</p>
            
            <h3>7. Contacto</h3>
            <p>Para preguntas sobre estos términos, contáctanos en:</p>
            <p>📧 Email: Araucanoticias2019@gmail.com<br>
            📱 Teléfono: +57 310 2279487</p>
          </div>
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { newsService } from '../services/api.js'
import MetaTags from './MetaTags.vue'
import { useTheme } from '../composables/useTheme.js'

export default {
  name: 'NewsDetail',
  components: {
    MetaTags
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const news = ref(null)
    const allNews = ref([])
    const isLoading = ref(true)
    const hasError = ref(false)
    const errorMessage = ref('')
    const currentImageIndex = ref(0)
    const showPrivacyModal = ref(false)
    const showTermsModal = ref(false)
    const mobileMenuOpen = ref(false)
    const showContactModal = ref(false)
    const contactForm = ref({
      name: '',
      email: '',
      subject: '',
      message: ''
    })

    // Cargar noticias desde el API
    const loadNews = async () => {
      try {
        console.log('🔄 NewsDetail - Cargando noticias relacionadas...')
        const response = await newsService.getAll({ per_page: 100 })
        console.log('📰 NewsDetail - Respuesta de noticias relacionadas:', response)
        allNews.value = response.data.data || []
        console.log('✅ NewsDetail - Noticias relacionadas cargadas:', allNews.value.length)
      } catch (error) {
        console.error('❌ NewsDetail - Error cargando noticias relacionadas:', error)
        allNews.value = []
      }
    }

    const relatedNews = computed(() => {
      if (!news.value) {
        console.log('🔍 NewsDetail - No hay noticia actual para calcular relacionadas')
        return []
      }
      
      const related = allNews.value
        .filter(item => item.id !== news.value.id && item.category === news.value.category)
        .slice(0, 3)
      
      console.log('🔗 NewsDetail - Noticias relacionadas calculadas:', related.length)
      console.log('📊 NewsDetail - Categoría actual:', news.value.category)
      console.log('📊 NewsDetail - Total noticias disponibles:', allNews.value.length)
      
      return related
    })

    // Meta tags computados para SEO y redes sociales
    const metaTitle = computed(() => {
      if (!news.value) return 'Arauca Noticias - Tu fuente confiable de información'
      return `${news.value.title} - Arauca Noticias`
    })

    const metaDescription = computed(() => {
      if (!news.value) return 'Mantente informado con las últimas noticias y acontecimientos'
      return news.value.excerpt || news.value.content?.substring(0, 160) || 'Mantente informado con las últimas noticias y acontecimientos'
    })

    const metaImage = computed(() => {
      if (!news.value) return 'https://araucanoticias.com.co/logo-aruca.png'
      
      // Priorizar imagen de la galería si está disponible
      if (news.value.gallery && news.value.gallery.length > 0) {
        const mainImage = news.value.gallery.find(img => img.is_main) || news.value.gallery[0]
        
        // Para redes sociales, usar imagen optimizada de 1200x630
        if (mainImage.social_url) {
          return mainImage.social_url
        } else if (mainImage.cloudinary_secure_url) {
          // Si está en Cloudinary, generar URL optimizada para redes sociales
          return `${mainImage.cloudinary_secure_url.replace('/upload/', '/upload/w_1200,h_630,c_fill,f_auto,q_auto/')}`
        } else if (mainImage.large_url) {
          return mainImage.large_url
        } else if (mainImage.medium_url) {
          return mainImage.medium_url
        } else if (mainImage.optimized_url) {
          return mainImage.optimized_url
        }
      }
      
      // Fallback a imagen principal optimizada para redes sociales
      const fallbackImage = news.value.image_url || news.value.image
      if (fallbackImage && fallbackImage.includes('cloudinary.com')) {
        // Si es Cloudinary, optimizar para redes sociales
        return fallbackImage.replace('/upload/', '/upload/w_1200,h_630,c_fill,f_auto,q_auto/')
      }
      
      return getOptimizedImageUrl(fallbackImage, 'social')
    })

    const metaUrl = computed(() => {
      if (!news.value) return 'https://araucanoticias.com.co'
      return `https://araucanoticias.com.co/noticia/${news.value.id}`
    })


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

    const goToNews = (newsId) => {
      router.push(`/noticia/${newsId}`)
    }

    // Cache para imágenes procesadas
    const imageCache = new Map()

    // Función para extraer imágenes de una noticia (optimizada)
    const getNewsImages = (news) => {
      if (!news) return []
      
      // Verificar cache
      const cacheKey = `news_${news.id}_images`
      if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey)
      }
      
      const images = []
      
      // Prioridad 1: Usar galería nueva si existe
      if (news.gallery && news.gallery.length > 0) {
        // Ordenar por orden y mostrar imagen principal primero
        const sortedGallery = [...news.gallery].sort((a, b) => {
          if (a.is_main) return -1  // Imagen principal va primero
          if (b.is_main) return 1
          return a.order - b.order  // Luego por orden
        })
        
        sortedGallery.forEach((image, index) => {
          const imageUrl = image.large_url || image.medium_url || image.thumbnail_url || image.optimized_url
          
          if (imageUrl) {
            images.push({
              src: getOptimizedImageUrl(imageUrl, 'large'),
              alt: image.alt_text || news.title,
              caption: image.caption || (image.is_main ? 'Imagen principal' : `Imagen ${index + 1}`)
            })
          }
        })
        
        // Guardar en cache
        imageCache.set(cacheKey, images)
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
      if (news.content && images.length === 0) {
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
      
      // Guardar en cache
      imageCache.set(cacheKey, images)
      return images
    }

    const nextImage = () => {
      if (news.value) {
        const images = getNewsImages(news.value)
        currentImageIndex.value = (currentImageIndex.value + 1) % images.length
      }
    }

    const prevImage = () => {
      if (news.value) {
        const images = getNewsImages(news.value)
        currentImageIndex.value = currentImageIndex.value === 0 ? images.length - 1 : currentImageIndex.value - 1
      }
    }

    const goToImage = (index) => {
      currentImageIndex.value = index
    }

    // Función para preload de la primera imagen
    const preloadFirstImage = () => {
      if (news.value) {
        const images = getNewsImages(news.value)
        if (images.length > 0) {
          const img = new Image()
          img.src = images[0].src
          console.log('🖼️ Preloading first image:', images[0].src)
        }
      }
    }

    // Funciones para modales de footer
    const openPrivacyModal = () => {
      showPrivacyModal.value = true
      document.body.style.overflow = 'hidden'
    }

    const closePrivacyModal = () => {
      showPrivacyModal.value = false
      document.body.style.overflow = 'auto'
    }

    const openTermsModal = () => {
      showTermsModal.value = true
      document.body.style.overflow = 'hidden'
    }

    const closeTermsModal = () => {
      showTermsModal.value = false
      document.body.style.overflow = 'auto'
    }

    // Función para obtener URLs optimizadas de imágenes
    const getOptimizedImageUrl = (imageUrl, size = 'medium') => {
      if (!imageUrl) return ''
      
      // Si es una URL de Cloudinary, optimizar según el tamaño
      if (imageUrl.includes('cloudinary.com')) {
        const baseUrl = imageUrl.split('/upload/')[0] + '/upload/'
        const imagePath = imageUrl.split('/upload/')[1]
        
        switch (size) {
          case 'thumbnail':
            return `${baseUrl}w_400,h_300,c_fill,f_auto,q_auto/${imagePath}`
          case 'medium':
            return `${baseUrl}w_800,h_600,c_fill,f_auto,q_auto/${imagePath}`
          case 'large':
            return `${baseUrl}w_1200,h_900,c_fill,f_auto,q_auto/${imagePath}`
          case 'social':
            return `${baseUrl}w_1200,h_630,c_fill,f_auto,q_auto/${imagePath}`
          default:
            return `${baseUrl}w_800,h_600,c_fill,f_auto,q_auto/${imagePath}`
        }
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
          case 'social':
            params.set('width', '1200')
            params.set('height', '630')
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

    // Usar el composable de tema
    const { currentTheme, getThemeIcon, getThemeTooltip } = useTheme()

    // Funciones para el menú móvil
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    // Funciones para el modal de contacto
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

    const loadCurrentNews = async () => {
      try {
        isLoading.value = true
        hasError.value = false
        errorMessage.value = ''
        const newsId = parseInt(route.params.id)
        console.log('🔍 Loading news with ID:', newsId) // Debug log
        
        if (isNaN(newsId) || newsId <= 0) {
          console.error('❌ Invalid news ID:', route.params.id)
          hasError.value = true
          errorMessage.value = 'ID de noticia inválido'
          news.value = null
          return
        }
        
        const response = await newsService.getById(newsId)
        console.log('📰 News API Response:', response) // Debug log
        console.log('📰 Response data:', response.data) // Debug log
        
        if (response.data) {
          news.value = response.data
          console.log('✅ News loaded successfully:', news.value) // Debug log
          console.log('📅 News date value:', news.value.date) // Debug log
          console.log('📅 News date type:', typeof news.value.date) // Debug log
          
          // Preload primera imagen para mejor UX
          preloadFirstImage()
        } else {
          console.error('❌ No data in response')
          throw new Error('No data received from API')
        }
        
        // Cargar noticias relacionadas de forma diferida
        setTimeout(() => {
          loadNews()
        }, 100)
      } catch (error) {
        console.error('❌ Error cargando noticia:', error)
        console.error('❌ Error details:', error.message)
        console.error('❌ Error response:', error.response?.data)
        
        // Mostrar mensaje de error
        hasError.value = true
        news.value = null
        
        if (error.response?.status === 404) {
          errorMessage.value = 'Noticia no encontrada'
          console.log('🔄 Noticia no encontrada, redirigiendo al inicio en 3 segundos...')
          // Mostrar mensaje temporal antes de redirigir
          setTimeout(() => {
            router.push('/')
          }, 3000)
        } else if (error.response?.status === 500) {
          errorMessage.value = 'Error del servidor. Inténtalo más tarde.'
        } else if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
          errorMessage.value = 'Sin conexión a internet. Verifica tu conexión.'
        } else {
          errorMessage.value = 'Error al cargar la noticia. Inténtalo más tarde.'
        }
      } finally {
        isLoading.value = false
        console.log('🏁 Loading finished, isLoading:', isLoading.value) // Debug log
      }
    }

    // Funciones para manejo de videos
    const getVideoType = (videoUrl) => {
      if (!videoUrl) {
        console.log('🔍 [Video] No hay URL de video')
        return null
      }
      
      console.log('🔍 [Video] Analizando URL:', videoUrl)
      
      // Detectar YouTube
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        console.log('📺 [Video] Detectado YouTube')
        return 'youtube'
      }
      
      // Detectar Facebook
      if (videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch')) {
        console.log('📺 [Video] Detectado Facebook')
        return 'facebook'
      }
      
      // Detectar Vimeo
      if (videoUrl.includes('vimeo.com')) {
        console.log('📺 [Video] Detectado Vimeo')
        return 'vimeo'
      }
      
      // Detectar archivos de video directos
      if (videoUrl.match(/\.(mp4|webm|ogg|avi|mov)(\?.*)?$/i)) {
        console.log('📺 [Video] Detectado video directo')
        return 'direct'
      }
      
      console.log('⚠️ [Video] Tipo de video desconocido:', videoUrl)
      return 'unknown'
    }

    const getYouTubeEmbedUrl = (url) => {
      console.log('🔗 [YouTube] Generando URL embed para:', url)
      let videoId = null
      
      // Formato: https://www.youtube.com/watch?v=VIDEO_ID
      const watchMatch = url.match(/[?&]v=([^&]+)/)
      if (watchMatch) {
        videoId = watchMatch[1]
        console.log('🔗 [YouTube] Video ID extraído (watch):', videoId)
      }
      
      // Formato: https://youtu.be/VIDEO_ID
      const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
      if (shortMatch) {
        videoId = shortMatch[1]
        console.log('🔗 [YouTube] Video ID extraído (short):', videoId)
      }
      
      // Formato embed directo
      const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/)
      if (embedMatch) {
        videoId = embedMatch[1]
        console.log('🔗 [YouTube] Video ID extraído (embed):', videoId)
      }
      
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`
        console.log('🔗 [YouTube] URL embed generada:', embedUrl)
        return embedUrl
      }
      
      console.log('❌ [YouTube] No se pudo extraer video ID')
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

    onMounted(async () => {
      await loadCurrentNews()
      // Scroll to top when component mounts
      window.scrollTo(0, 0)
    })

    // Observar cambios en la ruta para recargar la noticia
    watch(() => route.params.id, async (newId, oldId) => {
      if (newId !== oldId) {
        console.log('🔄 Route changed, loading new news:', newId)
        await loadCurrentNews()
        window.scrollTo(0, 0)
      }
    })

    return {
      news,
      isLoading,
      hasError,
      errorMessage,
      currentImageIndex,
      showPrivacyModal,
      showTermsModal,
      mobileMenuOpen,
      showContactModal,
      contactForm,
      relatedNews,
      formatDate,
      goToNews,
      getNewsImages,
      nextImage,
      prevImage,
      goToImage,
      preloadFirstImage,
      openPrivacyModal,
      closePrivacyModal,
      openTermsModal,
      closeTermsModal,
      toggleMobileMenu,
      openContactModal,
      closeContactModal,
      submitContact,
      getOptimizedImageUrl,
      getThemeIcon,
      getThemeTooltip,
      getVideoType,
      getYouTubeEmbedUrl,
      getVimeoEmbedUrl,
      getFacebookEmbedUrl,
      metaTitle,
      metaDescription,
      metaImage,
      metaUrl
    }
  }
}
</script>

<style scoped>
/* Header styles reused from Home component */
.header {
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-sm);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
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
  height: 40px;
  width: auto;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.logo-link {
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
}

.nav-link:hover {
  color: var(--accent-color);
}

/* Main content styles */
.main-content {
  margin-top: 70px;
  padding: 2rem 0;
  min-height: calc(100vh - 70px);
}

.article {
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: 3rem;
}

.article-header {
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.breadcrumb {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 1rem;
}

.breadcrumb a {
  color: var(--secondary-color);
  text-decoration: none;
}

.breadcrumb a:hover {
  color: var(--accent-color);
}

.separator {
  margin: 0 0.5rem;
}

.current {
  color: var(--text-secondary);
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-light);
}

.article-date,
.article-author {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.article-category {
  background-color: var(--accent-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.article-content {
  padding: 2rem;
}

/* Image Gallery Styles */
.article-image-gallery {
  margin-bottom: 2rem;
  position: relative;
}

.gallery-container {
  position: relative;
  height: 500px;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.gallery-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.gallery-slide.active {
  opacity: 1;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-overlay {
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

/* Gallery Controls */
.gallery-controls {
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

.gallery-btn {
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

.gallery-btn:hover {
  background: rgba(244, 119, 33, 0.9);
  transform: scale(1.1);
}

/* Gallery Indicators */
.gallery-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 3;
}

.gallery-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  background-color: transparent;
  cursor: pointer;
  transition: var(--transition);
  backdrop-filter: blur(5px);
}

.gallery-indicator.active,
.gallery-indicator:hover {
  background-color: white;
  border-color: white;
  transform: scale(1.2);
}

/* Image Caption */
.gallery-caption {
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

/* Legacy single image styles (fallback) */
.article-image {
  margin-bottom: 2rem;
}

.article-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: var(--border-radius);
}

.image-caption {
  font-size: 0.875rem;
  color: var(--text-light);
  font-style: italic;
  margin-top: 0.75rem;
  text-align: center;
}

.article-video {
  margin-bottom: 2rem;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.article-video-element {
  width: 100%;
  max-height: 400px;
  border-radius: 15px;
}

.article-video-iframe {
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

.article-excerpt {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--bg-accent);
  border-left: 4px solid var(--accent-color);
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

.article-text {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--text-primary);
  white-space: pre-wrap; /* Preserva espacios y saltos de línea */
  word-wrap: break-word; /* Permite quebrar palabras largas */
}

.article-text p {
  margin-bottom: 1.5rem;
  white-space: pre-wrap; /* Preserva formato de párrafos */
}

.article-text ul,
.article-text ol {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
  white-space: normal; /* Listas con formato normal */
}

.article-text li {
  margin-bottom: 0.5rem;
  white-space: pre-wrap; /* Preserva formato en listas */
}

/* Estilos adicionales para preservar formato */
.article-text h1,
.article-text h2,
.article-text h3,
.article-text h4,
.article-text h5,
.article-text h6 {
  margin: 1.5rem 0 1rem 0;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.article-text blockquote {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background-color: var(--bg-accent);
  border-left: 4px solid var(--primary-color);
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  font-style: italic;
  white-space: pre-wrap;
}

.article-text pre {
  background-color: var(--bg-secondary);
  padding: 1rem;
  border-radius: var(--border-radius);
  overflow-x: auto;
  white-space: pre;
  font-family: 'Courier New', monospace;
}

.article-text code {
  background-color: var(--bg-secondary);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.article-tags {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.article-tags h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  background-color: var(--bg-accent);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  font-size: 0.875rem;
  text-transform: lowercase;
}

/* Related news styles */
.related-section {
  max-width: 1000px;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: center;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.related-card {
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
}

.related-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.related-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.related-content {
  padding: 1.5rem;
}

.related-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.related-excerpt {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-meta {
  font-size: 0.75rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Loading state */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem;
  color: var(--text-light);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-light);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Skeleton Loading Styles */
.skeleton-container {
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.skeleton-header {
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.skeleton-breadcrumb {
  height: 16px;
  width: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.skeleton-title {
  height: 40px;
  width: 80%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.skeleton-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.skeleton-meta-item {
  height: 20px;
  width: 120px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-content {
  padding: 2rem;
}

.skeleton-image {
  height: 400px;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
}

.skeleton-text {
  margin-bottom: 1.5rem;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.skeleton-line:last-child {
  margin-bottom: 0;
}

.skeleton-line.short {
  width: 60%;
}

@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Error state */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem;
  color: var(--text-light);
}

.error-content {
  max-width: 500px;
  margin: 0 auto;
}

.error-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.error-content p {
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
}

.error-content ul {
  text-align: left;
  margin-bottom: 2rem;
  color: var(--text-secondary);
}

.error-content li {
  margin-bottom: 0.5rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Error Container Styles */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 2rem;
}

.error-container .error-content {
  max-width: 500px;
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  padding: 3rem 2rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.error-container .error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.error-container .error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.error-container .error-message {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-container .error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.error-container .error-actions .btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.error-container .error-actions .btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.error-container .error-actions .btn-primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

.error-container .error-actions .btn-secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.error-container .error-actions .btn-secondary:hover {
  background-color: var(--border-light);
  transform: translateY(-2px);
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  text-decoration: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: var(--transition);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 119, 33, 0.3);
}

/* Footer styles */
.footer {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 3rem 0 1rem;
  position: relative;
  margin-top: 4rem;
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

.social-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.social-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 0.5rem;
}

.social-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.social-logo {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.facebook-link:hover {
  background: linear-gradient(135deg, #1877f2, #0d65d9);
  box-shadow: 0 6px 20px rgba(24, 119, 242, 0.4);
}

.instagram-link:hover {
  background: linear-gradient(135deg, #e4405f, #c13584, #833ab4);
  box-shadow: 0 6px 20px rgba(228, 64, 95, 0.4);
}

.twitter-link:hover {
  background: linear-gradient(135deg, #333333, #000000);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.footer-legal {
  display: flex;
  gap: 1rem;
}

.footer-legal a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: var(--transition);
}

.footer-legal a:hover {
  color: white;
}

/* Modal styles for policy and terms */
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

.policy-modal {
  max-width: 800px !important;
  width: 95% !important;
  max-height: 95vh !important;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  transition: var(--transition);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 1002;
  font-weight: bold;
}

.modal-close:hover {
  background: rgba(244, 119, 33, 0.9);
  transform: scale(1.1);
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

.policy-body {
  padding: 2rem;
}

.policy-content {
  line-height: 1.7;
  color: var(--text-primary);
}

.policy-date {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--bg-accent);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary-color);
}

.policy-content h3 {
  color: var(--primary-color);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
}

.policy-content h3:first-of-type {
  margin-top: 0;
}

.policy-content p {
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.policy-content ul {
  margin: 1rem 0;
  padding-left: 2rem;
}

.policy-content li {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

/* Mobile menu button */
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

/* Responsive design */
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
    border-radius: 0 0 1rem 1rem;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
  }
  
  .nav.nav-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-list {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .article-title {
    font-size: 2rem;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .article-header,
  .article-content {
    padding: 1.5rem;
  }
  
  .article-text {
    font-size: 1rem;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
  
  /* Gallery responsive */
  .gallery-container {
    height: 300px;
  }
  
  .gallery-btn {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
  
  .gallery-caption {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }
  
  /* Footer responsive */
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .footer-legal {
    justify-content: center;
  }
  
  .social-links {
    gap: 0.75rem;
  }
  
  .social-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 1rem 0;
  }
  
  .article-title {
    font-size: 1.75rem;
  }
  
  .article-header,
  .article-content {
    padding: 1rem;
  }
  
  .article-excerpt {
    font-size: 1.125rem;
    padding: 1rem;
  }
}
</style>

