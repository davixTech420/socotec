import { Tabs ,Stack} from 'expo-router';
import React from 'react';
import { Image,Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
export default function TabLayout() {
  const colorScheme = useColorScheme();
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
              marginInline:15,
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
        name="singIn"
        options={{
          title:'Login',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={28} color={color} />,
        }}
      />
       {/* <Tabs.Screen
        name="singIn"
        options={{    
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
          title:'singIn',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      /> */}
       <Stack.Screen name="singUp" options={{ headerShown: false }} />
    </Tabs>
    </>
  );
}
