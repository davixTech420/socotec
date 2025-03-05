import { useState} from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/userContext';
import {router}  from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [role,setRole] = useState(null);

  const { isAuthenticated,user } = useAuth();
   user()
          .then((userData) => {
            setRole(userData.role);
          })
          .catch((error) => {
            console.log('Error obteniendo el rol:', error);
          });



          const getHref = () => {
            if (isAuthenticated) {
              return role === "admin" ? router.navigate("/(admin)/Dashboard") : role === "employee" ? router.navigate("/(employee)/DashboardE") : router.navigate("/(tabs)/singUp");
            }
            return "/(tabs)/singUp";
          };
          

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "white",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            borderRadius: 20,
            left: 35,
            right: 35,
            backgroundColor: "#00ACE8",
            ...Platform.select({
              web: {
                top: 15,
                position: "absolute",
              },
              android: {
                bottom: 10,
                position: "absolute",
                marginInline: 15,
              },
              default: {

              },
            }),
          }
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="Portafolio"
          options={{
            title: "Portafolio",
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="briefcase" size={28} color={color} />,

          }}
        />
        <Tabs.Screen
          name="singIn"
          options={{
            href: getHref() /* isAuthenticated && role === "admin" ? "/(admin)/Dashboard" : role === "employee" ? "/(employee)/DashboardE" : "/(tabs)/singUp", */,
            title: isAuthenticated ? 'Dashboard' : 'Login',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name={isAuthenticated ? "view-dashboard" : "account"} size={28} color={color} />,

          }}
        />
        <Tabs.Screen
          name="singUp"
          options={{
            href: null,
            title: 'Registrar',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={28} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
