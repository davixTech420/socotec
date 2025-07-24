import React, { useState, useEffect, useCallback, useMemo } from "react";
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

// Importar todos los componentes de pantalla
import Dashboard from "./Dashboard";
import Inventario from "./inventario";
import Proyects from "./Proyects";
import Users from "./users";
import Employee from "./Employee";
import CalendarComponent from "./Calendar";
import Group from "./Groups";
import Account from "./Account";
import Motions from "./Motions";
import Portfolio from "./Portfolio";
import Task from "./Task";
import Ticket from "./Ticket";
import Hirings from "./Hirings";
import Assignment from "./Assignment";
import Apiques from "./Apiques";
import ProfileScreen from "./MyAccount";
import Environmental from "./Environmental";

const Drawer = createDrawerNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Memoizar la función de detección de móvil
const isMobileWeb = () => {
  if (Platform.OS === "web") {
    return SCREEN_WIDTH < 768;
  }
  return false;
};

// Calcular el ancho del drawer una sola vez
const DRAWER_WIDTH =
  Platform.OS === "web"
    ? isMobileWeb()
      ? SCREEN_WIDTH * 0.5
      : SCREEN_WIDTH * 0.2
    : SCREEN_WIDTH * 0.7;

// Configuración de rutas del drawer
const DRAWER_SCREENS = [
  {
    name: "Dashboard",
    title: "Dashboard",
    component: Dashboard,
    icon: "view-dashboard-outline",
    iconFamily: "MaterialCommunityIcons",
    useAnimatedScreen: true,
  },
  {
    name: "users",
    title: "Usuarios",
    component: Users,
    icon: "account-multiple-outline",
    iconFamily: "MaterialCommunityIcons",
    useAnimatedScreen: false,
  },
  {
    name: "Employee",
    title: "Empleados",
    component: Employee,
    icon: "user-tie",
    iconFamily: "FontAwesome5",
    useAnimatedScreen: false,
  },
  {
    name: "Hirings",
    title: "Candidatos",
    component: Hirings,
    icon: "user-graduate",
    iconFamily: "FontAwesome5",
    useAnimatedScreen: false, // Sin AnimatedScreen para evitar conflictos de scroll
  },
  {
    name: "Groups",
    title: "Grupos de trabajo",
    component: Group,
    icon: "account-group-outline",
    iconFamily: "MaterialCommunityIcons",
    useAnimatedScreen: false,
  },
  {
    name: "Assignment",
    title: "Protección Personal",
    component: Assignment,
    icon: "skin",
    iconFamily: "AntDesign",
    useAnimatedScreen: false,
  },
  {
    name: "Task",
    title: "Tareas",
    component: Task,
    icon: "task",
    iconFamily: "MaterialIcons",
    useAnimatedScreen: false,
  },
  {
    name: "Ticket",
    title: "Tickets",
    component: Ticket,
    icon: "ticket-alt",
    iconFamily: "FontAwesome5",
    useAnimatedScreen: false,
  },
  {
    name: "inventario",
    title: "Inventario",
    component: Inventario,
    icon: "clipboard-list-outline",
    iconFamily: "MaterialCommunityIcons",
    useAnimatedScreen: false,
  },
  {
    name: "Proyects",
    title: "Proyectos",
    component: Proyects,
    icon: "construction",
    iconFamily: "MaterialIcons",
    useAnimatedScreen: false,
  },
  {
    name: "Portfolio",
    title: "Portafolio",
    component: Portfolio,
    icon: "briefcase",
    iconFamily: "MaterialCommunityIcons",
    useAnimatedScreen: false, // Sin AnimatedScreen para evitar conflictos
  },
  {
    name: "Account",
    title: "Cuentas finanzas",
    component: Account,
    icon: "finance",
    iconFamily: "MaterialCommunityIcons",
    useAnimatedScreen: false,
  },
  {
    name: "Motions",
    title: "Movimientos finanzas",
    component: Motions,
    icon: "bank-transfer",
    iconFamily: "MaterialCommunityIcons",
    useAnimatedScreen: false,
  },
  {
    name: "Apiques",
    title: "Apique",
    component: Apiques,
    icon: "files-o",
    iconFamily: "FontAwesome",
    useAnimatedScreen: false, // Sin AnimatedScreen para evitar conflictos
  },
  {
    name: "Environmental",
    title: "Environmental",
    component: Environmental,
    icon: "files-o",
    iconFamily: "FontAwesome",
    useAnimatedScreen: false, // Sin AnimatedScreen para evitar conflictos
  },
  {
    name: "Calendar",
    title: "Calendario",
    component: CalendarComponent,
    icon: "calendar",
    iconFamily: "MaterialCommunityIcons",
    useAnimatedScreen: false,
  },
  {
    name: "MyAccount",
    title: "Mi Cuenta",
    component: ProfileScreen,
    icon: "account-box",
    iconFamily: "MaterialCommunityIcons",
    useAnimatedScreen: true,
  },
];

