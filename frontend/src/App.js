import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PharmacyLogin from './pages/PharmacyLogin';
import PharmacyDashboard from './pages/PharmacyDashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirection de la racine vers la page de connexion */}
        <Route path="/" element={<Navigate to="/pharmacy/login" replace />} />
        
        {/* Routes pharmacien */}
        <Route path="/pharmacy/login" element={<PharmacyLogin />} />
        <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
        
        {/* Route 404 */}
        <Route path="*" element={<Navigate to="/pharmacy/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;