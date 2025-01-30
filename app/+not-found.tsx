import { useEffect, useCallback } from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import { Link, Stack } from "expo-router"
import { Button, Text, useTheme } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  FadeIn,
} from "react-native-reanimated"

const { width, height } = Dimensions.get("window")

export default function NotFoundScreen() {
  const theme = useTheme()
  const rotation = useSharedValue(0)
  const scale = useSharedValue(1)

  const animate = useCallback(() => {
    rotation.value = withRepeat(withSequence(withSpring(10), withSpring(-10), withSpring(0)), -1, true)

    scale.value = withRepeat(withSequence(withSpring(1.1), withSpring(0.9), withSpring(1)), -1, true)
  }, [])

  useEffect(() => {
    animate()
  }, [animate])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
    }
  })

  return (
    <>
      <Stack.Screen options={{ title: "Página no encontrada", headerShown: false }} />
      <Animated.View
        entering={FadeIn.duration(1000)}
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Animated.View style={[styles.logoContainer, animatedStyle]}>
          <MaterialCommunityIcons name="robot" size={120} color={theme.colors.primary} />
        </Animated.View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.primary }]} variant="displaySmall">
            404
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.onBackground }]} variant="headlineSmall">
            Página no encontrada
          </Text>
          <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]} variant="bodyLarge">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </Text>
        </View>
        <Link href="/" asChild>
          <Button mode="contained" style={styles.button} icon="home" contentStyle={styles.buttonContent}>
            Volver al inicio
          </Button>
        </Link>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    marginBottom: 40,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    maxWidth: width * 0.8,
  },
  button: {
    marginTop: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  buttonContent: {
    height: 50,
  },
})

