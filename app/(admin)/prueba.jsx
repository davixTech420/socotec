import React, { useEffect } from 'react';
import { ScrollView, View, StyleSheet, Platform, useWindowDimensions, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  FadeInLeft, 
  FadeInRight,
  FadeIn,
  SlideInUp
} from 'react-native-reanimated';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  Text, 
  Chip, 
  ProgressBar, 
  List,
  Avatar,
  Surface
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FooterComponent from '@/components/partials/FooterComponent';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedSurface = Animated.createAnimatedComponent(Surface);

const FeatureCard = ({ title, icon, description, color, index }) => (
  <Animated.View entering={SlideInUp.delay(index * 100)}>
    <Surface style={[styles.card, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={48} color="#ffffff" style={styles.icon} />
      <Title style={styles.cardTitle}>{title}</Title>
      <Paragraph style={styles.cardDescription}>{description}</Paragraph>
    </Surface>
  </Animated.View>
);

const AnimatedStatistic = ({ number, title, icon }) => {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(parseInt(number), { duration: 2000 });
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    text: `${Math.floor(animatedValue.value)}%`,
  }));

  return (
    <AnimatedSurface style={styles.statCard} elevation={4}>
      <Avatar.Icon size={60} icon={icon} style={styles.statIcon} color="#ffffff" />
      <AnimatedText style={styles.statNumber} animatedProps={animatedProps} />
      <Text style={styles.statTitle}>{title}</Text>
    </AnimatedSurface>
  );
};

const UIKitLanding = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const features = [
    { 
      title: 'IA en Cálculos', 
      icon: 'brain',
      description: 'Algoritmos de IA para cálculos precisos y predicciones de nómina.',
      color: '#4CAF50'
    },
    { 
      title: 'Análisis Predictivo', 
      icon: 'chart-areaspline',
      description: 'Reportes avanzados con insights predictivos para toma de decisiones.',
      color: '#2196F3'
    },
    { 
      title: 'Cumplimiento Automático', 
      icon: 'shield-check',
      description: 'Actualización en tiempo real de normativas con IA legal.',
      color: '#FFC107'
    },
    { 
      title: 'Gestión Holística', 
      icon: 'view-dashboard',
      description: 'Integración total de RRHH, nómina y productividad en una plataforma.',
      color: '#9C27B0'
    },
  ];

  const stats = [
    { number: '99.9', title: 'Precisión en Cálculos', icon: 'check-decagram' },
    { number: '75', title: 'Ahorro de Tiempo', icon: 'clock-fast' },
    { number: '100', title: 'Cumplimiento Legal', icon: 'shield-lock' },
  ];

  const benefits = [
    'Eliminación de errores en cálculos de nómina con IA',
    'Optimización de procesos con automatización avanzada',
    'Experiencia de empleado mejorada con interfaz intuitiva',
    'Cumplimiento proactivo con regulaciones en evolución',
    'Insights en tiempo real para estrategias de RRHH'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80' }} 
          style={styles.heroBackground}
        >
          <View style={[styles.hero, isMobile && styles.heroMobile]}>
            <Animated.View 
              entering={FadeInLeft.duration(1000)} 
              style={styles.heroContent}
            >
              <Title style={styles.heroTitle}>
                El Futuro de la Gestión de Nómina
              </Title>
              <Paragraph style={styles.heroSubtitle}>
                Revolucione su administración de personal con IA avanzada y automatización inteligente.
              </Paragraph>
              <View style={styles.chipContainer}>
                <Chip icon="rocket" style={styles.chip}>Innovador</Chip>
                <Chip icon="shield" style={styles.chip}>Seguro</Chip>
                <Chip icon="trending-up" style={styles.chip}>Eficiente</Chip>
              </View>
              <View style={styles.buttonContainer}>
                <Button 
                  mode="contained" 
                  onPress={() => router.navigate("/(admin)/Dashboard")}
                  style={styles.primaryButton}
                  icon="rocket-launch"
                >
                  Iniciar Revolución
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={() => router.navigate("/(employee)/DashboardE")}
                  style={styles.secondaryButton}
                  icon="eye"
                >
                  Explorar Demo
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
        <Surface style={styles.section} elevation={4}>
          <Title style={styles.sectionTitle}>Características Revolucionarias</Title>
          <Paragraph style={styles.sectionSubtitle}>
            Descubra cómo nuestra plataforma de última generación transforma la gestión de nómina
          </Paragraph>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </View>
        </Surface>

        {/* Stats Section */}
        <Surface style={styles.statsSection} elevation={4}>
          {stats.map((stat, index) => (
            <AnimatedStatistic key={index} {...stat} />
          ))}
        </Surface>

        {/* Benefits Section */}
        <Animated.View entering={FadeIn.duration(1000)} style={styles.benefitsSection}>
          <Title style={styles.benefitsTitle}>Ventajas Competitivas</Title>
          <Surface style={styles.benefitsCard} elevation={4}>
            <Card.Content>
              {benefits.map((benefit, index) => (
                <List.Item
                  key={index}
                  title={benefit}
                  left={props => <List.Icon {...props} icon="chevron-right" color="#6200EE" />}
                  titleStyle={styles.benefitText}
                />
              ))}
            </Card.Content>
          </Surface>
        </Animated.View>

        {/* Progress Section */}
        <Surface style={styles.progressSection} elevation={4}>
          <Title style={styles.progressTitle}>Impacto en su Organización</Title>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Eficiencia Operativa</Text>
            <ProgressBar progress={0.95} color="#4CAF50" style={styles.progressBar} />
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Precisión en Procesos</Text>
            <ProgressBar progress={0.99} color="#2196F3" style={styles.progressBar} />
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Satisfacción del Empleado</Text>
            <ProgressBar progress={0.90} color="#FFC107" style={styles.progressBar} />
          </View>
        </Surface>

        {/* CTA Section */}
        <Surface style={styles.ctaCard} elevation={8}>
          <Title style={styles.ctaTitle}>¿Listo para liderar la revolución en gestión de nómina?</Title>
          <Paragraph style={styles.ctaParagraph}>
            Únase a las organizaciones visionarias que están redefiniendo el futuro del trabajo y la gestión de personal.
          </Paragraph>
          <Button 
            mode="contained" 
            onPress={() => router.navigate("/(admin)/Dashboard")}
            icon="rocket-launch"
            style={styles.ctaButton}
            labelStyle={styles.ctaButtonLabel}
          >
            Iniciar Transformación
          </Button>
        </Surface>

        <FooterComponent />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
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
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ffffff',
  },
  heroSubtitle: {
    fontSize: 20,
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
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  secondaryButton: {
    borderColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 20,
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
    margin: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 36,
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
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#ffffff',
  },
  cardDescription: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
  },
  statsSection: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-around',
    padding: 40,
    margin: 20,
    borderRadius: 15,
  },
  statCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginBottom: Platform.OS === 'web' ? 0 : 20,
  },
  statIcon: {
    backgroundColor: '#6200EE',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1f71',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  benefitsSection: {
    padding: 40,
    margin: 20,
  },
  benefitsTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1a1f71',
  },
  benefitsCard: {
    borderRadius: 15,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
  },
  progressSection: {
    padding: 40,
    margin: 20,
    borderRadius: 15,
  },
  progressTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1a1f71',
  },
  progressItem: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  ctaCard: {
    margin: 20,
    borderRadius: 15,
    padding: 40,
    backgroundColor: '#6200EE',
  },
  ctaTitle: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ctaParagraph: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 18,
  },
  ctaButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'center',
  },
  ctaButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UIKitLanding;

