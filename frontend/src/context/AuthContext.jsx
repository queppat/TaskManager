import { createContext, useState, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await authService.refreshTokens();
      if (data.accessToken) {
        const user = authService.getUserFromToken();
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      logout();
      return false;
    }
  }, [logout]);

  const handleExpiredToken = useCallback(async () => {
    const refreshSuccess = await refresh();
    if (!refreshSuccess) {
      logout();
    }
  }, [refresh, logout]);

  const initializeAuthState = useCallback(async () => {
    const validation = authService.validateToken();

    switch (validation.reason) {
      case 'VALID':
        setUser(validation.user);
        break;
      case 'EXPIRED':
        await handleExpiredToken();
        break;
      default:
        setUser(null);
        break;
    }
  }, [handleExpiredToken]);

  useEffect(() => {
    const initialize = async () => {
      await initializeAuthState();
      setLoading(false);
    };

    initialize();
  }, [initializeAuthState]);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    const user = authService.getUserFromToken();
    setUser(user);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await authService.register(userData);
    if (data.accessToken) {
      const user = authService.getUserFromToken();
      setUser(user);
    }
    return data;
  }, []);

  const value = useMemo(() => ({
    user,
    login,
    register,
    logout,
    refresh,
    loading,
    isAuthenticated: authService.isAuthenticated()
  }), [user, login, register, logout, refresh, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};