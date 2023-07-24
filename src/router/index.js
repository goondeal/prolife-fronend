import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },
  { path: '/app', name: 'home', component: () => import('../views/HomeView.vue') },
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
