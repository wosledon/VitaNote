import axios from 'axios'
import config from '../config'
import { useAuthStore } from '../store/authStore'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

// 创建axios实例
const apiClient = axios.create({
  baseURL: config.api_BaseUrl,
  timeout: config.api_timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    const authStore = useAuthStore()
    
    // 如果请求失败且没有重试过
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = authStore.refreshToken
        if (refreshToken) {
          // 尝试刷新token
          const response = await apiClient.post('/auth/refresh-token', { refreshToken })
          const newToken = response.data.token
          
          // 保存新token
          authStore.setTokens(newToken, response.data.refreshToken)
          
          // 重试原请求
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // 刷新失败，清除认证状态
        authStore.logout()
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
