import { defineStore } from 'pinia'

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    activePath: '/users',
    tabs: [
      { path: '/users', title: '用户管理' }
    ]
  }),
  actions: {
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
