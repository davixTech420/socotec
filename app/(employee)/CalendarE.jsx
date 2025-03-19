import React, { useState, useCallback } from "react"
import { View, StyleSheet, ScrollView, Platform } from "react-native"
import { Calendar } from "react-native-calendars"
import { Modal, Portal, Button, Text, useTheme, PaperProvider, Card, Snackbar } from "react-native-paper"
import Breadcrumb from "@/components/BreadcrumbComponent"
import TablaComponente from "@/components/tablaComponent"
import InputComponent from "@/components/InputComponent"
import DropdownComponent from "@/components/DropdownComponent"
import { router } from "expo-router"
import {
  createPermission,
  deletePermission,
  updatePermission,
} from "@/services/adminServices"
import { getMyPermissions, getPermissionsMyGroup } from "@/services/employeeService";
import { useFocusEffect } from "@react-navigation/native"
import ExcelPreviewButton from "@/components/ExcelViewComponent";
import PDFViewComponent from "@/components/PdfViewComponent"
import { useAuth } from "@/context/userContext"

const columns = [
  { key: "id", title: "ID", sortable: true, width: 50 },
  { key: "solicitanteId", title: "Solicitante", sortable: true, width: 50 },
  { key: "tipoPermiso", title: "Tipo Permiso", sortable: true, width: 80 },
  { key: "fechaInicio", title: "Fecha Inicio", sortable: true, width: 80 },
  { key: "fechaFin", title: "Fecha Fin", sortable: true, width: 80 },
  { key: "estado", title: "Estado", sortable: true },
  { key: "createdAt", title: "Creado", sortable: true },
  { key: "updatedAt", title: "Modificado", sortable: true },
]

