import React, { useCallback, useState, useMemo, memo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
  Image,
  Animated as ReanimatedAnimated,
} from "react-native";
import {
  PaperProvider,
  useTheme,
  Snackbar,
  ActivityIndicator,
  Card,
  ProgressBar,
  Text,
  Button,
  IconButton,
  Divider,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import TablaComponente from "@/components/tablaComponent";
import Breadcrumb from "@/components/BreadcrumbComponent";
import { AlertaScroll } from "@/components/alerta";
import AddComponent from "../../components/AddComponent";
import InputComponent from "@/components/InputComponent";
import {
  updateApique,
  getApique,
  createApique,
  getSampleApiqueId,
} from "@/services/employeeService";
import * as ImagePicker from "expo-image-picker";
import { SrcImagen } from "@/services/publicServices";
import { router } from "expo-router";

// Memoized color picker component
const ColorPicker = memo(({ selectedColor, onColorSelect, colors }) => (
  <View style={styles.colorPickerContainer}>
    <Text style={styles.colorPickerTitle}>Seleccionar Color</Text>
    <View style={styles.colorGrid}>
      {colors.map((color, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.colorOption,
            { backgroundColor: color },
            selectedColor === color && styles.selectedColor,
          ]}
          onPress={() => onColorSelect(color)}
        >
          {selectedColor === color && (
            <Ionicons name="checkmark" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  </View>
));

// Memoized sample card component
const SampleCard = memo(
  ({ sample, index, onEdit, onDelete, onToggleExpand }) => {
    const expandAnimation = useSharedValue(sample.expanded ? 1 : 0);

    const animatedStyle = useAnimatedStyle(() => ({
      height: withTiming(expandAnimation.value * 120 + 60, { duration: 300 }),
      opacity: withTiming(1, { duration: 200 }),
    }));

    const toggleExpand = useCallback(() => {
      expandAnimation.value = withSpring(sample.expanded ? 0 : 1);
      onToggleExpand(index);
    }, [expandAnimation, sample.expanded, onToggleExpand, index]);

    return (
      <ReanimatedAnimated.View style={[styles.sampleCard, animatedStyle]}>
        <TouchableOpacity onPress={toggleExpand} style={styles.sampleHeader}>
          <View style={styles.sampleHeaderContent}>
            <View style={styles.sampleColorIndicator}>
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: sample.estrato || "#ccc" },
                ]}
              />
              <Text style={styles.sampleTitle}>
                {sample.sampleNum || `Muestra ${index + 1}`}
              </Text>
            </View>
            <View style={styles.sampleActions}>
              <IconButton
                iconColor="#00ACE8"
                icon="pencil"
                size={16}
                onPress={() => onEdit(index)}
                style={styles.actionButton}
              />
              <IconButton
                iconColor="#ff0000"
                icon="delete"
                size={16}
                onPress={() => onDelete(index)}
                style={styles.actionButton}
              />
              <IconButton
                icon={sample.expanded ? "chevron-up" : "chevron-down"}
                size={20}
                onPress={toggleExpand}
              />
            </View>
          </View>
        </TouchableOpacity>

        {sample.expanded && (
          <View style={styles.sampleDetails}>
            <Text style={styles.sampleDetailText}>
              Profundidad Inicio: {sample.profundidadInicio || "N/A"} cm
            </Text>
            <Text style={styles.sampleDetailText}>
              Profundidad Fin: {sample.profundidadFin || "N/A"} cm
            </Text>
            <Text style={styles.sampleDetailText}>
              Espresor: {sample.espresor || "N/A"} cm
            </Text>
            <Text style={styles.sampleDetailText}>
              Tipo Muestra: {sample.tipoMuestra || "N/A"}
            </Text>
            <Text style={styles.sampleDetailText}>
              Descripción: {sample.descripcion || "Sin descripción"}
            </Text>
            <Text style={styles.sampleDetailText}>
              PDC Li: {sample.pdcLi || "N/A"} cm
            </Text>
            <Text style={styles.sampleDetailText}>
              PDC Lf: {sample.pdcLf || "N/A"} cm
            </Text>
            <Text style={styles.sampleDetailText}>
              PDC Gi: {sample.pdcGi || "Sin descripción"}
            </Text>
          </View>
        )}
      </ReanimatedAnimated.View>
    );
  }
);

// Memoized sample form component
const SampleForm = memo(
  ({ visible, onClose, onSave, editingSample, isEditing }) => {
    const [sampleData, setSampleData] = useState({
      sampleNum: "",
      profundidadInicio: "",
      profundidadFin: "",
      espresor: "",
      estrato: "#FF6B6B",
      descripcion: "",
      resultados: "",
      granulometria: "",
      uscs: "",
      tipoMuestra: "",
      pdcLi: "",
      pdcLf: "",
      pdcGi: "",
      color: "#FF6B6B",
    });

    const colors = useMemo(
      () => [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FFEAA7",
        "#DDA0DD",
        "#98D8C8",
        "#F7DC6F",
        "#BB8FCE",
        "#85C1E9",
        "#F8C471",
        "#82E0AA",
        "#F1948A",
        "#85C1E9",
        "#D7BDE2",
        "#A3E4D7",
        "#F9E79F",
        "#FADBD8",
        "#D5DBDB",
        "#2C3E50",
      ],
      []
    );

    React.useEffect(() => {
      if (isEditing && editingSample) {
        setSampleData(editingSample);
      } else {
        setSampleData({
          sampleNum: "",
          profundidadInicio: "",
          profundidadFin: "",
          espresor: "",
          estrato: "#FF6B6B",
          descripcion: "",
          resultados: "",
          granulometria: "",
          uscs: "",
          tipoMuestra: "",
          pdcLi: "",
          pdcLf: "",
          pdcGi: "",
          color: "#FF6B6B",
        });
      }
    }, [isEditing, editingSample, visible]);

    const handleSave = useCallback(() => {
      if (!sampleData.sampleNum) {
        alert("Por favor, ingresa un nombre para la muestra");
        return;
      }
      onSave(sampleData);
      onClose();
    }, [sampleData, onSave, onClose]);

    const handleColorSelect = useCallback((color) => {
      setSampleData((prev) => ({ ...prev, estrato: color }));
    }, []);

    const handleInputChange = useCallback((field, value) => {
      setSampleData((prev) => ({ ...prev, [field]: value }));
    }, []);

    return (
      <AlertaScroll
        onOpen={visible}
        onClose={onClose}
        title={isEditing ? "Editar Muestra" : "Nueva Muestra"}
        content={
          <View style={styles.sampleFormContainer}>
            <InputComponent
              type="muestra"
              value={sampleData.sampleNum}
              onChangeText={(text) => handleInputChange("sampleNum", text)}
              label="Muestra"
              placeholder="Ej: 1"
              validationRules={{ required: true }}
              errorMessage="Por favor, introduce un numero valido"
            />

            <InputComponent
              type="profundidad"
              value={sampleData.profundidadInicio}
              onChangeText={(text) =>
                handleInputChange("profundidadInicio", text)
              }
              label="Profundidad Inicio (cm)"
              placeholder="Ej: 15"
            />
            <InputComponent
              type="profundidad"
              value={sampleData.profundidadFin}
              onChangeText={(text) => handleInputChange("profundidadFin", text)}
              label="Profundidad Final (cm)"
              placeholder="Ej: 15"
            />

            <InputComponent
              type="espresor"
              value={sampleData.espresor}
              onChangeText={(text) => handleInputChange("espresor", text)}
              label="Espresor"
              placeholder="Ej: 12.5"
            />

            <InputComponent
              type="descripcion"
              value={sampleData.descripcion}
              onChangeText={(text) => handleInputChange("descripcion", text)}
              label="Descripción"
              placeholder="Descripción detallada de la muestra"
            />
            <InputComponent
              type="descripcion"
              value={sampleData.resultados}
              onChangeText={(text) => handleInputChange("resultados", text)}
              label="Resultados"
              placeholder="Resultados detallados de la muestra"
            />
            <InputComponent
              type="descripcion"
              value={sampleData.granulometria}
              onChangeText={(text) => handleInputChange("granulometria", text)}
              label="Granulometria"
              placeholder="Granulometria detallada de la muestra"
            />

            <InputComponent
              type="descripcion"
              value={sampleData.uscs}
              onChangeText={(text) => handleInputChange("uscs", text)}
              label="U.S.C.S"
              placeholder="U.S.C.S detallada de la muestra"
            />

            <InputComponent
              type="tipo"
              value={sampleData.tipoMuestra}
              onChangeText={(text) => handleInputChange("tipoMuestra", text)}
              label="Tipo Muestra"
              placeholder="Tipo de muestra"
            />

            <InputComponent
              type="pdc"
              value={sampleData.pdcLi}
              onChangeText={(text) => handleInputChange("pdcLi", text)}
              label="PDC Li (cm)"
              placeholder="PDC Li"
            />

            <InputComponent
              type="pdc"
              value={sampleData.pdcLf}
              onChangeText={(text) => handleInputChange("pdcLf", text)}
              label="PDC Lf (cm)"
              placeholder="PDC Lf"
            />

            <InputComponent
              type="pdc"
              value={sampleData.pdcGi}
              onChangeText={(text) => handleInputChange("pdcGi", text)}
              label="PDC GI"
              placeholder="PDC Gi"
            />

            <ColorPicker
              selectedColor={sampleData.estrato}
              onColorSelect={handleColorSelect}
              colors={colors}
            />
          </View>
        }
        actions={[
          <Button
            key="cancel"
            onPress={onClose}
            mode="outlined"
            textColor="black"
            style={styles.formButton}
          >
            Cancelar
          </Button>,
          <Button
            key="save"
            onPress={handleSave}
            mode="contained"
            style={[styles.formButton, { backgroundColor: "#00ACE8" }]}
          >
            {isEditing ? "Actualizar" : "Guardar"}
          </Button>,
        ]}
      />
    );
  }
);

// Table columns definition
const columns = [
  { key: "id", title: "ID", sortable: true, width: 50 },
  { key: "informeNum", title: "Informe No", sortable: true },
  { key: "cliente", title: "Cliente", sortable: true, width: 80 },
  { key: "tituloObra", title: "Titulo Obra", sortable: true, width: 100 },
  { key: "localizacion", title: "Localizacion", sortable: true },
  { key: "albaranNum", title: "Albaran No", sortable: true },
  {
    key: "fechaEjecucionInicio",
    title: "Fecha Ejecucion Inicio",
    sortable: true,
  },
  {
    key: "fechaEjecucionFinal",
    title: "Fecha Ejecucion Final",
    sortable: true,
  },
  { key: "fechaEmision", title: "Fecha Emision", sortable: true },
  { key: "tipo", title: "Tipo", sortable: true },
  { key: "operario", title: "Operario", sortable: true },
  { key: "largoApique", title: "Largo Apique", sortable: true },
  { key: "anchoApique", title: "Ancho Apique", sortable: true },
  { key: "profundidadApique", title: "Profundidad Apique", sortable: true },
  { key: "imagenes", title: "Imagenes", sortable: true },
  { key: "observaciones", title: "Observaciones", sortable: true },
  { key: "createdAt", title: "Creado", sortable: true },
  { key: "updatedAt", title: "Modificado", sortable: true },
];

// Main component
const Apique = () => {
  // State management with useReducer for complex state
  const [state, setState] = useState({
    data: [],
    editingInventoryId: null,
    isEditing: false,
    snackbarVisible: false,
    snackbarMessage: { text: "", type: "success" },
    formData: {
      informeNum: "",
      cliente: "",
      tituloObra: "",
      localizacion: "",
      albaranNum: "",
      fechaEjecucionInicio: "",
      fechaEjecucionFinal: "",
      fechaEmision: "",
      operario: "",
      largoApique: "",
      anchoApique: "",
      profundidadApique: "",
      observaciones: "",
      imagenes: [],
      muestras: [],
    },
    openForm: false,
    loading: false,
    imageLoading: {},
    sampleFormVisible: false,
    editingSampleIndex: null,
    isEditingSample: false,
  });

  // Destructure state for easier access
  const {
    data,
    editingInventoryId,
    isEditing,
    snackbarVisible,
    snackbarMessage,
    formData,
    openForm,
    loading,
    imageLoading,
    sampleFormVisible,
    editingSampleIndex,
    isEditingSample,
  } = state;

  // Helper function to update state
  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Helper function to update formData
  const updateFormData = useCallback((updates) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, ...updates },
    }));
  }, []);

  // UI state
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;

  // Reset form function
  const resetForm = useCallback(() => {
    updateState({
      openForm: false,
      isEditing: false,
      editingInventoryId: null,
      formData: {
        informeNum: "",
        cliente: "",
        tituloObra: "",
        localizacion: "",
        albaranNum: "",
        fechaEjecucionInicio: "",
        fechaEjecucionFinal: "",
        fechaEmision: "",
        operario: "",
        largoApique: "",
        anchoApique: "",
        profundidadApique: "",
        observaciones: "",
        imagenes: [],
        muestras: [],
      },
    });
  }, [updateState]);

  // Function to convert base64/dataURL to File
  const dataURLtoFile = useCallback((dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }, []);

  // Function to show messages to user
  const showMessage = useCallback(
    (text, type = "info") => {
      updateState({
        snackbarMessage: { text, type },
        snackbarVisible: true,
      });
    },
    [updateState]
  );

  // Load data on focus
  useFocusEffect(
    useCallback(() => {
      updateState({ loading: true });
      getApique()
        .then((data) => updateState({ data }))
        .catch(() => {
          showMessage("Error al cargar los datos", "error");
        })
        .finally(() => updateState({ loading: false }));
    }, [updateState, showMessage])
  );

  // Sample management functions
  const handleAddSample = useCallback(() => {
    updateState({
      isEditingSample: false,
      editingSampleIndex: null,
      sampleFormVisible: true,
    });
  }, [updateState]);

  const handleEditSample = useCallback(
    (index) => {
      updateState({
        isEditingSample: true,
        editingSampleIndex: index,
        sampleFormVisible: true,
      });
    },
    [updateState]
  );

  const handleSaveSample = useCallback((sampleData) => {
    setState((prev) => {
      const newMuestras = [...prev.formData.muestras];
      if (prev.isEditingSample && prev.editingSampleIndex !== null) {
        newMuestras[prev.editingSampleIndex] = {
          ...sampleData,
          expanded: false,
        };
      } else {
        newMuestras.push({ ...sampleData, expanded: false });
      }
      return {
        ...prev,
        formData: { ...prev.formData, muestras: newMuestras },
        sampleFormVisible: false,
      };
    });
  }, []);

  const handleDeleteSample = useCallback((index) => {
    setState((prev) => {
      const newMuestras = [...prev.formData.muestras];
      newMuestras.splice(index, 1);
      return {
        ...prev,
        formData: { ...prev.formData, muestras: newMuestras },
      };
    });
  }, []);

  const handleToggleSampleExpand = useCallback((index) => {
    setState((prev) => {
      const newMuestras = [...prev.formData.muestras];
      newMuestras[index] = {
        ...newMuestras[index],
        expanded: !newMuestras[index].expanded,
      };
      return {
        ...prev,
        formData: { ...prev.formData, muestras: newMuestras },
      };
    });
  }, []);

  // Form submission
  const handleSubmit = useCallback(async () => {
    try {
      updateState({ loading: true });

      const formDataToSend = new FormData();

      // Add basic fields
      Object.keys(formData).forEach((key) => {
        if (key !== "imagenes" && key !== "muestras" && formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add samples as JSON
      if (formData.muestras.length > 0) {
        formDataToSend.append("muestras", JSON.stringify(formData.muestras));
      }

      // Handle image upload
      const handleImageUpload = (imageData, index) => {
        if (!imageData) return;

        const fieldName = "imagenes";

        if (
          typeof imageData.uri === "string" &&
          imageData.uri.startsWith("data:")
        ) {
          const filename = imageData.name || `image_${Date.now()}_${index}.jpg`;
          const file = dataURLtoFile(imageData.uri, filename);
          formDataToSend.append(fieldName, file, file.name);
          return;
        }

        if (imageData.file instanceof File || imageData.file instanceof Blob) {
          formDataToSend.append(fieldName, imageData.file, imageData.name);
          return;
        }

        if (
          typeof imageData.uri === "string" &&
          imageData.uri.match(/^(file|content):\/\//)
        ) {
          const filename =
            imageData.name ||
            imageData.uri.split("/").pop() ||
            `image_${index}.jpg`;
          const type = filename.split(".").pop() || "jpeg";
          formDataToSend.append(fieldName, {
            uri: imageData.uri,
            name: filename,
            type: `image/${type}`,
          });
          return;
        }

        if (imageData.isFromAPI && typeof imageData.uri === "string") {
          formDataToSend.append(fieldName, imageData.uri);
        }
      };

      // Process images
      formData.imagenes.forEach(handleImageUpload);

      // Send data to server
      if (isEditing) {
        await updateApique(editingInventoryId, formDataToSend);
        showMessage("Datos actualizados correctamente");
      } else {
        await createApique(formDataToSend);
        showMessage("Apique creado correctamente");
      }

      // Update data list
      const updatedData = await getApique();
      updateState({ data: updatedData });
      resetForm();
    } catch (error) {
      showMessage("Error al procesar los datos", "error");
    } finally {
      updateState({ loading: false });
    }
  }, [
    formData,
    isEditing,
    editingInventoryId,
    dataURLtoFile,
    showMessage,
    resetForm,
    updateState,
  ]);

  // Edit function
  const handleEdit = useCallback(
    async (item) => {
      try {
        // Format images from API
        const formattedImages = Array.isArray(item.imagenes)
          ? item.imagenes.map((img) => ({
              uri: typeof img === "string" ? img : img.uri || "",
              type: "image/jpeg",
              name:
                typeof img === "string"
                  ? img.split("/").pop() || "image.jpg"
                  : img.name || "image.jpg",
              isFromAPI: true,
            }))
          : [];

        // Get samples from API
        let formattedSamples = [];
        try {
          const samplesFromAPI = await getSampleApiqueId(item.id);
          formattedSamples = Array.isArray(samplesFromAPI)
            ? samplesFromAPI.map((sample) => ({
                ...sample,
                expanded: false,
              }))
            : [];
        } catch (error) {
          showMessage("Error al cargar las muestras del apique", "error");
        }

        // Update form data
        updateState({
          formData: {
            informeNum: item.informeNum,
            cliente: item.cliente,
            tituloObra: item.tituloObra,
            localizacion: item.localizacion,
            albaranNum: item.albaranNum,
            fechaEjecucionInicio: item.fechaEjecucionInicio,
            fechaEjecucionFinal: item.fechaEjecucionFinal,
            fechaEmision: item.fechaEmision,
            tipo: item.tipo,
            operario: item.operario,
            largoApique: item.largoApique,
            anchoApique: item.anchoApique,
            profundidadApique: item.profundidadApique,
            observaciones: item.observaciones,
            imagenes: formattedImages,
            muestras: formattedSamples,
          },
          editingInventoryId: item.id,
          isEditing: true,
          openForm: true,
        });
      } catch (error) {
        showMessage("Error al editar el proyecto", "error");
      }
    },
    [updateState, showMessage]
  );

  // Image picker
  const pickImages = useCallback(async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Necesitamos acceso a la galería para seleccionar fotos.");
          return;
        }
      }

      const pickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
        allowsEditing: false,
        aspect: [4, 3],
      };

      const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImages = result.assets.map((asset) => {
          if (Platform.OS === "web" && asset.uri.startsWith("data:")) {
            const file = dataURLtoFile(
              asset.uri,
              asset.fileName || `image-${Date.now()}.jpg`
            );
            return {
              file,
              uri: asset.uri,
              type: asset.type || "image/jpeg",
              name: asset.fileName || file.name,
              isFromAPI: false,
            };
          }

          return {
            uri: asset.uri,
            type: asset.type || "image/jpeg",
            name:
              asset.fileName ||
              asset.uri.split("/").pop() ||
              `image-${Date.now()}.jpg`,
            isFromAPI: false,
          };
        });

        updateFormData({
          imagenes: [...formData.imagenes, ...newImages],
        });
      }
    } catch (error) {
      showMessage(
        `Error al seleccionar imágenes: ${
          error.message || "Error desconocido"
        }`,
        "error"
      );
    }
  }, [formData.imagenes, dataURLtoFile, updateFormData, showMessage]);

  // Image management
  const removeImage = useCallback(
    (index) => {
      updateFormData({
        imagenes: formData.imagenes.filter((_, i) => i !== index),
      });
    },
    [formData.imagenes, updateFormData]
  );

  const handleImageLoadStart = useCallback((index) => {
    setState((prev) => ({
      ...prev,
      imageLoading: { ...prev.imageLoading, [index]: true },
    }));
  }, []);

  const handleImageLoadEnd = useCallback((index) => {
    setState((prev) => ({
      ...prev,
      imageLoading: { ...prev.imageLoading, [index]: false },
    }));
  }, []);

  const handleImageError = useCallback((index) => {
    setState((prev) => ({
      ...prev,
      imageLoading: { ...prev.imageLoading, [index]: false },
    }));
  }, []);

  // Progress calculation
  const totalItems = data.length;
  const itemsProgress = useMemo(() => {
    const progress = Math.min(Math.max(totalItems / 1000, 0), 1);
    return Number.parseFloat(progress.toFixed(2));
  }, [totalItems]);

  // Field input handler
  const handleFieldChange = useCallback(
    (field, value) => {
      updateFormData({ [field]: value });
    },
    [updateFormData]
  );

  // Memoized form fields
  const formFields = useMemo(
    () => [
      "informeNum",
      "cliente",
      "tituloObra",
      "localizacion",
      "albaranNum",
      "fechaEjecucionInicio",
      "fechaEjecucionFinal",
      "fechaEmision",
      "tipo",
      "operario",
      "largoApique",
      "anchoApique",
      "profundidadApique",
      "observaciones",
    ],
    []
  );

  // Get field type
  const getFieldType = useCallback((field) => {
    const typeMap = {
      informeNum: "numberNum",
      cliente: "nombre",
      tituloObra: "titulo",
      localizacion: "ubicacion",
      albaranNum: "numberNum",
      fechaEjecucionInicio: "date",
      fechaEjecucionFinal: "date",
      fechaEmision: "date",
      tipo: "tipo",
      operario: "nombre",
      largoApique: "superficie",
      anchoApique: "superficie",
      profundidadApique: "profundidad",
      observaciones: "descripcion",
    };
    return typeMap[field] || "text";
  }, []);

  return (
    <>
      <PaperProvider theme={theme}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Breadcrumb
              items={[
                {
                  label: "Dashboard",
                  onPress: () => router.navigate("/(admin)/Dashboard"),
                },
                {
                  label: "Apique",
                },
              ]}
            />
          </View>
          <View
            style={[
              styles.cardContainer,
              isSmallScreen && styles.cardContainerSmall,
            ]}
          >
            <Card style={[styles.card, isSmallScreen && styles.cardSmall]}>
              <Card.Content>
                <Text style={styles.cardTitle}>Total de apiques</Text>
                <Text style={styles.cardValue}>{totalItems}</Text>
                <ProgressBar
                  progress={itemsProgress}
                  color="#00ACE8"
                  style={styles.progressBar}
                />
              </Card.Content>
            </Card>
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Cargando...</Text>
            </View>
          )}

          <Card style={styles.tableCard}>
            <Card.Content>
              <TablaComponente
                data={data}
                columns={columns}
                keyExtractor={(item) => String(item.id)}
                onSort={console.log}
                onSearch={console.log}
                onFilter={console.log}
                onDataUpdate={(newData) => updateState({ data: newData })}
                onCreate={() => updateState({ openForm: true })}
                onEdit={handleEdit}
              />
            </Card.Content>
          </Card>
        </ScrollView>
        <AddComponent onOpen={() => updateState({ openForm: true })} />
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => updateState({ snackbarVisible: false })}
          duration={3000}
          style={{ backgroundColor: theme.colors[snackbarMessage.type] }}
          action={{
            label: "Cerrar",
            onPress: () => updateState({ snackbarVisible: false }),
          }}
        >
          <Text style={{ color: theme.colors.surface }}>
            {snackbarMessage.text}
          </Text>
        </Snackbar>

        <AlertaScroll
          onOpen={openForm}
          onClose={resetForm}
          title={isEditing ? "Editar Apique" : "Nueva Apique"}
          content={
            <>
              <View
                style={{
                  flexDirection: isSmallScreen ? "column" : "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                {formFields.map((field) => (
                  <InputComponent
                    key={field}
                    type={getFieldType(field)}
                    value={formData[field]}
                    onChangeText={(text) => handleFieldChange(field, text)}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    placeholder={`Introduce el ${field}`}
                    validationRules={{ required: true }}
                    errorMessage={`Por favor, introduce un ${field} válido`}
                  />
                ))}
              </View>

              {/* Sección de Muestras */}
              <View style={styles.samplesSection}>
                <View style={styles.samplesSectionHeader}>
                  <Text style={styles.sectionTitle}>Muestras del Apique</Text>
                  <Button
                    mode="contained"
                    onPress={handleAddSample}
                    style={styles.addSampleButton}
                    icon="plus"
                    compact
                  >
                    Agregar Muestra
                  </Button>
                </View>

                {formData.muestras.length > 0 ? (
                  <ScrollView style={styles.samplesContainer}>
                    {formData.muestras.map((sample, index) => (
                      <SampleCard
                        key={index}
                        sample={sample}
                        index={index}
                        onEdit={handleEditSample}
                        onDelete={handleDeleteSample}
                        onToggleExpand={handleToggleSampleExpand}
                      />
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.noSamplesContainer}>
                    <MaterialIcons name="science" size={48} color="#ccc" />
                    <Text style={styles.noSamplesText}>
                      No hay muestras agregadas
                    </Text>
                    <Text style={styles.noSamplesSubtext}>
                      Presiona "Agregar Muestra" para comenzar
                    </Text>
                  </View>
                )}
              </View>

              <Divider style={styles.divider} />

              {/* Sección de Imágenes */}
              <View style={styles.containerImages}>
                <Text style={styles.imagesTitle}>Imágenes del Proyecto</Text>
                <Text style={styles.imagesSubtitle}>
                  {formData.imagenes.length > 0
                    ? `${formData.imagenes.length} imagen(es) seleccionada(s)`
                    : "No hay imágenes seleccionadas"}
                </Text>

                <Button
                  mode="contained"
                  onPress={pickImages}
                  style={styles.buttonImages}
                  icon="image-plus"
                >
                  Seleccionar Imágenes
                </Button>

                {formData.imagenes.length > 0 && (
                  <ScrollView
                    showsVerticalScrollIndicator={!isSmallScreen}
                    horizontal={!isSmallScreen}
                    style={styles.imageScrollView}
                    contentContainerStyle={styles.imageScrollContent}
                    scrollEnabled={true}
                  >
                    {formData.imagenes.map((image, index) => (
                      <Card
                        key={index}
                        style={[
                          styles.cardImages,
                          isSmallScreen
                            ? styles.cardImagesSmall
                            : styles.cardImagesLarge,
                        ]}
                      >
                        <Card.Content style={styles.cardImageContent}>
                          <View style={styles.imageContainer}>
                            {imageLoading[index] && (
                              <View style={styles.imageLoadingOverlay}>
                                <ActivityIndicator
                                  size="small"
                                  color={theme.colors.primary}
                                />
                              </View>
                            )}
                            <Image
                              source={{
                                uri: image.isFromAPI
                                  ? SrcImagen(image.uri)
                                  : image.uri,
                              }}
                              style={styles.images}
                              onLoadStart={() => handleImageLoadStart(index)}
                              onLoad={() => handleImageLoadEnd(index)}
                              onError={() => handleImageError(index)}
                            />
                            <TouchableOpacity
                              style={styles.removeImageButton}
                              onPress={() => removeImage(index)}
                            >
                              <IconButton
                                icon="close-circle"
                                size={24}
                                iconColor="#fff"
                                style={styles.removeIcon}
                              />
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.imageCaption} numberOfLines={1}>
                            {image.name || `Imagen ${index + 1}`}
                          </Text>
                        </Card.Content>
                      </Card>
                    ))}
                  </ScrollView>
                )}
              </View>
            </>
          }
          actions={[
            <Button
              key="cancel"
              onPress={resetForm}
              mode="outlined"
              textColor="black"
              style={styles.formButton}
              disabled={loading}
            >
              Cancelar
            </Button>,
            <Button
              key="submit"
              onPress={handleSubmit}
              mode="contained"
              style={[styles.formButton, { backgroundColor: "#00ACE8" }]}
              loading={loading}
              disabled={loading}
            >
              {isEditing ? "Actualizar" : "Crear"}
            </Button>,
          ]}
        />

        {/* Formulario de Muestras */}
        <SampleForm
          visible={sampleFormVisible}
          onClose={() => updateState({ sampleFormVisible: false })}
          onSave={handleSaveSample}
          editingSample={
            isEditingSample && editingSampleIndex !== null
              ? formData.muestras[editingSampleIndex]
              : null
          }
          isEditing={isEditingSample}
        />
      </PaperProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  cardContainerSmall: {
    flexDirection: "column",
  },
  card: {
    width: "48%",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  cardSmall: {
    width: "100%",
  },
  cardTitle: {
    fontSize: 14,
    color: "#666",
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  tableCard: {
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  // Estilos para las muestras
  samplesSection: {
    width: "100%",
    padding: 1,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  samplesSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    width: "40%",
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  addSampleButton: {
    width: "60%",
    backgroundColor: "#00ACE8",
  },
  samplesContainer: {
    maxHeight: 300,
  },
  sampleCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  sampleHeader: {
    padding: 12,
  },
  sampleHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sampleColorIndicator: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sampleTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  sampleActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    margin: 0,
  },
  sampleDetails: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  sampleDetailText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  noSamplesContainer: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  noSamplesText: {
    fontSize: 16,
    color: "#999",
    marginTop: 8,
    fontWeight: "500",
  },
  noSamplesSubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 4,
  },
  // Estilos para el formulario de muestras
  sampleFormContainer: {
    width: "100%",
  },
  colorPickerContainer: {
    marginTop: 16,
  },
  colorPickerTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    color: "#333",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  selectedColor: {
    borderColor: "#00ACE8",
    borderWidth: 3,
  },
  divider: {
    marginVertical: 16,
  },
  // Estilos existentes para imágenes
  containerImages: {
    width: "100%",
    padding: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flex: 1,
  },
  imagesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  imagesSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  buttonImages: {
    marginBottom: 16,
    backgroundColor: "#00ACE8",
  },
  imageScrollView: {
    maxHeight: 300,
  },
  imageScrollContent: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardImages: {
    marginBottom: 16,
    marginRight: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  cardImagesSmall: {
    width: "100%",
  },
  cardImagesLarge: {
    width: 200,
  },
  cardImageContent: {
    padding: 8,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 150,
    borderRadius: 8,
    overflow: "hidden",
  },
  images: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 8,
  },
  imageLoadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  removeImageButton: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
  },
  removeIcon: {
    backgroundColor: "rgba(0,0,0,0.5)",
    margin: 0,
  },
  imageCaption: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  fullWidth: {
    width: "100%",
    marginBottom: 16,
  },
  formButton: {
    minWidth: 120,
  },
});

export default Apique;
