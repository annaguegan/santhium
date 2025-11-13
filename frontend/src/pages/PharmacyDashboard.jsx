// frontend/src/pages/PharmacyDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodeGenerator } from '../components/pharmacy/CodeGenerator';
import { DocumentList } from '../components/pharmacy/DocumentList';
import { documentService } from '../services/documentService';
import { authService } from '../services/authService';
import '../styles/Dashboard.css';

const PharmacyDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/pharmacy/login');
      return;
    }
    setUser(currentUser);
    loadDocuments();
  }, [navigate]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getAll();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/pharmacy/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <svg viewBox="0 0 100 100" className="logo-icon">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="30" cy="30" r="5" fill="currentColor"/>
              <circle cx="70" cy="30" r="5" fill="currentColor"/>
              <circle cx="50" cy="50" r="5" fill="currentColor"/>
              <circle cx="30" cy="70" r="5" fill="currentColor"/>
              <circle cx="70" cy="70" r="5" fill="currentColor"/>
            </svg>
            <h1>Santhium</h1>
          </div>
          <div className="user-section">
            <span className="user-name">{user?.email}</span>
            <button onClick={handleLogout} className="btn-logout">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <section className="code-section">
            <h2>Générer un code de transfert</h2>
            <CodeGenerator />
          </section>

          <section className="documents-section">
            <div className="section-header">
              <h2>Documents reçus</h2>
              <button 
                onClick={loadDocuments} 
                className="btn-refresh"
                disabled={loading}
              >
                {loading ? 'Chargement...' : 'Actualiser'}
              </button>
            </div>
            <DocumentList 
              documents={documents} 
              onRefresh={loadDocuments}
              loading={loading}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default PharmacyDashboard;