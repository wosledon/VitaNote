import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import LoginIcon from '@mui/icons-material/Login'
import { useAuthStore } from '../store/authStore'
import { authService } from '../api/services'
import type { AuthResponse } from '../types/api'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await authService.login({
        userName: username,
        password,
      })
      
      login(response.data)
      navigate('/')
    } catch (err: any) {
      console.error('登录失败:', err)
      setError(err.response?.data?.message || '登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 4,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            boxShadow: 3,
          }}
        >
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
            V
          </Typography>
        </Box>
        
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          VitaNote
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          智能健康管理平台
        </Typography>
        
        <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            登录到您的账户
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="密码"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={<LoginIcon />}
              sx={{ py: 1.5, borderRadius: 3 }}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link href="#/register" variant="body2" sx={{ textDecoration: 'none' }}>
                还没有账户？立即注册
              </Link>
            </Box>
          </Box>
        </Paper>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 4 }}>
          默认账号: admin / admin123
        </Typography>
      </Box>
    </Container>
  )
}
