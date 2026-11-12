"use client"

import type React from "react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { View, Image, useWindowDimensions, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from "react-native"
import { TextInput, Button, Text, useTheme, ActivityIndicator } from "react-native-paper"
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { emailRegistro } from "@/services/publicServices"
import { AlertaIcono } from "../../components/alerta"

// Tipos TypeScript para mejor tipado
interface FormData {
  nombre: string
  email: string
  telefono: string
  password: string
}

interface FormErrors {
  nombre?: string
  email?: string
  telefono?: string
  password?: string
}

interface DeviceInfo {
  isSmallPhone: boolean
  isMediumPhone: boolean
  isLargePhone: boolean
  isTablet: boolean
  isLandscape: boolean
}

const SignUp = () => {
  const { width, height } = useWindowDimensions()
  const theme = useTheme()

  // Estados del formulario optimizados
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [visiblePass, setVisiblePass] = useState(false)
  const [messageError, setMessageError] = useState("")
  const [isOpenError, setIsOpenError] = useState(false)
  const [isOpenSuccess, setIsOpenSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // Valores animados
  const inputScale = useSharedValue(1)
  const cardOpacity = useSharedValue(0)
  const formTranslateY = useSharedValue(50)

  // Información del dispositivo mejorada
  const deviceInfo = useMemo<DeviceInfo>(() => {
    const isLandscape = width > height
    return {
      isSmallPhone: width < 375, // iPhone SE, etc.
      isMediumPhone: width >= 375 && width < 414, // iPhone 12, etc.
      isLargePhone: width >= 414 && width < 768, // iPhone Pro Max, etc.
      isTablet: width >= 768, // iPad, tablets Android
      isLandscape,
    }
  }, [width, height])

  // Breakpoints responsive mejorados
  const responsive = useMemo(() => {
    const isTablet = width >= 768

    return {
      // Padding y márgenes
      containerPadding: isTablet ? 24 : 16,
      cardPadding: isTablet ? 36 : 24,
      inputMargin: 14,

      // Tamaños de fuente
      titleSize: isTablet ? 28 : 24,
      subtitleSize: isTablet ? 15 : 13,
      bodySize: 14,

      // Dimensiones de componentes
      inputHeight: 52,
      buttonHeight: 48,
      logoSize: isTablet ? 56 : 48,

      // Layout
      showSideBySide: width >= 768,
      maxCardWidth: width >= 768 ? 980 : 440,
      leftSideMinHeight: 320,
    }
  }, [width])

  // Efectos de animación inicial
  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 800 })
    formTranslateY.value = withTiming(0, { duration: 600 })
  }, [])

  // Validación optimizada del formulario
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {}

    // Validación del nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres"
    } else if (formData.nombre.trim().length > 50) {
      newErrors.nombre = "El nombre no puede exceder 50 caracteres"
    }

    // Validación del email
    if (!formData.email) {
      newErrors.email = "El email es requerido"
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Ingresa un email válido"
    }

    // Validación del teléfono
    if (!formData.telefono) {
      newErrors.telefono = "El teléfono es requerido"
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener exactamente 10 dígitos"
    }

    // Validación de la contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Debe contener mayúscula, minúscula y número"
    }

    return newErrors
  }, [formData])

  // Manejadores de entrada optimizados
  const handleInputChange = useCallback(
    (field: keyof FormData) => (text: string) => {
      let processedText = text

      // Procesamiento específico por campo
      switch (field) {
        case "nombre":
          processedText = text.replace(/[^A-Za-zÀ-ÿ\u00f1\u00d1\s]/g, "").slice(0, 50)
          break
        case "telefono":
          processedText = text.replace(/[^0-9]/g, "").slice(0, 10)
          break
        case "email":
          processedText = text.toLowerCase().trim().slice(0, 100)
          break
        case "password":
          processedText = text.slice(0, 128)
          break
      }

      setFormData((prev) => ({ ...prev, [field]: processedText }))

      // Limpiar error cuando el usuario empiece a escribir
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors],
  )

  // Manejadores de foco con animaciones
  const handleFocus = useCallback((field: string) => {
    setFocusedField(field)
    inputScale.value = withSpring(1.02, { damping: 15 })
  }, [])

  const handleBlur = useCallback(() => {
    setFocusedField(null)
    inputScale.value = withSpring(1, { damping: 15 })
  }, [])

  // Envío del formulario optimizado
  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForm()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsLoading(true)

    try {
      const response = await emailRegistro(formData)

      if (response.data.status === 200) {
        setIsOpenSuccess(true)
        setFormData({ nombre: "", email: "", telefono: "", password: "" })
        setErrors({})
      } else {
        setMessageError(response.data?.message || "Error desconocido")
        setIsOpenError(true)
      }
    } catch (error: any) {
      setMessageError(error.response?.data?.message || "Error inesperado")
      setIsOpenError(true)
    } finally {
      setIsLoading(false)
    }
  }, [formData, validateForm])

  // Estilos animados
  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }))

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }))

  const animatedFormStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: formTranslateY.value }],
  }))

  // Componente de entrada reutilizable
  const renderInput = useCallback(
    (
      field: keyof FormData,
      label: string,
      icon: string,
      keyboardType: any = "default",
      secureTextEntry = false,
      rightIcon?: React.ReactNode,
    ) => {
      const isFocused = focusedField === field
      const hasError = !!errors[field]

      return (
        <Animated.View
          entering={FadeInUp.delay(200).duration(600)}
          
        >
          <Animated.View style={[animatedInputStyle, { marginBottom: responsive.inputMargin }]}>



          


          <TextInput
            label={label}
            value={formData[field]}
            onChangeText={handleInputChange(field)}
            onFocus={() => handleFocus(field)}
            onBlur={handleBlur}
            left={
              <TextInput.Icon
                icon={() => (
                  <Ionicons
                    name={icon as any}
                    size={responsive.bodySize + 6}
                    color={hasError ? theme.colors.error : isFocused ? "#00ACE8" : theme.colors.onSurfaceVariant}
                  />
                )}
              />
            }
            right={rightIcon}
            mode="outlined"
            underlineColor="#00ACE8"
            outlineColor={hasError ? theme.colors.error : "#00ACE8"}
            activeOutlineColor={hasError ? theme.colors.error : "#00ACE8"}
            cursorColor="#00ACE8"
            error={hasError}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            style={{
              height: responsive.inputHeight,
              fontSize: responsive.bodySize,
            }}
            contentStyle={{
              paddingVertical: Platform.OS === "ios" ? 8 : 4,
            }}
          />
          {hasError && (
            <Animated.View entering={FadeIn.duration(300)}>
              <Text
                style={{
                  color: theme.colors.error,
                  fontSize: responsive.bodySize - 2,
                  marginTop: 4,
                  marginLeft: 12,
                }}
              >
                {errors[field]}
              </Text>
            </Animated.View>
          )}
          </Animated.View>
        </Animated.View>
      )
    },
    [formData, errors, focusedField, responsive, theme, handleInputChange, handleFocus, handleBlur, animatedInputStyle],
  )

  // Sección izquierda (bienvenida)
  const renderLeftSide = useCallback(() => {
    if (!responsive.showSideBySide) return null

    return (
      <Animated.View
        entering={FadeIn.duration(800)}
        style={{
          flex: 1.1,
          backgroundColor: "#0B2545",
          padding: 36,
          justifyContent: "space-between",
          minHeight: responsive.leftSideMinHeight,
        }}
      >
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <Image
              source={require("@/assets/images/favicon.png")}
              style={{ width: 32, height: 32 }}
              resizeMode="contain"
            />
            <Text style={{ color: "#00ACE8", fontSize: 13, fontWeight: "800", letterSpacing: 1.5 }}>
              SOCOTEC COLOMBIA
            </Text>
          </View>
          <Text
            style={{
              color: "white",
              fontSize: responsive.titleSize,
              fontWeight: "bold",
              marginBottom: 14,
              lineHeight: responsive.titleSize * 1.25,
            }}
          >
            Únete a Nuestra Comunidad Técnica
          </Text>
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.75)",
              fontSize: responsive.subtitleSize,
              lineHeight: responsive.subtitleSize * 1.5,
              marginBottom: 24,
            }}
          >
            Regístrate con tu correo institucional para acceder al ecosistema de informes, proyectos e inventarios.
          </Text>

          <View style={{ gap: 14, marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "rgba(0, 172, 232, 0.15)", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="checkmark-sharp" size={14} color="#00ACE8" />
              </View>
              <Text style={{ color: "#E2E8F0", fontSize: 13, flex: 1 }}>Acceso a herramientas de campo y laboratorio</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "rgba(0, 172, 232, 0.15)", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="checkmark-sharp" size={14} color="#00ACE8" />
              </View>
              <Text style={{ color: "#E2E8F0", fontSize: 13, flex: 1 }}>Generación automatizada de reportes normativos</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingTop: 20, borderTopWidth: 1, borderTopColor: "rgba(255, 255, 255, 0.1)" }}>
          <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 13, marginBottom: 10 }}>
            ¿Ya tienes una cuenta activa?
          </Text>
          <Button
            mode="outlined"
            onPress={() => router.push("/(tabs)/singIn")}
            style={{
              borderColor: "#00ACE8",
              borderWidth: 1.5,
              borderRadius: 12,
              height: 46,
            }}
            labelStyle={{
              fontSize: 14,
              fontWeight: "600",
              color: "#FFFFFF",
            }}
            icon="login-variant"
          >
            Iniciar Sesión
          </Button>
        </View>
      </Animated.View>
    )
  }, [responsive, router])

  // Indicador de fortaleza de contraseña
  const renderPasswordStrength = useCallback(() => {
    if (!formData.password) return null

    const strength = [
      formData.password.length >= 8,
      /[a-z]/.test(formData.password),
      /[A-Z]/.test(formData.password),
      /\d/.test(formData.password),
    ].filter(Boolean).length

    const colors = ["#ef4444", "#f59e0b", "#00ACE8", "#10b981"]
    const labels = ["Débil", "Regular", "Buena", "Segura"]

    return (
      <Animated.View entering={FadeIn.duration(300)} style={{ marginBottom: responsive.inputMargin }}>
        <Text style={{ fontSize: 12, color: "#64748B", marginBottom: 6, fontWeight: "500" }}>
          Seguridad: <Text style={{ color: colors[strength - 1] || "#ef4444", fontWeight: "700" }}>{labels[strength - 1] || "Muy débil"}</Text>
        </Text>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {[1, 2, 3, 4].map((level) => (
            <View
              key={level}
              style={{
                flex: 1,
                height: 4,
                backgroundColor: level <= strength ? colors[strength - 1] || "#ef4444" : "#E2E8F0",
                borderRadius: 2,
              }}
            />
          ))}
        </View>
      </Animated.View>
    )
  }, [formData.password, responsive])

  return (
    <>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: "#F1F5F9",
            alignItems: "center",
            justifyContent: "center",
            padding: responsive.containerPadding,
            paddingTop: Platform.OS === "web" ? 95 : responsive.containerPadding,
            paddingBottom: Platform.OS === "web" ? 40 : 120,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              animatedCardStyle,
              {
                backgroundColor: "#FFFFFF",
                borderRadius: 24,
                overflow: "hidden",
                shadowColor: "#0F172A",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 24,
                elevation: 8,
                width: "100%",
                maxWidth: responsive.maxCardWidth,
                flexDirection: responsive.showSideBySide ? "row" : "column",
                borderWidth: 1,
                borderColor: "rgba(226, 232, 240, 0.8)",
              },
            ]}
          >
            {renderLeftSide()}

            <Animated.View
              entering={FadeInDown.duration(800)}
              style={{
                flex: 1,
                padding: responsive.cardPadding,
                justifyContent: "center",
              }}
            >
              <Animated.View style={[animatedFormStyle, { width: "100%", alignSelf: "center", maxWidth: 400 }]}>
                {/* Header del formulario */}
                <View style={{ alignItems: "center", marginBottom: 22 }}>
                  <View
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 27,
                      backgroundColor: "#F0F9FF",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "#BAE6FD",
                      marginBottom: 12,
                    }}
                  >
                    <Image
                      style={{ width: 30, height: 30 }}
                      source={require("@/assets/images/favicon.png")}
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: responsive.titleSize,
                      fontWeight: "bold",
                      color: "#0F172A",
                      textAlign: "center",
                    }}
                  >
                    Crear Cuenta
                  </Text>
                  <Text
                    style={{
                      fontSize: responsive.bodySize,
                      color: "#64748B",
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    Completa tus datos para el registro corporativo
                  </Text>
                </View>

                {/* Formulario */}
                <View>
                  <View>
                    {renderInput("nombre", "Nombre completo", "person-outline")}
                    {renderInput("email", "Email corporativo (@socotec.com)", "mail-outline", "email-address")}
                    {renderInput("telefono", "Teléfono de contacto", "call-outline", "phone-pad")}
                    {renderInput(
                      "password",
                      "Contraseña",
                      "lock-closed-outline",
                      "default",
                      !visiblePass,
                      <TextInput.Icon
                        icon={visiblePass ? "eye-off" : "eye"}
                        onPress={() => setVisiblePass(!visiblePass)}
                        color="#64748B"
                      />,
                    )}
                    {renderPasswordStrength()}
                  </View>

                  <View style={{ marginTop: 12 }}>
                    <Button
                      mode="contained"
                      onPress={handleSubmit}
                      disabled={isLoading}
                      buttonColor="#00ACE8"
                      style={{
                        height: 48,
                        justifyContent: "center",
                        marginBottom: 16,
                        borderRadius: 12,
                        shadowColor: "#00ACE8",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                      labelStyle={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "#FFFFFF",
                      }}
                      icon={isLoading ? undefined : "account-check-outline"}
                    >
                      {isLoading ? (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <ActivityIndicator size="small" color="white" />
                          <Text style={{ color: "white", fontSize: 14 }}>Creando cuenta...</Text>
                        </View>
                      ) : (
                        "Registrarme"
                      )}
                    </Button>

                    <View style={{ alignItems: "center", gap: 6 }}>
                      <Text style={{ color: "#64748B", fontSize: 13 }}>¿Ya tienes una cuenta?</Text>
                      <Button
                        mode="text"
                        onPress={() => router.push("/(tabs)/singIn")}
                        textColor="#00ACE8"
                        labelStyle={{
                          fontSize: 14,
                          fontWeight: "700",
                        }}
                      >
                        Iniciar sesión
                      </Button>
                    </View>
                  </View>
                </View>
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Alertas */}
      <AlertaIcono
        onOpen={isOpenError}
        onClose={() => setIsOpenError(false)}
        icon="alert"
        title="Error"
        text={messageError}
        actions={
          <Button onPress={() => setIsOpenError(false)} textColor={theme.colors.error}>
            Cerrar
          </Button>
        }
      />
      <AlertaIcono
        onOpen={isOpenSuccess}
        onClose={() => setIsOpenSuccess(false)}
        icon="check"
        title="¡Éxito!"
        text="Correo de confirmación enviado exitosamente"
        actions={
          <Button onPress={() => setIsOpenSuccess(false)} textColor={theme.colors.primary}>
            Cerrar
          </Button>
        }
      />
    </>
  )
}

export default SignUp
