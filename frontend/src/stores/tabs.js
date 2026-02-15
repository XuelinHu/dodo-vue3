import { defineStore } from 'pinia'

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    activePath: '/users',
    tabs: [
      { path: '/users', title: '用户管理' }
    ]
  }),
  actions: {
    // Vue 3 + Pinia 核心知识点：集中管理 UI 状态（Tab 新增/切换/关闭）
    openTab (tab) {
      if (!this.tabs.some((item) => item.path === tab.path)) {
        this.tabs.push(tab)
      }
      this.activePath = tab.path
    },
    closeTab (path) {
      const index = this.tabs.findIndex((tab) => tab.path === path)
      if (index === -1) return
      this.tabs.splice(index, 1)
      if (this.activePath === path) {
        this.activePath = this.tabs[Math.max(index - 1, 0)]?.path || '/users'
      }
    },
    setActivePath (path) {
      this.activePath = path
    }
  }
})
