// Formulaire d'upload pour le patient
import { useState } from 'react';
import { documentService } from '../../services/documentService';
import { useNotification } from '../../contexts/NotificationContext';

export const UploadForm = ({ code }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { notify } = useNotification();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    setUploading(true);
    
    try {
      await documentService.upload(code, file);
      notify('Document envoyé avec succès !', 'success');
      setFile(null);
      event.target.reset();
    } catch (error) {
      notify("Erreur lors de l'envoi du document", 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <label className="upload-label" htmlFor="medical-file">
        Document médical
      </label>
      <input 
        id="medical-file"
        type="file" 
        className="upload-input"
        onChange={(event) => setFile(event.target.files[0])}
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <p className="upload-hint">
        Formats acceptés : PDF, JPG, JPEG, PNG (10 Mo max).
      </p>
      <button className="upload-button" type="submit" disabled={!file || uploading}>
        {uploading ? 'Envoi en cours...' : 'Envoyer mon document'}
      </button>
    </form>
  );
};
