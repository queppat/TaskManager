import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = () => {
    return !!localStorage.getItem('accessToken');
  };


  const getuserFromToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const user = getuserFromToken();
    setUser(user);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
      const data = await authService.login(credentials);
      setUser(data.user);
      return data;
  };

  const register = async (userData) => {
      const data = await authService.register(userData);
      if (data.accessToken) {
        setUser({ username: userData.username });
      }
      return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};