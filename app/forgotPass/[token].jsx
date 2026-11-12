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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          entering={FadeInDown.duration(600).springify()}
          style={styles.iconHalo}
        >
          <MaterialCommunityIcons name="lock-reset" size={44} color="#00ACE8" />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(600).springify()}
          style={styles.formContainer}
        >
          <Text style={styles.title}>Restablecer Contraseña</Text>
          <Text style={styles.subtitle}>
            Crea una nueva contraseña segura para tu cuenta corporativa
          </Text>

          <View style={styles.inputWrapper}>
            <TextInput
              label="Nueva Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              mode="outlined"
              activeOutlineColor="#00ACE8"
              cursorColor="#00ACE8"
              style={styles.input}
              left={<TextInput.Icon icon="lock-outline" color="#00ACE8" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                  color="#64748B"
                />
              }
            />
            {password.length > 0 && password.length < 8 && (
              <Text style={styles.errorText}>Debe tener al menos 8 caracteres</Text>
            )}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              label="Confirmar Contraseña"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              mode="outlined"
              activeOutlineColor="#00ACE8"
              cursorColor="#00ACE8"
              style={styles.input}
              left={<TextInput.Icon icon="lock-check-outline" color="#00ACE8" />}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? "eye-off" : "eye"}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  color="#64748B"
                />
              }
            />
            {!passwordsMatch && confirmPassword !== "" && (
              <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
            )}
          </View>

          <Button
            mode="contained"
            buttonColor="#00ACE8"
            onPress={handleResetPassword}
            loading={isSubmitting}
            disabled={isSubmitting || !passwordsMatch || !isPasswordValid}
            style={styles.button}
            contentStyle={{ height: 48 }}
            labelStyle={{ fontSize: 15, fontWeight: "bold", color: "#FFFFFF" }}
          >
            Guardar Contraseña
          </Button>

          <View style={styles.securityBox}>
            <Text style={styles.securityInfo}>Requisitos de seguridad:</Text>
            <View style={styles.securityItem}>
              <MaterialCommunityIcons
                name={password.length >= 8 ? "check-circle" : "checkbox-blank-circle-outline"}
                size={16}
                color={password.length >= 8 ? "#10B981" : "#94A3B8"}
              />
              <Text style={[styles.securityText, password.length >= 8 && styles.securityMet]}>
                Al menos 8 caracteres
              </Text>
            </View>
            <View style={styles.securityItem}>
              <MaterialCommunityIcons
                name={/[A-Z]/.test(password) ? "check-circle" : "checkbox-blank-circle-outline"}
                size={16}
                color={/[A-Z]/.test(password) ? "#10B981" : "#94A3B8"}
              />
              <Text style={[styles.securityText, /[A-Z]/.test(password) && styles.securityMet]}>
                Una letra mayúscula
              </Text>
            </View>
            <View style={styles.securityItem}>
              <MaterialCommunityIcons
                name={/\d/.test(password) ? "check-circle" : "checkbox-blank-circle-outline"}
                size={16}
                color={/\d/.test(password) ? "#10B981" : "#94A3B8"}
              />
              <Text style={[styles.securityText, /\d/.test(password) && styles.securityMet]}>
                Al menos un número
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingVertical: 40,
  },
  iconHalo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    padding: 32,
    borderRadius: 24,
    width: "100%",
    maxWidth: 460,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 18,
  },
  inputWrapper: {
    marginBottom: 14,
  },
  input: {
    backgroundColor: "#F8FAFC",
    fontSize: 14,
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: "#00ACE8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  securityBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  securityInfo: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  securityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  securityText: {
    fontSize: 13,
    color: "#64748B",
  },
  securityMet: {
    color: "#10B981",
    fontWeight: "600",
  },
});

export default PasswordResetScreen;
