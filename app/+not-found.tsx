import React from 'react';
import { StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Button, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function NotFoundScreen() {
  const theme = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Página no encontrada', headerShown: false }} />
      <Animated.View 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
       
      >
        <MaterialCommunityIcons 
          name="alert-circle-outline" 
          size={100} 
          color={theme.colors.error} 
        />
        <Text style={[styles.title, { color: theme.colors.error }]} variant="headlineMedium">
          Oops!
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onBackground }]} variant="titleMedium">
          Esta página no existe
        </Text>
        <Link href="/" asChild>
          <Button 
            mode="contained" 
            style={styles.button}
            icon="home"
          >
            Volver al inicio
          </Button>
        </Link>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
});