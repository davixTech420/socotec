import { useState, useCallback } from "react"
import { View, StyleSheet, ScrollView, Platform, useWindowDimensions } from "react-native"
import { Text, Card, Button, useTheme, Snackbar, ProgressBar } from "react-native-paper"
import TablaComponente from "@/components/tablaComponent"
import Breadcrumb from "@/components/BreadcrumbComponent"
import AddComponent from "@/components/AddComponent"
import { AlertaScroll } from "@/components/alerta"
import InputComponent from "@/components/InputComponent"
import {getAccounts, getMotions, deleteMotion, activeMotion, inactiveMotion, updateMotion, createMotion } from "@/services/adminServices"
import { useFocusEffect } from "@react-navigation/native"
import { router } from "expo-router"
import DropdownComponent from "@/components/DropdownComponent"
import ExcelPreviewButton from "@/components/ExcelViewComponent";
import PDFPreviewButton from "@/components/PdfViewComponent";


const columns = [
  { key: "id", title: "ID", sortable: true, width: 50 },
  { key: "tipoMovimiento", title: "Tipo Movimiento  ", sortable: true },
  { key: "fecha", title: "Fecha", sortable: true, width: 80 },
  { key: "monto", title: "Monto", sortable: true, width: 100 },
  { key: "descripcion", title: "Descripcion", sortable: true },
  { key: "cuentaEmisoraId", title: "Emisor", sortable: true },
  { key: "cuentaReceptoraId", title: "Receptor", sortable: true },
  {key: "estado", title: "Estado", sortable: true},
  { key: "createdAt", title: "Creado", sortable: true },
  { key: "updatedAt", title: "Modificado", sortable: true },
];

