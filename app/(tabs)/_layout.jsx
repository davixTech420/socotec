import { useState, useEffect } from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/context/userContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Obtener el rol del usuario
  useEffect(() => {
    if (isAuthenticated) {
      user()
        .then((userData) => {
          setRole(userData.role);
        })
        .catch((error) => {
          console.log("Error obteniendo el rol:", error);
        });
    } else {
      // Si no está autenticado, limpiar el rol
      setRole(null);
    }
  }, [isAuthenticated, user]);

  const getDashboardOrLoginHref = () => {
    if (!isAuthenticated) return undefined;

    // Si está autenticado, devolver la ruta según el rol
    if (role === "admin") {
      return "/(admin)/Dashboard";
    } else if (role === "employee") {
      return "/(employee)/DashboardE";
    }
    return undefined;
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "rgba(255, 255, 255, 0.7)",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            position: "absolute",
            borderRadius: 24,
            height: 60,
            paddingBottom: Platform.OS === "ios" ? 16 : 6,
            paddingTop: 6,
            backgroundColor: "#00ACE8",
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 12,
            ...Platform.select({
              web: {
                top: 15,
                bottom: "auto",
                left: "10%",
                right: "10%",
                maxWidth: 800,
                alignSelf: "center",
              },
              ios: {
                bottom: Math.max(insets.bottom, 20) + 4,
                left: 20,
                right: 20,
              },
              android: {
                bottom: Math.max(insets.bottom, 16) + 12,
                left: 16,
                right: 16,
              },
              default: {
                bottom: Math.max(insets.bottom, 16) + 8,
                left: 20,
                right: 20,
              },
            }),
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Portafolio"
          options={{
            title: "Portafolio",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="briefcase"
                size={28}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="singIn"
          options={{
            href: getDashboardOrLoginHref(),
            title: isAuthenticated ? "Dashboard" : "Login",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name={isAuthenticated ? "view-dashboard" : "login"}
                size={28}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="singUp"
          options={{
            href: isAuthenticated ? null : undefined,
            title: "Registro",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-plus" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
