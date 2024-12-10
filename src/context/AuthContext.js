import React, { createContext, useState, useEffect } from 'react';
import { getUserData, clearUserData } from '../utils/userStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthentication = async () => {
    try {
      const userData = await getUserData();
      setIsAuthenticated(!!userData?.accessToken);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const login = () => setIsAuthenticated(true);

  const logout = async () => {
    await clearUserData();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
