import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, Platform, Image } from 'react-native';
import { PaperProvider, Text, Card, Button, ProgressBar, useTheme, Snackbar,IconButton } from 'react-native-paper';
import { useFocusEffect } from "@react-navigation/native"
import TablaComponente from "@/components/tablaComponent";
import Breadcrumb from "@/components/BreadcrumbComponent";
import { router } from "expo-router";
import AddComponent from '../../components/AddComponent';
import { AlertaScroll } from '@/components/alerta';
import InputComponent from "@/components/InputComponent";
import { createPortfolio, getPortfolio, deletePortfolio, activePortfolio, inactivePortfolio, updateInventory } from "@/services/adminServices";
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

  /*  const handleSubmit = useCallback(async () => {
     try {
       const requiredFields = isEditing ? ["nombre", "cliente", "ubicacion", "presupuesto", "descripcion", "superficie","detalle"] : ["nombre", "cliente", "ubicacion", "presupuesto", "descripcion", "superficie","detalle"];
       const emptyFields = requiredFields.filter((field) => !formData[field] || formData[field].trim() === "")
 
       if (emptyFields.length > 0) {
         setOpenForm(false);
         throw new Error(`Por favor, rellene los siguientes campos: ${emptyFields.join(", ")}`);
       }
 
       let newData
       if (isEditing) {
         await updateInventory(editingInventoryId, formData)
         newData = data.map((item) => (item.id === editingInventoryId ? { ...item, ...formData } : item))
       } else {
         console.log("crear",formData);
         
         const newUser = await createPortfolio(formData)
         if (!newUser) throw new Error("Error al crear el usuario")
         newData = [...data, newUser.inventory]
       }
       setData(newData)
       setSnackbarMessage({
         text: `Portafolio ${isEditing ? "actualizado" : "creado"} exitosamente`,
         type: "success",
       })
       resetForm()
     } catch (error) {
       setSnackbarMessage({ text: error.message, type: "error" })
     } finally {
       setSnackbarVisible(true)
     }
   }, [formData, isEditing, editingInventoryId, data]) */


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
        await updateInventory(editingInventoryId, form); // Enviar FormData
        newData = data.map((item) =>
          item.id === editingInventoryId ? { ...item, ...formData } : item
        );
      } else {
        

        const newUser = await createPortfolio(form); // Enviar FormData
        if (!newUser) throw new Error('Error al crear el usuario');
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

 /*  const pickImages = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permisos de galería denegados');
        return;
      }

      // Abrir la galería de imágenes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true, // Permite seleccionar múltiples imágenes
        quality: 0.8, // Calidad de la imagen (0-1)
      });

      if (!result.canceled && result.assets) {
        // Procesar las imágenes seleccionadas
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: 'image/jpeg', // O 'image/png' dependiendo del formato
          name: asset.uri.split('/').pop(), // Extrae el nombre del archivo de la URI
        }));

        // Actualizar el estado
        setFormData((prevFormData) => ({
          ...prevFormData,
          imagenes: [...prevFormData.imagenes, ...newImages],
        }));
      }
    } catch (err) {
      console.log('Error seleccionando imágenes:', err);
    }
  }; */






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








  // para evitar problemas de precisión
  const totalItems = data.length;


  // Calculamos los progress con valores seguros
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
            {/* <Card style={[styles.card, isSmallScreen && styles.cardSmall]}>
              <Card.Content>
                <Text style={styles.cardTitle}>Valor del Inventario</Text>
                <Text style={styles.cardValue}>${totalValue.toFixed(2)}</Text>
                <ProgressBar
                  progress={valueProgress}
                  color="#00ACE8"
                  style={styles.progressBar}
                />
              </Card.Content>
            </Card> */}
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
                        ? "text"
                        : field === "presupuesto"
                          ? "precio"
                          : field === "descripcion"
                            ? "descripcion"
                            : field === "superficie"
                              ? "text"
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
export default Portfolio;