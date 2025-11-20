<template>
  <section id="destacadas" class="section featured-section">
    <div class="container">
      <h2 class="section-title">Noticias Destacadas</h2>
      <div class="grid grid-3">
        <NewsCard
          v-for="news in newsItems"
          :key="news.id"
          :news="news"
          size="medium"
          @open-modal="$emit('open-news', $event)"
          @share="$emit('share-news', $event)"
        />
      </div>
      <div v-if="newsItems.length === 0" class="empty-state">
        <p>No hay noticias destacadas en este momento.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import NewsCard from './NewsCard.vue'

defineProps({
  newsItems: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['open-news', 'share-news'])
</script>

<style scoped>
.section {
  padding: 4rem 0;
}

.featured-section {
  background: var(--bg-primary, white);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  color: var(--text-primary, #2d3748);
  position: relative;
  padding-bottom: 1rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color, #1a365d), var(--secondary-color, #2c5282));
  border-radius: 2px;
}

.grid {
  display: grid;
  gap: 2rem;
}

.grid-3 {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary, #718096);
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .section {
    padding: 2rem 0;
  }

  .section-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .grid {
    gap: 1.5rem;
  }

  .grid-3 {
    grid-template-columns: 1fr;
  }
}
</style>
