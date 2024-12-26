import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
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
          backgroundColor: "#00bcf3",
          ...Platform.select({
            web: {
              top: 15,
              position: "absolute",
            },
            android: {
              bottom: 0,
              position: "absolute",
            },
            default: {
              
            },
          }),
        }
      }}>
      <Tabs.Screen
        name="indexAdmin"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
     
    </Tabs>
  );
}