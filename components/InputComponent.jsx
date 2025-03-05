import React, { useState } from "react"
import { View, StyleSheet, useWindowDimensions, Platform,Text } from "react-native"
import { TextInput, HelperText } from "react-native-paper"
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import DateTimePicker from '@react-native-community/datetimepicker';


function InputComponent({
  type = "text",
  value = "",
  placeholder = "",
  onChangeText,
  validationRules = {},
  errorMessage = "Campo inválido",
  style = {},
  label = "",
  mode = "outlined",
}) {
  const [inputValue, setInputValue] = useState(value)
  const [isValid, setIsValid] = useState(true)
  const { width } = useWindowDimensions()
  const isSmallScreen = width < 600
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [visiblePass, setVisiblePass] = useState(false);

  const handleChange = (text) => {
    setInputValue(text)
    if (onChangeText) {
      onChangeText(text)
    }
    if (validationRules) {
      validateInput(text)
    }
  }
  
  
  const validateInput = (text) => {
    let valid = true

    if (validationRules.required && text.trim() === "") {
      valid = false
    }
    if (validationRules.minLength && text.length < validationRules.minLength) {
      valid = false
    }
    if (validationRules.maxLength && text.length > validationRules.maxLength) {
      valid = false
    }
    if (validationRules.pattern && !validationRules.pattern.test(text)) {
      valid = false
    }
    if (validationRules.customValidation && !validationRules.customValidation(text)) {
      valid = false
    }

    setIsValid(valid)
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Ocultar el DatePicker
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (event, selectedDate) => {
    hideDatePicker(); // Oculta el picker después de seleccionar una fecha
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Formatea la fecha a YYYY-MM-DD
      setInputValue(formattedDate); // Actualiza el estado con la nueva fecha
      if (onChangeText) {
        onChangeText(formattedDate); // Llama a la función onChangeText si está definida
      }
    }
  };


  const inputProps = {
    keyboardType: "default",
    secureTextEntry: false,
    multiline: false,
    ...style,
  }

  switch (type) {
    case "nombre":
      inputProps.left = (
        <TextInput.Icon icon={() => <MaterialCommunityIcons name="account-outline" size={24} color="black" />} />
      )
      inputProps.maxLength = 15
      inputProps.onChangeText = (text) => {
        const validText = text.replace(/[^A-Za-z]/g, "");
        if (validText !== inputValue) {
          setInputValue(validText);
          onChangeText?.(validText);
        }
      };
      inputProps.value = inputValue;
      break
    case "descripcion":
      inputProps.left = <TextInput.Icon icon={() => <MaterialIcons name="description" size={24} color="black" />} />
      break
    case "number":
      inputProps.keyboardType = Platform.OS === "web" ? "numeric" : "number-pad"
      inputProps.left = <TextInput.Icon icon={() => <MaterialIcons name="numbers" size={24} color="black" />} />
      inputProps.maxLength = 10
      inputProps.onChangeText = (text) => {
        const validText = text.replace(/[^0-9]/g, "").slice(0, 10);
        const processedText = validText.length > 0 && validText[0] !== "3" ? "3" + validText.slice(1) : validText;
        if (processedText !== inputValue) {
          setInputValue(processedText);
          onChangeText?.(processedText);
        }
      };
      inputProps.value = inputValue;
      break
    case "precio":
      inputProps.keyboardType = "numeric";
      inputProps.left = <TextInput.Icon icon={() => <MaterialIcons name="attach-money" size={24} color="black" />} />;
      inputProps.onChangeText = (text) => {
        const validText = text.replace(/[^0-9]/g, ""); // Solo permite números
        if (validText !== inputValue) {
          setInputValue(validText);
          onChangeText?.(validText);
        }
      };
      inputProps.value = inputValue;
      break
    case "email":
      inputProps.keyboardType = "email-address"
      inputProps.autoCapitalize = "none"
      inputProps.left = <TextInput.Icon icon={() => <Ionicons name="mail" size={24} />} />
      validationRules.pattern = validationRules.pattern || /^[a-zA-Z0-9._%+-]+@socotec\.com$/
      break
    case "password":
      inputProps.secureTextEntry = true
      inputProps.left = <TextInput.Icon icon={() => <Ionicons name="lock-closed" size={24} />} />
      inputProps.right = <TextInput.Icon onPress={() => setVisiblePass(!visiblePass)} icon={() => <Ionicons name={visiblePass ? "eye-off" : "eye"} size={24} />} />
      inputProps.secureTextEntry = !visiblePass
      break
    case "ubicacion":
      inputProps.left = <TextInput.Icon icon={() => <MaterialCommunityIcons name="map-marker-outline" size={24} color="black" />} />
      break;
    case "superficie":
      inputProps.left = <TextInput.Icon icon={() => <MaterialCommunityIcons name="border-outside" size={24} color="black" />} />
      break;
    case "textarea":
      inputProps.multiline = true
      break
    case "date":
      inputProps.editable = false
      inputProps.left = (
        <TextInput.Icon icon={() => <Ionicons name="calendar" size={24} color="black" />} onPress={showDatePicker} />
      )
      break
    default:
      break
  }

  return (
    <View style={[styles.container, isSmallScreen ? { width: "100%" } : { width: Platform.OS === "web" ? "100%" : "80%" }]}>
      {type === "date" && Platform.OS === "web" ? (
        <>
        <Text style={{ fontWeight:"500" }}>Fecha Fin</Text>
        <input type="date" style={styles.inputDate} value={inputValue} onChange={(e) => handleChange(e.target.value)}/>
        </>
      ) : (
        <>
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
          {isDatePickerVisible && (
            <DateTimePicker
              mode="date"
              value={new Date(inputValue)}
              is24Hour={true}
              display="default"
              onChange={handleConfirm}
            />
          )}
        </>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 7,
  },
  inputDate:{
    borderRadius: 18,
    padding: 8,
    textAlign: "center",
    fontSize: 15,
    borderWidth: 1,
    webkitAppearance: "none",
  }
})

export default InputComponent