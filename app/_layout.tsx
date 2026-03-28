import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold 
} from '@expo-google-fonts/dm-sans';
import AnimatedSplashScreen from '../src/components/common/AnimatedSplashScreen';
import { AuthProvider } from '../src/context/AuthContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load resources, make any API calls you need to do here
        // For now, we'll just simulate a short delay for a premium feel
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      // This tells the splash screen to hide immediately! 
      // The JS-side AnimatedSplashScreen will then handle the transition.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="chat" />
        </Stack>
        {!animationFinished && (
          <AnimatedSplashScreen 
            onAnimationComplete={() => setAnimationFinished(true)} 
          />
        )}
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

