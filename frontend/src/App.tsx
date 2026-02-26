import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { Dashboard } from './pages/Dashboard'
import { Records } from './pages/Records'
import { LlmPage } from './pages/Llm'
import { Settings } from './pages/Settings'
import { FoodRecords } from './pages/FoodRecords'
import { Statistics } from './pages/Statistics'
import { OcrPage } from './pages/OcrPage'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Layout } from './components/Layout'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="records" element={<Records />} />
        <Route path="food-records" element={<FoodRecords />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="ocr" element={<OcrPage />} />
        <Route path="llm" element={<LlmPage />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
