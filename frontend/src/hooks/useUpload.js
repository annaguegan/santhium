// Hook pour gérer l'upload de fichiers
import { useState } from 'react';
import { documentService } from '../services/documentService';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const upload = async (code, file) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      await documentService.upload(code, file);
      setProgress(100);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, progress, error };
};