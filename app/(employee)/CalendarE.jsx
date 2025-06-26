import { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import { Calendar } from "react-native-calendars";
import {
  Button,
  Text,
  useTheme,
  PaperProvider,
  Card,
  Snackbar,
} from "react-native-paper";
import Breadcrumb from "@/components/BreadcrumbComponent";
import TablaComponente from "@/components/tablaComponent";
import InputComponent from "@/components/InputComponent";
import { AlertaScroll } from "@/components/alerta";
import DropdownComponent from "@/components/DropdownComponent";
import { router } from "expo-router";
import {
  getMyPermissions,
  getPermissions,
  getPermissionsMyGroup,
  createPermission,
  updatePermission,
} from "@/services/employeeService";
import { useFocusEffect } from "@react-navigation/native";
import ExcelPreviewButton from "@/components/ExcelViewComponent";
import PDFViewComponent from "@/components/PdfViewComponent";
import { useAuth } from "@/context/userContext";

const columns = [
  { key: "id", title: "ID", sortable: true, width: 50 },
  { key: "solicitanteId", title: "Solicitante", sortable: true, width: 50 },
  { key: "tipoPermiso", title: "Tipo Permiso", sortable: true, width: 80 },
  { key: "fechaInicio", title: "Fecha Inicio", sortable: true, width: 80 },
  { key: "fechaFin", title: "Fecha Fin", sortable: true, width: 80 },
  { key: "estado", title: "Estado", sortable: true },
  { key: "createdAt", title: "Creado", sortable: true },
  { key: "updatedAt", title: "Modificado", sortable: true },
];

export default function CalendarComponent() {
  const { user } = useAuth();
  const [logueado, setLogueado] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPermissionId, setEditingPermissionId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    text: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    solicitanteId: "",
    tipoPermiso: "",
    fechaInicio: "",
    fechaFin: "",
    estado: "Pendiente",
  });

  const theme = useTheme();

  // Procesar permisos para el calendario
  const processPermissionsForCalendar = useCallback((permissions) => {
    const marks = {};

    permissions.forEach((permission) => {
      const startDate = new Date(permission.fechaInicio);
      const endDate = new Date(permission.fechaFin);

      let dotColor = "#0066FF"; // default
      if (permission.tipoPermiso === "Vacaciones") dotColor = "#00C853";
      if (permission.tipoPermiso === "Medico") dotColor = "#FF4081";
      if (permission.tipoPermiso === "Personal") dotColor = "#FF9100";

      for (
        let date = startDate;
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dateString = date.toISOString().split("T")[0];

        if (!marks[dateString]) {
          marks[dateString] = { dots: [] };
        }

        marks[dateString].dots.push({
          key: permission.id,
          color: dotColor,
        });
      }
    });
    return marks;
  }, []);

  // Cargar datos al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const userData = await user();
          setLogueado(userData);

          // Actualizar el ID del solicitante en el formulario
          setFormData((prev) => ({ ...prev, solicitanteId: userData.id }));

          // Obtener permisos según el cargo
          let response;

          if (userData.cargo === "DirectorTalento") {
            response = await getPermissions();
          } else if (
            userData.cargo === "TeamLider" ||
            userData.cargo === "DirectorContable" ||
            userData.cargo === "Directorsset" ||
            userData.cargo === "DirectorTalento"
          ) {
            response = await getPermissionsMyGroup(userData.id);
          } else {
            response = await getMyPermissions(userData.id);
          }

          setData(response);
          const marks = processPermissionsForCalendar(response);
          setMarkedDates(marks);
        } catch (error) {
          console.error("Error al obtener los datos:", error);
          showSnackbar("Error al cargar los datos", "error");
        }
      };

      fetchData();
    }, [])
  );

  // Función para mostrar snackbar
  const showSnackbar = (message, type = "success") => {
    setSnackbarMessage({ text: message, type });
    setSnackbarVisible(true);
  };

  // Manejar clic en día del calendario
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setFormData((prev) => ({ ...prev, fechaInicio: day.dateString }));
    setShowForm(true);
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    try {
      // Validar campos requeridos
      const requiredFields = [
        "solicitanteId",
        "tipoPermiso",
        "fechaInicio",
        "fechaFin",
      ];

      const emptyFields = requiredFields.filter((field) => {
        const value = formData[field];
        return !value || (typeof value === "string" && value.trim() === "");
      });

      if (emptyFields.length > 0) {
        throw new Error(
          `Por favor, rellene los siguientes campos: ${emptyFields.join(", ")}`
        );
      }

      if (isEditing) {
        // Actualizar permiso existente
        await updatePermission(editingPermissionId, formData);
        showSnackbar("Permiso actualizado correctamente");
      } else {
        // Crear nuevo permiso
        await createPermission(formData);
        showSnackbar("Permiso creado correctamente");
      }

      // Actualizar datos y marcas del calendario
      const updatedData = await (logueado.cargo === "TeamLider" ||
      logueado.cargo === "DirectorContable" ||
      logueado.cargo === "Directorsset" ||
      logueado.cargo === "DirectorTalento"
        ? getPermissionsMyGroup(logueado.id)
        : getMyPermissions(logueado.id));

      setData(updatedData);
      const updatedMarks = processPermissionsForCalendar(updatedData);
      setMarkedDates(updatedMarks);

      // Cerrar formulario y resetear
      resetForm();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      showSnackbar(
        error.response?.data.message ||
          error.response?.data.errors?.[0]?.msg ||
          error.message,
        "error"
      );
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingPermissionId(null);
    setSelectedDate("");
    setFormData({
      solicitanteId: logueado?.id || "",
      tipoPermiso: "",
      fechaInicio: "",
      fechaFin: "",
      estado: "Pendiente",
    });
  };

  // Manejar edición de permiso
  const handleEdit = (item) => {
    setEditingPermissionId(item.id);
    setIsEditing(true);

    // Preparar datos del formulario para edición
    setFormData({
      solicitanteId: item.solicitanteId,
      aprobadorId:
        logueado &&
        (logueado.cargo === "TeamLider" ||
          logueado.cargo === "DirectorContable" ||
          logueado.cargo === "Directorsset" ||
          logueado.cargo === "DirectorTalento")
          ? logueado.id
          : item.aprobadorId,
      tipoPermiso: item.tipoPermiso,
      fechaInicio: item.fechaInicio,
      fechaFin: item.fechaFin,
      estado: item.estado || "Pendiente",
    });

    // Abrir modal
    setShowForm(true);
  };

  // Manejar actualización de datos
  const handleDataUpdate = (updatedData) => {
    setData(updatedData);
    const updatedMarks = processPermissionsForCalendar(updatedData);
    setMarkedDates(updatedMarks);
  };

  // Opciones para los dropdowns
  const optionsTipoPermiso = [
    { label: "Vacaciones", value: "Vacaciones" },
    { label: "Medico", value: "Medico" },
    { label: "Personal", value: "Personal" },
  ];

  const optionsState = [
    { label: "Pendiente", value: "Pendiente" },
    { label: "Aprobado", value: "Aprobado" },
    { label: "Rechazado", value: "Rechazado" },
  ];

  // Verificar si el usuario puede editar el estado
  const canEditState =
    logueado &&
    (logueado.cargo === "TeamLider" ||
      logueado.cargo === "DirectorContable" ||
      logueado.cargo === "Directorsset" ||
      logueado.cargo === "DirectorTalento");

  // Verificar si los campos son editables
  const isFieldEditable = !isEditing || formData.estado === "Pendiente";

  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                onPress: () => router.navigate("/(employee)/DashboardE"),
              },
              {
                label: "Calendario y permisos",
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

        {/* Calendario */}
        <Card style={styles.tableCard}>
          <Card.Content>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={{
                ...markedDates,
                [selectedDate]: {
                  ...markedDates[selectedDate],
                  selected: true,
                  selectedColor: "#0066FF",
                },
              }}
              markingType={"multi-dot"}
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#b6c1cd",
                selectedDayBackgroundColor: "#0066FF",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#0066FF",
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e1e8",
                dotColor: "#0066FF",
                selectedDotColor: "#ffffff",
                arrowColor: "#0066FF",
                monthTextColor: "#2d4150",
                indicatorColor: "#0066FF",
                textDayFontWeight: "300",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "300",
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 16,
              }}
            />

            {/* Leyenda */}
            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Tipos de Permisos:</Text>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: "#00C853" }]} />
                <Text>Vacaciones</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: "#FF4081" }]} />
                <Text>Médico</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: "#FF9100" }]} />
                <Text>Personal</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Tabla de permisos */}
        <Card style={styles.tableCard}>
          <Card.Content>
            <TablaComponente
              data={data}
              columns={columns}
              keyExtractor={(item) => String(item.id)}
              onSort={console.log}
              onSearch={console.log}
              onFilter={console.log}
              onDataUpdate={handleDataUpdate}
              onEdit={handleEdit}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Snackbar para notificaciones */}
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

      {/* Modal de formulario */}
      <AlertaScroll
        onOpen={showForm}
        onClose={resetForm}
        title={isEditing ? "Editar Permiso" : "Crear Permiso"}
        content={
          <>
            <View style={styles.modalContent}>
              <View style={styles.form}>
                {/* Tipo de permiso */}
                <DropdownComponent
                  options={optionsTipoPermiso}
                  onSelect={(value) => {
                    if (isFieldEditable) {
                      setFormData((prev) => ({
                        ...prev,
                        tipoPermiso: value,
                      }));
                    }
                  }}
                  value={formData.tipoPermiso}
                  placeholder="Tipo de permiso"
                  disabled={!isFieldEditable}
                />

                <View style={styles.dateSection}>
                  {/* Fecha de inicio */}
                  <Text style={{ fontWeight: "500" }}>Fecha Inicio</Text>
                  <View style={styles.timeContainer}>
                    <InputComponent
                      type="date"
                      value={formData.fechaInicio}
                      onChangeText={(text) =>
                        setFormData((prev) => ({
                          ...prev,
                          fechaInicio: text,
                        }))
                      }
                      label="Fecha Inicio"
                      placeholder="Introduce la fecha de inicio"
                      validationRules={{ required: true }}
                      errorMessage="Por favor, introduce una fecha válida"
                      style={styles.input}
                      editable={isFieldEditable}
                    />
                  </View>

                  {/* Fecha de fin */}
                  <Text style={{ fontWeight: "500" }}>Fecha Fin</Text>
                  <View style={styles.timeContainer}>
                    <InputComponent
                      type="date"
                      value={formData.fechaFin}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, fechaFin: text }))
                      }
                      label="Fecha Fin"
                      placeholder="Introduce la fecha de fin"
                      validationRules={{ required: true }}
                      errorMessage="Por favor, introduce una fecha válida"
                      style={styles.input}
                      editable={isFieldEditable}
                    />
                  </View>

                  {/* Estado (solo para roles específicos) */}
                  {canEditState && (
                    <DropdownComponent
                      options={optionsState}
                      onSelect={(value) => {
                        setFormData((prev) => ({ ...prev, estado: value }));
                      }}
                      value={formData.estado}
                      placeholder="Estado"
                    />
                  )}
                </View>
              </View>
            </View>
          </>
        }
        actions={[
          <Button
            key="cancelar"
            mode="outlined"
            onPress={resetForm}
            textColor="black"
            style={styles.cancelButton}
          >
            Cancelar
          </Button>,
          <Button
            key="aceptar"
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
          >
            {isEditing ? "Actualizar" : "Crear"}
          </Button>,
        ]}
      />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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

  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    padding: 24,
    borderRadius: 12,
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  modalContent: {
    gap: 24,
  },
  headerCalendar: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  subtitle: {
    color: "#666666",
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "white",
    marginBottom: 16,
  },
  dateSection: {
    gap: 12,
  },
  dateLabel: {
    color: "#1a1a1a",
    fontWeight: "500",
  },
  selectedDate: {
    fontSize: 18,
    fontWeight: "500",
    color: "#0066FF",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    borderColor: "#e0e0e0",
  },
  submitButton: {
    backgroundColor: "#00ACE8",
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
  legendContainer: {
    marginTop: 16,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
});
