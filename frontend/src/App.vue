<script setup>
import SidebarMenu from './components/SidebarMenu.vue'
import TabsBar from './components/TabsBar.vue'
</script>

<template>
  <div class="layout">
    <SidebarMenu />
    <main class="content">
      <TabsBar />
      <router-view class="view" />
    </main>
  </div>
</template>
