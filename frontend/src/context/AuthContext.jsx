import { createContext, useState, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setUser(null);
      authService.clearTokens();
    }
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
      console.log('Refresh token failed:', error);
      await logout();
      return false;
    }
  }, [logout]);

  const initializeAuthState = useCallback(async () => {
    try {
      const token = authService.getToken();

      if (!token) {
        setUser(null);
        return;
      }

      const validation = authService.validateToken(token);

      switch (validation.reason) {
        case 'VALID':
          setUser(validation.user);
          break;
        case 'EXPIRED': {
          const refreshSuccess = await refresh();
          if (!refreshSuccess) {
            setUser(null);
          }
          break;
        }
        case 'NO_TOKEN':
        case 'INVALID_TOKEN':
        default:
          setUser(null);
          break;
      }
    } catch (error) {
      console.log('Auth initialization error:', error);
      setUser(null);
    }
  }, [refresh]);

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
    isAuthenticated: !!user
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