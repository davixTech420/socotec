import React, { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar, Dimensions } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { Provider as PaperProvider, Avatar, Text, Button, useTheme, IconButton, Appbar } from "react-native-paper"
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated"
import Dashboard from "./DashboardE"
import Calendar from "./Calendar";
import MyAccount from "./MyAccount";
import { useProtectedRoute, useAuth } from "@/context/userContext";
import { router } from "expo-router"


const Drawer = createDrawerNavigator()
const { width: SCREEN_WIDTH } = Dimensions.get("window")
const DRAWER_WIDTH = SCREEN_WIDTH * (Platform.OS == "web" ? 0.2 : 0.7);
function AnimatedScreen({ children, style, staticButton }) {
  return (
    <Animated.View style={[styles.screen, style]}>
      <ScrollView contentContainerStyle={styles.screenContent}>
        {children}

      </ScrollView>
    </Animated.View>
  )
}
function CustomDrawerContent(props) {
  const { logout, user } = useAuth()
  const theme = useTheme()

  //obtener el usuario logueado
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    user().then(setUserData).catch(error => console.log('Error user data:', error));
  }, []);
  /** */

  //cerrar la sesion en el contexto general
  const handleSignOut = () => {
    logout()
  }
  return (
    <SafeAreaView style={[styles.drawerContent, { backgroundColor: theme.colors.surface }]}>
      <ScrollView>
        <View style={styles.userInfoSection}>
          <Avatar.Image source={require("../../assets/images/favicon.png")} size={80} style={{ backgroundColor: "transparent" }} />
          <Text style={[styles.title, { color: "#00ACE8" }]}>{userData?.nombre || "Usuario"}</Text>
          <Text style={[styles.caption, { color: theme.colors.secondary }]}>
            {userData?.email || "usuario@socotec.com"}
          </Text>
        </View>
        <View style={styles.drawerSection}>
          {props.state.routes.map((route, index) => {
            const { title, drawerIcon } = props.descriptors[route.key].options
            const isFocused = props.state.index === index
            return (
              <Button
                key={route.key}
                icon={({ size, color }) => drawerIcon({ color: isFocused ? color : "black", size })}
                mode={isFocused ? "contained" : "text"}
                onPress={() => props.navigation.navigate(route.name)}
                style={[styles.drawerItem, { backgroundColor: isFocused ? "#00ACE8" : "#fff" }]}
                labelStyle={[styles.drawerItemLabel, { color: isFocused ? "white" : "black" }]}
              >
                {title}
              </Button>
            )
          })}
        </View>
      </ScrollView>
      <Button
        icon={({ size }) => <MaterialCommunityIcons name="logout" size={size} color="#ff0000" />}
        textColor="#ff0000"
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
    <Appbar.Header style={{ backgroundColor: "#00ACE8" }}>
      <Animated.View style={animatedStyle}>
        <IconButton icon="menu" color={theme.colors.surface} size={24} onPress={navigation.toggleDrawer} />
      </Animated.View>
      <Appbar.Content title={title} color={theme.colors.surface} />
    </Appbar.Header>
  )
}

export default function App() {
  const isAuthenticated = useProtectedRoute("/singIn")
  const { user } = useAuth()
  const theme = useTheme()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [logueado,setLogueado] = useState(false);

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


  user()
    .then((userData) => {
      setLogueado(userData);
      if (userData.role != 'employee') {
        router.replace("/(admin)/Dashboard");
      }
    })
    .catch((error) => {
      console.log('Error obteniendo el rol:', error);
    });

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Drawer.Navigator
          initialRouteName="DashboardE"
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
            name="DashboardE"
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
            name="Candar"
            options={{
              title: "Mis Permisos",
              drawerIcon: ({ color }) => <MaterialCommunityIcons name="calendar" size={24} color={color} />,
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Calendar {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>


          <Drawer.Screen
            name="Caledar"
            options={{
              title: "Proyectos",
              drawerIcon: ({ color }) => <MaterialCommunityIcons name="calendar" size={24} color={color} />,
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Calendar {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>
          <Drawer.Screen
            name="Calenda"
            options={{
              title: "Mi Grupo",
              drawerIcon: ({ color }) => <MaterialCommunityIcons name="calendar" size={24} color={color} />,
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Calendar {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>




  <Drawer.Screen
  name="MyAccount"
  options={{
    title: "Mi Cuenta",
    drawerIcon: ({ color }) => <MaterialCommunityIcons name="calendar" size={24} color={color} />,
  }}
>
  {(props) => (
    <AnimatedScreen style={animatedStyle}>
      <MyAccount {...props} />
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
    marginHorizontal: 2,
    marginVertical: 5,
    borderRadius: 10,
  },
  drawerItemLabel: {
    marginLeft: 20,
  },
  logoutButton: {
    margin: 16,
    borderRadius: 10,
    borderColor: "#ff0000",
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