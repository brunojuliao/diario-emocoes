import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/log',
    name: 'Nova Entrada',
    component: () => import('../components/Log.vue')
  },
  {
    path: '/log/:id',
    name: 'Alterar Entrada',
    component: () => import('../components/Log.vue')
  },
  {
    path: '/log-day/:day',
    name: 'Ver Entradas',
    component: () => import('../components/LogDay.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
