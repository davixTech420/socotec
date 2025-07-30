import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { View, StyleSheet, Platform } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  FontAwesome6,
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// Configuración de tipos de input optimizada
const INPUT_CONFIGS = {
  nombre: {
    icon: { family: MaterialCommunityIcons, name: "account-outline" },
    maxLength: 15,
    filter: (text) => text.replace(/[^A-Za-z\s]/g, ""),
  },
  descripcion: {
    icon: { family: MaterialIcons, name: "description" },
    multiline: true,
  },
  number: {
    icon: { family: MaterialIcons, name: "numbers" },
    keyboardType: Platform.OS === "web" ? "numeric" : "number-pad",
    maxLength: 10,
    filter: (text) => {
      const validText = text.replace(/[^0-9]/g, "").slice(0, 10);
      return validText.length > 0 && validText[0] !== "3"
        ? "3" + validText.slice(1)
        : validText;
    },
  },
  numberNum: {
    icon: { family: MaterialIcons, name: "numbers" },
    keyboardType: Platform.OS === "web" ? "numeric" : "number-pad",
    maxLength: 5,
    filter: (text) => text.replace(/[^0-9]/g, ""),
  },
  precio: {
    icon: { family: MaterialIcons, name: "attach-money" },
    keyboardType: "numeric",
    filter: (text) => text.replace(/[^0-9]/g, ""),
  },
  email: {
    icon: { family: Ionicons, name: "mail" },
    keyboardType: "email-address",
    autoCapitalize: "none",
    pattern: /^[a-zA-Z0-9._%+-]+@socotec\.com$/,
  },
  emailCan: {
    icon: { family: Ionicons, name: "mail" },
    keyboardType: "email-address",
    autoCapitalize: "none",
    pattern: /^[a-zA-Z0-9._%+-]/,
  },
  password: {
    icon: { family: Ionicons, name: "lock-closed" },
    secureTextEntry: true,
    hasToggle: true,
  },
  ubicacion: {
    icon: { family: MaterialCommunityIcons, name: "map-marker-outline" },
  },
  superficie: {
    icon: { family: MaterialCommunityIcons, name: "border-outside" },
    keyboardType: "numeric",
    filter: (text) => {
      let validText = text.replace(/[^0-9.]/g, "");
      if (validText.startsWith(".")) {
        validText = "0" + validText;
      }
      return validText.replace(/(\..*)\./g, "$1");
    },
  },
  titulo: {
    icon: { family: MaterialIcons, name: "format-size" },
    maxLength: 15,
  },
  tipo: {
    icon: { family: MaterialIcons, name: "local-offer" },
    maxLength: 15,
    filter: (text) => text.replace(/[^A-Za-z]/g, ""),
  },
  date: {
    icon: { family: Ionicons, name: "calendar" },
    editable: false,
    isDate: true,
  },
  muestra: {
    icon: { family: Entypo, name: "lab-flask" },
  },
  profundidad: {
    icon: { family: Entypo, name: "layers" },
    keyboardType: "numeric",
    filter: (text) => {
      let validText = text.replace(/[^0-9.]/g, "");
      if (validText.startsWith(".")) {
        validText = "0" + validText;
      }
      return validText.replace(/(\..*)\./g, "$1");
    },
  },
  espresor: {
    icon: { family: MaterialCommunityIcons, name: "arrow-expand-horizontal" },
    keyboardType: "numeric",
    filter: (text) => {
      let validText = text.replace(/[^0-9.]/g, "");
      if (validText.startsWith(".")) {
        validText = "0" + validText;
      }
      return validText.replace(/(\..*)\./g, "$1");
    },
  },
  pdc: {
    icon: {
      family: MaterialCommunityIcons,
      name: "chart-bell-curve-cumulative",
    },
    keyboardType: "numeric",
    filter: (text) => {
      let validText = text.replace(/[^0-9.]/g, "");
      if (validText.startsWith(".")) {
        validText = "0" + validText;
      }
      return validText.replace(/(\..*)\./g, "$1");
    },
    maxLength:6,
  },
  code:{
    icon: {
      family: MaterialCommunityIcons,
      name: "code-tags",
    },
    maxLength:10
  },
rango:{
  icon: {
    family: FontAwesome6,
    name: "ranking-star",
},
maxLength:20
},
temperature:{
  icon: {
    family: FontAwesome6,
    name: "temperature-high",
},
keyboardType: "numeric",
    filter: (text) => {
      let validText = text.replace(/[^0-9.]/g, "");
      if (validText.startsWith(".")) {
        validText = "0" + validText;
      }
      return validText.replace(/(\..*)\./g, "$1");
    },
    maxLength:4,
},
  textarea: {
    multiline: true,
  },
};

// Hook personalizado para validación con debounce
const useValidation = (value, validationRules, delay = 300) => {
  const [isValid, setIsValid] = useState(true);
  const timeoutRef = useRef(null);

  const validateInput = useCallback(
    (text) => {
      if (!validationRules) return true;

      // Convertir a string y manejar valores null/undefined
      const textValue = String(text || "");
      let valid = true;

      if (validationRules.required && textValue.trim() === "") {
        valid = false;
      }
      if (
        validationRules.minLength &&
        textValue.length < validationRules.minLength
      ) {
        valid = false;
      }
      if (
        validationRules.maxLength &&
        textValue.length > validationRules.maxLength
      ) {
        valid = false;
      }
      if (validationRules.pattern && !validationRules.pattern.test(textValue)) {
        valid = false;
      }
      if (
        validationRules.customValidation &&
        !validationRules.customValidation(textValue)
      ) {
        valid = false;
      }

      return valid;
    },
    [validationRules]
  );

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      const valid = validateInput(value);
      setIsValid(valid);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, validateInput, delay]);

  return isValid;
};

