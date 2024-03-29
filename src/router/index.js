import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginVue from '@/views/Login.vue'
import CartVue from '@/views/Cart.vue'
import MontreListVue from '@/views/MontreList.vue'
import MontreSingleVue from '@/views/MontreSingle.vue'
import MontreEditVue from '@/views/MontreEdit.vue'

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
      path: '/cart',
      name: 'cart',
      component: CartVue
    },
    {
      path: '/montre-list/',
      name: 'montre-list',
      component: MontreListVue
    },
    {
      path: '/montre-single',
      name: 'montre-single',
      component: MontreSingleVue
    },
    {
      path: '/montre-edit/:id',
      name: 'montre-edit-id',
      component: MontreEditVue
    },

  ]
})

export default router
