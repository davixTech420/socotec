/* import React, { useState, useCallback } from 'react';
import { ScrollView, Platform, Dimensions, Modal, View } from 'react-native';
import { Card, Text, Button, useTheme, Surface, Avatar, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown, withSpring, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { getPortfolioActive, SrcImagen } from '@/services/publicServices';
const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const windowWidth = Dimensions.get('window').width;

interface ProjectDetailsModalProps {
  visible: boolean;
  project: any;
  onDismiss: () => void;
}
const ProjectDetailsModal = ({ visible, project, onDismiss }: ProjectDetailsModalProps) => {
  const theme = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  return (
    <Modal visible={visible} onDismiss={onDismiss} transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}>
        <ScrollView>
          <Surface
            style={{
              margin: Platform.OS === 'web' ? '5%' : 16,
              borderRadius: 16,
              backgroundColor: theme.colors.elevation.level2,
              overflow: 'hidden'
            }}
          >
            <IconButton
              icon="close"
              size={24}
              onPress={onDismiss}
              style={{
                position: 'absolute',
                right: 8,
                top: 8,
                zIndex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)'
              }}
              iconColor="white"
            />
            <View style={{ position: 'relative' }}>
              <Card.Cover
                source={{ uri: SrcImagen(project.imagenes[currentImageIndex].uri) }}
                style={{ height: 400 }}
              />
              <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 16,
                backgroundColor: 'rgba(0,0,0,0.5)'
              }}>
                <IconButton
                  icon="chevron-left"
                  size={30}
                  onPress={() => setCurrentImageIndex((prev) => (prev - 1 + project.imagenes.length) % project.imagenes.length)}
                  iconColor="white"
                />
                <Text style={{ color: 'white' }}>
                  {currentImageIndex + 1} / {project.imagenes.length}
                </Text>
                <IconButton
                  icon="chevron-right"
                  size={30}
                  onPress={() => setCurrentImageIndex((prev) => (prev + 1) % project.imagenes.length)}
                  iconColor="white"
                />
              </View>
            </View>
            <View style={{ padding: 16 }}>
              <Text variant="headlineMedium">{project.nombre}</Text>
              <Text variant="bodyLarge" style={{ marginTop: 8 }}>
                {project.descripcion}
              </Text>
              <Surface style={{
                marginTop: 24,
                padding: 16,
                borderRadius: 12,
                backgroundColor: theme.colors.elevation.level1
              }}>
                <Text variant="titleMedium" style={{ marginBottom: 16 }}>Detalles del Proyecto</Text>

                <View style={{ gap: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="bodyMedium">Área:</Text>
                    <Text variant="bodyMedium">{project.superficie}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="bodyMedium">Ubicación:</Text>
                    <Text variant="bodyMedium">{project.ubicacion}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="bodyMedium">Año:</Text>
                    <Text variant="bodyMedium">{project.createdAt}</Text>
                  </View>
                </View>
                <Text variant="titleMedium" style={{ marginTop: 24, marginBottom: 12 }}>
                  Características
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <MaterialCommunityIcons name="check-circle" size={18} color={theme.colors.primary} />
                  <Text variant="bodyMedium" style={{ marginLeft: 8 }}>{project.detalle}</Text>
                </View>

              </Surface>
            </View>
          </Surface>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default function Portafolio() {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [portfolio, setPortfolio] = useState([]);

  useFocusEffect(useCallback(() => {
    getPortfolioActive().then(setPortfolio).catch(console.error)
  }, []));
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  const handlePressIn = () => {
    scale.value = 0.95;
  };

  const handlePressOut = () => {
    scale.value = 1;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingHorizontal: Platform.OS === 'web' ? windowWidth * 0.1 : 16
        }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Surface
            style={{
              marginTop: 60,
              padding: 20,
              borderRadius: 16,
              backgroundColor: theme.colors.elevation.level2,
            }}
            elevation={2}
          >
            <Avatar.Image
              size={100}
              source={{ uri: 'https://images.unsplash.com/photo-1508341591423-4347099e1f19?w=400&auto=format&fit=crop&q=60' }}
              style={{ alignSelf: 'center' }}
            />
            <Text variant="headlineMedium" style={{ textAlign: 'center', marginTop: 16 }}>
              Arq. Carlos Rodríguez
            </Text>
            <Text variant="titleMedium" style={{ textAlign: 'center', marginTop: 8, color: theme.colors.secondary }}>
              Arquitecto Senior & Diseñador Sustentable
            </Text>
            <Text style={{ textAlign: 'center', marginTop: 16, marginBottom: 16 }}>
              Especializado en arquitectura sustentable y diseño bioclimático con más de 15 años
              de experiencia en proyectos residenciales y comerciales.
            </Text>

            <Surface style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
              <Button
                mode="contained"
                onPress={() => { }}
                icon="email"
              >
                Contactar
              </Button>
              <Button
                mode="outlined"
                onPress={() => { }}
                icon="linkedin"
              >
                LinkedIn
              </Button>
            </Surface>
          </Surface>
        </Animated.View>

        <Text variant="headlineSmall" style={{ marginTop: 32, marginBottom: 16 }}>
          Proyectos Destacados
        </Text>

      



{portfolio && Object.values(portfolio).length > 0 ? (
  Object.values(portfolio).map((project, index) => (
    <Animated.View
      key={project.id}
      entering={FadeInUp.delay(400 + index * 200).springify()}
    >
      <AnimatedSurface
        style={[
          {
            marginBottom: 16,
            borderRadius: 16,
            overflow: 'hidden',
          },
          cardStyle
        ]}
        elevation={2}
      >
        <Card
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => setSelectedProject(project)}
        >
          <Card.Cover source={{ uri: SrcImagen(project.imagenes[0].uri) }} />
          <Card.Title
            title={project.nombre}
            titleVariant="titleLarge"
          />
          <Card.Content>
            <Text variant="bodyLarge">{project.descripcion}</Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              icon="eye"
              onPress={() => setSelectedProject(project)}
            >
              Ver Proyecto
            </Button>
          </Card.Actions>
        </Card>
      </AnimatedSurface>
    </Animated.View>
  ))
) : (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
      No hay datos disponibles.
    </Text>
  </View>
)}

        {selectedProject && (
          <ProjectDetailsModal
            visible={!!selectedProject}
            project={selectedProject}
            onDismiss={() => setSelectedProject(null)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

 */
