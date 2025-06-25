import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  HelperText,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { changePassword } from "@/services/publicServices";

const PasswordResetScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();
  //este linea recibe el token que se asigna a la url
  const { token } = useLocalSearchParams();
  //validamos si el otken es valido y si existe
  useEffect(() => {
    if (!token) {
      router.replace("/");
      return;
    }
    try {
      const decodedToken = jwtDecode(token);
      if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
        router.navigate("/");
      }
    } catch (error) {
      router.navigate("/");
    }
  }, [token, router]);

  const handleResetPassword = async () => {
    setIsSubmitting(true);
    await changePassword({ password, token })
      .then((response) => {
        response == true ? router.navigate("/singIn") : setIsSubmitting(false);
      })
      .catch((error) => {
        setIsSubmitting(false);
        throw error;
      });
    // Aquí iría la lógica para cambiar la contraseña
    setTimeout(() => {
      setIsSubmitting(false);
      // Mostrar mensaje de éxito o error
    }, 1000);
  };

  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = password.length >= 8;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          entering={FadeInDown.duration(1000).springify()}
          style={styles.iconContainer}
        >
          <MaterialCommunityIcons name="lock-reset" size={80} color="#00ACE8" />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(1000).springify()}
          style={styles.formContainer}
        >
          <Text style={styles.title}>Restablecer Contraseña</Text>
          <Text style={styles.subtitle}>
            Crea una nueva contraseña segura para tu cuenta
          </Text>

          <TextInput
            label="Nueva Contraseña"
            underlineColor="#00ACE8"
            outlineColor="#00ACE8"
            cursorColor="#00ACE8"
            activeUnderlineColor="#00ACE8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            mode="underlined"
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
                color="#00ACE8"
              />
            }
            style={styles.input}
          />
          <HelperText type="info" visible={true}>
            La contraseña debe tener al menos 8 caracteres
          </HelperText>

          <TextInput
            label="Confirmar Nueva Contraseña"
            underlineColor="#00ACE8"
            outlineColor="#00ACE8"
            cursorColor="#00ACE8"
            activeUnderlineColor="#00ACE8"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            mode="underlined"
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                color="#00ACE8"
              />
            }
            style={styles.input}
          />
          <HelperText
            type="error"
            visible={!passwordsMatch && confirmPassword !== ""}
          >
            Las contraseñas no coinciden
          </HelperText>

          <Button
            mode="contained"
            buttonColor="#00ACE8"
            onPress={handleResetPassword}
            loading={isSubmitting}
            disabled={isSubmitting || !passwordsMatch || !isPasswordValid}
            style={styles.button}
          >
            Cambiar Contraseña
          </Button>

          <Text style={styles.securityInfo}>
            Para mayor seguridad, tu contraseña debe incluir:
          </Text>
          <View style={styles.securityList}>
            <Text style={styles.securityItem}>• Al menos 8 caracteres</Text>
            <Text style={styles.securityItem}>• Una letra mayúscula</Text>
            <Text style={styles.securityItem}>• Una letra minúscula</Text>
            <Text style={styles.securityItem}>• Un número</Text>
            <Text style={styles.securityItem}>• Un carácter especial</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  },
  securityInfo: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  securityList: {
    marginLeft: 10,
  },
  securityItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
});

export default PasswordResetScreen;
