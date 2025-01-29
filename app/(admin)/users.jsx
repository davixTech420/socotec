/* import React, { useEffect, useState, useCallback } from "react"
import { View, StyleSheet, ScrollView, Platform } from "react-native"
import { Text, Card, Button, useTheme } from "react-native-paper"
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"
import TablaComponente from "@/components/tablaComponent"
import Breadcrumb from "@/components/BreadcrumbComponent"
import AddComponent from "@/components/AddComponent"
import { AlertaScroll } from "@/components/alerta"
import InputComponent from "@/components/InputComponent"
import { getUsers, deleteUser, activateUser, inactivateUser } from "@/services/adminServices"
import { useFocusEffect } from "@react-navigation/native"
import { router } from "expo-router";

const columns = [
  { key: "id", title: "ID", sortable: true, width: 50 },
  { key: "nombre", title: "Nombre", sortable: true },
  { key: "telefono", title: "Teléfono", sortable: true, width: 80 },
  { key: "email", title: "Email", sortable: true, width: 100 },
  { key: "estado", title: "Estado", sortable: true },
  { key: "role", title: "Rol", sortable: true },
  { key: "createdAt", title: "Creado", sortable: true },
  { key: "updatedAt", title: "Modificado", sortable: true },
]

export default function Users() {
  const [data, setData] = useState([])
  const [openForm, setOpenForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    role: "",
  })
  const [isMounted, setIsMounted] = useState(false)

  const theme = useTheme()

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await getUsers()
          setData(response)
        } catch (error) {
          console.error("Error al obtener los datos:", error)
        }
      }
      fetchData()

      return () => {
      
      }
    }, []),
  )

  const handleSubmit = useCallback(async () => {
    try {
     
      console.log("Creating user:", formData)
      setOpenForm(false)
    } catch (error) {
      console.error("Error al crear el usuario:", error)
    }
  }, [formData])

  const handleDelete = useCallback(async (item) => {
    try {
      await deleteUser(item.id)
      setData((prevData) => prevData.filter((dataItem) => dataItem.id !== item.id))
      return Promise.resolve()
    } catch (error) {
      console.error("Error al eliminar el usuario:", error)
      return Promise.reject(error)
    }
  }, [])

  const handleToggleActive = useCallback(async (item) => {
    try {
      await activateUser(item.id)
      setData((prevData) =>
        prevData.map((dataItem) => (dataItem.id === item.id ? { ...dataItem, estado: true } : dataItem)),
      )
      return Promise.resolve()
    } catch (error) {
      console.error("Error al activar el usuario:", error)
      return Promise.reject(error)
    }
  }, [])

  const handleToggleInactive = useCallback(async (item) => {
    try {
      await inactivateUser(item.id)
      setData((prevData) =>
        prevData.map((dataItem) => (dataItem.id === item.id ? { ...dataItem, estado: false } : dataItem)),
      )
      return Promise.resolve()
    } catch (error) {
      console.error("Error al desactivar el usuario:", error)
      return Promise.reject(error)
    }
  }, [])

  const handleSort = useCallback((key, order) => {
    console.log("Ordenando por:", key, order)
  }, [])

  const handleSearch = useCallback((query) => {
    console.log("Buscando:", query)
  }, [])

  const handleFilter = useCallback((filters) => {
    console.log("Filtrando:", filters)
  }, [])

  if (!isMounted) {
    return null 
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Breadcrumb items={[{ label: "Dashboard", onPress: () => {
          router.navigate("/(admin)/Dashboard")
        } }, { label: "Usuarios" }]} />
        <View style={styles.headerActions}>
          <AntDesign name="pdffile1" size={24} color="red" style={styles.icon} />
          <MaterialCommunityIcons name="file-excel" size={24} color="green" style={styles.icon} />
        </View>
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
            onDataUpdate={setData}
          />
        </Card.Content>
      </Card>

      <AlertaScroll
        onOpen={openForm}
        onClose={() => setOpenForm(false)}
        title="Nuevo usuario"
        content={
          <View style={styles.formContainer}>
            <InputComponent
              type="text"
              value={formData.nombre}
              onChangeText={(text) => setFormData({ ...formData, nombre: text })}
              label="Nombre"
              placeholder="Introduce el nombre"
              validationRules={{ required: true }}
              errorMessage="Por favor, introduce un nombre válido"
            />
            <InputComponent
              type="email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              label="Email"
              placeholder="Introduce el email"
              validationRules={{ required: true, email: true }}
              errorMessage="Por favor, introduce un email válido"
            />
            <InputComponent
              type="tel"
              value={formData.telefono}
              onChangeText={(text) => setFormData({ ...formData, telefono: text })}
              label="Teléfono"
              placeholder="Introduce el teléfono"
              validationRules={{ required: true }}
              errorMessage="Por favor, introduce un teléfono válido"
            />
            <InputComponent
              type="text"
              value={formData.role}
              onChangeText={(text) => setFormData({ ...formData, role: text })}
              label="Rol"
              placeholder="Introduce el rol"
              validationRules={{ required: true }}
              errorMessage="Por favor, introduce un rol válido"
            />
          </View>
        }
        actions={[
          <Button key="cancel" onPress={() => setOpenForm(false)}>
            Cancelar
          </Button>,
          <Button key="create" onPress={handleSubmit}>
            Crear
          </Button>,
        ]}
      />
      <AddComponent onOpen={() => setOpenForm(true)} />
    </ScrollView>
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

 */


