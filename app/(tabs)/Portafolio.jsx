import React, { useState, useCallback, useEffect, useRef } from "react"
import { Platform, Dimensions, Modal, View, BackHandler, FlatList, Pressable, ImageBackground } from "react-native"
import { Card, Text, Button, useTheme, Surface, IconButton, Chip, Divider, ActivityIndicator } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeIn,
  SlideInRight,
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
  cancelAnimation,
} from "react-native-reanimated"
import { useFocusEffect } from "@react-navigation/native"
import { getPortfolioActive, SrcImagen } from "@/services/publicServices"

const AnimatedSurface = Animated.createAnimatedComponent(Surface)
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height
const IS_MOBILE = Platform.OS === "android" || Platform.OS === "ios"

// Categorías de proyectos
const CATEGORIES = [
  { id: "all", name: "Todos" },
  { id: "commercial", name: "Comercial" },
  { id: "residential", name: "Residencial" },
  { id: "industrial", name: "Industrial" },
  { id: "urban", name: "Urbanismo" },
]

// Componente para la cabecera corporativa
const CompanyHeader = React.memo(() => {
  const theme = useTheme()
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(50)

  useEffect(() => {
    // Animaciones más suaves para móviles
    const duration = IS_MOBILE ? 500 : 1000
    opacity.value = withTiming(1, { duration })
    translateY.value = withTiming(0, { duration: duration - 200 })

    return () => {
      // Cancelar animaciones al desmontar
      cancelAnimation(opacity)
      cancelAnimation(translateY)
    }
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={[animatedStyle, { marginBottom: 20, marginTop: 30 }]}>
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop" }}
        style={{
          height: 200,
          justifyContent: "flex-end",
          padding: 20,
          borderRadius: 16,
          overflow: "hidden",
        }}
        imageStyle={{ borderRadius: 16 }}
      >
        <Surface
          style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <Text variant="headlineMedium" style={{ color: "white", fontWeight: "bold" }}>
            ARQUITECTOS INNOVACIÓN
          </Text>
          <Text variant="titleMedium" style={{ color: "white", marginTop: 4 }}>
            Transformando espacios, construyendo futuro
          </Text>
        </Surface>
      </ImageBackground>
    </Animated.View>
  )
})

// Componente para estadísticas de la empresa
const CompanyStats = React.memo(() => {
  const theme = useTheme()
  const stats = [
    { icon: "office-building", value: "120+", label: "Proyectos" },
    { icon: "account-group", value: "25+", label: "Profesionales" },
    { icon: "map-marker", value: "18", label: "Países" },
    { icon: "trophy", value: "32", label: "Premios" },
  ]

  return (
    <Animated.View entering={IS_MOBILE ? FadeIn.delay(300) : FadeInUp.delay(300).springify()}>
      <Surface
        style={{
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
          backgroundColor: theme.colors.elevation.level2,
        }}
      >
        <Text variant="titleMedium" style={{ marginBottom: 16, textAlign: "center" }}>
          Nuestra Trayectoria
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {stats.map((stat, index) => (
            <Animated.View
              key={index}
              entering={IS_MOBILE ? FadeIn.delay(100) : FadeInUp.delay(400 + index * 100)}
              style={{
                alignItems: "center",
                minWidth: 80,
                flex: Platform.OS === "web" ? 0 : 1,
                maxWidth: Platform.OS === "web" ? 120 : undefined,
              }}
            >
              <MaterialCommunityIcons name={stat.icon} size={28} color={theme.colors.primary} />
              <Text variant="headlineSmall" style={{ fontWeight: "bold", marginTop: 4 }}>
                {stat.value}
              </Text>
              <Text variant="bodySmall" style={{ textAlign: "center" }}>
                {stat.label}
              </Text>
            </Animated.View>
          ))}
        </View>
      </Surface>
    </Animated.View>
  )
})

// Componente para el filtro de categorías
const CategoryFilter = React.memo(({ categories, selectedCategory, onSelectCategory }) => {
  const theme = useTheme()
  const scrollRef = useRef(null)

  return (
    <Animated.View entering={IS_MOBILE ? FadeIn : FadeInDown.delay(200)}>
      <FlatList
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16, gap: 8 }}
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Chip
            selected={selectedCategory === item.id}
            onPress={() => onSelectCategory(item.id)}
            style={{ marginRight: 8 }}
            mode={selectedCategory === item.id ? "flat" : "outlined"}
          >
            {item.name}
          </Chip>
        )}
      />
    </Animated.View>
  )
})

