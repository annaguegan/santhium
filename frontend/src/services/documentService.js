// Gestion des documents
import api from './api';

export const documentService = {
  // Upload d'un document par un patient
  upload: async (code, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('code', code);

    return await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Récupérer tous les documents (pharmacien)
  getAll: async () => {
    const response = await api.get('/documents');
    return response.data;
  },

  // Télécharger un document
  download: async (documentId) => {
    const response = await api.get(`/documents/${documentId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Supprimer un document
  delete: async (documentId) => {
    return await api.delete(`/documents/${documentId}`);
  },
};