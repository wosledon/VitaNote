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

export const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { login, setLoading } = useAuthStore()
  const navigate = useNavigate()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不匹配')
      return
    }
    
    if (password.length < 8) {
      setError('密码长度至少为8位')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', {
        userName: username,
        email,
        password,
      })
      
      login(response.data)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || '注册失败，请稍后再试')
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
          创建新账户
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
              label="邮箱"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <TextField
              margin="normal"
              required
              fullWidth
              label="确认密码"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              注册
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/reset-password" variant="body2">
                  忘记密码？
                </Link>
              </Grid>
              <Grid item>
                <Link href="/login" variant="body2">
                  已有账户？登录
                </Link>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}
