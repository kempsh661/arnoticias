import { ref, onMounted, onUnmounted } from 'vue'

// Estado global del tema
const currentTheme = ref('light')
const isInitialized = ref(false)

// Función para aplicar el tema
const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  currentTheme.value = theme
  localStorage.setItem('theme-preference', theme)
  localStorage.setItem('theme-set-time', Date.now().toString())
  
  // Forzar actualización del body
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease'
  
  console.log(`🎨 Tema aplicado: ${theme}`)
}

// Función para determinar el tema basado en la hora
const getThemeBasedOnTime = () => {
  const hour = new Date().getHours()
  // Tema oscuro: 18:00 - 7:00 (más natural)
  return (hour >= 18 || hour < 7) ? 'dark' : 'light'
}

// Función para inicializar el tema
const initializeTheme = () => {
  if (isInitialized.value) return
  
  const savedTheme = localStorage.getItem('theme-preference')
  const savedTime = localStorage.getItem('theme-set-time')
  
  console.log('🎨 Inicializando sistema de temas...')
  console.log('💾 Tema guardado:', savedTheme)
  
  if (savedTheme && savedTime) {
    const timeDiff = Date.now() - parseInt(savedTime)
    const fiveMinutes = 5 * 60 * 1000
    
    if (timeDiff < fiveMinutes) {
      console.log('✅ Usando tema guardado:', savedTheme)
      applyTheme(savedTheme)
    } else {
      console.log('⏰ Tiempo expirado, estableciendo tema basado en horario')
      const newTheme = getThemeBasedOnTime()
      applyTheme(newTheme)
    }
  } else {
    console.log('🆕 Primera vez, estableciendo tema basado en horario')
    const newTheme = getThemeBasedOnTime()
    applyTheme(newTheme)
  }
  
  isInitialized.value = true
}

// Función para obtener el icono del tema
const getThemeIcon = () => {
  return currentTheme.value === 'dark' ? '🌙' : '☀️'
}

// Función para obtener el tooltip del tema
const getThemeTooltip = () => {
  const hour = new Date().getHours()
  const themeText = currentTheme.value === 'dark' ? 'Tema Oscuro' : 'Tema Claro'
  return `${themeText} - Horario: ${hour}:00h (Automático)`
}

// Intervalo para verificar cambio de hora
let themeInterval = null

const startThemeWatcher = () => {
  if (themeInterval) return
  
  themeInterval = setInterval(() => {
    console.log('⚡ Verificación automática de tema...')
    const newTheme = getThemeBasedOnTime()
    if (newTheme !== currentTheme.value) {
      applyTheme(newTheme)
    }
  }, 5 * 60 * 1000) // Verificar cada 5 minutos
}

const stopThemeWatcher = () => {
  if (themeInterval) {
    clearInterval(themeInterval)
    themeInterval = null
  }
}

// Composable principal
export function useTheme() {
  onMounted(() => {
    initializeTheme()
    startThemeWatcher()
  })
  
  onUnmounted(() => {
    stopThemeWatcher()
  })
  
  return {
    currentTheme,
    getThemeIcon,
    getThemeTooltip,
    initializeTheme,
    applyTheme
  }
}
