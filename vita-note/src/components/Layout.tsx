import { AppBar, Toolbar, Typography, IconButton, Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme, BottomNavigation, BottomNavigationAction, Zoom } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import ChatIcon from '@mui/icons-material/SmartToy';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import MedicationIcon from '@mui/icons-material/Medication';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import { keyframes } from '@mui/system';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  hideNav?: boolean;
}

const menuItems = [
  { path: '/dashboard', label: '首页', icon: HomeIcon },
  { path: '/foods', label: '饮食', icon: RestaurantIcon },
  { path: '/glucose', label: '血糖', icon: WaterDropIcon },
  { path: '/medications', label: '用药', icon: MedicationIcon },
  { path: '/weight', label: '体重', icon: FitnessCenterIcon },
  { path: '/chat', label: 'AI', icon: ChatIcon },
  { path: '/settings', label: '设置', icon: SettingsIcon },
];

const bottomMenuItems = [
  { path: '/dashboard', label: '首页', icon: HomeIcon },
  { path: '/camera', label: '拍照', icon: CameraIcon, special: true },
  { path: '/chat', label: 'AI', icon: ChatIcon },
];

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
`;

export function Layout({ children, title, showBack = false, onBack, hideNav = false }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (showBack) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  const currentPage = menuItems.find(item => location.pathname.startsWith(item.path));
  const displayTitle = title || currentPage?.label || 'VitaNote';

  const drawer = (
    <Box sx={{ 
      width: 300,
      background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)',
      minHeight: '100%',
    }}>
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h5" color="white" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '0.5px' }}>
          ✨ VitaNote
        </Typography>
        <Typography variant="body2" color="white" sx={{ opacity: 0.9, fontSize: '13px' }}>
          您的智能健康管理助手
        </Typography>
      </Box>
      <List sx={{ pt: 1, px: 1.5 }}>
        {menuItems.map((item, index) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname.startsWith(item.path)}
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
              sx={{
                py: 2,
                px: 2,
                borderRadius: 12,
                bgcolor: location.pathname.startsWith(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
                transition: 'all 0.2s ease',
                animation: `${slideIn} 0.3s ease ${index * 0.05}s both`,
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 44, 
                color: location.pathname.startsWith(item.path) ? 'white' : 'rgba(255,255,255,0.7)',
              }}>
                <item.icon sx={{ fontSize: 24 }} />
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: location.pathname.startsWith(item.path) ? 700 : 500,
                  color: location.pathname.startsWith(item.path) ? 'white' : 'rgba(255,255,255,0.9)',
                  fontSize: '15px',
                }}
              />
              {location.pathname.startsWith(item.path) && (
                <Box sx={{ 
                  width: 4, 
                  height: 24, 
                  bgcolor: 'white', 
                  borderRadius: 2,
                  animation: `${pulse} 2s infinite`,
                }} />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const bottomNav = !hideNav && (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'rgba(255, 255, 255, 0.98)',
        borderTop: '1px solid rgba(99, 102, 241, 0.1)',
        display: { xs: 'flex', md: 'none' },
        zIndex: 1200,
        pb: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -8px 32px rgba(99, 102, 241, 0.15)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <BottomNavigation
        value={location.pathname}
        onChange={(_, newValue) => {
          if (newValue) {
            navigate(newValue);
          }
        }}
        sx={{
          width: '100%',
          minHeight: 70,
          margin: '0 auto',
          maxWidth: 400,
          '& .MuiBottomNavigationAction-label': {
            fontSize: '11px',
            fontWeight: 600,
            color: '#94a3b8',
            transition: 'all 0.2s ease',
          },
          '& .MuiBottomNavigationAction-icon': {
            fontSize: 24,
            transition: 'all 0.2s ease',
          },
          '& .Mui-selected': {
            '& .MuiBottomNavigationAction-label': {
              color: '#6366f1',
              fontWeight: 700,
              fontSize: '12px',
            },
            '& .MuiBottomNavigationAction-icon': {
              color: '#6366f1',
              animation: `${bounce} 0.3s ease`,
            },
          },
        }}
      >
        {bottomMenuItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            value={item.path}
            icon={
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 0.5,
              }}>
                {item.special ? (
                  <Box sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                    transform: 'translateY(-10px)',
                  }}>
                    <item.icon sx={{ fontSize: 26 }} />
                  </Box>
                ) : (
                  <item.icon sx={{ fontSize: 26 }} />
                )}
              </Box>
            }
            sx={{
              minWidth: 0,
              flex: 1,
              padding: '8px 4px',
              transition: 'all 0.2s ease',
              '&:active': {
                transform: 'scale(0.95)',
              },
              '& .MuiBottomNavigationAction-label': {
                marginTop: '2px !important',
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      pb: { xs: '76px', md: 0 },
    }}>
      <AppBar 
        position="sticky" 
        color="primary" 
        elevation={0}
        sx={{ 
          zIndex: 1100,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar sx={{ minHeight: '56px !important', px: { xs: 1, sm: 2 } }}>
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 1 }}
                size="large"
              >
                <MenuIcon />
              </IconButton>
              <Typography 
                variant="subtitle1" 
                noWrap 
                sx={{ 
                  flexGrow: 1, 
                  fontWeight: 700,
                  fontSize: '16px',
                  letterSpacing: '0.3px',
                }}
              >
                {displayTitle}
              </Typography>
              {showBack && (
                <Zoom in={showBack}>
                  <IconButton edge="end" color="inherit" onClick={handleBack} size="large">
                    <ArrowBackIcon />
                  </IconButton>
                </Zoom>
              )}
            </>
          ) : (
            <>
              <Typography 
                variant="h6" 
                noWrap 
                sx={{ 
                  mr: 3, 
                  fontWeight: 800,
                  fontSize: '20px',
                  letterSpacing: '0.5px',
                }}
              >
                ✨ VitaNote
              </Typography>
              {menuItems.map((item) => (
                <IconButton
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: location.pathname.startsWith(item.path) ? 'white' : 'rgba(255,255,255,0.75)',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'scale(1.1)',
                    },
                    mx: 0.5,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                  size="small"
                  title={item.label}
                >
                  <item.icon sx={{ fontSize: 22 }} />
                  {location.pathname.startsWith(item.path) && (
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 4,
                      height: 4,
                      bgcolor: 'white',
                      borderRadius: '50%',
                      animation: `${pulse} 2s infinite`,
                    }} />
                  )}
                </IconButton>
              ))}
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { 
            width: 300,
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
          animation: `${slideIn} 0.4s ease`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>

      {bottomNav}
    </Box>
  );
}
