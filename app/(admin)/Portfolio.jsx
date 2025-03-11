/* import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, Platform, Image } from 'react-native';
import { PaperProvider, Text, Card, Button, ProgressBar, useTheme, Snackbar,IconButton } from 'react-native-paper';
import { useFocusEffect } from "@react-navigation/native"
import TablaComponente from "@/components/tablaComponent";
import Breadcrumb from "@/components/BreadcrumbComponent";
import { router } from "expo-router";
import AddComponent from '../../components/AddComponent';
import { AlertaScroll } from '@/components/alerta';
import InputComponent from "@/components/InputComponent";
import { createPortfolio, getPortfolio, deletePortfolio, activePortfolio, inactivePortfolio, updatePortfolio } from "@/services/adminServices";
import ExcelPreviewButton from "@/components/ExcelViewComponent";
import PDFViewComponent from '@/components/PdfViewComponent';
import * as ImagePicker from 'expo-image-picker';
import { SrcImagen } from '@/services/publicServices';


const columns = [
  { key: 'id', title: 'ID', sortable: true, width: 50 },
  { key: 'nombre', title: 'Nombre', sortable: true },
  { key: 'cliente', title: 'Cliente', sortable: true, width: 80 },
  { key: 'ubicacion', title: 'Ubicacion', sortable: true, width: 100 },
  { key: 'presupuesto', title: 'Presupuesto', sortable: true },
  { key: 'descripcion', title: 'Descripcion', sortable: true },
  { key: 'superficie', title: 'Superficie', sortable: true },
  { key: 'imagenes', title: 'Imagenes', sortable: true },
  { key: 'estado', title: 'Estado', sortable: true },
  { key: 'createdAt', title: 'Creado', sortable: true },
  { key: 'updatedAt', title: 'Modificado', sortable: true },
];

const Portfolio = () => {
  const [data, setData] = useState([]);
  const [editingInventoryId, setEditingInventoryId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState({ text: "", type: "success" });
  const [formData, setFormData] = useState({
    nombre: '',
    cliente: '',
    ubicacion: '',
    presupuesto: '',
    descripcion: '',
    superficie: "",
    imagenes: [],
    detalle: "",
  });
  const [openForm, setOpenForm] = useState(false);
  //estados de los estilos
  const theme = useTheme();
  const { width } = useWindowDimensions();

  useFocusEffect(
    useCallback(() => {
      getPortfolio().then(setData).catch(console.error)
    }, []),
  );


  const handleSubmit = useCallback(async () => {
    try {
      const requiredFields = isEditing
        ? ['nombre', 'cliente', 'ubicacion', 'presupuesto', 'descripcion', 'superficie', 'detalle']
        : ['nombre', 'cliente', 'ubicacion', 'presupuesto', 'descripcion', 'superficie', 'detalle'];
      const emptyFields = requiredFields.filter(
        (field) => !formData[field] || formData[field].trim() === ''
      );

      if (emptyFields.length > 0) {
        setOpenForm(false);
        throw new Error(`Por favor, rellene los siguientes campos: ${emptyFields.join(', ')}`);
      }

      const form = new FormData();

      // Agregar imágenes al FormData
      for (const image of formData.imagenes) {
        if (Platform.OS === 'web') {
          // En la web, necesitamos convertir la URI en un objeto File o Blob
          const response = await fetch(image.uri);
          const blob = await response.blob();
          const file = new File([blob], image.name, { type: image.type });
          form.append('imagenes', file);
        } else {
          // En móviles, podemos usar el objeto directamente
          form.append('imagenes', {
            uri: image.uri,
            type: image.type,
            name: image.name,
          });
        }
      }

      // Agregar otros datos del formulario al FormData
      for (const key in formData) {
        if (key !== 'imagenes') {
          form.append(key, formData[key]);
        }
      }

      let newData;
      if (isEditing) {
        await updatePortfolio(editingInventoryId, form); // Enviar FormData
        newData = data.map((item) =>
          item.id === editingInventoryId ? { ...item, ...formData } : item
        );
      } else {
        const newUser = await createPortfolio(form); // Enviar FormData
        if (!newUser) throw new Error('Error al crear el portafolio');
        newData = [...data, newUser.proyect];
      }
      setData(newData);
      setSnackbarMessage({
        text: `Portafolio ${isEditing ? 'actualizado' : 'creado'} exitosamente`,
        type: 'success',
      });
      resetForm();
    } catch (error) {
      setSnackbarMessage({ text: error.message, type: 'error' });
    } finally {
      setSnackbarVisible(true);
    }
  }, [formData, isEditing, editingInventoryId, data]);



  const resetForm = () => {
    setOpenForm(false)
    setIsEditing(false)
    setEditingInventoryId(null)
    setFormData({ nombre: "", cliente: "", ubicacion: "", presupuesto: "", descripcion: "", superficie: "", imagenes: [], detalle: "" })
  }

  const handleAction = useCallback(async (action, item) => {
    try {
      await action(item.id)
      setData((prevData) =>
        prevData.map((dataItem) =>
          dataItem.id === item.id ? { ...dataItem, estado: action === activePortfolio } : dataItem,
        ),
      )
    } catch (error) {
      console.error(`Error al ${action === activePortfolio ? "activar" : "desactivar"} el usuario:`, error)
    }
  }, [])

  const handleEdit = useCallback((item) => {
    setFormData({
      nombre: item.nombre,
      cliente: item.cliente,
      ubicacion: item.ubicacion,
      presupuesto: item.presupuesto,
      descripcion: item.descripcion,
      superficie: item.superficie,
      imagenes: item.imagenes,
      detalle: item.detalle,
    })
    setEditingInventoryId(item.id)
    setIsEditing(true)
    setOpenForm(true)
  }, [])

 
  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos para acceder a la galería.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri, // URI de la imagen seleccionada
          type: asset.type,
          name: asset.uri.split('/').pop(),
          isFromAPI: false, // Marca la imagen como nueva (no proviene de la API)
        }));

        console.log('Nuevas imágenes seleccionadas:', newImages); // Depuración

        setFormData((prevData) => ({
          ...prevData,
          imagenes: [...prevData.imagenes, ...newImages],
        }));
      }
    } catch (error) {
      console.error('Error seleccionando imágenes:', error);
    }
  };

  const removeImage = (index) => {
    setFormData((prevData) => {
      const newImages = [...prevData.imagenes];
      newImages.splice(index, 1);
      return { ...prevData, imagenes: newImages };
    });    
  };








 
  const totalItems = data.length;


  const calculateProgress = (value, max) => {
    const progress = Math.min(Math.max(value / max, 0), 1);
    return parseFloat(progress.toFixed(2));
  };
  const itemsProgress = calculateProgress(totalItems, 1000);

  const isSmallScreen = width < 600;
  return (
    <>
      <PaperProvider theme={theme}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Breadcrumb
              items={[
                {
                  label: 'Dashboard',
                  onPress: () => router.navigate('/(admin)/Dashboard'),
                },
                {
                  label: 'Portafolio'
                }
              ]}
            />
            <View style={styles.headerActions}>
              <PDFViewComponent data={data} columns={columns} iconStyle={styles.icon} />
              <ExcelPreviewButton columns={columns} data={data} iconStyle={styles.icon} />
            </View>
          </View>
          <View style={[styles.cardContainer, isSmallScreen && styles.cardContainerSmall]}>
            <Card style={[styles.card, isSmallScreen && styles.cardSmall]}>
              <Card.Content>
                <Text style={styles.cardTitle}>Total de Productos</Text>
                <Text style={styles.cardValue}>{totalItems}</Text>
                <ProgressBar
                  progress={itemsProgress}
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
                  await deletePortfolio(item.id)
                  setData((prevData) => prevData.filter((dataItem) => dataItem.id !== item.id))
                }}
                onToggleActive={(item) => handleAction(activePortfolio, item)}
                onToggleInactive={(item) => handleAction(inactivePortfolio, item)}
                onDataUpdate={setData}
                onCreate={handleSubmit}
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
          <Text style={{ color: theme.colors.surface }}>{snackbarMessage.text}</Text>
        </Snackbar>

        <AlertaScroll onOpen={openForm} onClose={resetForm} title={isEditing ? "Editar Proyecto de portafolio" : "Nuevo proyecto de portafolio"} content={

          <View style={{
            flexDirection: isSmallScreen ? "column" : 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
            {["nombre", "cliente", "ubicacion", "presupuesto", "descripcion", "superficie", "detalle"].map((field) => (
              <InputComponent
                key={field}
                type={
                  field === "nombre"
                    ? "nombre"
                    : field === "cliente"
                      ? "descripcion"
                      : field === "ubicacion"
                        ? "ubicacion"
                        : field === "presupuesto"
                          ? "precio"
                          : field === "descripcion"
                            ? "descripcion"
                            : field === "superficie"
                              ? "superficie"
                              : field === "detalle"
                                ? "descripcion"
                                : "text"
                }
                value={formData[field]}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, [field]: text }))}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                placeholder={`Introduce el ${field}`}
                validationRules={{ required: field !== "descripcion", ...(field === "descripcion") }}
                errorMessage={`Por favor, introduce un ${field} válido`}
              />
            ))}
            <View style={styles.containerImages}>
              <Button mode="contained" onPress={pickImages} style={styles.buttonImages}>
                Seleccionar Imágenes
              </Button>
              <ScrollView>
              {formData.imagenes.map((image, index) => {
          console.log('URI de la imagen:', image.isFromAPI ? SrcImagen(image.uri) : image.uri); // Depuración
          return (
            <Card key={index} style={styles.cardImages}>
              <Card.Content>
                <Image
                  source={{ uri: image.isFromAPI ? SrcImagen(image.uri) : image.uri }}
                  style={styles.images}
                />
                <IconButton
                  icon="close"
                  onPress={() => removeImage(index)}
               
                />
              </Card.Content>
            </Card>
          );
        })}
              </ScrollView>
            </View>
          </View>
        } actions={[<Button onPress={resetForm}>Cancelar</Button>, <Button onPress={handleSubmit}>{isEditing ? "Actualizar" : "Crear"}</Button>]} />
      </PaperProvider>
      <AddComponent onOpen={() => setOpenForm(true)} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardContainerSmall: {
    flexDirection: 'column',
  },
  card: {
    width: '48%',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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
    width: '100%',
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  containerImages: {
    flex: 1,
    padding: 16,
  },
  buttonImages: {
    marginBottom: 16,
  },
  cardImages: {
    marginBottom: 16,
  },
  images: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
});
export default Portfolio; */




