<script setup>
import { useRouter } from 'vue-router'
import { useTabsStore } from '../stores/tabs'

const router = useRouter()
const tabsStore = useTabsStore()

const menuItems = [
  { path: '/users', title: '用户管理' },
  { path: '/geo', title: '地理数据管理' }
]

const onMenuClick = (item) => {
  tabsStore.openTab(item)
  router.push(item.path)
}
</script>

<template>
  <aside class="sidebar">
    <h1 class="logo">Dodo Vue3</h1>
    <button
      v-for="item in menuItems"
      :key="item.path"
      class="menu-btn"
      type="button"
      @click="onMenuClick(item)"
    >
      {{ item.title }}
    </button>
  </aside>
</template>