import React, { useEffect, useState, useCallback } from "react"
import { View, StyleSheet, ScrollView, Platform } from "react-native"
import { Text, Card, Button, useTheme, Snackbar, Portal } from "react-native-paper"
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"
import TablaComponente from "@/components/tablaComponent"
import Breadcrumb from "@/components/BreadcrumbComponent"
import AddComponent from "@/components/AddComponent"
import { AlertaScroll } from "@/components/alerta"
import InputComponent from "@/components/InputComponent"
import { getUsers, deleteUser, activateUser, inactivateUser, updateUser,createUser } from "@/services/adminServices"
import { useFocusEffect } from "@react-navigation/native"
import { router } from "expo-router"


const columns = [
  { key: "id", title: "ID", sortable: true, width: 50 },
  { key: "nombre", title: "Nombre", sortable: true },
  { key: "telefono", title: "Teléfono", sortable: true, width: 80 },
  { key: "email", title: "Email", sortable: true, width: 100 },
  { key: "estado", title: "Estado", sortable: true },
  { key: "role", title: "Rol", sortable: true },
  { key: "createdAt", title: "Creado", sortable: true },
  { key: "updatedAt", title: "Modificado", sortable: true },
]

export default function Users() {
  const [data, setData] = useState([])
  const [openForm, setOpenForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
  })
  const [isMounted, setIsMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState({ text: "", type: "success" })

  const theme = useTheme()

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await getUsers()
          setData(response)
        } catch (error) {
          console.error("Error al obtener los datos:", error)
        }
      }
      fetchData()

      return () => {
        // Cleanup function if needed
      }
    }, []),
  )

  const handleSubmit = useCallback(async () => {
    try {
      if (isEditing) {
        // Implement user update logic here
        await updateUser(editingUserId, formData)
        setData((prevData) => prevData.map((item) => (item.id === editingUserId ? { ...item, ...formData } : item)))
        setSnackbarMessage({
          text: "Usuario actualizado exitosamente",
          type: "success",
        })
      } else {
        // Implement user creation logic here
        const newUser =  await createUser(formData);
        setData((prevData) => [...prevData, newUser])
        setSnackbarMessage({
          text: "Usuario creado exitosamente",
          type: "success",
        })
      }
      setOpenForm(false)
      setIsEditing(false)
      setEditingUserId(null)
      setFormData({ nombre: "", email: "", telefono: "", role: "" })
      setSnackbarVisible(true)
    } catch (error) {
      console.error("Error al crear/actualizar el usuario:", error)
      setSnackbarMessage({
        text: `Error al ${isEditing ? "actualizar" : "crear"} el usuario: ${error.message}`,
        type: "error",
      })
      setSnackbarVisible(true)
    }
  }, [formData, isEditing, editingUserId])

  const handleDelete = useCallback(async (item) => {
    try {
      await deleteUser(item.id)
      setData((prevData) => prevData.filter((dataItem) => dataItem.id !== item.id))
      return Promise.resolve()
    } catch (error) {
      console.error("Error al eliminar el usuario:", error)
      return Promise.reject(error)
    }
  }, [])

  const handleToggleActive = useCallback(async (item) => {
    try {
      await activateUser(item.id)
      setData((prevData) =>
        prevData.map((dataItem) => (dataItem.id === item.id ? { ...dataItem, estado: true } : dataItem)),
      )
      return Promise.resolve()
    } catch (error) {
      console.error("Error al activar el usuario:", error)
      return Promise.reject(error)
    }
  }, [])

  const handleToggleInactive = useCallback(async (item) => {
    try {
      await inactivateUser(item.id)
      setData((prevData) =>
        prevData.map((dataItem) => (dataItem.id === item.id ? { ...dataItem, estado: false } : dataItem)),
      )
      return Promise.resolve()
    } catch (error) {
      console.error("Error al desactivar el usuario:", error)
      return Promise.reject(error)
    }
  }, [])

  const handleSort = useCallback((key, order) => {
    console.log("Ordenando por:", key, order)
  }, [])

  const handleSearch = useCallback((query) => {
    console.log("Buscando:", query)
  }, [])

  const handleFilter = useCallback((filters) => {
    console.log("Filtrando:", filters)
  }, [])

  const handleEdit = useCallback((item) => {
    setFormData({
      nombre: item.nombre,
      email: item.email,
      telefono: item.telefono,
      role: item.role,
    })
    setEditingUserId(item.id)
    setIsEditing(true)
    setOpenForm(true)
  }, [])

  if (!isMounted) {
    return null // or a loading indicator
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                onPress: () => {
                  router.navigate("/(admin)/Dashboard")
                },
              },
              { label: "Usuarios" },
            ]}
          />
          <View style={styles.headerActions}>
            <AntDesign name="pdffile1" size={24} color="red" style={styles.icon} />
            <MaterialCommunityIcons name="file-excel" size={24} color="green" style={styles.icon} />
          </View>
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
              onDataUpdate={setData}
              onEdit={handleEdit}
            />
          </Card.Content>
          
        </Card>
       
        
      </ScrollView>





      <Snackbar
      visible={snackbarVisible}
      onDismiss={() => setSnackbarVisible(false)}
      duration={3000}
      style={{
        backgroundColor: snackbarMessage.type === "success" ? theme.colors.success : theme.colors.error,
      }}
      action={{
        label: "Cerrar",
        onPress: () => setSnackbarVisible(false),
      }}
    >
      <Text style={{ color: theme.colors.surface }}>{snackbarMessage.text}</Text>
    </Snackbar>


      <AlertaScroll
          onOpen={openForm}
          onClose={() => {
            setOpenForm(false)
            setIsEditing(false)
            setEditingUserId(null)
            setFormData({ nombre: "", email: "", telefono: "" })
          }}
          title={isEditing ? "Editar usuario" : "Nuevo usuario"}
          content={
            <View style={styles.formContainer}>
              <InputComponent
                type="nombre"
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                label="Nombre"
                placeholder="Introduce el nombre"
                validationRules={{ required: true }}
                errorMessage="Por favor, introduce un nombre válido"
              />
              <InputComponent
                type="email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                label="Email"
                placeholder="Introduce el email"
                validationRules={{ required: true, email: true }}
                errorMessage="Por favor, introduce un email válido"
              />
              <InputComponent
                type="number"
                value={formData.telefono}
                onChangeText={(text) => {
                  setFormData({ ...formData, telefono: text });
                }}
                label="Teléfono"
                placeholder="Introduce el teléfono"
                validationRules={{ required: true }}
                errorMessage="Por favor, introduce un teléfono válido"
              />
              {!isEditing && (
                <InputComponent
                  type="password"
                  value={formData.role}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  label="Contraseña"
                  placeholder="Introduce la contraseña"
                  validationRules={{ required: true }}
                  errorMessage="Por favor, introduce una contraseña de minimo 8 caracteres"
                />
              )}
              
            </View>
          }
          actions={[
            <Button
              key="cancel"
              onPress={() => {
                setOpenForm(false)
                setIsEditing(false)
                setEditingUserId(null)
                setFormData({ nombre: "", email: "", telefono: "" })
              }}
            >
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

