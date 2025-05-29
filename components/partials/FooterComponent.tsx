import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const socialLinks = [
  { icon: 'x', url: 'https://twitter.com/socotecspain' },
  { icon: 'instagram', url: 'https://www.instagram.com/socotecspain/' },
  { icon: 'linkedin', url: 'https://www.linkedin.com/company/socotec-espana' },
  { icon: 'youtube', url: 'https://www.youtube.com/channel/UC4a-XvZDOaPJCglRJrcT76Q' },

];

const footerLinks = [
  { title: 'About', url: '/about' },
  { title: 'Services', url: '/services' },
  { title: 'Contact', url: '/contact' },
  { title: 'Privacy Policy', url: '/privacy' },
];

export default function MinimalistFooter() {
  const { width } = useWindowDimensions();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const isMobile = width < 768;

  const handlePress = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, isMobile && styles.contentMobile]}>
        <View style={styles.section}>
          <TouchableOpacity onPress={() => toggleSection('company')} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Compañia</Text>
            <Feather
              name={expandedSection === 'company' ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#333"
            />
          </TouchableOpacity>
          {(!isMobile || expandedSection === 'company') && (
            <View style={styles.linkContainer}>
              {footerLinks.map((link, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePress(link.url)}
                  style={styles.link}
                >
                  <Text style={styles.linkText}>{link.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity onPress={() => toggleSection('social')} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Redes Sociales</Text>
            <Feather
              name={expandedSection === 'social' ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#333"
            />
          </TouchableOpacity>
          {(!isMobile || expandedSection === 'social') && (
            <View style={styles.socialContainer}>
              {socialLinks.map((social, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePress(social.url)}
                  style={styles.socialLink}
                >
                  <Feather name={social.icon as any} size={24} color="#333" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      <View style={styles.bottomBar}>
        <Text style={styles.copyright}>© {new Date().getFullYear()} Socotec. Derechos reservados.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00ACE8',
    paddingTop: 20,
    paddingBottom: 10,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contentMobile: {
    flexDirection: 'column',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  linkContainer: {
    marginTop: 10,
  },
  link: {
    marginBottom: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#666',
  },
  socialContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  socialLink: {
    marginRight: 15,
  },
  bottomBar: {
    borderTopWidth: 1,
    color:"black",
    
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 12,
    color: 'black',
  },
});

