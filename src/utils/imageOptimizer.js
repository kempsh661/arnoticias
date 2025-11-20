/**
 * Utilidad para optimizar y convertir imágenes
 * Convierte imágenes base64 a WebP para mejor rendimiento
 */

/**
 * Convierte una imagen base64 a formato WebP
 * @param {string} base64Image - Imagen en formato base64
 * @param {number} quality - Calidad de la imagen WebP (0-1), por defecto 0.8
 * @returns {Promise<string>} - Promesa que resuelve con la imagen en formato WebP como base64
 */
export async function convertBase64ToWebP(base64Image, quality = 0.8) {
  return new Promise((resolve, reject) => {
    // Crear un elemento de imagen
    const img = new Image()

    img.onload = () => {
      try {
        // Crear un canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Establecer las dimensiones del canvas
        canvas.width = img.width
        canvas.height = img.height

        // Dibujar la imagen en el canvas
        ctx.drawImage(img, 0, 0)

        // Convertir a WebP
        const webpDataUrl = canvas.toDataURL('image/webp', quality)

        resolve(webpDataUrl)
      } catch (error) {
        console.error('Error al convertir imagen a WebP:', error)
        reject(error)
      }
    }

    img.onerror = (error) => {
      console.error('Error al cargar la imagen:', error)
      reject(error)
    }

    // Cargar la imagen base64
    img.src = base64Image
  })
}

/**
 * Convierte una imagen base64 a WebP con redimensionamiento
 * @param {string} base64Image - Imagen en formato base64
 * @param {number} maxWidth - Ancho máximo de la imagen
 * @param {number} maxHeight - Alto máximo de la imagen
 * @param {number} quality - Calidad de la imagen WebP (0-1)
 * @returns {Promise<string>} - Promesa que resuelve con la imagen optimizada
 */
export async function optimizeBase64Image(base64Image, maxWidth = 1200, maxHeight = 675, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      try {
        // Calcular nuevas dimensiones manteniendo el aspect ratio
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        // Crear canvas con las nuevas dimensiones
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.width = width
        canvas.height = height

        // Dibujar la imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height)

        // Convertir a WebP
        const webpDataUrl = canvas.toDataURL('image/webp', quality)

        resolve(webpDataUrl)
      } catch (error) {
        console.error('Error al optimizar imagen:', error)
        reject(error)
      }
    }

    img.onerror = (error) => {
      console.error('Error al cargar la imagen:', error)
      reject(error)
    }

    img.src = base64Image
  })
}

/**
 * Convierte una imagen base64 a Blob
 * @param {string} base64Image - Imagen en formato base64
 * @returns {Blob} - Blob de la imagen
 */
export function base64ToBlob(base64Image) {
  // Extraer el tipo de imagen y los datos
  const parts = base64Image.split(',')
  const imageType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
  const byteString = atob(parts[1])

  // Crear un array de bytes
  const arrayBuffer = new ArrayBuffer(byteString.length)
  const uint8Array = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i)
  }

  // Crear el Blob
  return new Blob([arrayBuffer], { type: imageType })
}

/**
 * Convierte un Blob a base64
 * @param {Blob} blob - Blob a convertir
 * @returns {Promise<string>} - Promesa que resuelve con la imagen en base64
 */
export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Cachea imágenes WebP optimizadas
 */
class ImageCache {
  constructor() {
    this.cache = new Map()
    this.maxSize = 50 // Máximo de imágenes en cache
  }

  get(key) {
    return this.cache.get(key)
  }

  set(key, value) {
    // Si el cache está lleno, eliminar la entrada más antigua
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, value)
  }

  has(key) {
    return this.cache.has(key)
  }

  clear() {
    this.cache.clear()
  }
}

// Instancia singleton del cache
const imageCache = new ImageCache()

/**
 * Obtiene una imagen optimizada desde el cache o la convierte
 * @param {string} imageUrl - URL o base64 de la imagen
 * @param {Object} options - Opciones de optimización
 * @returns {Promise<string>} - Promesa que resuelve con la imagen optimizada
 */
export async function getCachedOptimizedImage(imageUrl, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 675,
    quality = 0.8,
    size = 'large' // 'small', 'medium', 'large'
  } = options

  // Generar key del cache
  const cacheKey = `${imageUrl}_${size}_${maxWidth}_${maxHeight}_${quality}`

  // Verificar si está en cache
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)
  }

  try {
    let optimizedImage = imageUrl

    // Si es base64, optimizar
    if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
      // Ajustar dimensiones según el tamaño
      const sizeMap = {
        small: { width: 400, height: 300 },
        medium: { width: 800, height: 600 },
        large: { width: 1200, height: 675 }
      }

      const dimensions = sizeMap[size] || sizeMap.medium

      optimizedImage = await optimizeBase64Image(
        imageUrl,
        dimensions.width,
        dimensions.height,
        quality
      )

      console.log(`✅ Imagen convertida a WebP (${size}): ${Math.round(optimizedImage.length / 1024)} KB`)
    }

    // Guardar en cache
    imageCache.set(cacheKey, optimizedImage)

    return optimizedImage
  } catch (error) {
    console.error('Error al procesar imagen:', error)
    return imageUrl // Retornar original en caso de error
  }
}

/**
 * Calcula el tamaño de una imagen base64 en KB
 * @param {string} base64Image - Imagen en formato base64
 * @returns {number} - Tamaño en KB
 */
export function getBase64ImageSize(base64Image) {
  if (!base64Image || typeof base64Image !== 'string') return 0

  // Eliminar el prefijo data:image/...;base64,
  const base64Data = base64Image.split(',')[1] || base64Image

  // Calcular tamaño (cada carácter base64 representa 3/4 de un byte)
  const sizeInBytes = (base64Data.length * 3) / 4
  const sizeInKB = sizeInBytes / 1024

  return Math.round(sizeInKB)
}

/**
 * Limpia el cache de imágenes
 */
export function clearImageCache() {
  imageCache.clear()
  console.log('🗑️ Cache de imágenes limpiado')
}

export default {
  convertBase64ToWebP,
  optimizeBase64Image,
  base64ToBlob,
  blobToBase64,
  getCachedOptimizedImage,
  getBase64ImageSize,
  clearImageCache
}
