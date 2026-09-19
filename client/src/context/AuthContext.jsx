import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('codeforge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('codeforge_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('codeforge_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('codeforge_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out');
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (identifier, password) => {
    const res = await authService.login(identifier, password);
    if (res.success && res.data) {
      const { user: userData, token: jwtToken } = res.data;
      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('codeforge_token', jwtToken);
      localStorage.setItem('codeforge_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Login failed.');
  };

  const register = async (data) => {
    const res = await authService.register(data);
    if (res.success && res.data) {
      const { user: userData, token: jwtToken } = res.data;
      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('codeforge_token', jwtToken);
      localStorage.setItem('codeforge_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Registration failed.');
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = Boolean(user && token);
  const isAdmin = Boolean(user && user.role === 'ADMIN');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
