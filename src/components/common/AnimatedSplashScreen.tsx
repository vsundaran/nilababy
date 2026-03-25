import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  runOnJS,
  Easing
} from 'react-native-reanimated';
import { Image } from 'expo-image';

interface AnimatedSplashScreenProps {
  onAnimationComplete: () => void;
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onAnimationComplete }) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Start exit animation after a short delay
    const timeout = setTimeout(() => {
      scale.value = withTiming(1.1, { 
        duration: 800, 
        easing: Easing.out(Easing.exp) 
      });
      opacity.value = withTiming(0, { 
        duration: 600, 
        easing: Easing.out(Easing.quad) 
      }, (finished) => {
        if (finished) {
          runOnJS(onAnimationComplete)();
        }
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <Image
          source={require('../../../assets/images/Logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default AnimatedSplashScreen;
