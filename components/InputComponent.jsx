import React, { useState } from 'react';
import { View, StyleSheet,useWindowDimensions } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons,MaterialIcons } from '@expo/vector-icons';






function InputComponent({
  type = 'text',
  value = '',
  placeholder = '',
  onChangeText,
  validationRules = {},
  errorMessage = 'Campo inválido',
  style = {},
  label = '',
  mode = 'outlined',
}) {
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(true);
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;
  

  // Manejador de cambios
  const handleChange = (text) => {
    setInputValue(text);

    // Validar entrada según las reglas
    if (onChangeText) {
      onChangeText(text);
    }
    if (validationRules) {
      validateInput(text);
    }
  };

  // Validación de entrada
  const validateInput = (text) => {
    let valid = true;

    if (validationRules.required && text.trim() === '') {
      valid = false;
    }
    if (validationRules.minLength && text.length < validationRules.minLength) {
      valid = false;
    }
    if (validationRules.maxLength && text.length > validationRules.maxLength) {
      valid = false;
    }
    if (validationRules.pattern && !validationRules.pattern.test(text)) {
      valid = false;
    }
    if (validationRules.customValidation && !validationRules.customValidation(text)) {
      valid = false;
    }

    setIsValid(valid);
  };

  // Configuración de atributos según el tipo
  const inputProps = {
    keyboardType: 'default',
    secureTextEntry: false,
    multiline: false,
    ...style,
  };

  switch (type) {
    case 'nombre':
        inputProps.left=<TextInput.Icon icon={()=> <MaterialCommunityIcons name="account-outline" size={24} color="black" />} />
        break;

    case 'descripcion':
        inputProps.left=<TextInput.Icon icon={()=> <MaterialIcons name="description" size={24} color="black" />} />
        break;
    case 'number':
      inputProps.keyboardType = 'numeric';
      inputProps.left=<TextInput.Icon icon={()=> <MaterialIcons name="numbers" size={24} color="black" />} />
      break;
      case 'precio':
      inputProps.keyboardType = 'numeric';
      inputProps.left=<TextInput.Icon icon={()=> <MaterialIcons name="attach-money" size={24} color="black" />} />
      break;
     
    case 'email':
      inputProps.keyboardType = 'email-address';
      inputProps.autoCapitalize = 'none';
     inputProps.left=<TextInput.Icon icon={()=> <Ionicons name="mail" size={24} />} />
      validationRules.pattern = validationRules.pattern || /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      break;
    case 'password':
      inputProps.secureTextEntry = true;
      break;
    case 'textarea':
      inputProps.multiline = true;
      break;
    case 'date':
      inputProps.keyboardType = 'numeric'; 
      break;
    default:
      break;
  }

  return (
    <View style={[styles.container, isSmallScreen ? {width:'100%'} : {width:'48%'}]}>
      <TextInput
        label={label}
        mode={mode}
        placeholder={placeholder}
        value={inputValue}
        onChangeText={handleChange}
        error={!isValid}
        {...inputProps}
      />
      <HelperText type="error" visible={!isValid}>
        {errorMessage}
      </HelperText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 7,
  },
  
});

export default InputComponent;
