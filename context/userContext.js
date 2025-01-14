import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsAuthenticated(false);
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const useProtectedRoute = (redirectPath = '/') => {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, isLoading, redirectPath, router]);

  return { isAuthenticated, isLoading };
};
