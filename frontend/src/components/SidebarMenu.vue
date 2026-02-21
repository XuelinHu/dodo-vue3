<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabsStore } from '../stores/tabs'
import { getCapabilities } from '../api/capabilities'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()

const capabilities = ref({ postgis: false })

const menuItems = [
  { path: '/users', title: '用户管理' },
  {
    title: '学生管理',
    children: [
      { path: '/student/students', title: '学生信息' },
      { path: '/student/classes', title: '班级管理' },
      { path: '/student/scores', title: '成绩管理' },
      { path: '/student/stats', title: '数据统计' }
    ]
  },
  { path: '/geo', title: '地理数据管理', requiresPostgis: true }
]

const onSelect = (path) => {
  const flat = menuItems.flatMap((item) => (item.children ? item.children : [item]))
  const matched = flat.find((x) => x.path === path)
  if (matched) tabsStore.openTab({ path: matched.path, title: matched.title })
  router.push(path)
}

onMounted(async () => {
  try {
    const result = await getCapabilities()
    capabilities.value = result.data
  } catch {
    capabilities.value = { postgis: false }
  }
})
</script>

<template>
  <aside class="sidebar">
    <div class="logo">Dodo Vue3</div>
    <el-menu
      class="menu"
      :default-active="route.path"
      background-color="#0f172a"
      text-color="#e2e8f0"
      active-text-color="#60a5fa"
      @select="onSelect"
    >
      <el-menu-item index="/users">用户管理</el-menu-item>

      <el-sub-menu index="/student">
        <template #title>学生管理</template>
        <el-menu-item index="/student/students">学生信息</el-menu-item>
        <el-menu-item index="/student/classes">班级管理</el-menu-item>
        <el-menu-item index="/student/scores">成绩管理</el-menu-item>
        <el-menu-item index="/student/stats">数据统计</el-menu-item>
      </el-sub-menu>

      <el-menu-item v-if="capabilities.postgis" index="/geo">地理数据管理</el-menu-item>
    </el-menu>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background: #0f172a;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 16px 14px;
  font-weight: 700;
  letter-spacing: 0.4px;
}

.menu {
  border-right: none;
  background: transparent;
}
</style>
