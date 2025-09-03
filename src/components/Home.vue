<template>
  <div class="home">
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
              <li><a href="#inicio" @click="scrollToSection('inicio')" class="nav-link">Inicio</a></li>
              <li><a href="#destacadas" @click="scrollToSection('destacadas')" class="nav-link">Destacadas</a></li>
              <li><a href="/noticias" class="nav-link">Noticias</a></li>
              <li><a href="#nosotros" @click="scrollToSection('nosotros')" class="nav-link">Nosotros</a></li>
              <li><a href="#contacto" @click="openContactModal" class="nav-link">Contacto</a></li>
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
    <main>
      <!-- Hero Carousel Section -->
      <section id="inicio" class="hero-section">
        <div class="carousel-container">
          <div class="carousel" ref="carousel">
            <div 
              v-for="(news, index) in featuredNews" 
              :key="index"
              class="carousel-slide"
              :class="{ active: currentSlide === index }"
            >
              <div class="slide-image">
                <img :src="news.image" :alt="news.title" />
                <div class="slide-overlay"></div>
              </div>
              <div class="slide-content">
                <div class="container">
                  <h2 class="slide-title">{{ news.title }}</h2>
                  <p class="slide-excerpt">{{ news.excerpt }}</p>
                  <button @click="openNewsModal(news)" class="btn btn-primary">
                    Leer Más
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="carousel-controls">
            <button @click="prevSlide" class="carousel-btn carousel-prev">‹</button>
            <button @click="nextSlide" class="carousel-btn carousel-next">›</button>
          </div>
          
          <div class="carousel-indicators">
            <button 
              v-for="(_, index) in featuredNews" 
              :key="index"
              @click="goToSlide(index)"
              class="indicator"
              :class="{ active: currentSlide === index }"
            ></button>
          </div>
        </div>
      </section>

      <!-- Featured News Section -->
      <section id="destacadas" class="section featured-section">
        <div class="container">
          <h2 class="section-title">Noticias Destacadas</h2>
          <div class="grid grid-3">
            <article 
              v-for="news in highlightedNews" 
              :key="news.id"
              class="news-card card"
              @click="openNewsModal(news)"
            >
              <img :src="news.image" :alt="news.title" class="card-image">
              <div class="card-content">
                <h3 class="card-title">{{ news.title }}</h3>
                <p class="card-excerpt">{{ news.excerpt }}</p>
                <div class="card-meta">
                  <span>{{ formatDate(news.date) }}</span>
                  <span>{{ news.category }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- About Section -->
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
                <img src="/assets/logos/director-noticiero.jpg" alt="Director de Arauca Noticias">
                <div class="image-caption">Director del Noticiero</div>
              </div>
            </div>
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
              <li><a href="#inicio" @click="scrollToSection('inicio')">Inicio</a></li>
              <li><a href="#destacadas" @click="scrollToSection('destacadas')">Destacadas</a></li>
              <li><a href="/noticias">Noticias</a></li>
              <li><a href="#nosotros" @click="scrollToSection('nosotros')">Nosotros</a></li>
              <li><a href="#contacto" @click="openContactModal">Contacto</a></li>
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
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
            <video controls :poster="selectedNews.image" class="modal-video">
              <source :src="selectedNews.video" type="video/mp4">
              Tu navegador no soporta el elemento video.
            </video>
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

            <h3>1. Información que Recopilamos</h3>
            <p>En Arauca Noticias, respetamos tu privacidad y nos comprometemos a proteger tu información personal. Recopilamos la siguiente información:</p>
            <ul>
              <li><strong>Información de Contacto:</strong> Nombre, dirección de correo electrónico cuando nos contactas a través de nuestros formularios.</li>
              <li><strong>Información de Navegación:</strong> Datos sobre cómo usas nuestro sitio web, incluyendo páginas visitadas y tiempo de navegación.</li>
              <li><strong>Cookies:</strong> Utilizamos cookies para mejorar tu experiencia de navegación y analizar el tráfico del sitio.</li>
            </ul>

            <h3>2. Uso de la Información</h3>
            <p>Utilizamos tu información para:</p>
            <ul>
              <li>Responder a tus consultas y comentarios</li>
              <li>Mejorar nuestro contenido y servicios</li>
              <li>Enviar actualizaciones sobre noticias relevantes (solo si nos das tu consentimiento)</li>
              <li>Analizar y mejorar el rendimiento de nuestro sitio web</li>
            </ul>

            <h3>3. Compartir Información</h3>
            <p>No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto en las siguientes circunstancias:</p>
            <ul>
              <li>Cuando sea requerido por ley o autoridades competentes</li>
              <li>Para proteger nuestros derechos, propiedad o seguridad</li>
              <li>Con proveedores de servicios que nos ayudan a operar nuestro sitio web, bajo estrictos acuerdos de confidencialidad</li>
            </ul>

            <h3>4. Seguridad de Datos</h3>
            <p>Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.</p>

            <h3>5. Tus Derechos</h3>
            <p>Tienes derecho a:</p>
            <ul>
              <li>Acceder a tu información personal</li>
              <li>Corregir información inexacta</li>
              <li>Solicitar la eliminación de tu información</li>
              <li>Oponerte al procesamiento de tu información</li>
              <li>Retirar tu consentimiento en cualquier momento</li>
            </ul>

            <h3>6. Cookies</h3>
            <p>Utilizamos cookies esenciales para el funcionamiento del sitio y cookies analíticas para entender cómo nuestros usuarios interactúan con el contenido. Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.</p>

            <h3>7. Enlaces a Terceros</h3>
            <p>Nuestro sitio puede contener enlaces a sitios web de terceros. No somos responsables por las prácticas de privacidad de estos sitios externos.</p>

            <h3>8. Menores de Edad</h3>
            <p>Nuestro sitio no está dirigido a menores de 13 años. No recopilamos conscientemente información personal de menores de 13 años.</p>

            <h3>9. Cambios a esta Política</h3>
            <p>Nos reservamos el derecho de actualizar esta política de privacidad. Los cambios importantes serán notificados en esta página.</p>

            <h3>10. Contacto</h3>
            <p>Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en:</p>
            <ul>
              <li><strong>Email:</strong> Araucanoticias2019@gmail.com</li>
              <li><strong>Teléfono:</strong> +57 310 2279487</li>
              <li><strong>Dirección:</strong> Arauca, Colombia</li>
            </ul>
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

            <h3>1. Aceptación de los Términos</h3>
            <p>Al acceder y utilizar el sitio web de Arauca Noticias, aceptas estar sujeto a estos términos de uso y todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos, no utilices nuestro sitio.</p>

            <h3>2. Uso del Sitio</h3>
            <p>Te otorgamos una licencia limitada, no exclusiva e intransferible para acceder y usar nuestro sitio web para fines personales y no comerciales. Te comprometes a:</p>
            <ul>
              <li>No utilizar el sitio para fines ilegales o no autorizados</li>
              <li>No interferir con el funcionamiento del sitio</li>
              <li>No intentar acceder a áreas restringidas del sitio</li>
              <li>No transmitir virus, malware o código malicioso</li>
              <li>No realizar ingeniería inversa del sitio web</li>
            </ul>

            <h3>3. Contenido y Propiedad Intelectual</h3>
            <p>Todo el contenido en Arauca Noticias, incluyendo textos, imágenes, videos, logos y diseño, está protegido por derechos de autor y otras leyes de propiedad intelectual. Este contenido es propiedad de Arauca Noticias o de terceros que nos han otorgado licencia.</p>
            <ul>
              <li>Puedes compartir nuestros artículos citando la fuente</li>
              <li>No puedes reproducir, distribuir o modificar nuestro contenido sin autorización</li>
              <li>El uso comercial de nuestro contenido requiere permiso explícito</li>
            </ul>

            <h3>4. Comentarios y Contenido del Usuario</h3>
            <p>Al enviar comentarios, mensajes o cualquier contenido a nuestro sitio:</p>
            <ul>
              <li>Garantizas que tienes derecho a enviar dicho contenido</li>
              <li>Nos otorgas el derecho a usar, modificar y publicar tu contenido</li>
              <li>Te comprometes a que tu contenido no sea ofensivo, difamatorio o ilegal</li>
              <li>Nos reservamos el derecho de eliminar contenido inapropiado</li>
            </ul>

            <h3>5. Exactitud de la Información</h3>
            <p>Nos esforzamos por proporcionar información precisa y actualizada. Sin embargo:</p>
            <ul>
              <li>La información se proporciona "tal como está"</li>
              <li>No garantizamos la exactitud completa de toda la información</li>
              <li>Las opiniones expresadas en artículos son de sus autores</li>
              <li>Actualizamos la información cuando es posible</li>
            </ul>

            <h3>6. Enlaces Externos</h3>
            <p>Nuestro sitio puede contener enlaces a sitios web de terceros. Estos enlaces se proporcionan por conveniencia y no implican nuestro respaldo. No somos responsables por el contenido o prácticas de sitios externos.</p>

            <h3>7. Limitación de Responsabilidad</h3>
            <p>En la máxima medida permitida por la ley, Arauca Noticias no será responsable por:</p>
            <ul>
              <li>Daños directos, indirectos, incidentales o consecuentes</li>
              <li>Pérdida de datos, ingresos o oportunidades de negocio</li>
              <li>Interrupciones en el servicio del sitio web</li>
              <li>Errores u omisiones en el contenido</li>
            </ul>

            <h3>8. Disponibilidad del Servicio</h3>
            <p>Nos esforzamos por mantener el sitio disponible 24/7, pero no podemos garantizar disponibilidad continua. Podemos interrumpir el servicio temporalmente para mantenimiento o actualizaciones.</p>

            <h3>9. Modificaciones</h3>
            <p>Nos reservamos el derecho de:</p>
            <ul>
              <li>Modificar estos términos en cualquier momento</li>
              <li>Cambiar o discontinuar características del sitio</li>
              <li>Actualizar nuestro contenido y diseño</li>
            </ul>

            <h3>10. Ley Aplicable</h3>
            <p>Estos términos se rigen por las leyes de Colombia. Cualquier disputa se resolverá en los tribunales competentes de Arauca, Colombia.</p>

            <h3>11. Contacto</h3>
            <p>Para preguntas sobre estos términos de uso, contáctanos:</p>
            <ul>
              <li><strong>Email:</strong> Araucanoticias2019@gmail.com</li>
              <li><strong>Teléfono:</strong> +57 310 2279487</li>
              <li><strong>Dirección:</strong> Arauca, Colombia</li>
            </ul>

            <h3>12. Disposiciones Finales</h3>
            <p>Si alguna disposición de estos términos se considera inválida, las disposiciones restantes seguirán en vigor. Estos términos constituyen el acuerdo completo entre tú y Arauca Noticias respecto al uso del sitio web.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { getLatestNews, getHighlightedNews } from '../data/newsData.js'

export default {
  name: 'Home',
  setup() {
    const currentSlide = ref(0)
    const mobileMenuOpen = ref(false)
    const selectedNews = ref(null)
    const showContactModal = ref(false)
    const showPrivacyModal = ref(false)
    const showTermsModal = ref(false)
    const currentImageIndex = ref(0)
    const contactForm = ref({
      name: '',
      email: '',
      subject: '',
      message: ''
    })

    let carouselInterval = null

    // Datos de noticias - Las 6 más recientes para el carrusel
    const featuredNews = ref(getLatestNews(6))


    // Noticias destacadas - Excluyendo las del carrusel
    const highlightedNews = ref(getHighlightedNews(3))

    const startCarousel = () => {
      carouselInterval = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    const stopCarousel = () => {
      if (carouselInterval) {
        clearInterval(carouselInterval)
        carouselInterval = null
      }
    }

    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % featuredNews.value.length
    }

    const prevSlide = () => {
      currentSlide.value = currentSlide.value === 0 ? featuredNews.value.length - 1 : currentSlide.value - 1
    }

    const goToSlide = (index) => {
      currentSlide.value = index
    }

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
      mobileMenuOpen.value = false
    }

    const openNewsModal = (news) => {
      selectedNews.value = news
      currentImageIndex.value = 0
      document.body.style.overflow = 'hidden'
    }

    const closeNewsModal = () => {
      selectedNews.value = null
      currentImageIndex.value = 0
      document.body.style.overflow = 'auto'
    }

    // Función para extraer imágenes de una noticia
    const getNewsImages = (news) => {
      const images = []
      
      // Imagen principal
      if (news.image) {
        images.push({
          src: news.image,
          alt: news.title,
          caption: 'Imagen principal'
        })
      }
      
      // Extraer imágenes del contenido HTML
      if (news.content) {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = news.content
        const imgElements = tempDiv.querySelectorAll('img')
        
        imgElements.forEach((img, index) => {
          if (img.src !== news.image) { // Evitar duplicar la imagen principal
            images.push({
              src: img.src,
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

    // Función para limpiar el contenido HTML eliminando las galerías
    const getCleanContent = (news) => {
      if (!news || !news.content) return ''
      
      let cleanContent = news.content
      
      // Eliminar galerías con estructura completa (incluyendo gallery-grid)
      cleanContent = cleanContent.replace(/<div class="news-gallery">[\s\S]*?<\/div>\s*<\/div>/g, '')
      
      // Eliminar galerías simples
      cleanContent = cleanContent.replace(/<div class="news-gallery">[\s\S]*?<\/div>/g, '')
      
      // Eliminar gallery-grid si queda suelto
      cleanContent = cleanContent.replace(/<div class="gallery-grid">[\s\S]*?<\/div>/g, '')
      
      // Eliminar gallery-item si quedan sueltos
      cleanContent = cleanContent.replace(/<div class="gallery-item">[\s\S]*?<\/div>/g, '')
      
      // Eliminar cualquier img con clase gallery-image
      cleanContent = cleanContent.replace(/<img[^>]*class="gallery-image"[^>]*>/g, '')
      
      // Eliminar divs con gallery-badge y gallery-caption
      cleanContent = cleanContent.replace(/<div class="gallery-badge">[^<]*<\/div>/g, '')
      cleanContent = cleanContent.replace(/<div class="gallery-caption">[^<]*<\/div>/g, '')
      
      // Limpiar espacios en blanco excesivos
      cleanContent = cleanContent.replace(/\s*\n\s*\n\s*/g, '\n\n')
      cleanContent = cleanContent.trim()
      
      return cleanContent
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

    const submitContact = () => {
      // Agregar clase de loading al botón
      const submitBtn = document.querySelector('.contact-form .btn-primary')
      submitBtn.style.opacity = '0.7'
      submitBtn.style.cursor = 'not-allowed'
      submitBtn.innerHTML = '<span class="btn-icon">⏳</span>Enviando...'
      
      // Simular envío del formulario
      setTimeout(() => {
        alert('¡Mensaje enviado correctamente! Te contactaremos pronto.')
        contactForm.value = {
          name: '',
          email: '',
          subject: '',
          message: ''
        }
        
        // Restaurar botón
        submitBtn.style.opacity = '1'
        submitBtn.style.cursor = 'pointer'
        submitBtn.innerHTML = '<span class="btn-icon">🚀</span>Enviar Mensaje'
        
        closeContactModal()
      }, 1500)
    }

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    }

    // Funciones para el indicador de tema
    const getThemeIcon = () => {
      const hour = new Date().getHours()
      if (hour >= 6 && hour < 12) return '🌅' // Amanecer
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
      const theme = (hour >= 20 || hour < 6) ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', theme)
      
      // Guardar preferencia
      localStorage.setItem('theme-preference', theme)
      localStorage.setItem('theme-set-time', Date.now().toString())
    }

    // Verificar tema guardado y tiempo
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme-preference')
      const savedTime = localStorage.getItem('theme-set-time')
      
      if (savedTheme && savedTime) {
        const timeDiff = Date.now() - parseInt(savedTime)
        // Si han pasado más de 30 minutos, revisar el horario
        if (timeDiff > 30 * 60 * 1000) {
          setThemeBasedOnTime()
        } else {
          document.documentElement.setAttribute('data-theme', savedTheme)
        }
      } else {
        setThemeBasedOnTime()
      }
    }

    // Configurar intervalo para verificar cambio de hora
    let themeInterval = null
    const startThemeWatcher = () => {
      themeInterval = setInterval(() => {
        setThemeBasedOnTime()
      }, 30 * 60 * 1000) // Verificar cada 30 minutos
    }

    onMounted(() => {
      startCarousel()
      initializeTheme()
      startThemeWatcher()
    })

    onUnmounted(() => {
      stopCarousel()
      if (themeInterval) {
        clearInterval(themeInterval)
      }
    })

    return {
      currentSlide,
      mobileMenuOpen,
      selectedNews,
      showContactModal,
      showPrivacyModal,
      showTermsModal,
      currentImageIndex,
      contactForm,
      featuredNews,
      highlightedNews,
      nextSlide,
      prevSlide,
      goToSlide,
      toggleMobileMenu,
      scrollToSection,
      openNewsModal,
      closeNewsModal,
      getNewsImages,
      nextImage,
      prevImage,
      goToImage,
      getCleanContent,
      openContactModal,
      closeContactModal,
      openPrivacyModal,
      closePrivacyModal,
      openTermsModal,
      closeTermsModal,
      submitContact,
      formatDate,
      getThemeIcon,
      getThemeTooltip
    }
  }
}
</script>

<style scoped>
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

.nav-link:hover {
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

.nav-link:hover::after {
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

/* Hero Carousel Styles */
.hero-section {
  margin-top: 70px;
  position: relative;
  height: 70vh;
  min-height: 500px;
  overflow: hidden;
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
  transition: opacity 0.5s ease-in-out;
}

.carousel-slide.active {
  opacity: 1;
}

.slide-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(244, 119, 33, 0.4), rgba(27, 163, 71, 0.3));
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

.slide-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.slide-excerpt {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.95;
  max-width: 600px;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 3;
}

.carousel-btn {
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  color: var(--primary-color);
}

.carousel-btn:hover {
  background-color: white;
  transform: scale(1.1);
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
  transition: var(--transition);
}

.indicator.active,
.indicator:hover {
  background-color: white;
}

/* Featured Section Styles */
.featured-section {
  background-color: var(--bg-secondary);
}

.news-card {
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.news-card .card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-card .card-title {
  flex: 1;
}

/* About Section Styles */
.about-section {
  background-color: var(--bg-primary);
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-description {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.about-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  text-align: center;
}

.stat h3 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat p {
  color: var(--text-light);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.about-images {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.about-image {
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  transition: var(--transition);
}

.director-image {
  max-width: 320px;
  margin: 0 auto;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-accent));
}

.about-image:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
}

.about-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: var(--transition);
}

.director-image img {
  height: 400px;
  object-fit: contain;
  object-position: center center;
  background-color: var(--bg-accent);
}

.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  padding: 1.5rem 1rem 1rem;
  font-weight: 600;
  text-align: center;
  font-size: 1rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(20px);
  transition: var(--transition);
}

.about-image:hover .image-caption {
  opacity: 1;
  transform: translateY(0);
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
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-lg);
  border: 2px solid transparent;
}

.social-link:hover {
  color: white;
  transform: translateX(8px) scale(1.02);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.social-logo {
  width: 28px;
  height: 28px;
  transition: var(--transition);
}

.facebook-link {
  background: linear-gradient(135deg, #1877F2, #42A5F5);
  border-color: #1877F2;
}

.facebook-link:hover {
  background: linear-gradient(135deg, #166FE5, #1877F2);
  box-shadow: 0 6px 20px rgba(24, 119, 242, 0.4);
}

.instagram-link {
  background: linear-gradient(135deg, #E4405F, #F56040, #FFDC80);
  border-color: #E4405F;
}

.instagram-link:hover {
  background: linear-gradient(135deg, #D73553, #E4405F, #F56040);
  box-shadow: 0 6px 20px rgba(228, 64, 95, 0.4);
}

.twitter-link {
  background: linear-gradient(135deg, #000000, #333333);
  border-color: #000000;
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

/* Modern Modal Styles */
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

/* Scroll styling */
.modern-body::-webkit-scrollbar {
  width: 8px;
}

.modern-body::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}

.modern-body::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 4px;
}

.modern-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #e6661a, #159a3c);
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

/* Content Text Styling */
.modal-content-text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.modal-content-text p {
  margin-bottom: 1.5rem;
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
}

.modal-content-text li {
  margin-bottom: 0.75rem;
  position: relative;
}

.modal-content-text ul li::marker {
  color: var(--primary-color);
}

.modal-content-text ol li::marker {
  color: var(--primary-color);
  font-weight: bold;
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

/* Mobile Responsive for Modal */
@media (max-width: 768px) {
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
  
  .hero-carousel-controls {
    padding: 0 1rem !important;
  }
  
  .hero-image-caption {
    top: 0.75rem !important;
    left: 0.75rem !important;
    font-size: 0.75rem !important;
    padding: 0.375rem 0.75rem !important;
  }
  
  .image-counter {
    font-size: 0.625rem !important;
    padding: 0.125rem 0.375rem !important;
  }
  
  .modal-hero-content {
    padding: 1.5rem;
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
  
  .modern-body {
    padding: 1.5rem;
  }
  
  .modal-content-text {
    font-size: 1rem;
  }
  
  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .gallery-item {
    margin: 0 auto;
    max-width: 400px;
  }
  
  .gallery-image {
    height: 180px;
  }
  
  .gallery-caption {
    transform: translateY(0);
    background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4));
  }
  
  .modal-close {
    top: 1rem !important;
    right: 1rem !important;
    width: 40px !important;
    height: 40px !important;
    font-size: 1.25rem !important;
  }
}

/* Policy Modal Styles */
.policy-modal {
  max-width: 800px !important;
  max-height: 90vh !important;
}

.policy-body {
  max-height: 70vh;
  overflow-y: auto;
}

.policy-content {
  line-height: 1.8;
  color: var(--text-secondary);
}

.policy-date {
  background: linear-gradient(135deg, var(--bg-accent), rgba(244, 119, 33, 0.1));
  padding: 1rem;
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary-color);
  margin-bottom: 2rem;
  font-size: 0.875rem;
}

.policy-content h3 {
  color: var(--primary-color);
  font-size: 1.25rem;
  font-weight: 700;
  margin: 2rem 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--bg-accent);
}

.policy-content p {
  margin-bottom: 1.5rem;
  text-align: justify;
}

.policy-content ul {
  margin: 1rem 0 1.5rem 2rem;
}

.policy-content li {
  margin-bottom: 0.75rem;
  position: relative;
}

.policy-content li::marker {
  color: var(--primary-color);
}

.policy-content strong {
  color: var(--text-primary);
  font-weight: 600;
}

/* Policy Modal Scroll */
.policy-body::-webkit-scrollbar {
  width: 8px;
}

.policy-body::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}

.policy-body::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 4px;
}

.policy-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #e6661a, #159a3c);
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

/* Form validation styles */
.form-input:invalid:not(:placeholder-shown) {
  border-color: #e53e3e;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

/* Enhanced focus indicators */
.form-group:focus-within label {
  color: var(--accent-color);
}

.form-group:focus-within label::after {
  width: 50px;
  background: var(--accent-color);
}

/* Contact form header styling */
.modal-header h2 {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 0.5rem;
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

/* Add decorative elements */
.contact-form::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--accent-color), var(--secondary-color), var(--primary-color));
  border-radius: var(--border-radius-lg);
  z-index: -1;
  opacity: 0.1;
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
  
  .slide-title {
    font-size: 2rem;
  }
  
  .slide-excerpt {
    font-size: 1rem;
  }
  
  .carousel-controls {
    padding: 0 1rem;
  }
  
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .about-images {
    gap: 1.5rem;
  }
  
  .about-image img {
    height: 250px;
  }
  
  .director-image img {
    height: 300px;
  }
  
  .director-image {
    max-width: 280px;
  }
  
  .about-stats {
    justify-content: center;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .slide-content {
    padding: 2rem 0;
  }
  
  .slide-title {
    font-size: 1.5rem;
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
  
  .about-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  /* Contact form responsive adjustments */
  .contact-form {
    padding: 1.5rem;
    max-width: 100%;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-input {
    padding: 0.875rem 1rem;
  }
  
  .contact-form .btn-primary {
    padding: 0.875rem 1.5rem;
  }
  
  .privacy-note {
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
  }
}
</style>
