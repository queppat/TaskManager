export const TokenManager = {
  setTokens(accessToken) {
    localStorage.setItem('accessToken', accessToken);
  },

  getTokens() {
    return {
      accessToken: localStorage.getItem('accessToken'),
    };
  },

  clearToken() {
    localStorage.removeItem('accessToken');
  },

  hasToken() {
    return !!localStorage.getItem('accessToken');
  }
};
