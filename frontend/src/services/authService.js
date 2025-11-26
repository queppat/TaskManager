import api from './api';

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);

    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken)
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('accessToken');
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },
};