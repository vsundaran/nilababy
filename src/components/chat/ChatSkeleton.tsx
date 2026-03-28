import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Theme } from '../../constants/Theme';

interface SkeletonProps {
  darkMode?: boolean;
}

export const ChatSkeleton: React.FC<SkeletonProps> = ({ darkMode }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const baseStyle = {
    backgroundColor: darkMode ? '#3A3A3C' : '#E5E5EA',
    opacity,
  };

  return (
    <View style={styles.container}>
      {/* Simulation of User Message */}
      <View style={[styles.bubble, styles.userBubble]}>
        <Animated.View style={[styles.line, baseStyle, { width: '80%' }]} />
        <Animated.View style={[styles.line, baseStyle, { width: '60%' }]} />
      </View>

      {/* Simulation of AI Message */}
      <View style={[styles.bubble, styles.aiBubble]}>
        <Animated.View style={[styles.line, baseStyle, { width: '100%' }]} />
        <Animated.View style={[styles.line, baseStyle, { width: '90%' }]} />
        <Animated.View style={[styles.line, baseStyle, { width: '70%' }]} />
      </View>
      
      {/* Simulation of User Message 2 */}
      <View style={[styles.bubble, styles.userBubble]}>
        <Animated.View style={[styles.line, baseStyle, { width: '70%' }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    gap: 16,
  },
  bubble: {
    padding: 16,
    borderRadius: 20,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
  },
  line: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
});
