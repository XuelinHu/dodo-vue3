import { createRouter, createWebHistory } from 'vue-router'
import UserManagementView from '../views/UserManagementView.vue'
import GeoManagementView from '../views/GeoManagementView.vue'
import StudentListView from '../views/StudentListView.vue'
import ClassManagementView from '../views/ClassManagementView.vue'
import ScoreManagementView from '../views/ScoreManagementView.vue'
import StudentStatsView from '../views/StudentStatsView.vue'

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
    path: '/student',
    redirect: '/student/students'
  },
  {
    path: '/student/students',
    name: 'students',
    component: StudentListView,
    meta: { title: '学生信息' }
  },
  {
    path: '/student/classes',
    name: 'classes',
    component: ClassManagementView,
    meta: { title: '班级管理' }
  },
  {
    path: '/student/scores',
    name: 'scores',
    component: ScoreManagementView,
    meta: { title: '成绩管理' }
  },
  {
    path: '/student/stats',
    name: 'stats',
    component: StudentStatsView,
    meta: { title: '数据统计' }
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
