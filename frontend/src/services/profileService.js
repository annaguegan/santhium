import api from './api';

const AUTH_BASE = '/api/v1/auth';

export const profileService = {
  getProfile: async () => {
    const response = await api.get(`${AUTH_BASE}/profile`);
    return response.data;
  },
};
