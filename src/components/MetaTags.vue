<template>
  <!-- Meta tags dinámicos para SEO y redes sociales -->
</template>

<script>
import { onMounted, onUnmounted } from 'vue'

export default {
  name: 'MetaTags',
  props: {
    title: {
      type: String,
      default: 'Arauca Noticias - Tu fuente confiable de información'
    },
    description: {
      type: String,
      default: 'Mantente informado con las últimas noticias y acontecimientos'
    },
    image: {
      type: String,
      default: '/logo-aruca.png'
    },
    url: {
      type: String,
      default: 'https://araucanoticias.com.co'
    },
    type: {
      type: String,
      default: 'website'
    }
  },
  setup(props) {
    const updateMetaTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    const updateMetaName = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    const updateTitle = (title) => {
      document.title = title
    }

    const updateMetaTags = () => {
      // Título de la página
      updateTitle(props.title)
      
      // Meta description
      updateMetaName('description', props.description)
      
      // Open Graph / Facebook
      updateMetaTag('og:type', props.type)
      updateMetaTag('og:url', props.url)
      updateMetaTag('og:title', props.title)
      updateMetaTag('og:description', props.description)
      updateMetaTag('og:image', props.image)
      updateMetaTag('og:image:width', '800')
      updateMetaTag('og:image:height', '600')
      updateMetaTag('og:image:alt', props.title)
      updateMetaTag('og:site_name', 'Arauca Noticias')
      updateMetaTag('og:locale', 'es_CO')
      
      // Twitter Card
      updateMetaTag('twitter:card', 'summary_large_image')
      updateMetaTag('twitter:url', props.url)
      updateMetaTag('twitter:title', props.title)
      updateMetaTag('twitter:description', props.description)
      updateMetaTag('twitter:image', props.image)
      updateMetaTag('twitter:image:alt', props.title)
      updateMetaTag('twitter:site', '@AraucaNoticias')
      updateMetaTag('twitter:creator', '@AraucaNoticias')
      
      // Meta tags adicionales para WhatsApp y otras plataformas
      updateMetaName('twitter:domain', 'araucanoticias.com.co')
      updateMetaName('robots', 'index, follow')
      updateMetaName('author', 'Arauca Noticias')
      updateMetaName('publisher', 'Arauca Noticias')
      
      // Meta tags para móviles
      updateMetaName('viewport', 'width=device-width, initial-scale=1.0')
      updateMetaName('theme-color', '#1e40af')
    }

    onMounted(() => {
      updateMetaTags()
    })

    // Actualizar cuando cambien las props
    const updateTags = () => {
      updateMetaTags()
    }

    return {
      updateTags
    }
  },
  watch: {
    title() {
      this.updateTags()
    },
    description() {
      this.updateTags()
    },
    image() {
      this.updateTags()
    },
    url() {
      this.updateTags()
    }
  }
}
</script>
