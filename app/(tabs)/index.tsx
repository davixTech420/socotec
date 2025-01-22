import React, { useEffect } from 'react';
import { ScrollView, View, StyleSheet, Platform, useWindowDimensions, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import Animated, { 
  useSharedValue, 
  withTiming, 
  FadeInLeft, 
  FadeInRight,
  FadeIn
} from 'react-native-reanimated';
import { Card, Title, Paragraph, Button, Text, Chip, ProgressBar, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FooterComponent from '@/components/partials/FooterComponent';

const AnimatedText = Animated.createAnimatedComponent(Text);

const FeatureCard = ({ title, icon, description, color }) => (
  <Card style={[styles.card, { backgroundColor: color }]}>
    <Card.Content style={styles.cardContent}>
      <MaterialCommunityIcons name={icon} size={48} color="#ffffff" style={styles.icon} />
      <Title style={styles.cardTitle}>{title}</Title>
      <Paragraph style={styles.cardDescription}>{description}</Paragraph>
    </Card.Content>
  </Card>
);

const AnimatedStatistic = ({ number, title, icon }) => {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(parseInt(number), { duration: 2000 });
  }, []);

  return (
    <View style={styles.statCard}>
      <MaterialCommunityIcons name={icon} size={36} color="#0061f2" style={styles.statIcon} />
      <AnimatedText style={styles.statNumber}>
        {animatedValue.value.toFixed(0)}%
      </AnimatedText>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
};

const UIKitLanding = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const features = [
    { 
      title: 'Automatización de Cálculos', 
      icon: 'calculator-variant',
      description: 'Cálculo automático de salarios, deducciones, horas extras y más.',
      color: '#4CAF50'
    },
    { 
      title: 'Generación de Reportes', 
      icon: 'file-chart',
      description: 'Reportes detallados de nómina, fiscales y análisis de tendencias.',
      color: '#2196F3'
    },
    { 
      title: 'Cumplimiento Legal', 
      icon: 'gavel',
      description: 'Actualización automática de leyes fiscales y laborales.',
      color: '#FFC107'
    },
    { 
      title: 'Gestión de Permisos', 
      icon: 'calendar-check',
      description: 'Solicitud y aprobación de vacaciones con políticas personalizadas.',
      color: '#9C27B0'
    },
  ];

  const stats = [
    { number: '99', title: 'Precisión en Cálculos', icon: 'check-circle' },
    { number: '50', title: 'Ahorro de Tiempo', icon: 'clock-fast' },
    { number: '100', title: 'Cumplimiento Legal', icon: 'shield-check' },
  ];

  const benefits = [
    'Reducción de errores en cálculos de nómina',
    'Ahorro de tiempo en procesos administrativos',
    'Mejora en la satisfacción de los empleados',
    'Cumplimiento actualizado con regulaciones fiscales',
    'Acceso a datos en tiempo real para toma de decisiones'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80' }} 
          style={styles.heroBackground}
        >
          <View style={[styles.hero, isMobile && styles.heroMobile]}>
            <Animated.View 
              entering={FadeInLeft.duration(1000)} 
              style={styles.heroContent}
            >
              <Title style={styles.heroTitle}>
                Socotec Colombia
              </Title>
              <Paragraph style={styles.heroSubtitle}>
                Automatice, simplifique y optimice todos sus procesos con nuestra plataforma integral de última generación.
              </Paragraph>
              <View style={styles.chipContainer}>
                <Chip icon="check" style={styles.chip}>Preciso</Chip>
                <Chip icon="flash" style={styles.chip}>Rápido</Chip>
                <Chip icon="shield" style={styles.chip}>Seguro</Chip>
              </View>
              <View style={styles.buttonContainer}>
                <Button 
                  mode="contained" 
                  onPress={() => router.navigate("/singIn")}
                  style={styles.primaryButton}
                  icon="rocket-launch"
                >
                  Comenzar Ahora
                </Button>
              </View>
            </Animated.View>
            <Animated.View 
              entering={FadeInRight.duration(1000)} 
              style={[styles.heroImage, isMobile && styles.heroImageMobile]}
            >
              <MaterialCommunityIcons name="account-cash" size={200} color="#ffffff" />
            </Animated.View>
          </View>
        </ImageBackground>

        {/* Features Section */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Características Principales</Title>
          <Paragraph style={styles.sectionSubtitle}>
            Descubra cómo nuestra plataforma puede transformar su trabajo
          </Paragraph>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          {stats.map((stat, index) => (
            <AnimatedStatistic key={index} {...stat} />
          ))}
        </View>

        {/* Benefits Section */}
        <Animated.View entering={FadeIn.duration(1000)} style={styles.benefitsSection}>
          <Title style={styles.benefitsTitle}>Beneficios de Nuestra Solución</Title>
          <Card style={styles.benefitsCard}>
            <Card.Content>
              {benefits.map((benefit, index) => (
                <List.Item
                  key={index}
                  title={benefit}
                  left={props => <List.Icon {...props} icon="star" color="#FFC107" />}
                />
              ))}
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Title style={styles.progressTitle}>Mejore sus Procesos de Nómina</Title>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Eficiencia en Cálculos</Text>
            <ProgressBar progress={0.9} color="#4CAF50" style={styles.progressBar} />
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Reducción de Errores</Text>
            <ProgressBar progress={0.95} color="#2196F3" style={styles.progressBar} />
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Satisfacción del Empleado</Text>
            <ProgressBar progress={0.85} color="#FFC107" style={styles.progressBar} />
          </View>
        </View>

        {/* CTA Section */}
        <Card style={styles.ctaCard}>
          <Card.Content>
            <Title style={styles.ctaTitle}>¿Listo para revolucionar su gestión de nómina?</Title>
            <Paragraph style={styles.ctaParagraph}>
              Únase a miles de empresas que ya han optimizado sus procesos de nómina con nuestra plataforma líder en el mercado.
            </Paragraph>
          </Card.Content>
          <Card.Actions style={styles.ctaActions}>
            <Button 
              mode="contained" 
              onPress={() => router.navigate("/(admin)/Dashboard")}
              icon="rocket-launch"
            >
              Iniciar Prueba Gratuita
            </Button>
          </Card.Actions>
        </Card>

        <FooterComponent />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  heroBackground: {
    width: '100%',
  },
  hero: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 60,
    backgroundColor: 'rgba(0, 97, 242, 0.8)',
  },
  heroMobile: {
    flexDirection: 'column',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: Platform.OS === 'web' ? 40 : 0,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ffffff',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 24,
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  chip: {
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FFC107',
  },
  secondaryButton: {
    borderColor: '#ffffff',
    borderWidth: 2,
  },
  heroImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImageMobile: {
    marginTop: 20,
  },
  section: {
    padding: 40,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1a1f71',
  },
  sectionSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    color: '#6c757d',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  card: {
    width: 300,
    margin: 10,
  },
  cardContent: {
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#ffffff',
  },
  cardDescription: {
    textAlign: 'center',
    color: '#ffffff',
  },
  statsSection: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-around',
    padding: 40,
    backgroundColor: '#f1f8ff',
    gap: 20,
  },
  statCard: {
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0061f2',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  benefitsSection: {
    padding: 40,
    backgroundColor: '#ffffff',
  },
  benefitsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1a1f71',
  },
  benefitsCard: {
    elevation: 4,
  },
  progressSection: {
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  progressTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1a1f71',
  },
  progressItem: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#6c757d',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  ctaCard: {
    margin: 20,
    backgroundColor: '#0061f2',
  },
  ctaTitle: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 24,
  },
  ctaParagraph: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
  },
  ctaActions: {
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default UIKitLanding;

