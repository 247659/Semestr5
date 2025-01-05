import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signIn',
      name: 'signIn',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SignInView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'), //idk czemu błąd ale bez tego nie działa
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../views/OrderView.vue'), //idk czemu błąd ale bez tego nie działa
    },
  ],
})

export default router