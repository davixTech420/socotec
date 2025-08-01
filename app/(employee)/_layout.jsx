import { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
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
  ActivityIndicator,
} from "react-native-paper";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome6,
  FontAwesome5,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { router } from "expo-router";
import { useProtectedRoute, useAuth } from "@/context/userContext";

// Import screens
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
import Apique from "./Apique";
import Users from "./Users";
import EmEnvironmental from "./EmEnvironmental";

const Drawer = createDrawerNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Constants
const DRAWER_WIDTH = Platform.select({
  web: SCREEN_WIDTH < 768 ? SCREEN_WIDTH * 0.5 : SCREEN_WIDTH * 0.2,
  default: SCREEN_WIDTH * 0.7,
});

const ANIMATION_DURATION = 300;

// Screen configuration based on user role
const getScreensConfig = (cargo) => {
  const baseScreens = [
    {
      name: "DashboardE",
      component: Dashboard,
      title: "Dashboard",
      icon: "view-dashboard-outline",
      iconFamily: MaterialCommunityIcons,
    },
   /*  {
      name: "CalendarE",
      component: Calendar,
      title: cargo === "TeamLider" ? "Permisos" : "Mis Permisos",
      icon: "calendar",
      iconFamily: MaterialCommunityIcons,
    },
    {
      name: "MyGroup",
      component: MyGroup,
      title: "Mi Grupo De Trabajo",
      icon: "users-line",
      iconFamily: FontAwesome6,
    },
    {
      name: "MyTickets",
      component: MyTickets,
      title: "Mis Tickets",
      icon: "ticket",
      iconFamily: FontAwesome6,
    },
    {
      name: "MyAccount",
      component: MyAccount,
      title: "Mi Cuenta",
      icon: "account-box",
      iconFamily: MaterialIcons,
    }, */
  ];

  const roleScreens = {
    TeamLider: [
      {
        name: "Proyect",
        component: Proyect,
        title: "Proyecto",
        icon: "calendar",
        iconFamily: MaterialCommunityIcons,
      },
    ],
    Deliniante: [
      {
        name: "Proyect",
        component: Proyect,
        title: "Proyecto",
        icon: "calendar",
        iconFamily: MaterialCommunityIcons,
      },
    ],
    DirectorTalento: [
      {
        name: "Users",
        component: Users,
        title: "Usuarios",
        icon: "account-multiple-outline",
        iconFamily: MaterialCommunityIcons,
      },
      {
        name: "Hiring",
        component: Hiring,
        title: "Candidatos",
        icon: "user-graduate",
        iconFamily: FontAwesome5,
      },
      {
        name: "GeneratorRepor",
        component: GeneratorReport,
        title: "Generar Archivos",
        icon: "filetext1",
        iconFamily: AntDesign,
      },
      {
        name: "Inventario",
        component: Inventario,
        title: "Inventario",
        icon: "inventory",
        iconFamily: MaterialIcons,
      },
    ],
    Talento: [
      {
        name: "Users",
        component: Users,
        title: "Usuarios",
        icon: "account-multiple-outline",
        iconFamily: MaterialCommunityIcons,
      },
      {
        name: "Hiring",
        component: Hiring,
        title: "Candidatos",
        icon: "user-graduate",
        iconFamily: FontAwesome5,
      },
      {
        name: "GeneratorRepor",
        component: GeneratorReport,
        title: "Generar Archivos",
        icon: "filetext1",
        iconFamily: AntDesign,
      },
      {
        name: "Inventario",
        component: Inventario,
        title: "Inventario",
        icon: "inventory",
        iconFamily: MaterialIcons,
      },
    ],
    DirectorContable: [
      {
        name: "Inventario",
        component: Inventario,
        title: "Inventario",
        icon: "inventory",
        iconFamily: MaterialIcons,
      },
      {
        name: "AccountE",
        component: AccountE,
        title: "Cuentas",
        icon: "account-balance",
        iconFamily: MaterialIcons,
      },
      {
        name: "MotionsE",
        component: MotionsE,
        title: "Movimientos",
        icon: "money-bill-transfer",
        iconFamily: FontAwesome6,
      },
    ],
    Contador: [
      {
        name: "Inventario",
        component: Inventario,
        title: "Inventario",
        icon: "inventory",
        iconFamily: MaterialIcons,
      },
      {
        name: "AccountE",
        component: AccountE,
        title: "Cuentas",
        icon: "account-balance",
        iconFamily: MaterialIcons,
      },
      {
        name: "MotionsE",
        component: MotionsE,
        title: "Movimientos",
        icon: "money-bill-transfer",
        iconFamily: FontAwesome6,
      },
    ],
    Directorsset: [
      {
        name: "Inventario",
        component: Inventario,
        title: "Inventario",
        icon: "inventory",
        iconFamily: MaterialIcons,
      },
      {
        name: "AssignmentPPE",
        component: AssignmentPPE,
        title: "Proteccion Personal",
        icon: "skin",
        iconFamily: AntDesign,
      },
    ],
    Sset: [
      {
        name: "Inventario",
        component: Inventario,
        title: "Inventario",
        icon: "inventory",
        iconFamily: MaterialIcons,
      },
      {
        name: "AssignmentPPE",
        component: AssignmentPPE,
        title: "Proteccion Personal",
        icon: "skin",
        iconFamily: AntDesign,
      },
    ],
    Laboratorista: [
     /*  {
        name: "AssignmentPPE",
        component: AssignmentPPE,
        title: "Proteccion Personal",
        icon: "skin",
        iconFamily: AntDesign,
      },
      {
        name: "Apique",
        component: Apique,
        title: "Apique",
        icon: "files-o",
        iconFamily: FontAwesome,
      }, */
      {
        name: "EmEnvironmental",
        component: EmEnvironmental,
        title: "Condiciones Ambientales",
        icon: "files-o",
        iconFamily: FontAwesome,
      },
    ],
  };

  return [...baseScreens, ...(roleScreens[cargo] || [])];
};

