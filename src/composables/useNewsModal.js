import { ref } from 'vue'

/**
 * Composable para gestionar modales de noticias
 */
export function useNewsModal() {
  const selectedNews = ref(null)
  const showModal = ref(false)

  const openNewsModal = (news) => {
    selectedNews.value = news
    showModal.value = true
    // Prevenir scroll en el body cuando el modal está abierto
    document.body.style.overflow = 'hidden'
  }

  const closeNewsModal = () => {
    selectedNews.value = null
    showModal.value = false
    // Restaurar scroll
    document.body.style.overflow = ''
  }

  // Cerrar modal con tecla ESC
  const handleKeyPress = (event) => {
    if (event.key === 'Escape' && showModal.value) {
      closeNewsModal()
    }
  }

  return {
    selectedNews,
    showModal,
    openNewsModal,
    closeNewsModal,
    handleKeyPress
  }
}
