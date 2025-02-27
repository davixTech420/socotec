import { useState, useCallback } from "react"
import { View, StyleSheet, ScrollView, useWindowDimensions, Platform } from "react-native"
import {
  PaperProvider,
  Text,
  Card,
  Button,
  Snackbar,
  ProgressBar,
  useTheme,
  Searchbar,
  Chip,
  Avatar,
} from "react-native-paper"
import { useFocusEffect } from "@react-navigation/native"
import TablaComponente from "@/components/tablaComponent"
import Breadcrumb from "@/components/BreadcrumbComponent"
import { router } from "expo-router"
import AddComponent from "../../components/AddComponent"
import { AlertaScroll } from "@/components/alerta"
import InputComponent from "@/components/InputComponent"
import {
  createGroup,
  updateGroup,
  getGroups,
  deleteGroup,
  activateGroup,
  inactivateGroup,
  getUsersNotGroup,
  getUsersGroup,
  deleteUsersGroup,
} from "@/services/adminServices"
import ExcelPreviewButton from "@/components/ExcelViewComponent";
import PDFPreviewButton from "@/components/PdfViewComponent";

const columns = [
  { key: "id", title: "ID", sortable: true, width: 50 },
  { key: "nombre", title: "Nombre", sortable: true },
  { key: "descripcion", title: "Descripcion", sortable: true, width: 80 },
  { key: "estado", title: "Estado", sortable: true },
  { key: "createdAt", title: "Creado", sortable: true },
  { key: "updatedAt", title: "Modificado", sortable: true },
]

