import { Box, Typography, TextField, Button, Alert, CircularProgress, Paper } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRepository } from '../../services/repositories';
import { useAuthStore } from '../../store/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await UserRepository.getUserByEmail(formData.email);
      if (!user) {
        setError('用户不存在');
        setLoading(false);
        return;
      }

      if (user.password_hash !== formData.password) {
        setError('密码错误');
        setLoading(false);
        return;
      }

      const token = `token_${user.id}_${Date.now()}`;
      login(user, token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || '登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: { xs: '100vh', sm: 'calc(100vh - 64px)' },
      p: 2,
      bgcolor: 'background.default'
    }}>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: { xs: 3, sm: 4 },
          borderRadius: 2
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            欢迎回来
          </Typography>
          <Typography variant="body2" color="text.secondary">
            登录您的健康账户
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="邮箱"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="密码"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 1, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : '登录'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            没有账号？{' '}
            <Typography
              component="span"
              onClick={() => navigate('/register')}
              sx={{
                cursor: 'pointer',
                color: 'primary.main',
                fontWeight: 'bold',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              立即注册
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
