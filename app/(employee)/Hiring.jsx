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
import InputComponent from "@/components/InputComponent";
import {
  getHiring,
  createHiring,
  updateHiring,
  deleteHiring,
} from "@/services/employeeService";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import DropdownComponent from "@/components/DropdownComponent";
import ExcelPreviewButton from "@/components/ExcelViewComponent";
import PDFPreviewButton from "@/components/PdfViewComponent";

const columns = [
  { key: "id", title: "ID", sortable: true, width: 50 },
  { key: "nombre", title: "Nombre", sortable: true },
  { key: "telefono", title: "Teléfono", sortable: true, width: 80 },
  { key: "email", title: "Email", sortable: true, width: 100 },
  { key: "salario", title: "Salario", sortable: true },
  { key: "cargo", title: "Cargo", sortable: true },
  { key: "tipoContrato", title: "Tipo Contrato", sortable: true },
  { key: "estado", title: "Estado", sortable: true },
  { key: "cita", title: "Cita", sortable: true },
  { key: "nota", title: "Nota", sortable: true },
  { key: "createdAt", title: "Creado", sortable: true },
  { key: "updatedAt", title: "Modificado", sortable: true },
];

export default function Hiring() {
  const [data, setData] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    cargo: "",
    tipoContrato: "",
    estado: "",
    salario: "",
    cita: "",
    nota: "",
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
  const options = [
    { label: "Auxiliar", value: "Auxiliar" },
    { label: "Ingeniero", value: "Ingeniero" },
    { label: "Arquitecto", value: "Arquitecto" },
    { label: "TeamLider", value: "TeamLider" },
    { label: "Deliniante", value: "Deliniante" },
    { label: "Talento Humano", value: "Talento" },
    { label: "Director/ra Talento Humano", value: "DirectorTalento" },
    { label: "Director/ra Contable", value: "DirectorContable" },
    { label: "Contador/ra", value: "Contador" },
    { label: "Director/ra SSET", value: "Directorsset" },
    { label: "SSET", value: "Sset" },
  ];
  const optionsContrato = [
    { label: "Fijo", value: "Fijo" },
    { label: "Indefinido", value: "Indefinido" },
    { label: "Prestacion Servicios", value: "Prestacion Servicios" },
    { label: "Practicante", value: "Practicante" },
  ];
  const optionState = [
    { label: "Postulado", value: "Postulado" },
    { label: "CV Aprobado", value: "CV Aprobado" },
    { label: "Entrevista 1", value: "Entrevista 1" },
    { label: "Entrevista 2", value: "Entrevista 2" },
    { label: "Prueba Tecnica", value: "Prueba Tecnica" },
    { label: "Oferta Enviada", value: "Oferta Enviada" },
    { label: "Contrato Firmado", value: "Contrato Firmado" },
    { label: "Rechazado", value: "Rechazado" },
  ];
  useFocusEffect(
    useCallback(() => {
      getHiring().then(setData).catch(console.error);
    }, [])
  );

  const handleSubmit = useCallback(async () => {
    try {
      const requiredFields = isEditing
        ? [
            "nombre",
            "email",
            "telefono",
            "cargo",
            "estado",
            "salario",
            "cita",
            "nota",
          ]
        : [
            "nombre",
            "email",
            "telefono",
            "cargo",
            "estado",
            "salario",
            "cita",
            "nota",
          ];
      const emptyFields = requiredFields.filter(
        (field) => !formData[field] || formData[field].trim() === ""
      );

      if (emptyFields.length > 0) {
        setOpenForm(false);
        throw new Error(
          `Por favor, rellene los siguientes campos: ${emptyFields.join(", ")}`
        );
      }

      let newData;
      if (isEditing) {
        await updateHiring(editingUserId, formData);
        newData = data.map((item) =>
          item.id === editingUserId ? { ...item, ...formData } : item
        );
      } else {
        const newUser = await createHiring(formData);
        if (!newUser) throw new Error("Error al crear el candidato");
        newData = [...data, newUser.hiring];
      }
      setData(newData);
      setSnackbarMessage({
        text: `Candidato ${isEditing ? "actualizado" : "creado"} exitosamente`,
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
      nombre: "",
      email: "",
      telefono: "",
      cargo: "",
      tipoContrato: "",
      estado: "",
      salario: "",
      cita: "",
      nota: "",
    });
  };

 

  const handleEdit = useCallback((item) => {
    setFormData({
      nombre: item.nombre,
      email: item.email,
      telefono: item.telefono,
      cargo: item.cargo,
      tipoContrato: item.tipoContrato,
      estado: item.estado,
      salario: item.salario,
      cita: item.cita,
      nota: item.nota,
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
              { label: "Candidatos" },
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
              <Text style={styles.cardTitle}>Total de candidatos</Text>
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
                await deleteHiring(item.id);
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
        title={isEditing ? "Editar Candidato" : "Nuevo Candidato"}
        content={
          <View style={styles.formContainer}>
            {[
              "nombre",
              "email",
              "telefono",
              "salario",
              "cita",
              "nota",
              ...(isEditing ? [] : []),
            ].map((field) => (
              <InputComponent
                key={field}
                type={
                  field === "nombre"
                    ? "nombre"
                    : field === "email"
                    ? "email"
                    : field === "telefono"
                    ? "number"
                    : field === "salario"
                    ? "precio"
                    : field === "cita"
                    ? "date"
                    : field === "nota"
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
                  required: field !== "role",
                  ...(field === "email" && { email: true }),
                }}
                errorMessage={`Por favor, introduce un ${field} válido`}
              />
            ))}
            <DropdownComponent
              options={options}
              onSelect={(value) => {
                setFormData({ ...formData, cargo: value });
              }}
              placeholder="Cargo"
              value={formData.cargo}
            />
            <DropdownComponent
              options={optionsContrato}
              onSelect={(value) => {
                setFormData({ ...formData, tipoContrato: value });
              }}
              placeholder="Tipo Contrato"
              value={formData.tipoContrato}
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
          <Button key="cancel" onPress={resetForm}>
            Cancelar
          </Button>,
          <Button key="submit" onPress={handleSubmit}>
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
