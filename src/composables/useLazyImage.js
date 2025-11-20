import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable para lazy loading de imágenes con Intersection Observer
 *
 * @param {Object} options - Opciones de configuración
 * @param {number} options.threshold - Porcentaje de visibilidad para cargar (0-1)
 * @param {string} options.rootMargin - Margen del viewport para precargar
 * @returns {Object} Estado y funciones del lazy loading
 *
 * @example
 * const { imageRef, isLoaded, error } = useLazyImage({ threshold: 0.1 })
 * <img ref="imageRef" :data-src="imageSrc" :class="{ 'loaded': isLoaded }" />
 */
export function useLazyImage(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px'
  } = options

  const imageRef = ref(null)
  const isLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref(null)
  let observer = null

  const loadImage = (element) => {
    if (!element || isLoaded.value || isLoading.value) return

    const src = element.dataset.src || element.getAttribute('data-src')
    if (!src) return

    isLoading.value = true
    error.value = null

    // Crear imagen temporal para precargar
    const img = new Image()

    img.onload = () => {
      element.src = src
      element.classList.add('loaded')
      isLoaded.value = true
      isLoading.value = false

      // Desconectar observer una vez cargada
      if (observer) {
        observer.unobserve(element)
      }
    }

    img.onerror = (err) => {
      error.value = 'Error al cargar la imagen'
      isLoading.value = false
      console.error('Error cargando imagen:', err)
    }

    img.src = src
  }

  onMounted(() => {
    if (!imageRef.value) return

    // Verificar soporte de Intersection Observer
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage(entry.target)
            }
          })
        },
        {
          threshold,
          rootMargin
        }
      )

      observer.observe(imageRef.value)
    } else {
      // Fallback para navegadores sin soporte
      loadImage(imageRef.value)
    }
  })

  onUnmounted(() => {
    if (observer && imageRef.value) {
      observer.unobserve(imageRef.value)
      observer.disconnect()
    }
  })

  return {
    imageRef,
    isLoaded,
    isLoading,
    error
  }
}

/**
 * Composable para lazy loading de múltiples imágenes
 *
 * @param {Object} options - Opciones de configuración
 * @returns {Object} Funciones para gestionar múltiples imágenes
 *
 * @example
 * const { observe, unobserve, loadedImages } = useLazyImages()
 *
 * onMounted(() => {
 *   const images = document.querySelectorAll('img[data-src]')
 *   images.forEach(img => observe(img))
 * })
 */
export function useLazyImages(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px'
  } = options

  const loadedImages = ref(new Set())
  let observer = null

  const loadImage = (element) => {
    const src = element.dataset.src || element.getAttribute('data-src')
    if (!src || loadedImages.value.has(element)) return

    const img = new Image()

    img.onload = () => {
      element.src = src
      element.classList.add('loaded')
      loadedImages.value.add(element)

      if (observer) {
        observer.unobserve(element)
      }
    }

    img.onerror = (err) => {
      console.error('Error cargando imagen:', err)
      element.classList.add('error')
    }

    img.src = src
  }

  const observe = (element) => {
    if (!element) return

    if (!observer && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage(entry.target)
            }
          })
        },
        {
          threshold,
          rootMargin
        }
      )
    }

    if (observer) {
      observer.observe(element)
    } else {
      // Fallback sin Intersection Observer
      loadImage(element)
    }
  }

  const unobserve = (element) => {
    if (observer && element) {
      observer.unobserve(element)
    }
  }

  const disconnect = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    observe,
    unobserve,
    disconnect,
    loadedImages
  }
}

/**
 * Directiva personalizada para lazy loading de imágenes
 * Uso: v-lazy="imageSrc"
 */
export const lazyDirective = {
  mounted(el, binding) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image()
            img.onload = () => {
              el.src = binding.value
              el.classList.add('loaded')
              observer.unobserve(el)
            }
            img.onerror = () => {
              el.classList.add('error')
              console.error('Error cargando imagen:', binding.value)
            }
            img.src = binding.value
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    observer.observe(el)

    // Guardar observer para limpieza
    el._lazyObserver = observer
  },

  unmounted(el) {
    if (el._lazyObserver) {
      el._lazyObserver.disconnect()
      delete el._lazyObserver
    }
  }
}
