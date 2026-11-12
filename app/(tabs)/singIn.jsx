import React, { useState } from "react";
import {
  View,
  Image,
  useWindowDimensions,
  ScrollView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { forgotPassword, useLogin } from "@/services/publicServices";
import { AlertaIcono, AlertaScroll } from "../../components/alerta";

const SignInScreen = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const loginUser = useLogin();

  const [visiblePass, setVisiblePass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Estados de errores
  const [errors, setErrors] = useState({});
  const [messageError, setMessageError] = useState("");

  // Modales y alertas
  const [isOpenForgot, setIsOpenForgot] = useState(false);
  const [isOpenError, setIsOpenError] = useState(false);
  const [isOpenSuccess, setIsOpenSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/^[a-zA-Z0-9._%+-]+@socotec\.com$/i.test(email.trim())) {
      newErrors.email = "Ingresa un correo válido (@socotec.com)";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await loginUser({ email: email.trim(), password });
      if (response?.success) {
        setSuccessMessage("¡Inicio de sesión exitoso!");
        setIsOpenSuccess(true);
      } else {
        setMessageError(response?.message || "Credenciales incorrectas");
        setIsOpenError(true);
      }
    } catch (error) {
      setMessageError(error?.response?.data?.message || error?.message || "Error al conectar con el servidor");
      setIsOpenError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForgotPassword = async () => {
    if (!email.trim() || !/^[a-zA-Z0-9._%+-]+@socotec\.com$/i.test(email.trim())) {
      setErrors((prev) => ({ ...prev, forgotEmail: "Ingresa un correo @socotec.com válido" }));
      return;
    }

    setIsForgotLoading(true);
    try {
      const response = await forgotPassword({ email: email.trim() });
      setIsOpenForgot(false);
      setSuccessMessage("Se ha enviado un correo para restablecer tu contraseña");
      setIsOpenSuccess(true);
    } catch (error) {
      setMessageError(error?.response?.data?.message || error?.message || "No se pudo enviar el correo de recuperación");
      setIsOpenError(true);
    } finally {
      setIsForgotLoading(false);
    }
  };

  const renderLeftSide = () => (
    <Animated.View entering={FadeIn.duration(800)} style={styles.leftSide}>
      <View style={styles.brandBadge}>
        <Image
          source={require("@/assets/images/favicon.png")}
          style={styles.brandBadgeLogo}
          resizeMode="contain"
        />
        <Text style={styles.brandBadgeText}>SOCOTEC COLOMBIA</Text>
      </View>

      <Text style={styles.leftTitle}>Plataforma Integral de Gestión y Control</Text>
      <Text style={styles.leftSubtitle}>
        Soluciones avanzadas en Ensayos, Inspección y Certificación técnica para proyectos de alta precisión.
      </Text>

      <View style={styles.featuresList}>
        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Ionicons name="checkmark-sharp" size={16} color="#00ACE8" />
          </View>
          <Text style={styles.featureText}>Gestión de informes y reportes técnicos</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Ionicons name="checkmark-sharp" size={16} color="#00ACE8" />
          </View>
          <Text style={styles.featureText}>Control de inventario, equipos y movimientos</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Ionicons name="checkmark-sharp" size={16} color="#00ACE8" />
          </View>
          <Text style={styles.featureText}>Trazabilidad y seguridad operativa garantizada</Text>
        </View>
      </View>

      <View style={styles.leftFooter}>
        <Text style={styles.leftFooterText}>¿Aún no tienes cuenta institucional?</Text>
        <Button
          mode="outlined"
          style={styles.createAccountBtnLeft}
          labelStyle={styles.createAccountBtnLeftText}
          icon="account-plus-outline"
          onPress={() => router.push("/(tabs)/singUp")}
        >
          Crear Nueva Cuenta
        </Button>
      </View>
    </Animated.View>
  );

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInUp.duration(600).springify()}
          style={[styles.card, isMobile && styles.cardMobile]}
        >
          {!isMobile && renderLeftSide()}

          <View style={styles.rightSide}>
            <View style={styles.rightContent}>
              {/* Header móvil con logo */}
              <View style={styles.headerContainer}>
                <View style={styles.logoHalo}>
                  <Image
                    style={styles.logo}
                    source={require("@/assets/images/favicon.png")}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.welcomeTitle}>Iniciar Sesión</Text>
                <Text style={styles.welcomeSubtitle}>
                  Ingresa tus credenciales corporativas para continuar
                </Text>
              </View>

              {/* Formulario */}
              <View style={styles.form}>
                {/* Input Email */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    label="Correo Corporativo"
                    placeholder="usuario@socotec.com"
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                    }}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    cursorColor="#00ACE8"
                    outlineColor={errors.email ? "#E53E3E" : focusedField === "email" ? "#00ACE8" : "#CBD5E1"}
                    activeOutlineColor="#00ACE8"
                    textColor="#1E293B"
                    error={!!errors.email}
                    style={styles.input}
                    left={
                      <TextInput.Icon
                        icon={() => (
                          <Ionicons
                            name="mail-outline"
                            size={20}
                            color={errors.email ? "#E53E3E" : focusedField === "email" ? "#00ACE8" : "#64748B"}
                          />
                        )}
                      />
                    }
                  />
                  {errors.email && (
                    <Animated.View entering={FadeIn.duration(200)} style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={14} color="#E53E3E" />
                      <Text style={styles.errorText}>{errors.email}</Text>
                    </Animated.View>
                  )}
                </View>

                {/* Input Contraseña */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    label="Contraseña"
                    placeholder="••••••••"
                    value={password}
                    onChangeText={(val) => {
                      setPassword(val);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    mode="outlined"
                    secureTextEntry={!visiblePass}
                    cursorColor="#00ACE8"
                    outlineColor={errors.password ? "#E53E3E" : focusedField === "password" ? "#00ACE8" : "#CBD5E1"}
                    activeOutlineColor="#00ACE8"
                    textColor="#1E293B"
                    error={!!errors.password}
                    style={styles.input}
                    left={
                      <TextInput.Icon
                        icon={() => (
                          <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color={errors.password ? "#E53E3E" : focusedField === "password" ? "#00ACE8" : "#64748B"}
                          />
                        )}
                      />
                    }
                    right={
                      <TextInput.Icon
                        icon={visiblePass ? "eye-off" : "eye"}
                        color="#64748B"
                        onPress={() => setVisiblePass(!visiblePass)}
                      />
                    }
                  />
                  {errors.password && (
                    <Animated.View entering={FadeIn.duration(200)} style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={14} color="#E53E3E" />
                      <Text style={styles.errorText}>{errors.password}</Text>
                    </Animated.View>
                  )}
                </View>

                {/* Olvido contraseña */}
                <TouchableOpacity
                  style={styles.forgotPassButton}
                  onPress={() => setIsOpenForgot(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPassText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                {/* Botón Iniciar Sesión */}
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  disabled={isLoading}
                  style={styles.submitButton}
                  contentStyle={styles.submitButtonContent}
                  buttonColor="#00ACE8"
                  icon={isLoading ? undefined : "login-variant"}
                >
                  {isLoading ? (
                    <ActivityIndicator animating={true} color="#ffffff" size={20} />
                  ) : (
                    <Text style={styles.submitButtonText}>Iniciar Sesión</Text>
                  )}
                </Button>

                {/* Separador */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>O</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Botón Crear Cuenta Móvil */}
                <Button
                  mode="outlined"
                  onPress={() => router.push("/(tabs)/singUp")}
                  style={styles.secondaryButton}
                  contentStyle={styles.secondaryButtonContent}
                  textColor="#00ACE8"
                  icon="account-plus-outline"
                >
                  Crear Cuenta Nueva
                </Button>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Modal de Alerta de Error */}
      <AlertaIcono
        onOpen={isOpenError}
        onClose={() => setIsOpenError(false)}
        icon="alert-circle-outline"
        title="Acceso Denegado"
        text={messageError}
        actions={
          <Button mode="contained" buttonColor="#00ACE8" onPress={() => setIsOpenError(false)}>
            Entendido
          </Button>
        }
      />

      {/* Modal de Alerta de Éxito */}
      <AlertaIcono
        onOpen={isOpenSuccess}
        onClose={() => setIsOpenSuccess(false)}
        icon="check-circle-outline"
        title="Operación Exitosa"
        text={successMessage}
        actions={
          <Button mode="contained" buttonColor="#00ACE8" onPress={() => setIsOpenSuccess(false)}>
            Continuar
          </Button>
        }
      />

      {/* Modal Recuperar Contraseña */}
      <AlertaScroll
        onOpen={isOpenForgot}
        onClose={() => setIsOpenForgot(false)}
        title="Recuperar Contraseña"
        content={
          <View style={styles.forgotModalContent}>
            <Text style={styles.forgotModalDesc}>
              Ingresa el correo institucional asociado a tu cuenta. Te enviaremos un enlace de verificación para restablecer tu contraseña.
            </Text>
            <TextInput
              label="Correo Corporativo"
              placeholder="tu.nombre@socotec.com"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              activeOutlineColor="#00ACE8"
              cursorColor="#00ACE8"
              style={{ marginTop: 12, backgroundColor: "#ffffff" }}
              left={<TextInput.Icon icon="email-outline" color="#00ACE8" />}
            />
          </View>
        }
        actions={[
          <Button
            key="cancel"
            mode="text"
            textColor="#64748B"
            onPress={() => setIsOpenForgot(false)}
          >
            Cancelar
          </Button>,
          <Button
            key="send"
            mode="contained"
            buttonColor="#00ACE8"
            loading={isForgotLoading}
            disabled={isForgotLoading}
            onPress={handleSubmitForgotPassword}
          >
            Enviar Enlace
          </Button>,
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    paddingTop: Platform.OS === "web" ? 95 : 20,
    paddingBottom: Platform.OS === "web" ? 40 : 120,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    width: "100%",
    maxWidth: 980,
    flexDirection: "row",
    minHeight: 560,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)",
  },
  cardMobile: {
    flexDirection: "column",
    maxWidth: 440,
    minHeight: undefined,
  },
  leftSide: {
    flex: 1.1,
    backgroundColor: "#0B2545",
    padding: 40,
    justifyContent: "space-between",
  },
  brandBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandBadgeLogo: {
    width: 32,
    height: 32,
  },
  brandBadgeText: {
    color: "#00ACE8",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  leftTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
    lineHeight: 34,
    marginTop: 24,
  },
  leftSubtitle: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
  },
  featuresList: {
    marginVertical: 28,
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0, 172, 232, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  leftFooter: {
    marginTop: "auto",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  leftFooterText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    marginBottom: 10,
  },
  createAccountBtnLeft: {
    borderColor: "#00ACE8",
    borderWidth: 1.5,
    borderRadius: 12,
  },
  createAccountBtnLeftText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  rightSide: {
    flex: 1,
    padding: Platform.OS === "web" ? 44 : 28,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  rightContent: {
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 26,
  },
  logoHalo: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#F0F9FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    marginBottom: 14,
  },
  logo: {
    width: 32,
    height: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 6,
    textAlign: "center",
    lineHeight: 18,
  },
  form: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 14,
  },
  input: {
    backgroundColor: "#F8FAFC",
    fontSize: 14,
    borderRadius: 12,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
    marginLeft: 4,
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    fontWeight: "500",
  },
  forgotPassButton: {
    alignSelf: "flex-end",
    marginTop: 2,
    marginBottom: 18,
    paddingVertical: 4,
  },
  forgotPassText: {
    color: "#00ACE8",
    fontSize: 13,
    fontWeight: "600",
  },
  submitButton: {
    borderRadius: 12,
    shadowColor: "#00ACE8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonContent: {
    height: 48,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderColor: "#00ACE8",
    borderWidth: 1.5,
    borderRadius: 12,
  },
  secondaryButtonContent: {
    height: 46,
  },
  forgotModalContent: {
    paddingVertical: 8,
  },
  forgotModalDesc: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
});

export default SignInScreen;