import React, { useState, useCallback, useMemo } from 'react';
import { ScrollView, Platform, Dimensions, Modal, View, FlatList, InteractionManager } from 'react-native';
import { Card, Text, Button, useTheme, Surface, IconButton, Chip, Divider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp, FadeInDown, withSpring, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { getPortfolioActive, SrcImagen } from '@/services/publicServices';

const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const windowWidth = Dimensions.get('window').width;

// Project categories for filtering
const CATEGORIES = ['Todos', 'Residencial', 'Comercial', 'Sustentable', 'Urbano'];

// Safer image loading component
const SafeImage = ({ uri, style }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  return (
    <View style={[style, { backgroundColor: theme.colors.surfaceVariant }]}>
      {loading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      )}
      
      {error ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
          <MaterialCommunityIcons name="image-off" size={40} color={theme.colors.outline} />
          <Text style={{ marginTop: 8, color: theme.colors.outline }}>No disponible</Text>
        </View>
      ) : (
        <Card.Cover
          source={{ uri }}
          style={[style, { backgroundColor: 'transparent' }]}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}
    </View>
  );
};

interface ProjectDetailsModalProps {
  visible: boolean;
  project: any;
  onDismiss: () => void;
}

const ProjectDetailsModal = ({ visible, project, onDismiss }: ProjectDetailsModalProps) => {
  const theme = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  // Safety check
  if (!project || !project.imagenes || !Array.isArray(project.imagenes) || project.imagenes.length === 0) {
    return null;
  }
  
  // Ensure we have a valid image index
  const safeImageIndex = Math.min(currentImageIndex, project.imagenes.length - 1);
  
  // Use InteractionManager to delay heavy rendering until after animations complete
  React.useEffect(() => {
    if (visible) {
      const interactionPromise = InteractionManager.runAfterInteractions(() => {
        setIsReady(true);
      });
      
      return () => {
        interactionPromise.cancel();
        setIsReady(false);
      };
    }
  }, [visible]);
  
  // Get a safe image URI
  const getImageUri = (index) => {
    try {
      if (project.imagenes && project.imagenes[index] && project.imagenes[index].uri) {
        return SrcImagen(project.imagenes[index].uri);
      }
      return null;
    } catch (error) {
      console.error('Error getting image URI:', error);
      return null;
    }
  };
  
  const handlePrevImage = () => {
    if (project.imagenes.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + project.imagenes.length) % project.imagenes.length);
  };
  
  const handleNextImage = () => {
    if (project.imagenes.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % project.imagenes.length);
  };
  
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      transparent
      animationType="fade"
      onRequestClose={onDismiss} // Handle back button on Android
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <Surface
              style={{
                margin: Platform.OS === 'web' ? '5%' : 16,
                borderRadius: 16,
                backgroundColor: theme.colors.elevation.level2,
                overflow: 'hidden'
              }}
            >
              <IconButton
                icon="close"
                size={24}
                onPress={onDismiss}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  zIndex: 10,
                  backgroundColor: 'rgba(0,0,0,0.5)'
                }}
                iconColor="white"
              />
              
              {isReady ? (
                <>
                  <View style={{ position: 'relative' }}>
                    <SafeImage
                      uri={getImageUri(safeImageIndex)}
                      style={{ height: 300 }}
                    />
                    
                    {project.imagenes.length > 1 && (
                      <View style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 16,
                        backgroundColor: 'rgba(0,0,0,0.5)'
                      }}>
                        <IconButton
                          icon="chevron-left"
                          size={30}
                          onPress={handlePrevImage}
                          iconColor="white"
                        />
                        <Text style={{ color: 'white' }}>
                          {safeImageIndex + 1} / {project.imagenes.length}
                        </Text>
                        <IconButton
                          icon="chevron-right"
                          size={30}
                          onPress={handleNextImage}
                          iconColor="white"
                        />
                      </View>
                    )}
                  </View>
                  
                  <View style={{ padding: 16 }}>
                    <Text variant="headlineMedium">{project.nombre || 'Proyecto'}</Text>
                    
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                      {project.categoria && <Chip icon="tag" mode="outlined">{project.categoria}</Chip>}
                      {project.ubicacion && <Chip icon="map-marker" mode="outlined">{project.ubicacion}</Chip>}
                      {project.createdAt && <Chip icon="calendar" mode="outlined">{project.createdAt}</Chip>}
                    </View>
                    
                    {project.descripcion && (
                      <Text variant="bodyLarge" style={{ marginTop: 16 }}>
                        {project.descripcion}
                      </Text>
                    )}
                    
                    <Surface style={{
                      marginTop: 24,
                      padding: 16,
                      borderRadius: 12,
                      backgroundColor: theme.colors.elevation.level1
                    }}>
                      <Text variant="titleMedium" style={{ marginBottom: 16 }}>Detalles del Proyecto</Text>

                      <View style={{ gap: 12 }}>
                        {project.superficie && (
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text variant="bodyMedium">Área:</Text>
                            <Text variant="bodyMedium">{project.superficie}</Text>
                          </View>
                        )}
                        
                        {project.ubicacion && (
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text variant="bodyMedium">Ubicación:</Text>
                            <Text variant="bodyMedium">{project.ubicacion}</Text>
                          </View>
                        )}
                        
                        {project.createdAt && (
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text variant="bodyMedium">Año:</Text>
                            <Text variant="bodyMedium">{project.createdAt}</Text>
                          </View>
                        )}
                      </View>
                      
                      {project.detalle && (
                        <>
                          <Divider style={{ marginVertical: 16 }} />
                          
                          <Text variant="titleMedium" style={{ marginBottom: 12 }}>
                            Características
                          </Text>

                          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                              <MaterialCommunityIcons name="check-circle" size={18} color={theme.colors.primary} />
                              <Text variant="bodyMedium" style={{ marginLeft: 8 }}>{project.detalle}</Text>
                            </View>
                          </View>
                        </>
                      )}
                    </Surface>
                  </View>
                </>
              ) : (
                <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Text style={{ marginTop: 16 }}>Cargando detalles...</Text>
                </View>
              )}
            </Surface>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

