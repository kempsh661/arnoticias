<template>
  <div class="news-form">
    <div class="form-header">
      <h2>{{ editingNews ? 'Editar Noticia' : 'Nueva Noticia' }}</h2>
      <button @click="$emit('close')" class="close-btn">&times;</button>
    </div>
    
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="title">Título *</label>
        <input 
          type="text" 
          id="title" 
          v-model="formData.title" 
          required 
          class="form-input"
          placeholder="Ingresa el título de la noticia"
        >
      </div>
      
      <div class="form-group">
        <label for="excerpt">Resumen *</label>
        <textarea 
          id="excerpt" 
          v-model="formData.excerpt" 
          required 
          rows="3"
          class="form-input"
          placeholder="Escribe un resumen de la noticia"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="category">Categoría *</label>
        <select id="category" v-model="formData.category" required class="form-input">
          <option value="">Selecciona una categoría</option>
          <option value="Política">Política</option>
          <option value="Seguridad">Seguridad</option>
          <option value="Educación">Educación</option>
          <option value="Salud">Salud</option>
          <option value="Deportes">Deportes</option>
          <option value="Bienestar Social">Bienestar Social</option>
          <option value="Desarrollo Rural">Desarrollo Rural</option>
          <option value="Infraestructura">Infraestructura</option>
          <option value="Gobierno">Gobierno</option>
          <option value="Vivienda">Vivienda</option>
        </select>
      </div>
      
      <!-- Sección de galería de imágenes -->
      <div class="form-group">
        <label>Galería de imágenes de la noticia</label>
        
        <!-- Botón para subir múltiples imágenes -->
        <div class="upload-section">
          <input 
            ref="imageInput"
            type="file" 
            id="images-upload" 
            @change="handleImagesUpload"
            accept="image/*"
            multiple
            class="file-input"
            style="display: none;"
          >
          <label for="images-upload" class="upload-btn">
            <span class="upload-icon">📷</span>
            Subir imágenes (máximo 10)
          </label>
          
          <!-- Vista previa de las imágenes subidas -->
          <div v-if="uploadedImages.length > 0" class="images-gallery">
            <div class="gallery-header">
              <h4>Imágenes subidas ({{ uploadedImages.length }})</h4>
              <p class="gallery-instruction">Arrastra para reordenar • Haz clic en la estrella para marcar como principal</p>
            </div>
            
            <div class="images-grid">
              <div 
                v-for="(image, index) in uploadedImages" 
                :key="index"
                class="image-item"
                :class="{ 'main-image': image.isMain, 'loading': !image.preview }"
                draggable="true"
                @dragstart="dragStart(index)"
                @dragover.prevent
                @drop="dragDrop(index)"
              >
                <!-- Imagen o placeholder de carga -->
                <div class="image-container">
                  <img 
                    v-if="image.preview" 
                    :src="image.preview" 
                    :alt="image.name"
                    class="image-preview"
                  >
                  <div v-else class="loading-placeholder">
                    <div class="loading-spinner"></div>
                    <p>Procesando...</p>
                  </div>
                </div>
                
                <!-- Información de la imagen -->
                <div class="image-info">
                  <span class="image-name">{{ image.name }}</span>
                  <span v-if="image.dimensions" class="image-dimensions">{{ image.dimensions }}</span>
                  <span v-if="image.originalSize" class="image-size">
                    {{ Math.round(image.originalSize / 1024) }}KB
                  </span>
                  <span v-else-if="image.existing" class="image-size">
                    Imagen existente
                  </span>
                </div>
                
                <!-- Overlay con controles -->
                <div v-if="image.preview" class="image-overlay">
                  <button 
                    type="button" 
                    class="main-btn"
                    :class="{ active: image.isMain }"
                    @click="setMainImage(index)"
                    :title="image.isMain ? 'Imagen principal' : 'Marcar como principal'"
                  >
                    ⭐
                  </button>
                  <button 
                    type="button" 
                    class="remove-btn"
                    @click="removeImageFromGallery(index)"
                    title="Eliminar imagen"
                  >
                    ×
                  </button>
                </div>
                
                <!-- Indicador de imagen principal -->
                <div v-if="image.isMain" class="main-indicator">
                  <span>Principal</span>
                </div>
                
                <!-- Campos adicionales -->
                <div v-if="image.preview" class="image-fields">
                  <input 
                    v-model="image.altText"
                    type="text" 
                    placeholder="Texto alternativo"
                    class="image-input"
                  >
                  <input 
                    v-model="image.caption"
                    type="text" 
                    placeholder="Descripción (opcional)"
                    class="image-input"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Opción alternativa: URL de imagen única (backward compatibility) -->
        <div class="url-alternative" v-if="uploadedImages.length === 0">
          <p class="url-label">O ingresa una URL de imagen:</p>
          <input 
            type="url" 
            id="image-url" 
            v-model="formData.imageUrl" 
            class="form-input"
            placeholder="https://ejemplo.com/imagen.jpg"
          >
        </div>
      </div>
      
      <div class="form-group">
        <label for="content">Contenido *</label>
        <textarea 
          id="content" 
          v-model="formData.content" 
          required 
          rows="10"
          class="form-input"
          placeholder="Escribe el contenido de la noticia en HTML"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="video">URL del video (opcional)</label>
        <input 
          type="url" 
          id="video" 
          v-model="formData.video" 
          class="form-input"
          placeholder="https://ejemplo.com/video.mp4"
        >
      </div>
      
      <div class="form-group">
        <label for="author">Autor</label>
        <input 
          type="text" 
          id="author" 
          v-model="formData.author" 
          class="form-input"
          placeholder="Nombre del autor"
        >
      </div>
      
      <!-- Opciones adicionales -->
      <div class="form-group options-group">
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="formData.featured"
              class="checkbox-input"
            >
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">
              <span class="star-icon">⭐</span>
              Marcar como noticia destacada
            </span>
          </label>
        </div>
        
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="formData.published"
              class="checkbox-input"
              disabled
            >
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">
              <span class="publish-icon">📢</span>
              Estado: {{ formData.published ? 'Publicada' : 'Borrador' }}
            </span>
          </label>
        </div>
      </div>
      
      <!-- Indicador de estado de publicación -->
      <div v-if="editingNews" class="publish-status">
        <div class="status-indicator" :class="{ 'published': formData.published, 'draft': !formData.published }">
          <span class="status-icon">{{ formData.published ? '✅' : '📝' }}</span>
          <span class="status-text">
            {{ formData.published ? 'Noticia publicada' : 'Noticia en borrador' }}
          </span>
          <span v-if="formData.published && formData.published_at" class="status-date">
            Publicada el {{ formatDate(formData.published_at) }}
          </span>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="$emit('close')" class="btn btn-secondary">
          Cancelar
        </button>
        <button type="button" @click="previewNews" class="btn btn-preview" :disabled="!canPreview">
          👁️ Previsualizar
        </button>
        <button type="button" @click="togglePublish" class="btn btn-publish" :disabled="loading || !canSave">
          {{ formData.published ? '📢 Despublicar' : '📢 Publicar' }}
        </button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Guardando...' : (editingNews ? 'Actualizar' : 'Crear') }}
        </button>
      </div>
    </form>
    
    <!-- Modal de previsualización -->
    <div v-if="showPreview" class="preview-overlay" @click="closePreview">
      <div class="preview-modal" @click.stop>
        <div class="preview-header">
          <h3>Previsualización de la noticia</h3>
          <button @click="closePreview" class="preview-close">&times;</button>
        </div>
        
        <div class="preview-content">
          <!-- Vista como en la página principal (modal) -->
          <div class="preview-section">
            <h4>Vista en Modal (Página Principal)</h4>
            <div class="modal-preview">
              <div class="modal-hero">
                <div class="modal-hero-content">
                  <div class="modal-meta-badges">
                    <span class="modal-category-badge">{{ formData.category }}</span>
                    <span class="modal-date-badge">{{ formatPreviewDate() }}</span>
                  </div>
                  <h1 class="modal-title">{{ formData.title || 'Título de la noticia' }}</h1>
                </div>
              </div>
              
              <div class="modal-body">
                <div v-if="formData.video" class="modal-video-section">
                  <!-- Video de YouTube -->
                  <iframe 
                    v-if="getVideoType(formData.video) === 'youtube'"
                    :src="getYouTubeEmbedUrl(formData.video)"
                    class="modal-video iframe-video"
                    frameborder="0"
                    allowfullscreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                  
                  <!-- Video de Facebook -->
                  <iframe 
                    v-else-if="getVideoType(formData.video) === 'facebook'"
                    :src="getFacebookEmbedUrl(formData.video)"
                    class="modal-video iframe-video"
                    frameborder="0"
                    allowfullscreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  ></iframe>
                  
                  <!-- Video de Vimeo -->
                  <iframe 
                    v-else-if="getVideoType(formData.video) === 'vimeo'"
                    :src="getVimeoEmbedUrl(formData.video)"
                    class="modal-video iframe-video"
                    frameborder="0"
                    allowfullscreen
                  ></iframe>
                  
                  <!-- Video directo (MP4, etc.) -->
                  <video 
                    v-else-if="getVideoType(formData.video) === 'direct'"
                    controls 
                    :poster="finalImage" 
                    class="modal-video"
                  >
                    <source :src="formData.video" type="video/mp4">
                    Tu navegador no soporta el elemento video.
                  </video>
                  
                  <!-- Fallback para URLs desconocidas -->
                  <div v-else class="video-fallback">
                    <p>⚠️ Tipo de video no soportado en previsualización.</p>
                    <p>Tipos soportados: YouTube, Facebook, Vimeo, MP4</p>
                    <a :href="formData.video" target="_blank" class="video-link">
                      Ver video: {{ formData.video }}
                    </a>
                  </div>
                </div>
                
                <div class="modal-content-text">
                  <p class="excerpt-preview">{{ formData.excerpt || 'Resumen de la noticia...' }}</p>
                  <div v-html="formData.content || '<p>Contenido de la noticia...</p>'"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Vista como en página de detalle -->
          <div class="preview-section">
            <h4>Vista en Página de Detalle</h4>
            <div class="detail-preview">
              <article class="article">
                <header class="article-header">
                  <div class="breadcrumb">
                    <span>Inicio</span>
                    <span class="separator">›</span>
                    <span class="current">{{ formData.category }}</span>
                  </div>
                  
                  <h1 class="article-title">{{ formData.title || 'Título de la noticia' }}</h1>
                  
                  <div class="article-meta">
                    <span class="article-date">{{ formatPreviewDate() }}</span>
                    <span class="article-category">{{ formData.category }}</span>
                    <span class="article-author">Por {{ formData.author || 'Redacción Arauca Noticias' }}</span>
                  </div>
                </header>

                <div class="article-content">
                  <div v-if="finalImage" class="article-image">
                    <img :src="finalImage" :alt="formData.title">
                  </div>

                  <div v-if="formData.video" class="article-video">
                    <!-- Video de YouTube -->
                    <iframe 
                      v-if="getVideoType(formData.video) === 'youtube'"
                      :src="getYouTubeEmbedUrl(formData.video)"
                      class="modal-video iframe-video"
                      frameborder="0"
                      allowfullscreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                    
                    <!-- Video de Facebook -->
                    <iframe 
                      v-else-if="getVideoType(formData.video) === 'facebook'"
                      :src="getFacebookEmbedUrl(formData.video)"
                      class="modal-video iframe-video"
                      frameborder="0"
                      allowfullscreen
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    ></iframe>
                    
                    <!-- Video de Vimeo -->
                    <iframe 
                      v-else-if="getVideoType(formData.video) === 'vimeo'"
                      :src="getVimeoEmbedUrl(formData.video)"
                      class="modal-video iframe-video"
                      frameborder="0"
                      allowfullscreen
                    ></iframe>
                    
                    <!-- Video directo (MP4, etc.) -->
                    <video 
                      v-else-if="getVideoType(formData.video) === 'direct'"
                      controls 
                      :poster="finalImage"
                      class="modal-video"
                    >
                      <source :src="formData.video" type="video/mp4">
                      Tu navegador no soporta el elemento video.
                    </video>
                    
                    <!-- Fallback para URLs desconocidas -->
                    <div v-else class="video-fallback">
                      <p>⚠️ Tipo de video no soportado en previsualización.</p>
                      <p>Tipos soportados: YouTube, Facebook, Vimeo, MP4</p>
                      <a :href="formData.video" target="_blank" class="video-link">
                        Ver video: {{ formData.video }}
                      </a>
                    </div>
                  </div>

                  <div class="article-body">
                    <div class="article-excerpt">
                      {{ formData.excerpt || 'Resumen de la noticia...' }}
                    </div>
                    
                    <div class="article-text" v-html="formData.content || '<p>Contenido de la noticia...</p>'"></div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { newsService } from '../services/api.js'

