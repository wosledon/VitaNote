import React, { useState } from 'react'
import { Box, AppBar, Toolbar, Typography, Avatar, IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, useMediaQuery, useTheme, Container } from '@mui/material'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import HomeIcon from '@mui/icons-material/Home'
import AssessmentIcon from '@mui/icons-material/Assessment'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'

const drawerWidth = 260

const menuItems = [
  { path: '/', icon: <HomeIcon />, label: '首页' },
  { path: '/records', icon: <AssessmentIcon />, label: '健康记录' },
  { path: '/food-records', icon: <RestaurantIcon />, label: '饮食记录' },
  { path: '/statistics', icon: <AssessmentIcon />, label: '统计分析' },
  { path: '/ocr', icon: <CameraAltIcon />, label: '拍照识别' },
  { path: '/llm', icon: <SmartToyIcon />, label: 'AI助手' },
  { path: '/settings', icon: <SettingsIcon />, label: '设置' },
]

export const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const { user, logout } = useAuthStore()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  
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
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  
  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF' }}>
      {/* Logo区域 */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 3,
            bgcolor: '#006C4C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: 24,
          }}
        >
          V
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#006C4C' }}>
          VitaNote
        </Typography>
      </Box>
      
      <Divider sx={{ mx: 2 }} />
      
      {/* 导航菜单 */}
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path
          return (
            <ListItem
              key={item.path}
              onClick={() => {
                navigate(item.path)
                if (isMobile) setMobileOpen(false)
              }}
              sx={{
                borderRadius: 3,
                mb: 0.5,
                mx: 1,
                py: 1.5,
                cursor: 'pointer',
                bgcolor: isSelected ? '#E8F5E9' : 'transparent',
                color: isSelected ? '#006C4C' : '#49454F',
                '&:hover': {
                  bgcolor: isSelected ? '#E8F5E9' : '#F5F5F5',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: isSelected ? '#006C4C' : '#757575',
                  minWidth: 44,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: '0.95rem',
                }}
              />
            </ListItem>
          )
        })}
      </List>
      
      {/* 底部用户信息 */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1 }}>
          <Avatar
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: '#0061A4',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            onClick={handleMenuOpen}
          >
            {user?.userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap', color: '#1C1B1F' }}>
              {user?.userName}
            </Typography>
            <Typography variant="caption" sx={{ whiteSpace: 'nowrap', color: '#757575' }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{
          sx: { borderRadius: 3, mt: -1 }
        }}
      >
        <MenuItem onClick={handleLogout} sx={{ borderRadius: 2, mx: 0.5, color: '#B3261E' }}>
          <LogoutIcon sx={{ mr: 1.5 }} fontSize="small" />
          退出登录
        </MenuItem>
      </Menu>
    </Box>
  )
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F5F5F5' }}>
      {/* 顶部导航栏 - 移动端 */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#FFFFFF', color: '#1C1B1F' }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: '#006C4C' }}>
              VitaNote
            </Typography>
            <Avatar
              sx={{ width: 36, height: 36, bgcolor: '#0061A4', fontWeight: 600 }}
              onClick={handleMenuOpen}
            >
              {user?.userName.charAt(0).toUpperCase()}
            </Avatar>
          </Toolbar>
        </AppBar>
      )}
      
      {/* 侧边导航栏 */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* 移动端抽屉 */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRadius: 0,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* 桌面端永久抽屉 */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRadius: 0,
              borderRight: '1px solid #E0E0E0',
              boxShadow: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* 主内容区 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          pt: { xs: isMobile ? 10 : 4, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
    {children}
  </Box>
)
