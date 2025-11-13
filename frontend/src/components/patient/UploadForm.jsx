// Formulaire d'upload pour le patient
import { useState } from 'react';
import { documentService } from '../../services/documentService';

export const UploadForm = ({ code }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      await documentService.upload(code, file);
      alert('Document envoyé avec succès !');
    } catch (error) {
      alert('Erreur lors de l\'envoi');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])}
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <button type="submit" disabled={!file || uploading}>
        {uploading ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
};