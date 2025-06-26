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
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import TablaComponente from "@/components/tablaComponent";
import Breadcrumb from "@/components/BreadcrumbComponent";
import { router } from "expo-router";
import AddComponent from "../../components/AddComponent";
import { AlertaScroll } from "@/components/alerta";
import InputComponent from "@/components/InputComponent";
import {
  createTask,
  getTask,
  deleteTask,
  activeTask,
  inactiveTask,
  updateTask,
  getUsers,
} from "@/services/adminServices";
import ExcelPreviewButton from "@/components/ExcelViewComponent";
import PDFViewComponent from "@/components/PdfViewComponent";
import DropdownComponent from "@/components/DropdownComponent";

const columns = [
  { key: "id", title: "ID", sortable: true, width: 50 },
  { key: "asignadoId", title: "Asignado", sortable: true },
  { key: "titulo", title: "Titulo", sortable: true, width: 80 },
  { key: "descripcion", title: "Descripcion", sortable: true, width: 100 },
  { key: "estado", title: "estado", sortable: true },
  { key: "createdAt", title: "Creado", sortable: true },
  { key: "updatedAt", title: "Modificado", sortable: true },
];

const Task = () => {
  const [data, setData] = useState([]);
  const [editingInventoryId, setEditingInventoryId] = useState(null);
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    text: "",
    type: "success",
  });
  const [formData, setFormData] = useState({
    asignadoId: "",
    titulo: "",
    descripcion: "",
  });
  const [openForm, setOpenForm] = useState(false);
  //estados de los estilos
  const theme = useTheme();
  const { width } = useWindowDimensions();

  useFocusEffect(
    useCallback(() => {
      getTask()
        .then(setData)
        .catch((error) => {
          throw error;
        });
      getUsers()
        .then(setUsers)
        .catch((error) => {
          throw error;
        });
    }, [])
  );

  const handleSubmit = useCallback(async () => {
    try {
      const requiredFields = isEditing
        ? ["asignadoId", "titulo", "descripcion"]
        : ["asignadoId", "titulo", "descripcion"];
      /*  const emptyFields = requiredFields.filter((field) => !formData[field] || formData[field].trim() === "") */
      const emptyFields = requiredFields.filter((field) => {
        const value = formData[field];
        return !value || (typeof value === "string" && value.trim() === "");
      });

      if (emptyFields.length > 0) {
        setOpenForm(false);
        throw new Error(
          `Por favor, rellene los siguientes campos: ${emptyFields.join(", ")}`
        );
      }

      let newData;
      if (isEditing) {
        await updateTask(editingInventoryId, formData);
        newData = data.map((item) =>
          item.id === editingInventoryId ? { ...item, ...formData } : item
        );
      } else {
        const newUser = await createTask(formData);
        if (!newUser) throw new Error("Error al crear la tarea");
        newData = [...data, newUser.task];
      }
      setData(newData);
      setSnackbarMessage({
        text: `Tarea ${isEditing ? "actualizado" : "creado"} exitosamente`,
        type: "success",
      });
      resetForm();
    } catch (error) {
      resetForm();
      setSnackbarMessage({
        text: error.response?.data.message || error.message,
        type: "error",
      });
    } finally {
      setSnackbarVisible(true);
    }
  }, [formData, isEditing, editingInventoryId, data]);

  const resetForm = () => {
    setOpenForm(false);
    setIsEditing(false);
    setEditingInventoryId(null);
    setFormData({ asignadoId: "", titulo: "", descripcion: "", estado: "" });
  };

  const handleAction = useCallback(async (action, item) => {
    try {
      await action(item.id);
      setData((prevData) =>
        prevData.map((dataItem) =>
          dataItem.id === item.id
            ? { ...dataItem, estado: action === activeTask }
            : dataItem
        )
      );
    } catch (error) {
      throw error;
    }
  }, []);

  const handleEdit = useCallback((item) => {
    setFormData({
      asignadoId: item.asignadoId,
      titulo: item.titulo,
      descripcion: item.descripcion,
      estado: item.estado,
    });
    setEditingInventoryId(item.id);
    setIsEditing(true);
    setOpenForm(true);
  }, []);

  // para evitar problemas de precisión
  const totalItems = data.length;

  // Calculamos los progress con valores seguros
  const calculateProgress = (value, max) => {
    const progress = Math.min(Math.max(value / max, 0), 1);
    return parseFloat(progress.toFixed(2));
  };
  const itemsProgress = calculateProgress(totalItems, 1000);

  const isSmallScreen = width < 600;

  const usuarios = users
    .filter((user) => user.estado === true) // Filtra solo los usuarios con estado true
    .map((user) => ({ label: user.nombre, value: user.id }));

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
                  label: "Tareas",
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
                <Text style={styles.cardTitle}>Total de tareas</Text>
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
                  await deleteTask(item.id);
                  setData((prevData) =>
                    prevData.filter((dataItem) => dataItem.id !== item.id)
                  );
                }}
                onToggleActive={(item) => handleAction(activeTask, item)}
                onToggleInactive={(item) => handleAction(inactiveTask, item)}
                onDataUpdate={setData}
                onCreate={handleSubmit}
                onEdit={handleEdit}
              />
            </Card.Content>
          </Card>
        </ScrollView>
        <AddComponent onOpen={() => setOpenForm(true)} />
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
          title={isEditing ? "Editar Tarea" : "Nueva Tarea"}
          content={
            <View
              style={{
                flexDirection: isSmallScreen ? "column" : "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <DropdownComponent
                options={usuarios}
                onSelect={(value) => {
                  setFormData({ ...formData, asignadoId: value });
                }}
                value={formData.asignadoId}
                placeholder="Usuario Asignado"
              />

              {["titulo", "descripcion"].map((field) => (
                <InputComponent
                  key={field}
                  type={
                    field === "titulo"
                      ? "text"
                      : field === "descripcion"
                      ? "descripcion"
                      : "text"
                  }
                  value={formData[field]}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, [field]: text }))
                  }
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  placeholder={`Introduce el ${field}`}
                  validationRules={{
                    required: field !== "descripcion",
                    ...(field === "descripcion"),
                  }}
                  errorMessage={`Por favor, introduce un ${field} válido`}
                />
              ))}
            </View>
          }
          actions={[
            <Button
              key="cancelar"
              mode="outlined"
              textColor="black"
              onPress={resetForm}
            >
              Cancelar
            </Button>,
            <Button
              key="aceptar"
              mode="contained"
              style={{ backgroundColor: "#00ACE8" }}
              onPress={handleSubmit}
            >
              {isEditing ? "Actualizar" : "Crear"}
            </Button>,
          ]}
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
});
export default Task;
