import { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  useWindowDimensions,
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

import {
  getActiveInventory,
  getUsersCampoAD,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "@/services/adminServices";
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
    estado: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    text: "",
    type: "success",
  });
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const optionState = [
    { label: "Asignado", value: "Asignado" },
    { label: "Confirmado", value: "Confirmado" },
    { label: "Devuelto", value: "Devuelto" },
  ];
  useFocusEffect(
    useCallback(() => {
      getAssignment()
        .then(setData)
        .catch((error) => {
          throw error;
        });
      getActiveInventory()
        .then(setInventario)
        .catch((error) => {
          throw error;
        });
      getUsersCampoAD()
        .then(setUsuarios)
        .catch((error) => {
          throw error;
        });
      user()
        .then(setProfileData)
        .catch((error) => {
          throw error;
        });
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

  const handleSubmit = useCallback(async () => {
    try {
      const requiredFields = isEditing
        ? ["inventoryId", "userId", "estado"]
        : ["inventoryId", "userId", "estado"];
      const emptyFields = requiredFields.filter(
        (field) => !formData[field] && formData[field].trim() === ""
      );

      if (emptyFields.length > 0) {
        setOpenForm(false);
        throw new Error(
          `Por favor, rellene los siguientes campos: ${emptyFields.join(", ")}`
        );
      }

      let newData;
      if (isEditing) {
        await updateAssignment(editingUserId, formData);
        newData = data.map((item) =>
          item.id === editingUserId ? { ...item, ...formData } : item
        );
      } else {
        const newUser = await createAssignment(formData);
        if (!newUser) throw new Error("Error al crear el candidato");
        newData = [...data, newUser.assignment];
      }
      setData(newData);
      setSnackbarMessage({
        text: `Equipo ${isEditing ? "actualizado" : "creado"} exitosamente`,
        type: "success",
      });
      resetForm();
    } catch (error) {
      resetForm();
      setSnackbarMessage({
        text:
          error.response?.data.message ||
          error.response?.data.errors[0].msg ||
          error.message,
        type: "error",
      });
    } finally {
      setSnackbarVisible(true);
    }
  }, [formData, isEditing, editingUserId, data]);

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
      estado: "",
    });
  };

  const handleEdit = useCallback((item) => {
    setFormData({
      inventoryId: item.inventoryId,
      userId: item.userId,
      asignadorId: item.asignadorId,
      fechaConfirmacion: item.fechaConfirmacion,
      fechaRetorno: item.fechaRetorno,
      fotoppe: item.fotoppe,
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
            <DropdownComponent
              options={usuarioss}
              onSelect={(value) => {
                setFormData({ ...formData, userId: value });
              }}
              placeholder="Usuario"
              value={formData.userId}
            />

            <DropdownComponent
              options={optionState}
              onSelect={(value) => {
                setFormData({ ...formData, estado: value });
              }}
              placeholder="Estado"
              value={formData.estado}
            />
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
            style={{ backgroundColor: "#00ACE8" }}
            onPress={handleSubmit}
          >
            {isEditing ? "Actualizar" : "Crear"}
          </Button>,
        ]}
      />
      <AddComponent onOpen={() => setOpenForm(true)} />
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
});
