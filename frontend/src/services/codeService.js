// Gestion des codes/QR codes
import api from './api';

export const codeService = {
  // Générer un nouveau code (pharmacien)
  generate: async (expirationHours = 24) => {
    const response = await api.post('/codes/generate', {
      expiration_hours: expirationHours,
    });
    return response.data;
  },

  // Valider un code (patient)
  validate: async (code) => {
    const response = await api.post('/codes/validate', { code });
    return response.data;
  },

  // Récupérer tous les codes actifs
  getActive: async () => {
    const response = await api.get('/codes/active');
    return response.data;
  },
};