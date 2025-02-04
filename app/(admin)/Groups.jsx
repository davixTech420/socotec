import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, Platform, Dimensions } from 'react-native';
import { PaperProvider, Text, Card, Button, FAB, Portal, Modal, ProgressBar, useTheme } from 'react-native-paper';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import TablaComponente from "@/components/tablaComponent";
import Breadcrumb from "@/components/BreadcrumbComponent";
import { router } from "expo-router";
import AddComponent from '../../components/AddComponent';
import { AlertaScroll } from '@/components/alerta';
import InputComponent from "@/components/InputComponent";
import { createGroup, getGroups, deleteGroup, activateGroup, inactivateGroup, getUsersGroup } from "@/services/adminServices";

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
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGroups();
        setData(response);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    fetchData();
  }, []);


  const theme = useTheme();
  const { width } = useWindowDimensions();

  //estado para abrir el formulario para el inventario
  const [openForm, setOpenForm] = useState(false);

 
  //estos son los datos del fromulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });
  //esta funcion es la que envia el formulario para el back para crear
  const handleSubmit = async () => {
    try {
      const response = await createGroup(formData);
      console.log(response);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };


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

  const handleToggleActive = async (item) => {
    try {
      // Realizar la operación de activación (ej. llamada a API)
      await activateGroup(item.id);

      // Actualizar el estado local (activar el registro)
      setData(prevData => prevData.map(dataItem => dataItem.id === item.id ? { ...dataItem, active: true } : dataItem));

      return Promise.resolve();
    } catch (error) {
      console.error('Error al activar el item:', error);
      return Promise.reject(error);
    }
  };

 

  const handleToggleInactive = async (item) => {
    try {
      await inactivateGroup(item.id);

      // Actualizar el estado local (desactivar el registro)
      setData(prevData => prevData.map(dataItem => dataItem.id === item.id ? { ...dataItem, active: false } : dataItem));

      return Promise.resolve();
    } catch (error) {
      console.error('Error al desactivar el item:', error);
      return Promise.reject(error);
    }
  };



  const handleDataUpdate = (updatedData) => {
    setData(updatedData)
  }

  const handleSort = (key, order) => {
    console.log('Ordenando por:', key, order);
  };

  const handleSearch = (query) => {
    console.log('Buscando:', query);
  };

  const handleFilter = (filters) => {
    console.log('Filtrando:', filters);
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
                onSort={handleSort}
                onSearch={handleSearch}
                onFilter={handleFilter}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                onToggleInactive={handleToggleInactive}
                onDataUpdate={handleDataUpdate}
               
              />
            </Card.Content>
          </Card>
        </ScrollView>








        <AlertaScroll onOpen={openForm} onClose={() => setOpenForm(false)} title="Nuevo registro de inventario" content={
          <>
            <View style={{
              flexDirection: isSmallScreen ? "column" : 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
              <InputComponent
                type="nombre"
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                label="Nombre del grupo"
                placeholder="Introduce el nombre"
                validationRules={{ required: true }}
                errorMessage="Por favor, introduce un nombre válido"
              />
              <InputComponent
                type="descripcion"
                value={formData.descripcion}
                onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
                label="Descripcion del grupo"
                placeholder="Describe el grupo"
                validationRules={{ required: true }}
                errorMessage="Por favor, introduce una descripcion válida"
              />
              
              
            </View>
          </>
        } actions={[<Button onPress={() => setOpenForm(false)}>Cancelar</Button>, <Button onPress={handleSubmit}>Crear</Button>]} />
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
});
export default Groups;