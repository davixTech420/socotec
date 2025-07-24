import React, { useCallback, useState, useMemo, memo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
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
  getEnvironmental,
  createEnvironmental,
  deleteApique,
  getSampleEnvironmentalId,
} from "@/services/adminServices";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

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
              <View style={[styles.colorDot, { backgroundColor: "#ccc" }]} />
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
      fechaEjecucion: "",
      hora: "",
      temperatura: "",
      humedad: "",
      firma: "",
      observaciones: "",
    });

    React.useEffect(() => {
      if (isEditing && editingSample) {
        setSampleData(editingSample);
      } else {
        setSampleData({
          fechaEjecucion: "",
          hora: "",
          temperatura: "",
          humedad: "",
          firma: "",
          observaciones: "",
        });
      }
    }, [isEditing, editingSample, visible]);

    const handleSave = useCallback(() => {
      if (!sampleData.fechaEjecucion) {
        alert("Por favor, ingresa un fecha para la muestra");
        return;
      }
      onSave(sampleData);
      onClose();
    }, [sampleData, onSave, onClose]);

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
              type="date"
              value={sampleData.fechaEjecucion}
              onChangeText={(text) => handleInputChange("fechaEjecucion", text)}
              label="Fecha Ejecucion"
              placeholder="Ej: 1"
              validationRules={{ required: true }}
              errorMessage="Por favor, introduce una fecha valida"
            />

            <InputComponent
              type="profundidad"
              value={sampleData.hora}
              onChangeText={(text) => handleInputChange("hora", text)}
              label="Hora"
              placeholder="Ej: 15"
            />
            <InputComponent
              type="profundidad"
              value={sampleData.temperatura}
              onChangeText={(text) => handleInputChange("temperatura", text)}
              label="Temperatura)"
              placeholder="Ej: 15"
            />

            <InputComponent
              type="Humedad"
              value={sampleData.humedad}
              onChangeText={(text) => handleInputChange("humedad", text)}
              label="Humedad"
              placeholder="Ej: 12.5"
            />

            <InputComponent
              type="Firma"
              value={sampleData.firma}
              onChangeText={(text) => handleInputChange("firma", text)}
              label="Firma"
              placeholder="Firma"
            />
            <InputComponent
              type="descripcion"
              value={sampleData.observaciones}
              onChangeText={(text) => handleInputChange("observaciones", text)}
              label="Observaciones"
              placeholder="Observaciones"
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
  { key: "nombre", title: "Nombre Equipamento", sortable: true },
  { key: "codigo", title: "Codigo Equipamento", sortable: true, width: 80 },
  { key: "norma", title: "Norma", sortable: true, width: 100 },
  { key: "especificacion", title: "Especificacion", sortable: true },
  { key: "rangoMedicion", title: "Rango Medicion", sortable: true },
  {
    key: "lugarMedicion",
    title: "Lugar Medicion",
    sortable: true,
  },
  { key: "createdAt", title: "Creado", sortable: true },
  { key: "updatedAt", title: "Modificado", sortable: true },
];

// Main component
const Apiques = () => {
  // State management with useReducer for complex state
  const [state, setState] = useState({
    data: [],
    editingInventoryId: null,
    isEditing: false,
    snackbarVisible: false,
    snackbarMessage: { text: "", type: "success" },
    formData: {
      nombre: "",
      codigo: "",
      norma: "",
      especificacion: "",
      rangoMedicion: "",
      lugarMedicion: "",
      conclusion: "",
      muestras: [],
    },
    openForm: false,
    loading: false,
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
        nombre: "",
        codigo: "",
        norma: "",
        especificacion: "",
        rangoMedicion: "",
        lugarMedicion: "",
        conclusion: "",
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
      getEnvironmental()
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

    
      // Send data to server
      if (isEditing) {
        await updateApique(editingInventoryId, formDataToSend);
        showMessage("Datos actualizados correctamente");
      } else {
        await createEnvironmental(formDataToSend);
        showMessage("Apique creado correctamente");
      }

      // Update data list
      const updatedData = await getEnvironmental();
      updateState({ data: updatedData });
      resetForm();
    } catch (error) {
      console.log(error);
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
        // Get samples from API
        let formattedSamples = [];
        try {
          const samplesFromAPI = await getSampleEnvironmentalId(item.id);
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
            nombre: item.nombre,
            codigo: item.codigo,
            norma: item.norma,
            especificacion: item.especificacion,
            rangoMedicion: item.rangoMedicion,
            lugarMedicion: item.lugarMedicion,
            conclusion: item.conclusion,
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
      "nombre",
      "codigo",
      "norma",
      "especificacion",
      "rangoMedicion",
      "lugarMedicion",
      "conclusion",
    ],
    []
  );

  // Get field type
  const getFieldType = useCallback((field) => {
    const typeMap = {
      nombre: "nombre",
      codigo: "numberNum",
      norma: "descripcion",
      especificacion: "descripcion",
      rangoMedicion: "numberNum",
      lugarMedicion: "numberNum",
      conclusion: "descripcion",
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
                  label: "Ambiental",
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
                onDelete={async (item) => {
                  await deleteApique(item.id);
                  updateState({ data: data.filter((p) => p.id !== item.id) });
                }}
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
          title={isEditing ? "Editar Ambiental" : "Nueva Condicion ambiental"}
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
                  <Text style={styles.sectionTitle}>
                    Muestras del ambiental
                  </Text>
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

export default Apiques;
