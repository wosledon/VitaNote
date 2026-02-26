import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse, UserData } from '../types/api'

interface AuthState {
  token: string
  refreshToken: string
  user: UserData | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  setTokens: (token: string, refreshToken: string) => void
  setUser: (user: UserData | null) => void
  clearAuth: () => void
  login: (response: AuthResponse) => void
  logout: () => void
  setAuthenticated: (authenticated: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: '',
      refreshToken: '',
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      setTokens: (token: string, refreshToken: string) =>
        set({ token, refreshToken }),
      
      setUser: (user: UserData | null) =>
        set({ user, isAuthenticated: user !== null }),
      
      clearAuth: () =>
        set({
          token: '',
          refreshToken: '',
          user: null,
          isAuthenticated: false,
          error: null,
        }),
      
      login: (response: AuthResponse) =>
        set({
          token: response.token,
          refreshToken: response.refreshToken,
          user: response.user,
          isAuthenticated: true,
          error: null,
        }),
      
      logout: () =>
        set({
          token: '',
          refreshToken: '',
          user: null,
          isAuthenticated: false,
          error: null,
        }),
      
      setAuthenticated: (authenticated: boolean) =>
        set({ isAuthenticated: authenticated }),
      
      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),
      
      setError: (error: string | null) =>
        set({ error }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export const useAuthActions = () => {
  const { login, logout, setUser, setAuthenticated, setLoading, setError } = useAuthStore()
  
  return {
    login: (response: AuthResponse) => {
      setLoading(true)
      login(response)
      setLoading(false)
    },
    logout: () => {
      setLoading(true)
      logout()
      setLoading(false)
    },
    setUser: (user: UserData | null) => {
      setUser(user)
    },
    setAuthenticated: (authenticated: boolean) => {
      setAuthenticated(authenticated)
    },
    setError: (error: string | null) => {
      setError(error)
    },
  }
}
