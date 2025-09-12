import axios from 'axios'

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://barnoticias-production.up.railway.app/api/v1'

// Cache simple en memoria
const cache = new Map()
const CACHE_DURATION = parseInt(import.meta.env.VITE_CACHE_DURATION) || 5 * 60 * 1000 // 5 minutos por defecto

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
}

// Crear instancia de axios con optimizaciones
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // 10 segundos timeout
  validateStatus: (status) => status < 500 // No fallar en errores 4xx
})

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

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
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
    return response.data
  },

  async update(id, newsData) {
    const response = await api.put(`/news/${id}`, newsData)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/news/${id}`)
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
    return response.data
  },

  async republish(id) {
    const response = await api.post(`/news/${id}/republish`)
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
