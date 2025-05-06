import { useState, useEffect } from "react";
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
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import Dashboard from "./Dashboard";
import Inventario from "./inventario";
import Proyects from "./Proyects";
import Users from "./users";
import Employee from "./Employee";
import Model3D from "./Model3D";
import CalendarComponent from "./Calendar";
import Group from "./Groups";
import Account from "./Account";
import Motions from "./Motions";
import Portfolio from "./Portfolio";
import Task from "./Task";
import Ticket from "./Ticket";
import Hirings from "./Hirings";
import Assignment from "./Assignment";
import { useProtectedRoute, useAuth } from "@/context/userContext";
import ProfileScreen from "./MyAccount";
import { router } from "expo-router";

const Drawer = createDrawerNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const isMobileWeb = () => {
  if (Platform.OS === "web") {
    return SCREEN_WIDTH < 768;
  }
  return false;
};

// Lógica combinada
const DRAWER_WIDTH =
  Platform.OS === "web"
    ? isMobileWeb()
      ? SCREEN_WIDTH * 0.5
      : SCREEN_WIDTH * 0.2
    : SCREEN_WIDTH * 0.7;
function AnimatedScreen({ children, style, staticButton }) {
  return (
    <Animated.View style={[styles.screen, style]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.screenContent}
      >
        {children}
      </ScrollView>
      {staticButton && (
        <View style={styles.staticButtonContainer}>{staticButton}</View>
      )}
    </Animated.View>
  );
}
function CustomDrawerContent(props) {
  const { logout, user } = useAuth();
  const theme = useTheme();

  //obtener el usuario logueado
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    user()
      .then(setUserData)
      .catch((error) => console.log("Error user data:", error));
  }, []);
  /** */

  //cerrar la sesion en el contexto general
  const handleSignOut = () => {
    logout();
  };
  return (
    <SafeAreaView
      style={[styles.drawerContent, { backgroundColor: theme.colors.surface }]}
    >
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
      <ScrollView>
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
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const drawerProgress = useSharedValue(0);

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

  user()
    .then((userData) => {
      if (userData.role != "admin") {
        router.replace("/(employee)/DashboardE");
      }
    })
    .catch((error) => {
      console.log("Error obteniendo el rol:", error);
    });

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Drawer.Navigator
          initialRouteName="Dashboard"
          drawerContent={(props) => (
            <CustomDrawerContent {...props} user={user} />
          )}
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
            const isOpen =
              state.history[state.history.length - 1].type === "drawer";
            setIsDrawerOpen(isOpen);
            drawerProgress.value = withTiming(isOpen ? 1 : 0, {
              duration: 300,
            });
          }}
        >
          <Drawer.Screen
            name="Dashboard"
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
              <AnimatedScreen style={animatedStyle}>
                <Dashboard {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="users"
            options={{
              title: "Usuarios",
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="account-multiple-outline"
                  size={24}
                  color={color}
                />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Users {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Employee"
            options={{
              title: "Empleados",
              drawerIcon: ({ color }) => (
                <FontAwesome5 name="user-tie" size={24} color={color} />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Employee {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Hirings"
            options={{
              title: "Candidatos",
              drawerIcon: ({ color }) => (
                <FontAwesome5 name="user-graduate" size={24} color={color} />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Hirings {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Groups"
            options={{
              title: "Grupos de trabajo",
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="account-group-outline"
                  size={24}
                  color={color}
                />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Group {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Assignment"
            options={{
              title: "Proteccion Personal",
              drawerIcon: ({ color }) => (
                <AntDesign name="skin" size={24} color={color} />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Assignment {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Task"
            options={{
              title: "Tareas",
              drawerIcon: ({ color }) => (
                <MaterialIcons name="task" size={24} color={color} />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Task {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Ticket"
            options={{
              title: "Tickets",
              drawerIcon: ({ color }) => (
                <FontAwesome5 name="ticket-alt" size={24} color={color} />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Ticket {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="inventario"
            options={{
              title: "Inventario",
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="clipboard-list-outline"
                  size={24}
                  color={color}
                />
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
              drawerIcon: ({ color }) => (
                <MaterialIcons name="construction" size={24} color={color} />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Proyects {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Portfolio"
            options={{
              title: "Portafolio",
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="briefcase"
                  size={24}
                  color={color}
                />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Portfolio {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Account"
            options={{
              title: "Cuentas finanzas",
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="finance"
                  size={24}
                  color={color}
                />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Account {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>
          <Drawer.Screen
            name="Motions"
            options={{
              title: "Movimientos finanzas",
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="bank-transfer"
                  size={24}
                  color={color}
                />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Motions {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Calendar"
            options={{
              title: "Calendario",
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
                <CalendarComponent {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="report"
            options={{
              title: "Reportes",
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="file-document"
                  size={24}
                  color={color}
                />
              ),
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
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="printer-3d"
                  size={24}
                  color={color}
                />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <Model3D {...props} />
              </AnimatedScreen>
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="MyAccount"
            options={{
              title: "Mi Cuenta",
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="account-box"
                  size={24}
                  color={color}
                />
              ),
            }}
          >
            {(props) => (
              <AnimatedScreen style={animatedStyle}>
                <ProfileScreen {...props} />
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
    height: Platform.OS === "web" ? "100vh" : "100%",
    overflow: Platform.OS === "web" ? "hidden" : "visible",
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
    height: Platform.OS === "web" ? "100vh" : "100%",
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
    height: Platform.OS === "web" ? "100vh" : "100%",
  },
  screenContent: {
    flexGrow: 1,
    minHeight: Platform.OS === "web" ? "100%" : "auto",
  },
  staticButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 30,
  },
});