// Componente optimizado para la vista detallada del proyecto
const ProjectDetailsModal = React.memo(({ visible, project, onDismiss }) => {
  const theme = useTheme()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const scrollY = useSharedValue(0)

  // Handle back button press on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (visible) {
        onDismiss()
        return true
      }
      return false
    })

    return () => backHandler.remove()
  }, [visible, onDismiss])

  // Reset image index when modal opens with a new project
  useEffect(() => {
    if (visible) {
      setCurrentImageIndex(0)
      scrollY.value = 0
      setIsImageLoaded(false)
    }

    return () => {
      // Cancelar animaciones al cerrar el modal
      cancelAnimation(scrollY)
    }
  }, [visible, project])

  if (!project) return null

  // Simplificar animaciones en móviles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    if (IS_MOBILE) {
      return { height: 300 }
    }

    return {
      height: interpolate(scrollY.value, [0, 100], [300, 200], Extrapolate.CLAMP),
      opacity: interpolate(scrollY.value, [0, 100], [1, 0.8], Extrapolate.CLAMP),
    }
  })

  const handleScroll = (event) => {
    if (IS_MOBILE) return // Desactivar animación de scroll en móviles
    ;("worklet")
    scrollY.value = event.nativeEvent.contentOffset.y
  }

  // Características del proyecto (ejemplo)
  const features = [
    { icon: "check-circle", text: project.detalle || "Diseño sostenible" },
    { icon: "check-circle", text: "Materiales de alta calidad" },
    { icon: "check-circle", text: "Eficiencia energética" },
    { icon: "check-circle", text: "Optimización de espacios" },
  ]

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      hardwareAccelerated={true} // Mejora rendimiento en Android
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.95)" }}>
        {/* Indicador de carga mientras se prepara el modal */}
        {!isImageLoaded && IS_MOBILE && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 20,
            }}
          >
            <ActivityIndicator size="large" color="white" />
          </View>
        )}

        <Animated.FlatList
          data={[1]} // Solo necesitamos un elemento
          keyExtractor={() => "details"}
          renderItem={() => (
            <Surface
              style={{
                margin: Platform.OS === "web" ? "5%" : 16,
                borderRadius: 16,
                backgroundColor: theme.colors.elevation.level2,
                overflow: "hidden",
              }}
            >
              <IconButton
                icon="close"
                size={24}
                onPress={onDismiss}
                style={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  zIndex: 10,
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
                iconColor="white"
              />

              <Animated.View style={[{ position: "relative" }, headerAnimatedStyle]}>
                <Card.Cover
                  source={{ uri: SrcImagen(project.imagenes[currentImageIndex].uri) }}
                  style={{ height: "100%" }}
                  resizeMode="cover"
                  onLoadStart={() => setIsImageLoaded(false)}
                  onLoad={() => setIsImageLoaded(true)}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 16,
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <IconButton
                    icon="chevron-left"
                    size={30}
                    onPress={() =>
                      setCurrentImageIndex((prev) => (prev - 1 + project.imagenes.length) % project.imagenes.length)
                    }
                    iconColor="white"
                    style={{ backgroundColor: "rgba(0,0,0,0.3)", margin: 0 }}
                  />
                  <Text style={{ color: "white", alignSelf: "center" }}>
                    {currentImageIndex + 1} / {project.imagenes.length}
                  </Text>
                  <IconButton
                    icon="chevron-right"
                    size={30}
                    onPress={() => setCurrentImageIndex((prev) => (prev + 1) % project.imagenes.length)}
                    iconColor="white"
                    style={{ backgroundColor: "rgba(0,0,0,0.3)", margin: 0 }}
                  />
                </View>
              </Animated.View>

              <View style={{ padding: 16 }}>
                {/* Simplificar animaciones en móviles */}
                <View>
                  <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>
                    {project.nombre}
                  </Text>
                  <Chip icon="tag" style={{ alignSelf: "flex-start", marginTop: 8 }}>
                    {project.categoria || "Comercial"}
                  </Chip>
                  <Text variant="bodyLarge" style={{ marginTop: 16 }}>
                    {project.descripcion}
                  </Text>
                </View>

                <Divider style={{ marginVertical: 20 }} />

                <View>
                  <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: "bold" }}>
                    Detalles del Proyecto
                  </Text>

                  <Surface
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      backgroundColor: theme.colors.elevation.level1,
                    }}
                  >
                    <View style={{ gap: 12 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text variant="bodyMedium" style={{ fontWeight: "500" }}>
                          Área:
                        </Text>
                        <Text variant="bodyMedium">{project.superficie || "1,200 m²"}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text variant="bodyMedium" style={{ fontWeight: "500" }}>
                          Ubicación:
                        </Text>
                        <Text variant="bodyMedium">{project.ubicacion || "Ciudad de México"}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text variant="bodyMedium" style={{ fontWeight: "500" }}>
                          Año:
                        </Text>
                        <Text variant="bodyMedium">{project.createdAt || "2023"}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text variant="bodyMedium" style={{ fontWeight: "500" }}>
                          Cliente:
                        </Text>
                        <Text variant="bodyMedium">{project.cliente || "Corporativo XYZ"}</Text>
                      </View>
                    </View>
                  </Surface>
                </View>

                <View>
                  <Text variant="titleMedium" style={{ marginTop: 24, marginBottom: 12, fontWeight: "bold" }}>
                    Características
                  </Text>

                  <Surface
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      backgroundColor: theme.colors.elevation.level1,
                    }}
                  >
                    {features.map((feature, index) => (
                      <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                        <MaterialCommunityIcons name={feature.icon} size={20} color={theme.colors.primary} />
                        <Text variant="bodyMedium" style={{ marginLeft: 12 }}>
                          {feature.text}
                        </Text>
                      </View>
                    ))}
                  </Surface>
                </View>

                <View style={{ marginTop: 24 }}>
                  <Button mode="contained" icon="file-document" style={{ borderRadius: 8 }}>
                    Descargar Ficha Técnica
                  </Button>
                </View>
              </View>
            </Surface>
          )}
          onScroll={handleScroll}
          scrollEventThrottle={IS_MOBILE ? 32 : 16}
          removeClippedSubviews={true}
          contentContainerStyle={{ paddingBottom: 20 }}
          scrollEnabled={!IS_MOBILE || isImageLoaded}
        />
      </View>
    </Modal>
  )
})

