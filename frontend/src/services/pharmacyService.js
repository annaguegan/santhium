import api from './api';

const PHARMACY_BASE = '/api/pharmacies';

export const pharmacyService = {
  create: async (payload) => {
    const response = await api.post(PHARMACY_BASE, payload);
    return response.data;
  },
};
