import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FooterComponent from '@/components/partials/FooterComponent';

const UIKitLanding = () => {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = width < 768;

  const templates = [
    { id: 1, title: 'Multiplatform', image: '/placeholder.svg?height=300&width=400' },
    { id: 2, title: 'Mobile App', image: '/placeholder.svg?height=300&width=400' },
    { id: 3, title: 'Desktop App', image: '/placeholder.svg?height=300&width=400' },
    { id: 4, title: 'Agency', image: '/placeholder.svg?height=300&width=400' },
    { id: 5, title: 'Lead Capture', image: '/placeholder.svg?height=300&width=400' },
    { id: 6, title: 'Press', image: '/placeholder.svg?height=300&width=400' },
    { id: 7, title: 'Directory', image: '/placeholder.svg?height=300&width=400' },
    { id: 8, title: 'Dental', image: '/placeholder.svg?height=300&width=400' },
    { id: 9, title: 'Real Estate', image: '/placeholder.svg?height=300&width=400' },
  ];

  const stats = [
    { number: '70+', title: 'Custom/Extended Components' },
    { number: '35+', title: 'Pre-Built Page Examples' },
    { number: '100+', title: 'Custom/Extended Utilities' },
  ];

  const renderButton = (title: string, primary = false) => (
    <Pressable
      style={[
        styles.button,
        primary ? styles.primaryButton : styles.secondaryButton,
        Platform.select({
          web: styles.webButton,
          default: null,
        }),
      ]}
    >
      <Text style={[
        styles.buttonText,
        primary ? styles.primaryButtonText : styles.secondaryButtonText
      ]}>
        {title}
      </Text>
    </Pressable>
  );

  return (
    <>
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <View style={[styles.hero, isMobile && styles.heroMobile]}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Build your next project faster with SB UI Kit Pro
            </Text>
            <Text style={styles.heroSubtitle}>
              Welcome to SB UI Kit Pro, a toolkit for building beautiful web interfaces,
              created by the development team at Start Bootstrap.
            </Text>
            <View style={styles.buttonContainer}>
              {renderButton('Registrate', true)}
              {renderButton('Documentation')}
            </View>
          </View>
          <View style={[styles.heroImage, isMobile && styles.heroImageMobile]}>
            <Image
              source={require("@/assets/images/descarga.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Templates Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Landing Pages</Text>
          <Text style={styles.sectionSubtitle}>
            After purchasing SB UI Kit Pro, you will gain access to these professionally coded, pre-built landing page templates!
          </Text>
          <View style={styles.templatesGrid}>
            {templates.map((template) => (
              <View key={template.id} style={[
                styles.templateCard,
                isMobile && styles.templateCardMobile
              ]}>
                <Image
                  source={{ uri: template.image }}
                  style={styles.templateImage}
                  resizeMode="cover"
                />
                <Text style={styles.templateTitle}>{template.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>
        <FooterComponent />
      </ScrollView>
    </SafeAreaView>
     
     </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  hero: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: '#f8f9fa',
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
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1f71',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginRight: 12,
  },
  webButton: {
    cursor: 'pointer',
  },
  primaryButton: {
    backgroundColor: '#0061f2',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  secondaryButtonText: {
    color: '#212529',
  },
  heroImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImageMobile: {
    marginTop: 20,
  },
  illustration: {
    width: '100%',
    height: 400,
  },
  section: {
    padding: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#1a1f71',
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#6c757d',
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  templateCard: {
    width: Platform.OS === 'web' ? '30%' : '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateCardMobile: {
    width: '100%',
  },
  templateImage: {
    width: '100%',
    height: 200,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-around',
    padding: 40,
    backgroundColor: '#f8f9fa',
    gap: 20,
  },
  statCard: {
    alignItems: 'center',
    flex: Platform.OS === 'web' ? 1 : undefined,
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
});

export default UIKitLanding;