const Groups = () => {
  const theme = useTheme()
  const { width } = useWindowDimensions()
  const isSmallScreen = width < 600

  const [data, setData] = useState([])
  const [editingGroupId, setEditingGroupId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState({ text: "", type: "success" })
  const [openForm, setOpenForm] = useState(false)
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" })
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")


  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [groupsData, usersData] = await Promise.all([getGroups(), getUsersNotGroup()]);
          setData(groupsData);
          setUsers(usersData);
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
      const requiredFields = ["nombre", "descripcion"]
      const emptyFields = requiredFields.filter((field) => !formData[field]?.trim())

      if (emptyFields.length > 0) {
        throw new Error(`Por favor, rellene los siguientes campos: ${emptyFields.join(", ")}`)
      }

      const dataToSubmit = {
        ...formData,
        usuarios: selectedUsers.map((user) => user.id),
      }


let newData
      if (isEditing) {
        await updateGroup(editingGroupId, dataToSubmit)
        newData = data.map((item) => (item.id === editingGroupId ? { ...item, ...dataToSubmit } : item))
        /* setData((prevData) =>
          prevData.map((item) => (item.id === editingGroupId ? { ...item, ...dataToSubmit } : item)),
        ) */
      } else {
        const newGroup = await createGroup(dataToSubmit)
        if (!newGroup) throw new Error("Error al crear el grupo")
          newData = [...data, newGroup.group]



        /* setData((prevData) => [...prevData, newGroup.group]) */
      }
      setData(newData)
      setSnackbarMessage({
        text: `Grupo ${isEditing ? "actualizado" : "creado"} exitosamente`,
        type: "success",
      })
      resetForm()
    } catch (error) {
      resetForm();
      setSnackbarMessage({ text: error.response?.data.message || error.message, type: "error" })
     
    } finally {
      setSnackbarVisible(true)
    }
  }, [formData, isEditing, editingGroupId, selectedUsers])

  const resetForm = useCallback(() => {
    setOpenForm(false)
    setIsEditing(false)
    setEditingGroupId(null)
    setFormData({ nombre: "", descripcion: "" })
    setSelectedUsers([])
    setSearchQuery("")
  }, [])

  const handleAction = useCallback(async (action, item) => {
    try {
      await action(item.id)
      setData((prevData) =>
        prevData.map((dataItem) =>
          dataItem.id === item.id ? { ...dataItem, estado: action === activateGroup } : dataItem,
        ),
      )
    } catch (error) {
      console.log(`Error al ${action === activateGroup ? "activar" : "desactivar"} el grupo:`, error)
      setSnackbarMessage({
        text: `Error al ${action === activateGroup ? "activar" : "desactivar"} el grupo`,
        type: "error",
      })
      throw error;
    }
  }, [])

  const handleEdit = useCallback(async (item) => {
      setFormData({
        nombre: item.nombre,
        descripcion: item.descripcion,
      })
      setEditingGroupId(item.id)
      const usersGroup = await getUsersGroup(item.id)
      setSelectedUsers(usersGroup.map((item) => item.User))
      setIsEditing(true)
      setOpenForm(true)
  }, [])

  

  const toggleUserSelection = useCallback(async (user) => {
    if (!user?.id) {
      console.error('User ID is undefined');
      return;
    }
    await deleteUsersGroup(user.id);

    setSelectedUsers((prevUsers) =>
      prevUsers.some((u) => u.id === user.id) ? prevUsers.filter((u) => u.id !== user.id) : [...prevUsers, user],
    )
  }, [])

  const filteredUsers = users.filter(
    (user) => 
      user.estado === true &&
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedUsers.some((selectedUser) => selectedUser.id === user.id),
  )

  const totalItems = data.length
  const itemsProgress = Math.min(totalItems / 1000, 1).toFixed(2)

  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Breadcrumb
            items={[{ label: "Dashboard", onPress: () => router.navigate("/(admin)/Dashboard") }, { label: "Grupos" }]}
          />
          <View style={styles.headerActions}>
            <PDFPreviewButton data={data} columns={columns} iconStyle={styles.icon} />
            <ExcelPreviewButton data={data} columns={columns} iconStyle={styles.icon} />
          </View>
        </View>
        <View style={[styles.cardContainer, isSmallScreen && styles.cardContainerSmall]}>
          <Card style={[styles.card, isSmallScreen && styles.cardSmall]}>
            <Card.Content>
              <Text style={styles.cardTitle}>Total de grupos</Text>
              <Text style={styles.cardValue}>{totalItems}</Text>
              <ProgressBar progress={Number.parseFloat(itemsProgress)} color="#00ACE8" style={styles.progressBar} />
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.tableCard}>
          <Card.Content>
            <TablaComponente
              data={data}
              columns={columns}
              keyExtractor={(item) => String(item.id)}
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
      <AlertaScroll
        onOpen={openForm}
        onClose={resetForm}
        title={isEditing ? "Editar grupo" : "Nuevo grupo"}
        content={
          <View style={styles.formContainer}>
            <InputComponent
              type="text"
              value={formData.nombre}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, nombre: text }))}
              label="Nombre"
              placeholder="Introduce el nombre del grupo"
              validationRules={{ required: true }}
              errorMessage="Por favor, introduce un nombre válido"
            />
            <InputComponent
              type="text"
              value={formData.descripcion}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, descripcion: text }))}
              label="Descripción"
              placeholder="Introduce la descripción del grupo"
              validationRules={{ required: true }}
              errorMessage="Por favor, introduce una descripción válida"
            />

            <View style={styles.selectedUsersContainer}>
              <Text style={styles.label}>Usuarios del grupo seleccionados:</Text>
              <ScrollView horizontal style={styles.selectedUsers}>
                {selectedUsers.map((user) => (
                  <Chip
                    key={user.id}
                    onClose={() => toggleUserSelection(user)}
                    style={styles.selectedChip}
                    avatar={<Avatar.Text size={24} label={user.nombre[0]} />}
                  >
                    {user.nombre}
                  </Chip>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.label}>Usuarios disponibles</Text>
            <Searchbar
              placeholder="Buscar usuarios"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />
            <ScrollView style={styles.userList}>
              {filteredUsers.map((user) => (
                <Chip
                  key={user.id}
                  onPress={() => toggleUserSelection(user)}
                  style={styles.chip}
                  avatar={<Avatar.Text size={24} label={user.nombre[0]} />}
                >
                  {user.nombre}
                </Chip>
              ))}
            </ScrollView>
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
    </PaperProvider>
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
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  searchBar: {
    marginBottom: 10,
  },
  userList: {
    maxHeight: 200,
    marginBottom: 10,
  },
  chip: {
    margin: 4,
  },
  selectedUsersContainer: {
    marginTop: 10,
  },
  selectedUsers: {
    flexDirection: "row",
  },
  selectedChip: {
    margin: 4,
    backgroundColor: "#e0e0e0",
  },
})

export default Groups

