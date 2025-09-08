<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <img src="/assets/logos/logo-principal.png" alt="Arauca Noticias" class="header-logo">
          <h1>Panel de Administración</h1>
        </div>
        <div class="header-right">
          <span class="user-info">Hola, {{ currentUser?.name }}</span>
          <button @click="handleLogout" class="logout-btn">
            <span>🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="dashboard-nav">
      <div class="nav-content">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="nav-btn"
          :class="{ active: activeTab === tab.id }"
        >
          <span class="nav-icon">{{ tab.icon }}</span>
          {{ tab.name }}
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="dashboard-main">
      <div class="dashboard-content">
        <!-- Dashboard Overview -->
        <div v-if="activeTab === 'overview'" class="tab-content">
          <div class="overview-grid">
            <div class="stat-card">
              <div class="stat-icon">📰</div>
              <div class="stat-info">
                <h3>{{ stats.totalNews }}</h3>
                <p>Total Noticias</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-info">
                <h3>{{ stats.featuredNews }}</h3>
                <p>Noticias Destacadas</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📁</div>
              <div class="stat-info">
                <h3>{{ stats.categories }}</h3>
                <p>Categorías</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-info">
                <h3>{{ stats.publishedNews }}</h3>
                <p>Publicadas</p>
              </div>
            </div>
          </div>

          <div class="recent-news">
            <h2>Noticias Recientes</h2>
            <div class="news-list">
              <div v-for="news in recentNews" :key="news.id" class="news-item">
                <img :src="getImageUrl(news)" :alt="news.title" class="news-image">
                <div class="news-info">
                  <h4>{{ news.title }}</h4>
                  <p>{{ news.excerpt }}</p>
                  <div class="news-meta">
                    <span class="news-category">{{ news.category }}</span>
                    <span class="news-date">{{ formatDate(news.published_at) }}</span>
                    <span v-if="news.publication_status === 'published'" class="status-badge published">
                      <span class="status-icon">✅</span>
                      Publicada
                    </span>
                    <span v-else-if="news.publication_status === 'unpublished'" class="status-badge unpublished">
                      <span class="status-icon">👁️‍🗨️</span>
                      Despublicada
                      <span v-if="news.days_until_deletion !== null" class="deletion-countdown">
                        ({{ news.days_until_deletion }} días)
                      </span>
                    </span>
                    <span v-else class="status-badge draft">
                      <span class="status-icon">📝</span>
                      Borrador
                    </span>
                    <span v-if="news.featured" class="featured-badge">⭐ Destacada</span>
                  </div>
                </div>
                <div class="news-actions">
                  <button @click="previewNews(news)" class="action-btn preview">👁️</button>
                  <button @click="editNews(news.id)" class="action-btn edit">✏️</button>
                  <button @click="deleteNews(news.id)" class="action-btn delete">🗑️</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- News Management -->
        <div v-if="activeTab === 'news'" class="tab-content">
          <div class="tab-header">
            <h2>Gestión de Noticias</h2>
            <div class="header-actions">
              <button @click="checkAutoDeleteCandidates" class="check-delete-btn">
                <span>🗑️</span>
                Ver Eliminaciones Automáticas
              </button>
              <button @click="showCreateForm = true" class="create-btn">
                <span>➕</span>
                Nueva Noticia
              </button>
            </div>
          </div>

          <!-- News List -->
          <div class="news-management">
            <div class="filters">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Buscar noticias..."
                class="search-input"
              >
              <select v-model="selectedCategory" class="filter-select">
                <option value="">Todas las categorías</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <div class="news-table">
              <div class="table-header">
                <div class="col-title">Título</div>
                <div class="col-category">Categoría</div>
                <div class="col-date">Fecha</div>
                <div class="col-status">Estado</div>
                <div class="col-actions">Acciones</div>
              </div>
              <div v-for="news in filteredNews" :key="news.id" class="table-row">
                <div class="col-title">
                  <img :src="getImageUrl(news)" :alt="news.title" class="row-image">
                  <span class="row-title">{{ news.title }}</span>
                </div>
                <div class="col-category">{{ news.category }}</div>
                <div class="col-date">{{ formatDate(news.published_at) }}</div>
                <div class="col-status">
                  <span v-if="news.publication_status === 'published'" class="status-badge published">
                    <span class="status-icon">✅</span>
                    Publicada
                  </span>
                  <span v-else-if="news.publication_status === 'unpublished'" class="status-badge unpublished">
                    <span class="status-icon">👁️‍🗨️</span>
                    Despublicada
                    <span v-if="news.days_until_deletion !== null" class="deletion-countdown">
                      ({{ news.days_until_deletion }} días)
                    </span>
                  </span>
                  <span v-else class="status-badge draft">
                    <span class="status-icon">📝</span>
                    Borrador
                  </span>
                  <span v-if="news.featured" class="featured-badge">⭐ Destacada</span>
                </div>
                <div class="col-actions">
                  <button @click="previewNews(news)" class="action-btn preview" title="Previsualizar">👁️</button>
                  <button @click="editNews(news.id)" class="action-btn edit" title="Editar">✏️</button>
                  
                  <!-- Botones de publicación dependiendo del estado -->
                  <button 
                    v-if="news.publication_status === 'published'" 
                    @click="unpublishNews(news)" 
                    class="action-btn unpublish" 
                    title="Despublicar"
                  >
                    👁️‍🗨️
                  </button>
                  
                  <button 
                    v-else-if="news.publication_status === 'unpublished'" 
                    @click="republishNews(news)" 
                    class="action-btn republish" 
                    title="Republicar"
                  >
                    📢
                  </button>
                  
                  <button 
                    v-else 
                    @click="publishNews(news)" 
                    class="action-btn publish" 
                    title="Publicar"
                  >
                    📤
                  </button>

                  <!-- Alerta si va a ser eliminado pronto -->
                  <button 
                    v-if="news.should_be_auto_deleted" 
                    @click="showAutoDeleteWarning(news)" 
                    class="action-btn warning" 
                    title="⚠️ Puede ser eliminado automáticamente"
                  >
                    ⚠️
                  </button>
                  
                  <button @click="deleteNews(news.id)" class="action-btn delete" title="Eliminar">🗑️</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Media Management -->
        <div v-if="activeTab === 'media'" class="tab-content">
          <div class="tab-header">
            <h2>Gestión de Medios</h2>
            <div class="upload-section">
              <input 
                ref="fileInput"
                type="file" 
                @change="handleFileUpload"
                accept="image/*,video/*"
                multiple
                class="file-input"
                id="file-upload"
              >
              <label for="file-upload" class="upload-btn">
                <span>📁</span>
                Subir Archivos
              </label>
            </div>
          </div>

          <div class="media-grid">
            <div v-for="media in mediaFiles" :key="media.id" class="media-item">
              <div class="media-preview">
                <img v-if="media.type === 'image'" :src="media.url" :alt="media.alt_text" class="media-image">
                <video v-else-if="media.type === 'video'" :src="media.url" class="media-video" controls></video>
              </div>
              <div class="media-info">
                <h4>{{ media.original_name }}</h4>
                <p>{{ media.human_size }}</p>
                <p>{{ media.mime_type }}</p>
              </div>
              <div class="media-actions">
                <button @click="copyUrl(media.url)" class="action-btn copy" title="Copiar URL">📋</button>
                <button @click="deleteMedia(media.id)" class="action-btn delete" title="Eliminar">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create/Edit News Modal -->
    <div v-if="showCreateForm || editingNews" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <NewsForm 
          :news="editingNews"
          @close="closeModal"
          @saved="handleNewsSaved"
        />
      </div>
    </div>

    <!-- News Preview Modal (Same as Home page) -->
    <div v-if="previewNewsData" class="modal-overlay" @click="closePreview">
      <div class="modal-content modern-modal" @click.stop>
        <button @click="closePreview" class="modal-close" title="Cerrar">&times;</button>
        
        <!-- Modal Hero Section with Image Carousel -->
        <div class="modal-hero">
          <div class="hero-carousel-container">
            <div 
              v-for="(image, index) in getNewsImages(previewNewsData)" 
              :key="index"
              class="hero-carousel-slide"
              :class="{ active: currentImageIndex === index }"
            >
              <img 
                :src="image.src" 
                :alt="image.alt" 
                class="hero-carousel-image"
                @error="handleImageError"
                @load="handleImageLoad"
              >
              <div class="hero-overlay"></div>
            </div>
            
            <!-- Carousel Controls -->
            <div v-if="getNewsImages(previewNewsData).length > 1" class="hero-carousel-controls">
              <button @click="prevImage" class="hero-carousel-btn hero-carousel-prev">‹</button>
              <button @click="nextImage" class="hero-carousel-btn hero-carousel-next">›</button>
            </div>
            
            <!-- Carousel Indicators -->
            <div v-if="getNewsImages(previewNewsData).length > 1" class="hero-carousel-indicators">
              <button 
                v-for="(image, index) in getNewsImages(previewNewsData)" 
                :key="index"
                @click="goToImage(index)"
                class="hero-indicator"
                :class="{ active: currentImageIndex === index }"
              ></button>
            </div>
            
            <!-- Image Caption -->
            <div class="hero-image-caption">
              {{ getNewsImages(previewNewsData)[currentImageIndex]?.caption }}
              <span v-if="getNewsImages(previewNewsData).length > 1" class="image-counter">
                {{ currentImageIndex + 1 }} / {{ getNewsImages(previewNewsData).length }}
              </span>
            </div>
          </div>
          
          <div class="modal-hero-content">
            <div class="modal-meta-badges">
              <span class="modal-category-badge">{{ previewNewsData.category }}</span>
              <span class="modal-date-badge">{{ formatDate(previewNewsData.date) }}</span>
            </div>
            <h1 class="modal-title">{{ previewNewsData.title }}</h1>
          </div>
        </div>
        
        <!-- Modal Body -->
        <div class="modal-body modern-body">
          <div v-if="previewNewsData.video" class="modal-video-section">
            <!-- Video de YouTube -->
            <iframe 
              v-if="getVideoType(previewNewsData.video) === 'youtube'"
              :src="getYouTubeEmbedUrl(previewNewsData.video)"
              class="modal-video iframe-video"
              frameborder="0"
              allowfullscreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
            
            <!-- Video de Facebook -->
            <iframe 
              v-else-if="getVideoType(previewNewsData.video) === 'facebook'"
              :src="getFacebookEmbedUrl(previewNewsData.video)"
              class="modal-video iframe-video"
              frameborder="0"
              allowfullscreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
            
            <!-- Video de Vimeo -->
            <iframe 
              v-else-if="getVideoType(previewNewsData.video) === 'vimeo'"
              :src="getVimeoEmbedUrl(previewNewsData.video)"
              class="modal-video iframe-video"
              frameborder="0"
              allowfullscreen
            ></iframe>
            
            <!-- Video directo (MP4, etc.) -->
            <video 
              v-else-if="getVideoType(previewNewsData.video) === 'direct'"
              controls 
              :poster="previewNewsData.image" 
              class="modal-video"
            >
              <source :src="previewNewsData.video" type="video/mp4">
              Tu navegador no soporta el elemento video.
            </video>
            
            <!-- Fallback para URLs desconocidas -->
            <div v-else class="video-fallback">
              <p>⚠️ Tipo de video no soportado.</p>
              <p>Tipos soportados: YouTube, Facebook, Vimeo, MP4</p>
              <a :href="previewNewsData.video" target="_blank" class="video-link">
                Abrir video en nueva pestaña: {{ previewNewsData.video }}
              </a>
            </div>
          </div>
          
          <div class="modal-content-text" v-html="getCleanContent(previewNewsData)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService, newsService, mediaService } from '../services/api.js'
