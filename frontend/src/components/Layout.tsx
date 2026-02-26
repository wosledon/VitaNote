import React from 'react'
import { Box, AppBar, Toolbar, Typography, Avatar, IconButton, Menu, MenuItem } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import HomeIcon from '@mui/icons-material/Home'
import SportsIcon from '@mui/icons-material/Sports'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import SettingsIcon from '@mui/icons-material/Settings'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  
  const handleLogout = () => {
    logout()
    handleMenuClose()
    navigate('/login')
  }
  
  const menuItems = [
    { path: '/', icon: <HomeIcon />, label: '首页' },
    { path: '/records', icon: <MedicalServicesIcon />, label: '记录' },
    { path: '/llm', icon: <SportsIcon />, label: 'AI助手' },
    { path: '/settings', icon: <SettingsIcon />, label: '设置' },
  ]
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ mr: 2 }}>
            VitaNote
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && (
              <>
                <Typography variant="body2">{user.userName}</Typography>
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  onClick={handleMenuOpen}
                >
                  {user.userName.charAt(0).toUpperCase()}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>退出登录</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flex: 1, pt: 8, pb: 8 }}>
        <Box sx={{ width: 64, position: 'fixed', left: 0, bottom: 0 }}>
          {menuItems.map((item) => (
            <IconButton
              key={item.path}
              color={location.pathname === item.path ? 'primary' : 'inherit'}
              onClick={() => navigate(item.path)}
              sx={{ width: 64, height: 64, flexDirection: 'column' }}
            >
              {item.icon}
              <Typography variant="caption">{item.label}</Typography>
            </IconButton>
          ))}
        </Box>
        <Box sx={{ flex: 1, ml: 6 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
    {children}
  </Box>
)
