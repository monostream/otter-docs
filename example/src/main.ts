import { createApp } from 'vue'
import App from './App.vue'
import Welcome from './views/Welcome.vue'
import Project from './views/Project.vue'
import { createRouter, createWebHistory } from 'vue-router'

import './index.css'

const routes = [
  { path: '/', component: Welcome, meta: { title: 'Dashboard' } },
  { path: '/project/:name', component: Project, meta: { title: 'Project' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)

app.use(router)

app.mount('#app')