// Componente para la tarjeta de proyecto
const ProjectCard = React.memo(({ project, onPress, index }) => {
  const theme = useTheme()
  const scale = useSharedValue(1)
  const rotation = useSharedValue(0)

  const handlePressIn = () => {
    // Animaciones más ligeras en móviles
    if (IS_MOBILE) {
      scale.value = withTiming(0.98, { duration: 150 })
    } else {
      scale.value = withSpring(0.97)
      rotation.value = withTiming(index % 2 === 0 ? -1 : 1)
    }
  }

  const handlePressOut = () => {
    if (IS_MOBILE) {
      scale.value = withTiming(1, { duration: 150 })
    } else {
      scale.value = withSpring(1)
      rotation.value = withTiming(0)
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: IS_MOBILE ? "0deg" : `${rotation.value}deg` }],
  }))

  return (
    <Animated.View
      entering={
        IS_MOBILE
          ? FadeIn.delay(100)
          : index % 2 === 0
            ? SlideInLeft.delay(300 + index * 100)
            : SlideInRight.delay(300 + index * 100)
      }
      style={{ marginBottom: 20 }}
    >
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(project)}
        style={[animatedStyle]}
      >
        <Surface
          style={{
            borderRadius: 16,
            overflow: "hidden",
            elevation: 4,
          }}
        >
          <ImageBackground
            source={{ uri: SrcImagen(project.imagenes[0].uri) }}
            style={{
              height: 220,
              justifyContent: "flex-end",
            }}
            resizeMode="cover"
          >
            <Surface
              style={{
                padding: 16,
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text variant="titleLarge" style={{ color: "white", fontWeight: "bold" }}>
                    {project.nombre}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: "white", marginTop: 4 }}>
                    {project.ubicacion || "Ciudad de México"}
                  </Text>
                </View>
                <IconButton
                  icon="arrow-right"
                  iconColor="white"
                  size={24}
                  style={{ backgroundColor: theme.colors.primary, margin: 0 }}
                  onPress={() => onPress(project)}
                />
              </View>
            </Surface>
          </ImageBackground>
        </Surface>
      </AnimatedPressable>
    </Animated.View>
  )
})

