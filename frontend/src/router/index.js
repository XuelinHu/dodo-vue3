import { createRouter, createWebHistory } from 'vue-router'
import UserManagementView from '../views/UserManagementView.vue'
import GeoManagementView from '../views/GeoManagementView.vue'

const routes = [
  {
    path: '/',
    redirect: '/users'
  },
  {
    path: '/users',
    name: 'users',
    component: UserManagementView,
    meta: { title: '用户管理' }
  },
  {
    path: '/geo',
    name: 'geo',
    component: GeoManagementView,
    meta: { title: '地理数据管理' }
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
