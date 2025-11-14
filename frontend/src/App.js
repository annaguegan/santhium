import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PharmacyLogin from './pages/PharmacyLogin';
import PharmacySignup from './pages/PharmacySignup';
import PharmacyCreate from './pages/PharmacyCreate';
import PharmacyDashboard from './pages/PharmacyDashboard';
import PatientUpload from './pages/PatientUpload';
import { NotificationProvider } from './contexts/NotificationContext';
import './App.css';

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<Home />} />
          
          {/* Routes pharmacien */}
          <Route path="/pharmacy/login" element={<PharmacyLogin />} />
          <Route path="/pharmacy/signup" element={<PharmacySignup />} />
          <Route path="/pharmacy/create" element={<PharmacyCreate />} />
          <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />

          {/* Route patient (accès sans authentification) */}
          <Route path="/patient/upload" element={<PatientUpload />} />
          <Route path="/patient/upload/:code" element={<PatientUpload />} />
          
          {/* Route 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