import { useCallback, useState } from "react"
import { View, StyleSheet, ScrollView, useWindowDimensions, Platform, Image, TouchableOpacity } from "react-native"
import {
  PaperProvider,
  Text,
  Card,
  Button,
  ProgressBar,
  useTheme,
  Snackbar,
  IconButton,
  ActivityIndicator,
} from "react-native-paper"
import { useFocusEffect } from "@react-navigation/native"
import TablaComponente from "@/components/tablaComponent"
import Breadcrumb from "@/components/BreadcrumbComponent"
import { router } from "expo-router"
import AddComponent from "../../components/AddComponent"
import { AlertaScroll } from "@/components/alerta"
import InputComponent from "@/components/InputComponent"
import {
  createPortfolio,
  getPortfolio,
  deletePortfolio,
  activePortfolio,
  inactivePortfolio,

  updatePortfolio,
} from "@/services/adminServices"
import ExcelPreviewButton from "@/components/ExcelViewComponent"
import PDFViewComponent from "@/components/PdfViewComponent"
import * as ImagePicker from "expo-image-picker"
import { SrcImagen } from "@/services/publicServices"

const columns = [
  { key: "id", title: "ID", sortable: true, width: 50 },
  { key: "nombre", title: "Nombre", sortable: true },
  { key: "cliente", title: "Cliente", sortable: true, width: 80 },
  { key: "ubicacion", title: "Ubicacion", sortable: true, width: 100 },
  { key: "presupuesto", title: "Presupuesto", sortable: true },
  { key: "descripcion", title: "Descripcion", sortable: true },
  { key: "superficie", title: "Superficie", sortable: true },
  { key: "imagenes", title: "Imagenes", sortable: true },
  { key: "estado", title: "Estado", sortable: true },
  { key: "createdAt", title: "Creado", sortable: true },
  { key: "updatedAt", title: "Modificado", sortable: true },
]