// Optimized AnimatedScreen component
const AnimatedScreen = ({ children, style }) => (
  <Animated.View style={[styles.screen, style]}>
    <ScrollView
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      removeClippedSubviews={Platform.OS === "android"}
      maxToRenderPerBatch={10}
      windowSize={10}
    >
      {children}
    </ScrollView>
  </Animated.View>
);

// Optimized CustomDrawerContent
const CustomDrawerContent = ({ state, descriptors, navigation }) => {
  const { logout, user } = useAuth();
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (loading || userData) return;

    try {
      setLoading(true);
      const data = await user();
      setUserData(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los datos del usuario");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, loading, userData]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const renderDrawerItem = useCallback(
    (route, index) => {
      const { title, drawerIcon } = descriptors[route.key].options;
      const isFocused = state.index === index;

      return (
        <Button
          key={route.key}
          icon={({ size, color }) =>
            drawerIcon({ color: isFocused ? color : "black", size })
          }
          mode={isFocused ? "contained" : "text"}
          onPress={() => navigation.navigate(route.name)}
          style={[
            styles.drawerItem,
            { backgroundColor: isFocused ? "#00ACE8" : "transparent" },
          ]}
          labelStyle={[
            styles.drawerItemLabel,
            { color: isFocused ? "white" : "black" },
          ]}
        >
          {title}
        </Button>
      );
    },
    [state.index, descriptors, navigation]
  );

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
        {loading && (
          <ActivityIndicator size="small" style={{ marginTop: 10 }} />
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.drawerSection}>
          {state.routes.map(renderDrawerItem)}
        </View>
      </ScrollView>

      <Button
        icon={({ size }) => (
          <MaterialCommunityIcons name="logout" size={size} color="#ff0000" />
        )}
        textColor="#ff0000"
        mode="outlined"
        onPress={logout}
        style={styles.logoutButton}
      >
        Cerrar Sesión
      </Button>
    </SafeAreaView>
  );
};

// Optimized CustomAppBar
const CustomAppBar = ({ title, navigation, drawerProgress }) => {
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          rotate: `${interpolate(
            drawerProgress.value,
            [0, 1],
            [0, 180],
            Extrapolate.CLAMP
          )}deg`,
        },
      ],
    }),
    []
  );
  return (
    <Appbar.Header style={{ backgroundColor: "#00ACE8" }}>
      <Animated.View style={animatedStyle}>
        <IconButton
          icon="menu"
          iconColor={theme.colors.surface}
          size={24}
          onPress={navigation.toggleDrawer}
        />
      </Animated.View>
      <Appbar.Content
        title={title}
        titleStyle={{ color: theme.colors.surface }}
      />
    </Appbar.Header>
  );
};

// Main App Component
export default function App() {
  const isAuthenticated = useProtectedRoute("/singIn");
  const { user } = useAuth();
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const drawerProgress = useSharedValue(0);

  // Memoized screen configuration
  const screensConfig = useMemo(() => {
    return userData?.cargo ? getScreensConfig(userData.cargo) : [];
  }, [userData?.cargo]);

  // Optimized user role check
  const checkUserRole = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await user();
      setUserData(data);

      if (data?.role !== "employee") {
        router.replace("/(admin)/Dashboard");
      }
    } catch (err) {
      setError("Error al cargar los datos del usuario");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && !userData) {
      checkUserRole();
    }
  }, [isAuthenticated, checkUserRole, userData]);

  // Memoized animated style
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
        {
          translateX: withTiming(translateX, { duration: ANIMATION_DURATION }),
        },
        { scale: withTiming(scale, { duration: ANIMATION_DURATION }) },
      ],
      borderRadius: withTiming(borderRadius, { duration: ANIMATION_DURATION }),
      overflow: "hidden",
    };
  }, []);

  // Handle drawer state change
  const handleDrawerStateChange = useCallback(
    (state) => {
      if (state?.history?.length > 0) {
        const isOpen =
          state.history[state.history.length - 1].type === "drawer";
        drawerProgress.value = withTiming(isOpen ? 1 : 0, {
          duration: ANIMATION_DURATION,
        });
      }
    },
    [drawerProgress]
  );

  // Render loading state
  if (!isAuthenticated || isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#00ACE8" />
        <Text style={{ marginTop: 16 }}>Cargando...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={{ marginBottom: 16, textAlign: "center" }}>{error}</Text>
        <Button mode="contained" onPress={checkUserRole}>
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
          onStateChange={handleDrawerStateChange}
        >
          {screensConfig.map(
            ({
              name,
              component: Component,
              title,
              icon,
              iconFamily: IconComponent,
            }) => (
              <Drawer.Screen
                key={name}
                name={name}
                options={{
                  title,
                  drawerIcon: ({ color, size }) => (
                    <IconComponent name={icon} size={size} color={color} />
                  ),
                }}
              >
                {(props) => (
                  <>
                    <Component {...props} />
                  </>
                )}
              </Drawer.Screen>
            )
          )}
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
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
    marginHorizontal: 8,
    marginVertical: 4,
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
  screenContent: {
    flexGrow: 1,
    minHeight: Platform.OS === "web" ? "100%" : "auto",
    paddingBottom: 20,
  },
});
