import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function OAuthRedirectScreen() {
  const router = useRouter();

  useEffect(() => {
    // The AuthSession listener in AuthContext handles the actual token exchange.
    // This screen just gives the app a visual landing place instead of a 404 page.
    const timeout = setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