const Portfolio = () => {
  const [data, setData] = useState([])
  const [editingInventoryId, setEditingInventoryId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState({ text: "", type: "success" })
  const [formData, setFormData] = useState({
    nombre: "",
    cliente: "",
    ubicacion: "",
    presupuesto: "",
    descripcion: "",
    superficie: "",
    imagenes: [],
    detalle: "",
  })
  const [openForm, setOpenForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState({})

  // Estados de los estilos
  const theme = useTheme()
  const { width } = useWindowDimensions()
  const isSmallScreen = width < 600
  const isMobile = Platform.OS !== "web"

  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      getPortfolio()
        .then(setData)
        .catch((error) => {
          console.error("Error fetching portfolio data:", error)
          setSnackbarMessage({ text: "Error al cargar los datos", type: "error" })
          setSnackbarVisible(true)
        })
        .finally(() => setLoading(false))
    }, []),
  )

  // Función para validar campos requeridos sin afectar a las imágenes
  const validateRequiredFields = useCallback((data, requiredFields) => {
    const emptyFields = requiredFields.filter(
      (field) => !data[field] || (typeof data[field] === "string" && data[field].trim() === ""),
    )
    return emptyFields
  }, [])

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true)
      const requiredFields = ["nombre", "cliente", "ubicacion", "presupuesto", "descripcion", "superficie", "detalle"]
      const emptyFields = validateRequiredFields(formData, requiredFields)

      if (emptyFields.length > 0) {
        throw new Error(`Por favor, rellene los siguientes campos: ${emptyFields.join(", ")}`)
      }

      const form = new FormData()

      // Agregar imágenes al FormData
      if (formData.imagenes && formData.imagenes.length > 0) {
        for (const image of formData.imagenes) {
          if (image.isFromAPI && isEditing) {
            // Para imágenes existentes de la API durante la edición
            form.append("imagenes", image.uri)
          } else if (Platform.OS === "web") {
            try {
              // En la web, convertir la URI en un objeto File o Blob
              const response = await fetch(image.uri)
              const blob = await response.blob()
              const fileName = image.name || `image-${Date.now()}.jpg`
              const fileType = image.type || "image/jpeg"
              const file = new File([blob], fileName, { type: fileType })
              form.append("imagenes", file)
            } catch (error) {
              console.error("Error processing web image:", error)
              // Si hay un error, intentar enviar la URI directamente
              form.append("imagenes", image.uri)
            }
          } else {
            // En móviles, usar el objeto directamente
            form.append("imagenes", {
              uri: image.uri,
              type: image.type || "image/jpeg",
              name: image.name || `image-${Date.now()}.jpg`,
            })
          }
        }
      }

      // Agregar otros datos del formulario al FormData
      for (const key in formData) {
        if (key !== "imagenes" && formData[key] !== undefined) {
          form.append(key, formData[key])
        }
      }

      let newData
      if (isEditing) {
        await updatePortfolio(editingInventoryId, form)
        newData = data.map((item) => (item.id === editingInventoryId ? { ...item, ...formData } : item))
      } else {
        const newUser = await createPortfolio(form)
        if (!newUser) throw new Error("Error al crear el proyecto")
        newData = [...data, newUser.proyect]
      }

      setData(newData)
      setSnackbarMessage({
        text: `Portafolio ${isEditing ? "actualizado" : "creado"} exitosamente`,
        type: "success",
      })
      resetForm()
    } catch (error) {
      console.error("Error in handleSubmit:", error)
      setSnackbarMessage({ text: error.message, type: "error" })
    } finally {
      setLoading(false)
      setSnackbarVisible(true)
    }
  }, [formData, isEditing, editingInventoryId, data, validateRequiredFields])

  const resetForm = () => {
    setOpenForm(false)
    setIsEditing(false)
    setEditingInventoryId(null)
    setFormData({
      nombre: "",
      cliente: "",
      ubicacion: "",
      presupuesto: "",
      descripcion: "",
      superficie: "",
      imagenes: [],
      detalle: "",
    })
  }

  const handleAction = useCallback(async (action, item) => {
    try {
      setLoading(true)
      await action(item.id)
      setData((prevData) =>
        prevData.map((dataItem) =>
          dataItem.id === item.id ? { ...dataItem, estado: action === activePortfolio } : dataItem,
        ),
      )
    } catch (error) {
      console.error(`Error al ${action === activePortfolio ? "activar" : "desactivar"} el proyecto:`, error)
      setSnackbarMessage({
        text: `Error al ${action === activePortfolio ? "activar" : "desactivar"} el proyecto`,
        type: "error",
      })
      setSnackbarVisible(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleEdit = useCallback((item) => {
    try {
      // Format images from API to include isFromAPI flag
      const formattedImages = Array.isArray(item.imagenes)
        ? item.imagenes.map((img) => ({
            uri: typeof img === "string" ? img : img.uri || "",
            type: "image/jpeg", // Default type if not available
            name: typeof img === "string" ? img.split("/").pop() || "image.jpg" : img.name || "image.jpg",
            isFromAPI: true, // Mark as coming from API
          }))
        : []

      setFormData({
        nombre: item.nombre || "",
        cliente: item.cliente || "",
        ubicacion: item.ubicacion || "",
        presupuesto: item.presupuesto || "",
        descripcion: item.descripcion || "",
        superficie: item.superficie || "",
        imagenes: formattedImages,
        detalle: item.detalle || "",
      })
      setEditingInventoryId(item.id)
      setIsEditing(true)
      setOpenForm(true)
    } catch (error) {
      console.error("Error in handleEdit:", error)
      setSnackbarMessage({ text: "Error al editar el proyecto", type: "error" })
      setSnackbarVisible(true)
    }
  }, [])

  const pickImages = async () => {
    try {
      // Solo solicitar permisos en dispositivos móviles
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== "granted") {
          alert("Se necesitan permisos para acceder a la galería.")
          return
        }
      }

      const pickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8, // Reducir calidad para mejorar rendimiento
        allowsEditing: false,
      }

      const result = await ImagePicker.launchImageLibraryAsync(pickerOptions)

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.type || "image/jpeg",
          name: asset.fileName || asset.uri.split("/").pop() || `image-${Date.now()}.jpg`,
          isFromAPI: false,
        }))

        setFormData((prevData) => ({
          ...prevData,
          imagenes: [...prevData.imagenes, ...newImages],
        }))
      }
    } catch (error) {
      console.error("Error seleccionando imágenes:", error)
      setSnackbarMessage({ text: "Error al seleccionar imágenes", type: "error" })
      setSnackbarVisible(true)
    }
  }

  const removeImage = (index) => {
    setFormData((prevData) => {
      const newImages = [...prevData.imagenes]
      newImages.splice(index, 1)
      return { ...prevData, imagenes: newImages }
    })
  }

  // Para evitar problemas de precisión
  const totalItems = data.length
  // Calculamos los progress con valores seguros
  const calculateProgress = (value, max) => {
    const progress = Math.min(Math.max(value / max, 0), 1)
    return Number.parseFloat(progress.toFixed(2))
  }
  const itemsProgress = calculateProgress(totalItems, 1000)

  // Función para manejar errores de carga de imágenes
  const handleImageLoadStart = (index) => {
    setImageLoading((prev) => ({ ...prev, [index]: true }))
  }

  const handleImageLoadEnd = (index) => {
    setImageLoading((prev) => ({ ...prev, [index]: false }))
  }

  const handleImageError = (index, error) => {
    console.log(`Error loading image at index ${index}:`, error)
    setImageLoading((prev) => ({ ...prev, [index]: false }))
  }

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
                  label: "Portafolio",
                },
              ]}
            />
            <View style={styles.headerActions}>
              <PDFViewComponent data={data} columns={columns} iconStyle={styles.icon} />
              <ExcelPreviewButton columns={columns} data={data} iconStyle={styles.icon} />
            </View>
          </View>
          <View style={[styles.cardContainer, isSmallScreen && styles.cardContainerSmall]}>
            <Card style={[styles.card, isSmallScreen && styles.cardSmall]}>
              <Card.Content>
                <Text style={styles.cardTitle}>Total de Proyectos</Text>
                <Text style={styles.cardValue}>{totalItems}</Text>
                <ProgressBar progress={itemsProgress} color="#00ACE8" style={styles.progressBar} />
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
                  setLoading(true)
                  try {
                    await deletePortfolio(item.id)
                    setData((prevData) => prevData.filter((dataItem) => dataItem.id !== item.id))
                    setSnackbarMessage({ text: "Proyecto eliminado exitosamente", type: "success" })
                  } catch (error) {
                    console.error("Error deleting portfolio:", error)
                    setSnackbarMessage({ text: "Error al eliminar el proyecto", type: "error" })
                  } finally {
                    setLoading(false)
                    setSnackbarVisible(true)
                  }
                }}
                onToggleActive={(item) => handleAction(activePortfolio, item)}
                onToggleInactive={(item) => handleAction(inactivePortfolio, item)}
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
          <Text style={{ color: theme.colors.surface }}>{snackbarMessage.text}</Text>
        </Snackbar>

        <AlertaScroll
          onOpen={openForm}
          onClose={resetForm}
          title={isEditing ? "Editar Proyecto de portafolio" : "Nuevo proyecto de portafolio"}
          content={
            <View
              style={{
                flexDirection: isSmallScreen ? "column" : "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <View style={isSmallScreen ? styles.fullWidth : { width: "48%" }}>
                {["nombre", "cliente", "ubicacion", "presupuesto"].map((field) => (
                  <InputComponent
                    key={field}
                    type={
                      field === "nombre"
                        ? "nombre"
                        : field === "cliente"
                          ? "descripcion"
                          : field === "ubicacion"
                            ? "ubicacion"
                            : field === "presupuesto"
                              ? "precio"
                              : "text"
                    }
                    value={formData[field]}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, [field]: text }))}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    placeholder={`Introduce el ${field}`}
                    validationRules={{ required: true }}
                    errorMessage={`Por favor, introduce un ${field} válido`}
                  />
                ))}
              </View>

              <View style={isSmallScreen ? styles.fullWidth : { width: "48%" }}>
                {["descripcion", "superficie", "detalle"].map((field) => (
                  <InputComponent
                    key={field}
                    type={
                      field === "descripcion"
                        ? "descripcion"
                        : field === "superficie"
                          ? "superficie"
                          : field === "detalle"
                            ? "descripcion"
                            : "text"
                    }
                    value={formData[field]}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, [field]: text }))}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    placeholder={`Introduce el ${field}`}
                    validationRules={{ required: true }}
                    errorMessage={`Por favor, introduce un ${field} válido`}
                    multiline={field === "descripcion" || field === "detalle"}
                    numberOfLines={field === "descripcion" || field === "detalle" ? 4 : 1}
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

                <Button mode="contained" onPress={pickImages} style={styles.buttonImages} icon="image-plus">
                  Seleccionar Imágenes
                </Button>

                {formData.imagenes.length > 0 && (
                  <ScrollView
                    horizontal={!isSmallScreen}
                    style={styles.imageScrollView}
                    contentContainerStyle={styles.imageScrollContent}
                  >
                    {formData.imagenes.map((image, index) => (
                      <Card
                        key={index}
                        style={[styles.cardImages, isSmallScreen ? styles.cardImagesSmall : styles.cardImagesLarge]}
                      >
                        <Card.Content style={styles.cardImageContent}>
                          <View style={styles.imageContainer}>
                            {imageLoading[index] && (
                              <View style={styles.imageLoadingOverlay}>
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                              </View>
                            )}
                            <Image
                              source={{
                                uri: image.isFromAPI ? SrcImagen(image.uri) : image.uri,
                              }}
                              style={styles.images}
                              onLoadStart={() => handleImageLoadStart(index)}
                              onLoad={() => handleImageLoadEnd(index)}
                              onError={(e) => handleImageError(index, e.nativeEvent.error)}
                            />
                            <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                              <IconButton icon="close-circle" size={24} iconColor="#fff" style={styles.removeIcon} />
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
            </View>
          }
          actions={[
            <Button
              key="cancel" // Added key prop here
              onPress={resetForm}
              mode="outlined"
              style={styles.formButton}
              disabled={loading}
            >
              Cancelar
            </Button>,
            <Button
              onPress={handleSubmit}
              mode="contained"
              style={styles.formButton}
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
  )
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
})

export default Portfolio

