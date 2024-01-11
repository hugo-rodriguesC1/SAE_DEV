import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginVue from '@/views/Login.vue'
import MontreListVue from '@/views/MontreList.vue'
import MontreSingleVue from '@/views/MontreSingle.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginVue
    },
    {
      path: '/montre-list/',
      name: 'montre-list',
      component: MontreListVue
    },
    {
      path: '/montre-single/:id',
      name: 'montre-single-id',
      component: MontreSingleVue
    },

  ]
})

export default router
