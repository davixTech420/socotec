import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/'); // Redirige a la pantalla de inicio de sesión
      }
    };

    checkAuthentication();
  }, [router]);

  return children;
};

export default ProtectedRoute;