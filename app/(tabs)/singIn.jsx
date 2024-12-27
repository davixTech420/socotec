import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput,Image, Platform, useWindowDimensions,TouchableOpacity } from 'react-native';
import Animated, { FadeIn, SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import FooterComponent from '@/components/partials/FooterComponent';
export default function ModernLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 768;

  const Container = Platform.OS === 'web' ? View : Animated.View;

  return (
    <>  
    <View style={styles.container}>
      <Container style={[
        styles.card,
        isWideScreen ? styles.cardWide : styles.cardMobile
      ]}>
        {/* Left Side */}
        <Animated.View 
          entering={SlideInLeft.duration(1000)}
          style={[
            styles.leftSide,
            !isWideScreen && styles.leftSideMobile
          ]}
        >
          <View style={styles.leftContent}>
            <Text style={styles.welcomeText}>Bienvenidos soocotec colombia</Text>
            <Text style={styles.communityText}>
              Join our community that have more than{'\n'}10000 subscribers and learn new things
            </Text>
            <TouchableOpacity style={styles.signInButton}>
              <Text style={styles.signInButtonText}>Crear Cuenta</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Right Side */}
        <Animated.View 
          entering={SlideInRight.duration(1000)}
          style={[
            styles.rightSide,
            !isWideScreen && styles.rightSideMobile
          ]}
        >
          <View style={styles.rightContent}>
          <View style={styles.signupContainer}> 

          <Text style={styles.beOneText}>Comenzemos!</Text>
          <Image style={{  width:30,height:30  }}  source={require("@/assets/images/favicon.png")}/>

          </View>
            
            
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="elka@qq.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="PASSWORD"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Iniciar sesion</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.noAccountText}>No tienes una cuenta?</Text>
              <TouchableOpacity>
                <Text style={styles.signupText}>Crear Cuenta</Text>
              </TouchableOpacity>
            </View>
            <View  style={styles.signupContainer} >
            <TouchableOpacity>
                <Text style={styles.signupText}>Restablecer contraseña</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Container>

      <FooterComponent/>
    </View>
  
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d1f9ff',
    alignItems: 'center',
    justifyContent: 'center',
  
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardWide: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 1000,
    height: 500,
  },
  cardMobile: {
    width: '100%',
    maxWidth: 400,
  },
  leftSide: {
    flex: 1,
    backgroundColor: '#1a75ff',
    padding: 32,
    justifyContent: 'center',
  },
  leftSideMobile: {
    padding: 24,
  },
  leftContent: {
    alignItems: 'flex-start',
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  communityText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  signInButton: {
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  rightSide: {
    flex: 1,
    padding: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  rightSideMobile: {
    padding: 24,
  },
  rightContent: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  beOneText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#1a75ff',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
    marginBottom: 24,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  noAccountText: {
    color: '#666',
    fontSize: 14,
  },
  signupText: {
    color: '#1a75ff',
    fontSize: 14,
    fontWeight: '600',
  },
});

