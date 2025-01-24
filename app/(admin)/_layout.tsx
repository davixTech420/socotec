import React, { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar, Dimensions } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { Provider as PaperProvider, Avatar, Text, Button, useTheme, IconButton, Appbar } from "react-native-paper"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated"
import Dashboard from "./Dashboard"
import Inventario from "./inventario"
import Proyects from "./Proyects"
import Users from "./users";
import Model3D from "./Model3D";
import CalendarComponent from "./Calendar";
import Group from "./Groups";
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

  //obtener el usuario logueado
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    user().then(setUserData).catch(error => console.error('Error user data:', error));
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
            console.log("nuevao" + isDrawerOpen);

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
            name="Users"
            options={{
              title: "Usuarios",
              drawerIcon: ({ color }) => <MaterialCommunityIcons name="account-multiple-outline" size={24} color={color} />,
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Users {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Groups"
            options={{
              title: "Grupos de trabajo",
              drawerIcon: ({ color }) => <MaterialCommunityIcons name="account-group-outline" size={24} color={color} />,
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Group {...props} />
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
            name="Proyects"
            options={{
              title: "Proyectos",
              drawerIcon: ({ color }) => <MaterialIcons name="construction" size={24} color={color} />,
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Proyects {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>
          <Drawer.Screen
            name="Finance"
            options={{
              title: "Finanzas",
              drawerIcon: ({ color }) => <MaterialCommunityIcons name="finance" size={24} color={color} />,
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Proyects {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Calendar"
            options={{
              title: "Calendario",
              drawerIcon: ({ color }) => <MaterialCommunityIcons name="calendar" size={24} color={color} />,
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <CalendarComponent {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>



          <Drawer.Screen
            name="report"
            options={{
              title: "Reportes",
              drawerIcon: ({ color }) => <MaterialCommunityIcons name="file-document" size={24} color={color} />,
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Proyects {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>


          <Drawer.Screen
            name="models"
            options={{
              title: "Modelos 3D",
              drawerIcon: ({ color }) => <MaterialCommunityIcons name="printer-3d" size={24} color={color} />,
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Model3D {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>


          <Drawer.Screen
            name="account"
            options={{
              title: "Mi Cuenta",
              drawerIcon: ({ color }) => <MaterialCommunityIcons name="account-box" size={24} color={color} />,
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Model3D {...props} />
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