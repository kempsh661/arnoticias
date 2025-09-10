<template>
  <div class="news-detail">
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <img src="/assets/logos/logo-principal.png" alt="Arauca Noticias" class="logo-image">
            <h1 class="logo-text">
              <router-link to="/" class="logo-link">Arauca Noticias</router-link>
            </h1>
          </div>
          
          <nav class="nav">
            <ul class="nav-list">
              <li><router-link to="/" class="nav-link">Inicio</router-link></li>
              <li><a href="/#noticias" class="nav-link">Noticias</a></li>
              <li><a href="/#destacadas" class="nav-link">Destacadas</a></li>
              <li><a href="/#nosotros" class="nav-link">Nosotros</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <article class="article" v-if="news">
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
            <div class="article-image" v-if="news.image_url || news.image">
              <img :src="getOptimizedImageUrl(news.image_url || news.image, 'large')" :alt="news.title">
              <p class="image-caption" v-if="news.imageCaption">{{ news.imageCaption }}</p>
            </div>

            <div class="article-video" v-if="news.video">
              <video controls :poster="getOptimizedImageUrl(news.image_url || news.image, 'large')">
                <source :src="news.video" type="video/mp4">
                Tu navegador no soporta el elemento video.
              </video>
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

        <div v-else class="loading">
          <p>Cargando noticia...</p>
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
              <li><a href="/#noticias">Noticias</a></li>
              <li><a href="/#destacadas">Destacadas</a></li>
              <li><a href="/#nosotros">Nosotros</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2024 Arauca Noticias. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { newsService } from '../services/api.js'

export default {
  name: 'NewsDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const news = ref(null)
    const allNews = ref([])

    // Cargar noticias desde el API
    const loadNews = async () => {
      try {
        const response = await newsService.getAll({ per_page: 100 })
        allNews.value = response.data.data || []
      } catch (error) {
        console.error('Error cargando noticias:', error)
        allNews.value = []
      }
    }

    const relatedNews = computed(() => {
      if (!news.value) return []
      
      return allNews.value
        .filter(item => item.id !== news.value.id && item.category === news.value.category)
        .slice(0, 3)
    })


    const formatDate = (date) => {
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    }

    const goToNews = (newsId) => {
      router.push(`/noticia/${newsId}`)
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

    // Sistema de tema (mismo que Home.vue)
    const setThemeBasedOnTime = () => {
      const hour = new Date().getHours()
      const theme = (hour >= 20 || hour < 6) ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', theme)
    }

    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme-preference')
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme)
      } else {
        setThemeBasedOnTime()
      }
    }

    const loadCurrentNews = async () => {
      try {
        const newsId = parseInt(route.params.id)
        const response = await newsService.getById(newsId)
        news.value = response.data
        
        // Cargar noticias relacionadas
        await loadNews()
      } catch (error) {
        console.error('Error cargando noticia:', error)
        router.push('/')
      }
    }

    onMounted(async () => {
      await loadCurrentNews()
      initializeTheme()
      // Scroll to top when component mounts
      window.scrollTo(0, 0)
    })

    return {
      news,
      relatedNews,
      formatDate,
      goToNews,
      getOptimizedImageUrl
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
  max-width: 800px;
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
}

.article-video video {
  width: 100%;
  max-height: 400px;
  border-radius: var(--border-radius);
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
  max-width: 800px;
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
  text-align: center;
  padding: 4rem;
  color: var(--text-light);
}

/* Footer styles */
.footer {
  background-color: var(--primary-color);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: 4rem;
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

.footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-links li {
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

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

/* Responsive design */
@media (max-width: 768px) {
  .nav-list {
    flex-direction: column;
    gap: 1rem;
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
