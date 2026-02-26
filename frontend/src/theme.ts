import { createTheme } from '@mui/material/styles';

// Material Design 3 主题配置 - 改进配色
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#006C4C', // 深绿色 - 健康主题
      light: '#E8F5E9',
      dark: '#004D40',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0061A4', // 蓝色
      light: '#E3F2FD',
      dark: '#004D80',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#B3261E',
      light: '#F9DEDC',
      dark: '#410E0B',
    },
    warning: {
      main: '#F57C00', // 橙色
      light: '#FFF3E0',
      dark: '#E65100',
    },
    info: {
      main: '#0288D1',
      light: '#E1F5FE',
      dark: '#01579B',
    },
    success: {
      main: '#2E7D32', // 绿色
      light: '#E8F5E9',
      dark: '#1B5E20',
    },
    background: {
      default: '#F5F5F5', // 浅灰色背景
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1B1F',
      secondary: '#49454F',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans SC", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '3rem', fontWeight: 700 },
    h2: { fontSize: '2.5rem', fontWeight: 700 },
    h3: { fontSize: '2rem', fontWeight: 600 },
    h4: { fontSize: '1.75rem', fontWeight: 600 },
    h5: { fontSize: '1.5rem', fontWeight: 600 },
    h6: { fontSize: '1.25rem', fontWeight: 600 },
    subtitle1: { fontSize: '1rem', fontWeight: 500 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    button: { fontSize: '0.875rem', fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(0,0,0,0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FAFAFA',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
          backgroundColor: '#FFFFFF',
          color: '#1C1B1F',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          width: 'calc(100% - 16px)',
          '&.Mui-selected': {
            backgroundColor: '#E8F5E9',
            color: '#006C4C',
            '&:hover': {
              backgroundColor: '#C8E6C9',
            },
          },
        },
      },
    },
  },
});
