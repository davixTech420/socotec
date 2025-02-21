import React, { useState } from 'react';
import { ScrollView, Platform, Dimensions, Modal, View } from 'react-native';
import { Card, Text, Button, useTheme, Surface, Avatar, Chip, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown, withSpring, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const windowWidth = Dimensions.get('window').width;

const projects = [
  {
    id: 1,
    title: 'Casa Moderna Sustentable',
    description: 'Diseño residencial moderno con enfoque en sustentabilidad y eficiencia energética',
    mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&auto=format&fit=crop&q=60'
    ],
    tags: ['Residencial', 'Sustentable', 'Moderno'],
    details: {
      area: '450m²',
      location: 'Valle Real, Guadalajara',
      year: '2023',
      features: [
        'Paneles solares integrados',
        'Sistema de recolección de agua pluvial',
        'Materiales eco-amigables',
        'Diseño bioclimático'
      ]
    }
  },
  {
    id: 2,
    title: 'Centro Comercial Eco-friendly',
    description: 'Centro comercial con diseño sostenible y espacios verdes integrados',
    mainImage: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1577493340887-b7bfff550145?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1613390792897-aa0c06a52332?w=800&auto=format&fit=crop&q=60'
    ],
    tags: ['Comercial', 'Sostenible', 'Innovador'],
    details: {
      area: '15,000m²',
      location: 'Santa Fe, CDMX',
      year: '2024',
      features: [
        'Jardines verticales',
        'Iluminación natural optimizada',
        'Espacios públicos verdes',
        'Certificación LEED Gold'
      ]
    }
  },
  {
    id: 3,
    title: 'Torre Corporativa Vanguardista',
    description: 'Edificio de oficinas con diseño futurista y tecnología de punta',
    mainImage: 'https://images.unsplash.com/photo-1577493340036-b8720500a9da?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1577493340036-b8720500a9da?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1545249390-6bdfa286827f?w=800&auto=format&fit=crop&q=60'
    ],
    tags: ['Corporativo', 'Vanguardista', 'Smart Building'],
    details: {
      area: '25,000m²',
      location: 'Reforma, CDMX',
      year: '2024',
      features: [
        'Sistema de gestión inteligente',
        'Fachada de doble piel',
        'Espacios colaborativos',
        'Helipuerto'
      ]
    }
  }
];

interface ProjectDetailsModalProps {
  visible: boolean;
  project: any;
  onDismiss: () => void;
}

const ProjectDetailsModal = ({ visible, project, onDismiss }: ProjectDetailsModalProps) => {
  const theme = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

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
                source={{ uri: project.images[currentImageIndex] }}
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
                  onPress={previousImage}
                  iconColor="white"
                />
                <Text style={{ color: 'white' }}>
                  {currentImageIndex + 1} / {project.images.length}
                </Text>
                <IconButton
                  icon="chevron-right"
                  size={30}
                  onPress={nextImage}
                  iconColor="white"
                />
              </View>
            </View>

            <View style={{ padding: 16 }}>
              <Text variant="headlineMedium">{project.title}</Text>
              <Text variant="bodyLarge" style={{ marginTop: 8 }}>
                {project.description}
              </Text>

              <Surface 
                style={{ 
                  flexDirection: 'row', 
                  flexWrap: 'wrap', 
                  gap: 8,
                  marginTop: 16 
                }}
              >
                {project.tags.map((tag: string, index: number) => (
                  <Chip 
                    key={index}
                    style={{ backgroundColor: theme.colors.elevation.level1 }}
                  >
                    {tag}
                  </Chip>
                ))}
              </Surface>

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
                    <Text variant="bodyMedium">{project.details.area}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="bodyMedium">Ubicación:</Text>
                    <Text variant="bodyMedium">{project.details.location}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="bodyMedium">Año:</Text>
                    <Text variant="bodyMedium">{project.details.year}</Text>
                  </View>
                </View>

                <Text variant="titleMedium" style={{ marginTop: 24, marginBottom: 12 }}>
                  Características
                </Text>
                {project.details.features.map((feature: string, index: number) => (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <MaterialCommunityIcons name="check-circle" size={18} color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={{ marginLeft: 8 }}>{feature}</Text>
                  </View>
                ))}
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
              onPress={() => {}}
              icon="email"
            >
              Contactar
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => {}}
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

      {projects.map((project, index) => (
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
              <Card.Cover source={{ uri: project.mainImage }} />
              <Card.Title 
                title={project.title}
                titleVariant="titleLarge"
              />
              <Card.Content>
                <Text variant="bodyLarge">{project.description}</Text>
                <Surface 
                  style={{ 
                    flexDirection: 'row', 
                    flexWrap: 'wrap', 
                    gap: 8,
                    marginTop: 16 
                  }}
                >
                  {project.tags.map((tag, tagIndex) => (
                    <Chip 
                      key={tagIndex}
                      style={{ backgroundColor: theme.colors.elevation.level1 }}
                    >
                      {tag}
                    </Chip>
                  ))}
                </Surface>
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
      ))}

      {selectedProject && (
        <ProjectDetailsModal
          visible={!!selectedProject}
          project={selectedProject}
          onDismiss={() => setSelectedProject(null)}
        />
      )}
    </ScrollView>
  );
}