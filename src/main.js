import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './components/Home.vue'
import NewsList from './components/NewsList.vue'
import './assets/styles.css'

const routes = [
  { path: '/', component: Home, name: 'home' },
  { path: '/noticias', component: NewsList, name: 'news-list' },
  { path: '/noticia/:id', component: () => import('./components/NewsDetail.vue'), name: 'news-detail' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')

// Build trigger: mar 02 sep 2025 17:39:21 -05
// Force rebuild: mar 02 sep 2025 17:55:53 -05
