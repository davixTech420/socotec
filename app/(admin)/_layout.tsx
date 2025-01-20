/* import React from 'react';
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
}); */

  import React, { useState } from "react"
import { View, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar, Dimensions } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { Provider as PaperProvider, Avatar, Text, Button, useTheme, IconButton, Appbar } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated"

import Dashboard from "./Dashboard"
import Inventario from "./inventario"
import Prueba from "./prueba"
import { useProtectedRoute, useAuth } from "@/context/userContext"

const Drawer = createDrawerNavigator()
const { width: SCREEN_WIDTH } = Dimensions.get("window")
const DRAWER_WIDTH = SCREEN_WIDTH * (Platform.OS == "web" ? 0.2 : 0.7);
function AnimatedScreen({ children, style, staticButton }) {
  return (
    <Animated.View style={[styles.screen, style]}>
      <ScrollView contentContainerStyle={styles.screenContent}>
        {children}
       {/*  <View style={styles.staticButtonContainer}>{staticButton}</View> */}
      </ScrollView>
    </Animated.View>
  )
}

function CustomDrawerContent(props) {
  const { logout, user } = useAuth()
  const theme = useTheme()

  const handleSignOut = () => {
    logout()
  }

  return (
    <SafeAreaView style={[styles.drawerContent, { backgroundColor: theme.colors.surface }]}>
      <ScrollView>
        <View style={styles.userInfoSection}>
          <Avatar.Image source={require("../../assets/images/favicon.png")} size={80} style={{backgroundColor:"transparent"}} />
          <Text style={[styles.title, { color: "#00ACE8" }]}>{user?.name || "Usuario"}</Text>
          <Text style={[styles.caption, { color: theme.colors.secondary }]}>
            {user?.email || "usuario@socotec.com"}
          </Text>
        </View>
        <View style={styles.drawerSection}>
          {props.state.routes.map((route, index) => {
            const { title, drawerIcon } = props.descriptors[route.key].options
            const isFocused = props.state.index === index

            return (
              <Button
                key={route.key}
                icon={({ size, color }) => drawerIcon({ color, size })}
                mode={isFocused ? "contained" : "text"}
                onPress={() => props.navigation.navigate(route.name)}
                style={styles.drawerItem}
                labelStyle={styles.drawerItemLabel}
              >
                {title}
              </Button>
            )
          })}
        </View>
      </ScrollView>
      <Button
        icon={({ size, color }) => <MaterialCommunityIcons name="logout" size={size} color={color} />}
        mode="outlined"
        onPress={handleSignOut}
        style={styles.logoutButton}
      >
        Cerrar Sesión
      </Button>
    </SafeAreaView>
  )
}

function CustomAppBar({ title, navigation, drawerProgress }) {
  const theme = useTheme()

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(drawerProgress.value, [0, 1], [0, 180], Extrapolate.CLAMP)
    return {
      transform: [{ rotate: `${rotate}deg` }],
    }
  })

  return (
    <Appbar.Header style={{ backgroundColor:"#00ACE8" }}>
      <Animated.View style={animatedStyle}>
        <IconButton icon="menu" color={theme.colors.surface} size={24} onPress={navigation.toggleDrawer} />
      </Animated.View>
      <Appbar.Content title={title} color={theme.colors.surface} />
    </Appbar.Header>
  )
}

export default function App() {
  const isAuthenticated = useProtectedRoute("/signIn")
  const { user } = useAuth()
  const theme = useTheme()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const drawerProgress = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(drawerProgress.value, [0, 1], [0, DRAWER_WIDTH])
    const borderRadius = interpolate(drawerProgress.value, [0, 1], [0, 20])
    const scale = interpolate(drawerProgress.value, [0, 1], [1, 0.8])
    return {
      transform: [
        { translateX: withTiming(translateX, { duration: 300 }) },
        { scale: withTiming(scale, { duration: 300 }) },
      ],
      borderRadius: withTiming(borderRadius, { duration: 300 }),
      overflow: "hidden",
    }
  })

  if (!isAuthenticated) {
    return null
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Drawer.Navigator
          initialRouteName="Dashboard"
          drawerContent={(props) => <CustomDrawerContent {...props} user={user} />}
          screenOptions={{
            drawerStyle: {
              backgroundColor: "transparent",
              width: DRAWER_WIDTH,
            },
            drawerType: "slide",
            overlayColor: "transparent",
            sceneContainerStyle: { backgroundColor: "transparent" },
            header: ({ navigation, route, options }) => (
              <CustomAppBar title={options.title} navigation={navigation} drawerProgress={drawerProgress} />
            ),
          }}
          drawerPosition="left"
          onStateChange={(state) => {
            const isOpen = state.history[state.history.length - 1].type === "drawer"
            setIsDrawerOpen(isOpen)
            drawerProgress.value = withTiming(isOpen ? 1 : 0, { duration: 300 })
          }}
        >
          <Drawer.Screen
            name="Dashboard"
            options={{
              title: "Dashboard",
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons name="view-dashboard-outline" size={24} color={color} />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen
                style={animatedStyle}
                staticButton={
                  <Button
                    mode="contained"
                    onPress={() => {
                      // Add your action here
                    }}
                    style={styles.floatingButton}
                  >
                    Action
                  </Button>
                }
              >
                <Dashboard {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>
          <Drawer.Screen
            name="Inventario"
            options={{
              title: "Inventario",
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons name="clipboard-list-outline" size={24} color={color} />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Inventario {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>
          <Drawer.Screen
            name="Prueba"
            options={{
              title: "Prueba",
              drawerIcon: ({ color }) => <MaterialCommunityIcons name="flask-outline" size={24} color={color} />,
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Prueba {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>
        </Drawer.Navigator>
      </SafeAreaView>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ?  StatusBar.currentHeight  : 0,
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
  },
  drawerSection: {
    marginTop: 15,
  },
  drawerItem: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  drawerItemLabel: {
    marginLeft: -20,
  },
  logoutButton: {
    margin: 16,
    borderRadius: 10,
  },
  screen: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  screenContent: {
    flex: 1,
    position: "relative",
  },
  staticButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 30,
  },
})

