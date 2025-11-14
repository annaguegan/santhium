import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { pharmacyService } from '../services/pharmacyService';
import '../styles/PharmacyCreate.css';
import '../styles/Login.css';


const initialForm = {
  name: '',
  address: '',
  city: '',
  postal_code: '',
  phone: '',
  owner_full_name: '',
  owner_email: '',
  owner_password: '',
  owner_password_confirm: '',
};

const postalCodeRegex = /^\d{4,10}$/;
const phoneRegex = /^\d{8,15}$/;

const PharmacyCreate = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tenantCode, setTenantCode] = useState('');

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setTenantCode('');

    if (!postalCodeRegex.test(form.postal_code)) {
      setError('Le code postal doit contenir uniquement des chiffres (4 à 10).');
      return;
    }

    if (!phoneRegex.test(form.phone)) {
      setError('Le téléphone doit contenir uniquement des chiffres (8 à 15).');
      return;
    }

    if (form.owner_password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (form.owner_password !== form.owner_password_confirm) {
      setError('La confirmation du mot de passe ne correspond pas.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        address: form.address.trim() || undefined,
        city: form.city.trim(),
        postal_code: form.postal_code.trim(),
        phone: form.phone.trim(),
        owner_full_name: form.owner_full_name.trim() || undefined,
        owner_email: form.owner_email.trim(),
        owner_password: form.owner_password,
      };
      const result = await pharmacyService.create(payload);
      setTenantCode(result.tenant_code);
      setForm(initialForm);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(detail || "Impossible de créer la pharmacie. Vérifiez les informations.");
      console.error('Erreur création pharmacie:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container pharmacy-create-page">
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
          <h1>Créer ma pharmacie</h1>
          <p className="subtitle">Ajouter votre pharmacie</p>
        </div>

        <form className="pharmacy-form" onSubmit={handleSubmit}>
          {error && (
            <div className="form-error">
              <div className="error-message">
                <svg viewBox="0 0 20 20" className="error-icon">
                  <path
                    fill="currentColor"
                    d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="form-columns">
            <section className="form-section">
              <h3>Informations de la pharmacie</h3>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label htmlFor="pharmacy-name">Nom de la pharmacie</label>
                  <input
                    id="pharmacy-name"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="Pharmacie Saint-Michel"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pharmacy-phone">Téléphone</label>
                  <input
                    id="pharmacy-phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    placeholder="01 02 03 04 05"
                    inputMode="numeric"
                    minLength={8}
                    maxLength={15}
                    pattern="[0-9]{8,15}"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pharmacy-city">Ville</label>
                  <input
                    id="pharmacy-city"
                    value={form.city}
                    onChange={handleChange('city')}
                    placeholder="Paris"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pharmacy-postal">Code postal</label>
                  <input
                    id="pharmacy-postal"
                    value={form.postal_code}
                    onChange={handleChange('postal_code')}
                    placeholder="75001"
                    inputMode="numeric"
                    minLength={4}
                    maxLength={10}
                    pattern="[0-9]{4,10}"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group span-2">
                  <label htmlFor="pharmacy-address">Adresse</label>
                  <input
                    id="pharmacy-address"
                    value={form.address}
                    onChange={handleChange('address')}
                    placeholder="12 rue de la Santé"
                    disabled={loading}
                  />
                </div>
              </div>
            </section>

            <section className="form-section">
              <h3>Compte administrateur</h3>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label htmlFor="owner-fullname">Responsable (optionnel)</label>
                  <input
                    id="owner-fullname"
                    value={form.owner_full_name}
                    onChange={handleChange('owner_full_name')}
                    placeholder="Nom Prénom"
                    disabled={loading}
                  />
                </div>

                <div className="form-group span-2">
                  <label htmlFor="owner-email">Email du compte administrateur</label>
                  <input
                    id="owner-email"
                    type="email"
                    value={form.owner_email}
                    onChange={handleChange('owner_email')}
                    placeholder="admin@pharmacie.fr"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="owner-password">Mot de passe</label>
                  <input
                    id="owner-password"
                    type="password"
                    value={form.owner_password}
                    onChange={handleChange('owner_password')}
                    placeholder="********"
                    minLength={8}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="owner-password-confirm">Confirmer le mot de passe</label>
                  <input
                    id="owner-password-confirm"
                    type="password"
                    value={form.owner_password_confirm}
                    onChange={handleChange('owner_password_confirm')}
                    placeholder="********"
                    minLength={8}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Création...' : 'Créer ma pharmacie'}
            </button>
          </div>
        </form>

        {tenantCode && (
          <div className="tenant-success">
            <p>Votre code tenant :</p>
            <strong>{tenantCode}</strong>
            <p>
              Partagez-le aux membres de votre équipe pour qu’ils s’inscrivent sur la plateforme.
            </p>
            <p>Vous pouvez vous connecter dès maintenant avec l'email administrateur créé.</p>
            <Link to="/pharmacy/login" className="btn-secondary">
              Se connecter
            </Link>
          </div>
        )}

        <div className="auth-switch">
          <span>Déjà un code ? </span>
          <Link to="/pharmacy/signup">Passer à l’inscription</Link>
        </div>
      </div>
    </div>
  );
};

export default PharmacyCreate;
