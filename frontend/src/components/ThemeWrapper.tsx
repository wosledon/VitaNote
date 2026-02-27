import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material';
import { theme } from '../theme/theme';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export { Container, Box };
