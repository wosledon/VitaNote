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
import { authService } from '../api/services'

export const Register = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    
    if (formData.password.length < 6) {
      setError('密码长度至少为6位')
      return
    }
    
    setLoading(true)
    
    try {
      await authService.register({
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber || undefined,
      })
      
      navigate('/login')
    } catch (err: any) {
      console.error('注册失败:', err)
      setError(err.response?.data?.message || '注册失败，请检查输入信息')
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
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
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
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="邮箱"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="手机号（可选）"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="密码"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              helperText="至少6位字符"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="确认密码"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? '注册中...' : '注册'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#/login" variant="body2">
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
