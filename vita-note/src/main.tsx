import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { dbInit } from './api/tauri';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

function Main() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize database on mount
    console.log('Initializing database...');
    dbInit()
      .then((result) => {
        console.log('Database initialized:', result);
        setDbInitialized(true);
      })
      .catch((error) => {
        console.error('Failed to initialize database:', error);
        setError(error?.toString() || 'Unknown error');
        setDbInitialized(true); // Continue anyway
      });
  }, []);

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>
        <div>
          <h2>Error initializing database</h2>
          <p>{error}</p>
          <p>Please make sure you are running in Tauri desktop app, not in browser.</p>
        </div>
      </div>
    );
  }

  if (!dbInitialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>
          <div>Loading...</div>
          <p style={{ color: '#666', fontSize: '14px' }}>Initializing database...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
