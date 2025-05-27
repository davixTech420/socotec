import { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Text,
  Card,
  Button,
  useTheme,
  Snackbar,
  ProgressBar,
} from "react-native-paper";
import TablaComponente from "@/components/tablaComponent";
import Breadcrumb from "@/components/BreadcrumbComponent";
import AddComponent from "@/components/AddComponent";
import { AlertaScroll } from "@/components/alerta";
import InputComponent from "@/components/InputComponent";
import {
  getAssignment,
  getMyAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getActiveInventory,
  getCampoUsers,
} from "@/services/employeeService";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useAuth } from "@/context/userContext";
import DropdownComponent from "@/components/DropdownComponent";
import ExcelPreviewButton from "@/components/ExcelViewComponent";
import PDFPreviewButton from "@/components/PdfViewComponent";

const columns = [
  { key: "id", title: "ID", sortable: true, width: 50 },
  { key: "inventoryId", title: "Producto", sortable: true },
  { key: "userId", title: "Asignado", sortable: true, width: 80 },
  { key: "asignadorId", title: "Asignador", sortable: true, width: 100 },
  { key: "fechaConfirmacion", title: "Fecha Recibido", sortable: true },
  { key: "fotoppe", title: "Foto Recibido", sortable: true },
  { key: "fechaRetorno", title: "Fecha Retorno", sortable: true },
  { key: "fotoRetorno", title: "Foto Retorno", sortable: true },
  { key: "estado", title: "Estado", sortable: true },
  { key: "createdAt", title: "Creado", sortable: true },
  { key: "updatedAt", title: "Modificado", sortable: true },
];

