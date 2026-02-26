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
  Grid,
  Alert,
} from '@mui/material'
import { useAuthStore } from '../store/authStore'
import apiClient from '../api/client'
import type { AuthResponse } from '../types/api'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, setLoading } = useAuthStore()
  const navigate = useNavigate()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        userName: username,
        password,
      })
      
      login(response.data)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4">
          VitaNote
        </Typography>
        <Typography component="h2" variant="h6" color="textSecondary" sx={{ mt: 1 }}>
          登录到您的账户
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ p: 4, width: '100%', mt: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              登录
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/reset-password" variant="body2">
                  忘记密码？
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  还没有账户？注册
                </Link>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}
