import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Dashboard from './Dashboard';
import Inventario from './inventario';
import Prueba from './prueba';
import { useProtectedRoute, useAuth } from "@/context/userContext";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { logout } = useAuth();
  const handleSignOut = () => {
    logout();
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity style={styles.closeButton} onPress={handleSignOut}>
        <MaterialCommunityIcons name="logout" size={24} color="white" />
        <Text style={styles.closeButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const isAuthenticated = useProtectedRoute('/signIn');

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
        component={Dashboard}
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Inventario"
        component={Inventario}
        options={{
          title: 'Inventario',
          drawerIcon: ({ color }) => <Ionicons name="list-outline" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Prueba"
        component={Prueba}
        options={{
          title: 'Prueba',
          drawerIcon: ({ color }) => <Ionicons name="flask-outline" size={24} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    backgroundColor: '#ff4d4d',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"space-around"
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

