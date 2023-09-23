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
    meta: { layout: DefaultLayout },
  },
  {
    path: '/app/categories/:id',
    name: 'category-detail',
    component: () => import('../views/CategoryView.vue'),
    meta: { layout: DefaultLayout },

  },
  {
    path: '/app/categories/:id/new-project',
    name: 'new-project',
    component: () => import('../views/UploadProjectView.vue'),
    meta: { layout: DefaultLayout },
  },
  {
    path: '/app/categories/:id/projects/:projectID',
    name: 'project-detail',
    component: () => import('../views/ProjectView.vue'),
    meta: { layout: DefaultLayout },
  },
  {
    path: '/app/categories/:id/projects/:projectID/tasks/:taskID',
    name: 'task-detail',
    component: () => import('../views/TaskView.vue'),
    meta: { layout: DefaultLayout },
  },
  {
    path: '/app/calendar',
    name: 'calendar',
    component: () => import('../views/CalendarView.vue'),
    meta: { layout: DefaultLayout },
  },
  // Not Found Page
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue'),
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
