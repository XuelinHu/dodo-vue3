<script setup>
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabsStore } from '../stores/tabs'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()

watch(
  () => route.path,
  () => {
    tabsStore.openTab({ path: route.path, title: route.meta.title || route.path })
  },
  { immediate: true }
)

const switchTab = (path) => {
  tabsStore.setActivePath(path)
  router.push(path)
}

const closeTab = (path) => {
  tabsStore.closeTab(path)
  if (tabsStore.activePath !== route.path) {
    router.push(tabsStore.activePath)
  }
}
</script>

<template>
  <div class="tabs-bar">
    <div
      v-for="tab in tabsStore.tabs"
      :key="tab.path"
      class="tab-item"
      :class="{ active: tab.path === tabsStore.activePath }"
      @click="switchTab(tab.path)"
    >
      <span>{{ tab.title }}</span>
      <button
        v-if="tabsStore.tabs.length > 1"
        class="close"
        @click.stop="closeTab(tab.path)"
      >
        ×
      </button>
    </div>
  </div>
</template>