export default {
  name: 'NewsForm',
  props: {
    news: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const loading = ref(false)
    const editingNews = ref(props.news)
    const imageInput = ref(null)
    const uploadedImages = ref([])
    const showPreview = ref(false)
    const draggedIndex = ref(-1)
    
    const formData = reactive({
      title: '',
      excerpt: '',
      category: '',
      image: '',
      imageUrl: '',
      content: '',
      video: '',
      author: '',
      published: true,
      featured: false
    })
    
    const handleImagesUpload = (event) => {
      const files = Array.from(event.target.files)
      
      if (files.length === 0) return
      
      // Verificar límite máximo
      const totalImages = uploadedImages.value.length + files.length
      if (totalImages > 10) {
        alert(`Solo puedes subir máximo 10 imágenes. Tienes ${uploadedImages.value.length}, intentas agregar ${files.length}`)
        return
      }
      
      files.forEach((file, index) => {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          alert(`El archivo "${file.name}" no es una imagen válida`)
          return
        }
        
        // Validar tamaño (máximo 5MB por imagen)
        if (file.size > 5 * 1024 * 1024) {
          alert(`La imagen "${file.name}" es demasiado grande. Máximo 5MB permitido`)
          return
        }
        
        // Crear vista previa y comprimir (proceso asíncrono)
        const reader = new FileReader()
        reader.onload = (e) => {
          // Crear una imagen temporal para obtener dimensiones reales
          const tempImg = new Image()
          tempImg.onload = () => {
            // Crear vista previa de alta calidad para mostrar en la interfaz
            createThumbnail(e.target.result, (thumbnail) => {
              // Comprimir para almacenamiento
              compressImage(e.target.result, (compressedImage) => {
                // Crear objeto de imagen con todos los datos listos
                const imageObj = {
                  file: file,
                  name: file.name,
                  preview: thumbnail, // Vista previa de alta calidad
                  compressed: compressedImage, // Imagen comprimida para envío
                  isMain: uploadedImages.value.length === 0, // Primera imagen es principal
                  altText: '',
                  caption: '',
                  originalSize: file.size,
                  dimensions: `${tempImg.width} × ${tempImg.height}`
                }
                
                uploadedImages.value.push(imageObj)
                console.log(`✅ Imagen procesada: ${file.name} (${Math.round(file.size / 1024)}KB → ${Math.round(compressedImage.length / 1024)}KB)`)
              })
            })
          }
          tempImg.src = e.target.result
        }
        reader.readAsDataURL(file)
      })
      
      // Limpiar input
      if (imageInput.value) {
        imageInput.value.value = ''
      }
    }

    // Crear miniatura de alta calidad para vista previa
    const createThumbnail = (base64, callback) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Tamaño fijo para miniaturas (mejor calidad)
        const thumbnailWidth = 400
        const thumbnailHeight = 300
        
        // Calcular recorte centrado (crop)
        const sourceAspectRatio = img.width / img.height
        const targetAspectRatio = thumbnailWidth / thumbnailHeight
        
        let sx, sy, sWidth, sHeight
        
        if (sourceAspectRatio > targetAspectRatio) {
          // Imagen más ancha, recortar los lados
          sHeight = img.height
          sWidth = img.height * targetAspectRatio
          sx = (img.width - sWidth) / 2
          sy = 0
        } else {
          // Imagen más alta, recortar arriba y abajo
          sWidth = img.width
          sHeight = img.width / targetAspectRatio
          sx = 0
          sy = (img.height - sHeight) / 2
        }
        
        canvas.width = thumbnailWidth
        canvas.height = thumbnailHeight
        
        // Dibujar con máxima calidad
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, thumbnailWidth, thumbnailHeight)
        
        // Usar alta calidad para vista previa
        const thumbnail = canvas.toDataURL('image/jpeg', 0.9)
        callback(thumbnail)
      }
      
      img.src = base64
    }

    // Comprimir imagen para almacenamiento
    const compressImage = (base64, callback, quality = 0.8) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calcular nuevas dimensiones (máximo 1200px de ancho para mejor calidad)
        const maxWidth = 1200
        const maxHeight = 800
        let { width, height } = img
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
        
        canvas.width = width
        canvas.height = height
        
        // Dibujar con mejor calidad
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)
        
        // Comprimir con mejor calidad inicial
        let compressedBase64 = canvas.toDataURL('image/jpeg', quality)
        
        // Solo comprimir más si es extremadamente grande (ahora permitimos hasta 2MB)
        if (compressedBase64.length > 2000000) { // ~2MB
          compressedBase64 = canvas.toDataURL('image/jpeg', 0.6)
        }
        
        callback(compressedBase64)
      }
      
      img.src = base64
    }
    
    // Funciones para manejar la galería de imágenes
    const setMainImage = (index) => {
      // Desmarcar todas las imágenes como principales
      uploadedImages.value.forEach(img => img.isMain = false)
      // Marcar la seleccionada como principal
      uploadedImages.value[index].isMain = true
    }

    const removeImageFromGallery = (index) => {
      const wasMain = uploadedImages.value[index].isMain
      uploadedImages.value.splice(index, 1)
      
      // Si eliminamos la imagen principal y quedan imágenes, hacer la primera como principal
      if (wasMain && uploadedImages.value.length > 0) {
        uploadedImages.value[0].isMain = true
      }
    }

    // Funciones de drag and drop
    const dragStart = (index) => {
      draggedIndex.value = index
    }

    const dragDrop = (dropIndex) => {
      if (draggedIndex.value !== -1 && draggedIndex.value !== dropIndex) {
        const draggedItem = uploadedImages.value[draggedIndex.value]
        uploadedImages.value.splice(draggedIndex.value, 1)
        uploadedImages.value.splice(dropIndex, 0, draggedItem)
      }
      draggedIndex.value = -1
    }
    
    const initializeForm = async () => {
      if (editingNews.value) {
        console.log('📝 Inicializando formulario para editar:', editingNews.value)
        
        // Cargar datos básicos
        Object.assign(formData, {
          title: editingNews.value.title || '',
          excerpt: editingNews.value.excerpt || '',
          category: editingNews.value.category || '',
          image: editingNews.value.image || '',
          imageUrl: editingNews.value.image || '',
          content: editingNews.value.content || '',
          video: editingNews.value.video || '',
          author: editingNews.value.author || '',
          published: editingNews.value.published !== undefined ? editingNews.value.published : true,
          featured: editingNews.value.featured || false
        })
        
        // Cargar galería existente si existe
        if (editingNews.value.gallery && editingNews.value.gallery.length > 0) {
          console.log('🖼️ Cargando galería existente:', editingNews.value.gallery.length, 'imágenes')
          console.log('🔍 Datos de galería:', editingNews.value.gallery)
          
          try {
            // Convertir galería existente a formato de uploadedImages
            const galleryImages = editingNews.value.gallery.map((image, index) => {
              const imageObj = {
                id: image.id, // ID de la imagen en la base de datos
                name: image.original_name || `imagen-${image.id}.jpg`,
                preview: image.medium_url || image.large_url || image.thumbnail_url,
                compressed: image.medium_url || image.large_url || image.thumbnail_url,
                isMain: image.is_main || false,
                altText: image.alt_text || '',
                caption: image.caption || '',
                order: image.order !== undefined ? image.order : index,
                existing: true, // Marcar como imagen existente
                originalSize: image.file_size || 0,
                dimensions: image.width && image.height ? `${image.width} × ${image.height}` : ''
              }
              console.log(`📸 Imagen ${index + 1}:`, imageObj)
              return imageObj
            })
            
            // Ordenar por orden
            galleryImages.sort((a, b) => a.order - b.order)
            
            uploadedImages.value = galleryImages
            console.log('✅ Galería cargada exitosamente:', uploadedImages.value.length, 'imágenes')
          } catch (error) {
            console.error('❌ Error cargando galería:', error)
            // Mostrar alert para debugging
            alert('Error cargando galería: ' + error.message)
          }
        } else {
          console.log('ℹ️ No hay galería existente para cargar')
        }
        
        console.log('✅ Formulario inicializado')
      }
    }
    
    const handleSubmit = async () => {
      loading.value = true
      
      try {
        // Validar campos requeridos
        if (!formData.title.trim()) {
          alert('El título es requerido')
          return
        }
        if (!formData.excerpt.trim()) {
          alert('El resumen es requerido')
          return
        }
        if (!formData.category) {
          alert('La categoría es requerida')
          return
        }
        if (!formData.content.trim()) {
          alert('El contenido es requerido')
          return
        }
        
        // Determinar imagen principal
        let mainImage = ''
        const mainImageObj = uploadedImages.value.find(img => img.isMain)
        if (mainImageObj) {
          mainImage = mainImageObj.compressed || mainImageObj.preview
        } else if (formData.imageUrl) {
          mainImage = formData.imageUrl
        }
        
        // Preparar datos básicos de la noticia
        const newsData = {
          title: formData.title.trim(),
          excerpt: formData.excerpt.trim(),
          category: formData.category,
          image: mainImage, // Imagen principal para compatibilidad
          content: formData.content.trim(),
          video: formData.video || null,
          published: formData.published,
          featured: formData.featured
        }

        console.log('💾 Guardando noticia con datos:', newsData)
        console.log('🖼️ Imágenes en galería:', uploadedImages.value.length)

        // Guardar la noticia primero
        let savedNews
        if (editingNews.value?.id) {
          // Actualizar noticia existente
          console.log('✏️ Actualizando noticia existente:', editingNews.value.id)
          const response = await newsService.update(editingNews.value.id, newsData)
          savedNews = response.data
        } else {
          // Crear nueva noticia
          console.log('🆕 Creando nueva noticia')
          const response = await newsService.create(newsData)
          savedNews = response.data
        }

        console.log('✅ Noticia guardada:', savedNews)

        // Si hay imágenes en la galería, procesar solo las nuevas
        if (uploadedImages.value.length > 0 && savedNews?.id) {
          console.log('📸 Procesando galería de imágenes...')
          
          // Separar imágenes nuevas de existentes
          const newImages = uploadedImages.value.filter(img => !img.existing)
          const existingImages = uploadedImages.value.filter(img => img.existing)
          
          console.log(`📊 Total: ${uploadedImages.value.length}, Nuevas: ${newImages.length}, Existentes: ${existingImages.length}`)
          
          // Solo subir imágenes nuevas si existen
          if (newImages.length > 0) {
            try {
              // Preparar imágenes nuevas para subir
              const imagesToUpload = newImages.map((img, index) => ({
                image_data: img.compressed || img.preview,
                original_name: img.name,
                alt_text: img.altText || '',
                caption: img.caption || '',
                is_main: img.isMain,
                order: uploadedImages.value.indexOf(img) // Mantener orden original
              }))

              console.log('📤 Subiendo', imagesToUpload.length, 'imágenes nuevas...')
              
              // Subir imágenes a la galería
              await newsService.uploadNewsImages(savedNews.id, imagesToUpload)
              
              console.log('✅ Imágenes nuevas subidas exitosamente')
            } catch (imageError) {
              console.error('❌ Error subiendo imágenes nuevas:', imageError)
              alert('Noticia guardada, pero hubo un error al subir las imágenes nuevas de la galería. Puedes editarla después.')
            }
          } else {
            console.log('ℹ️ No hay imágenes nuevas para subir')
          }
          
          // Aquí puedes agregar lógica para actualizar metadatos de imágenes existentes si es necesario
          if (existingImages.length > 0) {
            console.log('ℹ️ Imágenes existentes mantienen sus datos actuales')
          }
        }
        
        // Limpiar formulario solo si es una nueva noticia
        if (!editingNews.value) {
          Object.assign(formData, {
            title: '',
            excerpt: '',
            category: '',
            image: '',
            imageUrl: '',
            content: '',
            video: '',
            author: '',
            published: true,
            featured: false
          })
          
          // Limpiar galería de imágenes
          uploadedImages.value = []
          if (imageInput.value) {
            imageInput.value.value = ''
          }
        }

        // Emitir evento de guardado - esto cerrará el modal y recargará la lista
        emit('saved', savedNews)
        
      } catch (error) {
        console.error('❌ Error guardando noticia:', error)
        alert('Error al guardar la noticia: ' + (error.response?.data?.message || error.message))
      } finally {
        loading.value = false
      }
    }
    
    const canPreview = computed(() => {
      return formData.title.trim() && formData.excerpt.trim() && formData.category
    })
    
    const canSave = computed(() => {
      return formData.title.trim() && formData.excerpt.trim() && formData.category && formData.content.trim()
    })
    
    const finalImage = computed(() => {
      // Buscar la imagen principal en la galería
      const mainImage = uploadedImages.value.find(img => img.isMain)
      if (mainImage) {
        return mainImage.preview || mainImage.compressed
      }
      
      // Fallback a URL si no hay imágenes en galería
      return formData.imageUrl || ''
    })
    
    const previewNews = () => {
      if (canPreview.value) {
        showPreview.value = true
        document.body.style.overflow = 'hidden'
      } else {
        alert('Completa al menos el título, resumen y categoría para previsualizar')
      }
    }
    
    const closePreview = () => {
      showPreview.value = false
      document.body.style.overflow = 'auto'
    }
    
    const formatPreviewDate = () => {
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date())
    }

    // Funciones para manejo de videos
    const getVideoType = (videoUrl) => {
      if (!videoUrl) return null
      
      // Detectar YouTube
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        return 'youtube'
      }
      
      // Detectar Facebook
      if (videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch')) {
        return 'facebook'
      }
      
      // Detectar Vimeo
      if (videoUrl.includes('vimeo.com')) {
        return 'vimeo'
      }
      
      // Detectar archivos de video directos
      if (videoUrl.match(/\.(mp4|webm|ogg|avi|mov)(\?.*)?$/i)) {
        return 'direct'
      }
      
      return 'unknown'
    }

    const getYouTubeEmbedUrl = (url) => {
      let videoId = null
      
      // Formato: https://www.youtube.com/watch?v=VIDEO_ID
      const watchMatch = url.match(/[?&]v=([^&]+)/)
      if (watchMatch) {
        videoId = watchMatch[1]
      }
      
      // Formato: https://youtu.be/VIDEO_ID
      const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
      if (shortMatch) {
        videoId = shortMatch[1]
      }
      
      // Formato embed directo
      const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/)
      if (embedMatch) {
        videoId = embedMatch[1]
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`
      }
      
      return null
    }

    const getVimeoEmbedUrl = (url) => {
      const match = url.match(/vimeo\.com\/(\d+)/)
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}`
      }
      return null
    }

    const getFacebookEmbedUrl = (url) => {
      // Limpiar la URL y extraer el enlace original
      let cleanUrl = url
      
      // Si es un enlace fb.watch, obtener la URL original
      if (url.includes('fb.watch')) {
        // Para fb.watch necesitaríamos redirigir, por ahora usamos directamente
        cleanUrl = url
      }
      
      // Codificar la URL para el iframe de Facebook
      const encodedUrl = encodeURIComponent(cleanUrl)
      return `https://www.facebook.com/plugins/video.php?height=314&href=${encodedUrl}&show_text=false&width=560&t=0`
    }
    
    const formatDate = (date) => {
      if (!date) return ''
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(date))
    }
    
    const togglePublish = () => {
      if (!canSave.value) {
        alert('Completa todos los campos requeridos antes de publicar')
        return
      }
      
      const newPublishedState = !formData.published
      formData.published = newPublishedState
      
      // Si está publicando, también actualizar la fecha de publicación
      if (newPublishedState) {
        formData.published_at = new Date()
      }
      
      // Guardar inmediatamente
      handleSubmit()
    }
    
    onMounted(() => {
      initializeForm()
    })

    // Watch para recargar cuando cambie la prop news
    watch(() => props.news, (newNews) => {
      editingNews.value = newNews
      if (newNews) {
        console.log('🔄 Prop news cambió, reinicializando formulario')
        initializeForm()
      }
    }, { immediate: true })
    
    return {
      loading,
      editingNews,
      formData,
      imageInput,
      uploadedImages,
      showPreview,
      canPreview,
      canSave,
      finalImage,
      handleSubmit,
      handleImagesUpload,
      setMainImage,
      removeImageFromGallery,
      dragStart,
      dragDrop,
      previewNews,
      closePreview,
      formatPreviewDate,
      getVideoType,
      getYouTubeEmbedUrl,
      getVimeoEmbedUrl,
      getFacebookEmbedUrl,
      formatDate,
      togglePublish
    }
  }
}
</script>