export default function CalendarComponent() {
  const { user } = useAuth()
  const [logueado, setLogueado] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPermissionId, setEditingPermissionId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [data, setData] = useState([])
  const [markedDates, setMarkedDates] = useState({})
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [formData, setFormData] = useState({
    solicitanteId: "" || logueado?.id,
    tipoPermiso: "",
    fechaInicio: "",
    fechaFin: "",
  })

  const theme = useTheme()

  const processPermissionsForCalendar = useCallback((permissions) => {
    const marks = {}

    permissions.forEach((permission) => {
      const startDate = new Date(permission.fechaInicio)
      const endDate = new Date(permission.fechaFin)

      let dotColor = "#0066FF" // default
      if (permission.tipoPermiso === "Vacaciones") dotColor = "#00C853"
      if (permission.tipoPermiso === "Medico") dotColor = "#FF4081"
      if (permission.tipoPermiso === "Personal") dotColor = "#FF9100"

      for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split("T")[0]

        if (!marks[dateString]) {
          marks[dateString] = { dots: [] }
        }

        marks[dateString].dots.push({
          key: permission.id,
          color: dotColor,
        })
      }
    })
    return marks
  }, [])

  useFocusEffect(useCallback(() => {
    const fetchData = async () => {
      try {
        const userData = await user();
        setLogueado(userData);
        setFormData({ ...formData, solicitanteId: userData.id });
        let response
        if (userData.cargo === "TeamLider" || userData.cargo === "DirectorContable") {
          response = await getPermissionsMyGroup(userData.id)
        } else {
          response = await getMyPermissions(userData.id)
        }
        setData(response)
        const marks = processPermissionsForCalendar(response)
        setMarkedDates(marks)
      } catch (error) {
        console.error("Error al obtener los datos:", error)
      }
    }
    fetchData();
  }, []),);

  const handleDayPress = (day) => {
    setFormData({ ...formData, fechaInicio: day.dateString })
    setSelectedDate(day.dateString)
    setShowForm(true)
  }

  const handleSubmit = useCallback(async () => {
    try {
      // Definir los campos requeridos según si estamos editando o creando
      const requiredFields = isEditing
        ? ["solicitanteId", "tipoPermiso", "fechaInicio", "fechaFin"]
        : ["solicitanteId", "tipoPermiso", "fechaInicio", "fechaFin"];

      // Verificar campos vacíos o inválidos
      const emptyFields = requiredFields.filter((field) => {
        const value = formData[field];
        return !value || (typeof value === "string" && value.trim() === "");
      });

      if (emptyFields.length > 0) {
        setShowForm(false);

        throw new Error(`Por favor, rellene los siguientes campos: ${emptyFields.join(", ")}`);
      }

      let newData;

      if (isEditing) {
        // Actualizar permiso existente
        await updatePermission(editingPermissionId, formData);
        newData = data.map((item) =>
          item.id === editingPermissionId ? { ...item, ...formData } : item
        );
        // Actualizar datos y marcas del calendario
        const updatedData = await getMyPermissions(logueado.id);
        setData(updatedData);
        const updatedMarks = await processPermissionsForCalendar(updatedData);
        setMarkedDates(updatedMarks);
      } else {
        // Crear nuevo permiso
        const response = await createPermission(formData);
        setShowForm(false);
        // Actualizar datos y marcas del calendario
        const updatedData = await getMyPermissions(logueado.id);
        setData(updatedData);
        const updatedMarks = await processPermissionsForCalendar(updatedData);
        setMarkedDates(updatedMarks);
        newData = [...data, response];
      }

      setData(newData);
      setSnackbarMessage({
        text: isEditing ? "Permiso actualizado" : "Permiso creado",
        type: "success"
      });
      resetForm();
    } catch (error) {
      resetForm();
      setSnackbarMessage({
        text: error.response?.data.message || error.response?.data.errors?.[0]?.msg || error.message,
        type: "error"
      });

    } finally {
      setSnackbarVisible(true);
    }
  }, [formData, isEditing, editingPermissionId, data]);


  const resetForm = () => {
    setShowForm(false)
    setIsEditing(false);
    setFormData({ solicitanteId: logueado.id, tipoPermiso: "", fechaInicio: "", fechaFin: "" })
    setSelectedDate("")
  }

  const handleEdit = useCallback((item) => {
    setFormData({
      solicitanteId: item.solicitanteId,
      aprobadorId: logueado.cargo === "TeamLider" || logueado.cargo === "DirectorContable" ? logueado.id : item.aprobadorId,
      tipoPermiso: item.tipoPermiso,
      fechaInicio: item.fechaInicio,
      fechaFin: item.fechaFin,
      estado: item.estado
    })
    setEditingPermissionId(item.id)
    setIsEditing(true)
    setShowForm(true)
  }, []);
  const handleDataUpdate = (updatedData) => {
    setData(updatedData)
    const updatedMarks = processPermissionsForCalendar(updatedData)
    setMarkedDates(updatedMarks)
  }
  const optionsTipoPermiso = [
    { label: "Vacaciones", value: "Vacaciones" },
    { label: "Medico", value: "Medico" },
    { label: "Personal", value: "Personal" },
  ]
  const optionsState = [
    { label: "Pendiente", value: "Pendiente" },
    { label: "Aprobado", value: "Aprobado" },
    { label: "Rechazado", value: "Rechazado" },
  ]

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
            <PDFViewComponent data={data} columns={columns} iconStyle={styles.icon} />
            <ExcelPreviewButton data={data} columns={columns} iconStyle={styles.icon} />
          </View>
        </View>
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
        <Card style={styles.tableCard}>
          <Card.Content>
            <TablaComponente
              data={data}
              columns={columns}
              keyExtractor={(item) => String(item.id)}
              onSort={console.log}
              onSearch={console.log}
              onFilter={console.log}
              onDelete={async (item) => await deletePermission(item.id)}
              onDataUpdate={handleDataUpdate}
              onEdit={handleEdit}
            />
          </Card.Content>
        </Card>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={{ backgroundColor: theme.colors[snackbarMessage.type] }}
          action={{ label: "Cerrar", onPress: () => setSnackbarVisible(false) }}
        >
          <Text style={{ color: theme.colors.surface }}>{snackbarMessage.text}</Text>
        </Snackbar>
        <Portal>
          <Modal visible={showForm} onDismiss={() => setShowForm(false)} contentContainerStyle={styles.modalContainer}>
            <ScrollView>
              <View style={styles.modalContent}>
                <View style={styles.headerCalendar}>
                  <Text variant="headlineMedium" style={styles.title}>
                    {isEditing ? "Editar Permiso" : "Crear Permiso"}
                  </Text>
                  <Text variant="bodySmall" style={styles.subtitle}>
                    Escoge el dia o dias para pedir permisos
                  </Text>
                </View>
                <View style={styles.form}>
                  <DropdownComponent
                    options={optionsTipoPermiso}
                    onSelect={(value) => {
                      if (!isEditing || formData.estado === "Pendiente"
                      ) {
                        setFormData({ ...formData, tipoPermiso: value });
                      }
                    }}
                    value={formData.tipoPermiso}
                    placeholder="Tipo de permiso"
                  />

                  <View style={styles.dateSection}>
                    <Text variant="bodyMedium" style={styles.dateLabel}>
                      Fechas
                    </Text>
                    {isEditing ? (
                      <>
                        <Text style={{ fontWeight: "500" }}>Fecha Inicio</Text>
                        <View style={styles.timeContainer}>
                          <InputComponent
                            type="date"
                            value={formData.fechaInicio}
                            onChangeText={(text) => setFormData({ ...formData, fechaInicio: text })}
                            label="Fecha Inicio"
                            placeholder="Introduce la fecha de inicio"
                            validationRules={{ required: true }}
                            errorMessage="Por favor, introduce una fecha válida"
                            style={styles.input}
                            editable={formData.estado === "Aprobado" || formData.estado === "Rechazado" ? false : true}
                          />
                        </View>
                      </>
                    ) : (<Text variant="bodyLarge" style={styles.selectedDate}>
                      {formData.fechaInicio}
                    </Text>)
                    }
                    <Text style={{ fontWeight: "500" }}>Fecha Fin</Text>
                    <View style={styles.timeContainer}>
                      <InputComponent
                        type="date"
                        value={formData.fechaFin}
                        onChangeText={(text) => setFormData({ ...formData, fechaFin: text })}
                        label="Fecha Fin"
                        placeholder="Introduce la fecha de fin"
                        validationRules={{ required: true }}
                        errorMessage="Por favor, introduce una fecha válida"
                        style={styles.input}
                        editable={formData.estado === "Aprobado" || formData.estado === "Rechazado" ? false : true}
                      />
                    </View>
                    { isEditing && logueado && logueado?.cargo === "TeamLider" || logueado?.cargo === "DirectorContable" ? (
                      <DropdownComponent
                        options={optionsState}
                        onSelect={(value) => {
                          if (!isEditing || formData.estado === "Pendiente"
                          ) {
                            setFormData({ ...formData, estado: value });
                          }
                        }}
                        value={formData.estado}
                        placeholder="Estado"
                      />
                    ) : null
                    }
                  </View>
                </View>
                <View style={styles.actions}>
                  <Button mode="outlined" onPress={resetForm} style={styles.cancelButton}>
                    Cancel
                  </Button>
                  <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
                    Continue
                  </Button>
                </View>
              </View>
            </ScrollView>
          </Modal>
        </Portal>
      </ScrollView>
    </PaperProvider>
  )
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
    backgroundColor: "#0066FF",
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
})