// Project card component for better code organization and performance
const ProjectCard = React.memo(({ project, onPress }) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, { damping: 20, stiffness: 200 }) }],
  }));

  const handlePressIn = () => {
    scale.value = 0.97;
  };

  const handlePressOut = () => {
    scale.value = 1;
  };
  
  // Safety check
  if (!project || !project.imagenes || !Array.isArray(project.imagenes) || project.imagenes.length === 0) {
    return null;
  }
  
  // Get a safe image URI
  const getImageUri = () => {
    try {
      if (project.imagenes[0] && project.imagenes[0].uri) {
        return SrcImagen(project.imagenes[0].uri);
      }
      return null;
    } catch (error) {
      console.error('Error getting image URI:', error);
      return null;
    }
  };
  
  const handleProjectPress = () => {
    // Use InteractionManager to ensure animations complete before heavy work
    InteractionManager.runAfterInteractions(() => {
      onPress(project);
    });
  };
  
  return (
    <AnimatedSurface
      style={[
        {
          marginBottom: 16,
          borderRadius: 16,
          overflow: 'hidden',
        },
        cardStyle
      ]}
      elevation={2}
    >
      <Card
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleProjectPress}
      >
        <SafeImage 
          uri={getImageUri()} 
          style={{ height: 180 }}
        />
        
        <Card.Title
          title={project.nombre || 'Proyecto'}
          titleVariant="titleLarge"
          subtitle={project.ubicacion}
        />
        
        <Card.Content>
          {project.descripcion && (
            <Text variant="bodyMedium" numberOfLines={2}>{project.descripcion}</Text>
          )}
          
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            {project.categoria && <Chip compact style={{ marginRight: 8 }}>{project.categoria}</Chip>}
            {project.createdAt && <Chip compact>{project.createdAt}</Chip>}
          </View>
        </Card.Content>
        
        <Card.Actions>
          <Button
            mode="contained"
            icon="eye"
            onPress={handleProjectPress}
          >
            Ver Detalles
          </Button>
        </Card.Actions>
      </Card>
    </AnimatedSurface>
  );
});

