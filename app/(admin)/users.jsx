import React, { useEffect, useState, useCallback } from "react"
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
        // Cleanup function if needed
      }
    }, []),
  )

  const handleSubmit = useCallback(async () => {
    try {
      // Implement user creation logic here
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
    return null // or a loading indicator
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Breadcrumb items={[{ label: "Dashboard", onPress: () => {
          router.navigate("/(admin)/Dashboard")
        } }, { label: "Usuarios" }]} />
        <View style={styles.headerActions}>
          <AntDesign name="pdffile1" size={24} color={theme.colors.primary} style={styles.icon} />
          <MaterialCommunityIcons name="file-excel" size={24} color={theme.colors.primary} style={styles.icon} />
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

