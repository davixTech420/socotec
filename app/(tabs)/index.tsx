import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import { router } from "expo-router";
import FooterComponent from '@/components/partials/FooterComponent';

export default function PayrollLanding() {
  const { width } = useWindowDimensions();
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  
  const isWeb = Platform.OS === 'web';
  const isMobile = width < 768;

  const features = [
    {
      title: 'La nómina se realiza con una única vista',
      content: 'Gestione toda su nómina de manera eficiente y sencilla desde una sola pantalla.'
    },
    {
      title: 'Sincronizar horas con nómina',
      content: 'Integre automáticamente las horas trabajadas con el cálculo de la nómina.'
    },
    {
      title: 'Registro de impuestos estatales en los 50 estados',
      content: 'Mantenga el cumplimiento fiscal en todos los estados con actualizaciones automáticas.'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title} >Nómina, RRHH, beneficios.</Text>
        <Text style={styles.subtitle}>Simplificado.</Text>
        <Text style={styles.description}>
          Únase a más de 200.000 pequeñas y medianas empresas que confían en Gusto
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Cómo funciona Gusto</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => router.navigate('/(employee)/indexEmplo')} style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Crear una cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Section */}
      <View style={[styles.mainContent, isMobile ? styles.mainContentMobile : null]}>
        {/* Left Icons */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>⚙️</Text>
          </View>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>⏰</Text>
          </View>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🦷</Text>
          </View>
        </View>

        {/* Central Image */}
        <Image
          source={require('../../assets/images/descarga.png')}
          style={[styles.centralImage, isMobile ? styles.centralImageMobile : null]}
          resizeMode="contain"
        />

        {/* Right Icons */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>❤️</Text>
          </View>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>➕</Text>
          </View>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🛡️</Text>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresSectionTitle}>
          Ejecute la nómina en minutos con tecnología inteligente.
        </Text>
        
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.featureItem}
            onPress={() => setExpandedSection(expandedSection === index ? null : index)}
          >
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Collapsible collapsed={expandedSection !== index}>
              <Text style={styles.featureContent}>{feature.content}</Text>
            </Collapsible>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Consultar más sobre Gusto global →</Text>
        </TouchableOpacity>
      </View>
        <FooterComponent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f7f8',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    maxWidth: 500,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#008080',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#008080',
  },
  secondaryButtonText: {
    color: '#008080',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  mainContentMobile: {
    flexDirection: 'column',
    gap: 20,
  },
  iconContainer: {
    gap: 16,
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    fontSize: 24,
  },
  centralImage: {
    width: '60%',
    height: 400,
    maxWidth: 800,
  },
  centralImageMobile: {
    width: '100%',
    height: 300,
  },
  featuresSection: {
    padding: 20,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  featuresSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  featureItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  featureContent: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  linkButton: {
    marginTop: 16,
  },
  linkText: {
    color: '#008080',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

