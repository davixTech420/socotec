import React from 'react';
import {  StyleSheet} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import indexEmplo from './DashboardE';
import calculator from './calculator';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener esta biblioteca instalada
import calendar from './calendar';
import reportes from './reportes';
import { useProtectedRoute, useAuth } from "@/context/userContext";
import {router}  from "expo-router";

const Drawer = createDrawerNavigator();

export default function App() {
   const isAuthenticated = useProtectedRoute("/singIn");
    const { user } = useAuth();

     if (!isAuthenticated) {
        return null
      }
    
    
      user()
        .then((userData) => {
          if (userData.role != 'employee') {
            router.replace("/(admin)/Dashboard");
          }
        })
        .catch((error) => {
          console.log('Error obteniendo el rol:', error);
        });

  return (
    <>
      <Drawer.Navigator
        initialRouteName="DashboardE"
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
          name="DashboardE"
          component={indexEmplo}
          options={{
            title: 'Dashboard',
            drawerIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <Drawer.Screen
          name="calculator"
          component={calculator}
          options={{
            title: 'Calcular',
            drawerIcon: ({ color }) => <Ionicons name="calculator" size={24} color={color} />,
          }}
        />
         <Drawer.Screen
          name="reportes"
          component={reportes}
          options={{
            title: 'Reportes',
            drawerIcon: ({ color }) => <Ionicons name="document" size={24} color={color} />,
          }}
        />
        <Drawer.Screen
          name="Calendar"
          component={calendar}
          options={{
            title: 'Calendario',
            drawerIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
          }}
        />

<Drawer.Screen
          name="ajustes"
          component={calculator}
          options={{
            title: 'Ajustes',
            drawerIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
          }}
        />
        <Drawer.Screen
          name="salir"
          component={calculator}
          options={{
            title: 'Cerrar Sesión',
            drawerIcon: ({ color }) => <Ionicons name="exit" size={24} color={color} />,
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
