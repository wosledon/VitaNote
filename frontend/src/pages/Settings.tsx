import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Switch,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import NotificationsIcon from '@mui/icons-material/Notifications'
import StorageIcon from '@mui/icons-material/Storage'
import InfoIcon from '@mui/icons-material/Info'
import LogoutIcon from '@mui/icons-material/Logout'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useAuthStore } from '../store/authStore'

export const Settings = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
  
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSync: true,
  })
  
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    
    try {
      setSuccess('密码修改成功')
      setOpenPasswordDialog(false)
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      setError(err.response?.data?.message || '修改密码失败')
    }
  }
  
  const handleClearData = () => {
    if (confirm('确定要清除所有本地数据吗？此操作不可恢复。')) {
      localStorage.clear()
      logout()
      navigate('/login')
    }
  }
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  const menuItems = [
    { icon: <LockIcon />, title: '修改密码', subtitle: '定期更换密码保护账户安全', onClick: () => setOpenPasswordDialog(true) },
    { icon: <NotificationsIcon />, title: '通知设置', subtitle: '管理应用通知', onClick: () => {} },
    { icon: <StorageIcon />, title: '数据管理', subtitle: '导出或清除数据', onClick: () => {} },
  ]
  
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        设置
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      
      {/* 用户概览 */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: 'primary.main',
                fontSize: 32,
                fontWeight: 600,
              }}
            >
              {user?.userName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {user?.userName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Chip label="免费用户" size="small" color="primary" sx={{ mt: 1 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* 设置菜单 */}
      <Card sx={{ mb: 3 }}>
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.title}>
              <ListItem disablePadding>
                <ListItemButton onClick={item.onClick} sx={{ py: 2 }}>
                  <ListItemIcon sx={{ color: 'primary.main', minWidth: 48 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={item.subtitle}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <ChevronRightIcon color="action" />
                </ListItemButton>
              </ListItem>
              {index < menuItems.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Card>
      
      {/* 应用设置 */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, p: 3, pb: 2 }}>
            应用设置
          </Typography>
          
          <List>
            <ListItem sx={{ py: 2 }}>
              <ListItemIcon sx={{ color: 'primary.main', minWidth: 48 }}>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText
                primary="启用通知"
                secondary="接收健康提醒和数据同步通知"
              />
              <Switch
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ py: 2 }}>
              <ListItemIcon sx={{ color: 'primary.main', minWidth: 48 }}>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText
                primary="自动同步"
                secondary="自动同步数据到云端"
              />
              <Switch
                checked={settings.autoSync}
                onChange={(e) => setSettings({ ...settings, autoSync: e.target.checked })}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      {/* 数据管理 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            数据管理
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="outlined" size="small">
              导出数据 (JSON)
            </Button>
            <Button variant="outlined" size="small">
              导出数据 (CSV)
            </Button>
            <Button variant="outlined" color="error" size="small" onClick={handleClearData}>
              清除所有数据
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {/* 退出登录 */}
      <Button
        variant="outlined"
        color="error"
        fullWidth
        size="large"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{ mb: 3 }}
      >
        退出登录
      </Button>
      
      {/* 关于 */}
      <Card sx={{ bgcolor: 'grey.50' }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              color: 'white',
              fontWeight: 700,
              fontSize: 24,
            }}
          >
            V
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            VitaNote
          </Typography>
          <Typography variant="body2" color="text.secondary">
            版本 1.0.0
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            © 2024 VitaNote Team. All rights reserved.
          </Typography>
        </CardContent>
      </Card>
      
      {/* 修改密码对话框 */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1 }}>修改密码</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="当前密码"
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="新密码"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="确认新密码"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenPasswordDialog(false)} variant="outlined">取消</Button>
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
          >
            确认修改
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
