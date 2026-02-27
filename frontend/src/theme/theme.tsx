import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Green for health
    },
    secondary: {
      main: '#1976D2', // Blue for info
    },
    error: {
      main: '#F44336', // Red for abnormal values
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