export default function CompanyPortfolio() {
  const theme = useTheme();
  const [selectedProject, setSelectedProject] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Safer data fetching
  const fetchPortfolio = useCallback(() => {
    setLoading(true);
    setError(null);
    
    try {
      getPortfolioActive()
        .then(data => {
          if (data && typeof data === 'object') {
            setPortfolio(data);
          } else {
            setPortfolio([]);
            setError('Formato de datos no válido');
          }
        })
        .catch(err => {
          console.error('Error fetching portfolio:', err);
          setError('Error al cargar los proyectos');
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      console.error('Exception in fetchPortfolio:', err);
      setError('Error inesperado');
      setLoading(false);
    }
  }, []);

  useFocusEffect(fetchPortfolio);

  // Handle modal opening safely
  const handleOpenProject = useCallback((project) => {
    // Validate project data before opening modal
    if (project && project.id && project.imagenes && Array.isArray(project.imagenes) && project.imagenes.length > 0) {
      setSelectedProject(project);
    } else {
      console.warn('Attempted to open invalid project:', project);
      // Could show an error toast here
    }
  }, []);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (!portfolio || Object.values(portfolio).length === 0) return [];
    
    try {
      const projects = Object.values(portfolio);
      if (selectedCategory === 'Todos') return projects;
      
      return projects.filter(project => 
        project && project.categoria && project.categoria.includes(selectedCategory)
      );
    } catch (err) {
      console.error('Error filtering projects:', err);
      return [];
    }
  }, [portfolio, selectedCategory]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingHorizontal: Platform.OS === 'web' ? windowWidth * 0.1 : 16
        }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Company Header */}
        <Animated.View entering={FadeInDown.delay(200).springify().damping(20)}>
          <Surface
            style={{
              marginTop: 40,
              padding: 24,
              borderRadius: 16,
              backgroundColor: theme.colors.elevation.level2,
            }}
            elevation={2}
          >
            <View style={{ flexDirection: Platform.OS === 'web' ? 'row' : 'column', alignItems: 'center', gap: 20 }}>
              <View style={{ 
                width: 120, 
                height: 120, 
                borderRadius: 16, 
                backgroundColor: theme.colors.primary,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <MaterialCommunityIcons name="office-building" size={60} color="white" />
              </View>
              
              <View style={{ flex: 1 }}>
                <Text variant="headlineLarge" style={{ fontWeight: 'bold' }}>
                  ArquiTech Studio
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.secondary, marginTop: 4 }}>
                  Diseño Arquitectónico Innovador
                </Text>
                <Text style={{ marginTop: 12 }}>
                  Somos un estudio de arquitectura especializado en diseños sustentables, 
                  innovadores y funcionales para proyectos residenciales y comerciales.
                </Text>
              </View>
            </View>
            
            <Divider style={{ marginVertical: 20 }} />
            
            <View style={{ 
              flexDirection: Platform.OS === 'web' ? 'row' : 'column', 
              justifyContent: 'space-between',
              gap: 16
            }}>
              <View>
                <Text variant="titleMedium">Contacto</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <MaterialCommunityIcons name="email-outline" size={18} color={theme.colors.primary} />
                  <Text style={{ marginLeft: 8 }}>info@arquitech.com</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <MaterialCommunityIcons name="phone-outline" size={18} color={theme.colors.primary} />
                  <Text style={{ marginLeft: 8 }}>+52 555 123 4567</Text>
                </View>
              </View>
              
              <View>
                <Text variant="titleMedium">Ubicación</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <MaterialCommunityIcons name="map-marker-outline" size={18} color={theme.colors.primary} />
                  <Text style={{ marginLeft: 8 }}>Ciudad de México, México</Text>
                </View>
              </View>
              
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button
                  mode="contained"
                  onPress={() => {}}
                  icon="email"
                >
                  Contactar
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => {}}
                  icon="information-outline"
                >
                  Más Info
                </Button>
              </View>
            </View>
          </Surface>
        </Animated.View>

        {/* Projects Section */}
        <View style={{ marginTop: 32 }}>
          <Text variant="headlineMedium" style={{ marginBottom: 16, fontWeight: 'bold' }}>
            Nuestros Proyectos
          </Text>
          
          {/* Category Filter */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {CATEGORIES.map(category => (
                <Chip
                  key={category}
                  selected={selectedCategory === category}
                  onPress={() => setSelectedCategory(category)}
                  style={{ marginRight: 8 }}
                  mode={selectedCategory === category ? "flat" : "outlined"}
                >
                  {category}
                </Chip>
              ))}
            </View>
          </ScrollView>
          
          {/* Projects Grid */}
          {loading ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={{ marginTop: 16 }}>Cargando proyectos...</Text>
            </View>
          ) : error ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <MaterialCommunityIcons name="alert-circle-outline" size={48} color={theme.colors.error} />
              <Text variant="bodyLarge" style={{ textAlign: 'center', marginTop: 16, color: theme.colors.error }}>
                {error}
              </Text>
              <Button 
                mode="contained" 
                onPress={fetchPortfolio} 
                style={{ marginTop: 16 }}
                icon="refresh"
              >
                Reintentar
              </Button>
            </View>
          ) : filteredProjects.length > 0 ? (
            <View style={{ 
              flexDirection: Platform.OS === 'web' ? 'row' : 'column',
              flexWrap: 'wrap',
              gap: 16,
              justifyContent: 'space-between'
            }}>
              {filteredProjects.map((project, index) => (
                <Animated.View
                  key={project.id || index}
                  entering={FadeIn.delay(200 + index * 50).duration(300)}
                  style={{ 
                    width: Platform.OS === 'web' ? 
                      windowWidth > 1200 ? '31%' : 
                      windowWidth > 768 ? '48%' : '100%' 
                    : '100%' 
                  }}
                >
                  <ProjectCard 
                    project={project} 
                    onPress={handleOpenProject} 
                  />
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <MaterialCommunityIcons name="folder-open-outline" size={48} color={theme.colors.outline} />
              <Text variant="bodyLarge" style={{ textAlign: 'center', marginTop: 16 }}>
                No hay proyectos disponibles en esta categoría.
              </Text>
            </View>
          )}
        </View>

        {/* Project Details Modal */}
        <ProjectDetailsModal
          visible={!!selectedProject}
          project={selectedProject}
          onDismiss={() => setSelectedProject(null)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}