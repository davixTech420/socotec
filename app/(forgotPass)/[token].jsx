import { useState, useEffect } from "react";
import { useLocalSearchParams } from 'expo-router';
import { View, Text,Image } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
const ForgotPass = () => {
  const { token } = useLocalSearchParams(); // Extrae el token dinámico


  const [password,setPassword] = useState('');
  const [pass2,setPass2] = useState('');
  const errors = useState({});
 const inputScale = useSharedValue(1);
  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }));

  if (!token) {
    return (
      <View>
        <Text>Error: No se encontró un token válido. Verifica la URL.</Text>
      </View>
    );
  }


   const handleFocus = () => {
      inputScale.value = withSpring(1.05);
    };



 const handleBlur = () => {
    inputScale.value = withSpring(1);
  };

  const validateForm = () => {
    let newErrors = {};

    
    if (!password) newErrors.password = 'La contraseña es requerida';
    else if (password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


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
        style={{ marginBottom: 16 }}
        right={right}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </Animated.View>
  );

  return (
    <View>
<Animated.View
            entering={FadeIn.duration(1000)}
            style={styles.rightSide}
          >
            <View style={styles.rightContent}>
              <View style={styles.formContainer}>
                <View>
                  <View style={styles.signupContainer}>
                    <Text style={styles.beOneText}>Restablecer contraseña</Text>
                    <Image style={styles.logo} source={require("@/assets/images/favicon.png")} />
                  </View>
                  {renderInput("Contraseña nueva", password, setPassword, "lock-closed-outline", errors.password, "default", true, <TextInput.Icon icon="eye" />)}


                  {renderInput("Repite contraseña", pass2, setPass2, "lock-closed-outline", errors.password, "default", true, <TextInput.Icon icon="eye" />)}
                </View>
                <View>
                  <Button buttonColor='#00ACE8' mode="contained"  style={styles.loginButton}>
                    Restablecer Contraseña
                  </Button>

                  
                  
                </View>
              </View>
            </View>
          </Animated.View>
     
    </View>
  );
};
const styles = {
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
  }
}

export default ForgotPass;
