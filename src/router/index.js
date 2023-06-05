import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import Signup from '@/components/Signup.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
  
  ]
})

export default router
