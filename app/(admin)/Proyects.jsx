import { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";
import {
  PaperProvider,
  Text,
  Card,
  Button,
  ProgressBar,
  useTheme,
  Snackbar,
  Chip,
  Searchbar,
  Avatar,
} from "react-native-paper";
import TablaComponente from "@/components/tablaComponent";
import Breadcrumb from "@/components/BreadcrumbComponent";
import { router } from "expo-router";
import AddComponent from "../../components/AddComponent";
import { AlertaScroll } from "@/components/alerta";
import InputComponent from "@/components/InputComponent";
import {
  createProyect,
  getProyect,
  deleteProyect,
  activeProyect,
  inactiveProyect,
  updateProyect,
  getGroupNotProyect,
  getGroupProyect,
  deleteGroupProyect,
} from "@/services/adminServices";
import { useFocusEffect } from "@react-navigation/native";
import ExcelPreviewButton from "@/components/ExcelViewComponent";
import PDFViewComponent from "@/components/PdfViewComponent";

const columns = [
  { key: "id", title: "ID", sortable: true, width: 50 },
  { key: "nombre", title: "Nombre", sortable: true },
  { key: "descripcion", title: "Descripcion", sortable: true, width: 80 },
  { key: "presupuesto", title: "Presupuesto", sortable: true, width: 100 },
  { key: "cliente", title: "Cliente", sortable: true },
  { key: "groupId", title: "Grupo", sortable: true },
  { key: "fechaInicio", title: "Fecha Inicio", sortable: true },
  { key: "fechaEntrega", title: "Fecha Entrega", sortable: true },
  { key: "estado", title: "Estado", sortable: true },
  { key: "createdAt", title: "Creado", sortable: true },
  { key: "updatedAt", title: "Modificado", sortable: true },
];

const Proyects = () => {
  const [data, setData] = useState([]);
  //estos son los grupos sin proyecto
  const [groupWhitProyect, setGroupWhitProyect] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingProyectId, setEditingProyectId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getProyect().then(setData).catch(error => {throw error});
      getGroupNotProyect().then(setGroupWhitProyect).catch(error => {throw error});
    }, [])
  );

  const theme = useTheme();
  const { width } = useWindowDimensions();

  //estado para abrir el formulario para el inventario
  const [openForm, setOpenForm] = useState(false);
  //estos son los datos del fromulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    presupuesto: "",
    cliente: "",
    fechaInicio: "",
    fechaEntrega: "",
    grupo: "",
  });
  //esta funcion es la que envia el formulario para el back para crear

  const handleSubmit = useCallback(async () => {
    try {
      const requiredFields = isEditing
        ? [
            "nombre",
            "descripcion",
            "presupuesto",
            "cliente",
            "fechaInicio",
            "fechaEntrega",
          ]
        : [
            "nombre",
            "descripcion",
            "presupuesto",
            "cliente",
            "fechaInicio",
            "fechaEntrega",
          ];
      const emptyFields = requiredFields.filter(
        (field) => !formData[field] || formData[field] === ""
      );
      if (emptyFields.length > 0) {
        setOpenForm(false);
        throw new Error(
          `Por favor, rellena los campos: ${emptyFields.join(", ")}`
        );
      }

      const dataToSubmit = {
        ...formData,
        grupo: selectedGroup.map((group) => group[0].id),
      };

      let newData;

      if (isEditing) {
        await updateProyect(editingProyectId, dataToSubmit);
        newData = data.map((item) =>
          item.id === editingProyectId ? { ...item, ...dataToSubmit } : item
        );
      } else {
        const newProyect = await createProyect(dataToSubmit);
       

        if (!newProyect) throw new Error("No se ha podido crear el proyecto");
        newData = [...data, newProyect];
      }
      setData(newData);
      setSnackbarMessage({
        text: `Proyecto ${isEditing ? "actualizado" : "creado"} exitosamente`,
        type: "success",
      });
      resetForm();
    } catch (error) {
      resetForm();
      setSnackbarMessage({
        text: error.message || error.response?.data.message,
        type: "error",
      });
    } finally {
      setSnackbarVisible(true);
    }
  }, [formData, data, isEditing, editingProyectId]);

  const resetForm = () => {
    setOpenForm(false);
    setIsEditing(false);
    setEditingProyectId(null);
    setFormData({
      nombre: "",
      descripcion: "",
      presupuesto: "",
      cliente: "",
      fechaInicio: "",
      fechaEntrega: "",
      grupo: "",
    });
    setSelectedGroup(null);
    setSnackbarVisible(false);
  };
  const handleAction = useCallback(async (action, item) => {
    try {
      await action(item.id);
      setData((prevData) =>
        prevData.map((dataItem) =>
          dataItem.id === item.id
            ? {
                ...dataItem,
                estado: action === activeProyect,
              }
            : dataItem
        )
      );
    } catch (error) {
     throw error; 
    }
  }, []);

  const handleEdit = useCallback((item) => {
    setFormData({
      nombre: item.nombre,
      descripcion: item.descripcion,
      presupuesto: item.presupuesto,
      cliente: item.cliente,
      fechaInicio: item.fechaInicio,
      fechaEntrega: item.fechaEntrega,
    });
    setEditingProyectId(item.id);
    getGroupProyect(item.groupId).then(setSelectedGroup).catch(error => {throw error});

    setIsEditing(true);
    setOpenForm(true);
  }, []);

  const handleToggleGroup = useCallback(async (group) => {
    if (!group?.id) {
      // Verifica si group o group.id es undefined/null
      throw error;
      return;
    }
    await deleteGroupProyect(group.id);

    setSelectedGroup((prevGroupWithProyect) => {
      // Si el grupo ya está seleccionado, deselecciona todos (devuelve un array vacío)
      if (prevGroupWithProyect?.some((g) => g.id === group.id)) {
        return [];
      }
      // Si no está seleccionado, selecciona solo este grupo
      return [group];
    });
  }, []);

  const filteredGroup = groupWhitProyect.filter((group) => {
    // Filtra los grupos que están activos (estado === true) y coinciden con la búsqueda
    return (
      group.estado === true &&
      group.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Calculamos los totales usando parseInt y toFixed para evitar problemas de precisión
  const totalItems = data.length;
  const totalValue = data.reduce((sum, item) => {
    // Multiplicamos la cantidad por el precio por unidad
    const itemTotal = item.cantidad * item.precioUnidad;
    // Sumamos el total de cada producto al acumulador
    return sum + itemTotal;
  }, 0);

  // Calculamos los progress con valores seguros
  const calculateProgress = (value, max) => {
    const progress = Math.min(Math.max(value / max, 0), 1);
    return parseFloat(progress.toFixed(2));
  };
  const itemsProgress = calculateProgress(totalItems, 1000);
  const valueProgress = calculateProgress(totalValue, 100000);
  const isSmallScreen = width < 600;

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
                  label: "Proyectos",
                },
              ]}
            />
            <View style={styles.headerActions}>
              <PDFViewComponent
                data={data}
                columns={columns}
                iconStyle={styles.icon}
              />
              <ExcelPreviewButton
                data={data}
                columns={columns}
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
                <Text style={styles.cardTitle}>Total de Proyectos</Text>
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
                  await deleteProyect(item.id);
                  setData((prevData) =>
                    prevData.filter((dataItem) => dataItem.id !== item.id)
                  );
                }}
                onToggleActive={(item) => handleAction(activeProyect, item)}
                onToggleInactive={(item) => handleAction(inactiveProyect, item)}
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
          action={{ label: "Cerrar", onPress: () => setSnackbarVisible(false) }}
        >
          <Text style={{ color: theme.colors.surface }}>
            {snackbarMessage?.text}
          </Text>
        </Snackbar>
        <AlertaScroll
          onOpen={openForm}
          onClose={resetForm}
          title={isEditing ? "Editar proyecto" : "Nuevo proyecto"}
          content={
            <View
              style={{
                flexDirection: isSmallScreen ? "column" : "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              {[
                "nombre",
                "descripcion",
                "presupuesto",
                "cliente",
                "fechaInicio",
                "fechaEntrega",
              ].map((field) => (
                <InputComponent
                  key={field}
                  type={
                    field == "nombre"
                      ? "nombre"
                      : field == "descripcion"
                      ? "descripcion"
                      : field == "presupuesto"
                      ? "precio"
                      : field == "cliente"
                      ? "nombre"
                      : field == "fechaInicio"
                      ? "date"
                      : field == "fechaEntrega"
                      ? "date"
                      : "text"
                  }
                  value={formData[field]}
                  onChangeText={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field]: text,
                    }))
                  }
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  placeholder={`Introduce el ${field}`}
                  validationRules={{ required: true }}
                  errorMessage={`Por favor, introduce un ${field}`}
                />
              ))}
              <View>
                <Text>Grupo Seleccionado</Text>
                <ScrollView horizontal style={styles.selectedGroup}>
                  {selectedGroup &&
                    [selectedGroup].flat().map((group) => (
                      <Chip
                        style={styles.selectedChip}
                        key={group.id}
                        onClose={() => handleToggleGroup(group)}
                        avatar={
                          <Avatar.Text size={24} label={group.nombre[0]} />
                        }
                      >
                        {group.nombre}
                      </Chip>
                    ))}
                </ScrollView>
              </View>
              <View style={styles.groupList}>
                <Text>Grupos Disponibles</Text>
                <Searchbar
                  placeholder="Buscar"
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                />
                <ScrollView horizontal style={styles.selectedGroup}>
                  {filteredGroup.map((group) => (
                    <Chip
                      key={group.id}
                      onPress={() => handleToggleGroup(group)}
                      avatar={<Avatar.Text size={24} label={group.nombre[0]} />}
                      style={styles.selectedChip}
                    >
                      {group.nombre}
                    </Chip>
                  ))}
                </ScrollView>
              </View>
            </View>
          }
          actions={[
            <Button mode="outlined" textColor="black" onPress={resetForm}>
              Cancelar
            </Button>,
            <Button mode="contained" buttonColor="#00ACE8" onPress={handleSubmit}>
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
  selectedChip: {
    margin: 4,
    backgroundColor: "#e0e0e0",
  },
  selectedGroupContainer: {
    marginTop: 10,
  },
  groupList: {
    maxHeight: 200,
    marginBottom: 10,
  },
});
export default Proyects;