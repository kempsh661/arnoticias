<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <img src="/assets/logos/logo-principal.png" alt="Arauca Noticias" class="logo-image">
          <h1 class="logo-text">Arauca Noticias</h1>
        </div>

        <nav class="nav" :class="{ 'nav-open': mobileMenuOpen }">
          <ul class="nav-list">
            <li><a href="#inicio" @click="handleScrollToSection('inicio')" class="nav-link">Inicio</a></li>
            <li><a href="#destacadas" @click="handleScrollToSection('destacadas')" class="nav-link">Destacadas</a></li>
            <li><a href="/noticias" class="nav-link">Noticias</a></li>
            <li><a href="#nosotros" @click="handleScrollToSection('nosotros')" class="nav-link">Nosotros</a></li>
            <li><a href="#contacto" @click="handleOpenContact" class="nav-link">Contacto</a></li>
            <li class="theme-indicator">
              <span class="theme-icon" :title="themeTooltip">
                {{ themeIcon }}
              </span>
            </li>
          </ul>
        </nav>

        <button class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['scroll-to-section', 'open-contact'])

const mobileMenuOpen = ref(false)

// Detectar tema del sistema
const isDarkMode = computed(() => {
  if (typeof window !== 'undefined') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

const themeIcon = computed(() => isDarkMode.value ? '🌙' : '☀️')
const themeTooltip = computed(() => isDarkMode.value ? 'Modo oscuro detectado' : 'Modo claro detectado')

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleScrollToSection = (sectionId) => {
  emit('scroll-to-section', sectionId)
  mobileMenuOpen.value = false
}

const handleOpenContact = (e) => {
  e.preventDefault()
  emit('open-contact')
  mobileMenuOpen.value = false
}
</script>

<style scoped>
/* Header Styles */
.header {
  background: var(--header-bg, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--shadow-md, 0 2px 8px rgba(0, 0, 0, 0.1));
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
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
  height: 55px;
  width: auto;
  transition: transform 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color, #1a365d);
  text-decoration: none;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: var(--text-primary, #2d3748);
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
  position: relative;
  cursor: pointer;
}

.nav-link:hover {
  color: var(--accent-color, #e53e3e);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -0.25rem;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--accent-color, #e53e3e);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* Theme indicator */
.theme-indicator {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

.theme-icon {
  font-size: 1.2rem;
  cursor: help;
  padding: 0.5rem;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.theme-icon:hover {
  transform: scale(1.1);
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-btn span {
  width: 25px;
  height: 3px;
  background-color: var(--primary-color, #1a365d);
  transition: all 0.3s ease;
  border-radius: 2px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .nav {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--bg-primary, white);
    box-shadow: var(--shadow-lg, 0 4px 12px rgba(0, 0, 0, 0.15));
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .nav.nav-open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }

  .nav-list {
    flex-direction: column;
    gap: 0;
    padding: 1rem 0;
  }

  .nav-list li {
    width: 100%;
  }

  .nav-link {
    display: block;
    padding: 1rem 2rem;
    width: 100%;
  }

  .nav-link::after {
    display: none;
  }

  .theme-indicator {
    margin-left: 0;
    padding: 1rem 2rem;
  }
}
</style>