export default function MotionsE() {
  const [data, setData] = useState([])
  const [accounts,setAccounts]=useState([]);
  const [openForm, setOpenForm] = useState(false)
  const [formData, setFormData] = useState({ tipoMovimiento: "", fecha: "", monto: "", descripcion: "",cuentaEmisoraId : "", cuentaReceptoraId: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState({ text: "", type: "success" })
  const theme = useTheme()
  const { width } = useWindowDimensions()
  const optionsTipoMovimiento = [
    { label: "Transacción", value: "transaccion" },
    { label: "Presupuesto", value: "presupuesto" },
    { label: "Proyecto", value: "proyecto" },
  ]


  const optionsEmisor = accounts.map(account => ({ label: account.nombreCuenta, value: account.id }));
     useFocusEffect(
        useCallback(() => {
          const fetchData = async () => {
            try {
              const [groupsData, usersData] = await Promise.all([getMotions(), getAccounts()]);
              setData(groupsData);
              setAccounts(usersData.filter(account => account.estado === true));
            } catch (error) {
              console.error("Error fetching data:", error);
              setSnackbarMessage({ text: "Error al cargar los datos", type: "error" });
              setSnackbarVisible(true);
            }
          };
    
          fetchData();
        }, [])
      );

      

  const handleSubmit = useCallback(async () => {
    try {
      const requiredFields = isEditing ? ["tipoMovimiento", "fecha", "monto", "descripcion", "cuentaEmisoraId","cuentaReceptoraId"] : ["tipoMovimiento", "fecha", "monto", "descripcion", "cuentaEmisoraId","cuentaReceptoraId"]
      const emptyFields = requiredFields.filter((field) => !formData[field] || formData[field].trim() === "")

      if (emptyFields.length > 0) {
        setOpenForm(false);
        throw new Error(`Por favor, rellene los siguientes campos: ${emptyFields.join(", ")}`);

      }

      let newData
      if (isEditing) {
        await updateMotion(editingUserId, formData)
        newData = data.map((item) => (item.id === editingUserId ? { ...item, ...formData } : item))
      } else {
        const newUser = await createMotion(formData)
        if (!newUser) throw new Error("Error al crear el movimiento")
        newData = [...data, newUser.motion]
      }
      setData(newData)
      setSnackbarMessage({
        text: `Movimiento ${isEditing ? "actualizado" : "creado"} exitosamente`,
        type: "success",
      })
      resetForm()
    } catch (error) {
      resetForm()
      setSnackbarMessage({ text: error.response?.data.message ||  error.response?.data.errors[0].msg  || error.message , type: "error" })
    } finally {
      setSnackbarVisible(true)
    }
  }, [formData, isEditing, editingUserId, data])

  const resetForm = () => {
    setOpenForm(false)
    setIsEditing(false)
    setEditingUserId(null)
    setFormData({ tipoMovimiento: "", fecha: "", monto: "", descripcion: "",  cuentaEmisoraId: "", cuentaReceptoraId: "" })
  }

  const handleAction = useCallback(async (action, item) => {
    try {
     await action(item.id)
      setData((prevData) =>
        prevData.map((dataItem) =>
          dataItem.id === item.id ? { ...dataItem, estado: action === activeMotion } : dataItem,
        ),
      )
    } catch (error) {
      console.log(`Error al ${action === activeMotion ? "activar" : "desactivar"} el usuario:`, error)
      throw error;
    }
  }, []);

  const handleEdit = useCallback((item) => {
    setFormData({
      tipoMovimiento: item.tipoMovimiento,
      fecha: item.fecha,
      monto: item.monto,
      descripcion: item.descripcion,
      cuentaEmisoraId: item.cuentaEmisoraId,
      cuentaReceptoraId: item.cuentaReceptoraId
    })
    setEditingUserId(item.id)
    setIsEditing(true)
    setOpenForm(true)
  }, [])

  const isSmallScreen = width < 600
 
  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Breadcrumb
            items={[
              { label: "Dashboard", onPress: () => router.navigate("/(admin)/Dashboard") },
              { label: "Movimientos De Cuentas" },
            ]}
          />
          <View style={styles.headerActions}>
            <PDFPreviewButton data={data} columns={columns} iconStyle={styles.icon} />
            <ExcelPreviewButton columns={columns} data={data} iconStyle={styles.icon} />
          </View>
        </View>
        <View style={[styles.cardContainer, isSmallScreen && styles.cardContainerSmall]}>
          <Card style={[styles.card, isSmallScreen && styles.cardSmall]}>
            <Card.Content>
              <Text style={styles.cardTitle}>Total de movimientos</Text>
              <Text style={styles.cardValue}>{data.length}</Text>
              <ProgressBar progress={data.length * 0.01} color="#00ACE8" style={styles.progressBar} />
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
                await deleteMotion(item.id)
                setData((prevData) => prevData.filter((dataItem) => dataItem.id !== item.id))
              }}
              onToggleActive={(item) => handleAction(activeMotion, item)}
              onToggleInactive={(item) => handleAction(inactiveMotion, item)}
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
      <AlertaScroll
        onOpen={openForm}
        onClose={resetForm}
        title={isEditing ? "Editar movimiento" : "Nuevo movimiento"}
        content={
          <View style={styles.formContainer}>

<DropdownComponent
              options={optionsTipoMovimiento}
              onSelect={(value) => {
                setFormData({ ...formData, tipoMovimiento: value })
              }}
              placeholder="Tipo Movimiento"
              value={formData.tipoMovimiento}
            />
            {[ "fecha", "monto", "descripcion"].map((field) => (
              <InputComponent
                key={field}
                type={
                  field === "fecha"
                    ? "date"
                    : field === "monto"
                      ? "precio"
                      : field === "descripcion"
                        ? "descripcion"
                          : "text"
                }
                value={formData[field]}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, [field]: text }))}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                placeholder={`Introduce el ${field}`}
                validationRules={{ required: field !== "role", ...(field === "email" && { email: true }) }}
                errorMessage={`Por favor, introduce un ${field} válido`}
              />
            ))}
            <DropdownComponent
              options={optionsEmisor}
              onSelect={(value) => {
                setFormData({ ...formData, cuentaEmisoraId: value })
              }}
              placeholder="Cuenta Emisora"
              value={formData.cuentaEmisoraId}
            />
            <DropdownComponent
              options={optionsEmisor}
              onSelect={(value) => {
                setFormData({ ...formData, cuentaReceptoraId: value })
              }}
              placeholder="Cuenta Receptora"
              value={formData.cuentaReceptoraId}
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
})