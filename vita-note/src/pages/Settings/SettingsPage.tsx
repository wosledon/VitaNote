import { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, ListItemButton, Paper, TextField, Button, Alert, Avatar, Grid } from '@mui/material';
import { UserRepository } from '../../services/repositories';
import { useAuthStore } from '../../store/authStore';
import { Layout } from '../../components/Layout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import InfoIcon from '@mui/icons-material/Info';
import StorageIcon from '@mui/icons-material/Storage';

const genderLabels: Record<number, string> = {
  0: '未知',
  1: '男',
  2: '女'
};

const diabetesTypeLabels: Record<number, string> = {
  0: '未知',
  1: '1 型糖尿病',
  2: '2 型糖尿病',
  3: '妊娠糖尿病'
};

const treatmentPlanLabels: Record<number, string> = {
  0: '未知',
  1: '饮食控制',
  2: '口服药物',
  3: '胰岛素治疗',
  4: '联合治疗'
};

export function SettingsPage() {
  const { user, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    birthday: '',
    gender: 0,
    height: 0,
    diabetesType: 0,
    treatmentPlan: 0,
    targetCalories: '',
    targetCarbohydrates: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        phone: user.phone || '',
        birthday: user.birthday ? user.birthday.slice(0, 10) : '',
        gender: user.gender || 0,
        height: user.height || 0,
        diabetesType: user.diabetesType || 0,
        treatmentPlan: user.treatmentPlan || 0,
        targetCalories: user.targetCalories?.toString() || '',
        targetCarbohydrates: user.targetCarbohydrates?.toString() || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) {
      setError('用户未登录');
      return;
    }

    try {
      await UserRepository.updateUser({
        ...user,
        username: formData.username,
        phone: formData.phone || undefined,
        birthday: formData.birthday || undefined,
        gender: formData.gender as any,
        height: formData.height,
        diabetesType: formData.diabetesType as any,
        treatmentPlan: formData.treatmentPlan as any,
        targetCalories: formData.targetCalories ? Number(formData.targetCalories) : undefined,
        targetCarbohydrates: formData.targetCarbohydrates ? Number(formData.targetCarbohydrates) : undefined
      } as any);

      setSuccess('设置已保存');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('保存失败');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const calculateBMI = () => {
    if (formData.height > 0 && user?.targetWeight) {
      return (user.targetWeight / ((formData.height / 100) ** 2)).toFixed(1);
    }
    return '-';
  };

  if (!user) {
    return (
      <Layout title="设置">
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            请先登录
          </Typography>
          <Typography variant="body2" color="text.secondary">
            登录后可以查看和编辑个人资料
          </Typography>
        </Paper>
      </Layout>
    );
  }

  return (
    <Layout title="设置" showBack>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* 个人信息卡片 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
                <AccountCircleIcon sx={{ fontSize: 48 }} />
              </Avatar>
              <Box>
                <Typography variant="h6">{user.username}</Typography>
                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              </Box>
            </Box>

            <List disablePadding>
              <ListItem>
                <ListItemIcon><InfoIcon /></ListItemIcon>
                <ListItemText primary="糖尿病类型" secondary={diabetesTypeLabels[user.diabetesType]} />
              </ListItem>
              <ListItem>
                <ListItemIcon><InfoIcon /></ListItemIcon>
                <ListItemText primary="治疗方案" secondary={treatmentPlanLabels[user.treatmentPlan]} />
              </ListItem>
              <ListItem>
                <ListItemIcon><StorageIcon /></ListItemIcon>
                <ListItemText primary="BMI" secondary={calculateBMI()} />
              </ListItem>
            </List>

            <Button
              fullWidth
              variant="outlined"
              startIcon={editing ? undefined : <EditIcon />}
              onClick={() => editing ? handleSave() : setEditing(true)}
              sx={{ mt: 2 }}
            >
              {editing ? '保存修改' : '编辑资料'}
            </Button>
          </Paper>
        </Grid>

        {/* 编辑表单 */}
        {editing && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>编辑个人资料</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="用户名"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="电话"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="生日"
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="性别"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: Number(e.target.value) })}
                    SelectProps={{ native: true }}
                  >
                    {Object.entries(genderLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="身高 (cm)"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="糖尿病类型"
                    value={formData.diabetesType}
                    onChange={(e) => setFormData({ ...formData, diabetesType: Number(e.target.value) })}
                    SelectProps={{ native: true }}
                  >
                    {Object.entries(diabetesTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="治疗方案"
                    value={formData.treatmentPlan}
                    onChange={(e) => setFormData({ ...formData, treatmentPlan: Number(e.target.value) })}
                    SelectProps={{ native: true }}
                  >
                    {Object.entries(treatmentPlanLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="目标热量 (kcal)"
                    type="number"
                    value={formData.targetCalories}
                    onChange={(e) => setFormData({ ...formData, targetCalories: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="目标碳水 (g)"
                    type="number"
                    value={formData.targetCarbohydrates}
                    onChange={(e) => setFormData({ ...formData, targetCarbohydrates: e.target.value })}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button fullWidth variant="outlined" onClick={() => setEditing(false)}>
                  取消
                </Button>
                <Button fullWidth variant="contained" onClick={handleSave}>
                  保存
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* 退出登录 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <List>
              <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="退出登录" />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>

        {/* 关于 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: 'primary.light' }}>
            <Typography variant="h6" gutterBottom>关于 VitaNote</Typography>
            <Typography variant="body2" color="text.secondary">
              版本：1.0.0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              VitaNote 是一款专为糖尿病患者设计的健康管理应用，帮助您记录饮食、监测血糖、管理用药。
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
