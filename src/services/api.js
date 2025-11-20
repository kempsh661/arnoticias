
import axios from 'axios'

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://barnoticias-production.up.railway.app/api/v1'

// Cache simple en memoria
const cache = new Map()
const CACHE_DURATION = parseInt(import.meta.env.VITE_CACHE_DURATION) || 2 * 60 * 1000 // 2 minutos por defecto

// Función para obtener datos del cache
const getCachedData = (key) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`📦 Datos obtenidos del cache: ${key}`)
    return cached.data
  }
  return null
}

// Función para guardar datos en cache
const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
  console.log(`💾 Datos guardados en cache: ${key}`)
}

// Función para invalidar cache por patrón
const invalidateCache = (pattern) => {
  let count = 0
  for (const key of cache.keys()) {
    if (pattern instanceof RegExp ? pattern.test(key) : key.includes(pattern)) {
      cache.delete(key)
      count++
    }
  }
  if (count > 0) {
    console.log(`🗑️ Cache invalidado: ${count} entradas eliminadas (patrón: ${pattern})`)
  }
}

// Función para limpiar todo el cache
const clearCache = () => {
  const size = cache.size
  cache.clear()
  console.log(`🗑️ Cache completamente limpiado: ${size} entradas eliminadas`)
}

// Función para invalidar cache de noticias
const invalidateNewsCache = () => {
  invalidateCache('news')
  invalidateCache('featured')
  invalidateCache('latest')
}

// Exportar funciones de cache para uso externo
export const cacheUtils = {
  invalidateCache,
  clearCache,
  invalidateNewsCache,
  getCacheSize: () => cache.size,
  getCacheKeys: () => Array.from(cache.keys())
}

// Crear instancia de axios con optimizaciones
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 120000, // 120 segundos timeout (2 minutos) - aumentado para imágenes pesadas
  validateStatus: (status) => status < 500 // No fallar en errores 4xx
})

// Configuración de retry - REDUCIDO para evitar consumo excesivo
const MAX_RETRIES = 1 // Reducido de 3 a 1
const RETRY_DELAY_BASE = 2000 // Aumentado a 2 segundos

// Función para calcular delay con exponential backoff
const getRetryDelay = (retryCount) => {
  return RETRY_DELAY_BASE * Math.pow(2, retryCount) + Math.random() * 500
}

// Función para determinar si un error es retryable
const isRetryableError = (error) => {
  // No reintentar errores de autenticación o validación
  if (error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 422) {
    return false
  }

  // Reintentar errores de red, timeouts, y errores 5xx
  return !error.response || error.code === 'ECONNABORTED' || error.response.status >= 500
}

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas de error con retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config

    // Si no hay configuración o ya se alcanzó el máximo de reintentos
    if (!config || config.__retryCount >= MAX_RETRIES) {
      // Manejar error 401 (token expirado)
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        window.location.href = '/admin/login'
      }
      return Promise.reject(error)
    }

    // Inicializar contador de reintentos
    config.__retryCount = config.__retryCount || 0

    // Verificar si el error es retryable
    if (!isRetryableError(error)) {
      // Manejar error 401 (token expirado)
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        window.location.href = '/admin/login'
      }
      return Promise.reject(error)
    }

    // Incrementar contador
    config.__retryCount++

    // Calcular delay con exponential backoff
    const delay = getRetryDelay(config.__retryCount)

    console.warn(`⚠️ Reintento ${config.__retryCount}/${MAX_RETRIES} en ${Math.round(delay / 1000)}s - URL: ${config.url}`)

    // Esperar antes de reintentar
    await new Promise(resolve => setTimeout(resolve, delay))

    // Reintentar la petición
    return api(config)
  }
)

// Servicios de autenticación
export const authService = {
  async login(credentials) {
    const response = await api.post('/login', credentials)
    if (response.data.success) {
      localStorage.setItem('auth_token', response.data.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    return response.data
  },

  async logout() {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  },

  async getProfile() {
    const response = await api.get('/profile')
    return response.data
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token')
  },

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
}

// Servicios de noticias
export const newsService = {
  async getAll(params = {}) {
    const cacheKey = `news_all_${JSON.stringify(params)}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await api.get('/news', { params })
    setCachedData(cacheKey, response.data)
    return response.data
  },

  async getAllForAdmin(params = {}) {
    const response = await api.get('/news', { params: { ...params, admin: 'true' } })
    return response.data
  },

  async getById(id) {
    const cacheKey = `news_${id}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await api.get(`/news/${id}`)
    setCachedData(cacheKey, response.data)
    return response.data
  },

  async create(newsData) {
    const response = await api.post('/news', newsData)
    invalidateNewsCache() // Invalidar cache después de crear
    return response.data
  },

  async update(id, newsData) {
    const response = await api.put(`/news/${id}`, newsData)
    invalidateNewsCache() // Invalidar cache después de actualizar
    invalidateCache(`news_${id}`) // Invalidar cache específico de esta noticia
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/news/${id}`)
    invalidateNewsCache() // Invalidar cache después de eliminar
    invalidateCache(`news_${id}`) // Invalidar cache específico de esta noticia
    return response.data
  },

  async getCategories() {
    const response = await api.get('/news/categories')
    return response.data
  },

  async getFeatured() {
    const cacheKey = 'featured_news'
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await api.get('/news/featured')
    setCachedData(cacheKey, response.data)
    return response.data
  },

  async getLatest(limit = 6) {
    const cacheKey = `latest_${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await api.get('/news/latest', { params: { limit } })
    setCachedData(cacheKey, response.data)
    return response.data
  },

  async unpublish(id) {
    const response = await api.post(`/news/${id}/unpublish`)
    invalidateNewsCache() // Invalidar cache después de despublicar
    invalidateCache(`news_${id}`)
    return response.data
  },

  async republish(id) {
    const response = await api.post(`/news/${id}/republish`)
    invalidateNewsCache() // Invalidar cache después de republicar
    invalidateCache(`news_${id}`)
    return response.data
  },

  async getAutoDeleteCandidates() {
    try {
      const response = await api.get('/news/auto-delete/candidates')
      return response.data
    } catch (error) {
      console.error('Error en getAutoDeleteCandidates:', error)
      throw error
    }
  },

  async executeAutoDelete() {
    const response = await api.post('/news/auto-delete/execute')
    return response.data
  },

  // News Images functions
  async getNewsImages(newsId) {
    const response = await api.get(`/news/${newsId}/images`)
    return response.data
  },

  async uploadNewsImages(newsId, images) {
    const response = await api.post(`/news/${newsId}/images`, { images })
    return response.data
  },

  async setMainImage(newsId, imageId) {
    const response = await api.put(`/news/${newsId}/images/${imageId}/main`)
    return response.data
  },

  async updateImagesOrder(newsId, images) {
    const response = await api.put(`/news/${newsId}/images/order`, { images })
    return response.data
  },

  async deleteNewsImage(newsId, imageId) {
    const response = await api.delete(`/news/${newsId}/images/${imageId}`)
    return response.data
  }
}

// Servicios de medios
export const mediaService = {
  async upload(file, type = 'image') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async getAll(params = {}) {
    const response = await api.get('/media', { params })
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/media/${id}`)
    return response.data
  },

  async setFeatured(id) {
    const response = await api.post(`/media/${id}/feature`)
    return response.data
  }
}

export default api
