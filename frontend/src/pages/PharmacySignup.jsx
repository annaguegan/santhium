import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/Login.css';

const PharmacySignup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [pharmacyCode, setPharmacyCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        fullName,
        email,
        password,
        pharmacyCode,
      });
      navigate('/pharmacy/dashboard');
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(detail || "Impossible de créer le compte. Vérifiez vos informations.");
      console.error('Erreur inscription:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <svg viewBox="0 0 100 100" className="logo-icon">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="30" cy="30" r="5" fill="currentColor" />
              <circle cx="70" cy="30" r="5" fill="currentColor" />
              <circle cx="50" cy="50" r="5" fill="currentColor" />
              <circle cx="30" cy="70" r="5" fill="currentColor" />
              <circle cx="70" cy="70" r="5" fill="currentColor" />
            </svg>
          </div>
          <h1>Santhium</h1>
          <p className="subtitle">Créer un compte pharmacien</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <svg viewBox="0 0 20 20" className="error-icon">
                <path
                  fill="currentColor"
                  d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"
                />
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="fullName">Nom complet</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Prénom Nom"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-email">Email professionnel</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="votre.email@pharmacie.fr"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pharmacyCode">Code référent pharmacie</label>
            <input
              id="pharmacyCode"
              type="text"
              value={pharmacyCode}
              onChange={(event) => setPharmacyCode(event.target.value.toUpperCase())}
              placeholder="PH-XXXXXX"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Mot de passe</label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="auth-switch">
          <span>Déjà un compte ? </span>
          <Link to="/pharmacy/login">Se connecter</Link>
        </div>
        <div className="auth-switch">
          <span>Nouvelle pharmacie ? </span>
          <Link to="/pharmacy/create">Créer ma pharmacie</Link>
        </div>
      </div>
    </div>
  );
};

export default PharmacySignup;
