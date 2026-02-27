import { Box, Typography, TextField, Button, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRepository } from '../../services/repositories';
import { useAuthStore } from '../../store/authStore';
import { Gender, DiabetesType, TreatmentPlan } from '../../types';

export function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    birthday: '',
    gender: 0,
    height: 0,
    diabetesType: 0,
    treatmentPlan: 0,
    targetCalories: '',
    targetCarbohydrates: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: SelectChangeEvent<number | string> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [name as string]: name === 'gender' || name === 'height' || name === 'diabetesType' || name === 'treatmentPlan'
        ? Number(value)
        : name === 'targetCalories' || name === 'targetCarbohydrates'
          ? value === '' ? '' : Number(value)
          : value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 检查邮箱是否已存在
      const existingUser = await UserRepository.getUserByEmail(formData.email);
      if (existingUser) {
        setError('该邮箱已被注册');
        setLoading(false);
        return;
      }

      // 创建用户
      const user = await UserRepository.createUser({
        username: formData.username,
        email: formData.email,
        phone: formData.phone || undefined,
        password_hash: formData.password, // 实际应用中应该加密
        birthday: formData.birthday || undefined,
        gender: formData.gender as Gender,
        height: formData.height || 0,
        diabetesType: formData.diabetesType as DiabetesType,
        treatmentPlan: formData.treatmentPlan as TreatmentPlan,
        targetCalories: formData.targetCalories ? Number(formData.targetCalories) : undefined,
        targetCarbohydrates: formData.targetCarbohydrates ? Number(formData.targetCarbohydrates) : undefined
      });

      // 自动登录
      const token = `token_${user.id}_${Date.now()}`;
      login(user, token);

      // 设置成功状态
      setSuccess(true);

      // 2秒后跳转到仪表盘
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
        创建账号
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>注册成功！即将跳转到仪表盘...</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="用户名"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
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
          label="电话（可选）"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
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
        <TextField
          fullWidth
          label="生日（可选）"
          name="birthday"
          type="date"
          value={formData.birthday}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>性别</InputLabel>
          <Select
            name="gender"
            value={formData.gender}
            label="性别"
            onChange={handleChange}
          >
            <MenuItem value={0}>未知</MenuItem>
            <MenuItem value={1}>男</MenuItem>
            <MenuItem value={2}>女</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="身高 (cm)"
          name="height"
          type="number"
          value={formData.height}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>糖尿病类型</InputLabel>
          <Select
            name="diabetesType"
            value={formData.diabetesType}
            label="糖尿病类型"
            onChange={handleChange}
          >
            <MenuItem value={0}>未知</MenuItem>
            <MenuItem value={1}>1型糖尿病</MenuItem>
            <MenuItem value={2}>2型糖尿病</MenuItem>
            <MenuItem value={3}>妊娠糖尿病</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>治疗方案</InputLabel>
          <Select
            name="treatmentPlan"
            value={formData.treatmentPlan}
            label="治疗方案"
            onChange={handleChange}
          >
            <MenuItem value={0}>饮食控制</MenuItem>
            <MenuItem value={1}>口服药物</MenuItem>
            <MenuItem value={2}>胰岛素</MenuItem>
            <MenuItem value={3}>综合治疗</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="目标每日卡路里 (可选)"
          name="targetCalories"
          type="number"
          value={formData.targetCalories}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="目标每日碳水化合物 (可选)"
          name="targetCarbohydrates"
          type="number"
          value={formData.targetCarbohydrates}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : '注册'}
        </Button>
      </form>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2">
          已有账号？{' '}
          <Typography
            component="span"
            onClick={() => navigate('/login')}
            sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 'bold' }}
          >
            登录
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}
