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
      
      <div class="form-group">
        <label for="image">URL de la imagen</label>
        <input 
          type="url" 
          id="image" 
          v-model="formData.image" 
          class="form-input"
          placeholder="https://ejemplo.com/imagen.jpg"
        >
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
      
      <div class="form-actions">
        <button type="button" @click="$emit('close')" class="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Guardando...' : (editingNews ? 'Actualizar' : 'Crear') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'

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
    
    const formData = reactive({
      title: '',
      excerpt: '',
      category: '',
      image: '',
      content: '',
      video: '',
      author: '',
      published: true,
      featured: false
    })
    
    const initializeForm = () => {
      if (editingNews.value) {
        Object.assign(formData, {
          title: editingNews.value.title || '',
          excerpt: editingNews.value.excerpt || '',
          category: editingNews.value.category || '',
          image: editingNews.value.image || '',
          content: editingNews.value.content || '',
          video: editingNews.value.video || '',
          author: editingNews.value.author || '',
          published: editingNews.value.published !== undefined ? editingNews.value.published : true,
          featured: editingNews.value.featured || false
        })
      }
    }
    
    const handleSubmit = async () => {
      loading.value = true
      
      try {
        // Simular guardado
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Emitir evento de guardado
        emit('saved', { ...formData, id: editingNews.value?.id || Date.now() })
        
        // Limpiar formulario
        Object.assign(formData, {
          title: '',
          excerpt: '',
          category: '',
          image: '',
          content: '',
          video: '',
          author: '',
          published: true,
          featured: false
        })
        
      } catch (error) {
        console.error('Error guardando noticia:', error)
        alert('Error al guardar la noticia')
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      initializeForm()
    })
    
    return {
      loading,
      editingNews,
      formData,
      handleSubmit
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
</style>
