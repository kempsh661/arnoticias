import { ref, onMounted, onUnmounted, unref, watch } from 'vue'

/**
 * Composable para gestionar un carrusel de imágenes/contenido
 * @param {Object} options - Opciones del carrusel
 * @param {number|Ref<number>} options.itemsCount - Número total de items (puede ser reactivo)
 * @param {number} options.autoplayInterval - Intervalo de autoplay en ms (default: 5000)
 * @param {boolean} options.autoplay - Activar autoplay (default: true)
 */
export function useCarousel(options = {}) {
  const {
    itemsCount = 0,
    autoplayInterval = 5000,
    autoplay = true
  } = options

  const currentSlide = ref(0)
  let intervalId = null

  // Función helper para obtener el valor actual de itemsCount
  const getItemsCount = () => unref(itemsCount)

  const nextSlide = () => {
    const count = getItemsCount()
    if (count === 0) return
    currentSlide.value = (currentSlide.value + 1) % count
  }

  const prevSlide = () => {
    const count = getItemsCount()
    if (count === 0) return
    currentSlide.value = currentSlide.value === 0 ? count - 1 : currentSlide.value - 1
  }

  const goToSlide = (index) => {
    const count = getItemsCount()
    if (index >= 0 && index < count) {
      currentSlide.value = index
    }
  }

  const startAutoplay = () => {
    const count = getItemsCount()
    if (!autoplay || count === 0) return

    stopAutoplay() // Limpiar cualquier intervalo existente
    intervalId = setInterval(() => {
      nextSlide()
    }, autoplayInterval)
  }

  const stopAutoplay = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const resetAutoplay = () => {
    stopAutoplay()
    startAutoplay()
  }

  // Observar cambios en itemsCount para reiniciar autoplay cuando se carguen items
  watch(() => getItemsCount(), (newCount, oldCount) => {
    if (newCount > 0 && newCount !== oldCount) {
      // Resetear slide si el nuevo count es menor que el slide actual
      if (currentSlide.value >= newCount) {
        currentSlide.value = 0
      }
      // Reiniciar autoplay cuando se carguen items
      if (autoplay) {
        startAutoplay()
      }
    }
  })

  onMounted(() => {
    const count = getItemsCount()
    if (autoplay && count > 0) {
      startAutoplay()
    }
  })

  onUnmounted(() => {
    stopAutoplay()
  })

  return {
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    startAutoplay,
    stopAutoplay,
    resetAutoplay
  }
}
