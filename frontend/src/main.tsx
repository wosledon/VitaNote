import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Auth0Provider } from '@auth0/auth0-react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
})

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e91e63',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 2,
      },
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-12345678.us.auth0.com"
      clientId="your-auth0-client-id"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>,
)
