import React,{useEffect,useState} from 'react';
import {StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons'; 
import indexAdmin from './Dashboard';
import inventario from './inventario';
import prueba from './prueba';
const Drawer = createDrawerNavigator();
import { useProtectedRoute } from "@/context/userContext";
export default function App() {


  const isAuthenticated = useProtectedRoute('/singIn'); // Redirige a '/login' si no está autenticado

  if (!isAuthenticated) {
    return null; // O un componente de carga
  }


  return (
    <>
      <Drawer.Navigator
        initialRouteName="Dashboard" 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#00bcf3',
          },
          headerTintColor: 'white',
          drawerStyle: {
            backgroundColor: '#00bcf3',
            width: 250,
          },
          drawerActiveTintColor: 'white',
          drawerInactiveTintColor: '#d1d1d1',
        }}
      >
        <Drawer.Screen
          name="Dashboard"
          component={indexAdmin}
          options={{
            title: 'Dashboard',
            drawerIcon: ({ color }) => <Ionicons name="calculator" size={24} color={color} />,
          }}
        />
         <Drawer.Screen
          name="inventario"
          component={inventario}
          options={{
            title: 'Inventario',
            drawerIcon: ({ color }) => <Ionicons name="calculator" size={24} color={color} />,
          }}
        />
         <Drawer.Screen
          name="prueba"
          component={prueba}
          options={{
            title: 'prueba',
            drawerIcon: ({ color }) => <Ionicons name="calculator" size={24} color={color} />,
          }}
        />
      </Drawer.Navigator>
      </>
  );
}
const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: [{ translateX: -75 }], // Centrar el botón
    backgroundColor: '#ff4d4d',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});