<style scoped>
.news-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e1e5e9;
}

.form-header h2 {
  color: #333;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #333;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:hover:not(:focus) {
  border-color: #cbd5e0;
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e1e5e9;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #e1e5e9;
}

.btn-secondary:hover {
  background: #e9ecef;
  color: #333;
}

/* Estilos para subida de imágenes */
.upload-section {
  margin-bottom: 1rem;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  text-decoration: none;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.upload-icon {
  font-size: 1.2rem;
}

.image-preview {
  position: relative;
  margin-top: 1rem;
  max-width: 300px;
}

.image-preview img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.remove-image-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-image-btn:hover {
  background: #c53030;
  transform: scale(1.1);
}

.url-alternative {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e1e5e9;
}

.url-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-style: italic;
}

/* Estilos para opciones (checkboxes) */
.options-group {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

.checkbox-group {
  margin-bottom: 1rem;
}

.checkbox-group:last-child {
  margin-bottom: 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  color: #333;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e0;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 12px;
}

.checkbox-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.star-icon, .publish-icon {
  font-size: 1.1rem;
}

/* Estilos para el botón de previsualización */
.btn-preview {
  background: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
  color: white;
}

.btn-preview:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(56, 161, 105, 0.3);
}

.btn-preview:disabled {
  background: #cbd5e0;
  color: #a0aec0;
  cursor: not-allowed;
}

