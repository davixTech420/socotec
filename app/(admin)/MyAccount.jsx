import { useState, useEffect } from "react"
import { StyleSheet, View, ScrollView, Platform, useWindowDimensions } from "react-native"
import { TextInput, Avatar, Text, useTheme, Surface, Chip, IconButton } from "react-native-paper"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useAuth } from "@/context/userContext";


const AnimatedSurface = Animated.createAnimatedComponent(Surface)

const ProfileScreen = () => {
  const theme = useTheme()
  const { width } = useWindowDimensions()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    role: "",
    password:"",
    skills: ["React Native", "Node.js", "AWS", "Python", "Docker"],
    languages: ["English", "Spanish", "French"],
  })
  const [editedData, setEditedData] = useState(profileData);

  useEffect(() => {
    user().then(setProfileData).catch(error => console.log('Error user data:', error));
  }, []);


  const handleSave = () => {
    setProfileData(editedData)
    setIsEditing(false)
  }

  const stats = [
    { icon: "folder-open", label: "Proyectos Activos", value: "12", color: "#4CAF50" },
    { icon: "clock-outline", label: "Horas Registradas", value: "180h", color: "#2196F3" },
    { icon: "file-document-outline", label: "Permisos Pendientes", value: "3", color: "#FF9800" },
    { icon: "check-circle-outline", label: "Tareas Completadas", value: "45", color: "#9C27B0" },
  ]

  const isSmallScreen = width < 600
  const isMediumScreen = width >= 600 && width < 1024

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Section */}
      <Animated.View entering={FadeInUp} style={styles.header}>
        <View style={[styles.headerContent, isSmallScreen && styles.headerContentSmall]}>
          <View style={styles.avatarSection}>
            <Avatar.Image
              size={isSmallScreen ? 80 : 120}
              source={require("../../assets/images/favicon.png")}
              style={styles.avatar}
            />
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.name, isSmallScreen && styles.nameSmall]}>{profileData?.nombre}</Text>
            <Text style={styles.role}>{profileData.role}</Text>
            <Chip icon="badge-account" style={styles.idChip}>
              ID: {profileData?.id}
            </Chip>
          </View>
        </View>
      </Animated.View>

      {/* Stats Grid */}
      <Animated.View entering={FadeInUp.delay(200)} style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <AnimatedSurface
            key={stat.label}
            elevation={2}
            style={[
              styles.statCard,
              { backgroundColor: stat.color + "10" },
              (isSmallScreen || isMediumScreen) && styles.statCardResponsive,
            ]}
            entering={FadeInDown.delay(index * 100)}
          >
            <MaterialCommunityIcons name={stat.icon} size={isSmallScreen ? 24 : 32} color={stat.color} />
            <Text style={[styles.statValue, isSmallScreen && styles.statValueSmall]}>{stat.value}</Text>
            <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>{stat.label}</Text>
          </AnimatedSurface>
        ))}
      </Animated.View>

      {/* Profile Form */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.formContainer}>
        <AnimatedSurface elevation={1} style={styles.form}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Información de la Cuenta</Text>
            <IconButton
              icon={isEditing ? "content-save" : "pencil"}
              mode="contained"
              onPress={isEditing ? handleSave : () => setIsEditing(true)}
            />
          </View>
          <View style={[styles.formFields, !isSmallScreen && styles.formFieldsRow]}>
          <View style={styles.formField}>
      <MaterialCommunityIcons name="account" size={24} color={theme.colors.primary} style={styles.formIcon} />
      <TextInput
        label="Nombre"
        value={profileData?.nombre}
        onChangeText={(text) => setProfileData({ ...profileData, nombre: text })}
        mode="outlined"
        style={styles.formInput}
        disabled={!isEditing}
      />
    </View>
    <View style={styles.formField}>
      <MaterialCommunityIcons name="email" size={24} color={theme.colors.primary} style={styles.formIcon} />
      <TextInput
        label="Email"
        value={profileData?.email}
        onChangeText={(text) => setProfileData({ ...profileData, email: text })}
        mode="outlined"
        style={styles.formInput}
        disabled={!isEditing}
      />
    </View>
           
          </View>
          <View style={[styles.formFields, !isSmallScreen && styles.formFieldsRow]}>
          <View style={styles.formField}>
      <MaterialCommunityIcons name="phone" size={24} color={theme.colors.primary} style={styles.formIcon} />
      <TextInput
        value={profileData?.telefono}
        label="Telefono"
        onChangeText={(text) => setProfileData({ ...profileData, telefono: text })}
        mode="outlined"
        style={styles.formInput}
        disabled={!isEditing}
      />
    </View>
    <View style={styles.formField}>
      <MaterialCommunityIcons name="briefcase" size={24} color={theme.colors.primary} style={styles.formIcon} />
      <TextInput
        value={profileData?.role}
        label="Rol"
        onChangeText={(text) => setProfileData({ ...profileData, role: text })}
        mode="outlined"
        style={styles.formInput}
        disabled={!isEditing}
      />
    </View>
          </View>
          <View style={[styles.formFields, !isSmallScreen && styles.formFieldsRow]}>
          <View style={styles.formField}>
      <MaterialCommunityIcons name="lock" size={24} color={theme.colors.primary} style={styles.formIcon} />
      <TextInput
        value={profileData?.password}
        label="Contraseña"
        onChangeText={(text) => setProfileData({ ...profileData, password: text })}
        mode="outlined"
        style={styles.formInput}
        disabled={!isEditing}
      />
    </View>
          </View>
        </AnimatedSurface>
      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      },
    }),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerContentSmall: {
    flexDirection: "column",
    alignItems: "center",
  },
  avatarSection: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    borderWidth: 4,
    borderColor: "#fff",
  },
  onlineIndicator: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: "#fff",
  },
  headerInfo: {
    marginLeft: 20,
    flex: 1,
    alignItems: "flex-start",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  nameSmall: {
    fontSize: 20,
  },
  role: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  idChip: {
    alignSelf: "flex-start",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: Platform.OS === "web" ? 24 : 150,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statCardResponsive: {
    minWidth: "45%",
    padding: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  statValueSmall: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  statLabelSmall: {
    fontSize: 12,
  },
  formContainer: {
    marginBottom: 24,
  },
  form: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  formFields: {
    marginBottom: 16,
  },
  formFieldsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formField: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    flex: 1,
    marginRight: 8,
  },
  formIcon: {
    marginRight: 12,
  },
  formInput: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    backgroundColor: "#e3f2fd",
  },
  skillChipText: {
    color: "#1976d2",
  },
  languagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  languageChip: {
    backgroundColor: "#f5f5f5",
  },
})

export default ProfileScreen

