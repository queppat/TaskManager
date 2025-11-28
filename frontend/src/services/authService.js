import api from './api';

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.accessToken) {
      this.setToken(response.data.accessToken);
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.accessToken) {
      this.setToken(response.data.accessToken);
    }
    return response.data;
  },


  async logout() {
    await api.post('/auth/logout', null, {
      timeout: 5000
    });
    this.clearTokens();
    globalThis.location.href = '/login';
  },

  async refreshTokens() {
    try {
      const response = await api.post('/auth/refresh', null, {
        headers: {
          Authorization: undefined
        }
      });

      if (response.data.accessToken) {
        this.setToken(response.data.accessToken);
        return response.data.accessToken;
      }
      throw new Error('No access token in refresh response');
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  },

  setToken(token) {
    localStorage.setItem('accessToken', token);
  },

  getToken() {
    return localStorage.getItem('accessToken');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  validateToken(token = this.getToken()) {
    if (!token) return { isValid: false, reason: 'NO_TOKEN' };

    const user = this.getUserFromToken(token);
    if (!user?.exp) return { isValid: false, reason: 'INVALID_TOKEN' };

    const isExpired = Date.now() >= user.exp * 1000;
    if (isExpired) return { isValid: false, reason: 'EXPIRED' };

    return { isValid: true, user, reason: 'VALID' };
  },

  getUserFromToken(token = this.getToken()) {
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch {
      return null;
    }
  },

  isTokenExpired(token = this.getToken()) {
    const user = this.getUserFromToken(token);
    return user?.exp ? Date.now() >= user.exp * 1000 : true;
  }
};