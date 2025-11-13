// Génère un code/QR code pour une pharmacie
import { useState } from 'react';
import { codeService } from '../../services/codeService';
import { QRCodeSVG } from 'qrcode.react';
import '../../styles/CodeGenerator.css';

export const CodeGenerator = () => {
  const [code, setCode] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateCode = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await codeService.generate();
      setCode(result.code);
      // URL pour le patient
      setQrData(`${window.location.origin}/patient/upload/${result.code}`);
    } catch (err) {
      setError('Erreur lors de la génération du code');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert('Code copié dans le presse-papier !');
  };

  return (
    <div className="code-generator">
      <button 
        onClick={generateCode} 
        className="btn-generate"
        disabled={loading}
      >
        {loading ? 'Génération...' : '🔄 Générer un nouveau code'}
      </button>

      {error && (
        <div className="error-box">
          ⚠️ {error}
        </div>
      )}

      {code && (
        <div className="code-display">
          <div className="code-info">
            <p className="code-label">Code de transfert :</p>
            <div className="code-value-container">
              <span className="code-value">{code}</span>
              <button 
                onClick={copyCode} 
                className="btn-copy"
                title="Copier le code"
              >
                📋
              </button>
            </div>
            <p className="code-hint">
              Communiquez ce code au patient ou faites-lui scanner le QR code
            </p>
          </div>

          {qrData && (
            <div className="qr-container">
              <QRCodeSVG 
                value={qrData} 
                size={200}
                level="H"
                includeMargin={true}
              />
              <p className="qr-label">Scannez pour uploader</p>
            </div>
          )}

          <div className="code-expires">
            ⏱️ Ce code expire dans 24 heures
          </div>
        </div>
      )}
    </div>
  );
};