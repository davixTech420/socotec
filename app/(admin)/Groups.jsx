import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { PaperProvider, Text, Card, Button, Snackbar, ProgressBar, useTheme } from 'react-native-paper';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native"
import TablaComponente from "@/components/tablaComponent";
import Breadcrumb from "@/components/BreadcrumbComponent";
import { router } from "expo-router";
import AddComponent from '../../components/AddComponent';
import { AlertaScroll } from '@/components/alerta';
import InputComponent from "@/components/InputComponent";
import { createGroup, updateGroup, getGroups, deleteGroup, activateGroup, inactivateGroup } from "@/services/adminServices";

const columns = [
  { key: 'id', title: 'ID', sortable: true, width: 50 },
  { key: 'nombre', title: 'Nombre', sortable: true },
  { key: 'descripcion', title: 'Descripcion', sortable: true, width: 80 },
  { key: 'estado', title: 'Estado', sortable: true },
  { key: 'usuariosGrupo', title: 'Usuarios', sortable: true },
  { key: 'createdAt', title: 'Creado', sortable: true },
  { key: 'updatedAt', title: 'Modificado', sortable: true },
];


const Groups = () => {

  //estilos
  const theme = useTheme();
  const { width } = useWindowDimensions();

  //funcionalidad del componente 
  const [data, setData] = useState([]);
  const [editingGroupId, setEditingGroupId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState({ text: "", type: "success" })
  const [openForm, setOpenForm] = useState(false);
  //estos son los datos del fromulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });

  useFocusEffect(
    useCallback(() => {
      getGroups().then(setData).catch(console.error)
    }, []),
  );

  const handleSubmit = useCallback(async () => {
    try {
      const requiredFields = isEditing ? ["nombre", "descripcion"] : ["nombre", "descripcion"]
      const emptyFields = requiredFields.filter((field) => !formData[field] || formData[field].trim() === "")

      if (emptyFields.length > 0) {
        setOpenForm(false);
        throw new Error(`Por favor, rellene los siguientes campos: ${emptyFields.join(", ")}`);
      }
      let newData
      if (isEditing) {
        await updateGroup(editingGroupId, formData)
        newData = data.map((item) => (item.id === editingGroupId ? { ...item, ...formData } : item))
      } else {
        const newUser = await createGroup(formData)
        if (!newUser) throw new Error("Error al crear el grupo")
        newData = [...data, newUser.group]
      }
      setData(newData)
      setSnackbarMessage({
        text: `Grupo ${isEditing ? "actualizado" : "creado"} exitosamente`,
        type: "success",
      })
      resetForm()
    } catch (error) {
      setSnackbarMessage({ text: error.message, type: "error" })
    } finally {
      setSnackbarVisible(true)
    }
  }, [formData, isEditing, editingGroupId, data]);

  const resetForm = () => {
    setOpenForm(false)
    setIsEditing(false)
    setEditingGroupId(null)
    setFormData({ nombre: "", descripcion: "" })
  }

  const handleAction = useCallback(async (action, item) => {
    try {
      await action(item.id)
      setData((prevData) =>
        prevData.map((dataItem) =>
          dataItem.id === item.id ? { ...dataItem, estado: action === activateGroup } : dataItem,
        ),
      )
    } catch (error) {
      console.error(`Error al ${action === activateGroup ? "activar" : "desactivar"} el grupo:`, error)
    }
  }, []);

  const handleEdit = useCallback((item) => {
    setFormData({
      nombre: item.nombre,
      descripcion: item.descripcion,
    })
    setEditingGroupId(item.id)
    setIsEditing(true)
    setOpenForm(true)
  }, [])

  const handleDelete = async (item) => {
    try {
      await deleteGroup(item.id);
      setData(prevData => prevData.filter(dataItem => dataItem.id !== item.id));
      return Promise.resolve();
    } catch (error) {
      console.error('Error al eliminar el item:', error);
      return Promise.reject(error);
    }
  };

  // Calculamos los totales usando parseInt y toFixed para evitar problemas de precisión
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
                  label: 'Grupos'
                }
              ]}
            />
            <View style={styles.headerActions}>
              <AntDesign name="pdffile1" size={24} color="red" style={styles.icon} />
              <MaterialCommunityIcons name="file-excel" size={24} color="green" style={styles.icon} />
            </View>
          </View>
          <View style={[styles.cardContainer, isSmallScreen && styles.cardContainerSmall]}>
            <Card style={[styles.card, isSmallScreen && styles.cardSmall]}>
              <Card.Content>
                <Text style={styles.cardTitle}>Total de grupos</Text>
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
                  await deleteGroup(item.id)
                  setData((prevData) => prevData.filter((dataItem) => dataItem.id !== item.id))
                }}
                onToggleActive={(item) => handleAction(activateGroup, item)}
                onToggleInactive={(item) => handleAction(inactivateGroup, item)}
                onDataUpdate={setData}
                onCreate={handleSubmit}
                onEdit={handleEdit}

              />
            </Card.Content>
          </Card>
        </ScrollView>
        <AlertaScroll onOpen={openForm} onClose={resetForm} title={isEditing ? "Editar grupo" : "Nuevo grupo"} content={
          <View style={{
            flexDirection: isSmallScreen ? "column" : 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
            {["nombre", "descripcion"].map((field) => (
              <InputComponent
                key={field}
                type={field}
                value={formData[field]}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, [field]: text }))}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                placeholder={`Introduce el ${field}`}
                validationRules={{ required: field !== "descripcion", ...(field === "descripcion") }}
                errorMessage={`Por favor, introduce un ${field} válido`}
              />
            ))}
          </View>
        } actions={[<Button onPress={() => setOpenForm(false)}>Cancelar</Button>, <Button onPress={handleSubmit}>{isEditing ? "Actualizar" : "Crear"}</Button>]} />
      </PaperProvider>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors[snackbarMessage.type] }}
        action={{ label: "Cerrar", onPress: () => setSnackbarVisible(false) }}
      >
        <Text style={{ color: theme.colors.surface }}>{snackbarMessage.text}</Text>
      </Snackbar>
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
});
export default Groups;
