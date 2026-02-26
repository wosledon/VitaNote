import axios from 'axios'
import config from '../config'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

// 创建axios实例
const apiClient = axios.create({
  baseURL: config.api_BaseUrl,
  timeout: config.api_timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 从 localStorage 获取 token（避免在拦截器中调用 hook）
const getToken = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      const parsed = JSON.parse(authStorage)
      return parsed.state?.token || ''
    }
  } catch (e) {
    console.error('Failed to parse auth token', e)
  }
  return ''
}

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    
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
    
    // 如果请求失败且没有重试过
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // 清除认证状态（通过 localStorage）
      try {
        const authStorage = localStorage.getItem('auth-storage')
        if (authStorage) {
          const parsed = JSON.parse(authStorage)
          const refreshToken = parsed.state?.refreshToken
          
          if (refreshToken) {
            // 尝试刷新token
            const response = await apiClient.post('/auth/refresh-token', { refreshToken })
            const newToken = response.data.token
            
            // 保存新token到 localStorage
            parsed.state.token = newToken
            parsed.state.refreshToken = response.data.refreshToken
            localStorage.setItem('auth-storage', JSON.stringify(parsed))
            
            // 重试原请求
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return apiClient(originalRequest)
          }
        }
      } catch (refreshError) {
        // 刷新失败，清除认证状态
        localStorage.removeItem('auth-storage')
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
