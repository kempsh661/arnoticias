<template>
  <div>
    <h1>Test News Component</h1>
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <p>Total noticias: {{ news.length }}</p>
      <ul>
        <li v-for="item in news" :key="item.id">
          {{ item.title }} - {{ item.category }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { newsService } from '../services/api.js'

export default {
  name: 'TestNews',
  setup() {
    const news = ref([])
    const loading = ref(true)
    const error = ref(null)

    const loadNews = async () => {
      try {
        console.log('Loading news...')
        const response = await newsService.getAll({ per_page: 10 })
        console.log('API Response:', response)
        news.value = response.data || []
        console.log('News loaded:', news.value.length)
      } catch (err) {
        console.error('Error loading news:', err)
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadNews()
    })

    return {
      news,
      loading,
      error
    }
  }
}
</script>

