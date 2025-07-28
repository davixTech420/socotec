/* import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";

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
      const token = await AsyncStorage.getItem("userToken");
      setIsAuthenticated(!!token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token) => {
    try {
      await AsyncStorage.setItem("userToken", token);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setIsAuthenticated(false);
      router.navigate("/");
    } catch (error) {
      throw error;
    }
  };

  const user = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuthStatus,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const useProtectedRoute = (redirectPath = "/") => {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, isLoading, redirectPath, router]);

  return { isAuthenticated, isLoading };
};
 */

import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Efecto para manejar la expiración automática del token
  useEffect(() => {
    let timeoutId;

    if (tokenExpiration) {
      const timeRemaining = tokenExpiration - Date.now();
      
      if (timeRemaining > 0) {
        timeoutId = setTimeout(() => {
          logout(); // Cierra sesión cuando expire el token
        }, timeRemaining);
      } else {
        logout(); // Cierra sesión inmediatamente si el token ya expiró
      }
    }

    return () => clearTimeout(timeoutId); // Limpia el timeout al desmontar
  }, [tokenExpiration]);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      
      if (token) {
        const decodedToken = jwtDecode(token);
        const isTokenValid = decodedToken.exp * 1000 > Date.now();
        
        setIsAuthenticated(isTokenValid);
        setTokenExpiration(decodedToken.exp * 1000);
        
        if (!isTokenValid) {
          await AsyncStorage.removeItem("userToken"); // Elimina token expirado
        }
      } else {
        setIsAuthenticated(false);
        setTokenExpiration(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setTokenExpiration(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;
      
      await AsyncStorage.setItem("userToken", token);
      setIsAuthenticated(true);
      setTokenExpiration(expirationTime);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setIsAuthenticated(false);
      setTokenExpiration(null);
      router.navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const user = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return null;
      
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        await logout(); // Cierra sesión si el token expiró
        return null;
      }
      return decodedToken;
    } catch (error) {
      console.error("Error getting user:", error);
      await logout(); // Limpieza en caso de error
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuthStatus,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const useProtectedRoute = (redirectPath = "/") => {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus(); // Verifica el estado de autenticación al montar
    
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, isLoading, redirectPath, router]);

  return { isAuthenticated, isLoading };
};