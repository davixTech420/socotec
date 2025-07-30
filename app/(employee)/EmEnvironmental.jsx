import React, { useCallback, useState, useEffect, useMemo, memo } from "react";
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
  setNativeProps,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import TablaComponente from "@/components/tablaComponent";
import Breadcrumb from "@/components/BreadcrumbComponent";
import { AlertaScroll } from "@/components/alerta";
import InputComponent from "@/components/InputComponent";
import { useAuth } from "@/context/userContext";
import {
  updateEnvironmental,
  getEnvironmental,
  createEnvironmental,
  getSampleEnvironmentalId,
} from "@/services/employeeService";
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
                {sample.sampleNum || `Registro ${index + 1}`}
              </Text>
            </View>
            <View style={styles.sampleActions}>
              {/*
            <IconButton
                iconColor="#00ACE8"
                icon="pencil"
                size={16}
                onPress={() => onEdit(index)}
                style={styles.actionButton}
              />
            
            */}

              <IconButton
                key="submit"
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
              Fecha Ejecucion: {sample.fechaEjecucion || "N/A"}
            </Text>
            <Text style={styles.sampleDetailText}>
              Hora: {sample.hora || "N/A"}
            </Text>
            <Text style={styles.sampleDetailText}>
              Temperatura: {sample.temperatura || "N/A"}
            </Text>
            <Text style={styles.sampleDetailText}>
              Humedad: {sample.humedad || "N/A"}
            </Text>
            <Text style={styles.sampleDetailText}>
              Firma: {sample.firma || "Sin descripción"}
            </Text>
            <Text style={styles.sampleDetailText}>
              Observaciones: {sample.observaciones || "N/A"}
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
    const [profileData, setProfileData] = useState(null);
    const { user } = useAuth();

    const [sampleData, setSampleData] = useState({
      fechaEjecucion: "",
      hora: "",
      temperatura: "",
      humedad: "",
      firma: "",
      observaciones: "",
    });
    useEffect(() => {
      const fetchData = async () => {
        try {
          const userData = await user();
          setProfileData(userData);
          setSampleData((prev) => ({ ...prev, firma: userData.nombre })); // Actualiza solo la firma
        } catch (error) {
          console.error("Error al cargar el usuario:", error);
        }
      };

      fetchData();
    }, [user]);

    React.useEffect(() => {
      if (isEditing && editingSample) {
        setSampleData(editingSample);
      } else {
        setSampleData({
          fechaEjecucion: new Date().toISOString().split("T")[0],
          hora: new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }),
          temperatura: "",
          humedad: "",
          firma: profileData && profileData.nombre,
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
        title={isEditing ? "Editar registro" : "Nuevo registro"}
        content={
          <View style={styles.sampleFormContainer}>
            {/* <InputComponent
              editable={false}
              type="date"
              value={sampleData.fechaEjecucion}
              onChangeText={(text) => handleInputChange("fechaEjecucion", text)}
              label="Fecha Ejecucion"
              placeholder="Ej: 1"
              validationRules={{ required: true }}
              errorMessage="Por favor, introduce una fecha valida"
            /> */}

            {/*  <InputComponent
              editable={false}
              type="profundidad"
              value={sampleData.hora}
              onChangeText={(text) => handleInputChange("hora", text)}
              label="Hora"
              placeholder="Ej: 15"
            /> */}

            <InputComponent
              type="temperature"
              value={sampleData.temperatura}
              onChangeText={(text) => handleInputChange("temperatura", text)}
              label="Temperatura)"
              placeholder="Ej: 15"
            />

            <InputComponent
              type="pdc"
              value={sampleData.humedad}
              onChangeText={(text) => handleInputChange("humedad", text)}
              label="Humedad"
              placeholder="Ej: 12.5"
            />

            {/*   <InputComponent
              editable={false}
              type="nombre"
              value={sampleData.firma}
              onChangeText={(text) => handleInputChange("firma", text)}
              label="Firma"
              placeholder="Firma"
            /> */}

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
const EmEnvironmental = () => {
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
        await updateEnvironmental(editingInventoryId, formDataToSend);
        showMessage("Datos actualizados correctamente");
      } else {
        await createEnvironmental(formDataToSend);
        showMessage("Condicion ambiental creada correctamente");
      }

      // Update data list
      const updatedData = await getEnvironmental();
      updateState({ data: updatedData });
      resetForm();
    } catch (error) {
      console.log(error);
      updateState({sampleFormVisible:false,openForm:false});
      showMessage(`Error al procesar los datos ${error.response.data.message}`, "error");
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
          showMessage(
            "Error al cargar los registros de la condicion ambiental",
            "error"
          );
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
        showMessage("Error al editar la condicion ambiental", "error");
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
      nombre: "muestra",
      codigo: "numberNum",
      norma: "descripcion",
      especificacion: "descripcion",
      rangoMedicion: "espresor",
      lugarMedicion: "ubicacion",
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
                  label: "Condiciones Ambientales",
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
                <Text style={styles.cardTitle}>Total de archivos</Text>
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
        {/*   <AddComponent onOpen={() => updateState({ openForm: true })} /> */}

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
          title={
            isEditing
              ? "Editar Condicion Ambiental"
              : "Nueva Condicion ambiental"
          }
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
                    editable={false}
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
                  <Text style={styles.sectionTitle}>Registros Diarios</Text>
                  <Button
                    mode="contained"
                    onPress={handleAddSample}
                    style={styles.addSampleButton}
                    icon="plus"
                    compact
                  >
                    Agregar registros
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
                      No hay registros agregadas
                    </Text>
                    <Text style={styles.noSamplesSubtext}>
                      Presiona "Agregar registros" para comenzar
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
  divider: {
    marginVertical: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  formButton: {
    minWidth: 120,
  },
});

export default EmEnvironmental;
