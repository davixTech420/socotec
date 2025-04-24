import { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  Provider as PaperProvider,
  Avatar,
  Text,
  Button,
  useTheme,
  IconButton,
  Appbar,
} from "react-native-paper";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome6,
  FontAwesome5,
  AntDesign
} from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import Dashboard from "./DashboardE";
import Calendar from "./CalendarE";
import MyAccount from "./MyAccount";
import MyGroup from "./MyGroup";
import Proyect from "./Proyect";
import Inventario from "./inventario";
import AccountE from "./AccountE";
import MotionsE from "./MotionsE";
import MyTickets from "./MyTickets";
import GeneratorReport from "./GeneratorRepor";
import Hiring from "./Hiring";
import AssignmentPPE from "./AssignmentPPE";
import { useProtectedRoute, useAuth } from "@/context/userContext";
import { router } from "expo-router";

const Drawer = createDrawerNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * (Platform.OS == "web" ? 0.2 : 0.7);

function AnimatedScreen({ children, style, staticButton }) {
  return (
    <Animated.View style={[styles.screen, style]}>
      <ScrollView contentContainerStyle={styles.screenContent}>
        {children}
      </ScrollView>
    </Animated.View>
  );
}

function CustomDrawerContent(props) {
  const { logout, user } = useAuth();
  const theme = useTheme();

  // Obtener el usuario logueado
  const [userData, setUserData] = useState(null);

  // Use useCallback to memoize the fetch function
  const fetchUserData = useCallback(async () => {
    try {
      const data = await user();
      setUserData(data);
    } catch (error) {
      console.log("Error user data:", error);
    }
  }, [user]);

  useEffect(() => {
    // Only fetch if we don't already have user data
    if (!userData) {
      fetchUserData();
    }
  }, [fetchUserData, userData]);

  // Cerrar la sesion en el contexto general
  const handleSignOut = () => {
    logout();
  };

  return (
    <SafeAreaView
      style={[styles.drawerContent, { backgroundColor: theme.colors.surface }]}
    >
      <ScrollView>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            source={require("../../assets/images/favicon.png")}
            size={80}
            style={{ backgroundColor: "transparent" }}
          />
          <Text style={[styles.title, { color: "#00ACE8" }]}>
            {userData?.nombre || "Usuario"}
          </Text>
          <Text style={[styles.caption, { color: theme.colors.secondary }]}>
            {userData?.email || "usuario@socotec.com"}
          </Text>
        </View>
        <View style={styles.drawerSection}>
          {props.state.routes.map((route, index) => {
            const { title, drawerIcon } = props.descriptors[route.key].options;
            const isFocused = props.state.index === index;
            return (
              <Button
                key={route.key}
                icon={({ size, color }) =>
                  drawerIcon({ color: isFocused ? color : "black", size })
                }
                mode={isFocused ? "contained" : "text"}
                onPress={() => props.navigation.navigate(route.name)}
                style={[
                  styles.drawerItem,
                  { backgroundColor: isFocused ? "#00ACE8" : "#fff" },
                ]}
                labelStyle={[
                  styles.drawerItemLabel,
                  { color: isFocused ? "white" : "black" },
                ]}
              >
                {title}
              </Button>
            );
          })}
        </View>
      </ScrollView>
      <Button
        icon={({ size }) => (
          <MaterialCommunityIcons name="logout" size={size} color="#ff0000" />
        )}
        textColor="#ff0000"
        mode="outlined"
        onPress={handleSignOut}
        style={styles.logoutButton}
      >
        Cerrar Sesión
      </Button>
    </SafeAreaView>
  );
}

function CustomAppBar({ title, navigation, drawerProgress }) {
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      drawerProgress.value,
      [0, 1],
      [0, 180],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <Appbar.Header style={{ backgroundColor: "#00ACE8" }}>
      <Animated.View style={animatedStyle}>
        <IconButton
          icon="menu"
          color={theme.colors.surface}
          size={24}
          onPress={navigation.toggleDrawer}
        />
      </Animated.View>
      <Appbar.Content title={title} color={theme.colors.surface} />
    </Appbar.Header>
  );
}

