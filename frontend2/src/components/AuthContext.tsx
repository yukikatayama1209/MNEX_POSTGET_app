// AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    Cookies.set('token', token);
    setIsAuthenticated(true);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};