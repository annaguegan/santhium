// Gestion des codes/QR codes
import api from './api';

const CODE_BASE = '/api/codes';

export const codeService = {
  // Générer un nouveau code (pharmacien)
  generate: async (expirationHours = 1) => {
    const response = await api.post(`${CODE_BASE}/generate`, {
      expiration_hours: expirationHours,
    });
    return response.data;
  },

  // Valider un code (patient)
  validate: async (code) => {
    const response = await api.post(`${CODE_BASE}/validate`, { code });
    return response.data;
  },

  // Récupérer tous les codes actifs
  getActive: async () => {
    const response = await api.get(`${CODE_BASE}/active`);
    return response.data;
  },
};
