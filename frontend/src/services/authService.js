// Gestion de l'authentification
import api from './api';

const AUTH_BASE = '/api/v1/auth';

export const authService = {
  login: async (email, password) => {
    const response = await api.post(`${AUTH_BASE}/login`, { email, password });
    const { access_token: accessToken, user } = response.data;
    localStorage.setItem('token', accessToken);
    return user;
  },
  register: async ({ fullName, email, password, pharmacyCode }) => {
    const response = await api.post(`${AUTH_BASE}/register`, {
      full_name: fullName,
      email,
      password,
      pharmacy_code: pharmacyCode,
    });
    const { access_token: accessToken, user } = response.data;
    localStorage.setItem('token', accessToken);
    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    // Décoder le token JWT pour récupérer l'utilisateur
    return JSON.parse(atob(token.split('.')[1]));
  },
};
