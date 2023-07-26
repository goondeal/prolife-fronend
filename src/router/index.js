import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'


const routes = [
  // Registeration routes
  { path: '/app/signup', name: 'signup', component: () => import('../views/registeration/SignUpView.vue') },
  { path: '/app/login', name: 'login', component: () => import('../views/registeration/LoginView.vue') },
  
  // Langing page
  { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },
  
  // App routes
  {
    path: '/app',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      layout: DefaultLayout,
    },
  },
  {
    path: '/app/categories/:id', 
    name: 'category-detail', 
    component: () => import('../views/CategoryView.vue'),
    meta: {
      layout: DefaultLayout,
    },
  }

]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
