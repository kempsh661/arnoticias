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
                <img :src="news.image || '/assets/images/news/default.jpg'" :alt="news.title" class="news-image">
                <div class="news-info">
                  <h4>{{ news.title }}</h4>
                  <p>{{ news.excerpt }}</p>
                  <div class="news-meta">
                    <span class="news-category">{{ news.category }}</span>
                    <span class="news-date">{{ formatDate(news.published_at) }}</span>
                    <span v-if="news.featured" class="featured-badge">⭐ Destacada</span>
                  </div>
                </div>
                <div class="news-actions">
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
            <button @click="showCreateForm = true" class="create-btn">
              <span>➕</span>
              Nueva Noticia
            </button>
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
                  <img :src="news.image || '/assets/images/news/default.jpg'" :alt="news.title" class="row-image">
                  <span class="row-title">{{ news.title }}</span>
                </div>
                <div class="col-category">{{ news.category }}</div>
                <div class="col-date">{{ formatDate(news.published_at) }}</div>
                <div class="col-status">
                  <span v-if="news.published" class="status-badge published">Publicada</span>
                  <span v-else class="status-badge draft">Borrador</span>
                  <span v-if="news.featured" class="featured-badge">⭐</span>
                </div>
                <div class="col-actions">
                  <button @click="editNews(news.id)" class="action-btn edit" title="Editar">✏️</button>
                  <button @click="togglePublish(news)" class="action-btn" :class="news.published ? 'unpublish' : 'publish'" :title="news.published ? 'Despublicar' : 'Publicar'">
                    {{ news.published ? '👁️' : '👁️‍🗨️' }}
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
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService, newsService, mediaService } from '../services/api.js'
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
        
        // Cargar noticias
        const newsResponse = await newsService.getAll({ per_page: 100 })
        news.value = newsResponse.data.data

        // Cargar categorías
        const categoriesResponse = await newsService.getCategories()
        categories.value = categoriesResponse.data

        // Calcular estadísticas
        stats.totalNews = news.value.length
        stats.featuredNews = news.value.filter(item => item.featured).length
        stats.categories = categories.value.length
        stats.publishedNews = news.value.filter(item => item.published).length

        // Cargar medios
        const mediaResponse = await mediaService.getAll()
        mediaFiles.value = mediaResponse.data.data || []

      } catch (error) {
        console.error('Error cargando datos del dashboard:', error)
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
        loadDashboardData() // Recargar estadísticas
      } catch (error) {
        console.error('Error eliminando noticia:', error)
        alert('Error al eliminar la noticia')
      }
    }

    const togglePublish = async (newsItem) => {
      try {
        const updatedData = { ...newsItem, published: !newsItem.published }
        await newsService.update(newsItem.id, updatedData)
        
        // Actualizar en la lista local
        const index = news.value.findIndex(item => item.id === newsItem.id)
        if (index !== -1) {
          news.value[index].published = !newsItem.published
        }
        
        loadDashboardData() // Recargar estadísticas
      } catch (error) {
        console.error('Error actualizando estado:', error)
        alert('Error al actualizar el estado de la noticia')
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

    const handleNewsSaved = () => {
      closeModal()
      loadDashboardData()
    }

    const handleLogout = async () => {
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        await authService.logout()
        router.push('/admin/login')
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
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
      stats,
      news,
      categories,
      mediaFiles,
      tabs,
      recentNews,
      filteredNews,
      editNews,
      deleteNews,
      togglePublish,
      handleFileUpload,
      deleteMedia,
      copyUrl,
      closeModal,
      handleNewsSaved,
      handleLogout,
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

.create-btn, .upload-btn {
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

.create-btn:hover, .upload-btn:hover {
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
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.published {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.draft {
  background: #fed7d7;
  color: #742a2a;
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
</style>