// Removemos las importaciones de localStorage, usamos el API real
import NewsForm from './NewsForm.vue'

export default {
  name: 'AdminDashboard',
  components: {
    NewsForm
  },
  setup() {
    const router = useRouter()
    const activeTab = ref('overview')
    const currentUser = ref(null)
    const loading = ref(false)
    const showCreateForm = ref(false)
    const editingNews = ref(null)
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const fileInput = ref(null)
    const previewNewsData = ref(null)
    const currentImageIndex = ref(0)

    const stats = reactive({
      totalNews: 0,
      featuredNews: 0,
      categories: 0,
      publishedNews: 0
    })

    const news = ref([])
    const categories = ref([])
    const mediaFiles = ref([])

    const tabs = [
      { id: 'overview', name: 'Resumen', icon: '📊' },
      { id: 'news', name: 'Noticias', icon: '📰' },
      { id: 'media', name: 'Medios', icon: '📁' }
    ]

    const recentNews = computed(() => {
      return news.value.slice(0, 5)
    })

    const filteredNews = computed(() => {
      let filtered = news.value

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.excerpt.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
        )
      }

      if (selectedCategory.value) {
        filtered = filtered.filter(item => item.category === selectedCategory.value)
      }

      return filtered
    })

    const loadDashboardData = async () => {
      try {
        loading.value = true
        
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
          console.warn('Usuario no autenticado')
          return
        }
        
        // Cargar noticias desde el API (incluir todas las noticias para admin)
        const newsResponse = await newsService.getAllForAdmin({ per_page: 100 })
        console.log('Respuesta de noticias:', newsResponse)
        news.value = newsResponse.data || []

        // Cargar categorías desde el API
        const categoriesResponse = await newsService.getCategories()
        console.log('Respuesta de categorías:', categoriesResponse)
        categories.value = categoriesResponse.data || []

        // Calcular estadísticas
        stats.totalNews = news.value.length
        stats.featuredNews = news.value.filter(item => item.featured).length
        stats.categories = categories.value.length
        stats.publishedNews = news.value.filter(item => item.publication_status === 'published').length

        // Cargar medios (opcional, no mostrar error si falla)
        try {
          const mediaResponse = await mediaService.getAll()
          mediaFiles.value = mediaResponse.data || []
        } catch (mediaError) {
          console.warn('Error cargando medios:', mediaError)
          mediaFiles.value = []
        }

      } catch (error) {
        console.error('Error cargando datos del dashboard:', error)
        // No mostrar alerta, solo loggear el error
        // Inicializar con datos vacíos para evitar errores
        news.value = []
        categories.value = []
        mediaFiles.value = []
        stats.totalNews = 0
        stats.featuredNews = 0
        stats.categories = 0
        stats.publishedNews = 0
      } finally {
        loading.value = false
      }
    }

    const editNews = (id) => {
      editingNews.value = news.value.find(item => item.id === id)
      showCreateForm.value = true
    }

    const deleteNews = async (id) => {
      if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) return

      try {
        await newsService.delete(id)
        news.value = news.value.filter(item => item.id !== id)
        
        // Recargar datos para obtener estadísticas actualizadas
        await loadDashboardData()
        
        // Mostrar mensaje de éxito solo si la eliminación fue exitosa
        alert('Noticia eliminada exitosamente')
      } catch (error) {
        console.error('Error eliminando noticia:', error)
        alert('Error al eliminar la noticia')
      }
    }

    const publishNews = async (newsItem) => {
      try {
        const response = await newsService.update(newsItem.id, { published: true })
        await loadDashboardData()
        alert('Noticia publicada exitosamente')
      } catch (error) {
        console.error('Error publicando noticia:', error)
        alert('Error al publicar la noticia')
      }
    }

    const unpublishNews = async (newsItem) => {
      if (!confirm('¿Estás seguro de que quieres despublicar esta noticia? Se eliminará automáticamente en 15 días.')) return
      
      try {
        await newsService.unpublish(newsItem.id)
        await loadDashboardData()
        alert('Noticia despublicada. Se eliminará automáticamente en 15 días.')
      } catch (error) {
        console.error('Error despublicando noticia:', error)
        alert('Error al despublicar la noticia')
      }
    }

    const republishNews = async (newsItem) => {
      try {
        await newsService.republish(newsItem.id)
        await loadDashboardData()
        alert('Noticia republicada exitosamente')
      } catch (error) {
        console.error('Error republicando noticia:', error)
        alert('Error al republicar la noticia')
      }
    }

    const showAutoDeleteWarning = (newsItem) => {
      const daysLeft = newsItem.days_until_deletion || 0
      if (daysLeft <= 0) {
        if (confirm('Esta noticia puede ser eliminada automáticamente ahora. ¿Quieres republicarla para evitar la eliminación?')) {
          republishNews(newsItem)
        }
      } else {
        if (confirm(`Esta noticia será eliminada automáticamente en ${daysLeft} día(s). ¿Quieres republicarla ahora?`)) {
          republishNews(newsItem)
        }
      }
    }

    // Función legacy mantenida para compatibilidad
    const togglePublish = async (newsItem) => {
      if (newsItem.publication_status === 'published') {
        await unpublishNews(newsItem)
      } else {
        await publishNews(newsItem)
      }
    }

    const getImageUrl = (news) => {
      // Priorizar URLs optimizadas del API
      if (news.thumbnail_url) return news.thumbnail_url
      if (news.optimized_image_url) return news.optimized_image_url
      
      // Si la imagen es base64 muy larga, usar imagen por defecto
      if (news.image && news.image.startsWith('data:image/')) {
        if (news.image.length > 100000) { // Más de 100KB
          return '/assets/images/news/default.jpg'
        }
        return news.image
      }
      
      // URL normal de imagen
      if (news.image) return news.image
      
      // Imagen por defecto
      return '/assets/images/news/default.jpg'
    }

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

    const checkAutoDeleteCandidates = async () => {
      try {
        loading.value = true
        
        // Verificar autenticación antes de continuar
        if (!authService.isAuthenticated()) {
          alert('Sesión expirada. Por favor, inicia sesión nuevamente.')
          router.push('/admin/login')
          return
        }
        
        console.log('Verificando candidatos para eliminación automática...')
        const response = await newsService.getAutoDeleteCandidates()
        console.log('Respuesta de candidatos:', response)
        
        const candidates = response.data || []
        
        if (candidates.length === 0) {
          alert('No hay noticias pendientes de eliminación automática.')
          return
        }
        
        const candidateList = candidates.map(news => `• ${news.title} (${news.days_until_deletion || 0} días)`).join('\n')
        const message = `Noticias que pueden ser eliminadas automáticamente:\n\n${candidateList}\n\n¿Quieres ejecutar la eliminación automática ahora?`
        
        if (confirm(message)) {
          await executeAutoDelete()
        }
      } catch (error) {
        console.error('Error verificando candidatos:', error)
        console.error('Error response:', error.response)
        console.error('Error request:', error.request)
        
        let errorMessage = 'Error al verificar las noticias para eliminación automática'
        
        if (error.response?.status === 401) {
          errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.'
          authService.logout()
          router.push('/admin/login')
          return
        } else if (error.response?.status === 500) {
          errorMessage = 'Error interno del servidor. Por favor, contacta al administrador.'
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = `Error de conexión: ${error.message}`
        }
        
        alert(errorMessage)
      } finally {
        loading.value = false
      }
    }

    const executeAutoDelete = async () => {
      try {
        const response = await newsService.executeAutoDelete()
        await loadDashboardData()
        alert(response.message)
      } catch (error) {
        console.error('Error ejecutando eliminación automática:', error)
        alert('Error al ejecutar la eliminación automática')
      }
    }

    const handleFileUpload = async (event) => {
      const files = event.target.files
      if (!files.length) return

      for (const file of files) {
        try {
          const type = file.type.startsWith('image/') ? 'image' : 'video'
          await mediaService.upload(file, type)
          loadDashboardData() // Recargar medios
        } catch (error) {
          console.error('Error subiendo archivo:', error)
          alert(`Error subiendo ${file.name}`)
        }
      }

      // Limpiar input
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const deleteMedia = async (id) => {
      if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) return

      try {
        await mediaService.delete(id)
        mediaFiles.value = mediaFiles.value.filter(item => item.id !== id)
      } catch (error) {
        console.error('Error eliminando medio:', error)
        alert('Error al eliminar el archivo')
      }
    }

    const copyUrl = (url) => {
      navigator.clipboard.writeText(url)
      alert('URL copiada al portapapeles')
    }

    const closeModal = () => {
      showCreateForm.value = false
      editingNews.value = null
    }

    const handleNewsSaved = async (savedNews) => {
      try {
        console.log('📰 Noticia guardada desde NewsForm:', savedNews)
        
        // La noticia ya fue guardada en NewsForm, solo necesitamos actualizar la UI
        if (savedNews && savedNews.id) {
          if (editingNews.value) {
            // Actualizar noticia existente en la lista
            const index = news.value.findIndex(item => item.id === editingNews.value.id)
            if (index !== -1) {
              news.value[index] = savedNews
            }
          } else {
            // Agregar nueva noticia al inicio de la lista
            news.value.unshift(savedNews)
          }
          
          // Recargar datos para obtener estadísticas actualizadas y galería
          await loadDashboardData()
          
          // Mostrar mensaje de éxito
          alert(editingNews.value ? 'Noticia actualizada exitosamente' : 'Noticia creada exitosamente')
        }
        
        closeModal()
      } catch (error) {
        console.error('❌ Error procesando noticia guardada:', error)
        // No mostramos error aquí porque ya se manejó en NewsForm
        closeModal()
      }
    }

    const handleLogout = async () => {
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        await authService.logout()
        router.push('/admin/login')
      }
    }

    // Funciones para previsualización (copiadas de Home.vue)
    const previewNews = (news) => {
      previewNewsData.value = news
      currentImageIndex.value = 0
      document.body.style.overflow = 'hidden'
    }

    const closePreview = () => {
      previewNewsData.value = null
      currentImageIndex.value = 0
      document.body.style.overflow = 'auto'
    }

    // Función para extraer imágenes de una noticia (actualizada para nueva galería)
    const getNewsImages = (news) => {
      const images = []
      
      console.log('🔍 getNewsImages - datos de noticia:', news)
      
      // Prioridad 1: Usar galería nueva si existe
      if (news.gallery && news.gallery.length > 0) {
        console.log('📸 Galería encontrada:', news.gallery.length, 'imágenes')
        console.log('📊 Datos de galería:', news.gallery)
        
        // Ordenar por orden y mostrar imagen principal primero
        const sortedGallery = [...news.gallery].sort((a, b) => {
          if (a.is_main) return -1  // Imagen principal va primero
          if (b.is_main) return 1
          return a.order - b.order  // Luego por orden
        })
        
        sortedGallery.forEach((image, index) => {
          const imageUrl = image.large_url || image.medium_url || image.thumbnail_url || image.optimized_url
          
          // Log detallado para ver las URLs reales
          console.log(`🖼️ Imagen ${index + 1} (ID: ${image.id}):`)
          console.log('  - large_url:', image.large_url)
          console.log('  - medium_url:', image.medium_url)
          console.log('  - thumbnail_url:', image.thumbnail_url)
          console.log('  - optimized_url:', image.optimized_url)
          console.log('  - URL seleccionada:', imageUrl)
          console.log('  - is_main:', image.is_main)
          
          if (imageUrl) {
            images.push({
              src: imageUrl,
              alt: image.alt_text || news.title,
              caption: image.caption || (image.is_main ? 'Imagen principal' : `Imagen ${index + 1}`)
            })
            console.log(`  ✅ Imagen agregada a la galería`)
          } else {
            console.warn(`  ⚠️ No se encontró URL válida para imagen ${image.id}`)
            console.warn('  📋 Objeto imagen completo:', JSON.stringify(image, null, 2))
          }
        })
        
        console.log('✅ Imágenes procesadas:', images.length)
        console.log('📋 Array final de imágenes:', images.map(img => ({
          src: img.src,
          alt: img.alt,
          caption: img.caption
        })))
        return images
      }
      
      // Fallback: Imagen principal legacy
      if (news.image) {
        images.push({
          src: news.image,
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
      if (previewNewsData.value) {
        const images = getNewsImages(previewNewsData.value)
        currentImageIndex.value = (currentImageIndex.value + 1) % images.length
      }
    }

    const prevImage = () => {
      if (previewNewsData.value) {
        const images = getNewsImages(previewNewsData.value)
        currentImageIndex.value = currentImageIndex.value === 0 ? images.length - 1 : currentImageIndex.value - 1
      }
    }

    const goToImage = (index) => {
      currentImageIndex.value = index
    }

    // Manejo de errores y carga de imágenes
    const handleImageError = (event) => {
      console.error('❌ Error cargando imagen:', event.target.src)
      console.error('❌ Detalles del error:', event)
      // Opcional: cambiar a imagen por defecto
      // event.target.src = '/path/to/default-image.jpg'
    }

    const handleImageLoad = (event) => {
      console.log('✅ Imagen cargada exitosamente:', event.target.src.substring(0, 100) + '...')
    }

    // Función para limpiar el contenido HTML eliminando las galerías (copiada de Home.vue)
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

    const formatDate = (date) => {
      if (!date) return 'Fecha no disponible'
      
      try {
        const dateObj = new Date(date)
        
        // Verificar si la fecha es válida
        if (isNaN(dateObj.getTime())) {
          console.warn('Fecha inválida recibida:', date)
          return 'Fecha inválida'
        }
        
        return dateObj.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch (error) {
        console.error('Error formateando fecha:', error, 'Fecha recibida:', date)
        return 'Error en fecha'
      }
    }

    onMounted(() => {
      currentUser.value = authService.getCurrentUser()
      if (!currentUser.value) {
        router.push('/admin/login')
        return
      }
      loadDashboardData()
    })

    return {
      activeTab,
      currentUser,
      loading,
      showCreateForm,
      editingNews,
      searchQuery,
      selectedCategory,
      fileInput,
      previewNewsData,
      currentImageIndex,
      stats,
      news,
      categories,
      mediaFiles,
      tabs,
      recentNews,
      filteredNews,
      editNews,
      deleteNews,
      publishNews,
      unpublishNews,
      republishNews,
      showAutoDeleteWarning,
      togglePublish,
      getImageUrl,
      getVideoType,
      getYouTubeEmbedUrl,
      getVimeoEmbedUrl,
      getFacebookEmbedUrl,
      checkAutoDeleteCandidates,
      executeAutoDelete,
      handleFileUpload,
      deleteMedia,
      copyUrl,
      closeModal,
      handleNewsSaved,
      handleLogout,
      previewNews,
      closePreview,
      getNewsImages,
      nextImage,
      prevImage,
      goToImage,
      handleImageError,
      handleImageLoad,
      getCleanContent,
      formatDate
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.dashboard-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-logo {
  height: 40px;
  width: auto;
}

.header-left h1 {
  color: #333;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  color: #666;
  font-weight: 500;
}

.logout-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background: #c53030;
}

.dashboard-nav {
  background: white;
  border-bottom: 1px solid #e1e5e9;
}

.nav-content {
  display: flex;
  gap: 0.5rem;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-btn {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  color: #333;
  background-color: #f8f9fa;
}

.nav-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.nav-icon {
  font-size: 1.2rem;
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.tab-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e1e5e9;
}

.tab-header h2 {
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.create-btn, .upload-btn, .check-delete-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: transform 0.3s ease;
}

.check-delete-btn {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
}

.create-btn:hover, .upload-btn:hover, .check-delete-btn:hover {
  transform: translateY(-2px);
}

.file-input {
  display: none;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.stat-info p {
  margin: 0;
  opacity: 0.9;
}

.recent-news h2 {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.news-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
}

.news-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.news-image {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.news-info {
  flex: 1;
}

.news-info h4 {
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.news-info p {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.news-category {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.news-date {
  color: #666;
  font-size: 0.8rem;
}

.featured-badge {
  background: #fbbf24;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.news-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: 1px solid #e1e5e9;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.action-btn:hover {
  background-color: #f8f9fa;
}

.action-btn.edit:hover {
  border-color: #667eea;
  color: #667eea;
}

.action-btn.delete:hover {
  border-color: #e53e3e;
  color: #e53e3e;
}

.action-btn.publish:hover {
  border-color: #38a169;
  color: #38a169;
}

.action-btn.unpublish:hover {
  border-color: #d69e2e;
  color: #d69e2e;
}

.action-btn.preview:hover {
  border-color: #38a169;
  color: #38a169;
}

.action-btn.republish:hover {
  border-color: #3182ce;
  color: #3182ce;
}

.action-btn.warning:hover {
  border-color: #d69e2e;
  color: #d69e2e;
  background-color: #fff3cd;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input, .filter-select {
  padding: 0.75rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
}

.search-input {
  flex: 1;
}

.filter-select {
  min-width: 200px;
}

.news-table {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  background: #f8f9fa;
  padding: 1rem;
  font-weight: 600;
  color: #333;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  border-top: 1px solid #e1e5e9;
  align-items: center;
}

.col-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.row-image {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.row-title {
  font-weight: 500;
  color: #333;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.status-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.status-badge.published {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-badge.draft {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-badge.unpublished {
  background: linear-gradient(135deg, #fed7d7 0%, #fc8181 100%);
  color: #c53030;
  border: 1px solid #fc8181;
}

.deletion-countdown {
  font-size: 0.7rem;
  font-weight: 700;
  color: #e53e3e;
}

.status-icon {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.media-item {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.media-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.media-preview {
  height: 150px;
  overflow: hidden;
}

.media-image, .media-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-info {
  padding: 1rem;
}

.media-info h4 {
  color: #333;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  word-break: break-all;
}

.media-info p {
  color: #666;
  font-size: 0.8rem;
  margin: 0.25rem 0;
}

.media-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem 1rem;
}

.action-btn.copy:hover {
  border-color: #667eea;
  color: #667eea;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .nav-content {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .dashboard-main {
    padding: 1rem;
  }
  
  .tab-content {
    padding: 1rem;
  }
  
  .overview-grid {
    grid-template-columns: 1fr;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .table-header, .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .col-title {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .media-grid {
    grid-template-columns: 1fr;
  }
}

/* Estilos para el modal de previsualización (copiados de Home.vue) */
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
  background: linear-gradient(135deg, #f4741e, #e6661a);
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
  background: #f8f9fa;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

/* Scroll styling */
.modern-body::-webkit-scrollbar {
  width: 8px;
}

.modern-body::-webkit-scrollbar-track {
  background: #e9ecef;
  border-radius: 4px;
}

.modern-body::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 4px;
}

.modern-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
}

.modal-video-section {
  margin-bottom: 2rem;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
  background: #f8f9fa;
  border-radius: 15px;
  border: 2px dashed #dee2e6;
}

.video-fallback p {
  color: #6c757d;
  margin-bottom: 1rem;
  font-weight: 500;
}

.video-link {
  color: #667eea;
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
  color: #333;
}

.modal-content-text p {
  margin-bottom: 1.5rem;
}

.modal-content-text p:first-child {
  font-size: 1.25rem;
  font-weight: 500;
  color: #333;
}

.modal-content-text strong {
  color: #667eea;
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
  color: #667eea;
}

.modal-content-text ol li::marker {
  color: #667eea;
  font-weight: bold;
}
</style>

