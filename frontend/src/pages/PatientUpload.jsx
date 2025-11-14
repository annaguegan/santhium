// Page d'upload pour les patients (accessible sans authentification)
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UploadForm } from '../components/patient/UploadForm';
import '../styles/PatientUpload.css';

const PatientUpload = () => {
  const { code: codeFromUrl } = useParams();
  const [code, setCode] = useState(codeFromUrl ?? '');
  const [codeConfirmed, setCodeConfirmed] = useState(Boolean(codeFromUrl));

  useEffect(() => {
    setCode(codeFromUrl ?? '');
    setCodeConfirmed(Boolean(codeFromUrl));
  }, [codeFromUrl]);

  const handleCodeSubmit = (event) => {
    event.preventDefault();
    if (!code?.trim()) {
      return;
    }
    setCodeConfirmed(true);
  };

  const resetCode = () => {
    setCode('');
    setCodeConfirmed(false);
  };

  return (
    <div className="patient-upload-page">
      <div className="patient-upload-card">
        <div className="patient-upload-header">
          <p className="patient-badge">Espace patient</p>
          <h1>Transférez vos documents en toute sécurité</h1>
          <p className="patient-upload-subtitle">
            Munissez-vous du code communiqué par votre pharmacie pour envoyer vos prescriptions,
            certificats ou autres justificatifs médicaux.
          </p>
        </div>

        {!codeConfirmed && (
          <form className="code-form" onSubmit={handleCodeSubmit}>
            <label htmlFor="transfer-code">Code de transfert</label>
            <input
              id="transfer-code"
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              placeholder="Ex: ABC123"
              maxLength={12}
              required
            />
            <button type="submit">Valider le code</button>
          </form>
        )}

        {codeConfirmed && (
          <>
            <div className="code-summary">
              <div>
                <span>Code utilisé :</span>
                <strong>{code}</strong>
              </div>
              <button type="button" onClick={resetCode}>
                Changer de code
              </button>
            </div>
            <UploadForm code={code} />
          </>
        )}
      </div>
    </div>
  );
};

export default PatientUpload;
