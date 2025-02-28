import React, { useState, useCallback } from 'react';
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

       {/*  {portfolio && Object.values(portfolio).map((project, index) => (
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
        ))} */}



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