export default function Hiring() {
  const [data, setData] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({});
  const [formData, setFormData] = useState({
    inventoryId: "",
    userId: "",
    asignadorId: profileData?.id || "",
    fechaConfirmacion: "",
    fechaRetorno: "",
    fotoppe: "",
    fotoRetorno: "",
    estado: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    text: "",
    type: "success",
  });
  const [photoType, setPhotoType] = useState(""); // "fotoppe" o "fotoRetorno"
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const optionState = [
    { label: "Asignado", value: "Asignado" },
    { label: "Confirmado", value: "Confirmado" },
    { label: "Devuelto", value: "Devuelto" },
  ];
  // Utilidad para convertir base64/dataURL a File
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

  // Función para tomar una foto usando ImagePicker
  const takePhoto = async (type) => {
    setPhotoType(type);
    setIsLoading(true);

    try {
      // Solicitar permisos de cámara
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        // Si los permisos son denegados, mostrar alerta y volver a intentar
        if (Platform.OS !== "web") {
          Alert.alert(
            "Permisos requeridos",
            "Necesitamos acceso a la cámara para tomar fotos. Por favor, concede los permisos.",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Intentar de nuevo",
                onPress: () => takePhoto(type),
              },
            ]
          );
        } else {
          showMessage(
            "Se requieren permisos de cámara para esta función. Por favor, concede los permisos en tu navegador.",
            "error"
          );
        }
        return;
      }

      // Configuración para la cámara - FORZAR USO DE CÁMARA
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.7,
        // Forzar el uso de la cámara, no la galería
        cameraType: ImagePicker.CameraType.back,
        // Asegurar que solo se use la cámara
        presentationStyle: Platform.OS === "ios" ? "fullScreen" : undefined,
        // Deshabilitar selección de galería
        disableGallerySelection: true,
        // En Android, usar la cámara directamente
        forceAndroidCameraPermission: true,
      };

      // Lanzar la cámara
      console.log("Abriendo cámara...");
      showMessage("Abriendo cámara...", "info");

      // Usar launchCameraAsync en lugar de launchImageLibraryAsync
      const result = await ImagePicker.launchCameraAsync(options);
      console.log(
        "Resultado de la cámara:",
        result.canceled ? "Cancelado" : "Foto tomada"
      );

      // Verificar si se canceló la operación
      if (result.canceled) {
        showMessage("Operación cancelada", "info");
        return;
      }

      // Obtener la URI de la imagen
      const imageUri = result.assets[0].uri;

      // Actualizar el estado con la URI de la foto
      setFormData((prev) => ({
        ...prev,
        [photoType]: imageUri,
      }));

      showMessage("Foto tomada correctamente", "success");
    } catch (error) {
      console.error("Error al tomar la foto:", error);
      showMessage(
        `Error al tomar la foto: ${error.message || "Error desconocido"}`,
        "error"
      );

      // Intentar con método alternativo en caso de error
      if (Platform.OS === "web") {
        tryWebCamera(type);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Método alternativo para web en caso de que ImagePicker falle
  const tryWebCamera = async (type) => {
    try {
      showMessage("Intentando método alternativo para web...", "info");

      // Verificar si el navegador soporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Tu navegador no soporta acceso a la cámara");
      }

      // Solicitar permisos explícitamente
      await navigator.mediaDevices.getUserMedia({ video: true });

      // Crear elementos para la captura
      const videoElement = document.createElement("video");
      videoElement.autoplay = true;
      videoElement.style.display = "none";
      document.body.appendChild(videoElement);

      const canvasElement = document.createElement("canvas");
      canvasElement.style.display = "none";
      document.body.appendChild(canvasElement);

      // Obtener stream de la cámara
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      videoElement.srcObject = stream;

      // Esperar a que el video esté listo
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          resolve();
        };
      });

      // Dar tiempo para que la cámara se inicialice
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Capturar imagen
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      const context = canvasElement.getContext("2d");
      context.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Convertir a base64
      const dataUrl = canvasElement.toDataURL("image/jpeg");

      // Actualizar estado
      setFormData((prev) => ({
        ...prev,
        [photoType]: dataUrl,
      }));

      // Limpiar
      stream.getTracks().forEach((track) => track.stop());
      document.body.removeChild(videoElement);
      document.body.removeChild(canvasElement);

      showMessage("Foto tomada correctamente", "success");
    } catch (error) {
      console.error("Error en método alternativo web:", error);
      showMessage(`No se pudo acceder a la cámara: ${error.message}`, "error");
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          // 1. Primero cargamos los datos del usuario (lo más crítico)
          const userData = await user();
          setProfileData(userData);
          // 2. Cargamos en paralelo lo que no depende del usuario
          const [inventario, usuarios] = await Promise.all([
            getActiveInventory(),
            getCampoUsers(),
          ]);
          setInventario(inventario);
          setUsuarios(usuarios);

          // 3. Según el cargo del usuario, cargamos los assignments
          if (userData?.cargo === "Laboratorista") {
            const assignments = await getMyAssignment(userData.id);
            setData(assignments);
          } else {
            const allAssignments = await getAssignment();
            setData(allAssignments);
          }
        } catch (error) {
          console.error("Error loading data:", error);
        }
      };

      loadData();
    }, [])
  );

  //opciones de inventario dropdown
  const inventarioss = inventario.map((user) => ({
    label: user.nombreMaterial,
    value: user.id,
  }));

  const usuarioss = usuarios.map((user) => ({
    label: user.nombre,
    value: user.id,
  }));

  const resetForm = () => {
    setOpenForm(false);
    setIsEditing(false);
    setEditingUserId(null);
    setFormData({
      inventoryId: "",
      userId: "",
      asignadorId: profileData?.id || "",
      fechaConfirmacion: "",
      fechaRetorno: "",
      fotoppe: "",
      fotoRetorno: "",
      estado: "",
    });
  };
  const handleSubmit = useCallback(async () => {
    try {
      const formDataToSend = new FormData();

      // Añadir campos básicos
      formDataToSend.append("inventoryId", formData.inventoryId);
      formDataToSend.append("userId", formData.userId);
      formDataToSend.append("asignadorId", formData.asignadorId || "");
      formDataToSend.append(
        "fechaConfirmacion",
        formData.fechaConfirmacion || ""
      );
      formDataToSend.append("fechaRetorno", formData.fechaRetorno || "");
      formDataToSend.append("estado", formData.estado);

      // Función mejorada para manejar imágenes
      const handleImageUpload = (fieldName, imageData) => {
        if (!imageData) return;

        // Si es dataURL (base64), convertir a File (solo para web)
        if (typeof imageData === "string" && imageData.startsWith("data:")) {
          const filename = `${fieldName}_${Date.now()}.jpg`;
          const file = dataURLtoFile(imageData, filename);
          formDataToSend.append(fieldName, file, file.name);
          return;
        }

        // Caso Web (File object)
        if (imageData instanceof File || imageData instanceof Blob) {
          formDataToSend.append(fieldName, imageData, imageData.name);
          return;
        }

        // Caso React Native (URI local)
        if (
          typeof imageData === "string" &&
          imageData.match(/^(file|content):\/\//)
        ) {
          const filename = imageData.split("/").pop();
          const type = filename.split(".").pop() || "jpeg";
          formDataToSend.append(fieldName, {
            uri: imageData,
            name: filename,
            type: `image/${type}`,
          });
          return;
        }

        // Caso URL remota o ruta existente
        if (typeof imageData === "string") {
          formDataToSend.append(fieldName, imageData);
        }
      };

      // Adjuntar fotos
      await handleImageUpload("fotoppe", formData.fotoppe);
      await handleImageUpload("fotoRetorno", formData.fotoRetorno);

      let response;
      if (isEditing && editingUserId) {
        console.log("data", formDataToSend);
        response = await updateAssignment(editingUserId, formDataToSend);
        response = data.map((item) =>
          item.id === editingUserId ? { ...item, ...formData } : item
        );
      } else {
        response = await createAssignment(formDataToSend);
      }

      // Verificar si la respuesta existe antes de intentar parsearla
      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }

      // Manejar diferentes tipos de respuesta
      const result =
        typeof response.json === "function" ? await response.json() : response;

      if (
        response.ok ||
        (response.status && response.status >= 200 && response.status < 300)
      ) {
        const newData = isEditing
          ? data.map((item) =>
              item.id === editingUserId
                ? { ...item, ...result.assignment }
                : item
            )
          : [...data, result.assignment || result];

        setData(newData);
        setSnackbarMessage({
          text: `Equipo ${isEditing ? "actualizado" : "creado"} exitosamente`,
          type: "success",
        });
        resetForm();
      } else {
        throw new Error(result.error || "Error en la respuesta del servidor");
      }
    } catch (error) {
      resetForm();
      setSnackbarMessage({
        text: error.message || "Error al enviar los datos",
        type: "error",
      });
    } finally {
      setSnackbarVisible(true);
    }
  }, [formData, isEditing, editingUserId, data, resetForm]);

  const handleEdit = useCallback((item) => {
    setFormData({
      inventoryId: item.inventoryId,
      userId: item.userId,
      asignadorId: item.asignadorId,
      fechaConfirmacion: item.fechaConfirmacion,
      fechaRetorno: item.fechaRetorno,
      fotoppe: item.fotoppe,
      fotoRetorno: item.fotoRetorno,
      estado: item.estado,
    });
    setEditingUserId(item.id);
    setIsEditing(true);
    setOpenForm(true);
  }, []);

  const isSmallScreen = width < 600;

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                onPress: () => router.navigate("/(admin)/Dashboard"),
              },
              { label: "Proteccion Personal" },
            ]}
          />
          <View style={styles.headerActions}>
            <PDFPreviewButton
              data={data}
              columns={columns}
              iconStyle={styles.icon}
            />
            <ExcelPreviewButton
              columns={columns}
              data={data}
              iconStyle={styles.icon}
            />
          </View>
        </View>
        <View
          style={[
            styles.cardContainer,
            isSmallScreen && styles.cardContainerSmall,
          ]}
        >
          <Card style={[styles.card, isSmallScreen && styles.cardSmall]}>
            <Card.Content>
              <Text style={styles.cardTitle}>Total de inventario asignado</Text>
              <Text style={styles.cardValue}>{data.length}</Text>
              <ProgressBar
                progress={data.length * 0.01}
                color="#00ACE8"
                style={styles.progressBar}
              />
            </Card.Content>
          </Card>
        </View>
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
                await deleteAssignment(item.id);
                setData((prevData) =>
                  prevData.filter((dataItem) => dataItem.id !== item.id)
                );
              }}
              onDataUpdate={setData}
              onCreate={handleSubmit}
              onEdit={handleEdit}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Indicador de carga */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Card style={styles.loadingCard}>
            <Card.Content style={styles.loadingContent}>
              <Text style={styles.loadingText}>Procesando...</Text>
              <ProgressBar
                indeterminate
                color={theme.colors.primary}
                style={styles.loadingProgress}
              />
            </Card.Content>
          </Card>
        </View>
      )}

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
        title={
          isEditing ? "Editar Proteccion Personal" : "Nueva Proteccion Personal"
        }
        content={
          <View style={styles.formContainer}>
            <DropdownComponent
              options={inventarioss}
              onSelect={(value) => {
                setFormData({ ...formData, inventoryId: value });
              }}
              placeholder="Producto"
              value={formData.inventoryId}
            />

            {/* Sección de fotos de retorno (solo visible si el estado es Confirmado) */}

            {profileData.cargo == "Laboratorista" ||
            profileData.cargo == "Campo" ? (
              <>
                {/* Sección de fotos de confirmación */}
                <View style={styles.containerImages}>
                  <Text style={styles.imagesTitle}>
                    {formData.estado === "Confirmado"
                      ? "Foto de Confirmación"
                      : "Foto Del Equipo"}
                  </Text>

                  {formData.fotoppe ? (
                    <View style={styles.imagePreviewContainer}>
                      <Image
                        source={{ uri: formData.fotoppe }}
                        style={styles.imagePreview}
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() =>
                          setFormData({ ...formData, fotoppe: "" })
                        }
                      >
                        <Text style={styles.removeImageText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={styles.imagesSubtitle}>
                      No hay imagen seleccionada
                    </Text>
                  )}

                  <View style={styles.photoButtonsContainer}>
                    <Button
                      mode="contained"
                      style={styles.buttonImages}
                      icon="camera"
                      onPress={() => takePhoto("fotoppe")}
                      loading={isLoading && photoType === "fotoppe"}
                      disabled={isLoading}
                    >
                      Tomar Foto con Cámara
                    </Button>
                  </View>
                </View>

                {formData.estado === "Confirmado" && (
                  <View style={styles.containerImages}>
                    <Text style={styles.imagesTitle}>Foto de Retorno</Text>

                    {formData.fotoRetorno ? (
                      <View style={styles.imagePreviewContainer}>
                        <Image
                          source={{ uri: formData.fotoRetorno }}
                          style={styles.imagePreview}
                        />
                        <TouchableOpacity
                          style={styles.removeImageButton}
                          onPress={() =>
                            setFormData({ ...formData, fotoRetorno: "" })
                          }
                        >
                          <Text style={styles.removeImageText}>X</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Text style={styles.imagesSubtitle}>
                        No hay imagen seleccionada
                      </Text>
                    )}

                    <View style={styles.photoButtonsContainer}>
                      <Button
                        mode="contained"
                        style={styles.buttonImages}
                        icon="camera"
                        onPress={() => takePhoto("fotoRetorno")}
                        loading={isLoading && photoType === "fotoRetorno"}
                        disabled={isLoading}
                      >
                        Tomar Foto con Cámara
                      </Button>
                    </View>
                  </View>
                )}
              </>
            ) : (
              <>
                <DropdownComponent
                  options={usuarioss}
                  onSelect={(value) => {
                    setFormData({ ...formData, userId: value });
                  }}
                  placeholder="Usuario"
                  value={formData.userId}
                />
                {[
                  "fechaConfirmacion",
                  "fechaRetorno",
                  ...(isEditing ? [] : []),
                ].map((field) => (
                  <InputComponent
                    key={field}
                    type={
                      field === "fechaConfirmacion"
                        ? "date"
                        : field === "fechaRetorno"
                        ? "date"
                        : "text"
                    }
                    value={formData[field]}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, [field]: text }))
                    }
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    placeholder={`Introduce el ${field}`}
                    validationRules={{
                      required:
                        field !== "role" &&
                        field !== "fechaConfirmacion" &&
                        field !== "fechaRetorno",
                      ...(field === "email" && { email: true }),
                    }}
                    errorMessage={`Por favor, introduce un ${field} válido`}
                  />
                ))}

                <DropdownComponent
                  options={optionState}
                  onSelect={(value) => {
                    setFormData({ ...formData, estado: value });
                  }}
                  placeholder="Estado"
                  value={formData.estado}
                />
              </>
            )}
          </View>
        }
        actions={[
          <Button
            key="cancel"
            mode="outlined"
            textColor="black"
            onPress={resetForm}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            mode="contained"
            buttonColor="#00ACE8"
            onPress={handleSubmit}
          >
            {isEditing ? "Actualizar" : "Crear"}
          </Button>,
        ]}
      />

      {profileData.cargo == "Laboratorista" ||
      profileData.cargo == "Campo" ? null : (
        <>
          <AddComponent onOpen={() => setOpenForm(true)} />
        </>
      )}
    </>
  );
}

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
  containerImages: {
    width: "100%",
    padding: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
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
    flex: 1,
    marginHorizontal: 4,
  },
  photoButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 16,
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "white",
    fontWeight: "bold",
  },
  imageScrollView: {
    maxHeight: 300,
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
    }),
  },
  formContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingCard: {
    width: "80%",
    maxWidth: 300,
  },
  loadingContent: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "500",
  },
  loadingProgress: {
    width: "100%",
    height: 6,
  },
});