function OptimizedInputComponent({
  type = "text",
  value = "",
  placeholder = "",
  onChangeText,
  validationRules = {},
  errorMessage = "Campo inválido",
  style = {},
  label = "",
  mode = "outlined",
  editable = true,
  containerStyle = {},
  fullWidth = true, // Nueva prop para controlar el ancho
}) {
  const [inputValue, setInputValue] = useState(String(value || ""));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [visiblePass, setVisiblePass] = useState(false);

  // Sincronizar con prop value cuando cambie
  useEffect(() => {
    setInputValue(String(value || ""));
  }, [value]);

  // Configuración del tipo de input
  const config = useMemo(() => INPUT_CONFIGS[type] || {}, [type]);

  // Validación con debounce
  const isValid = useValidation(inputValue, {
    ...validationRules,
    pattern: config.pattern || validationRules.pattern,
  });

  // Manejo optimizado de cambios de texto
  const handleChange = useCallback(
    (text) => {
      const safeText = String(text || "");
      let processedText = safeText;

      // Aplicar filtro si existe
      if (config.filter) {
        processedText = config.filter(safeText);
      }

      // Solo actualizar si el valor cambió
      if (processedText !== inputValue) {
        setInputValue(processedText);
        onChangeText?.(processedText);
      }
    },
    [config.filter, inputValue, onChangeText]
  );

  // Manejo de fecha
  const showDatePicker = useCallback(() => {
    setDatePickerVisibility(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setDatePickerVisibility(false);
  }, []);

  const handleDateConfirm = useCallback(
    (event, selectedDate) => {
      hideDatePicker();
      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        setInputValue(formattedDate);
        onChangeText?.(formattedDate);
      }
    },
    [hideDatePicker, onChangeText]
  );

  // Toggle para password
  const togglePasswordVisibility = useCallback(() => {
    setVisiblePass((prev) => !prev);
  }, []);

  // Renderizar icono izquierdo
  const renderLeftIcon = useCallback(() => {
    if (!config.icon) return null;

    const IconComponent = config.icon.family;
    return (
      <TextInput.Icon
        icon={() => (
          <IconComponent name={config.icon.name} size={24} color="#666" />
        )}
        onPress={config.isDate ? showDatePicker : undefined}
      />
    );
  }, [config, showDatePicker]);

  // Renderizar icono derecho (para password)
  const renderRightIcon = useCallback(() => {
    if (!config.hasToggle) return null;

    return (
      <TextInput.Icon
        icon={() => (
          <Ionicons
            name={visiblePass ? "eye-off" : "eye"}
            size={24}
            color="#666"
          />
        )}
        onPress={togglePasswordVisibility}
      />
    );
  }, [config.hasToggle, visiblePass, togglePasswordVisibility]);

  // Props del input memoizadas
  const inputProps = useMemo(() => {
    const props = {
      keyboardType: config.keyboardType || "default",
      secureTextEntry: config.secureTextEntry && !visiblePass,
      multiline: config.multiline || false,
      maxLength: config.maxLength,
      autoCapitalize: config.autoCapitalize,
      editable: config.editable !== undefined ? config.editable : editable,
      value: inputValue,
      onChangeText: handleChange,
      left: renderLeftIcon(),
      right: renderRightIcon(),
      ...style,
    };

    return props;
  }, [
    config,
    visiblePass,
    inputValue,
    handleChange,
    style,
    editable,
    renderLeftIcon,
    renderRightIcon,
  ]);

  // Estilos responsivos memoizados
  const containerStyles = useMemo(
    () => [
      fullWidth ? styles.containerFullWidth : styles.container,
      containerStyle,
    ],
    [fullWidth, containerStyle]
  );

  // Renderizado condicional para fecha en web
  if (type === "date" && Platform.OS === "web") {
    return (
      <View style={containerStyles}>
        <input
          type="date"
          readOnly={!editable}
          style={styles.inputDate}
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
        />
        <HelperText type="error" visible={!isValid}>
          {errorMessage}
        </HelperText>
      </View>
    );
  }

  return (
    <View style={containerStyles}>
      <TextInput
        label={label}
        mode={mode}
        placeholder={placeholder}
        error={!isValid}
        {...inputProps}
      />

      <HelperText type="error" visible={!isValid}>
        {errorMessage}
      </HelperText>

      {editable && isDatePickerVisible && (
        <DateTimePicker
          mode="date"
          value={inputValue ? new Date(inputValue) : new Date()}
          is24Hour={true}
          display="default"
          onChange={handleDateConfirm}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 7,
    width: "100%",
    minWidth: 200,
    maxWidth: 400, // Reducido para inputs normales
  },
  containerFullWidth: {
    marginBottom: 7,
    width: "100%",
    minWidth: 250,
    // Sin maxWidth para ocupar todo el espacio disponible
  },
  inputDate: {
    borderRadius: 4,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    width: "100%",
    boxSizing: "border-box",
    ...(Platform.OS === "web" && {
      WebkitAppearance: "none",
      outline: "none",
    }),
  },
});

export default React.memo(OptimizedInputComponent);
