import { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
  Image,
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
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import TablaComponente from "@/components/tablaComponent";
import Breadcrumb from "@/components/BreadcrumbComponent";
import { AlertaScroll } from "@/components/alerta";
import AddComponent from "../../components/AddComponent";
import InputComponent from "@/components/InputComponent";
import {
  updateApique,
  getApique,
  createApique,
  deleteApique,
} from "@/services/adminServices";
import * as ImagePicker from "expo-image-picker";
import { SrcImagen } from "@/services/publicServices";
import { router } from "expo-router";

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

const Apiques = () => {
  const [data, setData] = useState([]);
  const [editingInventoryId, setEditingInventoryId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    text: "",
    type: "success",
  });
  const [formData, setFormData] = useState({
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
  });
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({});

  // Estados de los estilos
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;

  // Función para convertir base64/dataURL a File (adaptada del componente hiring)
  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  // Función para mostrar mensajes al usuario
  const showMessage = (text, type = "info") => {
    setSnackbarMessage({ text, type });
    setSnackbarVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getApique()
        .then(setData)
        .catch((error) => {
          setSnackbarMessage({
            text: "Error al cargar los datos",
            type: "error",
          });
          setSnackbarVisible(true);
        })
        .finally(() => setLoading(false));
    }, [])
  );

  const resetForm = () => {
    setOpenForm(false);
    setIsEditing(false);
    setEditingInventoryId(null);
    setFormData({
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
    });
  };

  // HandleSubmit adaptado del componente hiring
  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);

      const formDataToSend = new FormData();

      // Añadir campos básicos
      Object.keys(formData).forEach((key) => {
        if (key !== "imagenes" && formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Función mejorada para manejar imágenes (adaptada del componente hiring)
      const handleImageUpload = (imageData, index) => {
        if (!imageData) return;

        const fieldName = "imagenes"; // Para múltiples imágenes

        // Si es dataURL (base64), convertir a File (solo para web)
        if (
          typeof imageData.uri === "string" &&
          imageData.uri.startsWith("data:")
        ) {
          const filename = imageData.name || `image_${Date.now()}_${index}.jpg`;
          const file = dataURLtoFile(imageData.uri, filename);
          formDataToSend.append(fieldName, file, file.name);
          return;
        }

        // Caso Web (File object)
        if (imageData.file instanceof File || imageData.file instanceof Blob) {
          formDataToSend.append(fieldName, imageData.file, imageData.name);
          return;
        }

        // Caso React Native (URI local)
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

        // Caso imagen existente de la API
        if (imageData.isFromAPI && typeof imageData.uri === "string") {
          formDataToSend.append(fieldName, imageData.uri);
        }
      };

      // Manejar imágenes en formData
      formData.imagenes.forEach((imageData, index) => {
        handleImageUpload(imageData, index);
      });

      // Lógica para enviar datos al servidor
      if (isEditing) {
        console.log(formDataToSend);
        await updateApique(editingInventoryId, formDataToSend);
        showMessage("Datos actualizados correctamente");
      } else {
        await createApique(formDataToSend);
        showMessage("Apique creado correctamente");
      }

      // Actualizar la lista de datos después de la operación
      getApique().then(setData);
    } catch (error) {
      setSnackbarMessage({
        text: "Error al procesar los datos",
        type: "error",
      });
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
      resetForm();
    }
  }, [formData, isEditing, editingInventoryId]);

  const handleEdit = useCallback((item) => {
    try {
      // Format images from API to include isFromAPI flag
      const formattedImages = Array.isArray(item.imagenes)
        ? item.imagenes.map((img) => ({
            uri: typeof img === "string" ? img : img.uri || "",
            type: "image/jpeg", // Default type if not available
            name:
              typeof img === "string"
                ? img.split("/").pop() || "image.jpg"
                : img.name || "image.jpg",
            isFromAPI: true, // Mark as coming from API
          }))
        : [];
      setFormData({
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
      });
      setEditingInventoryId(item.id);
      setIsEditing(true);
      setOpenForm(true);
      console.log("formu", formData);
    } catch (error) {
      console.error("Error in handleEdit:", error);
      setSnackbarMessage({
        text: "Error al editar el proyecto",
        type: "error",
      });
      setSnackbarVisible(true);
    }
  }, []);

  const pickImages = async () => {
    try {
      // Solicitar permisos en dispositivos móviles
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permisos requeridos",
            "Necesitamos acceso a la galería para seleccionar fotos.",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Intentar de nuevo",
                onPress: pickImages,
              },
            ]
          );
          return;
        }
      }

      const pickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7, // Misma calidad que en takePhoto
        allowsEditing: false,
        // Opciones adicionales para consistencia
        aspect: [4, 3], // Misma relación de aspecto que en takePhoto
      };

      const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImages = result.assets.map((asset) => {
          // Para web, convertir a File object si es data URL
          if (Platform.OS === "web" && asset.uri.startsWith("data:")) {
            const file = dataURLtoFile(
              asset.uri,
              asset.fileName || `image-${Date.now()}.jpg`
            );
            return {
              file, // Guardar el File object para web
              uri: asset.uri,
              type: asset.type || "image/jpeg",
              name: asset.fileName || file.name,
              isFromAPI: false,
            };
          }

          // Para móviles, usar el mismo formato que en takePhoto
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

        setFormData((prevData) => ({
          ...prevData,
          imagenes: [...prevData.imagenes, ...newImages],
        }));
      }
    } catch (error) {
      console.error("Error seleccionando imágenes:", error);
      setSnackbarMessage({
        text: `Error al seleccionar imágenes: ${
          error.message || "Error desconocido"
        }`,
        type: "error",
      });
      setSnackbarVisible(true);
    }
  };

  const removeImage = (index) => {
    setFormData((prevData) => {
      const newImages = [...prevData.imagenes];
      newImages.splice(index, 1);
      return { ...prevData, imagenes: newImages };
    });
  };

  const handleImageLoadStart = (index) => {
    setImageLoading((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageLoadEnd = (index) => {
    setImageLoading((prev) => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index, error) => {
    console.log(`Error loading image at index ${index}:`, error);
    setImageLoading((prev) => ({ ...prev, [index]: false }));
  };

  const totalItems = data.length;

  const calculateProgress = (value, max) => {
    const progress = Math.min(Math.max(value / max, 0), 1);
    return Number.parseFloat(progress.toFixed(2));
  };
  const itemsProgress = calculateProgress(totalItems, 1000);
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
                onDelete={async (item) => {
                  await deleteApique(item.id);
                  setData(data.filter((p) => p.id !== item.id));
                }}
                onDataUpdate={setData}
                onCreate={() => setOpenForm(true)}
                onEdit={handleEdit}
              />
            </Card.Content>
          </Card>
        </ScrollView>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={{ backgroundColor: theme.colors[snackbarMessage.type] }}
          action={{ label: "Cerrar", onPress: () => setSnackbarVisible(false) }}
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
              <View style={isSmallScreen ? styles.fullWidth : { width: "48%" }}>
                {[
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
                ].map((field) => (
                  <InputComponent
                    key={field}
                    type={
                      field === "informeNum"
                        ? "numberNum"
                        : field === "cliente"
                        ? "nombre"
                        : field === "tituloObra"
                        ? "titulo"
                        : field === "localizacion"
                        ? "ubicacion"
                        : field == "albaranNum"
                        ? "numberNum"
                        : field == "fechaEjecucionInicio"
                        ? "date"
                        : field == "fechaEjecucionFinal"
                        ? "date"
                        : field == "fechaEmision"
                        ? "date"
                        : field == "tipo"
                        ? "tipo"
                        : field == "operario"
                        ? "nombre"
                        : field == "largoApique"
                        ? "superficie"
                        : field == "anchoApique"
                        ? "superficie"
                        : field == "profundidadApique"
                        ? "superficie"
                        : field == "observaciones"
                        ? "descripcion"
                        : "text"
                    }
                    value={formData[field]}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, [field]: text }))
                    }
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    placeholder={`Introduce el ${field}`}
                    validationRules={{ required: true }}
                    errorMessage={`Por favor, introduce un ${field} válido`}
                  />
                ))}
              </View>

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
                              onError={(e) =>
                                handleImageError(index, e.nativeEvent.error)
                              }
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
      </PaperProvider>
      <AddComponent onOpen={() => setOpenForm(true)} />
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
  headerActions: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 16,
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
