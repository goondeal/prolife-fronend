import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Tailwindcss
import './assets/input.css'

// easy-data-table
import 'vue3-easy-data-table/dist/style.css';

// vue3-tree-chart
import "@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css"

// axios
import axios from 'axios'
import { useUserStore } from './stores/user'


axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1'

const app = createApp(App)

app.use(createPinia())
app.use(router, axios)

app.mount('#app')

// init store
const userStor = useUserStore()
userStor.initStore()
