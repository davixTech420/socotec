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






/* import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Drawer, Text, Appbar } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Slot, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useProtectedRoute, useAuth } from "@/context/userContext";

const { width } = Dimensions.get('window'); 

const DrawerContent = ({ activeRoute, setActiveRoute }) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleNavigation = (route) => {
    setActiveRoute(route);
    router.navigate(route);
  };

  return (
    <View style={styles.drawerContent}>
      <View style={styles.userInfoSection}>
        <Image
         source={require('../../assets/images/icon.png')}
          style={styles.profileImage}
        />
        <Text style={styles.username}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>
      </View>
      <Drawer.Section>
        <Drawer.Item
          label="Dashboard"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          )}
          active={activeRoute === '/'}
          onPress={() => handleNavigation('/')}
        />
        <Drawer.Item
          label="Inventario"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-list-outline" color={color} size={size} />
          )}
          active={activeRoute === '/inventario'}
          onPress={() => handleNavigation('/inventario')}
        />
        <Drawer.Item
          label="Prueba"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="flask-outline" color={color} size={size} />
          )}
          active={activeRoute === '/prueba'}
          onPress={() => handleNavigation('/prueba')}
        />
      </Drawer.Section>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <Drawer.Item
          label="Cerrar Sesión"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="logout" color={color} size={size} />
          )}
          onPress={logout}
        />
      </Drawer.Section>
    </View>
  );
};

export default function AppLayout() {
  const [activeRoute, setActiveRoute] = useState('/');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isAuthenticated = useProtectedRoute('/signIn');

  const drawerAnimation = useSharedValue(-width * 0.8); 
  const contentAnimation = useSharedValue(0); 

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(drawerAnimation.value, { duration: 300 }) }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(contentAnimation.value, { duration: 300 }) }],
  }));

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      // Cerrar el menú
      drawerAnimation.value = -width * 0.8;
      contentAnimation.value = 0;
    } else {
      // Abrir el menú
      drawerAnimation.value = 0;
      contentAnimation.value = width * 0.8;
    }
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleOutsidePress = () => {
    if (isDrawerOpen) {
      drawerAnimation.value = -width * 0.8;
      contentAnimation.value = 0;
      setIsDrawerOpen(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <SafeAreaView style={styles.container}>
          <Appbar.Header style={styles.header}>
            <Appbar.Action icon="menu" onPress={toggleDrawer} />
            <Appbar.Content title={activeRoute === '/' ? 'Dashboard' : activeRoute.slice(1)} />
          </Appbar.Header>
          <View style={styles.content}>
           
            <Animated.View style={[styles.drawer, drawerStyle]}>
              <DrawerContent activeRoute={activeRoute} setActiveRoute={setActiveRoute} />
            </Animated.View>
           
            <Animated.View style={[styles.pageContent, contentStyle]}>
              <Slot />
            </Animated.View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    backgroundColor: '#6200ea',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  drawer: {
    width: width * 0.8, 
    backgroundColor: '#ffffff',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  drawerContent: {
    flex: 1,
    padding: 10,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingVertical: 20,
    backgroundColor: '#6200ea',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: '#d1c4e9',
    textAlign: 'center',
    marginTop: 5,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  pageContent: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 10,
  },
});
 */