export default function App() {
  const isAuthenticated = useProtectedRoute("/singIn");
  const { user } = useAuth();
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [logueado, setLogueado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const drawerProgress = useSharedValue(0);

  // Use useCallback to memoize the checkUserRole function
  const checkUserRole = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const userData = await user();
      setLogueado(userData);

      // Only redirect once
      if (userData && userData.role !== "employee" && !hasRedirected) {
        setHasRedirected(true);
        router.replace("/(admin)/Dashboard");
      }
    } catch (error) {
      console.log("Error obteniendo el rol:", error);
      setLogueado(false); // Set to false on error to avoid loading state
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, hasRedirected]);

  useEffect(() => {
    // Only check if we don't have user data yet or if authentication status changes
    if (isAuthenticated && logueado === null) {
      checkUserRole();
    }
  }, [isAuthenticated, checkUserRole, logueado]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      drawerProgress.value,
      [0, 1],
      [0, DRAWER_WIDTH]
    );
    const borderRadius = interpolate(drawerProgress.value, [0, 1], [0, 20]);
    const scale = interpolate(drawerProgress.value, [0, 1], [1, 0.8]);
    return {
      transform: [
        { translateX: withTiming(translateX, { duration: 300 }) },
        { scale: withTiming(scale, { duration: 300 }) },
      ],
      borderRadius: withTiming(borderRadius, { duration: 300 }),
      overflow: "hidden",
    };
  });

  if (!isAuthenticated) {
    return null;
  }

  // Render loading state if user data is still being fetched
  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Cargando...</Text>
      </View>
    );
  }

  // If we've tried to load the user but failed, show an error
  if (logueado === false) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Error al cargar los datos del usuario</Text>
        <Button
          mode="contained"
          onPress={checkUserRole}
          style={{ marginTop: 20 }}
        >
          Reintentar
        </Button>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Drawer.Navigator
          initialRouteName="DashboardE"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            drawerStyle: {
              backgroundColor: "transparent",
              width: DRAWER_WIDTH,
            },
            drawerType: "slide",
            overlayColor: "transparent",
            sceneContainerStyle: { backgroundColor: "transparent" },
            header: ({ navigation, route, options }) => (
              <CustomAppBar
                title={options.title}
                navigation={navigation}
                drawerProgress={drawerProgress}
              />
            ),
          }}
          drawerPosition="left"
          onStateChange={(state) => {
            if (state.history && state.history.length > 0) {
              const isOpen =
                state.history[state.history.length - 1].type === "drawer";
              setIsDrawerOpen(isOpen);
              drawerProgress.value = withTiming(isOpen ? 1 : 0, {
                duration: 300,
              });
            }
          }}
        >
          <Drawer.Screen
            name="DashboardE"
            options={{
              title: "Dashboard",
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="view-dashboard-outline"
                  size={24}
                  color={color}
                />
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
            name="CalendarE"
            options={{
              title:
                logueado?.cargo === "TeamLider" ? "Permisos" : "Mis Permisos",
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="calendar"
                  size={24}
                  color={color}
                />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Calendar {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="MyGroup"
            options={{
              title: "Mi Grupo De Trabajo",
              drawerIcon: ({ color }) => (
                <FontAwesome6 name="users-line" size={24} color={color} />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <MyGroup {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>
          {logueado?.cargo === "TeamLider" ||
          logueado?.cargo === "Deliniante" ? (
            <Drawer.Screen
              name="Proyect"
              options={{
                title: "Proyecto",
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="calendar"
                    size={24}
                    color={color}
                  />
                ),
              }}
            >
              {(props) => (
                <AnimatedScreen style={animatedStyle}>
                  <Proyect {...props} />
                </AnimatedScreen>
              )}
            </Drawer.Screen>
          ) : null}

          {logueado?.cargo === "DirectorTalento" ||
          logueado?.cargo === "Talento" ? (
            <>
              <Drawer.Screen
                name="Hiring"
                options={{
                  title: "Candidatos",
                  drawerIcon: ({ color }) => (
                    <FontAwesome5
                      name="user-graduate"
                      size={24}
                      color={color}
                    />
                  ),
                }}
              >
                {(props) => (
                  <AnimatedScreen style={animatedStyle}>
                    <Hiring {...props} />
                  </AnimatedScreen>
                )}
              </Drawer.Screen>

              <Drawer.Screen
                name="GeneratorRepor"
                options={{
                  title: "Generar Archivos",
                  drawerIcon: ({ color }) => (
                    <MaterialIcons name="inventory" size={24} color={color} />
                  ),
                }}
              >
                {(props) => (
                  <AnimatedScreen style={animatedStyle}>
                    <GeneratorReport {...props} />
                  </AnimatedScreen>
                )}
              </Drawer.Screen>
            </>
          ) : null}

          {logueado?.cargo === "DirectorContable" ||
          logueado?.cargo === "Contador" ? (
            <>
              <Drawer.Screen
                name="Inventario"
                options={{
                  title: "Inventario",
                  drawerIcon: ({ color }) => (
                    <MaterialIcons name="inventory" size={24} color={color} />
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
                name="AccountE"
                options={{
                  title: "Cuentas",
                  drawerIcon: ({ color }) => (
                    <MaterialIcons
                      name="account-balance"
                      size={24}
                      color={color}
                    />
                  ),
                }}
              >
                {(props) => (
                  <AnimatedScreen style={animatedStyle}>
                    <AccountE {...props} />
                  </AnimatedScreen>
                )}
              </Drawer.Screen>

              <Drawer.Screen
                name="MotionsE"
                options={{
                  title: "Movimientos",
                  drawerIcon: ({ color }) => (
                    <FontAwesome6
                      name="money-bill-transfer"
                      size={24}
                      color={color}
                    />
                  ),
                }}
              >
                {(props) => (
                  <AnimatedScreen style={animatedStyle}>
                    <MotionsE {...props} />
                  </AnimatedScreen>
                )}
              </Drawer.Screen>
            </>
          ) : null}



          {logueado?.cargo === "Directorsset" || logueado?.cargo === "Sset" ? (
            <>
            <Drawer.Screen
                name="Inventario"
                options={{
                  title: "Inventario",
                  drawerIcon: ({ color }) => (
                    <MaterialIcons name="inventory" size={24} color={color} />
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
                name="AssignmentPPE"
                options={{
                  title: "Proteccion Personal",
                  drawerIcon: ({ color }) => (
                    <AntDesign name="skin" size={24} color={color} />
                  ),
                }}
              >
                {(props) => (
                  <AnimatedScreen style={animatedStyle}>
                    <AssignmentPPE {...props} />
                  </AnimatedScreen>
                )}
              </Drawer.Screen>
            </>
          ):null}

          {logueado?.cargo === "Laboratorista" ? (
            <>
            <Drawer.Screen
                name="AssignmentPPE"
                options={{
                  title: "Proteccion Personal",
                  drawerIcon: ({ color }) => (
                    <AntDesign name="skin" size={24} color={color} />
                  ),
                }}
              >
                {(props) => (
                  <AnimatedScreen style={animatedStyle}>
                    <AssignmentPPE {...props} />
                  </AnimatedScreen>
                )}
              </Drawer.Screen>
            </>
          ) : null}






          <Drawer.Screen
            name="MyTickets"
            options={{
              title: "Mis Tickets",
              drawerIcon: ({ color }) => (
                <FontAwesome6 name="ticket" size={24} color={color} />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <MyTickets {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="MyAccount"
            options={{
              title: "Mi Cuenta",
              drawerIcon: ({ color }) => (
                <MaterialIcons name="account-box" size={24} color={color} />
              ),
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
  );
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
});
