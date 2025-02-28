import React, { useState } from 'react';
import { View, Image, useWindowDimensions, ScrollView, Alert } from 'react-native';
import { Provider, TextInput, Button, Text, useTheme } from 'react-native-paper';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { login, forgotPassword,useLogin} from "@/services/publicServices";
import { AlertaIcono, AlertaScroll } from "../../components/alerta";


const SignUp = () => {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const isMobile = width < 768;
  const inputScale = useSharedValue(1);
  const loginUser = useLogin();

  const [visiblePass, setVisiblePass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //estos son los errores errors son los helpertext
  //message es el mensaje que devuel
  const [errors, setErrors] = useState({});
  const [messageError,setMessageError] = useState("");
  //estas son los estados para abrir las alertas o dialogos de la vista de  inicio de sesion o login
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenError, setIsOpenError] = useState(false);
  const [isOpenSucces, setIsOpenSucces] = useState(false);

  
  
 
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

    if (!email) newErrors.email = 'El email es requerido';
    else if (!/^[a-zA-Z0-9._%+-]+@socotec\.com$/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    else if (password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      //se envian los datos al endpoint
      await loginUser({  email, password }).then((response) => {
        console.log(response);
       
        response.success == true ? setIsOpenSucces(true) : setMessageError(response.message); setIsOpenError(true);
      }).catch((error) => { console.log(error); setMessageError(error.message); setIsOpenError(true);});
    }
  };


  const handleSubmitForgotPassword = async () => {
      //se envian los datos al endpoint
      await forgotPassword({  email }).then((response) => {
        console.log(response);
        response.success == true ? setIsOpenSucces(true) : setMessageError(response.response?.data.message); setIsOpenError(true);
      }).catch((error) => { console.log(error); setMessageError(error.response?.data.message);setIsOpen(false);setIsOpenError(true);});
    
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
          <Button mode="outlined" style={styles.signInButton} labelStyle={styles.signInButtonText} onPress={() => router.navigate("/singUp")}>
            Crear Cuenta
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
        cursorColor='#00ACE8'
        underlineColor='#00ACE8'
        outlineColor='#00ACE8'
        activeUnderlineColor='#00ACE8'
        left={<TextInput.Icon icon={() => <Ionicons name={icon} size={20} color="#00ACE8" />} />}
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
                  {renderInput("Email", email, setEmail, "mail-outline", errors.email, "email-address")}
                  {renderInput("Contraseña", password, setPassword, "lock-closed-outline", errors.password, "default", !visiblePass, <TextInput.Icon icon={visiblePass ?"eye-off":"eye"} onPress={() => setVisiblePass(!visiblePass)} />)}
                </View>
                <View>
                  <Button buttonColor='#00ACE8' mode="contained" onPress={handleSubmit} style={styles.loginButton}>
                    Iniciar sesion
                  </Button>

                  <View style={styles.signupContainer}>
                    <Text style={styles.noAccountText}>¿No tienes una cuenta?</Text>
                    <Button mode="text" onPress={() => router.navigate("/singUp")} labelStyle={styles.signupText}>
                      Crear cuenta
                    </Button>
                  </View>
                  <View style={styles.signupContainer}>
                    <Button mode="text" style={styles.signupText} labelStyle={styles.signupText} onPress={() => setIsOpen(true)}>¿Haz olvidado tu contraseña?</Button>
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
      <AlertaScroll onOpen={isOpen} onClose={() => setIsOpen(false)} title="Recuperar Contraseña" content={<View style={{ padding: 20 }}>
        {renderInput("Email", email, setEmail, "mail-outline", errors.email, "email-address")}
      </View>} actions={<View style={{ flexDirection: 'row', justifyContent: 'space-around', flex: 1 }}>
        <Button textColor='black' onPress={() => setIsOpen(false)}>Cerrar</Button>
        <Button mode='contained' buttonColor='#00ACE8' onPress={handleSubmitForgotPassword}>Enviar email</Button>
      </View>
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