// Componente principal del portafolio optimizado
export default function Portafolio() {
  const theme = useTheme()
  const [selectedProject, setSelectedProject] = useState(null)
  const [portfolio, setPortfolio] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredProjects, setFilteredProjects] = useState([])
  const [isProcessingPress, setIsProcessingPress] = useState(false)

  // Obtener datos del portafolio
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true)
      getPortfolioActive()
        .then((data) => {
          setPortfolio(data)
          setFilteredProjects(Object.values(data))
          setIsLoading(false)
        })
        .catch((error) => {
          console.error(error)
          setIsLoading(false)
        })

      return () => {
        setSelectedProject(null)
        setIsModalVisible(false)
        setIsProcessingPress(false)
      }
    }, []),
  )

  // Filtrar proyectos por categoría
  useEffect(() => {
    if (portfolio && Object.values(portfolio).length > 0) {
      if (selectedCategory === "all") {
        setFilteredProjects(Object.values(portfolio))
      } else {
        // Asumiendo que cada proyecto tiene una propiedad 'categoria'
        // Si no existe, puedes asignar categorías aleatorias para demostración
        const filtered = Object.values(portfolio).filter((project) => {
          // Si el proyecto no tiene categoría, asignar una aleatoria para demostración
          const projectCategory =
            project.categoria || CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 1)) + 1].id
          return projectCategory === selectedCategory
        })
        setFilteredProjects(filtered)
      }
    }
  }, [selectedCategory, portfolio])

  // Función optimizada para abrir el modal
  const openProjectModal = useCallback(
    (project) => {
      // Evitar múltiples pulsaciones rápidas
      if (isProcessingPress) return

      setIsProcessingPress(true)

      // En móviles, primero establecer el proyecto seleccionado
      // y luego mostrar el modal con un pequeño retraso
      if (IS_MOBILE) {
        setSelectedProject(project)

        // Usar setTimeout para dar tiempo al sistema a procesar
        setTimeout(() => {
          setIsModalVisible(true)
          // Permitir nuevas pulsaciones después de un tiempo
          setTimeout(() => {
            setIsProcessingPress(false)
          }, 500)
        }, 100)
      } else {
        // En web, el comportamiento original
        setSelectedProject(project)
        setIsModalVisible(true)
        setIsProcessingPress(false)
      }
    },
    [isProcessingPress],
  )

  // Función optimizada para cerrar el modal
  const closeProjectModal = useCallback(() => {
    if (isProcessingPress) return

    setIsProcessingPress(true)
    setIsModalVisible(false)

    // Limpiar el proyecto seleccionado después de cerrar el modal
    setTimeout(
      () => {
        setSelectedProject(null)
        setIsProcessingPress(false)
      },
      IS_MOBILE ? 300 : 100,
    )
  }, [isProcessingPress])

  // Renderizar el encabezado
  const renderHeader = useCallback(
    () => (
      <>
        <CompanyHeader />
        <CompanyStats />
        <View>
          <Text variant="headlineMedium" style={{ marginTop: 8, marginBottom: 8, fontWeight: "bold" }}>
            Nuestros Proyectos
          </Text>
          <Text variant="bodyLarge" style={{ marginBottom: 16 }}>
            Descubre nuestra trayectoria de excelencia en arquitectura y diseño
          </Text>
        </View>
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </>
    ),
    [selectedCategory],
  )

  // Renderizar el contenido principal
  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <View style={{ padding: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16 }}>Cargando proyectos...</Text>
        </View>
      )
    }

    if (filteredProjects.length === 0) {
      return (
        <View style={{ padding: 40, alignItems: "center" }}>
          <MaterialCommunityIcons name="folder-open" size={48} color={theme.colors.outline} />
          <Text variant="titleMedium" style={{ marginTop: 16, textAlign: "center" }}>
            No hay proyectos disponibles en esta categoría
          </Text>
          <Button mode="outlined" onPress={() => setSelectedCategory("all")} style={{ marginTop: 16 }}>
            Ver todos los proyectos
          </Button>
        </View>
      )
    }

    return null
  }, [isLoading, filteredProjects, theme.colors, selectedCategory])

  // Renderizar un proyecto
  const renderProject = useCallback(
    ({ item, index }) => <ProjectCard project={item} onPress={openProjectModal} index={index} />,
    [openProjectModal],
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProject}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderContent}
        contentContainerStyle={{
          paddingHorizontal: Platform.OS === "web" ? windowWidth * 0.05 : 16,
          paddingBottom: 40,
          paddingTop: 20,
        }}
        initialNumToRender={4}
        maxToRenderPerBatch={2}
        windowSize={5}
        removeClippedSubviews={true}
      />

      {/* Modal de detalles del proyecto */}
      {selectedProject && (
        <ProjectDetailsModal visible={isModalVisible} project={selectedProject} onDismiss={closeProjectModal} />
      )}
    </SafeAreaView>
  )
} 
