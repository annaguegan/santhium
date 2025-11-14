// frontend/src/pages/PharmacyDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodeGenerator } from '../components/pharmacy/CodeGenerator';
import { DocumentList } from '../components/pharmacy/DocumentList';
import { documentService } from '../services/documentService';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { LuCircleUser } from 'react-icons/lu';
import '../styles/Dashboard.css';

const PharmacyDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/pharmacy/login');
      return;
    }
    loadDocuments();
    loadProfile();
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

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/pharmacy/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  const displayName = profile?.full_name?.trim() || profile?.email || 'Pharmacien';

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
          <div className="user-section" ref={profileRef}>
            <div className="user-profile">
              <button 
                className={`profile-button ${showProfile ? 'active' : ''}`}
                onClick={toggleProfile}
                type="button"
                title="Voir mon profil"
              >
                <LuCircleUser size={24} />
              </button>
              <span className="user-name">{displayName}</span>
              {showProfile && profile && (
                <div className="profile-dropdown">
                  <h3>{profile.pharmacy?.name || 'Pharmacie'}</h3>
                  <div className="profile-row">
                    <span>Code pharmacie</span>
                    <strong>{profile.pharmacy?.tenant_code || '—'}</strong>
                  </div>
                  <div className="profile-row">
                    <span>Compte connecté</span>
                    <strong>{profile.email}</strong>
                  </div>
                  {profile.pharmacy?.city && (
                    <div className="profile-row">
                      <span>Ville</span>
                      <strong>{profile.pharmacy.city}</strong>
                    </div>
                  )}
                  {profile.pharmacy?.address && (
                    <div className="profile-row">
                      <span>Adresse</span>
                      <strong>{profile.pharmacy.address}</strong>
                    </div>
                  )}
                  {profile.pharmacy?.phone && (
                    <div className="profile-row">
                      <span>Téléphone</span>
                      <strong>{profile.pharmacy.phone}</strong>
                    </div>
                  )}
                </div>
              )}
            </div>
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