// Función para renderizar iconos
const renderIcon = (iconFamily, iconName, color, size = 24) => {
  const IconComponent = {
    MaterialCommunityIcons,
    MaterialIcons,
    FontAwesome5,
    AntDesign,
    FontAwesome,
  }[iconFamily];

  return <IconComponent name={iconName} size={size} color={color} />;
};

// Componente AnimatedScreen optimizado
const AnimatedScreen = React.memo(({ children, style, staticButton }) => {
  return (
    <Animated.View style={[styles.screen, style]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {children}
      </ScrollView>
      {staticButton && (
        <View style={styles.staticButtonContainer}>{staticButton}</View>
      )}
    </Animated.View>
  );
});

// Componente CustomDrawerContent optimizado
const CustomDrawerContent = React.memo((props) => {
  const { logout, user } = useAuth();
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Optimizar la carga de datos del usuario
  useEffect(() => {
    let isMounted = true;

    const loadUserData = async () => {
      try {
        const data = await user();
        if (isMounted) {
          setUserData(data);
        }
      } catch (error) {
        router.replace("/singIn");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSignOut = useCallback(() => {
    logout();
  }, [logout]);

  const drawerItems = useMemo(() => {
    return props.state.routes.map((route, index) => {
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
    });
  }, [props.state, props.descriptors, props.navigation]);

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
          {loading ? "Cargando..." : userData?.nombre || "Usuario"}
        </Text>
        <Text style={[styles.caption, { color: theme.colors.secondary }]}>
          {loading ? "" : userData?.email || "usuario@socotec.com"}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.drawerSection}>{drawerItems}</View>
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
});

// Componente CustomAppBar optimizado
const CustomAppBar = React.memo(({ title, navigation, drawerProgress }) => {
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
  }, []);

  const handleToggleDrawer = useCallback(() => {
    navigation.toggleDrawer();
  }, [navigation]);

  return (
    <Appbar.Header style={{ backgroundColor: "#00ACE8" }}>
      <Animated.View style={animatedStyle}>
        <IconButton
          icon="menu"
          iconColor={theme.colors.surface}
          size={24}
          onPress={handleToggleDrawer}
        />
      </Animated.View>
      <Appbar.Content
        title={title}
        titleStyle={{ color: theme.colors.surface }}
      />
    </Appbar.Header>
  );
});

// Componente principal optimizado
export default function AdminLayout() {
  const isAuthenticated = useProtectedRoute("/singIn");
  const { user } = useAuth();
  const theme = useTheme();
  const [userRole, setUserRole] = useState(null);
  const drawerProgress = useSharedValue(0);

  // Verificar rol del usuario una sola vez
  useEffect(() => {
    let isMounted = true;

    const checkUserRole = async () => {
      try {
        const userData = await user();
        if (isMounted) {
          setUserRole(userData.role);
          if (userData.role !== "admin") {
            router.replace("/(employee)/DashboardE");
          }
        }
      } catch (error) {
        router.replace("/singIn");
      }
    };

    if (isAuthenticated) {
      checkUserRole();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user]);

  // Memoizar el estilo animado
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
  }, []);

  // Callback para cambios de estado del drawer
  const handleDrawerStateChange = useCallback(
    (state) => {
      const isOpen = state.history[state.history.length - 1].type === "drawer";
      drawerProgress.value = withTiming(isOpen ? 1 : 0, { duration: 300 });
    },
    [drawerProgress]
  );

  // Renderizar pantallas del drawer
  const renderDrawerScreens = useMemo(() => {
    return DRAWER_SCREENS.map((screen) => (
      <Drawer.Screen
        key={screen.name}
        name={screen.name}
        options={{
          title: screen.title,
          drawerIcon: ({ color }) =>
            renderIcon(screen.iconFamily, screen.icon, color),
        }}
      >
        {(props) => {
          const ScreenComponent = screen.component;

          if (screen.useAnimatedScreen) {
            return (
              <AnimatedScreen style={animatedStyle}>
                <ScreenComponent {...props} />
              </AnimatedScreen>
            );
          }

          // Para pantallas sin AnimatedScreen (evita conflictos de scroll)
          return <ScreenComponent {...props} />;
        }}
      </Drawer.Screen>
    ));
  }, [animatedStyle]);

  if (!isAuthenticated || userRole === null) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Drawer.Navigator
          initialRouteName="Dashboard"
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
          onStateChange={handleDrawerStateChange}
        >
          {renderDrawerScreens}
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
    paddingBottom: 20,
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
    paddingBottom: 20, // Espacio adicional para evitar que el contenido se corte
  },
  staticButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
});
