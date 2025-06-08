/* import React, { useState } from 'react';
import { View, Image, useWindowDimensions, ScrollView, Alert } from 'react-native';
import { Provider, TextInput, Button, Text, useTheme } from 'react-native-paper';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { emailRegistro } from "@/services/publicServices";
import { AlertaIcono } from "../../components/alerta";

const SignUp = () => {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const isMobile = width < 768;
  const inputScale = useSharedValue(1);
const [visiblePass,setVisiblePass] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [messageError,setMessageError] = useState("");

//estas son los estados para abrir las alertas o dialogos de la vista de registrar
  const [isOpenError, setIsOpenError] = useState(false);
  const [isOpenSucces, setIsOpenSucces] = useState(false);
  const handleNameChange = (text) => {
    const lettersOnly = text.replace(/[^A-Za-z\s]/g, '');
    setNombre(lettersOnly);
  };

  const handlePhoneChange = (text) => {
    const numbersOnly = text.replace(/[^0-9]/g, '').slice(0, 10);
    setTelefono(numbersOnly);
  };

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }));

  const handleFocus = () => {
    inputScale.value = withSpring(1.05);
  };

  const handleBlur = () => {
    inputScale.value = withSpring(1);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!email) newErrors.email = 'El email es requerido';
    else if (!/^[a-zA-Z0-9._%+-]+@socotec\.com$/.test(email)) newErrors.email = 'Email inválido';
    if (!telefono) newErrors.telefono = 'El teléfono es requerido';
    else if (telefono.length !== 10) newErrors.telefono = 'El teléfono debe tener 10 dígitos';
    if (!password) newErrors.password = 'La contraseña es requerida';
    else if (password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        
        const response = await emailRegistro({ nombre, telefono, email, password });
  
        // Suponiendo que la respuesta es un objeto JSON con una propiedad "message"
        if (response.data.status === 200) {
          setIsOpenSucces(true);
        } else {
          setIsOpenError(true);
setMessageError(response.response?.data.message);
          console.log('Error:', response.response?.data.message
          );
        }
      } catch (error) {
        setMessageError(error.response.data.message || "Error Inesperado");
        setIsOpenError(true);

      }
    }
  };

  const renderLeftSide = () => (

    <Animated.View
      entering={FadeIn.duration(1000)}
      style={styles.leftSide}
    >

      <View style={styles.leftContent}>
        <Text style={styles.welcomeText}>Bienvenidos a Socotec Colombia</Text>
        <Text style={styles.communityText}>
          Únete a nuestra comunidad de más de{'\n'}10,000 suscriptores y aprende cosas nuevas
        </Text>
        {!isMobile && (
          <Button onPress={() => router.navigate("/singIn")} mode="outlined" style={styles.signInButton} labelStyle={styles.signInButtonText}>
            Iniciar Sesión
          </Button>
        )}
      </View>
    </Animated.View>
  );

  const renderInput = (label, value, onChangeText, icon, error, keyboardType = 'default', secureTextEntry = false, right) => (
    <Animated.View style={animatedInputStyle}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        left={<TextInput.Icon icon={() => <Ionicons name={icon} size={20} color="#00ACE8" />} />}
        underlineColor='#00ACE8'
        outlineColor='#00ACE8'
        cursorColor='#00ACE8'
        activeUnderlineColor='#00ACE8'
        error={!!error}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        right={right}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </Animated.View>
  );

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={[styles.card, isMobile ? styles.cardMobile : {}]}>
          {!isMobile && renderLeftSide()}
          <Animated.View
            entering={FadeIn.duration(1000)}
            style={styles.rightSide}
          >
            <View style={styles.rightContent}>
              <View style={styles.formContainer}>
                <View>
                  <View style={styles.signupContainer}>
                    <Text style={styles.beOneText}>¡Bienvenido!</Text>
                    <Image style={styles.logo} source={require("@/assets/images/favicon.png")} />
                  </View>
                  {renderInput("Nombre", nombre, handleNameChange, "person-outline", errors.nombre)}
                  {renderInput("Email", email, setEmail, "mail-outline", errors.email, "email-address")}
                  {renderInput("Teléfono", telefono, handlePhoneChange, "call-outline", errors.telefono, "phone-pad")}
                  {renderInput("Contraseña", password, setPassword, "lock-closed-outline", errors.password, "default", !visiblePass , <TextInput.Icon icon={visiblePass ? "eye-off": "eye"} onPress={() => {
                    setVisiblePass(!visiblePass);
                  }} />)}
                </View>

                <View>
                  <Button mode="contained"  buttonColor='#00ACE8' onPress={handleSubmit} style={styles.loginButton}>
                    Crear Cuenta
                  </Button>

                  <View style={styles.signupContainer}>
                    <Text style={styles.noAccountText}>¿Ya tienes una cuenta?</Text>
                    <Button mode="text" onPress={() => router.navigate("/singIn")} labelStyle={styles.signupText}>
                      Iniciar sesión
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

        </Animated.View>
      </ScrollView>
      <AlertaIcono onOpen={isOpenError} onClose={() => setIsOpenError(false)} icon="alert" title="Error" text={messageError} actions={<>
        <Button onPress={() => setIsOpenError(false)}>Cerrar</Button>
      </>
      } />
      <AlertaIcono onOpen={isOpenSucces} onClose={() => setIsOpenSucces(false)} icon="check" title="Exito" text="Correo de confirmacion enviado exitosamente" actions={<>
        <Button onPress={() => setIsOpenSucces(false)}>Cerrar</Button>
      </>
      } />
    </>
  );
};

const styles = {
  container: {
    flexGrow: 1,
    backgroundColor: '#d1f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    maxWidth: 1000,
    flexDirection: 'row',
    height: "80%",
  },
  cardMobile: {
    flexDirection: 'column',
    maxWidth: 400,
  },
  leftSide: {
    flex: 1,
    backgroundColor: '#1a75ff',
    padding: 32,
    justifyContent: 'center',
  },
  leftContent: {
    alignItems: 'flex-start',
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  communityText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  signInButton: {
    borderColor: 'white',
    borderWidth: 2,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
  },
  rightSide: {
    flex: 1,
    padding: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  rightContent: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  beOneText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAccountText: {
    color: '#666',
    fontSize: 14,
  },
  signupText: {
    color: '#1a75ff',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  input: {
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
  },
};
export default SignUp; */

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
    const { isSmallPhone, isMediumPhone, isLargePhone, isTablet, isLandscape } = deviceInfo

    return {
      // Padding y márgenes
      containerPadding: isSmallPhone ? 12 : isMediumPhone ? 16 : isTablet ? 24 : 20,
      cardPadding: isSmallPhone ? 16 : isMediumPhone ? 20 : isTablet ? 32 : 24,
      inputMargin: isSmallPhone ? 12 : 16,

      // Tamaños de fuente
      titleSize: isSmallPhone ? 20 : isMediumPhone ? 24 : isTablet ? 32 : 28,
      subtitleSize: isSmallPhone ? 14 : isMediumPhone ? 16 : isTablet ? 20 : 18,
      bodySize: isSmallPhone ? 12 : isMediumPhone ? 14 : isTablet ? 16 : 14,

      // Dimensiones de componentes
      inputHeight: isSmallPhone ? 48 : isMediumPhone ? 52 : isTablet ? 60 : 56,
      buttonHeight: isSmallPhone ? 44 : isMediumPhone ? 48 : isTablet ? 56 : 52,
      logoSize: isSmallPhone ? 40 : isMediumPhone ? 50 : isTablet ? 70 : 60,

      // Layout
      showSideBySide: isTablet && isLandscape,
      maxCardWidth: isTablet ? 900 : 400,
      leftSideMinHeight: isTablet ? 300 : 200,
    }
  }, [deviceInfo])

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
        setMessageError(response.response?.data.message || "Error desconocido")
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
          style={[animatedInputStyle, { marginBottom: responsive.inputMargin }]}
        >
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
      )
    },
    [formData, errors, focusedField, responsive, theme, handleInputChange, handleFocus, handleBlur, animatedInputStyle],
  )

  // Sección izquierda (bienvenida)
  const renderLeftSide = useCallback(() => {
    if (!responsive.showSideBySide) return null

    return (
      <Animated.View
        entering={FadeIn.duration(1000)}
        style={{
          flex: 1,
          backgroundColor: "#1a75ff",
          padding: responsive.cardPadding,
          justifyContent: "center",
          minHeight: responsive.leftSideMinHeight,
        }}
      >
        <View>
          <Text
            style={{
              color: "white",
              fontSize: responsive.titleSize,
              fontWeight: "bold",
              marginBottom: 16,
              lineHeight: responsive.titleSize * 1.2,
            }}
          >
            Bienvenidos a Socotec Colombia
          </Text>
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: responsive.subtitleSize,
              lineHeight: responsive.subtitleSize * 1.4,
              marginBottom: 32,
            }}
          >
            Únete a nuestra comunidad de más de{"\n"}10,000 suscriptores y aprende cosas nuevas
          </Text>
          <Button
            mode="outlined"
            onPress={() => router.navigate("/singIn")}
            buttonColor="transparent"
            textColor="white"
            style={{
              borderColor: "white",
              borderWidth: 2,
              height: responsive.buttonHeight,
            }}
            labelStyle={{
              fontSize: responsive.bodySize + 2,
              fontWeight: "600",
            }}
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

    const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"]
    const labels = ["Débil", "Regular", "Buena", "Fuerte"]

    return (
      <Animated.View entering={FadeIn.duration(300)} style={{ marginBottom: responsive.inputMargin }}>
        <Text style={{ fontSize: responsive.bodySize - 2, color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
          Fortaleza: {labels[strength - 1] || "Muy débil"}
        </Text>
        <View style={{ flexDirection: "row", gap: 4 }}>
          {[1, 2, 3, 4].map((level) => (
            <View
              key={level}
              style={{
                flex: 1,
                height: 4,
                backgroundColor: level <= strength ? colors[strength - 1] || "#ef4444" : "#e5e7eb",
                borderRadius: 2,
              }}
            />
          ))}
        </View>
      </Animated.View>
    )
  }, [formData.password, responsive, theme])

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a75ff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: "#d1f9ff",
            alignItems: "center",
            justifyContent: "center",
            padding: responsive.containerPadding,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              animatedCardStyle,
              {
                backgroundColor: "white",
                borderRadius: 20,
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 10,
                width: "100%",
                maxWidth: responsive.maxCardWidth,
                flexDirection: responsive.showSideBySide ? "row" : "column",
                minHeight: deviceInfo.isTablet ? 600 : "auto",
              },
            ]}
          >
            {renderLeftSide()}

            <Animated.View
              entering={FadeInDown.duration(1000)}
              style={{
                flex: 1,
                padding: responsive.cardPadding,
                justifyContent: "center",
              }}
            >
              <Animated.View style={[animatedFormStyle, { width: "100%", alignSelf: "center" }]}>
                {/* Header del formulario */}
                <View style={{ alignItems: "center", marginBottom: responsive.cardPadding }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                      gap: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: responsive.titleSize,
                        fontWeight: "bold",
                        color: "#333",
                        textAlign: "center",
                      }}
                    >
                      ¡Bienvenido!
                    </Text>
                    <Image
                      style={{
                        width: responsive.logoSize,
                        height: responsive.logoSize,
                        borderRadius: responsive.logoSize / 2,
                      }}
                      source={require("@/assets/images/favicon.png")}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: responsive.bodySize,
                      color: theme.colors.onSurfaceVariant,
                      textAlign: "center",
                      lineHeight: responsive.bodySize * 1.4,
                    }}
                  >
                    Completa todos los campos para crear tu cuenta
                  </Text>
                </View>

                {/* Formulario */}
                <View style={{ flex: 1, justifyContent: "space-between" }}>
                  <View>
                    {renderInput("nombre", "Nombre completo", "person-outline")}
                    {renderInput("email", "Email corporativo", "mail-outline", "email-address")}
                    {renderInput("telefono", "Teléfono", "call-outline", "phone-pad")}
                    {renderInput(
                      "password",
                      "Contraseña",
                      "lock-closed-outline",
                      "default",
                      !visiblePass,
                      <TextInput.Icon
                        icon={visiblePass ? "eye-off" : "eye"}
                        onPress={() => setVisiblePass(!visiblePass)}
                        iconColor={theme.colors.onSurfaceVariant}
                      />,
                    )}
                    {renderPasswordStrength()}
                  </View>

                  <View style={{ marginTop: responsive.inputMargin }}>
                    <Button
                      mode="contained"
                      onPress={handleSubmit}
                      disabled={isLoading}
                      buttonColor="#00ACE8"
                      style={{
                        height: responsive.buttonHeight,
                        justifyContent: "center",
                        marginBottom: 16,
                        borderRadius: 12,
                      }}
                      labelStyle={{
                        fontSize: responsive.bodySize + 2,
                        fontWeight: "600",
                      }}
                    >
                      {isLoading ? (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <ActivityIndicator size="small" color="white" />
                          <Text style={{ color: "white", fontSize: responsive.bodySize + 2 }}>Creando cuenta...</Text>
                        </View>
                      ) : (
                        "Crear Cuenta"
                      )}
                    </Button>

                    <View style={{ alignItems: "center", gap: 8 }}>
                      <Text style={{ color: "#666", fontSize: responsive.bodySize }}>¿Ya tienes una cuenta?</Text>
                      <Button
                        mode="text"
                        onPress={() => router.navigate("/singIn")}
                        textColor="#1a75ff"
                        labelStyle={{
                          fontSize: responsive.bodySize,
                          fontWeight: "600",
                        }}
                      >
                        Iniciar sesión
                      </Button>
                    </View>

                    {/* Botón adicional para móvil */}
                    {!responsive.showSideBySide && (
                      <Button
                        mode="outlined"
                        onPress={() => router.navigate("/singIn")}
                        style={{
                          marginTop: 16,
                          borderColor: "#1a75ff",
                          height: responsive.buttonHeight,
                          borderRadius: 12,
                        }}
                        textColor="#1a75ff"
                        labelStyle={{
                          fontSize: responsive.bodySize + 2,
                          fontWeight: "600",
                        }}
                      >
                        Iniciar Sesión
                      </Button>
                    )}
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
