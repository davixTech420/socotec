import React, { useState } from 'react';
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

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

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

 /*  const handleSubmit = async () => {
    if (validateForm()) {
      //se envian los datos al endpoint
       await emailRegistro({ name, phone, email, password }).then((response) => {
        console.log(response);
        response === "Correo enviado con exito" ? setIsOpenSucces(true) : setIsOpenError(true);
      }).catch((error) => { console.log(error); setIsOpenError(true); });
    }
  }; */

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        
        const response = await emailRegistro({ nombre, telefono, email, password });
  
        // Suponiendo que la respuesta es un objeto JSON con una propiedad "message"
        if (response.data.status === 200) {
          setIsOpenSucces(true);
        } else {
          setIsOpenError(true);
          console.error('Error:', response.data);
        }
      } catch (error) {
        console.error('Error:', error);
       
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
          <Button mode="outlined" style={styles.signInButton} labelStyle={styles.signInButtonText}>
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
                  {renderInput("Contraseña", password, setPassword, "lock-closed-outline", errors.password, "default", true, <TextInput.Icon icon="eye" />)}
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
      <AlertaIcono onOpen={isOpenError} onClose={() => setIsOpenError(false)} icon="alert" title="Error" text="El correo no existe" actions={<>
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
export default SignUp;