import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000
})

// Axios 核心知识点：请求拦截器统一注入 headers
http.interceptors.request.use((config) => {
  config.headers['X-Learning-Project'] = 'dodo-vue3'
  return config
})

// Axios 核心知识点：响应拦截器统一处理后端标准化响应
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

export default http
