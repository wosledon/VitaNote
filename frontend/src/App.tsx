import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeWrapper } from './ThemeWrapper';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { FoodPage } from '../pages/Food/FoodPage';
import { GlucosePage } from '../pages/Glucose/GlucosePage';
import { MedicationPage } from '../pages/Medication/MedicationPage';
import { AIChatPage } from '../pages/AIChat/AIChatPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { RegisterPage } from '../pages/Auth/RegisterPage';

function App() {
  return (
    <ThemeWrapper>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/foods" element={<FoodPage />} />
        <Route path="/glucose" element={<GlucosePage />} />
        <Route path="/medications" element={<MedicationPage />} />
        <Route path="/chat" element={<AIChatPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ThemeWrapper>
  );
}

export default App;
