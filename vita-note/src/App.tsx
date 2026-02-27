import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeWrapper } from './theme/ThemeWrapper';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { FoodPage } from './pages/Food/FoodPage';
import { GlucosePage } from './pages/Glucose/GlucosePage';
import { MedicationPage } from './pages/Medication/MedicationPage';
import { WeightPage } from './pages/Weight/WeightPage';
import { CameraPage } from './pages/Camera/CameraPage';
import { AIChatPage } from './pages/AIChat/AIChatPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <ThemeWrapper>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/foods" element={isAuthenticated ? <FoodPage /> : <Navigate to="/login" replace />} />
        <Route path="/glucose" element={isAuthenticated ? <GlucosePage /> : <Navigate to="/login" replace />} />
        <Route path="/medications" element={isAuthenticated ? <MedicationPage /> : <Navigate to="/login" replace />} />
        <Route path="/weight" element={isAuthenticated ? <WeightPage /> : <Navigate to="/login" replace />} />
        <Route path="/camera" element={isAuthenticated ? <CameraPage /> : <Navigate to="/login" replace />} />
        <Route path="/chat" element={isAuthenticated ? <AIChatPage /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" replace />} />

        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </ThemeWrapper>
  );
}

export default App;
