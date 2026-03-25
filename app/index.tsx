import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Colors } from '../src/constants/Colors';
import { GoogleSignInButton } from '../src/components/auth/GoogleSignInButton';

const { width } = Dimensions.get('window');

export default function SignInScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/chat');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Decorative Background Elements */}
      <View style={[styles.shape, styles.shape1]} />
      <View style={[styles.shape, styles.shape2]} />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/Logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.title}>Nilababy</Text>
          <Text style={styles.subtitle}>Your AI parenting companion</Text>
        </View>

        <View style={styles.footer}>
          <GoogleSignInButton 
            onPress={handleGoogleSignIn} 
            isLoading={isLoading} 
          />
          <Text style={styles.terms}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    overflow: 'hidden',
  },
  shape: {
    position: 'absolute',
    borderRadius: 100,
  },
  shape1: {
    width: 300,
    height: 300,
    backgroundColor: 'rgba(170, 186, 248, 0.1)',
    top: -100,
    right: -100,
  },
  shape2: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(184, 168, 248, 0.1)',
    bottom: 50,
    left: -50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingVertical: 60,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.slate900,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.slate500,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    width: '100%',
  },
  terms: {
    fontSize: 12,
    color: Colors.slate400,
    marginTop: 24,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});