/* Estilos para el botón de publicación */
.btn-publish {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-publish:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-publish:disabled {
  background: #cbd5e0;
  color: #a0aec0;
  cursor: not-allowed;
}

/* Estilos para el indicador de estado de publicación */
.publish-status {
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.status-indicator.published {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border: 1px solid #c3e6cb;
  color: #155724;
}

.status-indicator.draft {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 1px solid #ffeaa7;
  color: #856404;
}

.status-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-text {
  font-size: 1rem;
  font-weight: 600;
}

.status-date {
  margin-left: auto;
  font-size: 0.875rem;
  opacity: 0.8;
  font-style: italic;
}

/* Estilos para el modal de previsualización */
.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.preview-modal {
  background: white;
  border-radius: 12px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e1e5e9;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.preview-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.preview-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.preview-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.preview-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.preview-section {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
}

.preview-section h4 {
  background: #f8f9fa;
  margin: 0;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e1e5e9;
}

/* Estilos para la vista de modal */
.modal-preview {
  background: white;
}

.modal-hero {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: end;
  position: relative;
}

.modal-hero-content {
  padding: 2rem;
  color: white;
  width: 100%;
}

.modal-meta-badges {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.modal-category-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modal-date-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.modal-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.modal-body {
  padding: 2rem;
}

.modal-video-section {
  margin-bottom: 2rem;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.modal-video {
  width: 100%;
  max-height: 300px;
  border-radius: 15px;
}

.iframe-video {
  width: 100%;
  height: 300px;
  border: none;
  border-radius: 15px;
}

.video-fallback {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 15px;
  border: 2px dashed #dee2e6;
}

.video-fallback p {
  color: #6c757d;
  margin-bottom: 1rem;
  font-weight: 500;
}

.video-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  word-break: break-all;
}

.video-link:hover {
  text-decoration: underline;
}

.modal-content-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
}

.excerpt-preview {
  font-size: 1.1rem;
  font-weight: 500;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  border-radius: 0 8px 8px 0;
}

/* Estilos para la vista de detalle */
.detail-preview {
  padding: 2rem;
  background: white;
}

.article {
  max-width: 800px;
  margin: 0 auto;
}

.article-header {
  padding: 0 0 2rem 0;
  border-bottom: 1px solid #e1e5e9;
  margin-bottom: 2rem;
}

.breadcrumb {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
}

.separator {
  margin: 0 0.5rem;
}

.current {
  color: #333;
  font-weight: 500;
}

.article-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: #666;
}

.article-date,
.article-author {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.article-category {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.article-content {
  padding: 0;
}

.article-image {
  margin-bottom: 2rem;
}

.article-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.article-video {
  margin-bottom: 2rem;
}

.article-video video {
  width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.article-body {
  margin-top: 2rem;
}

.article-excerpt {
  font-size: 1.1rem;
  font-weight: 500;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  border-radius: 0 8px 8px 0;
}

.article-text {
  font-size: 1rem;
  line-height: 1.7;
  color: #333;
}

.article-text p {
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .news-form {
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}

/* Images Gallery Styles */
.images-gallery {
  margin-top: 1rem;
  padding: 1rem;
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-accent);
}

.gallery-header {
  margin-bottom: 1rem;
}

.gallery-header h4 {
  color: var(--primary-color);
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.gallery-instruction {
  color: var(--text-light);
  font-size: 0.875rem;
  margin: 0;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.image-item {
  position: relative;
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  cursor: move;
  border: 2px solid transparent;
}

.image-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.image-item.main-image {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(244, 119, 33, 0.2);
}

.image-item img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.main-btn, .remove-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.main-btn {
  color: #ffa500;
}

.main-btn.active {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 0 0 2px rgba(244, 119, 33, 0.3);
}

.main-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: scale(1.1);
}

.remove-btn {
  color: #666;
  font-weight: bold;
}

.remove-btn:hover {
  background: #ff4757;
  color: white;
  transform: scale(1.1);
}

.main-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  text-align: center;
  padding: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.image-fields {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.image-input {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.875rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: var(--transition);
}

.image-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(244, 119, 33, 0.2);
}

.image-input::placeholder {
  color: var(--text-light);
}

/* Mejoras para vista previa de imágenes */
.image-container {
  width: 100%;
  height: 160px;
  position: relative;
  overflow: hidden;
  background: var(--bg-secondary);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.loading-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  color: var(--text-light);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-placeholder p {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
}

.image-info {
  padding: 0.5rem 0.75rem;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.image-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-dimensions {
  font-size: 0.75rem;
  color: var(--text-light);
  font-family: monospace;
}

.image-size {
  font-size: 0.75rem;
  color: var(--text-light);
  font-weight: 500;
}

.image-item.loading {
  pointer-events: none;
  opacity: 0.7;
}

.image-item.loading .image-overlay {
  display: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .images-grid {
    grid-template-columns: 1fr;
  }
  
  .image-container {
    height: 200px;
  }
}
</style>
